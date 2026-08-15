import type { ButtonHTMLAttributes, ReactNode } from 'react'

/*
 * Button — Figma "Button/Web" 컴포넌트 세트의 구현체.
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-31393
 *   parent section "button": node-id=19586-12041
 *
 *   primary   enabled   sm 19676-24902 / md 19649-31392 / lg 19649-31387
 *   primary   hover     sm 19676-24914 / md 19649-31390 / lg 19649-31391
 *   primary   disabled  sm 19676-24917 / md 19649-31388 / lg 19649-31389
 *   secondary enabled   sm 19676-24905 / md 19649-31424 / lg 19649-31459
 *   secondary hover     sm 19676-24908 / md 19649-31429 / lg 19649-31462
 *   secondary disabled  sm 19676-24911 / md 19649-31439 / lg 19649-31465
 *   18개 variant 를 전부 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 *   세트의 속성은 4개다: size · state · type · trailingIcon. 코드의 prop 은 size ·
 *   variant(= Figma 의 type) · state · trailingIcon 4개다. state 는 enabled · hover 만
 *   받고, Figma 의 state=disabled 는 네이티브 disabled 속성이 담당한다.
 *   (이 문단은 갱신됐다 — 아래 "번복 이력" 절 참고.)
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19649:31393) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                            Figma 변수 / 실측      코드 토큰                      유틸리티
 *   좌우 padding                    spacing/16             --spacing-16                   px-16
 *   sm·md 상하 padding              spacing/12             --spacing-12                   py-12
 *   lg 상하 padding                 spacing/20             --spacing-20                   py-20
 *   라벨↔아이콘 간격                spacing/4              --spacing-4                    gap-4
 *   sm 높이                         변수 없음, 실측 44     --spacing-44                   h-44
 *   md 높이                         변수 없음, 실측 48     --spacing-48                   h-48
 *   lg 높이                         변수 없음, 실측 64     --spacing-64                   h-64
 *   아이콘 박스                     변수 없음, 실측 12     --spacing-12                   size-12
 *   최소 너비                       변수 없음, 실측 80     --spacing-80                   min-w-80
 *   테두리 굵기                     변수 없음, 실측 1      --border-width-hairline        border-hairline
 *   모서리 반경                     radius/8               --radius-8                     rounded-8
 *   라벨 타이포                     body/default-strong    type-body-default-strong       type-body-default-strong
 *   primary 배경 (enabled)          action/primary         --color-action-primary         bg-action-primary
 *   primary 라벨 (enabled)          text/inverse           --color-text-inverse           text-text-inverse
 *   primary 배경 (hover·disabled)   action/primary-label   --color-action-primary-label   bg-action-primary-label
 *   primary 테두리 (hover·disabled) border/strong          --color-border-strong          border-border-strong
 *   primary 라벨 (hover·disabled)   text/primary           --color-text-primary           text-text-primary
 *   primary 흐림 (disabled)         변수 없음, 불투명도 30  토큰 아님 (아래 주석 참고)    opacity-30
 *   secondary 배경 (enabled)        action/primary-label   --color-action-primary-label   bg-action-primary-label
 *   secondary 테두리 (enabled)      border/focus           --color-border-focus           border-border-focus
 *   secondary 라벨 (enabled)        text/primary           --color-text-primary           text-text-primary
 *   secondary 배경 (hover·disabled) action/secondary       --color-action-secondary       bg-action-secondary
 *   secondary 테두리 (hover)        border/strong          --color-border-strong          border-border-strong
 *   secondary 라벨 (hover)          text/secondary         --color-text-secondary         text-text-secondary
 *   secondary 테두리 (disabled)     border/default         --color-border-default         border-border-default
 *   secondary 라벨 (disabled)       text/disabled          --color-text-disabled          text-text-disabled
 *
 * Figma 에 변수가 없는 값 3가지 — 각각의 현재 처리
 *   - 최소 너비 80 — 해소됐다. token-guardian 이 --spacing-80 을 등재해 min-w-80 으로
 *     적용했다. 짧은 라벨("OK")에서만 발현되고, 기본 라벨은 콘텐츠 폭이 이미 80을 넘는다.
 *   - 최소 높이 36 — 18개 variant 프레임 전부에 걸린 제약이지만 높이가 44·48·64 로
 *     고정이라 절대 발현되지 않는 dead constraint 다. 그래서 토큰을 만들지 않기로
 *     결정됐고(의도적 미생성), 여기서도 적용하지 않는다.
 *   - 불투명도 30 (primary disabled) — Tailwind 내장 opacity-30 을 쓴다. 이것이 토큰이
 *     아니라는 점은 사실이고, 아래 두 근거로 축을 만들지 않기로 했다.
 *     (a) 내장 값이 정확히 30%로 1:1 대응한다. spacing 처럼 h-44 가 다른 값으로 조용히
 *         해석되는 실패 모드가 없어, 토큰화가 막아줄 사고 자체가 없다.
 *     (b) CLAUDE.md 목적 1의 위반 항목 표에 opacity 가 없다 — 색·간격·반경·타이포·
 *         테두리·그림자만 토큰 강제 대상이다.
 *
 * Figma 원본에서 확인된 이상한 점 3가지 — 임의로 보정하지 않고 그대로 옮겼다 (원칙 1)
 *   1. type=primary, state=hover 가 빨강 계열이 아니라 흰 배경 + border/strong +
 *      text/primary 다. 즉 hover 하면 secondary 처럼 보인다. sm·md·lg 3개가 모두
 *      동일하게 그려져 있어 단발 실수로 단정할 수 없다.
 *   2. 흰 배경이 두 변수로 갈려 있다. primary hover·disabled 와 secondary enabled 는
 *      action/primary-label 에, secondary hover·disabled 는 action/secondary 에
 *      바인딩돼 있다. 두 변수의 값은 같다.
 *   3. 코드에 이미 있는 --color-action-secondary-label · --color-action-secondary-border ·
 *      --color-action-disabled 는 이 컴포넌트 세트에서 하나도 쓰이지 않는다. Figma 는
 *      같은 자리에 text/primary · border/focus 를 바인딩했다.
 *
 * 확정된 구현 판단 4가지
 *   - state 는 prop 이 아니다. Figma 의 state=hover 는 hover: 유틸리티로, state=disabled
 *     는 네이티브 disabled 속성 + disabled: 유틸리티로 옮겼다(요청자 확정 사항).
 *     ↑ 이 항목은 번복됐다. 원문을 지우지 않고 남겨 둔다 — 아래 "번복 이력" 절이 현재
 *     상태다. state=hover 는 이제 prop 으로도 고정할 수 있다.
 *   - primary enabled 에는 Figma 상 테두리가 없지만 투명 테두리를 깔아 뒀다. 너비가 hug
 *     이라 hover 에서 테두리를 켜면 가로로 흔들리기 때문이다. transparent 는 색상값이
 *     아니라 키워드이므로 토큰 규칙의 대상이 아니다.
 *   - disabled:pointer-events-none — 브라우저는 disabled 버튼에도 :hover 를 적용한다.
 *     막지 않으면 disabled 위에 hover 스타일이 겹쳐 Figma 의 disabled 와 달라진다.
 *   - focus 링은 넣지 않았다. Figma 에 focus variant 가 없어 발명하지 않았고, 브라우저
 *     기본 포커스 표시에 맡긴다.
 *
 * 번복 이력 — state 축이 다시 prop 이 됐다
 *   위 "확정된 구현 판단" 1번(state 는 prop 이 아니다)은 번복됐다. 지금은 state prop 이
 *   있고 값은 'enabled' | 'hover' 2개다. 번복 근거 2가지:
 *
 *   (a) 상위 컴포넌트의 Figma 원본이 hover variant 인스턴스를 정적으로 배치한다.
 *       MainContentTitle 의 "Learn More" 인스턴스 19676-24957 · 19676-25012
 *         → size=sm, state=hover, type=secondary (19676-24908)
 *       ComponentTitle 의 Case=Button (19661-15712) 안 "Sign in"
 *         → size=lg, state=hover, type=secondary (19649-31462)
 *       마우스를 올려야 발현되는 hover: 유틸리티로는 이 정적 배치를 재현할 수 없다.
 *       그래서 두 자리의 테두리·라벨 색이 Figma 와 어긋났다(design-reviewer FAIL 6a:
 *       Figma 는 테두리 border/strong + 라벨 text/secondary, 코드는 테두리 border/focus +
 *       라벨 text/primary).
 *   (b) 요청자 결정 — 코드를 Figma 에 맞춘다.
 *
 *   disabled 는 state prop 에 넣지 않았다. 네이티브 disabled 속성이 이미 그 축을 담당하고
 *   있어, 같은 축에 경로가 2개 생기면 둘이 어긋난다.
 *
 *   state 기본값은 'enabled' 다. 기본값에서의 렌더 결과는 번복 전과 같은 클래스 집합이라
 *   기존 호출부의 동작이 바뀌지 않는다 — hover: · disabled: 유틸리티가 그대로 붙는다.
 *
 *   hover variant 의 값 자체는 재확인했다(원칙 1 — 기존 주석을 믿지 않고 다시 읽었다).
 *   get_metadata(19649:31393) 로 노드 ID ↔ variant 이름을, get_design_context 로
 *   19649-31459 · 19649-31462 · 19676-24905 · 19676-24908 · 19649-31390 의 실제 값을,
 *   get_variable_defs(19649:31393) 로 변수 정의를 확인했다. 위 토큰 매핑표와 일치했고
 *   고칠 항목은 없었다.
 */

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'
/* Figma state 축 3개 중 2개. disabled 는 네이티브 disabled 속성이 담당한다. */
export type ButtonState = 'enabled' | 'hover'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma 의 type 축. */
  variant?: ButtonVariant
  /** Figma 의 size 축. 높이와 상하 padding 만 바뀐다. */
  size?: ButtonSize
  /**
   * Figma 의 state 축. 기본값 'enabled' 는 hover 를 hover: 유틸리티에 맡기고,
   * 'hover' 는 Figma 의 hover variant 를 정적으로 고정한다 — 상위 컴포넌트가 hover
   * 인스턴스를 그대로 배치한 자리(MainContentTitle · ComponentTitle)를 위한 값이다.
   * 고정된 상태에서는 마우스를 올려도 더 변하지 않는다.
   */
  state?: ButtonState
  /** Figma 의 trailingIcon 속성. false 면 후행 chevron 만 빠지고 나머지는 그대로다. */
  trailingIcon?: boolean
  /** 버튼 라벨. */
  children: ReactNode
}

/* 높이·상하 padding 만 size 로 갈린다 — 좌우 padding·반경·타이포는 3사이즈가 같다. */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-44 py-12',
  md: 'h-48 py-12',
  lg: 'h-64 py-20',
}

/*
 * variant × state 외형. 두 줄의 관계가 이 파일에서 가장 헷갈리는 지점이라 명시한다.
 *   enabled — Figma 의 enabled variant 를 기본 외형으로 깔고, 그 위에 hover variant 를
 *             hover: 접두사로 얹는다. 즉 마우스를 올리면 아래 hover 줄과 같아진다.
 *   hover   — 같은 hover variant 를 접두사 없이 고정 적용한다. hover: 클래스를 아예 넣지
 *             않으므로 마우스를 올려도 변화가 없다. 이미 hover 외형이므로 그게 맞다.
 *
 * hover variant 의 색 3개가 접두사 붙은 형태와 안 붙은 형태로 두 번 적혀 있다. Tailwind v4
 * 는 소스 텍스트를 스캔해 유틸리티를 생성하므로 'hover:' + cls 처럼 코드로 조립하면 그
 * 클래스가 CSS 에 만들어지지 않는다. 그래서 중복은 의도된 것이고, 두 형태가 조용히
 * 어긋나지 않게 같은 객체 안에 붙여 둔다.
 */
const stateClasses: Record<ButtonVariant, Record<ButtonState, string>> = {
  primary: {
    enabled:
      'border-transparent bg-action-primary text-text-inverse hover:border-border-strong hover:bg-action-primary-label hover:text-text-primary',
    hover: 'border-border-strong bg-action-primary-label text-text-primary',
  },
  secondary: {
    enabled:
      'border-border-focus bg-action-primary-label text-text-primary hover:border-border-strong hover:bg-action-secondary hover:text-text-secondary',
    hover: 'border-border-strong bg-action-secondary text-text-secondary',
  },
}

/*
 * Figma 의 state=disabled. 네이티브 disabled 속성이 담당하는 축이라 state prop 과 무관하게
 * 항상 붙인다. disabled: 유틸리티는 클래스 + 의사클래스라 평범한 클래스보다 명시도가 높다 —
 * state="hover" 에 disabled 가 겹쳐도 disabled variant 가 이기므로, !important 없이도
 * 두 축이 충돌하지 않는다.
 */
const disabledClasses: Record<ButtonVariant, string> = {
  primary:
    'disabled:border-border-strong disabled:bg-action-primary-label disabled:text-text-primary disabled:opacity-30',
  secondary:
    'disabled:border-border-default disabled:bg-action-secondary disabled:text-text-disabled',
}

/*
 * 후행 chevron. Figma 세트의 trailingIcon 속성을 그대로 prop 으로 노출했고 기본값도
 * Figma 와 같은 true 다 — 요청받은 18개 variant 가 전부 아이콘을 달고 있다. 발명한
 * prop 이 아니라 세트에 실재하는 속성이라 구현 범위에 든다.
 *
 * icons/IconUI 의 arrowRight 재사용을 먼저 검토했으나 채택하지 않았다(원칙 2 조사 기록):
 * 같은 chevron 모양이지만 IconUI 는 24 뷰박스에 stroke 1.5 라 12 크기로 줄이면 stroke 가
 * 절반 두께로 렌더된다. Figma 의 버튼 아이콘은 12 박스에 stroke 1.5 다. 좌표는 Figma
 * 아이콘 프레임(안쪽 여백 2, 세로로 넘치는 배치)을 12 기준으로 환산한 값이다.
 *
 * 색은 currentColor — Figma 도 아이콘 색을 라벨 색과 같이 두었다(primary enabled 는
 * icon/white=text/inverse, 나머지는 라벨과 동일). 그래서 별도 색 클래스가 없다.
 */
function TrailingChevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="size-12 shrink-0"
    >
      <path
        d="M4 1.5L8.5 6L4 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )
}

/** Figma "Button/Web" 의 코드 정본. */
export function Button({
  variant = 'primary',
  size = 'md',
  state = 'enabled',
  trailingIcon = true,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`type-body-default-strong inline-flex min-w-80 items-center justify-center gap-4 rounded-8 border-hairline px-16 disabled:pointer-events-none ${sizeClasses[size]} ${stateClasses[variant][state]} ${disabledClasses[variant]} ${className}`}
      {...props}
    >
      {children}
      {trailingIcon ? <TrailingChevron /> : null}
    </button>
  )
}
