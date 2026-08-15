import type { ReactNode, SVGProps } from 'react'

/*
 * Icon/Social — the 3 identity-provider marks used by the sign-in section.
 *
 * Icon/UI · Icon/PLP 와 같은 규칙: 아이콘 묶음 1개 = 코드 컴포넌트 1개.
 * 아이콘마다 파일을 쪼개지 않는다.
 *
 * Figma 원본 (산출물 1)
 *   parent section "sign-in": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16991
 *   name=apple    (ic:baseline-apple):         node-id=19661-15286
 *   name=google   (material-icon-theme:google): node-id=19661-15289
 *                 └ 안쪽 그룹 AuthIconGroup:    node-id=19661-15290
 *   name=facebook (gg:facebook):               node-id=19661-15296
 *
 *   Icon/UI · Icon/PLP 와 달리 이 3개는 Figma 컴포넌트 세트가 아니다. ButtonSocial
 *   (Figma "ListItem" 세트 19661:15301) 의 3개 variant 안에 각각 놓인 벡터 노드다.
 *   그래도 크기(18 정사각) · 역할 · 호출부가 하나로 묶여 있어 기존 아이콘 컨벤션대로
 *   name 축을 가진 컴포넌트 1개로 옮겼다. 새 패턴을 만들지 않았다(원칙 2).
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:16991) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                      Figma 변수 / 실측      코드 토큰                      유틸리티
 *   프레임 18                 변수 없음, 실측 18     --spacing-18                   size-18
 *   apple 글리프              icon/default           --color-icon-default           text-icon-default (fill currentColor)
 *   google 빨강 조각          변수 없음, raw 색      --color-brand-google-red       fill-brand-google-red
 *   google 노랑 조각          변수 없음, raw 색      --color-brand-google-yellow    fill-brand-google-yellow
 *   google 파랑 조각          변수 없음, raw 색      --color-brand-google-blue      fill-brand-google-blue
 *   google 초록 조각          변수 없음, raw 색      --color-brand-google-green     fill-brand-google-green
 *   facebook 글리프           변수 없음, raw 색      --color-brand-facebook         fill-brand-facebook
 *
 *   apple 만 Figma 변수(icon/default)에 바인딩돼 있다. google · facebook 의 5색은
 *   Figma 에서 변수 없이 직접 칠해진 벤더 색이라 token-guardian 이 brand-google-* ·
 *   brand-facebook 으로 등재했다. 이 파일은 그 토큰을 참조만 한다.
 *
 *   프레임 크기는 Figma 변수에 바인딩돼 있지 않다 — 3개 전부 고정 18 정사각이고 그
 *   스텝이 이미 --spacing-18 로 존재하므로 그대로 참조한다.
 *
 * 지오메트리
 *   path 데이터는 get_design_context 가 내준 SVG 원본 그대로이며 다시 그리거나
 *   단순화하지 않았다. 원격 SVG URL 은 7일 뒤 만료되므로 인라인했다.
 *   apple · facebook 은 18 프레임과 같은 좌표계라 무변환이고, google 만 안쪽 그룹이
 *   프레임 안에서 오프셋(왼쪽 7.81% · 위 6.25%)을 가진 채 배치돼 있어 그 값을 18
 *   좌표계로 환산해 translate 로 옮겼다. 좌표 · viewBox 같은 단위 없는 수치는 토큰
 *   대상이 아니다.
 *
 *   google 4조각의 opacity 는 Figma 원본 값 그대로다. 1에 가깝지만 임의로 지우지
 *   않았다 — 지우면 원본과 다른 그림이 된다(원칙 1). opacity 는 CLAUDE.md 목적 1의
 *   위반 항목 표에 없으므로 토큰 강제 대상이 아니다.
 *
 *   google 의 Figma 컨테이너에는 overflow clip 이 걸려 있지만 글리프가 프레임 안에
 *   완전히 들어가 잘리는 영역이 없다. Icon/PLP 의 BottomFreezer 와 같은 이유로
 *   옮기지 않았다 — id 충돌 위험만 남는다.
 *
 * 색 적용 방식이 apple 과 나머지 둘에서 다른 이유
 *   apple 은 단색이라 IconUI 처럼 svg 에 text-icon-default 를 걸고 path 는
 *   currentColor 를 따른다 — 호출부가 색을 덮어쓸 수 있다. google · facebook 은
 *   조각마다 색이 고정된 벤더 마크라 path 에 fill-* 유틸리티를 직접 건다. 벤더 마크의
 *   색을 호출부가 바꾸는 것은 허용해선 안 되는 동작이라(colors.tokens.css 의 해당
 *   블록 주석 참고) currentColor 를 쓰지 않았다.
 *
 * 접근성
 *   name 별 aria-label 은 제공자 이름이다. 버튼 안에서 쓸 때처럼 바깥에 접근 가능한
 *   이름이 이미 있으면 호출부가 aria-hidden 을 넘긴다 — props 스프레드가 role/aria-label
 *   뒤에 오므로 둘 다 호출부에서 덮어쓸 수 있다. ButtonSocial 이 그렇게 쓴다.
 */

export type IconSocialName = 'apple' | 'google' | 'facebook'

export interface IconSocialProps extends SVGProps<SVGSVGElement> {
  /** 어떤 제공자 마크를 그릴지. Figma 의 ListItem 세트 variant 이름과 같다. */
  name?: IconSocialName
}

/** viewBox 한 변. Figma 의 아이콘 프레임 크기다. */
const FRAME = 18

const SOCIAL_ICONS: Record<
  IconSocialName,
  { label: string; className: string; glyph: ReactNode }
> = {
  apple: {
    label: 'Apple',
    /* 단색 글리프 — 색은 currentColor 를 통해 이 클래스에서 온다. */
    className: 'text-icon-default',
    glyph: (
      <path
        fill="currentColor"
        d="M12.7876 15.21C12.0526 15.9225 11.2501 15.81 10.4776 15.4725C9.66012 15.1275 8.91012 15.1125 8.04762 15.4725C6.96762 15.9375 6.39762 15.8025 5.75262 15.21C2.09262 11.4375 2.63262 5.6925 6.78762 5.4825C7.80012 5.535 8.50512 6.0375 9.09762 6.0825C9.98262 5.9025 10.8301 5.385 11.7751 5.4525C12.9076 5.5425 13.7626 5.9925 14.3251 6.8025C11.9851 8.205 12.5401 11.2875 14.6851 12.15C14.2576 13.275 13.7026 14.3925 12.7801 15.2175L12.7876 15.21ZM9.02262 5.4375C8.91012 3.765 10.2676 2.385 11.8276 2.25C12.0451 4.185 10.0726 5.625 9.02262 5.4375Z"
      />
    ),
  },
  google: {
    label: 'Google',
    /* 조각마다 색이 고정이라 svg 레벨 색 클래스가 없다. */
    className: '',
    glyph: (
      <g transform="translate(1.4058 1.125)">
        <path
          className="fill-brand-google-red"
          opacity="0.987"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.70427 0.0683438C7.51989 -0.0227813 8.00252 -0.0227813 8.87889 0.0683438C10.4302 0.297951 11.8683 1.01501 12.9851 2.11584C12.2304 2.82925 11.4856 3.55307 10.7509 4.28709C9.34389 3.09459 7.77339 2.81934 6.03939 3.46134C4.76739 4.04634 3.88164 4.99434 3.38214 6.30534C2.56589 5.69765 1.76027 5.07581 0.965645 4.44009C0.910421 4.41103 0.847349 4.40038 0.785645 4.40972C2.04789 1.97597 4.02039 0.528469 6.70314 0.0672187"
        />
        <path
          className="fill-brand-google-yellow"
          opacity="0.997"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.783406 4.40984C0.847156 4.40009 0.907531 4.41021 0.964531 4.44021C1.75915 5.07593 2.56478 5.69777 3.38103 6.30546C3.25258 6.81628 3.17161 7.33787 3.13916 7.86359C3.16691 8.37209 3.24753 8.87121 3.38103 9.36096L0.844156 11.3803C-0.260594 9.07184 -0.280844 6.74834 0.783406 4.40984Z"
        />
        <path
          className="fill-brand-google-blue"
          opacity="0.999"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8649 13.8256C12.075 13.129 11.2481 12.4755 10.3877 11.8681C11.2502 11.2591 11.7737 10.4236 11.9582 9.36159H7.73157V6.42647C10.1691 6.40622 12.6054 6.42684 15.0407 6.48834C15.5027 8.99709 14.9691 11.2591 13.4398 13.2743C13.258 13.4676 13.0654 13.6516 12.8649 13.8256Z"
        />
        <path
          className="fill-brand-google-green"
          opacity="0.993"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.38111 9.36182C4.30361 11.6546 5.99486 12.7248 8.45486 12.5726C9.14543 12.4926 9.8075 12.2514 10.3876 11.8683C11.2486 12.4773 12.0744 13.1298 12.8649 13.8258C11.6123 14.9513 10.0154 15.6191 8.33449 15.7203C7.9526 15.7508 7.56888 15.7508 7.18699 15.7203C4.32349 15.3828 2.20924 13.9361 0.844238 11.3801L3.38111 9.36182Z"
        />
      </g>
    ),
  },
  facebook: {
    label: 'Facebook',
    className: '',
    glyph: (
      <path
        className="fill-brand-facebook"
        d="M6.89832 16.125H9.89832V10.1175H12.6013L12.8983 7.1325H9.89832V5.625C9.89832 5.42609 9.97734 5.23532 10.118 5.09467C10.2586 4.95402 10.4494 4.875 10.6483 4.875H12.8983V1.875H10.6483C9.65376 1.875 8.69993 2.27009 7.99667 2.97335C7.29341 3.67661 6.89832 4.63044 6.89832 5.625V7.1325H5.39832L5.10132 10.1175H6.89832V16.125Z"
      />
    ),
  },
}

/** Figma sign-in 섹션의 제공자 마크 3종. */
export function IconSocial({ name = 'apple', className = '', ...props }: IconSocialProps) {
  const { label, className: nameClass, glyph } = SOCIAL_ICONS[name]

  return (
    <svg
      viewBox={`0 0 ${FRAME} ${FRAME}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`size-18 ${nameClass} ${className}`}
      {...props}
    >
      {glyph}
    </svg>
  )
}
