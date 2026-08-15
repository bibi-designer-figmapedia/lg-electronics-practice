import { cloneElement } from 'react'
import type { ReactElement, SVGProps } from 'react'

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
 *   단 하나의 예외가 close 다 — 아래 "close 를 stroke 로 되돌린 이유" 참고.
 *
 * 축소 렌더 시의 획 두께 — resizedTo prop (design-reviewer 6번 FAIL 대응)
 *   확인한 사실: Figma 에서 Icon/UI 인스턴스를 24 프레임에서 16 으로 리사이즈하면 path 는
 *   2/3 로 줄지만 stroke 두께는 그대로 남는다. Header/Notification 의 인스턴스
 *   19661:4096 · 19661:4100 을 get_design_context 로 읽어 확인했다 — 내려온 SVG 는
 *   글리프 상자가 6 곱하기 12 로 줄어든 채 stroke-width 가 여전히 1.5 다.
 *   반면 이 컴포넌트를 CSS 로 축소하면 stroke 까지 2/3 로 줄어 1.0 이 된다.
 *
 *   그래서 축소 렌더에서 Figma 와 같은 획을 그리려면 stroke 두께를 축소비의 역수로 미리
 *   키워 둬야 한다. resizedTo 를 준 호출부에서만 stroke-width 에 프레임 나누기 resizedTo 를
 *   곱한다 — 16 이면 1.5 배라서 1.5 인 획이 2.25 로 그려지고, 화면에서는 2/3 로 줄어 정확히
 *   1.5 가 된다.
 *
 *   버린 대안 — vector-effect non-scaling-stroke
 *     같은 목표를 한 줄로 달성하는 것처럼 보이지만 Chrome 은 이 획을 css 단위가 아니라
 *     기기 화소 단위로 그린다. 실제로 재어 보니 기기 배율 2 · 4 · 10 에서 잉크 면적이
 *     13.3 · 6.3 · 2.5 로 줄었다(같은 조건에서 다른 아이콘들은 전부 일정했다). 고해상도
 *     화면에서 오히려 더 얇아지므로 채택하지 않았다.
 *
 *   기본값으로 켜지 않는 이유는 축소 시 Figma 가 무엇을 정본으로 삼는지가
 *   호출부마다 다르기 때문이다:
 *     Header/Notification  Icon/UI 를 16 으로 리사이즈한 인스턴스   -> 획 유지가 맞다
 *     RightMenu            Foundation/Icon(19643:30975, 16 프레임,
 *                          획 1.5)이 정본이고 Crossup(획 2.25)의
 *                          2/3 축소가 우연히 그 값과 같다          -> 획도 같이 줄어야 맞다
 *   즉 이것은 아이콘의 성질이 아니라 호출부가 어떤 Figma 노드를 옮기는지의 문제다. 그래서
 *   opt-in prop 으로 두었다 — 넘기지 않은 호출부의 렌더는 한 픽셀도 달라지지 않는다.
 *   이 prop 은 크기를 정하지 않는다. 상자 크기는 지금까지처럼 호출부가 정하고, 여기서는
 *   stroke 두께만 보정한다.
 *
 *   적용 범위: 글리프의 루트 엘리먼트가 들고 있는 stroke-width 만 보정한다. 즉 루트가 곧
 *   stroke 를 가진 path 인 arrowLeft · arrowRight · Arrow · close 에만 효과가 있다.
 *   Crossup 은 위치 보정용 g 로 감싸여 있어 무시되고(위 표대로 켤 일이 없다), 나머지
 *   fill 글리프(bag · Search · guest)는 애초에 stroke 가 없다.
 *
 * close 를 stroke 로 되돌린 이유
 *   close 는 원래 fill 로 옮겨 왔던 탓에 위 보정이 닿지 않아 16 렌더에서만 2/3 로 얇았다
 *   (Figma 대비 잉크 면적 비 0.681 로 측정). fill 에는 두께라는 속성이 없어서다.
 *
 *   확인한 사실 — get_design_context 로 24 마스터(19655:33763)와 16 인스턴스(19661:4186)의
 *   Union path 를 둘 다 읽어 대조했다:
 *     24 마스터   Union 상자 20.1484 곱하기 20.1172
 *     16 인스턴스 Union 상자 14.4775 곱하기 14.4854 — 그런데 네 꼭짓점 부근 좌표
 *                 (2.34375 0.796875 · 1.5498 0 · 0.793945 2.42969)는 마스터와 같다
 *   즉 여기서도 Figma 는 막대 두께를 절대값으로 유지하고 대각선 길이만 줄인다. 셰브론의
 *   stroke 가 유지되는 것과 같은 메커니즘이다.
 *
 *   그래서 union outline 을 원래 무엇이었는지로 되돌렸다. outline 스무 점에서 읽은 것:
 *     마주 보는 두 긴 변 사이의 수직 거리가 네 곳 모두 2.251   -> 막대 두께 2.25
 *     네 꼭짓점의 캡이 축 방향으로 1.125 더 나간다             -> 사각 캡(두께의 절반)
 *     마주 보는 변끝 쌍의 중점 4개가 곧 막대 2개의 중심선 끝점
 *   그 끝점 4개를 16 인스턴스에서 같은 방법으로 구한 값과 대조하니 정확히 2/3 배였다
 *   (어긋남 0.004 미만). 그래서 중심선 2개를 stroke 로 그리면 resizedTo 보정이 셰브론과
 *   똑같이 걸린다.
 *
 *   남는 차이는 캡 면의 기울기 하나다. Figma 의 union 은 캡 면이 축과 정확히 직각이 아니라
 *   약 1.6도 기울어 있어(꼭짓점이 축 방향으로 0.031 앞뒤로 어긋난다) 사각 캡과 완전히
 *   포개지지는 않는다. 넓이는 같고(밑변 곱하기 높이가 같은 평행사변형 대 직사각형),
 *   어긋남은 24 렌더에서 0.031 · 16 렌더에서 0.021 로 화소 하나보다 작다 — 24 렌더를
 *   수정 전후로 재어 확인했다.
 *
 *   버린 대안 2개
 *     fill 을 확대하고 상쇄 변환으로 되돌리기 — 확대는 두께와 길이를 같이 키우므로 길이만
 *       원래대로 되돌릴 방법이 없다. union 은 두 축이 분리돼 있지 않다.
 *     16 프레임 전용 close 글리프를 따로 들이기 — 같은 아이콘이 두 벌이 된다. 위 방법이
 *       되므로 택하지 않았다.
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
  /**
   * Figma 에서 이 아이콘이 리사이즈된 프레임 크기. 넘기면 stroke 두께만 그 축소비만큼
   * 미리 키워, Figma 가 리사이즈 인스턴스에서 획을 유지하는 것과 같은 결과를 만든다.
   * 크기 자체는 바꾸지 않는다 — 상자 크기는 호출부가 정한다. 근거와 적용 범위는 위
   * "축소 렌더 시의 획 두께" 주석 참고. 넘기지 않으면 렌더가 지금까지와 동일하다.
   */
  resizedTo?: number
}

/** viewBox 한 변. Figma Icon/UI 의 프레임 크기이자 resizedTo 보정의 기준이다. */
const FRAME = 24

/** Figma variant 순서 그대로. label 은 위 "접근성" 주석의 규칙을 따른다. */
const UI_ICONS: Record<
  IconUIType,
  { label: string; glyph: ReactElement<SVGProps<SVGElement>> }
> = {
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
    /* 교차하는 막대 2개의 중심선. Figma 의 boolean union outline 에서 되읽은 값이며
       근거는 위 "close 를 stroke 로 되돌린 이유" 참고. 좌표에는 union 이 달고 있던
       배치 이동이 이미 반영돼 있다 — 루트가 path 여야 resizedTo 보정이 닿기 때문이다. */
    glyph: (
      <path
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        d="M3.4958 3.5463L20.3074 20.4183M20.5061 3.5643L3.6965 20.4359"
      />
    ),
  },
}

export function IconUI({ type = 'Arrow', className = '', resizedTo, ...props }: IconUIProps) {
  const { label, glyph } = UI_ICONS[type]

  // 루트가 stroke 를 들고 있는 글리프만 보정 대상이다 (위 "적용 범위" 참고).
  const baseStroke = glyph.props.strokeWidth
  const painted =
    resizedTo && baseStroke
      ? cloneElement(glyph, { strokeWidth: (Number(baseStroke) * FRAME) / resizedTo })
      : glyph

  return (
    <svg
      viewBox={`0 0 ${FRAME} ${FRAME}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`size-24 text-icon-default ${className}`}
      {...props}
    >
      {painted}
    </svg>
  )
}
