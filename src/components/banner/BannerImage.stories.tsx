import type { Meta, StoryObj } from '@storybook/react'
import { BannerImage } from './BannerImage'
import sampleType1 from './BannerImage.type1.sample.png'
import sampleType2 from './BannerImage.type2.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16812'

const FIGMA_NODE_URL_TYPE1 =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31147'

const FIGMA_NODE_URL_TYPE2 =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19690-1023'

/* Figma 의 두 variant 에 들어 있던 사진을 export 해 같은 폴더에 뒀다. 컴포넌트가 아니라
   story 만 이 파일들을 쓴다 — 사진은 컴포넌트의 시각 정의가 아니라 내용이라서다.
   alt 는 Figma 가 적어 두지 않았다(미확인). 사진에 실제로 보이는 것을 적었고, 이 story
   들에서 사진은 장식이 아니라 유일한 내용이므로 빈 문자열로 두지 않는다. */
const FIGMA_CONTENT_TYPE1 = {
  src: sampleType1,
  alt: 'LG 인스타뷰 냉장고가 놓인 주방',
}

const FIGMA_CONTENT_TYPE2 = {
  src: sampleType2,
  alt: 'LG OLED TV 가 벽에 걸린 거실',
}

const meta = {
  title: 'Components/Banner/BannerImage',
  component: BannerImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '배너 한 칸을 꽉 채우는 사진 한 장.',
      },
    },
  },
  args: FIGMA_CONTENT_TYPE1,
} satisfies Meta<typeof BannerImage>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma `type=1`(19643:31147) 그대로 — 주방/냉장고 사진.
 *
 * 원본은 3840 x 1600 이라 8/3 프레임보다 세로로 길고, `object-cover` 가 위아래를 고르게
 * 잘라낸다. Figma 는 이 사진을 위쪽에 붙여 아래만 잘라내지만 type=2 는 반대 방향이라,
 * 코드는 가운데로 통일했다 — 근거는 `BannerImage.tsx` 의 `object-cover` 항목 참고.
 * `HeroBanner` 의 두 variant 가 배경으로 쓰는 것도 이 사진이다.
 */
export const Type1: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_TYPE1 } },
}

/**
 * Figma `type=2`(19690:1023) 그대로 — 거실/TV 사진.
 *
 * 원본은 3840 x 1630 으로 type=1 보다 조금 더 세로로 길다. Figma 는 이 사진만 아래쪽에
 * 붙여 위를 잘라내는데, 두 variant 의 방향이 정반대라 코드는 가운데로 통일했다 —
 * 자세한 근거는 `BannerImage.tsx` 의 `object-cover` 항목 참고.
 */
export const Type2: Story = {
  args: FIGMA_CONTENT_TYPE2,
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_TYPE2 } },
}

/**
 * 폭이 달라져도 8:3 비율이 유지되는지 보는 story.
 *
 * 위는 컨테이너 폭을 그대로 채우고, 아래는 그 절반이다. 두 사진의 높이가 각자의 폭에
 * 비례해서만 달라지면 정상이다 — 고정 높이를 박지 않은 결과다.
 */
export const FluidWidth: Story = {
  render: (args) => (
    <div className="flex flex-col gap-24">
      <BannerImage {...args} />
      <div className="w-1/2">
        <BannerImage {...args} />
      </div>
    </div>
  ),
}
