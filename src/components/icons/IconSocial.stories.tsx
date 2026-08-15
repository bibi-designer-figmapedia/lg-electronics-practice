import type { Meta, StoryObj } from '@storybook/react'
import { IconSocial, type IconSocialName } from './IconSocial'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19661-16991'

/** Figma 의 ButtonSocial(ListItem) variant 순서 그대로. */
const NAMES: IconSocialName[] = ['apple', 'google', 'facebook']

const meta = {
  title: 'Components/Icons/IconSocial',
  component: IconSocial,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — "Design" 탭에 sign-in 섹션 원본을 붙인다. 이 3개는
    // 독립 컴포넌트 세트가 아니라 섹션 안의 벡터 노드라 섹션을 가리킨다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    name: 'apple',
  },
  argTypes: {
    name: { control: 'inline-radio', options: NAMES },
  },
} satisfies Meta<typeof IconSocial>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 story — controls 의 `name` 으로 3개를 전환한다. */
export const Default: Story = {}

/** Figma 노드 ID. 각 마크가 어느 원본에서 왔는지 story 에 남긴다(산출물 1). */
const NODES: Record<IconSocialName, string> = {
  apple: '19661-15286',
  google: '19661-15289',
  facebook: '19661-15296',
}

/** 3개 전부. Figma 의 아이콘 노드와 1:1 로 대조하는 용도다. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-24">
      {NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-8">
          <IconSocial name={name} />
          {/* 캡션 라벨 — 기존 아이콘 story 의 캡션 관례와 같은 합성 클래스다. */}
          <span className="type-body-small text-text-secondary">{name}</span>
          <span className="type-body-small text-text-tertiary">{NODES[name]}</span>
        </div>
      ))}
    </div>
  ),
}
