import type { Meta, StoryObj } from '@storybook/react'
import { PDPItemImage } from './PDPItemImage'
import samplePdpImage from './PDPItemImage.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17023'

/* Figma 인스턴스에 들어 있던 사진을 export 해 같은 폴더에 뒀다. 컴포넌트가 아니라
   story 만 이 파일을 쓴다 — 사진은 컴포넌트의 시각 정의가 아니라 내용이라서다. */
const FIGMA_CONTENT = {
  src: samplePdpImage,
  alt: 'LG PREMIUM OLED TV — 5년 부품·공임 패널 보증',
}

const meta = {
  title: 'Components/PDP/PDPItemImage',
  component: PDPItemImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '둥근 모서리로 잘라낸 PDP 항목 이미지.',
      },
    },
  },
  args: FIGMA_CONTENT,
} satisfies Meta<typeof PDPItemImage>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 인스턴스(19661:17023) 그대로. 폭은 호출부가 정하므로 story 는 컨테이너 폭을 채운다. */
export const Default: Story = {}

/**
 * 폭이 달라져도 4:3 비율이 유지되는지 보는 story.
 *
 * 왼쪽 열은 Figma 원본 폭(464)에 해당하는 3열 그리드 한 칸이고, 오른쪽은 그보다 좁다.
 * 두 이미지의 높이가 각자의 폭에 비례해서만 달라지면 정상이다 — 고정 높이를 박지 않은
 * 결과다.
 */
export const FluidWidth: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-24">
      <div className="col-span-2">
        <PDPItemImage {...args} />
      </div>
      <PDPItemImage {...args} />
    </div>
  ),
}
