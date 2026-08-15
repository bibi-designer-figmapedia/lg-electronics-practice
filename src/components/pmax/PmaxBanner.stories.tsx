import type { Meta, StoryObj } from '@storybook/react'
import { PmaxBanner } from './PmaxBanner'
import samplePmaxImage from './PmaxImage.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21073'

/*
 * Figma 노드에 그려져 있는 문구와 사진 그대로다. 컴포넌트가 아니라 story 가 들고 있는
 * 이유는 이것들이 인스턴스마다 바뀌는 내용이기 때문이다 — 근거는 PmaxImage.tsx 와
 * PmaxLayout.tsx 상단 주석에 있고, 이 파일은 같은 규칙을 따른다.
 *   사진 19661:17181 · 19661:17179 (Figma 는 두 자리에 같은 사진을 넣는다)
 *   eyebrow 19649:32059 · headline 19649:32060 · subcopy 19649:32061
 *   ctaLabel 19649:32062 의 라벨 · disclaimer 19649:32055
 */
const FIGMA_CONTENT = {
  src: samplePmaxImage,
  alt: '책상에서 노트북을 쓰는 사람이 있는 거실',
  eyebrow: 'Lorem ipsum dolor sit amet, consectetur',
  headline: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  subcopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod',
  ctaLabel: 'Shop now',
  disclaimer: '*T&C’s apply',
}

const meta = {
  title: 'Components/Pmax/PmaxBanner',
  component: PmaxBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '사진 배경 위에 글자 레이어를 얹은 Pmax 정사각 배너.',
      },
    },
  },
  args: FIGMA_CONTENT,
} satisfies Meta<typeof PmaxBanner>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 19661:21073 에 그려진 사진과 문구 그대로. */
export const Default: Story = {}

/**
 * 절반 폭에 놓은 모습.
 *
 * 폭을 호출부가 정한다는 규칙(`w-full` + `aspect-square`)이 물결 마스크에도 적용되는지
 * 보여 주는 story 다. `clipPath` 를 인라인 `svg` 의 좌표계에 둔 이유가 여기에 있다 —
 * 폭이 절반이 되면 사진 · 글자 · 물결이 **함께** 줄어들어야 하고, 셋 중 하나라도 원래
 * 크기로 남으면 겹침이 어긋난다.
 */
export const HalfWidth: Story = {
  render: (args) => (
    <div className="w-1/2">
      <PmaxBanner {...args} />
    </div>
  ),
}
