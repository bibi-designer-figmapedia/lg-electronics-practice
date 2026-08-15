import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-31393'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: 'primary · secondary 두 종류에 sm · md · lg 크기를 갖는 기본 액션 버튼.',
      },
    },
  },
  args: {
    children: 'Label',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    state: { control: 'inline-radio', options: ['enabled', 'hover'] },
    trailingIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** `type=primary, state=enabled` — 배경 action/primary, 라벨 text/inverse. */
export const Primary: Story = {}

/** `type=secondary, state=enabled` — 흰 배경에 border/focus 테두리. */
export const Secondary: Story = {
  args: { variant: 'secondary' },
}

/**
 * `type=primary, state=hover` — 정적으로 고정한 hover 외형(node-id=19649-31390).
 * Figma 원본이 빨강이 아니라 흰 배경 + border/strong + text/primary 로 그려져 있어,
 * hover 하면 secondary 처럼 보인다. 보정하지 않고 그대로 옮겼다.
 * 이 스토리에서는 마우스를 올려도 더 변하지 않는다 — 이미 hover 외형이다.
 */
export const PrimaryHover: Story = {
  args: { state: 'hover' },
}

/**
 * `type=secondary, state=hover` — 정적으로 고정한 hover 외형(node-id=19649-31462).
 * 테두리가 border/focus 에서 border/strong 으로 옅어지고 라벨이 text/secondary 가 된다.
 * 상위 컴포넌트 `MainContentTitle`("Learn More") · `ComponentTitle`("Sign in") 이
 * Figma 에서 쓰고 있는 조합이 이것이다.
 */
export const SecondaryHover: Story = {
  args: { variant: 'secondary', state: 'hover' },
}

/** `state=disabled` — primary 는 흰 배경 + border/strong 에 불투명도 30. */
export const PrimaryDisabled: Story = {
  args: { disabled: true },
}

/** `state=disabled` — secondary 는 border/default 테두리에 text/disabled 라벨. 흐림 없음. */
export const SecondaryDisabled: Story = {
  args: { variant: 'secondary', disabled: true },
}

/**
 * `trailingIcon=false` — Figma 세트의 4번째 속성. chevron 만 빠지고 색·크기·간격은
 * 그대로다. 아이콘이 빠지면 콘텐츠 폭이 최소 너비 아래로 내려가므로, 이 스토리가
 * `min-w-80` 이 실제로 걸리는 모습을 보여주는 자리이기도 하다.
 */
export const WithoutTrailingIcon: Story = {
  args: { trailingIcon: false },
}

/** size 축 3개. 높이(44·48·64)와 상하 padding 만 바뀌고 라벨 타이포는 동일하다. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-16">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

/**
 * Figma 컴포넌트 세트 18개 조합 중 enabled · disabled 12개. 나머지 6개(hover)는
 * `state="hover"` 로 고정할 수 있다 — `PrimaryHover` · `SecondaryHover` 스토리를 볼 것.
 * (이 그리드는 hover 축이 prop 이 되기 전에 만들어진 것이고, 렌더는 그대로 둔다.)
 */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      {(['primary', 'secondary'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-16">
          <p className="type-body-default-strong text-text-primary">{variant}</p>
          {([false, true] as const).map((disabled) => (
            <div key={String(disabled)} className="flex items-center gap-16">
              <p className="type-body-small w-64 text-text-tertiary">
                {disabled ? 'disabled' : 'enabled'}
              </p>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Button
                  key={size}
                  {...args}
                  variant={variant}
                  size={size}
                  disabled={disabled}
                >
                  Label
                </Button>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}
