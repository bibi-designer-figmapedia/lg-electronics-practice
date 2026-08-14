import type { ReactNode, SVGProps } from 'react'

/*
 * Icon/PLP — the 6 product-category icons used on the refrigerator PLP filters.
 *
 * Figma component set 1개 = 코드 컴포넌트 1개. 아이콘마다 파일을 쪼개지 않는다.
 *
 * Figma 원본 (산출물 1)
 *   component set:            https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19851
 *   Property 1=OneDoor:       https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19845
 *   Property 1=MultiDoor:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19846
 *   Property 1=Refrigerator:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19848
 *   Property 1=BottomFreezer: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19849
 *   Property 1=all:           https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19850
 *   Property 1=SideBySide:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19876
 *
 * 토큰 매핑 (산출물 2) — get_variable_defs(19661:19851) 이 내준 변수는 2개이고 값이
 * 같다: icon/default 와 그 뒤의 원시 변수 "Primary Color/Black". 둘 다 같은 검정으로
 * 해석되므로 역할 토큰 하나에 매핑했다. 새 색 토큰을 만들지 않았다.
 *
 *   Figma 변수 / 값             코드 토큰               유틸리티
 *   icon/default                --color-icon-default    text-icon-default (+ fill/stroke currentColor)
 *   Primary Color/Black         --color-icon-default    (동일 값 — 원시 변수라 별도 토큰 없음)
 *   (변수 없음) 프레임 64        --spacing-64            size-64
 *
 *   프레임 크기는 Figma 변수에 바인딩돼 있지 않다 — 6개 variant 전부 고정 64 정사각
 *   프레임이고, 그 스텝이 이미 --spacing-64 로 존재하므로 그대로 참조한다.
 *
 * variant 이름 표기 규칙 (산출물 2 보조)
 *   Figma variant              name prop 값        변환
 *   Property 1=OneDoor         'OneDoor'           그대로
 *   Property 1=MultiDoor       'MultiDoor'         그대로
 *   Property 1=Refrigerator    'Refrigerator'      그대로
 *   Property 1=BottomFreezer   'BottomFreezer'     그대로
 *   Property 1=all             'all'               그대로 (소문자 시작 유지)
 *   Property 1=SideBySide      'SideBySide'        그대로
 *
 *   값은 무변환이다. 다만 prop 이름은 Figma 의 property 이름 "Property 1" 을 그대로
 *   쓸 수 없어 (공백이 들어가 JSX prop 으로 못 쓴다) name 으로 뒀다. Icon/UI 쪽은
 *   property 이름이 type 이라 그대로 type 을 쓴다.
 *
 * 지오메트리
 *   path 데이터는 get_design_context 가 내준 SVG 원본 그대로이며 다시 그리거나
 *   단순화하지 않았다. 원격 SVG URL 은 7일 뒤 만료되므로 Figma 의 레이어 배치를 최종
 *   64 좌표계로 계산해 translate 로 옮겨 인라인했다. 좌표 · viewBox · stroke-width
 *   같은 단위 없는 수치는 토큰 대상이 아니다.
 *
 *   6개가 모두 단일 fill path 는 아니다 (확인 결과):
 *     all · Refrigerator · MultiDoor · OneDoor  단일 fill path
 *     BottomFreezer                             stroke path 4개
 *     SideBySide                                fill 2 + stroke 2, 총 4개 레이어
 *   BottomFreezer 원본에는 프레임과 정확히 같은 크기의 clipPath 가 걸려 있는데 잘라내는
 *   영역이 없어(획이 경계에 정확히 닿는다) 옮기지 않았다. id 충돌 위험만 남기 때문이다.
 *
 * 접근성
 *   variant 별 aria-label 은 Figma variant 이름을 사람이 읽는 형태로 옮긴 것이다.
 *   장식용으로 쓸 때는 aria-hidden 을 넘긴다 — props 스프레드가 role/aria-label 뒤에
 *   오므로 둘 다 호출부에서 덮어쓸 수 있다.
 */

export type IconPLPName =
  | 'OneDoor'
  | 'MultiDoor'
  | 'Refrigerator'
  | 'BottomFreezer'
  | 'all'
  | 'SideBySide'

export interface IconPLPProps extends SVGProps<SVGSVGElement> {
  /**
   * Which Figma variant to render. Figma 의 property 이름은 "Property 1" 이지만
   * 공백 때문에 JSX prop 으로 쓸 수 없어 코드에서는 `name` 으로 둔다.
   */
  name?: IconPLPName
}

const PLP_ICONS: Record<IconPLPName, { label: string; glyph: ReactNode }> = {
  OneDoor: {
    label: 'One door',
    glyph: (
      <g transform="translate(17 2)">
        <path
          fill="currentColor"
          d="M27.25 0C28.7688 0 30 1.23122 30 2.75V57.25C30 58.7688 28.7688 60 27.25 60H2.75C1.23122 60 0 58.7688 0 57.25V2.75C0 1.23122 1.23122 0 2.75 0H27.25ZM2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V57.25C1.5 57.9404 2.05964 58.5 2.75 58.5H27.25C27.9404 58.5 28.5 57.9404 28.5 57.25V2.75C28.5 2.05964 27.9404 1.5 27.25 1.5H2.75ZM4.75 20.1406C5.16421 20.1406 5.5 20.4764 5.5 20.8906V28.8906C5.5 29.3048 5.16421 29.6406 4.75 29.6406C4.33579 29.6406 4 29.3048 4 28.8906V20.8906C4 20.4764 4.33579 20.1406 4.75 20.1406Z"
        />
      </g>
    ),
  },
  MultiDoor: {
    label: 'Multi door',
    glyph: (
      <g transform="translate(14 2)">
        <path
          fill="currentColor"
          d="M33.25 0C34.7688 0 36 1.23122 36 2.75V57.25C36 58.7688 34.7688 60 33.25 60H2.75C1.23122 60 0 58.7688 0 57.25V2.75C0 1.23122 1.23122 0 2.75 0H33.25ZM1.5 57.25C1.5 57.9404 2.05964 58.5 2.75 58.5H16.998V33.5H1.5V57.25ZM18.498 58.5H33.25C33.9404 58.5 34.5 57.9404 34.5 57.25V33.5H18.498V58.5ZM2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V32H16.998V1.5H2.75ZM18.498 32H34.5V2.75C34.5 2.05964 33.9404 1.5 33.25 1.5H18.498V32ZM12.75 12C13.7165 12 14.5 12.7835 14.5 13.75V26.75C14.5 27.7165 13.7165 28.5 12.75 28.5H5.75C4.7835 28.5 4 27.7165 4 26.75V13.75C4 12.7835 4.7835 12 5.75 12H12.75ZM5.5 26.75C5.5 26.8881 5.61193 27 5.75 27H12.75C12.8881 27 13 26.8881 13 26.75V18.5H11.25V23H7.25V18.5H5.5V26.75ZM8.75 21.5H9.75V18.5H8.75V21.5ZM5.75 13.5C5.61193 13.5 5.5 13.6119 5.5 13.75V17H13V13.75C13 13.6119 12.8881 13.5 12.75 13.5H5.75Z"
        />
      </g>
    ),
  },
  Refrigerator: {
    label: 'Refrigerator',
    glyph: (
      <g transform="translate(19 2)">
        <path
          fill="currentColor"
          d="M22.75 0C24.2688 0 25.5 1.23122 25.5 2.75V57.25C25.5 58.7688 24.2688 60 22.75 60H2.75C1.23122 60 0 58.7688 0 57.25V2.75C0 1.23122 1.23122 0 2.75 0H22.75ZM24 22.9463C23.8646 23.1412 23.6401 23.2695 23.3848 23.2695H1.5V57.25C1.5 57.9404 2.05964 58.5 2.75 58.5H22.75C23.4404 58.5 24 57.9404 24 57.25V22.9463ZM1.5 21.7695H23.3848C23.6398 21.7695 23.8645 21.8973 24 22.0918V19.2695H1.5V21.7695ZM2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V17.7695H24V2.75C24 2.05964 23.4404 1.5 22.75 1.5H2.75Z"
        />
      </g>
    ),
  },
  BottomFreezer: {
    label: 'Bottom freezer',
    glyph: (
      <g transform="translate(17.75 2)" stroke="currentColor" strokeWidth="1.5">
        <path d="M25.75 0.75H2.75C1.64543 0.75 0.75 1.64543 0.75 2.75V57.25C0.75 58.3546 1.64543 59.25 2.75 59.25H25.75C26.8546 59.25 27.75 58.3546 27.75 57.25V2.75C27.75 1.64543 26.8546 0.75 25.75 0.75Z" />
        <path d="M0.75 36.52H27.75" />
        <path d="M7.25 40.52H21.25" strokeLinecap="round" />
        <path d="M4.75 8.91V27.91" strokeLinecap="round" />
      </g>
    ),
  },
  all: {
    label: 'All',
    glyph: (
      <g transform="translate(8 8)">
        <path
          fill="currentColor"
          d="M20 25.5312C21.1046 25.5312 22 26.4267 22 27.5312V45.999C22 47.0347 21.2128 47.887 20.2041 47.9893L20 47.999H2L1.7959 47.9893C0.78719 47.887 0 47.0347 0 45.999V27.5312C3.79623e-07 26.4267 0.895431 25.5313 2 25.5312H20ZM46 25.5312C47.1046 25.5312 48 26.4267 48 27.5312V45.999C48 47.0347 47.2128 47.887 46.2041 47.9893L46 47.999H28L27.7959 47.9893C26.7872 47.887 26 47.0347 26 45.999V27.5312C26 26.4267 26.8954 25.5313 28 25.5312H46ZM28 27.0312C27.7239 27.0312 27.5 27.2551 27.5 27.5312V45.999C27.5 46.2752 27.7239 46.499 28 46.499H46C46.2761 46.499 46.5 46.2752 46.5 45.999V27.5312C46.5 27.2551 46.2761 27.0312 46 27.0312H28ZM2 27.0312C1.72386 27.0312 1.5 27.2551 1.5 27.5312V45.999C1.5 46.2752 1.72386 46.499 2 46.499H20C20.2761 46.499 20.5 46.2752 20.5 45.999V27.5312C20.5 27.2551 20.2761 27.0312 20 27.0312H2ZM20 0C21.1046 0 22 0.895431 22 2V20.4678C22 21.5034 21.2128 22.3558 20.2041 22.458L20 22.4678H2L1.7959 22.458C0.78719 22.3558 0 21.5034 0 20.4678V2C3.79623e-07 0.895431 0.895431 3.22128e-08 2 0H20ZM46 0C47.1046 0 48 0.895431 48 2V20.4678C48 21.5034 47.2128 22.3558 46.2041 22.458L46 22.4678H28L27.7959 22.458C26.7872 22.3558 26 21.5034 26 20.4678V2C26 0.895431 26.8954 3.22128e-08 28 0H46ZM2 1.5C1.72386 1.5 1.5 1.72386 1.5 2V20.4678C1.5 20.7439 1.72386 20.9678 2 20.9678H20C20.2761 20.9678 20.5 20.7439 20.5 20.4678V2C20.5 1.72386 20.2761 1.5 20 1.5H2ZM28 1.5C27.7239 1.5 27.5 1.72386 27.5 2V20.4678C27.5 20.7439 27.7239 20.9678 28 20.9678H46C46.2761 20.9678 46.5 20.7439 46.5 20.4678V2C46.5 1.72386 46.2761 1.5 46 1.5H28Z"
        />
      </g>
    ),
  },
  SideBySide: {
    label: 'Side by side',
    glyph: (
      <>
        <g transform="translate(14 2)">
          <path
            fill="currentColor"
            d="M33.25 0C34.7688 0 36 1.23122 36 2.75V57.25C36 58.7688 34.7688 60 33.25 60H2.75C1.23122 60 0 58.7688 0 57.25V2.75C0 1.23122 1.23122 0 2.75 0H33.25ZM14.8096 58.5H33.25C33.9404 58.5 34.5 57.9404 34.5 57.25V2.75C34.5 2.05964 33.9404 1.5 33.25 1.5H14.8096V58.5ZM2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V57.25C1.5 57.9404 2.05964 58.5 2.75 58.5H13.3096V1.5H2.75Z"
          />
        </g>
        <g transform="translate(14.752 33.4772)">
          <path stroke="currentColor" strokeWidth="1.5" d="M0 0.75H34.4964" />
        </g>
        <g transform="translate(31.5 7.4)">
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1 0.75H13.498C13.6361 0.75 13.748 0.861929 13.748 1V21.168C13.748 21.306 13.6361 21.418 13.498 21.418H1C0.861929 21.418 0.75 21.306 0.75 21.168V1C0.75 0.861928 0.861928 0.75 1 0.75Z"
          />
        </g>
        <g transform="translate(17.24 16.37)">
          <path
            fill="currentColor"
            d="M6.84473 0C7.81113 0.000117244 8.59473 0.783574 8.59473 1.75V11.6396C8.59449 12.6059 7.81098 13.3895 6.84473 13.3896H1.75C0.783649 13.3896 0.000240134 12.6059 0 11.6396V1.75C6.44265e-07 0.783504 0.783501 0 1.75 0H6.84473ZM1.5 11.6396C1.50024 11.7775 1.61208 11.8896 1.75 11.8896H6.84473C6.98255 11.8895 7.09449 11.7774 7.09473 11.6396V5.46289H5.04688V8.63086C5.04688 9.04494 4.7109 9.38064 4.29688 9.38086C3.88266 9.38086 3.54688 9.04507 3.54688 8.63086V5.46289H1.5V11.6396ZM1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V3.96289H7.09473V1.75C7.09473 1.612 6.9827 1.50012 6.84473 1.5H1.75Z"
          />
        </g>
      </>
    ),
  },
}

export function IconPLP({ name = 'all', className = '', ...props }: IconPLPProps) {
  const { label, glyph } = PLP_ICONS[name]

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      className={`size-64 text-icon-default ${className}`}
      {...props}
    >
      {glyph}
    </svg>
  )
}
