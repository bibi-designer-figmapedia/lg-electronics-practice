import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19563-5289'

/*
 * Input 은 스스로 폭을 정하지 않는다(`w-full`). 스토리에서는 부모가 폭을 주는
 * 상황을 재현해야 하므로 layout/filter-width 토큰(`max-w-filter-width`)으로
 * 감싼다 — Figma 원본의 인풋 폭에 가장 가까운 기존 width 토큰이다.
 */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-filter-width">{children}</div>
)

/* 단일 상태 스토리는 Frame 하나로 감싼다. meta 레벨에 두지 않는 이유: meta 데코레이터는
   Sizes · AllStates 바깥에도 걸려 여러 개를 나란히 놓을 폭을 남기지 않는다. */
const framed = [(StoryFn: () => React.ReactElement) => (
  <Frame>
    <StoryFn />
  </Frame>
)]

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    /* centered 가 아니라 padded: centered 는 스토리를 내용 폭으로 줄여서
       `w-full` 인 Input 이 max-w-filter-width 까지 늘어나지 못한다. */
    layout: 'padded',
    // @storybook/addon-designs — "Design" 탭에 Figma 의 Input 컴포넌트 프레임을 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    size: 'md',
    state: 'default',
    defaultValue: 'Lorem ipsum',
    /* Figma 원본에 라벨이 없다 — 시각 요소를 더하는 대신 aria-label 로 접근 가능한
       이름만 준다. 렌더 결과는 그대로다. */
    'aria-label': 'Sample text field',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    state: {
      control: 'inline-radio',
      options: ['default', 'selected', 'disabled', 'error', 'success'],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** `State=default` — 기본 상태. 테두리는 border/strong. */
export const Default: Story = { decorators: framed }

/** `State=selected` — 포커스된 모습. 테두리만 border/focus 로 바뀐다. */
export const Selected: Story = {
  args: { state: 'selected' },
  decorators: framed,
}

/** `State=disabled` — 배경 bg/subtle, 텍스트 text/disabled, 실제 `disabled` 속성. */
export const Disabled: Story = {
  args: { state: 'disabled' },
  decorators: framed,
}

/** `State=error` — 테두리와 메시지가 모두 state/error. */
export const Error: Story = {
  args: { state: 'error', validationMessage: 'Validation message' },
  decorators: framed,
}

/** `State=success` — 메시지만 state/success 이고 테두리는 border/strong 그대로다. */
export const Success: Story = {
  args: { state: 'success', validationMessage: 'Validation message' },
  decorators: framed,
}

/** Size 축 비교 — 높이만 다르다. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-24">
      <Frame>
        <Input {...args} size="md" aria-label="Sample text field, size md" />
      </Frame>
      <Frame>
        <Input {...args} size="lg" aria-label="Sample text field, size lg" />
      </Frame>
    </div>
  ),
}

/** Size 2 × State 5 = Figma 컴포넌트 세트의 10개 조합 전부. */
export const AllStates: Story = {
  render: (args) => (
    <div className="flex gap-24">
      {(['md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-24">
          <p className="type-body-default-strong text-text-primary">{size}</p>
          {(['default', 'selected', 'disabled', 'error', 'success'] as const).map((state) => (
            <Frame key={state}>
              <Input
                {...args}
                size={size}
                state={state}
                validationMessage="Validation message"
                aria-label={`Sample text field, size ${size}, state ${state}`}
              />
            </Frame>
          ))}
        </div>
      ))}
    </div>
  ),
}
