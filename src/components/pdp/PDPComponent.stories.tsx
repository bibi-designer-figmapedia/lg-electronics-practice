import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { BenefitCard } from './BenefitCard'
import { PDPComponent } from './PDPComponent'
import { PDPItem } from './PDPItem'
import samplePdpImage from './PDPItemImage.sample.png'

/* 산출물 1 — Figma 원본(component set). addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16406'

/* Figma variant 2개에 들어 있는 실제 문자열 그대로. */
const SUMMARY_CONTENT = {
  title: 'Need Help?',
  description: "We're here to provide all the help you need.",
}

const POINT_CONTENT = {
  title: 'Become an LG member',
  description:
    'Enjoy all the benefits of free LG membership, from special discounts to exclusive services and offers.',
}

/* KeyBenefitSummary(19661:15535) 의 PDPItem 인스턴스 3개 — 내용은 서로 같다. */
const SUMMARY_ITEM_NODE_IDS = ['19690:958', '19690:979', '19690:1000'] as const

const SUMMARY_ITEM_CONTENT = {
  imageSrc: samplePdpImage,
  imageAlt: 'LG PREMIUM OLED TV — 5년 부품·공임 패널 보증',
  eyebrow: 'Eyebrow Text',
  heading: 'Premium in Compact',
  body: 'Body Text',
}

/* KeyBenefitPoint(19661:15975) 의 BenefitCard 인스턴스 3개 — 내용이 서로 다르다.
   아이콘 이름은 Figma Union 레이어 노드 ID 로 확인했다(BenefitCard.tsx 참고). */
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

/* 항목은 children 으로 들어간다(PDPComponent.tsx 의 "확정된 구현 판단" 참고).
   두 variant 가 쓰는 자식 묶음을 여기서 한 번만 만든다.
   headingLevel 3 은 섹션 머리의 h2 아래라서다 — 레벨이 건너뛰지 않는다. */
const summaryItems = SUMMARY_ITEM_NODE_IDS.map((nodeId) => (
  <PDPItem key={nodeId} {...SUMMARY_ITEM_CONTENT} headingLevel={3} />
))

const pointCards = POINT_CARDS.map((card) => (
  <BenefitCard
    key={card.nodeId}
    title={card.title}
    description={card.description}
    icon={card.icon}
    headingLevel={3}
  />
))

const meta = {
  title: 'Components/PDP/PDPComponent',
  component: PDPComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '섹션 머리 아래에 3열 항목 줄을 놓는 PDP 섹션.',
      },
    },
  },
  args: {
    variant: 'keyBenefitSummary',
    ...SUMMARY_CONTENT,
    children: summaryItems,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['keyBenefitSummary', 'keyBenefitPoint'],
    },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
  /* Figma 에서 이 섹션이 놓인 배경이 bg/warm 이다. KeyBenefitPoint 의 카드가
     bg/default(흰색)라 흰 캔버스에서는 경계가 보이지 않는다. 이 래퍼는 story 의 것이고
     컴포넌트의 일부가 아니다. */
  decorators: [
    (Story) => (
      <div className="bg-bg-warm px-gutter py-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PDPComponent>

export default meta
type Story = StoryObj<typeof meta>

/** `Property 1=KeyBenefitSummary`(19661:15535) — 링크형 머리 + `PDPItem` 3개. */
export const KeyBenefitSummary: Story = {}

/** `Property 1=KeyBenefitPoint`(19661:15975) — 버튼형 머리 + `BenefitCard` 3개. */
export const KeyBenefitPoint: Story = {
  args: {
    variant: 'keyBenefitPoint',
    ...POINT_CONTENT,
    children: pointCards,
  },
}

/**
 * Figma 프레임 `PDPComponent`(19661:16406) 가 두 variant 를 위아래로 놓은 그대로.
 *
 * 두 섹션의 내용 좌우 끝이 맞고(둘 다 container 폭), Point 쪽만 위아래 여백을 더 갖는
 * 것이 정상이다.
 */
export const BothVariants: Story = {
  render: () => (
    <div className="flex flex-col">
      <PDPComponent variant="keyBenefitSummary" {...SUMMARY_CONTENT}>
        {summaryItems}
      </PDPComponent>
      <PDPComponent variant="keyBenefitPoint" {...POINT_CONTENT}>
        {pointCards}
      </PDPComponent>
    </div>
  ),
}

/**
 * heading 구조 판정 story — 눈으로는 판정할 수 없어 `play` 가 DOM 을 단정한다.
 *
 * 섹션 머리가 `<h2>`, 카드 3장이 `<h3>` 로 렌더되어 heading 레벨이 건너뛰지 않는지
 * 확인한다 (WCAG 2.1 SC 1.3.1). 카드 아이콘은 제목이 같은 뜻을 이미 전달하므로 접근성
 * 트리에 나오지 않아야 한다.
 */
export const HeadingOutline: Story = {
  args: {
    variant: 'keyBenefitPoint',
    ...POINT_CONTENT,
    children: pointCards,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* 섹션 머리는 h2 하나다. */
    const sectionHeading = canvas.getByRole('heading', { level: 2 })
    await expect(sectionHeading).toHaveTextContent(POINT_CONTENT.title)

    /* 카드 제목은 h3 세 개다 — 레벨이 2 에서 3 으로 이어지고 건너뛰지 않는다. */
    const cardHeadings = canvas.getAllByRole('heading', { level: 3 })
    await expect(cardHeadings).toHaveLength(POINT_CARDS.length)

    /* 아이콘은 이미지 역할로 노출되지 않는다. */
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}
