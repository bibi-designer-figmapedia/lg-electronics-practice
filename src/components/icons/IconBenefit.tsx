import type { SVGProps } from 'react'
import type { BenefitIconName } from './IconBenefit.names'
import {
  BENEFIT_LINE_STROKE_WIDTH,
  BENEFIT_LINE_VIEWBOX,
  benefitLinePaths,
} from './IconBenefit.linePaths'
import {
  BENEFIT_SOLID_BACKGROUND_OPACITY,
  BENEFIT_SOLID_GLYPH_FILL_RULE,
  benefitSolidBackgroundPath,
  benefitSolidGlyphPaths,
  benefitSolidGlyphTransforms,
} from './IconBenefit.solidPaths'

/*
 * Icon/Benefit — 혜택 아이콘 36종 x 4 Type = 144 variant.
 *
 * Figma component set 1개 = 코드 컴포넌트 1개. 아이콘마다 파일을 쪼개지 않는다.
 * 지오메트리는 이 파일에 없다 — 데이터 모듈 3개에서 가져온다.
 *
 * ── Figma 원본 (산출물 1) ──
 *
 *   component set  Icon/Benefit
 *   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23774
 *
 *   Type 별 앵커 노드 (welcomeCoupon variant 4개 — IconBenefit.names.ts 의
 *   "철자 불일치" 표에서 4개 Type 노드 ID 가 전부 확인된 유일한 아이콘이라 대표로 쓴다)
 *     Type=Line black   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23791
 *     Type=Line white   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23863
 *     Type=Solid black  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23943
 *     Type=Solid white  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-24042
 *
 *   아이콘 36개 각각의 노드 ID 는 데이터 모듈 주석에 있다:
 *   Line 계열 -> IconBenefit.linePaths.ts, Solid 계열 -> IconBenefit.solidPaths.ts.
 *
 * ── 토큰 매핑 (산출물 2) ──
 *
 *   get_variable_defs(19620:23774) 가 내준 변수는 2개뿐이다. 새 토큰을 만들지 않았다.
 *
 *   Figma 변수 / 값        코드 토큰                유틸리티              쓰이는 곳
 *   icon/default           --color-icon-default     text-icon-default     Line black 획
 *                                                   fill-icon-default     Solid 배경/글리프
 *   icon/white             --color-icon-white       text-icon-white       Line white 획
 *                                                   fill-icon-white       Solid 배경/글리프
 *   (변수 없음) 프레임      --spacing-96             size-96               svg 크기
 *
 *   프레임 크기는 Figma 변수에 바인딩돼 있지 않다 — 144개 variant 전부 고정 정사각
 *   프레임이고 그 스텝이 --spacing-96 으로 이미 존재하므로 그대로 참조한다.
 *
 *   Type 별 색 조합 (Figma 원본 그대로)
 *     Line black    획 icon/default
 *     Line white    획 icon/white
 *     Solid black   배경 icon/default + 글리프 icon/white
 *     Solid white   배경 icon/white   + 글리프 icon/default
 *
 *   배경 레이어의 불투명도는 색 토큰이 아니라 Figma 레이어 속성이므로
 *   BENEFIT_SOLID_BACKGROUND_OPACITY 로 데이터 모듈에서 가져온다.
 *
 * ── Figma Type 값 <-> 코드 prop 값 (산출물 2 보조) ──
 *
 *   Figma Type      type prop        변환
 *   Line black      'lineBlack'      공백 제거 + camelCase
 *   Line white      'lineWhite'      공백 제거 + camelCase
 *   Solid black     'solidBlack'     공백 제거 + camelCase
 *   Solid white     'solidWhite'     공백 제거 + camelCase
 *
 *   Figma 원본값에 공백이 있어 그대로 쓸 수 없다. 위 4줄이 원본과 코드값을 잇는
 *   유일한 연결이므로 이름을 바꾸려면 이 표도 같이 고쳐야 한다.
 *
 * ── 두 데이터 모듈의 API 가 다른 이유 (통일하지 말 것) ──
 *
 *   linePaths  = 구조체 { transform, paths: [{ d, fillRule, stroked? }] }
 *   solidPaths = 평면   { 배경 d 1개, 글리프 d 레코드, transform 레코드, 전역 fill-rule }
 *
 *   비대칭은 실수가 아니라 각 아트워크의 최소 구조다.
 *   1. Line 은 한 글리프가 여러 path 로 쪼개져 있고 path 마다 fill-rule 이 다르다
 *      (evenodd 64개 / nonzero 74개). 전역 rule 하나로 칠하면 구멍이 잘못 뚫린다.
 *      또 delivery / fastDelivery 2개는 fill 위에 stroke 가 더 걸려 있어 path 단위
 *      플래그가 필요하다.
 *   2. Solid 는 아이콘당 모든 path 를 이어 붙인 d 하나이고, 그 결과가 evenodd 로
 *      칠할 때 원본과 픽셀 동일함이 36개 전부 대조로 확인됐다. 그래서 전역 rule 로
 *      충분하다 — Solid 를 path 배열로 되돌려도 얻는 것이 없다.
 *
 *   즉 "일관성" 을 이유로 한쪽을 다른 쪽 모양으로 맞추면 Line 은 렌더가 깨지고
 *   Solid 는 데이터만 부푼다. 두 모듈의 형태는 그대로 두고 이 컴포넌트가 흡수한다.
 *
 * ── 렌더 시 지켜야 할 것 ──
 *
 *   Solid 글리프에 fillRule/clipRule 을 빼면 point / mileage 의 뚫린 구멍이 메워진다.
 *   Line path 는 데이터의 문서 순서를 유지해야 한다 — 순서를 바꾸면 겹침이 달라진다.
 *   좌표 · viewBox · stroke-width 같은 단위 없는 수치는 토큰 대상이 아니다.
 *
 * ── 접근성 ──
 *
 *   aria-label 은 Figma Line 계열 원본 이름을 그대로 쓴다 (BENEFIT_ICON_LABELS).
 *   장식용으로 쓸 때는 aria-hidden 을 넘긴다 — props 스프레드가 role/aria-label
 *   뒤에 오므로 둘 다 호출부에서 덮어쓸 수 있다.
 */

/** Figma `Type` property 4값. 위 대응표가 Figma 원본값과의 유일한 연결이다. */
export type IconBenefitType =
  | 'lineBlack'
  | 'lineWhite'
  | 'solidBlack'
  | 'solidWhite'

export interface IconBenefitProps extends SVGProps<SVGSVGElement> {
  /** 어떤 혜택 아이콘인가. Figma variant 의 이름 property 에 대응한다. */
  name: BenefitIconName
  /** 어떤 Type 인가. Figma `Type` property 에 대응한다. */
  type?: IconBenefitType
}

/**
 * Type 별 토큰 유틸리티.
 *   root  = svg 에 붙는 색 (Line 은 currentColor 의 출처가 된다)
 *   bg    = Solid 배경 path
 *   glyph = Solid 글리프 path
 * Line 은 bg/glyph 가 없고 Solid 는 root 색을 쓰지 않는다.
 */
const TYPE_TOKENS: Record<
  IconBenefitType,
  { root: string; bg: string; glyph: string }
> = {
  lineBlack: { root: 'text-icon-default', bg: '', glyph: '' },
  lineWhite: { root: 'text-icon-white', bg: '', glyph: '' },
  solidBlack: { root: '', bg: 'fill-icon-default', glyph: 'fill-icon-white' },
  solidWhite: { root: '', bg: 'fill-icon-white', glyph: 'fill-icon-default' },
}

/**
 * aria-label 용 이름. Figma Line 계열 원본 이름 그대로다
 * (IconBenefit.names.ts 의 "키 <-> Figma Line 원본 이름" 표와 1:1).
 * 키에서 기계적으로 만들 수 없다 — 'vip' -> "VIP", 'oneToOneCare' -> "1:1 Care" 처럼
 * 원본이 약어 · 숫자 · 구두점을 쓰기 때문이다.
 */
const BENEFIT_ICON_LABELS: Record<BenefitIconName, string> = {
  membership: 'Membership',
  vip: 'VIP',
  loyalty: 'Loyalty',
  newsletter: 'Newsletter',
  event: 'Event',
  vipEvent: 'VIP Event',
  membershipEvent: 'Membership Event',
  coupon: 'Coupon',
  welcomeCoupon: 'Welcome Coupon',
  membershipCoupon: 'Membership Coupon',
  vipCoupon: 'VIP Coupon',
  newsletterCoupon: 'Newsletter Coupon',
  percentage: 'Percentage',
  discount: 'Discount',
  preOrder: 'Pre-order',
  obsOnly: 'OBS Only',
  finance: 'Finance',
  zeroInterestPayment: 'Zero-interest Payment',
  point: 'Point',
  mileage: 'Mileage',
  delivery: 'Delivery',
  freeDelivery: 'Free Delivery',
  scheduledDelivery: 'Scheduled Delivery',
  nextDayDelivery: 'Next-Day Delivery',
  fastDelivery: 'Fast Delivery',
  return: 'Return',
  freeReturn: 'Free Return',
  tradeInProgram: 'Trade-In Program',
  oneToOneCare: '1:1 Care',
  installation: 'Installation',
  freeInstallation: 'Free Installation',
  vipInstallation: 'VIP Installation',
  disposal: 'Disposal',
  freeDisposal: 'Free Disposal',
  warranty: 'Warranty',
  twoYearWarranty: '2-Year Warranty',
}

export function IconBenefit({
  name,
  type = 'lineBlack',
  className = '',
  ...props
}: IconBenefitProps) {
  const tokens = TYPE_TOKENS[type]
  const isSolid = type === 'solidBlack' || type === 'solidWhite'

  const lineGlyph = benefitLinePaths[name]

  return (
    <svg
      // Line 데이터 모듈이 내주는 viewBox. Solid 배경 좌표도 같은 좌표계다.
      viewBox={BENEFIT_LINE_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={BENEFIT_ICON_LABELS[name]}
      className={`size-96 ${tokens.root} ${className}`}
      {...props}
    >
      {isSolid ? (
        <>
          <path
            d={benefitSolidBackgroundPath}
            opacity={BENEFIT_SOLID_BACKGROUND_OPACITY}
            className={tokens.bg}
          />
          <path
            d={benefitSolidGlyphPaths[name]}
            transform={benefitSolidGlyphTransforms[name]}
            fillRule={BENEFIT_SOLID_GLYPH_FILL_RULE}
            clipRule={BENEFIT_SOLID_GLYPH_FILL_RULE}
            className={tokens.glyph}
          />
        </>
      ) : (
        <g transform={lineGlyph.transform}>
          {lineGlyph.paths.map((path, index) => (
            <path
              // 데이터의 문서 순서가 곧 겹침 순서라 index 가 안정적인 키다.
              key={index}
              d={path.d}
              fillRule={path.fillRule}
              fill="currentColor"
              stroke={path.stroked ? 'currentColor' : undefined}
              strokeWidth={path.stroked ? BENEFIT_LINE_STROKE_WIDTH : undefined}
            />
          ))}
        </g>
      )}
    </svg>
  )
}
