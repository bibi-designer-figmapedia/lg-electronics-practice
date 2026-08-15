import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { MainContentTitle } from './MainContentTitle'

/* 산출물 1 — Figma 원본(두 인스턴스가 나란히 놓인 프레임). "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19613-13769'

const meta = {
  title: 'Components/Title/MainContentTitle',
  component: MainContentTitle,
  parameters: {
    // @storybook/addon-designs — "Design" 탭이 MainContentTitle 프레임을 보여준다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '본문 섹션 맨 앞에 놓이는 제목 묶음.',
      },
    },
  },
  args: {
    align: 'left',
    // Figma 원본이 그려 둔 문구 그대로다.
    eyebrow: 'Eyebrow',
    title: 'Title',
    description: 'Description',
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'center'] },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainContentTitle>

export default meta
type Story = StoryObj<typeof meta>

/** `Size=Large, Align=Left`(19613:13120) — 텍스트와 CTA 가 모두 왼쪽에 붙는다. */
export const Left: Story = {}

/** `Size=Large, Align=Center`(19613:13201) — 텍스트는 text-center, CTA 는 가로 가운데. */
export const Center: Story = {
  args: {
    align: 'center',
  },
}

/**
 * `headingLevel=3` — Title 을 `<h3>` 로 렌더한다. 기본값 `2` 가 맞지 않는 페이지 문맥
 * (이미 `<h2>` 아래에 놓이는 경우 등)에서 호출부가 레벨을 낮추는 용법이다.
 *
 * 이 story 는 `Left` 와 **화면상 완전히 같아 보여야** 정상이다 — `headingLevel` 은 마크업만
 * 바꾸고 시각 스타일은 건드리지 않기 때문이다. 그래서 눈으로는 판정할 수 없고, 아래 `play`
 * 가 실제 DOM 태그를 단정한다: Title 이 accessible heading 으로 노출되는지
 * (WCAG 2.1 SC 1.3.1) 와 Eyebrow · Description 이 heading 이 **아닌지**를 함께 확인한다.
 */
export const HeadingLevel3: Story = {
  args: { headingLevel: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    /* Title 은 레벨 3 의 heading 으로 노출된다. */
    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(args.title)
    await expect(heading.tagName).toBe('H3')

    /* Eyebrow · Description 은 heading 이 아니다 — 문서에 heading 은 정확히 1개다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

/** Figma 프레임과 같은 세로 순서(Left 가 위)로 그려진 variant 2개를 나란히 둔다. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-40">
      <MainContentTitle {...args} align="left" />
      <MainContentTitle {...args} align="center" />
    </div>
  ),
}
