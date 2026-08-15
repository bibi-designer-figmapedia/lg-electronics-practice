import type { Meta, StoryObj } from '@storybook/react'
import { HeroBanner } from './HeroBanner'
import sampleType1 from './BannerImage.type1.sample.png'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17371'

const FIGMA_NODE_URL_LEFT =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17370'

const FIGMA_NODE_URL_CENTER =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17369'

/* 두 variant 가 배경으로 깔고 있는 것은 BannerImage 의 type=1 이다 —
   get_design_context 가 양쪽 다 type="1" 로 내준다. 그 export 를 story 가 쓴다.
   alt 는 Figma 가 적어 두지 않았다(미확인). 사진에 실제로 보이는 것을 적었다. */
const FIGMA_CONTENT = {
  src: sampleType1,
  alt: 'LG 인스타뷰 냉장고가 놓인 주방',
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
        component: '배너 사진 위에 제목 묶음을 얹은 히어로 배너.',
      },
    },
  },
  args: {
    ...FIGMA_CONTENT,
    eyebrow: 'Eyebrow',
    description: 'Description',
  },
} satisfies Meta<typeof HeroBanner>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma `layout=left`(19661:17370) 그대로.
 *
 * 제목 묶음이 좌측 패딩에 붙고 세로로는 배너 가운데에 온다. 문구도 Figma 인스턴스가 쓴
 * "Eyebrow / Title / Description" 그대로다.
 */
export const Left: Story = {
  args: { layout: 'left', title: 'Title' },
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_LEFT } },
}

/**
 * Figma `layout=center`(19661:17369) 그대로.
 *
 * 제목 묶음이 가로로 가운데 오고, 세로로는 상단 패딩에 붙는다(Figma 가 이 variant 에만
 * 세로 가운데 정렬을 걸지 않았다).
 *
 * 제목 문구에 **하드 개행이 들어 있다.** Figma 인스턴스(19661:17329)가 이 문구를
 * "Lorem ipsum" / "dolor sit." 로 끊어 그리는데, 폭 860 짜리 텍스트 노드에서 실제 최대 줄
 * 폭이 492 라 자동 줄바꿈으로는 나올 수 없는 자리다(브라우저에서 "Lorem ipsum dolor" 는
 * 724 로 860 안에 들어간다). 계측 근거는 `MainContentTitle.tsx` 의 "title 의 하드 개행을
 * 살린다" 항목에 있다.
 *
 * 개행을 빼도 이 문구는 2줄로 접히긴 한다 — 전체 폭이 860 을 약 20 넘기기 때문이다.
 * 그러나 끊기는 자리가 Figma 와 달라지고, 문구가 조금만 바뀌면 줄 수까지 달라진다.
 */
export const Center: Story = {
  args: { layout: 'center', title: 'Lorem ipsum\ndolor sit.' },
  parameters: { design: { type: 'figma', url: FIGMA_NODE_URL_CENTER } },
}

/**
 * Eyebrow · Description 없이 제목만 있는 경우.
 *
 * 두 텍스트는 Figma 의 `showEyebrow` · `showDescription` 축에 대응하며,
 * `MainContentTitle` 이 문구를 받지 않으면 해당 레이어를 렌더하지 않는다. 껐을 때의
 * 모습은 Figma 에 그려져 있지 않다(미확인).
 */
export const TitleOnly: Story = {
  args: { layout: 'left', title: 'Title', eyebrow: undefined, description: undefined },
}

/**
 * 페이지 맨 위에 놓여 제목이 `<h1>` 이 되는 경우.
 *
 * `headingLevel` 은 `MainContentTitle` 의 prop 을 그대로 통과시키는 것이고, 이 컴포넌트는
 * 기본값을 다시 정하지 않는다 — Figma 에 heading 레벨 정보가 없어서(미확인) "히어로는
 * 보통 h1" 이라는 추정을 코드에 박지 않으려는 것이다. 그 판단의 대가는 호출부가 매번
 * 정해야 한다는 것이고, 이 story 가 그 자리를 보여준다. 시각 결과는 위 Left 와 같고
 * 마크업만 바뀐다 — 개발자 도구에서 제목 태그를 확인할 것.
 */
export const PageHeading: Story = {
  args: { layout: 'left', title: 'Title', headingLevel: 1 },
}

/**
 * 배경 사진이 장식일 때 — `alt` 에 빈 문자열을 **명시적으로** 넘긴다.
 *
 * 사진이 나르는 정보를 옆의 제목이 이미 말하고 있다면 스크린리더가 사진을 두 번 읽을
 * 이유가 없다. `alt` 를 선택 prop 으로 두지 않은 것은 이 선택을 호출부가 눈에 보이게
 * 하도록 강제하기 위해서다 — 빠뜨려서 비는 것과 의도해서 비우는 것은 다르다.
 */
export const DecorativeImage: Story = {
  args: { layout: 'left', title: 'Title', alt: '' },
}
