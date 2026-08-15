import { CheckBox } from './CheckBox'
import type { CheckBoxProps } from './CheckBox'

/*
 * CheckBoxSet — Figma "CheckBoxSet" 컴포넌트 세트의 구현체. CheckBox 인스턴스 + 라벨.
 *
 * Figma 원본 (산출물 1)
 *   component set:            https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19640-2825
 *   parent section "checkbox": node-id=19649-31594
 *
 *   Shape=Square, Size=Large   Default 19640-2771 / On 19640-2775 / Disabled 19640-2780 / SelectDisable 19640-2784
 *   Shape=Round,  Size=Large   Default 19640-2807 / On 19640-2811
 *
 *   6개 variant 를 전부 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * CheckBox 와의 관계 (의존성)
 *   이 세트의 6개 variant 는 전부 CheckBox 인스턴스를 품는다 — get_design_context 가
 *   내준 자식 노드 ID 가 I19640:2776;19640:2744 형태의 인스턴스 표기이고 자식 프레임
 *   이름이 CheckBox 다. 그래서 CheckBox 를 먼저 만들고 여기서 재사용한다. 박스의
 *   시각 토큰은 이 파일에 다시 적지 않는다 — 중복 정의가 곧 불일치다(원칙 2).
 *
 * Size 축을 노출하지 않는 이유
 *   Figma 의 이 세트에는 Size=Large 밖에 없다. Small 을 prop 으로 열면 Figma 에 원본이
 *   없는 조합을 코드가 발명하게 되므로 열지 않았다(원칙 1). CheckBox 의 기본값
 *   Size=Large 를 그대로 쓴다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19649:31594) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                              Figma 변수 / 실측     코드 토큰                유틸리티
 *   박스↔라벨 간격                    spacing/8             --spacing-8              gap-8
 *   라벨 타이포                       body/default          type-body-default        type-body-default
 *   라벨 색 (Default)                 text/primary          --color-text-primary     text-text-primary
 *   라벨 색 (On)                      text/brand            --color-text-brand       text-text-brand
 *   라벨 색 (Disabled·SelectDisable)  text/disabled         --color-text-disabled    text-text-disabled
 *   박스 일체                         (CheckBox 로 위임)    CheckBox.tsx 의 매핑표 참고
 *
 *   body/default 는 Figma 텍스트 스타일이다 — font-family/sans + font-size/16 +
 *   font-weight/regular + line-height 의 합성이라 변수 하나에 담기지 않고
 *   typography.tokens.css 의 @utility type-body-default 에 대응한다.
 *
 * 확정된 구현 판단 3가지
 *   - label 요소가 CheckBox 를 감싼다. 암묵적 연결이라 htmlFor/id 를 만들 필요가 없고
 *     라벨 텍스트 클릭으로 토글되며 접근 가능한 이름도 라벨 내용에서 자동으로 온다.
 *     CheckBox 에 새 prop 을 추가하지 않고 해결된다(원칙 2).
 *   - 라벨 색은 has-* 변형으로 CSS 에서 갈린다. checked/disabled 는 CheckBox 안쪽
 *     input 의 상태라 JS 로 읽으려면 상태를 위로 끌어올려야 하는데, 그러면 비제어
 *     사용에서 색이 따라오지 않는다. has-checked / has-disabled 는 제어·비제어 양쪽에서
 *     같게 동작한다.
 *   - SelectDisable(체크+비활성)에서 has-checked 와 has-disabled 가 동시에 걸린다.
 *     출력 순서에 맡기지 않기 위해 2단 변형 has-disabled:has-checked 를 함께 둔다 —
 *     선택자 명시도가 1단보다 높아 항상 이긴다. Figma 원본에서 SelectDisable 의 라벨은
 *     Disabled 와 같은 text/disabled 다.
 */

export interface CheckBoxSetProps extends Omit<CheckBoxProps, 'size' | 'className'> {
  /** 박스 오른쪽 라벨. Figma 원본의 기본 문구를 그대로 기본값으로 둔다. */
  label?: string
  /** 바깥 label 요소에 붙는 클래스. */
  className?: string
}

/** Figma "CheckBoxSet" 의 코드 정본. */
export function CheckBoxSet({ label = 'Check box', className = '', ...props }: CheckBoxSetProps) {
  return (
    <label
      className={[
        'inline-flex items-center gap-8',
        /* Default */
        'text-text-primary',
        /* On */
        'has-checked:text-text-brand',
        /* Disabled */
        'has-disabled:text-text-disabled',
        /* SelectDisable — Disabled 와 같은 색. 2단 변형이라 has-checked 를 이긴다. */
        'has-disabled:has-checked:text-text-disabled',
        className,
      ].join(' ')}
    >
      <CheckBox {...props} />
      <span className="type-body-default">{label}</span>
    </label>
  )
}
