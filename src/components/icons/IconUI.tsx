import type { ReactNode, SVGProps } from 'react'

/*
 * Icon/UI — the 8 utility icons of the LG design system.
 *
 * Figma component set 1개 = 코드 컴포넌트 1개. 아이콘마다 파일을 쪼개지 않는다.
 *
 * Figma 원본 (산출물 1)
 *   component set:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33764
 *   type=arrowLeft: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33756
 *   type=arrowRight:https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33757
 *   type=bag:       https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33758
 *   type=Search:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33759
 *   type=Arrow:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33760
 *   type=Crossup:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33761
 *   type=guest:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33762
 *   type=close:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33763
 *
 * 토큰 매핑 (산출물 2) — get_variable_defs(19655:33764) 이 내준 변수는 icon/default
 * 하나뿐이다. 새 색 토큰을 만들지 않았다.
 *
 *   Figma 변수 / 값          코드 토큰               유틸리티
 *   icon/default             --color-icon-default    text-icon-default (+ fill/stroke currentColor)
 *   (변수 없음) 프레임 24     --spacing-24            size-24
 *
 *   프레임 크기는 Figma 변수에 바인딩돼 있지 않다 — 8개 variant 전부 고정 24 정사각
 *   프레임이고, 그 스텝이 이미 --spacing-24 로 존재하므로 그대로 참조한다.
 *
 * variant 이름 표기 규칙 (산출물 2 보조)
 *   Figma variant     type prop 값     변환
 *   type=arrowLeft    'arrowLeft'      그대로
 *   type=arrowRight   'arrowRight'     그대로
 *   type=bag          'bag'            그대로
 *   type=Search       'Search'         그대로 (대문자 시작 유지)
 *   type=Arrow        'Arrow'          그대로 (대문자 시작 유지)
 *   type=Crossup      'Crossup'        그대로 (대문자 시작 유지)
 *   type=guest        'guest'          그대로
 *   type=close        'close'          그대로
 *
 *   TS union 멤버는 식별자가 아니라 문자열 리터럴이므로 대문자로 시작하는 Figma 이름도
 *   그대로 쓸 수 있다. 즉 변환 규칙은 "무변환"이다 — camelCase 로 고치면 Figma 이름과
 *   코드 값이 갈라져 검색이 끊기므로 고치지 않았다.
 *
 * 지오메트리
 *   path 데이터는 get_design_context 가 내준 SVG 원본 그대로이며 다시 그리거나
 *   단순화하지 않았다. Figma 는 각 글리프를 24 프레임 안에서 절대 위치(또는 회전·미러
 *   변환)로 배치하는데, 원격 SVG URL 은 7일 뒤 만료되므로 그 배치를 최종 24 좌표계로
 *   계산해 옮겨 인라인했다. 회전·미러는 강체 변환이라 stroke 두께가 보존된다.
 *   좌표 · viewBox · stroke-width 같은 단위 없는 수치는 토큰 대상이 아니다.
 *
 * 중복 의심 — Arrow vs arrowRight (확인 결과)
 *   둘 다 오른쪽 chevron 이지만 동일하지 않다: Arrow 는 stroke 두께 2.25 에 가로
 *   7.5~16.5, arrowRight 는 stroke 두께 1.5 에 가로 9~18 이다. 두께와 위치가 모두
 *   다르므로 임의로 합치지 않고 원본대로 각각 구현했다.
 *
 * 접근성
 *   variant 별 aria-label 은 Figma 에 용도 주석이 없어 글리프 모양/이름을 그대로
 *   옮긴 것이다. 문맥이 있는 곳에서는 호출부가 aria-label 을 덮어써야 한다.
 *   장식용으로 쓸 때는 aria-hidden 을 넘긴다 — props 스프레드가 role/aria-label
 *   뒤에 오므로 둘 다 호출부에서 덮어쓸 수 있다.
 */

export type IconUIType =
  | 'arrowLeft'
  | 'arrowRight'
  | 'bag'
  | 'Search'
  | 'Arrow'
  | 'Crossup'
  | 'guest'
  | 'close'

export interface IconUIProps extends SVGProps<SVGSVGElement> {
  /** Which Figma variant to render. Matches the `type` property of Icon/UI. */
  type?: IconUIType
}

/** Figma variant 순서 그대로. label 은 위 "접근성" 주석의 규칙을 따른다. */
const UI_ICONS: Record<IconUIType, { label: string; glyph: ReactNode }> = {
  arrowLeft: {
    label: 'Arrow left',
    glyph: (
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        d="M17 3L8 12L17 21"
      />
    ),
  },
  arrowRight: {
    label: 'Arrow right',
    glyph: (
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        d="M9 3L18 12L9 21"
      />
    ),
  },
  bag: {
    label: 'Shopping bag',
    glyph: (
      <g transform="translate(2 2.4)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.873 3.97852C14.4002 1.66287 12.3635 0 10 0C7.63653 0 5.59977 1.66287 5.12695 3.97852L4.49934 7.05227H0V8.25148H0.950195L1.58105 15.4009C1.79037 17.7757 3.77911 19.5972 6.16309 19.5972H13.8369C16.2209 19.5972 18.2096 17.7757 18.4189 15.4009L19.0498 8.25148H20V7.05227H15.5007L14.873 3.97852ZM14.2758 7.05227L13.6973 4.21875C13.3386 2.46169 11.7933 1.19922 10 1.19922C8.20669 1.19922 6.66142 2.46169 6.30273 4.21875L5.72418 7.05227H14.2758ZM6.16309 18.397C4.40101 18.397 2.93108 17.0507 2.77637 15.2954L2.15527 8.25148H17.8447L17.2236 15.2954C17.0689 17.0507 15.599 18.397 13.8369 18.397H6.16309Z"
        />
      </g>
    ),
  },
  Search: {
    label: 'Search',
    glyph: (
      <g transform="translate(1.999 1.999)">
        <path
          fill="currentColor"
          d="M8.40527 0C13.0475 0 16.8113 3.76314 16.8115 8.40527C16.8115 10.435 16.0914 12.2963 14.8936 13.749L19.7881 18.7256C20.0781 19.0207 20.074 19.4957 19.7793 19.7861C19.484 20.0766 19.0082 20.0727 18.7178 19.7773L13.8389 14.8154C12.3732 16.059 10.4778 16.8115 8.40527 16.8115C3.76314 16.8113 0 13.0475 0 8.40527C0.000186828 3.76325 3.76325 0.000186824 8.40527 0ZM8.40527 1.5C4.59168 1.50019 1.50019 4.59168 1.5 8.40527C1.5 12.219 4.59156 15.3113 8.40527 15.3115C12.2191 15.3115 15.3115 12.2191 15.3115 8.40527C15.3113 4.59156 12.219 1.5 8.40527 1.5Z"
        />
      </g>
    ),
  },
  Arrow: {
    label: 'Arrow',
    glyph: (
      <path
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        d="M7.5 3L16.5 12L7.5 21"
      />
    ),
  },
  Crossup: {
    label: 'Arrow up right',
    glyph: (
      <g transform="translate(2.2044 1.875)">
        <path
          stroke="currentColor"
          strokeWidth="2.25"
          d="M0.795495 19.125L18.7955 1.125M18.7955 16.5536V1.125H3.36692"
        />
      </g>
    ),
  },
  guest: {
    label: 'Guest',
    glyph: (
      <g transform="translate(2 2)">
        <path
          fill="currentColor"
          d="M10.001 0C13.0064 0.000431841 15.4453 2.43242 15.4453 5.43555C15.4453 7.4016 14.399 9.1217 12.834 10.0762C16.9585 11.2427 19.998 14.888 19.998 19.2539L19.9941 19.3301C19.9558 19.7083 19.6364 20.0039 19.248 20.0039H0.75C0.361618 20.0039 0.0422369 19.7083 0.00390625 19.3301L0 19.2539L0.0126953 18.7578C0.232668 14.6139 3.19535 11.1977 7.16211 10.0752C5.59887 9.12027 4.55566 7.40008 4.55566 5.43555C4.5557 2.43216 6.99522 0 10.001 0ZM9.99902 11.1836C5.54096 11.1836 1.93555 14.4252 1.53809 18.5039H18.46C18.0625 14.4252 14.4571 11.1836 9.99902 11.1836ZM10.001 1.5C7.82082 1.5 6.0557 3.26341 6.05566 5.43555C6.05566 7.60771 7.8208 9.37109 10.001 9.37109C12.1808 9.37066 13.9453 7.60744 13.9453 5.43555C13.9453 3.26368 12.1808 1.50043 10.001 1.5Z"
        />
      </g>
    ),
  },
  close: {
    label: 'Close',
    glyph: (
      <g transform="translate(1.927 1.932)">
        <path
          fill="currentColor"
          d="M2.34375 0.797852L10.083 8.56445L17.8037 0.816406L18.5977 0.0195312L20.1484 1.65137L19.3545 2.44824L11.6709 10.1592L19.1553 17.6699L19.9492 18.4668L18.3994 20.0996L17.6055 19.3027L10.083 11.7529L2.54395 19.3203L1.75 20.1172L0.201172 18.4844L0.995117 17.6875L8.49512 10.1592L0.793945 2.43066L0 1.63379L1.5498 0L2.34375 0.797852Z"
        />
      </g>
    ),
  },
}

export function IconUI({ type = 'Arrow', className = '', ...props }: IconUIProps) {
  const { label, glyph } = UI_ICONS[type]

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`size-24 text-icon-default ${className}`}
      {...props}
    >
      {glyph}
    </svg>
  )
}
