import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { BodyText } from './BodyText'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다.
   frame 19661:4543 안에 layout=left(19661:4541) · layout=center(19661:4542) 두 인스턴스가
   나란히 있다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4543'

/* Figma 인스턴스에 들어 있는 실제 문자열을 그대로 쓴다. */
const FIGMA_CONTENT = {
  eyebrow: 'Eyebrow Text',
  heading: 'Premium in Compact',
  body: 'Body Text',
}

const meta = {
  title: 'Components/Title/BodyText',
  component: BodyText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: 'Eyebrow · 제목 · 본문 3줄을 세로로 쌓는 텍스트 블록.',
      },
    },
  },
  args: {
    ...FIGMA_CONTENT,
    layout: 'left',
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['left', 'center'] },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof BodyText>

export default meta
type Story = StoryObj<typeof meta>

/** `layout=left`(19661:4541) — 왼쪽 정렬. */
export const Left: Story = {}

/** `layout=center`(19661:4542) — 가운데 정렬. */
export const Center: Story = {
  args: { layout: 'center' },
}

/**
 * `headingLevel=3` — 제목을 `<h3>` 로 렌더한다. 기본값 `2` 가 맞지 않는 페이지 문맥
 * (이미 `<h2>` 아래에 놓이는 경우 등)에서 호출부가 레벨을 낮추는 용법이다.
 *
 * 이 story 는 `Left` 와 **화면상 완전히 같아 보여야** 정상이다 — `headingLevel` 은
 * 마크업만 바꾸고 시각 스타일은 건드리지 않기 때문이다. 그래서 눈으로는 판정할 수 없고,
 * 아래 `play` 가 실제 DOM 태그를 단정한다: 제목이 accessible heading 으로 노출되는지
 * (WCAG 2.1 SC 1.3.1) 와 Eyebrow · 본문이 heading 이 **아닌지**를 함께 확인한다.
 */
export const HeadingLevel3: Story = {
  args: { headingLevel: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    /* 제목은 레벨 3 의 heading 으로 노출된다. */
    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(String(args.heading))
    await expect(heading.tagName).toBe('H3')

    /* Eyebrow 와 본문은 heading 이 아니다 — 문서에 heading 은 정확히 1개다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

/** Figma frame 19661:4543 처럼 두 variant 를 원본과 같은 순서로 나란히 둔다. */
export const AllLayouts: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-gutter">
      {(['left', 'center'] as const).map((layout) => (
        <BodyText key={layout} {...args} layout={layout} />
      ))}
    </div>
  ),
}
