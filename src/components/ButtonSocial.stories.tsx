import type { Meta, StoryObj } from '@storybook/react'
import { ButtonSocial, type ButtonSocialVariant } from './ButtonSocial'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19661-15301'

/*
 * Figma 세트("ListItem" 19661:15301) 의 속성은 Property 1 하나뿐이다. State 축이
 * 원본에 없어 hover/pressed/disabled story 도 없다 — 근거는 ButtonSocial.tsx 주석.
 */
const VARIANTS: ButtonSocialVariant[] = ['apple', 'google', 'facebook']

const meta = {
  title: 'Components/ButtonSocial',
  component: ButtonSocial,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — "Design" 탭에 Figma 의 ListItem 컴포넌트 세트를 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    variant: 'apple',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
  },
} satisfies Meta<typeof ButtonSocial>

export default meta
type Story = StoryObj<typeof meta>

/** `Property 1=apple` — 기본값. */
export const Apple: Story = {}

/** `Property 1=google` — 4색 벤더 마크. */
export const Google: Story = { args: { variant: 'google' } }

/** `Property 1=facebook` — 단색 벤더 마크. */
export const Facebook: Story = { args: { variant: 'facebook' } }

/** Figma 세트에 실재하는 3개 variant 와 그 노드 ID. */
const FIGMA_VARIANTS: { variant: ButtonSocialVariant; node: string }[] = [
  { variant: 'apple', node: '19661-15300' },
  { variant: 'google', node: '19661-15299' },
  { variant: 'facebook', node: '19661-15298' },
]

/** 3개 variant 전부. 배치 순서와 간격(spacing/16)도 원본 List 프레임과 같다. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap gap-16">
      {FIGMA_VARIANTS.map(({ variant, node }) => (
        <div key={variant} className="flex flex-col items-center gap-8">
          <ButtonSocial variant={variant} />
          <p className="type-body-small text-text-primary">{variant}</p>
          <p className="type-body-small text-text-tertiary">{node}</p>
        </div>
      ))}
    </div>
  ),
}
