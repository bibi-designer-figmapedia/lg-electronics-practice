import type { AnchorHTMLAttributes, ReactNode } from 'react'

/*
 * Tab — Figma "Tab" 컴포넌트 세트의 구현체. 헤더 네비게이션 항목 1개.
 *
 * Figma 원본 (산출물 1)
 *   component set:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31067
 *   state=default:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31066
 *   state=active:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31065
 *   variant 2개를 모두 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19643:31067) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                    Figma 변수 / 실측        코드 토큰                유틸리티
 *   라벨 타이포             nav/menu                 type-nav-menu            type-nav-menu
 *     (nav/menu 이 묶는 원자: font-family/sans · font-size/20 · font-weight/regular · 줄높이 24)
 *   라벨 색 (양쪽 state)    text/primary             --color-text-primary     text-text-primary
 *   밑줄 색                 brand/primary            --color-brand-primary    bg-brand-primary
 *   밑줄 두께               변수 없음, 실측 2        --spacing-underline      h-underline
 *   라벨↔밑줄 간격          변수 없음, 실측 2        --spacing-underline      gap-underline
 *
 * 매핑하지 못한 값 없음
 *   두께와 간격의 2 는 Figma 가 변수로 내보내지 않는다 — active variant 의
 *   get_variable_defs 는 text/primary · brand/primary · nav/menu 와 그 글꼴 원자만
 *   돌려준다. 즉 실측값이다. 숫자 spacing 스텝은 4 부터 시작해 2 에 해당하는 칸이 없고,
 *   대괄호 임의값도 `h-2` 표기(Tailwind 내장 스케일로 조용히 0.25rem 배수가 된다)도 쓸 수
 *   없어, token-guardian 이 역할 이름 --spacing-underline 을 src/tokens/spacing.tokens.css
 *   에 등재했다. 두께와 간격이 한 토큰을 공유하는 근거는 그 주석에 있다. 프레임 총 높이는
 *   Figma 와 같은 28(줄높이 24 + 간격 2 + 밑줄 2)이다.
 *
 * 확정된 구현 판단 3가지
 *   - 요소 종류: Figma 는 요소 종류를 정의하지 않는다. 헤더 네비게이션 항목이므로 a11y
 *     근거로 <a> 로 렌더하고, state=active 일 때 aria-current="page" 를 붙였다(요청자
 *     확정 사항). 링크 목적지는 호출부가 href 로 넘긴다.
 *   - state 는 prop 이다. Figma 의 active 는 hover 나 focus 가 아니라 "현재 페이지"라는
 *     외부 상태이므로 CSS 상태로 옮길 수 없다. 내부 state 는 두지 않았다.
 *   - default 에서 밑줄을 없애지 않고 opacity-0 으로 숨긴다. Figma 원본도 같은 사각형을
 *     불투명도 0 으로 두고 있고, 이래야 두 state 의 높이가 같아 전환 시 흔들리지 않는다.
 *
 * 확인한 것 vs 추정한 것
 *   라벨 색은 두 variant 모두 text/primary 다 — active 라고 라벨이 빨개지지 않는다.
 *   get_design_context 와 get_screenshot 양쪽에서 확인했다. 그 외 hover · focus · disabled
 *   variant 는 Figma 에 없어 발명하지 않았다.
 *
 * 포커스 표시 추가 (design-reviewer a11y FAIL 대응)
 *   근거: 빌드된 스타일시트에 :focus-visible 규칙이 하나도 없었고, --color-border-focus
 *   토큰이 어디에서도 포커스 표시로 쓰이지 않았다. Figma 에 focus variant 는 여전히 없으므로
 *   시각 표현을 발명하는 대신 이미 있는 토큰 2개만 조합했다:
 *     색   --color-border-focus     outline-border-focus
 *     두께 --border-width-hairline  outline-(length:--border-width-hairline)
 *   방식으로 ring(box-shadow) 이 아니라 outline 을 택한 이유: (a) outline 은 레이아웃을
 *   밀지 않으면서 강제 색 대비 모드에서도 유지된다, (b) 두께를 이 저장소에 실제로 있는
 *   토큰 변수로 직접 지정할 수 있다 — ring 두께는 이름 붙은 토큰을 받지 못하고 Tailwind
 *   내장 숫자 단계만 받는다. 같은 유틸리티 문자열을 HeaderNotification 도 쓴다.
 *   오프셋은 지정하지 않는다(CSS 초깃값 0). 오프셋에 해당하는 이름 붙은 토큰이 없어
 *   숫자를 근사하지 않았다.
 */

export type TabState = 'default' | 'active'

export interface TabProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Figma 의 state 축. */
  state?: TabState
  /** 탭 라벨. */
  children: ReactNode
}

/* 밑줄 사각형은 두 state 가 공유하고 가시성만 갈린다 (위 "확정된 구현 판단" 참고). */
const underlineStateClasses: Record<TabState, string> = {
  default: 'opacity-0',
  active: 'opacity-100',
}

/** Figma "Tab" 의 코드 정본. */
export function Tab({ state = 'default', className = '', children, ...props }: TabProps) {
  return (
    <a
      /* 포커스 표시: 위 블록 주석의 "포커스 표시 추가" 참고. HeaderNotification 의 아이콘
         버튼도 같은 문자열을 쓴다. CategoryMenu 는 이 Tab 을 렌더할 뿐 자체 초점 요소가
         없으므로 거기서 다시 지정하지 않는다. */
      className={`type-nav-menu inline-flex flex-col items-start gap-underline text-text-primary focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus ${className}`}
      aria-current={state === 'active' ? 'page' : undefined}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span
        aria-hidden="true"
        className={`h-underline w-full bg-brand-primary ${underlineStateClasses[state]}`}
      />
    </a>
  )
}
