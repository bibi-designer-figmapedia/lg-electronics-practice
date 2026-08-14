import type { SVGProps } from 'react'

/*
 * Logo/LG — the LG corporate logo (symbol mark + "LG" wordmark).
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-22
 *   Type=color:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-23
 *   Type=white:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-32
 *   Type=Black:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-41
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(1:22)로 읽었다.
 * 각 토큰의 실제 값은 docs/design-tokens.md 의 brand 표에 있다.
 *
 * 바인딩은 variant 노드별로 따로 읽었다 — component set(1:22)에 4개가 섞여 나오지만
 * 실제로는 variant마다 쓰는 변수가 다르다.
 *
 *   Figma 노드 / 변수                    코드 토큰                     유틸리티
 *   1:23 color   brand/logo              --color-brand-logo            fill-brand-logo
 *   1:23 color   brand/logo-inverse      --color-brand-logo-inverse    fill-brand-logo-inverse
 *   1:23 color   brand/secondary         --color-brand-secondary       fill-brand-secondary
 *   1:32 white   icon/white              --color-icon-white            text-icon-white
 *   1:41 Black   icon/default            --color-icon-default          text-icon-default
 *   아트워크 높이 64                      --spacing-64                  h-64
 *
 * 워드마크 회색은 예전에 Figma 변수가 없어 코드 전용 토큰(--color-brand-logo-wordmark)
 * 을 만들어 썼다. Figma가 이 값을 primitive `logo-gray` / semantic `brand/secondary`
 * 로 발행했으므로 그 변수명으로 교체했다.
 *
 * 크기: Figma 원본은 145.28 x 64. 높이만 토큰(`h-64`)으로 고정하고 너비는
 * `w-auto` + viewBox 비율로 따라오게 해서, 임의값 없이 원본 비율을 유지한다.
 * 다른 크기가 필요하면 className으로 높이를 덮어쓴다.
 *
 * path 데이터는 Figma에서 내려받은 SVG 그대로다. 다시 그리거나 단순화하지 않았다.
 */

export type LogoLGVariant = 'color' | 'white' | 'black'

export interface LogoLGProps extends SVGProps<SVGSVGElement> {
  /** Which Figma variant to render. Matches `Type=color` / `white` / `Black`. */
  variant?: LogoLGVariant
}

/*
 * white와 Black variant는 Figma에서 좌표가 소수점 이하 오차만 다른 동일 지오메트리라
 * path를 공유하고, 색만 currentColor로 갈아끼운다.
 */
const monoToneClasses: Record<Exclude<LogoLGVariant, 'color'>, string> = {
  white: 'text-icon-white',
  black: 'text-icon-default',
}

export function LogoLG({ variant = 'color', className = '', ...props }: LogoLGProps) {
  if (variant === 'color') {
    return (
      <svg
        viewBox="0 0 145.281 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="LG"
        className={`h-64 w-auto ${className}`}
        {...props}
      >
        <path
          className="fill-brand-logo"
          d="M32 64C49.6764 64 64 49.6629 64 31.9955C64 14.3281 49.6764 0 32 0C14.3236 0 0 14.3191 0 31.9955C0 49.6719 14.3281 64 32 64Z"
        />
        <path
          className="fill-brand-logo-inverse"
          d="M30.7313 17.952V46.0054H39.6451V43.506H33.2758V17.952H30.7313Z"
        />
        <path
          className="fill-brand-logo-inverse"
          d="M21.7859 25.6108C23.9082 25.6108 25.6287 23.8904 25.6287 21.7793C25.6287 19.6683 23.9082 17.9365 21.7859 17.9365C19.6635 17.9365 17.9543 19.657 17.9543 21.7793C17.9543 23.9017 19.6793 25.6108 21.7859 25.6108Z"
        />
        <path
          className="fill-brand-logo-inverse"
          d="M33.276 5.22277C32.9486 5.20923 32.3097 5.2002 32.0026 5.2002C17.2387 5.2002 5.22266 17.2208 5.22266 31.9914C5.22266 39.1464 8.00203 45.8679 13.0528 50.9255C18.1283 55.9875 24.8589 58.7691 32.0026 58.7691C39.1463 58.7691 45.8791 55.9852 50.9547 50.9255C56.0009 45.8679 58.7803 39.1487 58.7803 31.9914V30.7677L57.7123 30.7767H39.6656V33.2626H56.2402V33.6216C55.389 46.254 44.845 56.2674 32.0048 56.2674C25.5227 56.2674 19.4266 53.7432 14.8409 49.1598C10.2508 44.5742 7.72657 38.4736 7.72657 31.9892C7.72657 25.5047 10.2531 19.4018 14.8409 14.8207C19.4266 10.2261 25.5227 7.70411 32.0048 7.70411C32.2984 7.70411 32.987 7.71088 33.2783 7.71766V5.22277H33.276Z"
        />
        <path
          className="fill-brand-secondary"
          d="M87.8651 11.1356H78.3077V52.51H107.666V44.4542H87.8651V11.1356Z"
        />
        <path
          className="fill-brand-secondary"
          d="M128.693 36.7414H136.471V43.9732C135.042 44.5218 132.245 45.0705 129.583 45.0705C120.978 45.0705 118.109 40.6971 118.109 31.8216C118.109 22.9462 120.836 18.3718 129.441 18.3718C134.218 18.3718 136.952 19.8755 139.203 22.7407L145.148 17.2836C141.529 12.0928 135.175 10.5237 129.235 10.5237C115.853 10.5237 108.818 17.8277 108.818 31.7539C108.818 45.6801 115.167 53.1241 129.167 53.1241C135.582 53.1241 141.863 51.4872 145.281 49.0984V29.0264H128.691V36.7437L128.693 36.7414Z"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 145.28 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="LG"
      className={`h-64 w-auto ${monoToneClasses[variant]} ${className}`}
      {...props}
    >
      <path
        fill="currentColor"
        d="M32.002 0C14.3276 0 0 14.3194 0 31.9938C0 49.6683 14.3276 64 31.9979 64C49.6683 64 63.9959 49.6642 63.9959 31.9938C63.9959 14.3235 49.6765 0 32.002 0ZM39.6443 43.5044V46.0012H30.729V17.9496H33.2751V43.5044H39.6443ZM50.9536 50.9208C45.878 55.9841 39.1474 58.7642 32.002 58.7642C24.8567 58.7642 18.1303 55.98 13.0505 50.9208C7.99949 45.8615 5.21938 39.1433 5.21938 31.9897C5.22348 17.2186 17.2391 5.19884 32.002 5.19884C32.31 5.19884 32.9465 5.20706 33.2751 5.22348V7.71614C32.9835 7.70792 32.2977 7.70382 32.002 7.70382C25.5179 7.70382 19.4238 10.2252 14.8368 14.8204C10.2499 19.4033 7.72024 25.5014 7.72024 31.9897C7.72024 38.478 10.2457 44.5721 14.8368 49.1591C19.4238 53.7419 25.5179 56.2674 32.002 56.2674C44.8431 56.2674 55.3886 46.2517 56.2387 33.62V33.2586H39.6648V30.7742H57.7129L58.7806 30.766V31.9897C58.7806 39.1433 56.0005 45.8656 50.9536 50.9208ZM25.6287 21.7768C25.6287 23.8876 23.9081 25.6082 21.785 25.6082C19.662 25.6082 17.9537 23.8876 17.9537 21.7768C17.9537 19.6661 19.6784 17.9331 21.785 17.9331C23.8917 17.9331 25.6287 19.6538 25.6287 21.7768Z"
      />
      <path
        fill="currentColor"
        d="M87.8627 11.1367H78.3069V52.5098H107.664V44.4529H87.8627V11.1367Z"
      />
      <path
        fill="currentColor"
        d="M128.69 36.7414H136.468V43.9729C135.039 44.5191 132.242 45.0694 129.581 45.0694C120.978 45.0694 118.108 40.6959 118.108 31.8218C118.108 22.9476 120.834 18.3729 129.442 18.3729C134.221 18.3729 136.952 19.8759 139.203 22.7423L145.149 17.2847C141.527 12.0941 135.174 10.5254 129.236 10.5254C115.853 10.5254 108.819 17.8309 108.819 31.7561C108.819 45.6812 115.167 53.1263 129.166 53.1263C135.581 53.1263 141.864 51.4879 145.28 49.0979V29.0252H128.69V36.7414Z"
      />
    </svg>
  )
}
