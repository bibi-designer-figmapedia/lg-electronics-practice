import type { Meta, StoryObj } from '@storybook/react'
import { PmaxImage } from './PmaxImage'
import samplePmaxImage from './PmaxImage.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19676-24840'

/* Figma variant Property 1=Default(19649:32607) 에 들어 있던 사진을 export 해 같은 폴더에
   뒀다. 컴포넌트가 아니라 story 만 이 파일을 쓴다 — 사진은 컴포넌트의 시각 정의가 아니라
   내용이라서다. */
const FIGMA_CONTENT = {
  src: samplePmaxImage,
  alt: '햇빛이 드는 방에서 책상에 앉아 노트북을 쓰는 사람',
}

const meta = {
  title: 'Components/Pmax/PmaxImage',
  component: PmaxImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: 'Pmax 배너의 정사각 캔버스를 채우는 사진 한 장.',
      },
    },
  },
  args: FIGMA_CONTENT,
} satisfies Meta<typeof PmaxImage>

export default meta
type Story = StoryObj<typeof meta>

/** Figma variant `Property 1=Default`(19649:32607) 그대로. 폭은 호출부가 정한다. */
export const Default: Story = {}

/**
 * 폭이 달라져도 1:1 비율이 유지되는지 보는 story.
 *
 * 왼쪽 칸이 오른쪽보다 넓고, 두 이미지의 높이가 각자의 폭과 같기만 하면 정상이다 —
 * 고정 크기를 박지 않은 결과다.
 */
export const FluidWidth: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-24">
      <div className="col-span-2">
        <PmaxImage {...args} />
      </div>
      <PmaxImage {...args} />
    </div>
  ),
}
