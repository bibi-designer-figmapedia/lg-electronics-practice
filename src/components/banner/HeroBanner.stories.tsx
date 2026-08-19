import type { Meta, StoryObj } from '@storybook/react'
import { HeroBanner } from './HeroBanner'
import sampleType1 from './BannerImage.type1.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19832-1364'

/* 배경으로 깔린 것은 BannerImage 의 type=1 이다 — get_design_context 가 이 인스턴스를
   type="1" 로 내준다. 그 export 를 story 가 쓴다. alt 는 Figma 가 적어 두지 않았다
   (미확인). 사진에 실제로 보이는 것을 적었다. */
const FIGMA_CONTENT = {
  src: sampleType1,
  alt: 'LG 인스타뷰 냉장고가 놓인 주방',
  /* Figma 가 그려 둔 문구 그대로다. eyebrow 의 "ipsumdolor" 와 headline 의 개행 · disclaimer
     의 두 줄 모두 원본이 그렇게 그려져 있다 — 근거는 각 컴포넌트 주석 참고. */
  eyebrow: 'Lorem ipsumdolor sit amet',
  headline: 'Lorem ipsum dolor sit\nametap consectetur',
  subcopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  disclaimer:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nAenean euismod bibendum laoreet.',
}

const meta = {
  title: 'Components/Banner/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '배너 사진 위에 카피 열을 얹은 히어로 배너.',
      },
    },
  },
  args: FIGMA_CONTENT,
} satisfies Meta<typeof HeroBanner>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma 원본(19832:1364) 그대로 — boolean 3개가 모두 기본값 `true` 다.
 *
 * Figma 컴포넌트가 그려져 있는 상태가 정확히 이 조합이다. variant 축은 없다.
 */
export const Default: Story = {}

/** `showDisclaimer=false` — 하단 고지문만 빠지고 카피 열은 그대로 위쪽에 남는다. */
export const WithoutDisclaimer: Story = {
  args: { showDisclaimer: false },
}

/**
 * Eyebrow · Subcopy 없이 제목만 있는 경우.
 *
 * 두 텍스트의 렌더 여부는 `MainContentTitle` 의 `showEyebrow` · `showSubcopy` boolean 이
 * 정하고(Figma 19832:1348 의 eyebrowtext · subcopyText 속성), 이 컴포넌트는 그것을 그대로
 * 통과시킨다. 껐을 때의 모습은 Figma 에 그려져 있지 않다(미확인).
 */
export const HeadlineOnly: Story = {
  args: { showEyebrow: false, showSubcopy: false },
}

/**
 * 페이지 최상단에 놓일 때의 heading 레벨.
 *
 * `headingLevel` 은 `MainContentTitle` 의 prop 을 그대로 통과시키는 것이고, 이 컴포넌트는
 * 기본값을 다시 정하지 않는다 — 넘기지 않으면 그쪽 기본값 2 가 쓰인다.
 */
export const PageHeading: Story = {
  args: { headingLevel: 1 },
}

/**
 * 배경 사진이 장식일 때.
 *
 * `alt=''` 를 **명시적으로** 넘긴다 — 빠뜨려서 비는 것과 의도해서 비우는 것은 다르고,
 * 후자만 접근성상 올바르다. 규격은 `BannerImage` 의 것을 그대로 통과시킨다.
 */
export const DecorativeImage: Story = {
  args: { alt: '' },
}
