import type { InputHTMLAttributes } from 'react'

/*
 * CheckBox — Figma "CheckBox" 컴포넌트 세트의 구현체.
 *
 * Figma 원본 (산출물 1)
 *   component set:            https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19640-2770
 *   parent section "checkbox": node-id=19649-31594
 *
 *   Shape=Square, Size=Large   Default 19640-2740 / On 19640-2742 / Disabled 19640-2745 / SelectDisable 19640-2747
 *   Shape=Square, Size=Small   Default 19640-2750 / On 19640-2752 / Disabled 19640-2755 / SelectDisable 19640-2757
 *   Shape=Round,  Size=Large   Default 19640-2760 / On 19640-2762
 *
 *   10개 variant 를 전부 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * Figma 미존재 조합 6개 — 이 세트는 희소 행렬이다
 *   Shape=Round, Size=Small  × Default · On · Disabled · SelectDisable   (4개)
 *   Shape=Round, Size=Large  × Disabled · SelectDisable                  (2개)
 *   shape 와 size 를 직교 prop 으로 두었으므로 이 6개도 렌더는 된다. 그 결과물은
 *   Figma 에 대응 원본이 없는 코드 쪽 외삽이므로 디자인 대조의 근거가 되지 못한다.
 *   story 의 AllVariants 는 실재하는 10개만 렌더한다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19649:31594) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                             Figma 변수 / 실측       코드 토큰                  유틸리티
 *   Large 박스                       변수 없음, 실측 20      --spacing-20               size-20
 *   Small 박스                       변수 없음, 실측 16      --spacing-16               size-16
 *   Square 모서리                    radius/4                --radius-4                 rounded-4
 *   Round 모서리                     radius/full             --radius-full              rounded-full
 *   테두리 두께                      변수 없음, 실측 hairline --border-width-hairline   border-hairline
 *   배경 (Default)                   bg/default              --color-bg-default         bg-bg-default
 *   테두리 (Default)                 border/focus            --color-border-focus       border-border-focus
 *   배경 (On)                        action/primary          --color-action-primary     bg-action-primary
 *   배경·테두리 (Disabled)           action/disabled         --color-action-disabled    bg/border-action-disabled
 *   배경 (SelectDisable)             action/disabled         --color-action-disabled    bg-action-disabled
 *   체크마크                         icon/white              --color-icon-white         text-icon-white
 *
 *   Figma 원본의 바인딩 불일치 2건 — 값은 같고 이름만 갈린다. action/* 계열로 통일했다.
 *     테두리: 이 세트는 text/primary 에, CheckBoxSet 안의 인스턴스는 border/focus 에
 *             바인딩돼 있다. 코드는 --color-border-focus 하나만 쓴다.
 *     On 배경: 이 세트는 brand/primary 에, CheckBoxSet 안의 인스턴스는 action/primary 에
 *             바인딩돼 있다. 코드는 --color-action-primary 하나만 쓴다.
 *     action/* 를 택한 이유는 colors.tokens.css 가 그 그룹을 "interactive elements" 로
 *     정의하고 있고 체크박스가 거기 해당하기 때문이다. 값이 같으므로 렌더 결과는 동일하다.
 *
 * 확정된 구현 판단 5가지
 *   - State 는 prop 이 아니다. Figma 의 State 4개가 checked × disabled 2×2 로 정확히
 *     분해된다: Default=미체크+활성 / On=체크+활성 / Disabled=미체크+비활성 /
 *     SelectDisable=체크+비활성. state prop 을 두면 네이티브 상태와 이중 정의가 된다.
 *     Button.tsx 가 hover·disabled 를 같은 방식으로 처리한 선례를 따른다.
 *   - 네이티브 input 이 박스 자체다. appearance-none 으로 기본 렌더를 끄고 토큰
 *     유틸리티로 다시 그린다. 숨긴 input + 가짜 박스 조합보다 클릭·포커스·폼 제출이
 *     전부 공짜로 따라온다.
 *   - 상태 클래스는 enabled: / disabled: 로 갈라 겹치지 않게 썼다. checked 와 disabled
 *     가 동시에 걸리는 SelectDisable 에서 어느 규칙이 이길지를 CSS 출력 순서에
 *     맡기지 않기 위해서다 — 2단 변형이 1단보다 선택자 명시도가 높아 항상 이긴다.
 *   - Disabled 는 채움과 같은 색 테두리가 있고 SelectDisable 은 테두리가 없다. 두 색이
 *     같아 화면상 차이는 없지만 Figma 원본이 그렇게 그려져 있어 그대로 옮겼다.
 *     (렌더 PNG 픽셀을 직접 샘플링해 두 채움색이 동일함을 확인했다.)
 *   - focus 링은 넣지 않았다. Figma 에 focus variant 가 없어 발명하지 않았고 브라우저
 *     기본 포커스 표시에 맡긴다. Button.tsx 와 같은 결정이다.
 */

export type CheckBoxShape = 'square' | 'round'
export type CheckBoxSize = 'large' | 'small'

export interface CheckBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Figma 의 Shape 축. */
  shape?: CheckBoxShape
  /** Figma 의 Size 축. Round × Small 은 Figma 에 없다 — 위 주석 참고. */
  size?: CheckBoxSize
  /** 바깥 래퍼에 붙는 클래스. input 자체가 아니라 컴포넌트의 박스에 적용된다. */
  className?: string
}

const sizeClasses: Record<CheckBoxSize, string> = {
  large: 'size-20',
  small: 'size-16',
}

const shapeClasses: Record<CheckBoxShape, string> = {
  square: 'rounded-4',
  round: 'rounded-full',
}

/*
 * 체크마크 지오메트리.
 *
 * icons/IconUI 재사용을 먼저 검토했으나 채택할 수 없었다(원칙 2 조사 기록): 그 세트의
 * 8개 글리프(arrowLeft · arrowRight · bag · Search · Arrow · Crossup · guest · close)에
 * 체크마크가 없다. IconPLP · IconBenefit 도 마찬가지다. 그래서 Button.tsx 의
 * TrailingChevron 선례대로 이 파일 안에 인라인한다.
 *
 * 좌표는 get_design_context 가 내준 원격 SVG 3개를 받아 박스 좌표계로 환산한 값이다.
 * Figma 는 체크마크를 박스 안에 절대 위치로 배치하고 stroke 가 프레임 밖으로 넘치는
 * 만큼 음수 inset 을 주는데, 원격 URL 은 7일 뒤 만료되므로 그 배치를 최종 20 / 16
 * 좌표계로 계산해 옮겼다. 세 경우 모두 오프셋이 정수로 떨어져 환산이 맞음이 확인된다.
 * 좌표 · viewBox · stroke-width 같은 단위 없는 수치는 토큰 대상이 아니다(IconUI 선례).
 */
type CheckMarkGeometry = { viewBox: string; d: string; strokeWidth: string }

const CHECK_MARKS: Record<CheckBoxShape, Record<CheckBoxSize, CheckMarkGeometry>> = {
  square: {
    large: { viewBox: '0 0 20 20', d: 'M4 10L7.73334 14L15.2 6', strokeWidth: '2' },
    small: { viewBox: '0 0 16 16', d: 'M5.2 8L7.06667 10L10.8 6', strokeWidth: '1.5' },
  },
  round: {
    large: { viewBox: '0 0 20 20', d: 'M5 9.64286L8.4 13.28572L15.2 6', strokeWidth: '2' },
    /* Figma 미존재 조합. Square Small 의 지오메트리를 그대로 쓴다 — Round Large 가
       Square Large 보다 안쪽으로 들어간 만큼을 Small 에서 추정해 새로 그리는 것은
       Figma 에 없는 값을 발명하는 일이다(원칙 1). */
    small: { viewBox: '0 0 16 16', d: 'M5.2 8L7.06667 10L10.8 6', strokeWidth: '1.5' },
  },
}

/** Figma "CheckBox" 의 코드 정본. */
export function CheckBox({
  shape = 'square',
  size = 'large',
  className = '',
  ...props
}: CheckBoxProps) {
  const box = sizeClasses[size]
  const mark = CHECK_MARKS[shape][size]

  return (
    <span className={`relative inline-flex shrink-0 ${box} ${className}`}>
      <input
        type="checkbox"
        className={[
          'peer m-0 cursor-pointer appearance-none border-hairline',
          box,
          shapeClasses[shape],
          /* Default */
          'enabled:border-border-focus enabled:bg-bg-default',
          /* On — 채움만 남기고 테두리를 끈다. transparent 는 색상값이 아니라 키워드다. */
          'enabled:checked:border-transparent enabled:checked:bg-action-primary',
          /* Disabled — 채움과 같은 색 테두리 */
          'disabled:cursor-not-allowed disabled:border-action-disabled disabled:bg-action-disabled',
          /* SelectDisable — 채움은 Disabled 와 같고 테두리만 없다 */
          'disabled:checked:border-transparent',
        ].join(' ')}
        {...props}
      />
      <svg
        viewBox={mark.viewBox}
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 hidden size-full text-icon-white peer-checked:block"
      >
        <path
          d={mark.d}
          stroke="currentColor"
          strokeWidth={mark.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
