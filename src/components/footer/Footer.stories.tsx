import type { Meta, StoryObj } from '@storybook/react'
import { Footer, type FooterColumn } from './Footer'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15436'

/**
 * Figma 원본(19649:33303)의 6컬럼을 배치 순서·문구 그대로 옮긴 것이다.
 * Monitor/PC 와 Support 만 컬럼 안에 섹션이 여러 개다. LG Subscribe 처럼 링크가 없는
 * 섹션도 원본 그대로 남겼다. href 는 Figma 가 정의하지 않으므로 자리표시자다.
 */
const FIGMA_COLUMNS: FooterColumn[] = [
  [
    {
      heading: 'Shop',
      links: [
        { label: 'Shop the Latest', href: '#' },
        { label: 'All Promotions', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'TV/Audio',
      links: [
        { label: 'TV & Soundbars', href: '#' },
        { label: 'Lifestyle Screens', href: '#' },
        { label: 'Wireless Earbuds', href: '#' },
        { label: 'Bluetooth Speakers', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Appliances',
      links: [
        { label: 'Refrigerators', href: '#' },
        { label: 'Washing Machines', href: '#' },
        { label: 'All Dishwashers', href: '#' },
        { label: 'All Vacuum Cleaners', href: '#' },
        { label: 'All Cooking Appliances', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Air Solutions',
      links: [
        { label: 'Residential Air Conditioner', href: '#' },
        { label: 'Commercial Air Conditioner', href: '#' },
        { label: 'Air Purifier', href: '#' },
        { label: 'AeroTower & AeroFurniture', href: '#' },
        { label: 'Dehumidifier', href: '#' },
        { label: 'All LG Objet Collection', href: '#' },
      ],
    },
  ],
  [
    {
      heading: 'Monitor/PC',
      links: [
        { label: 'Consumer Monitors', href: '#' },
        { label: 'Laptops', href: '#' },
        { label: 'All Laptop Accessories', href: '#' },
      ],
    },
    {
      heading: 'LG AI',
      links: [{ label: 'LG Affectionate Intelligence', href: '#' }],
    },
    { heading: 'LG Subscribe', links: [] },
  ],
  [
    {
      heading: 'Support',
      links: [
        { label: 'Product registration', href: '#' },
        { label: 'Manuals & Softwares', href: '#' },
        { label: 'Troubleshoot', href: '#' },
        { label: 'Warranty information', href: '#' },
        { label: 'Repair request', href: '#' },
      ],
    },
    {
      heading: 'About LG',
      links: [
        { label: 'Career', href: '#' },
        { label: 'Press & Media', href: '#' },
        /* 19649:33393 — 원본에 "Link - Our Brand opens in a new window" 래퍼가 붙은
           유일한 링크다. */
        { label: 'Our Brand', href: '#', external: true },
        { label: 'Sustainability', href: '#' },
      ],
    },
  ],
]

const meta = {
  title: 'Components/Footer/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '6개 컬럼에 제목과 링크 목록을 놓는 페이지 푸터.',
      },
    },
  },
  args: {
    columns: FIGMA_COLUMNS,
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 원본 그대로 — 6컬럼. */
export const Default: Story = {}

/** 섹션이 하나뿐인 컬럼만 남긴 경우. 컬럼 수가 줄어도 폭은 flex-1 이 나눈다. */
export const SingleSectionColumns: Story = {
  args: {
    columns: FIGMA_COLUMNS.slice(0, 4),
  },
}
