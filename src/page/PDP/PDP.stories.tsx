import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { PDP } from './PDP'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다.
   컴포넌트들과 파일키가 다른 이유는 PDP.tsx 상단 주석에 있다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=183-10007'

const meta = {
  title: 'Pages/PDP',
  component: PDP,
  tags: ['autodocs'],
  parameters: {
    /* 전체 폭 페이지라 캔버스 여백 없이 붙인다. */
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: 'PDP 화면 전체를 조립하는 페이지 레이어.',
      },
    },
  },
} satisfies Meta<typeof PDP>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 원본과 1:1 로 대조하는 기본 story. 다른 상태가 없다. */
export const Default: Story = {}

/*
 * heading 계층이 실제로 h1 → h2 → h3 로 내려가는지 확인한다. 이 레벨들은 Figma 가
 * 표현하지 않는 값이라 페이지가 정한 것이고, 정한 쪽에서 검증까지 한다.
 * 레벨을 잘못 주면 시각은 그대로라 눈으로는 잡히지 않는다.
 */
export const HeadingOutline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* h1 은 페이지 제목 하나뿐이다. 페이지 전체에서 센다. */
    expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Title')

    /*
     * h2 · h3 는 main 안에서만 센다. Footer 가 컬럼 제목 9개(Shop · TV/Audio · Appliances ·
     * Air Solutions · Monitor/PC · LG AI · LG Subscribe · Support · About LG)를 h2 로
     * 렌더하기 때문이다 — 페이지 전체에서 세면 12개가 나온다. 이 레벨은 Footer 가 자기
     * 안에서 정하는 값이고 이 작업의 편집 범위 밖이라 그대로 두고, 대신 이 페이지가 정한
     * 계층(main 안)만 판정한다.
     */
    const main = within(canvas.getByRole('main'))

    /* h2 는 섹션 머리 3개 — categoryArea 1 + contents 2. */
    const sectionHeadings = main.getAllByRole('heading', { level: 2 })
    expect(sectionHeadings.map((node) => node.textContent)).toEqual([
      'Need Help?',
      'LG OLED',
      'Become an LG member',
    ])

    /* h3 는 카드 제목 6개 — PDPItem 3 + BenefitCard 3. */
    const cardHeadings = main.getAllByRole('heading', { level: 3 })
    expect(cardHeadings.map((node) => node.textContent)).toEqual([
      'Premium in Compact',
      'Premium in Compact',
      'Premium in Compact',
      'Welcome coupon',
      'Exclusive pricing',
      'Free delivery & installation',
    ])
  },
}

/*
 * 랜드마크가 중복되지 않는지 확인한다. Navigation 이 header 를, Footer 가 footer 를 이미
 * 렌더하므로 페이지 루트는 배치용 div 다 — 루트까지 랜드마크로 만들면 banner 가 둘이 된다.
 */
export const Landmarks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expect(canvas.getAllByRole('banner')).toHaveLength(1)
    expect(canvas.getAllByRole('main')).toHaveLength(1)
    expect(canvas.getAllByRole('contentinfo')).toHaveLength(1)
  },
}
