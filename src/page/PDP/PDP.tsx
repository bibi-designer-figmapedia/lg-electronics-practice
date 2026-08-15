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
 *
 *   이 5개가 이 파일이 소비하는 시각 값의 전부다. 색 · 타이포 · 인셋 · 카드 간격은
 *   전부 자식 컴포넌트가 이미 토큰으로 갖고 있어 여기서 다시 지정하지 않는다.
 *
 * 옮기지 않은 값 3가지 (하드코딩하지 않고 근거를 남긴다)
 *   - 페이지 높이 실측 2826. authoring 된 값이 아니라 140 + 2283 + 403 의 합이다.
 *     세로 스택이 그대로 같은 결과를 낸다.
 *   - 183:10015 의 폭 실측 1440 · 183:10016 의 폭 실측 1486. 둘 다 PDPComponent 가
 *     자기 안에서 만드는 값이다 — KeyBenefitSummary 는 `max-w-container`(1440),
 *     KeyBenefitPoint 는 `w-full` + `px-24` 로 컨테이너를 감싼다. 여기서 폭을 다시
 *     걸면 같은 값이 두 곳에 살게 된다.
 *   - contents 의 x 오프셋(240 / 217). 두 자식이 각자 가운데 정렬로 만드는 결과이고,
 *     `items-center` 를 그대로 쓰면 같은 배치가 나온다.
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
  eyebrow: 'Eyebrow',
  title: 'Title',
  description: 'Description',
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
    <div className="mx-auto flex w-full max-w-viewport flex-col items-start bg-bg-warm">
      {/* 183:10008 Navigation — override 없음. 핸들러는 페이지가 정하지 않는다. */}
      <Navigation notification={NOTIFICATION_MESSAGE} items={CATEGORY_ITEMS} />

      {/* 183:10009 Main Content — 배경 없는 세로 스택이다. */}
      <main className="flex w-full flex-col items-center justify-center">
        {/* 183:10010 HeroBanner — layout 은 기본값 left 다. */}
        <HeroBanner
          src={HERO.src}
          alt={HERO.alt}
          eyebrow={HERO.eyebrow}
          title={HERO.title}
          description={HERO.description}
          headingLevel={1}
        />

        {/* 183:10011 categoryArea */}
        <div className="flex w-full flex-col items-start py-8">
          {/* 183:10012 ComponentTitle Case=tab — 아래 구분선을 스스로 갖는다. */}
          <ComponentTitle
            case="tab"
            headingLevel={2}
            title={CATEGORY_TITLE.title}
            description={CATEGORY_TITLE.description}
          />
          {/* 183:10013 FuntionalTab — 화살표 핸들러는 페이지가 정하지 않는다. */}
          <FuntionalTab items={TAB_ITEMS} />
        </div>

        {/* 183:10014 contents */}
        <div className="flex w-full flex-col items-center gap-48 py-48">
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
