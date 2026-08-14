/*
 * Icon/Benefit — 이름 정의 (데이터 모듈)
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23774
 *   144개 = 36 이름 x 4 Type(Line black / Line white / Solid black / Solid white).
 *   모든 variant 프레임은 96 x 96 이다.
 *
 * 이 파일은 시각 값을 담지 않는다. 키 목록과 Figma 원본 이름 대응표만 담는다.
 *
 * 철자 정책
 *   Figma의 4개 Type이 같은 아이콘을 서로 다른 철자로 부르는 항목이 4개 있다.
 *   Line 계열 철자를 정답으로 삼아 키를 만들었고, Solid 계열의 오타는 아래
 *   "철자 불일치" 표에 4개 Type 원본 이름을 전부 남겼다. 코드에서 철자를 교정한
 *   것이지 Figma를 고친 것이 아니므로, Figma에서 이름을 다시 읽을 때 이 표가 없으면
 *   대응이 끊긴다.
 *
 * 키 <-> Figma Line 원본 이름 (36개, 배열 순서와 동일)
 *   membership            Membership
 *   vip                   VIP
 *   loyalty               Loyalty
 *   newsletter            Newsletter
 *   event                 Event
 *   vipEvent              VIP Event
 *   membershipEvent       Membership Event
 *   coupon                Coupon
 *   welcomeCoupon         Welcome Coupon
 *   membershipCoupon      Membership Coupon
 *   vipCoupon             VIP Coupon
 *   newsletterCoupon      Newsletter Coupon
 *   percentage            Percentage
 *   discount              Discount
 *   preOrder              Pre-order
 *   obsOnly               OBS Only
 *   finance               Finance
 *   zeroInterestPayment   Zero-interest Payment
 *   point                 Point
 *   mileage               Mileage
 *   delivery              Delivery
 *   freeDelivery          Free Delivery
 *   scheduledDelivery     Scheduled Delivery
 *   nextDayDelivery       Next-Day Delivery
 *   fastDelivery          Fast Delivery
 *   return                Return
 *   freeReturn            Free Return
 *   tradeInProgram        Trade-In Program
 *   oneToOneCare          1:1 Care
 *   installation          Installation
 *   freeInstallation      Free Installation
 *   vipInstallation       VIP Installation
 *   disposal              Disposal
 *   freeDisposal          Free Disposal
 *   warranty              Warranty
 *   twoYearWarranty       2-Year Warranty
 *
 * 철자 불일치 (Type별 원본 이름 전부) — get_metadata(19620:23774)로 직접 확인했다.
 *
 *   welcomeCoupon
 *     Line black   Welcome Coupon        (19620:23791)
 *     Line white   Welcome Coupon        (19620:23863)
 *     Solid black  Welcom Coupon         (19620:23943)   <- 오타
 *     Solid white  Welcom Coupon         (19620:24042)   <- 오타
 *
 *   membershipCoupon
 *     Line black   Membership Coupon     (19620:23793)
 *     Line white   Membership Coupon     (19620:23865)
 *     Solid black  Memberhsip Coupon     (19620:23946)   <- 오타
 *     Solid white  Membership Coupon     (19620:24045)
 *
 *   obsOnly
 *     Line black   OBS Only              (19620:23805)
 *     Line white   OBS Only              (19620:23877)
 *     Solid black  OBS only              (19620:23964)   <- 대소문자 불일치
 *     Solid white  OBS Only              (19620:24060)
 *
 *   zeroInterestPayment
 *     Line black   Zero-interest Payment (19620:23809)
 *     Line white   Zero-interest Payment (19620:23881)
 *     Solid black  Zero-Interest Payment (19620:23970)   <- 대소문자 불일치
 *     Solid white  Zero-Interest Payment (19620:24066)   <- 대소문자 불일치
 *
 *   위 4건 외의 이름 불일치는 없다. 36 x 4 = 144개 전부 대조했다.
 *   (Solid black / Solid white 는 캔버스 배치 순서만 어긋난 항목이 있다 —
 *    Solid black 의 Free Return / Scheduled Delivery / Next-Day Delivery,
 *    Solid white 의 Percentage 가 세트 끝에 붙어 있다. 이름은 정상이다.)
 */

export type BenefitIconName =
  | 'membership'
  | 'vip'
  | 'loyalty'
  | 'newsletter'
  | 'event'
  | 'vipEvent'
  | 'membershipEvent'
  | 'coupon'
  | 'welcomeCoupon'
  | 'membershipCoupon'
  | 'vipCoupon'
  | 'newsletterCoupon'
  | 'percentage'
  | 'discount'
  | 'preOrder'
  | 'obsOnly'
  | 'finance'
  | 'zeroInterestPayment'
  | 'point'
  | 'mileage'
  | 'delivery'
  | 'freeDelivery'
  | 'scheduledDelivery'
  | 'nextDayDelivery'
  | 'fastDelivery'
  | 'return'
  | 'freeReturn'
  | 'tradeInProgram'
  | 'oneToOneCare'
  | 'installation'
  | 'freeInstallation'
  | 'vipInstallation'
  | 'disposal'
  | 'freeDisposal'
  | 'warranty'
  | 'twoYearWarranty'

/**
 * Figma component set 의 배치 순서 그대로. story 갤러리와 다른 모듈이 순회에 쓴다.
 */
export const BENEFIT_ICON_NAMES: readonly BenefitIconName[] = [
  'membership',
  'vip',
  'loyalty',
  'newsletter',
  'event',
  'vipEvent',
  'membershipEvent',
  'coupon',
  'welcomeCoupon',
  'membershipCoupon',
  'vipCoupon',
  'newsletterCoupon',
  'percentage',
  'discount',
  'preOrder',
  'obsOnly',
  'finance',
  'zeroInterestPayment',
  'point',
  'mileage',
  'delivery',
  'freeDelivery',
  'scheduledDelivery',
  'nextDayDelivery',
  'fastDelivery',
  'return',
  'freeReturn',
  'tradeInProgram',
  'oneToOneCare',
  'installation',
  'freeInstallation',
  'vipInstallation',
  'disposal',
  'freeDisposal',
  'warranty',
  'twoYearWarranty',
] as const
