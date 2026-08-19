import type { CategoryMenuItem } from '../../components/header/CategoryMenu'
import type { FooterColumn } from '../../components/footer/Footer'
import type { FuntionalTabItemData } from '../../components/FuntionalTab'
import { BenefitCard } from '../../components/pdp/BenefitCard'
import { ComponentTitle } from '../../components/title/ComponentTitle'
import { Footer } from '../../components/footer/Footer'
import { FuntionalTab } from '../../components/FuntionalTab'
import { HeroBanner } from '../../components/banner/HeroBanner'
import { Navigation } from '../../components/header/Navigation'
import { PDPComponent } from '../../components/pdp/PDPComponent'
import { PDPItem } from '../../components/pdp/PDPItem'
import sampleBannerImage from '../../components/banner/BannerImage.type1.sample.png'
import samplePdpImage from '../../components/pdp/PDPItemImage.sample.png'

/*
 * PDP — Figma "Page/PDP" 의 구현체. 페이지 조립 레이어이고, 자체 지오메트리는
 * 세로 스택 3단(Navigation · Main Content · Footer)이 전부다.
 *
 * Figma 원본 (산출물 1)
 *   page: https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=183-10007
 *
 *   이 노드는 다른 파일에 산다. src/components/ 의 컴포넌트들은 전부 파일키
 *   Ma09rS3GL9ahAGRADSWDj3 의 라이브러리 노드를 원본으로 갖고, 이 페이지는 그
 *   라이브러리를 소비하는 쪽이다. 그래서 링크의 파일키가 서로 다르다.
 *
 *   내부 노드 (get_metadata 로 읽음)
 *     183:10008  Navigation                       y 0,    높이 140
 *     183:10009  Main Content                     y 140,  높이 2283
 *       183:10010  HeroBanner                     y 0,    높이 800
 *       183:10011  categoryArea                   y 800,  높이 342
 *         183:10012  ComponentTitle  Case=tab     y 8,    높이 144
 *         183:10013  FuntionalTab                 y 152,  높이 182
 *       183:10014  contents                       y 1142, 높이 1141
 *         183:10015  PDPComponent  KeyBenefitSummary  x 240, y 48,  폭 1440
 *         183:10016  PDPComponent  KeyBenefitPoint    x 217, y 668, 폭 1486
 *     183:10017  Footer                           y 2423, 높이 403
 *
 * 재사용 — 새로 만든 컴포넌트가 없다 (원칙 2)
 *   인스턴스 7개가 전부 저장소에 이미 있다. get_design_context(183:10007) 가 내준
 *   코드에서 각 인스턴스가 어떤 속성을 넘기는지 확인했고, 페이지가 실제로 override 하는
 *   값은 아래 하나뿐이다.
 *
 *     183:10012  ComponentTitle    propCase="tab"
 *     183:10015  PDPComponent      제목을 "LG OLED" 로 override (설명문은 기본값 유지)
 *     183:10016  PDPComponent      Property 1=KeyBenefitPoint
 *
 *   나머지 4개(Navigation · HeroBanner · FuntionalTab · Footer)는 override 가 없다.
 *   그래서 이 파일이 넘기는 문구·목록은 지어낸 값이 아니라 각 컴포넌트의 story 에 이미
 *   Figma 원문으로 적혀 있는 상수 그대로다 — 출처를 상수별 주석에 적었다. 같은 문자열을
 *   두 곳에서 다르게 쓰면 그것이 곧 디자인-코드 불일치의 출처가 된다.
 *
 * 토큰 매핑 (산출물 2) — 새 토큰 0개. src/tokens/ 는 이 작업에서 읽기만 했다.
 *
 *   | 용도 | Figma 변수 / 실측 | 유틸리티 |
 *   | --- | --- | --- |
 *   | 페이지 배경 | bg/warm | `bg-bg-warm` |
 *   | 페이지 폭 | 변수 없음, 실측 1920 | `max-w-viewport` |
 *   | categoryArea 상하 padding | spacing/8 | `py-8` |
 *   | contents 상하 padding | spacing/48 | `py-48` |
 *   | contents 자식 간격 | spacing/48 | `gap-48` |
 *   | contents 좌우 인셋 | layout/viewport-inset 240 | `px-viewport-inset` |
 *
 *   이 5개가 이 파일이 소비하는 시각 값의 전부다. 색 · 타이포 · 인셋 · 카드 간격은
 *   전부 자식 컴포넌트가 이미 토큰으로 갖고 있어 여기서 다시 지정하지 않는다.
 *
 * 옮기지 않은 값 3가지 (하드코딩하지 않고 근거를 남긴다)
 *   - 페이지 높이 실측 2826. authoring 된 값이 아니라 140 + 2283 + 403 의 합이다.
 *     세로 스택이 그대로 같은 결과를 낸다.
 *   - 183:10015 의 폭 실측 1440 · 183:10016 의 폭 실측 1486. 둘 다 PDPComponent 가
 *     자기 안에서 `max-w-container` 로 만드는 값이다. 여기서 폭을 다시 걸면 같은 값이
 *     두 곳에 살게 된다.
 *
 * 인셋 모델 — 갈래가 둘이고, 이 페이지는 둘 다 쓴다 (확정 사항)
 *   1. 일반 섹션. 페이지 래퍼가 px-viewport-inset 을 주고 컴포넌트는 인셋을 갖지 않는다.
 *      아래 contents 가 이쪽이다.
 *   2. full-bleed 밴드. 자체 배경 · 구분선이 화면 전체 폭인 밴드는 바깥이 폭을 채우며 배경만
 *      갖고, 안쪽 콘텐츠가 px-viewport-inset + max-w-container 를 갖는다. 페이지가 padding
 *      으로 인셋을 주면 배경과 구분선까지 들어가 밴드가 아니게 되기 때문이다.
 *      아래 categoryArea 의 두 자식(ComponentTitle Case=tab · FuntionalTab)과
 *      Navigation · Footer · HeroBanner 가 이쪽이고, 그래서 categoryArea 래퍼에는 인셋이 없다.
 *
 * contents 의 x 오프셋(240 / 217) — 갈래 1 이므로 인셋은 이 래퍼가 준다
 *   Figma 의 contents 프레임(폭 1920)이 자식에게 인셋을 직접 준다: 183:10015 는 x 240 폭
 *   1440, 183:10016 은 x 217 폭 1486 이다(뒤쪽 폭이 46 넓은 것은 위 "옮기지 않은 값" 3번의
 *   반올림 산물이고, 두 인스턴스의 안쪽 콘텐츠는 같은 240 에서 시작한다).
 *   이전 구현은 이 인셋을 값으로 갖지 않고 자식의 `mx-auto` + `max-w-container` 가 남기는
 *   여백에 맡겼다. 폭이 1920 일 때만 240 이 나오고, 1440 이하에서는 여백이 0 이 되어 섹션이
 *   화면 좌우 끝에 붙었다 — 제목의 첫 글자와 "Read More" 가 화면 경계에 닿는다.
 *   그래서 인셋을 이 래퍼가 px-viewport-inset 으로 직접 준다. 자식 컴포넌트는 인셋을 갖지
 *   않고 max-w-container 로 폭 상한만 갖는다.
 *
 * 지원 폭은 1600 이상이다 (측정으로 확정한 하한)
 *   Figma 는 폭 1920 하나만 그린다. 이 구현은 그보다 좁아져도 인셋 모델이 유지되도록 폭을
 *   상한으로만 걸지만, 하한이 있다 — GNB 내용의 최소 폭이 1465 다.
 *     92(바 인셋) + 100(로고) + 48(로고↔GNBContent) + 1225(CategoryMenu 806 + RightMenu 419)
 *   CategoryMenu 와 RightMenu 는 둘 다 내용을 감싸고 줄어들지 않으므로 1225 가 더 줄지 않는다.
 *   그래서 1465 미만에서는 GNB 가 가로로 넘쳐 페이지에 가로 스크롤이 생기고, 1440 에서는
 *   "Support" 와 "LG SIGNATURE" 가 맞닿는다. 1600 · 1920 에서는 넘침이 0 이다.
 *   1465 미만을 지원해야 한다면 그것은 이 페이지가 아니라 두 메뉴 컴포넌트의 축소 규칙을
 *   Figma 가 정해야 하는 문제다 — 여기서 임의로 인셋을 깎아 맞추지 않는다.
 *
 * heading 레벨을 이 파일에서 정하는 이유
 *   자식 컴포넌트들은 heading 레벨을 prop 으로 열어 두고 기본값 2 를 갖는다. 기본값대로
 *   두면 한 페이지에 h2 가 여러 개 뜨고 h1 은 하나도 없다. 문서 바깥 구조는 놓이는
 *   위치를 아는 쪽만 판정할 수 있으므로 페이지가 정한다:
 *     h1  HeroBanner 의 "Title"      — 페이지 제목
 *     h2  categoryArea · contents 의 섹션 머리 3개
 *     h3  PDPItem · BenefitCard 의 카드 제목 6개
 *   레벨이 건너뛰지 않는다. Figma 는 이 구조를 표현하지 않으므로 시각에는 영향이 없다.
 *
 * 루트가 div 인 이유
 *   Navigation 은 HeaderGNB 를 거쳐 이미 `header` 를, Footer 는 `footer` 를 렌더한다.
 *   `main` 은 아래에서 직접 쓴다. 루트까지 랜드마크로 만들면 중복이라 배치용 div 다.
 */

/* Figma 텍스트 레이어 원문 그대로. 출처는 HeaderNotification.stories.tsx 의
   FIGMA_MESSAGE 이며 연속 공백도 원본에 있는 것이다. */
const NOTIFICATION_MESSAGE =
  'Welcome to LG! Sign up and get a 5% discount on your first purchase!  Sign-up'

/* 출처: Navigation.stories.tsx 의 CATEGORY_ITEMS. 첫 항목 Shop 만 active 다. */
const CATEGORY_ITEMS: CategoryMenuItem[] = [
  { label: 'Shop', href: '#', active: true },
  { label: 'TV/Audio/Video', href: '#' },
  { label: 'Appliances', href: '#' },
  { label: 'Air Solution', href: '#' },
  { label: 'Computer Products', href: '#' },
  { label: 'Support', href: '#' },
]

/* 출처: HeroBanner.stories.tsx. 배너 사진은 BannerImage type=1 이고, 저장소에 이미
   커밋된 샘플 파일이 그 자산이다 — 만료되는 원격 URL 을 심지 않는다. */
const HERO = {
  src: sampleBannerImage,
  alt: 'LG 인스타뷰 냉장고가 놓인 주방',
  /* 카피 3개는 HeroBanner.stories.tsx 의 FIGMA_CONTENT 와 같은 문구다 — 즉 MainContentTitle
     컴포넌트 원본(19832:1348)이 그린 문구이고, headline 의 개행도 그 원본이 두 줄로 그린
     것이다(근거는 MainContentTitle.tsx 의 "headline 의 하드 개행을 살린다").
     eyebrow 의 "ipsumdolor" 는 오타가 아니라 원본 그대로다.

     ⚠ 이 페이지 자신의 Figma 원본과는 다르다 (숨기지 않고 적는다)
       직전 판은 'Eyebrow' · 'Title' · 'Description' 세 플레이스홀더를 갖고 있었고, 그
       문구는 이 페이지의 Figma 노드가 그린 것이라고 이전 주석이 기록해 뒀다. 이번에는
       요청자가 컴포넌트 원본 문구를 쓰기로 확정했다 — headline 이 한 줄('Title')이 아니라
       두 줄로 보여야 한다는 요청이고, eyebrow · subcopy 도 같은 원본으로 맞췄다.
       그 결과 히어로 카피는 이 페이지 노드가 아니라 MainContentTitle 노드를 출처로 갖는다.
       이 세션에서 페이지 노드(183:10010)를 다시 읽어 대조하지는 않았다 — 위 "이전 주석이
       기록해 뒀다" 는 그 기록의 인용이고 이번에 재확인한 사실이 아니다.
       되돌리려면 플레이스홀더 3개로 되돌리는 것이 아니라 페이지 노드를 먼저 다시 읽을 것. */
  eyebrow: 'Lorem ipsumdolor sit amet',
  headline: 'Lorem ipsum dolor sit\nametap consectetur',
  subcopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

/* 출처: FuntionalTab.stories.tsx 의 DESCRIPTION. 7칸이 전부 같은 문구다. */
const TAB_DESCRIPTION = 'Nunc a tristique massa turpis justo turpis arcu.'

/* 출처: FuntionalTab.stories.tsx 의 FIGMA_ITEMS. 마지막 두 칸이 아이콘·라벨까지
   똑같은 것도 원본 그대로다. */
const TAB_ITEMS: FuntionalTabItemData[] = [
  { icon: 'all', label: 'All', description: TAB_DESCRIPTION, href: '#', active: true },
  { icon: 'Refrigerator', label: 'Refrigerator', description: TAB_DESCRIPTION, href: '#' },
  { icon: 'BottomFreezer', label: 'Bottom Freezer', description: TAB_DESCRIPTION, href: '#' },
  { icon: 'MultiDoor', label: 'Multi Door', description: TAB_DESCRIPTION, href: '#' },
  { icon: 'SideBySide', label: 'Side by Side', description: TAB_DESCRIPTION, href: '#' },
  { icon: 'OneDoor', label: 'One Door', description: TAB_DESCRIPTION, href: '#' },
  { icon: 'OneDoor', label: 'One Door', description: TAB_DESCRIPTION, href: '#' },
]

/* 183:10012 ComponentTitle Case=tab — 두 문구 모두 컴포넌트 기본값이고 페이지는
   override 하지 않는다. "Explaination" 은 오타가 아니라 Figma 레이어 원문이다. */
const CATEGORY_TITLE = {
  title: 'Need Help?',
  description: 'Category Explaination',
}

/* 183:10015 — 제목만 "LG OLED" 로 override 됐다. 설명문은 PDPComponent
   KeyBenefitSummary 의 기본값 그대로이며 출처는 PDPComponent.stories.tsx 의
   SUMMARY_CONTENT 다. */
const SUMMARY_SECTION = {
  title: 'LG OLED',
  description: "We're here to provide all the help you need.",
}

/* 출처: PDPComponent.stories.tsx 의 SUMMARY_ITEM_CONTENT. 항목 3개의 내용이 서로 같다. */
const SUMMARY_ITEM = {
  imageSrc: samplePdpImage,
  imageAlt: 'LG PREMIUM OLED TV — 5년 부품·공임 패널 보증',
  eyebrow: 'Eyebrow Text',
  heading: 'Premium in Compact',
  body: 'Body Text',
}

/* 항목 3개가 완전히 같은 값이라 구별할 키가 내용에 없다. 목록이 정적이고 재정렬·삽입·
   삭제가 없으므로 위치를 키로 쓴다. */
const SUMMARY_ITEM_COUNT = 3

/* 출처: PDPComponent.stories.tsx 의 POINT_CONTENT. */
const POINT_SECTION = {
  title: 'Become an LG member',
  description:
    'Enjoy all the benefits of free LG membership, from special discounts to exclusive services and offers.',
}

/* 출처: PDPComponent.stories.tsx 의 POINT_CARDS. nodeId 는 Figma 인스턴스 식별자이자
   목록 키다. */
const POINT_CARDS = [
  {
    nodeId: '19661:15784',
    icon: 'welcomeCoupon',
    title: 'Welcome coupon',
    description: 'Enjoy $10 off on your first purchase when you sign up as an LG member',
  },
  {
    nodeId: '19661:15842',
    icon: 'discount',
    title: 'Exclusive pricing',
    description:
      'Receive an exclusive membership discount of up to 8% for all orders during the promotional event period.*',
  },
  {
    nodeId: '19661:15852',
    icon: 'freeDelivery',
    title: 'Free delivery & installation',
    description: 'Free delivery and installation for LG.com orders*',
  },
] as const

/* 출처: Footer.stories.tsx 의 FIGMA_COLUMNS. 6컬럼을 배치 순서·문구 그대로 옮긴 것이고,
   Monitor/PC 와 Support 만 컬럼 안에 섹션이 여러 개다. href 는 Figma 가 정의하지
   않으므로 자리표시자다. */
const FOOTER_COLUMNS: FooterColumn[] = [
  [
    {
      heading: 'Shop',
      links: [
        { label: 'Shop the Latest', href: '#' },
        { label: 'All Promotions', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'TV/Audio',
      links: [
        { label: 'TV & Soundbars', href: '#' },
        { label: 'Lifestyle Screens', href: '#' },
        { label: 'Wireless Earbuds', href: '#' },
        { label: 'Bluetooth Speakers', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Appliances',
      links: [
        { label: 'Refrigerators', href: '#' },
        { label: 'Washing Machines', href: '#' },
        { label: 'All Dishwashers', href: '#' },
        { label: 'All Vacuum Cleaners', href: '#' },
        { label: 'All Cooking Appliances', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Air Solutions',
      links: [
        { label: 'Residential Air Conditioner', href: '#' },
        { label: 'Commercial Air Conditioner', href: '#' },
        { label: 'Air Purifier', href: '#' },
        { label: 'AeroTower & AeroFurniture', href: '#' },
        { label: 'Dehumidifier', href: '#' },
        { label: 'All LG Objet Collection', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Monitor/PC',
      links: [
        { label: 'Consumer Monitors', href: '#' },
        { label: 'Laptops', href: '#' },
        { label: 'All Laptop Accessories', href: '#' },
      ],
    },
    {
      heading: 'LG AI',
      links: [{ label: 'LG Affectionate Intelligence', href: '#' }],
    },
    { heading: 'LG Subscribe', links: [] },
  ],
  [
    {
      heading: 'Support',
      links: [
        { label: 'Product registration', href: '#' },
        { label: 'Manuals & Softwares', href: '#' },
        { label: 'Troubleshoot', href: '#' },
        { label: 'Warranty information', href: '#' },
        { label: 'Repair request', href: '#' },
      ],
    },
    {
      heading: 'About LG',
      links: [
        { label: 'Career', href: '#' },
        { label: 'Press & Media', href: '#' },
        /* 원본에 "Link - Our Brand opens in a new window" 래퍼가 붙은 유일한 링크다. */
        { label: 'Our Brand', href: '#', external: true },
        { label: 'Sustainability', href: '#' },
      ],
    },
  ],
]

/** Figma "Page/PDP"(183:10007) 의 코드 정본. */
export function PDP() {
  return (
    /* 183:10007 Page/PDP */
    /* min-w-container(1440)가 바닥인 이유: 시안 컨테이너 폭이 1440 이고 그보다 좁은
       레이아웃을 Figma 가 정의하지 않았다 — 축소를 여기서 멈추고 부족한 폭은 가로 스크롤로
       넘긴다. */
    <div className="flex w-full min-w-container flex-col items-start bg-bg-warm">
      {/* 183:10008 Navigation — override 없음. 핸들러는 페이지가 정하지 않는다. */}
      <Navigation notification={NOTIFICATION_MESSAGE} items={CATEGORY_ITEMS} />

      {/* 183:10009 Main Content — 배경 없는 세로 스택이다. */}
      <main className="flex w-full flex-col items-center justify-center">
        {/* 183:10010 HeroBanner — layout 은 기본값 left 다. */}
        <HeroBanner
          src={HERO.src}
          alt={HERO.alt}
          eyebrow={HERO.eyebrow}
          headline={HERO.headline}
          subcopy={HERO.subcopy}
          headingLevel={1}
        />

        {/* 183:10011 categoryArea */}
        <div className="flex w-full flex-col items-start py-8">
          {/*
            * 183:10012 ComponentTitle Case=tab — 배경이 없는 일반 섹션이라 페이지가 주는
            * 컨테이너 래퍼 안에 둔다. 래퍼 조합(px-gutter + mx-auto max-w-container)은 아래
            * contents 섹션과 같은 것이고, 그래서 제목의 좌측 라인이 "LG OLED" 와 카드들과
            * 픽셀 단위로 같아진다. 컴포넌트 자신은 좌우 여백도 폭도 갖지 않는다.
            */}
          <div className="w-full px-gutter">
            <div className="mx-auto w-full max-w-container">
              <ComponentTitle
                case="tab"
                headingLevel={2}
                title={CATEGORY_TITLE.title}
                description={CATEGORY_TITLE.description}
              />
            </div>
          </div>
          {/* 183:10013 FuntionalTab — 화살표 핸들러는 페이지가 정하지 않는다. */}
          <FuntionalTab items={TAB_ITEMS} />
        </div>

        {/* 183:10014 contents */}
        <div className="flex w-full flex-col items-center gap-48 px-gutter py-48">
          {/* 183:10015 PDPComponent KeyBenefitSummary — "Read More" 링크를 이미 갖고 있다. */}
          <PDPComponent
            variant="keyBenefitSummary"
            headingLevel={2}
            title={SUMMARY_SECTION.title}
            description={SUMMARY_SECTION.description}
          >
            {Array.from({ length: SUMMARY_ITEM_COUNT }, (_, index) => (
              <PDPItem key={index} {...SUMMARY_ITEM} headingLevel={3} />
            ))}
          </PDPComponent>

          {/* 183:10016 PDPComponent KeyBenefitPoint — "Sign in" · "Join US" 를 이미 갖고 있다. */}
          <PDPComponent
            variant="keyBenefitPoint"
            headingLevel={2}
            title={POINT_SECTION.title}
            description={POINT_SECTION.description}
          >
            {POINT_CARDS.map((card) => (
              <BenefitCard
                key={card.nodeId}
                icon={card.icon}
                title={card.title}
                description={card.description}
                headingLevel={3}
              />
            ))}
          </PDPComponent>
        </div>
      </main>

      {/* 183:10017 Footer — override 없음. */}
      <Footer columns={FOOTER_COLUMNS} />
    </div>
  )
}
