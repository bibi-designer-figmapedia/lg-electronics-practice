import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { BenefitCard } from './BenefitCard'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15783'

/* Figma 인스턴스 3개에 들어 있는 실제 문자열과 아이콘을 그대로 쓴다.
   아이콘 이름은 추측하지 않고 Union 레이어 노드 ID 로 확인했다 — 근거는
   BenefitCard.tsx 의 "재사용" 절 참고. */
const FIGMA_INSTANCES = [
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

const meta = {
  title: 'Components/PDP/BenefitCard',
  component: BenefitCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '제목·설명과 혜택 아이콘을 한 장에 담는 흰 카드.',
      },
    },
  },
  args: {
    title: FIGMA_INSTANCES[0].title,
    description: FIGMA_INSTANCES[0].description,
    icon: FIGMA_INSTANCES[0].icon,
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
  /* 카드 배경이 bg/default(흰색)라 흰 캔버스에서는 경계가 보이지 않는다.
     이 래퍼는 story 의 것이고 컴포넌트의 일부가 아니다 — Figma 에서도 카드가 놓인
     section 배경이 bg/warm 이다. */
  decorators: [
    (Story) => (
      <div className="bg-bg-warm p-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BenefitCard>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 인스턴스 19661:15784 "Welcome coupon" 그대로. */
export const Default: Story = {}

/** Figma 인스턴스 19661:15842 "Exclusive pricing" — 설명이 길어 카드가 높아진다. */
export const ExclusivePricing: Story = {
  args: {
    title: FIGMA_INSTANCES[1].title,
    description: FIGMA_INSTANCES[1].description,
    icon: FIGMA_INSTANCES[1].icon,
  },
}

/** Figma 인스턴스 19661:15852 — 제목이 2줄로 접히는 경우다. */
export const FreeDelivery: Story = {
  args: {
    title: FIGMA_INSTANCES[2].title,
    description: FIGMA_INSTANCES[2].description,
    icon: FIGMA_INSTANCES[2].icon,
  },
}

/**
 * Figma `KeyBenefitPoint`(19661:15975) 가 3장을 나란히 놓은 그대로.
 *
 * 세 카드의 내용 높이는 서로 다르지만(설명 줄 수가 다르다) 그리드 행이 높이를 맞춰
 * 셋 다 같은 높이로 늘어난다 — 카드에 고정 높이를 박지 않고도 Figma 와 같은 렌더가
 * 나오는 이유다. 열 폭은 3열 등폭 + `gap-24` 로 Figma 의 464 와 정확히 같아진다.
 */
export const AllInstances: Story = {
  render: (args) => (
    <div className="mx-auto grid w-full max-w-container grid-cols-3 gap-24">
      {FIGMA_INSTANCES.map((instance) => (
        <BenefitCard
          key={instance.nodeId}
          {...args}
          title={instance.title}
          description={instance.description}
          icon={instance.icon}
          headingLevel={3}
        />
      ))}
    </div>
  ),
}

/**
 * 접근성 판정 story — 눈으로는 판정할 수 없는 두 가지를 `play` 가 단정한다.
 *
 * 1. 제목이 `headingLevel` 이 정한 heading 으로 노출된다 (WCAG 2.1 SC 1.3.1).
 * 2. 아이콘이 접근성 트리에 **나오지 않는다**. `IconBenefit` 은 기본적으로
 *    `role="img"` 와 Figma 원본 이름의 `aria-label`("Welcome Coupon")을 붙이는데,
 *    이 카드에서는 제목이 같은 뜻을 이미 전달하므로 `aria-hidden` 으로 가린다.
 *    그대로 두면 스크린리더가 같은 내용을 두 번 읽는다.
 */
export const HeadingAndIconSemantics: Story = {
  args: { headingLevel: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(String(args.title))
    await expect(heading.tagName).toBe('H3')

    /* 문서에 heading 은 정확히 1개다 — 설명은 heading 이 아니다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)

    /* 아이콘은 이미지 역할로 노출되지 않는다. */
    await expect(canvas.queryByRole('img')).toBeNull()
  },
}
