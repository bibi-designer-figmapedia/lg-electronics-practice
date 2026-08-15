import type { Meta, StoryObj } from '@storybook/react'
import { CheckBoxSet } from './CheckBoxSet'
import type { CheckBoxShape } from './CheckBox'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19640-2825'

/*
 * CheckBox.stories 와 같은 규칙: 스토리 이름은 Figma 의 State 축 용어를 그대로 쓰고,
 * 구현 쪽 checked × disabled 로의 분해는 CheckBoxSet.tsx / CheckBox.tsx 주석에 있다.
 * checked + readOnly 를 함께 쓰는 이유도 같다 — 정적 variant 재현.
 *
 * Size 축은 argTypes 에 없다. Figma 의 이 세트에 Size=Large 밖에 없어 prop 을 열지
 * 않았기 때문이다(CheckBoxSet.tsx 참고).
 */

const meta = {
  title: 'Components/CheckBoxSet',
  component: CheckBoxSet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — "Design" 탭에 Figma 의 CheckBoxSet 컴포넌트 세트를 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    label: 'Check box',
    shape: 'square',
    checked: false,
    disabled: false,
    readOnly: true,
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['square', 'round'] },
  },
} satisfies Meta<typeof CheckBoxSet>

export default meta
type Story = StoryObj<typeof meta>

/** `State=Default` — 미체크 + 활성. 라벨은 text/primary. */
export const Default: Story = {}

/** `State=On` — 체크 + 활성. 박스와 라벨이 함께 브랜드 색으로 바뀐다. */
export const On: Story = { args: { checked: true } }

/** `State=Disabled` — 미체크 + 비활성. 라벨은 text/disabled. */
export const Disabled: Story = { args: { disabled: true } }

/** `State=SelectDisable` — 체크 + 비활성. 라벨 색은 Disabled 와 같다. */
export const SelectDisable: Story = { args: { checked: true, disabled: true } }

/** `Shape=Round` — Figma 에는 Default · On 두 개만 있다. */
export const Round: Story = { args: { shape: 'round', checked: true } }

/*
 * Figma 세트에 실재하는 6개 variant. Round 의 Disabled · SelectDisable 은 원본이 없어
 * 넣지 않는다.
 */
const FIGMA_VARIANTS: {
  shape: CheckBoxShape
  state: string
  checked: boolean
  disabled: boolean
  node: string
}[] = [
  { shape: 'square', state: 'Default', checked: false, disabled: false, node: '19640-2771' },
  { shape: 'square', state: 'On', checked: true, disabled: false, node: '19640-2775' },
  { shape: 'square', state: 'Disabled', checked: false, disabled: true, node: '19640-2780' },
  { shape: 'square', state: 'SelectDisable', checked: true, disabled: true, node: '19640-2784' },
  { shape: 'round', state: 'Default', checked: false, disabled: false, node: '19640-2807' },
  { shape: 'round', state: 'On', checked: true, disabled: false, node: '19640-2811' },
]

const GROUPS: { title: string; shape: CheckBoxShape }[] = [
  { title: 'Shape=Square, Size=Large', shape: 'square' },
  { title: 'Shape=Round, Size=Large', shape: 'round' },
]

/** Figma 세트의 6개 variant 전부. 배치 순서도 원본 프레임과 같다. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-col gap-32">
      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-12">
          <p className="type-body-default-strong text-text-primary">{group.title}</p>
          <div className="flex flex-wrap gap-32">
            {FIGMA_VARIANTS.filter((variant) => variant.shape === group.shape).map((variant) => (
              <div key={variant.node} className="flex flex-col items-start gap-8">
                <CheckBoxSet
                  label={args.label}
                  shape={variant.shape}
                  checked={variant.checked}
                  disabled={variant.disabled}
                  readOnly
                />
                <p className="type-body-small text-text-primary">{variant.state}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
