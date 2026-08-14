import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

/*
 * Input — single-line text field with a size axis and a state axis.
 *
 * Figma 원본 (산출물 1)
 *   component frame: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19563-5289
 *   Size=md  variants: node-id=19563-5250 / 5252 / 5254 / 5256 / 5261
 *   Size=lg  variants: node-id=19637-2569 / 2571 / 2573 / 2575 / 2580
 *   (각 줄의 순서: default · selected · disabled · error · success)
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19563:5289)로 읽었다.
 * 실제 값은 raw로 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                        Figma 변수        코드 토큰                 유틸리티
 *   md 높이                     (변수 없음)       --spacing-44              h-44
 *   lg 높이                     (변수 없음)       --spacing-48              h-48
 *   좌우 padding                spacing/12        --spacing-12              px-12
 *   inputbox↔validation gap     spacing/8         --spacing-8               gap-8
 *   모서리 반경                 radius/12         --radius-12               rounded-12
 *   배경 (기본)                 bg/default        --color-bg-default        bg-bg-default
 *   배경 (disabled)             bg/subtle         --color-bg-subtle         bg-bg-subtle
 *   테두리 (default·success)    border/strong     --color-border-strong     border-border-strong
 *   테두리 (disabled)           border/default    --color-border-default    border-border-default
 *   테두리 (selected)           border/focus      --color-border-focus      border-border-focus
 *   테두리 (error)              state/error       --color-state-error       border-state-error
 *   텍스트 (기본)               text/primary      --color-text-primary      text-text-primary
 *   텍스트 (disabled)           text/disabled     --color-text-disabled     text-text-disabled
 *   메시지 (error)              state/error       --color-state-error       text-state-error
 *   메시지 (success)            state/success     --color-state-success     text-state-success
 *   value 타이포                body/default      type-body-default         type-body-default
 *   메시지 타이포               (바인딩 없음)     type-body-small           type-body-small
 *
 * 확정된 판단 3가지:
 *   - 좌우 padding 은 Figma 실측이 spacing/12 스텝에서 한 단계 벗어나지만, 새 스텝을
 *     만들지 않고 기존 spacing/12 를 재사용한다(원칙 2).
 *   - 너비는 컴포넌트가 정하지 않는다. `w-full` 로 부모가 정한 폭을 채운다.
 *   - success 의 테두리는 초록이 아니라 border/strong 이다. 초록은 메시지 텍스트뿐.
 *     Figma 원본(19637:2580 / 19563:5261)이 그렇게 그려져 있다.
 */

export type InputSize = 'md' | 'lg'
export type InputState = 'default' | 'selected' | 'disabled' | 'error' | 'success'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Figma 의 Size 축. */
  size?: InputSize
  /** Figma 의 State 축. `selected` 는 포커스된 모습을 정적으로 재현한다. */
  state?: InputState
  /** error · success 상태에서만 렌더되는 안내 문구. */
  validationMessage?: string
}

/* 높이만 size 로 갈린다 — padding · radius · 타이포는 두 사이즈가 같다. */
const sizeClasses: Record<InputSize, string> = {
  md: 'h-44',
  lg: 'h-48',
}

const stateClasses: Record<InputState, string> = {
  default: 'bg-bg-default border-border-strong text-text-primary',
  selected: 'bg-bg-default border-border-focus text-text-primary',
  disabled: 'bg-bg-subtle border-border-default text-text-disabled',
  error: 'bg-bg-default border-state-error text-text-primary',
  /* 테두리는 default 와 동일하다. 오타가 아니라 Figma 원본 그대로다. */
  success: 'bg-bg-default border-border-strong text-text-primary',
}

/* 메시지를 가진 state 만 여기 등재된다 — 등재 여부가 곧 렌더 조건이다. */
const messageClasses: Partial<Record<InputState, string>> = {
  error: 'text-state-error',
  success: 'text-state-success',
}

export function Input({
  size = 'md',
  state = 'default',
  validationMessage,
  className = '',
  disabled,
  id,
  ...props
}: InputProps) {
  const messageClass = messageClasses[state]
  /*
   * 접근성: 메시지는 시각적으로만이 아니라 접근성 트리에도 있어야 한다.
   * - 호출자가 id 를 주면 그것을 쓰고, 없으면 useId 로 만든다(새 유틸을 만들지 않는다).
   * - 메시지가 렌더될 때만 aria-describedby 를 건다 — 없는 id 를 가리키면 안 된다.
   * - aria-* 는 스프레드보다 앞에 둬서 호출자가 props 로 덮어쓸 수 있게 한다.
   * 새 prop 은 추가하지 않았다. 둘 다 state · validationMessage 에서 파생된다.
   */
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hasMessage = Boolean(messageClass && validationMessage)
  const messageId = hasMessage ? `${inputId}-validation` : undefined

  return (
    <div className="flex w-full flex-col gap-8">
      <input
        id={inputId}
        aria-invalid={state === 'error' ? true : undefined}
        aria-describedby={messageId}
        disabled={disabled || state === 'disabled'}
        className={`type-body-default w-full rounded-12 border px-12 ${sizeClasses[size]} ${stateClasses[state]} ${className}`}
        {...props}
      />
      {hasMessage ? (
        <p id={messageId} className={`type-body-small px-12 ${messageClass}`}>
          {validationMessage}
        </p>
      ) : null}
    </div>
  )
}
