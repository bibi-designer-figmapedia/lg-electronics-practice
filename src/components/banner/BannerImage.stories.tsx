import type { Meta, StoryObj } from '@storybook/react'
import { BannerImage } from './BannerImage'
import sampleType1 from './BannerImage.type1.sample.png'
import sampleType2 from './BannerImage.type2.sample.png'
import sampleType3 from './BannerImage.type3.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16812'

const FIGMA_NODE_URL_TYPE1 =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31147'

const FIGMA_NODE_URL_TYPE2 =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19690-1023'

const FIGMA_NODE_URL_TYPE3 =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19739-923'

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

/* 위 두 개와 만들어진 순서가 반대다. type=1 · type=2 는 Figma 에서 export 해 온
   것이지만, 이것은 Higgsfield(nano banana)로 type=2 를 참조 이미지 삼아 생성한 뒤
   Figma 세트에 type=3 variant 로 올린 것이다 — 코드가 먼저, Figma 가 나중이다.
   지금은 양쪽에 다 실재하므로 typeN 규칙을 그대로 따른다. */
const FIGMA_CONTENT_TYPE3 = {
  src: sampleType3,
  alt: '대리석 벽과 바닥으로 마감된 거실, 벽에 걸린 TV 에 폭포 영상이 나온다',
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
 * 이 사진의 원본 비율은 프레임 비율(12/5)과 정확히 같아, `object-cover` 가 잘라내는 것이
 * 없다. `HeroBanner` 의 두 variant 가 배경으로 쓰는 것도 이 사진이다.
 */
export const Type1: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_TYPE1 } },
}

/**
 * Figma `type=2`(19690:1023) 그대로 — 거실/TV 사진.
 *
 * 이 사진의 원본 비율은 프레임 비율보다 세로로 길어서 프레임이 위아래를 잘라낸다.
 * Figma 의 type=2 출력에만 `object-cover` 가 붙어 있던 것이 이 차이 때문이고, 코드는 두
 * variant 를 잘라내는 쪽으로 통일했다 — 자세한 근거는 `BannerImage.tsx` 주석 참고.
 */
export const Type2: Story = {
  args: FIGMA_CONTENT_TYPE2,
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_TYPE2 } },
}

/**
 * Figma `type=3`(19739:923) 그대로 — 대리석 거실 사진.
 *
 * 만들어진 방향이 위 두 개와 반대다. type=1 · type=2 는 Figma 가 원본이고 코드가
 * 옮겨 온 것이지만, 이 사진은 Higgsfield(nano banana)로 type=2 를 참조 이미지 삼아
 * 생성한 뒤 Figma 세트에 type=3 variant 로 올렸다. 그래서 Figma 노드는 코드 에셋의
 * 사본이지 그 반대가 아니다 — 나중에 둘이 어긋나면 어느 쪽이 원본인지가 이 방향에
 * 달려 있으므로 숨기지 않고 적는다.
 *
 * 이 story 가 컴포넌트 변경 없이 성립하는 근거는 `BannerImage` 가 사진을 `src` prop
 * 으로 열어 두었다는 것이다 — `BannerImage.tsx` 의 "type 축을 코드 prop 으로 옮기지
 * 않았다" 항목이 그대로 적용된다.
 *
 * 원본 규격은 3840 x 1600 으로 type=1 과 같고, 프레임 비율(12/5)과 정확히 일치해
 * `object-cover` 가 잘라내는 것이 없다.
 */
export const Type3: Story = {
  args: FIGMA_CONTENT_TYPE3,
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_TYPE3 } },
}

/**
 * 폭이 달라져도 12:5 비율이 유지되는지 보는 story.
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
