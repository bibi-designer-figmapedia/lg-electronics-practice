import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { MainContentTitle } from './MainContentTitle'

/* 산출물 1 — Figma 원본. "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19832-1348'

/* Figma 가 그려 둔 문구 그대로다. eyebrow 의 "ipsumdolor" 는 오타가 아니라 원본 그대로이고,
   headline 의 개행도 원본이 두 줄로 그린 것을 그대로 옮긴 것이다 —
   근거는 MainContentTitle.tsx 의 "headline 의 하드 개행을 살린다" 참고. */
const FIGMA_CONTENT = {
  eyebrow: 'Lorem ipsumdolor sit amet',
  headline: 'Lorem ipsum dolor sit\nametap consectetur',
  subcopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

const meta = {
  title: 'Components/Title/MainContentTitle',
  component: MainContentTitle,
  parameters: {
    // @storybook/addon-designs — "Design" 탭이 MainContentTitle 컴포넌트를 보여준다.
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
  args: FIGMA_CONTENT,
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainContentTitle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma 원본(19832:1348) 그대로 — `showEyebrow` · `showSubcopy` 가 모두 기본값 `true` 다.
 * Figma 컴포넌트가 그려져 있는 상태가 정확히 이 조합이다.
 */
export const Default: Story = {}

/** `showEyebrow=false` — Eyebrow 만 빠지고 Headline · Subcopy · CTA 는 그대로다. */
export const WithoutEyebrow: Story = {
  args: { showEyebrow: false },
}

/** `showSubcopy=false` — Subcopy 만 빠진다. Headline 아래 gap 은 짝이 없어져 사라진다. */
export const WithoutSubcopy: Story = {
  args: { showSubcopy: false },
}

/** 둘 다 끈 조합 — Headline 과 CTA 만 남는다. */
export const HeadlineOnly: Story = {
  args: { showEyebrow: false, showSubcopy: false },
}

/**
 * boolean 2개가 만드는 4개 조합을 한 화면에서 대조한다.
 *
 * 위 4개 story 와 같은 조합이지만 나란히 두어야 간격 차이를 눈으로 비교할 수 있다.
 * 끈 상태는 Figma 에 그려져 있지 않다(미확인) — 코드는 해당 레이어만 빼고 나머지 간격을
 * 그대로 둔다.
 */
export const BooleanMatrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-40">
      <MainContentTitle {...args} showEyebrow showSubcopy />
      <MainContentTitle {...args} showEyebrow={false} showSubcopy />
      <MainContentTitle {...args} showEyebrow showSubcopy={false} />
      <MainContentTitle {...args} showEyebrow={false} showSubcopy={false} />
    </div>
  ),
}

/**
 * `headingLevel` 이 Headline 의 태그만 바꾸고 나머지는 건드리지 않는지 확인한다.
 *
 * play 함수가 판정하는 것은 두 가지다 — (a) Headline 이 지정한 레벨의 heading 으로
 * 노출되는가, (b) Eyebrow · Subcopy 가 heading 이 아닌가. 시각 스타일은 바뀌지 않는다
 * (근거는 `MainContentTitle.tsx` 의 "시맨틱" 항목).
 */
export const HeadingLevel3: Story = {
  /* headline 만 한 줄짜리로 바꾼다. toHaveTextContent 는 요소의 textContent 쪽 공백만
     정규화하므로, 하드 개행이 든 원본 문구를 기대값으로 쓰면 개행과 공백이 어긋나
     비교가 실패한다. 이 story 가 판정하는 것은 태그이지 줄바꿈이 아니다. */
  args: { headingLevel: 3, headline: 'Lorem ipsum dolor sit' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    /* Headline 은 레벨 3 의 heading 으로 노출된다. */
    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(args.headline)
    await expect(heading.tagName).toBe('H3')

    /* Eyebrow · Subcopy 는 heading 이 아니다 — 문서에 heading 은 정확히 1개다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}
