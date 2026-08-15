import type { Meta, StoryObj } from '@storybook/react'
import { PmaxLayout } from './PmaxLayout'
import { PmaxImage } from './PmaxImage'
import samplePmaxImage from './PmaxImage.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32052'

/*
 * Figma 노드에 그려져 있는 문구 그대로다. 컴포넌트가 아니라 story 가 들고 있는 이유는
 * 이 다섯 개가 인스턴스마다 바뀌는 내용이기 때문이다 — PmaxImage 가 사진을 story 쪽에
 * 둔 것과 같은 판단이고, 근거는 PmaxLayout.tsx 상단 주석에 있다.
 *   eyebrow 19649:32059 · headline 19649:32060 · subcopy 19649:32061
 *   ctaLabel 19649:32062 의 라벨 · disclaimer 19649:32055
 */
const FIGMA_CONTENT = {
  eyebrow: 'Lorem ipsum dolor sit amet, consectetur',
  headline: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  subcopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod',
  ctaLabel: 'Shop now',
  disclaimer: '*T&C’s apply',
}

const meta = {
  title: 'Components/Pmax/PmaxLayout',
  component: PmaxLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '로고 · 카피 · CTA · 혜택 줄 · 고지문으로 된 Pmax 배너의 글자 레이어.',
      },
    },
  },
  args: FIGMA_CONTENT,
} satisfies Meta<typeof PmaxLayout>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 19649:32052 에 그려진 문구 그대로. 배경은 이 컴포넌트가 칠하지 않는다. */
export const Default: Story = {}

/**
 * 사진 위에 얹은 모습.
 *
 * 이 컴포넌트가 배경을 칠하지 않는 이유를 보여 주는 story 다 — Figma 루트에 fill 이 없고,
 * 고지문에 흰 글로우가 걸려 있는 것도 이 레이어가 사진 위 오버레이라는 같은 사실을
 * 가리킨다. 두 컴포넌트가 같은 `w-full aspect-square` 규칙을 쓰기 때문에 겹치면 정확히
 * 포개진다.
 */
export const OverPhoto: Story = {
  render: (args) => (
    <div className="relative w-full">
      <PmaxImage src={samplePmaxImage} alt="" />
      <div className="absolute inset-0">
        <PmaxLayout {...args} />
      </div>
    </div>
  ),
}
