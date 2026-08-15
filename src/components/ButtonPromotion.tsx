import type { ButtonHTMLAttributes, ReactNode } from 'react'

/*
 * ButtonPromotion — Figma "Button/Promotion" 컴포넌트 세트의 구현체.
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-15
 *   parent section "button": node-id=19586-12041
 *
 *   color=Red (default)  node-id=1-16   (라벨 1-17)
 *   color=Black          node-id=1-18   (라벨 1-19)
 *   color=White          node-id=1-20   (라벨 1-21)
 *   3개 variant 를 get_metadata · get_design_context · get_variable_defs 로 읽었다.
 *   추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(1:15) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                    Figma 변수 / 실측     코드 토큰                      유틸리티
 *   높이                    변수 없음, 실측       --spacing-78                   h-78
 *   좌우 padding            변수 없음, 실측       --spacing-36                   px-36
 *   상하 padding            변수 없음, 실측       --spacing-20                   py-20
 *   모서리 반경             변수 없음, 실측       --radius-16                    rounded-16
 *   라벨 최대 높이          변수 없음, 실측       --spacing-32                   max-h-32
 *   라벨 타이포             바인딩 없음           type-cta-large                 type-cta-large
 *   red 배경                action/promo          --color-action-promo           bg-action-promo
 *   black 배경              action/secondary-label --color-action-secondary-label bg-action-secondary-label
 *   white 배경              action/primary-label  --color-action-primary-label   bg-action-primary-label
 *   red·black 라벨          text/inverse          --color-text-inverse           text-text-inverse
 *   white 라벨              border/focus          --color-border-focus           text-border-focus
 *
 * 신규 토큰 4건은 token-guardian 이 src/tokens/ 에 등재했다(그 디렉터리는 배타 범위라
 * 여기서 만들지 않았다): --spacing-78 · --spacing-36 · --radius-16 · type-cta-large.
 *
 * 확정된 구현 판단 4가지
 *   - 너비는 컴포넌트가 정하지 않는다. Figma 프레임이 hug 이고 get_design_context 도
 *     width 클래스를 내지 않는다. 세트에 보이는 가로 크기는 기본 라벨의 hug 결과값이지
 *     고정폭이 아니므로, 그에 대응하는 토큰을 만들지 않고 콘텐츠 너비에 맡긴다.
 *   - hover 는 없다. Figma variant 축이 color 하나뿐이고 상호작용 variant 가 없다.
 *     Button/Web 과 달리 옮길 hover 디자인이 없어 hover: 유틸리티를 발명하지 않았다.
 *   - state prop 을 만들지 않았다(요청자 확정 사항). 위와 같은 이유로 옮길 상태가 없다.
 *   - white 배경은 흰 지면에서 경계가 사라지지만 Figma 에 테두리가 없다. 임의로
 *     넣지 않고 원본 그대로 두었다 — 대비는 story 의 배경 decorator 로 확인한다.
 *
 * 라벨 타이포가 type-cta-large 인 근거: Figma 에 대응하는 텍스트 스타일이 없다.
 * get_variable_defs(1:15) 가 스타일 항목을 반환하지 않는다(같은 호출이 Button/Text 에서는
 * subtitle/medium-strong 을 반환한다). 그래서 기존 type-cta-medium(Figma cta/medium)의
 * 형제로 역할 기반 명명했다. 규칙상 text-* · font-* 로 쪼개 쓰지 않고 합성 유틸리티
 * 하나로 쓴다.
 *
 * 폰트 패밀리 재편 후 같은 호출을 다시 돌렸고 답은 그대로다 — 색상 5개뿐이고 패밀리
 * 항목이 없다. 즉 이 라벨의 패밀리는 Figma 판독이 아니라 코드 결정이다. type-cta-large
 * 는 --font-text 를 쓰며, 근거는 typography.tokens.css 의 해당 유틸리티 주석에 있다.
 * Figma 가 이 라벨에 스타일을 공개하면 그 값을 따른다.
 */

export type ButtonPromotionColor = 'red' | 'black' | 'white'

export interface ButtonPromotionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma 의 color 축. Figma 표기가 "Red (default)" 이므로 기본값은 red 다. */
  color?: ButtonPromotionColor
  /** 버튼 라벨. */
  children: ReactNode
}

/* 배경과 라벨 색만 color 로 갈린다 — 크기·padding·반경·타이포는 3색이 같다. */
const colorClasses: Record<ButtonPromotionColor, string> = {
  red: 'bg-action-promo text-text-inverse',
  black: 'bg-action-secondary-label text-text-inverse',
  /* 흰 배경에서만 라벨이 검정으로 뒤집힌다. Figma 는 이 자리에 text/primary 가 아니라
     border/focus 를 바인딩해 두었다 — 오타가 아니라 원본 그대로다. */
  white: 'bg-action-primary-label text-border-focus',
}

/** Figma "Button/Promotion" 의 코드 정본. */
export function ButtonPromotion({
  color = 'red',
  className = '',
  children,
  ...props
}: ButtonPromotionProps) {
  return (
    <button
      className={`type-cta-large inline-flex items-center justify-center rounded-16 h-78 px-36 py-20 ${colorClasses[color]} ${className}`}
      {...props}
    >
      {/* Figma 라벨 노드의 클램프 그대로: 한 줄 유지 + 최대 높이 초과분은 말줄임. */}
      <span className="max-h-32 overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </button>
  )
}
