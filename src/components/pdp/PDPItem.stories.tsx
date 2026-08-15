import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { PDPItem } from './PDPItem'
import samplePdpImage from './PDPItemImage.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21322'

/* Figma 인스턴스에 들어 있는 실제 문자열과 사진을 그대로 쓴다. 세 인스턴스
   (19690:958 · 19690:979 · 19690:1000)의 내용은 서로 같다. */
const FIGMA_CONTENT = {
  imageSrc: samplePdpImage,
  imageAlt: 'LG PREMIUM OLED TV — 5년 부품·공임 패널 보증',
  eyebrow: 'Eyebrow Text',
  heading: 'Premium in Compact',
  body: 'Body Text',
}

const meta = {
  title: 'Components/PDP/PDPItem',
  component: PDPItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '이미지 한 장 위에 텍스트 블록을 쌓은 PDP 항목 1칸.',
      },
    },
  },
  args: FIGMA_CONTENT,
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof PDPItem>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 인스턴스(19661:21322) 그대로. */
export const Default: Story = {}

/**
 * Figma `KeyBenefitSummary`(19661:15535) 의 Rows(19649:33026) 가 3개를 나란히 놓은 그대로.
 *
 * 3열 등폭 + `gap-24` 는 container 폭(1440)에서 열 폭이 정확히 464 가 되어 Figma 와
 * 같아지고, 그 폭에서 이미지 높이도 정확히 348 이 된다 — `PDPItemImage` 가 고정 크기
 * 대신 4:3 비율을 쓰는 근거다.
 */
export const ThreeUp: Story = {
  render: (args) => (
    <div className="mx-auto grid w-full max-w-container grid-cols-3 gap-24">
      {['19690:958', '19690:979', '19690:1000'].map((nodeId) => (
        <PDPItem key={nodeId} {...args} headingLevel={3} />
      ))}
    </div>
  ),
}

/**
 * `headingLevel` 이 `BodyText` 까지 그대로 전달되는지 판정하는 story.
 *
 * 시각적으로는 `Default` 와 같아 보이는 것이 정상이다 — `headingLevel` 은 마크업만
 * 바꾼다. 그래서 눈으로는 판정할 수 없고 아래 `play` 가 실제 DOM 태그를 단정한다.
 */
export const HeadingLevel3: Story = {
  args: { headingLevel: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(String(args.heading))

    /* eyebrow 와 body 는 heading 이 아니다 — 문서에 heading 은 정확히 1개다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)

    /* 이미지는 alt 로 노출된다(장식용이 아니다). */
    await expect(canvas.getByRole('img')).toHaveAccessibleName(String(args.imageAlt))
  },
}
