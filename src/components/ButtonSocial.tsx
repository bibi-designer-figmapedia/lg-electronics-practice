import type { ButtonHTMLAttributes } from 'react'
import { IconSocial, type IconSocialName } from './icons/IconSocial'

/*
 * ButtonSocial — Figma "ListItem" 컴포넌트 세트의 구현체. 소셜 로그인 원형 버튼.
 *
 * Figma 원본 (산출물 1)
 *   component set:            https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15301
 *   parent section "sign-in": node-id=19661-16991
 *
 *   Property 1=apple    19661-15300
 *   Property 1=google   19661-15299
 *   Property 1=facebook 19661-15298
 *
 *   3개 variant 를 전부 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * 이름이 Figma 와 다른 이유
 *   Figma 의 세트 이름은 "ListItem" 이지만 코드에서는 ButtonSocial 로 둔다. 이 이름은
 *   호출부(FormSignIn)와 파일 위치를 정하는 요청 사항이었고, "ListItem" 은 목록 항목
 *   일반을 가리키는 이름이라 이 저장소의 다른 목록 컴포넌트와 충돌한다. Figma 원본
 *   추적은 위 노드 ID 로 유지된다.
 *
 * variant 축이 하나뿐인 이유
 *   Figma 세트의 속성은 Property 1 하나다 — hover · pressed · disabled 상태 축이
 *   원본에 없다. 없는 상태를 코드가 발명하면 Figma 에 정본이 없는 조합이 생기므로
 *   만들지 않았다(원칙 1 · 2). 상태가 필요해지면 Figma 에 먼저 그려야 한다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:16991) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                Figma 변수 / 실측     코드 토큰                   유틸리티
 *   버튼 크기           변수 없음, 실측 56    --spacing-56                size-56
 *   모서리 반경         radius/28             --radius-28                 rounded-28
 *   배경                bg/light              --color-bg-light            bg-bg-light
 *   테두리 색           bg/subtle             --color-bg-subtle           border-bg-subtle
 *   테두리 굵기         변수 없음, 실측 1     --border-width-hairline     border-hairline
 *   아이콘 일체         (IconSocial 로 위임)  IconSocial.tsx 의 매핑표 참고
 *
 *   3개 variant 는 배경 · 테두리 · 크기 · 반경이 전부 같다. 아이콘만 다르다 — 그래서
 *   variant 별 클래스 표가 없고 IconSocial 의 name 으로만 갈린다.
 *
 * Figma 원본에서 확인된 이상한 점 — 보정하지 않고 그대로 옮겼다 (원칙 1)
 *   테두리가 border/* 가 아니라 bg/subtle 에 바인딩돼 있다. 즉 배경 역할 토큰이 선
 *   색으로 쓰였다. 3개 variant 가 모두 동일하게 그려져 있어 단발 실수로 단정할 수 없고,
 *   임의로 border/default 로 바꾸면 코드가 Figma 와 다른 색을 그리게 된다. 원본 그대로
 *   bg/subtle 을 참조한다.
 *
 * 확정된 구현 판단 3가지
 *   - 시맨틱은 button 이고 type="button" 을 명시한다. 이 버튼들은 form(FormSignIn)
 *     안에 놓이는데, type 을 비우면 브라우저 기본값이 submit 이라 소셜 버튼이 이메일
 *     폼을 제출해 버린다.
 *   - 접근 가능한 이름은 aria-label 이다. 버튼 안에 텍스트가 없기 때문이다. 아이콘은
 *     aria-hidden 으로 접근성 트리에서 뺀다 — 이름을 두 번 읽지 않게 한다. aria-label 은
 *     스프레드보다 앞에 둬서 호출부가 문구를 덮어쓸 수 있다.
 *   - focus 링은 넣지 않았다. Figma 에 focus variant 가 없어 발명하지 않았고 브라우저
 *     기본 포커스 표시에 맡긴다 — Button.tsx 와 같은 판단이다.
 */

/** Figma 의 Property 1 축. 값은 Figma variant 이름 그대로다. */
export type ButtonSocialVariant = IconSocialName

export interface ButtonSocialProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma 의 Property 1 축. 어떤 제공자 버튼인지 정한다. */
  variant?: ButtonSocialVariant
}

/* 접근 가능한 이름. 아이콘만 있는 버튼이라 이것이 유일한 이름이다. */
const ARIA_LABELS: Record<ButtonSocialVariant, string> = {
  apple: 'Sign in with Apple',
  google: 'Sign in with Google',
  facebook: 'Sign in with Facebook',
}

/** Figma "ListItem"(소셜 로그인 버튼) 의 코드 정본. */
export function ButtonSocial({ variant = 'apple', className = '', ...props }: ButtonSocialProps) {
  return (
    <button
      type="button"
      aria-label={ARIA_LABELS[variant]}
      className={`inline-flex size-56 shrink-0 items-center justify-center rounded-28 border-hairline border-bg-subtle bg-bg-light ${className}`}
      {...props}
    >
      <IconSocial name={variant} aria-hidden="true" focusable="false" />
    </button>
  )
}
