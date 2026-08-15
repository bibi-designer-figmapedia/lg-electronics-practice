import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { ComponentTitle } from './ComponentTitle'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다.
   frame 19574:8524 안에 Case=link · Case=Button · Case=tab 세 인스턴스가 세로로 있다.
   story 별로 해당 Case 노드를 다시 걸어 두어 Design 탭이 그 Case 를 바로 연다. */
const FIGMA_FILE = 'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3'
const FIGMA_FRAME_URL = `${FIGMA_FILE}/?node-id=19574-8524`
const FIGMA_CASE_URL = {
  link: `${FIGMA_FILE}/?node-id=19574-8523`,
  button: `${FIGMA_FILE}/?node-id=19661-15712`,
  tab: `${FIGMA_FILE}/?node-id=19661-21036`,
}

/* Figma 인스턴스에 들어 있는 실제 문자열을 그대로 쓴다. Case 마다 다르다.
   tab 의 "Category Explaination" 은 Figma 원본의 오타이며 고치지 않았다(원칙 1).
   tab 제목의 레이어 *이름* 은 "How can we help?" 지만 실제 텍스트는 "Need Help?" 다 —
   get_design_context 가 내준 렌더 문자열을 따랐다.

   CTA 라벨("Read More" · "Sign in" · "Join US")은 여기에 없다. 이 컴포넌트의 Figma
   속성이 아니라 중첩 인스턴스의 텍스트 override 라서 컴포넌트가 원본 문구로 고정하고
   있고, prop 으로 열려 있지 않다 — 근거는 ComponentTitle.tsx 상단 주석 참고. */
const FIGMA_CONTENT = {
  link: {
    title: 'Need Help?',
    description: "We're here to provide all the help you need.",
  },
  button: {
    title: 'Become an LG member',
    description:
      'Enjoy all the benefits of free LG membership, from special discounts to exclusive services and offers.',
  },
  tab: {
    title: 'Need Help?',
    description: 'Category Explaination',
  },
}

const meta = {
  title: 'Components/Title/ComponentTitle',
  component: ComponentTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_FRAME_URL,
    },
    docs: {
      description: {
        component: '섹션 머리(제목 + 설명)와 오른쪽 액션 영역을 배치하는 타이틀.',
      },
    },
  },
  args: {
    case: 'link',
    ...FIGMA_CONTENT.link,
  },
  argTypes: {
    case: { control: 'inline-radio', options: ['link', 'button', 'tab'] },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof ComponentTitle>

export default meta
type Story = StoryObj<typeof meta>

/** `Case=link`(19574:8523) — 제목 + 설명, 오른쪽에 텍스트 링크. */
export const Link: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_CASE_URL.link } },
  args: { case: 'link', ...FIGMA_CONTENT.link },
}

/** `Case=link` 에서 Figma 의 `buttonText` 속성을 끈 모습 — 텍스트 링크만 빠진다. */
export const LinkWithoutButtonText: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_CASE_URL.link } },
  args: { case: 'link', ...FIGMA_CONTENT.link, buttonText: false },
}

/** `Case=Button`(19661:15712) — 제목 + 설명, 오른쪽에 버튼 2개. */
export const ButtonCase: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_CASE_URL.button } },
  args: { case: 'button', ...FIGMA_CONTENT.button },
}

/** `Case=tab`(19661:21036) — 제목 + 설명, 아래에 hairline 구분선. */
export const Tab: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_CASE_URL.tab } },
  args: { case: 'tab', ...FIGMA_CONTENT.tab },
}

/**
 * `headingLevel=3` — 제목을 `<h3>` 로 렌더한다. 기본값 `2` 가 맞지 않는 페이지 문맥
 * (이미 `<h2>` 아래에 놓이는 경우 등)에서 호출부가 레벨을 낮추는 용법이다.
 *
 * 이 story 는 `ButtonCase` 와 **화면상 완전히 같아 보여야** 정상이다 — `headingLevel` 은
 * 마크업만 바꾸고 시각 스타일은 건드리지 않기 때문이다. 그래서 눈으로는 판정할 수 없고,
 * 아래 `play` 가 실제 DOM 태그를 단정한다: 제목이 accessible heading 으로 노출되는지
 * (WCAG 2.1 SC 1.3.1) 와 설명 텍스트가 heading 이 **아닌지**를 함께 확인한다.
 */
export const HeadingLevel3: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_CASE_URL.button } },
  args: { case: 'button', ...FIGMA_CONTENT.button, headingLevel: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    /* 제목은 레벨 3 의 heading 으로 노출된다. */
    const heading = canvas.getByRole('heading', { level: 3 })
    await expect(heading).toHaveTextContent(String(args.title))
    await expect(heading.tagName).toBe('H3')

    /* 설명 텍스트는 heading 이 아니다 — 문서에 heading 은 정확히 1개다. */
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
  },
}

/** Figma frame 19574:8524 처럼 Case 3개를 원본과 같은 순서로 세로로 쌓는다. */
export const AllCases: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_FRAME_URL } },
  render: () => (
    <div className="flex w-full flex-col gap-40">
      <ComponentTitle case="link" {...FIGMA_CONTENT.link} />
      <ComponentTitle case="button" {...FIGMA_CONTENT.button} />
      <ComponentTitle case="tab" {...FIGMA_CONTENT.tab} />
    </div>
  ),
}
