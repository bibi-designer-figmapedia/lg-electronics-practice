import type { Meta, StoryObj } from '@storybook/react'
import { CheckBox } from './CheckBox'
import type { CheckBoxShape, CheckBoxSize } from './CheckBox'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19640-2770'

/*
 * 스토리 이름은 Figma 의 State 축 용어(Default · On · Disabled · SelectDisable)를 그대로
 * 쓴다. 구현은 그 4개를 checked × disabled 로 분해했지만(CheckBox.tsx 참고), 디자인과
 * 대조할 때 부르는 이름은 Figma 쪽이어야 한다.
 *
 * checked 는 readOnly 와 함께 쓴다. 정적 variant 재현이 목적이라 onChange 가 없는데,
 * readOnly 가 없으면 React 가 제어 컴포넌트 경고를 낸다. Storybook 컨트롤로 토글하면
 * arg 가 바뀌어 다시 렌더되므로 조작은 그대로 된다.
 */

const meta = {
  title: 'Components/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — "Design" 탭에 Figma 의 CheckBox 컴포넌트 세트를 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    shape: 'square',
    size: 'large',
    checked: false,
    disabled: false,
    readOnly: true,
    'aria-label': 'Check box',
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['square', 'round'] },
    size: { control: 'inline-radio', options: ['large', 'small'] },
  },
} satisfies Meta<typeof CheckBox>

export default meta
type Story = StoryObj<typeof meta>

/** `State=Default` — 미체크 + 활성. 흰 배경에 border/focus 테두리. */
export const Default: Story = {}

/** `State=On` — 체크 + 활성. action/primary 로 채우고 테두리를 끈다. */
export const On: Story = { args: { checked: true } }

/** `State=Disabled` — 미체크 + 비활성. 채움과 같은 색 테두리가 남는다. */
export const Disabled: Story = { args: { disabled: true } }

/** `State=SelectDisable` — 체크 + 비활성. 채움은 Disabled 와 같고 테두리만 없다. */
export const SelectDisable: Story = { args: { checked: true, disabled: true } }

/** `Size=Small` — Square 전용. 박스와 체크마크가 함께 줄어든다. */
export const Small: Story = { args: { size: 'small', checked: true } }

/** `Shape=Round` — Figma 에는 Size=Large 의 Default · On 두 개만 있다. */
export const Round: Story = { args: { shape: 'round', checked: true } }

/*
 * Figma 세트에 실재하는 10개 variant. 없는 조합 6개(Round×Small 4개,
 * Round×Large 의 Disabled·SelectDisable 2개)는 여기에 넣지 않는다 — 대조할 원본이
 * 없는 칸을 스토리로 만들면 그것이 디자인인 것처럼 읽힌다.
 */
const FIGMA_VARIANTS: {
  shape: CheckBoxShape
  size: CheckBoxSize
  state: string
  checked: boolean
  disabled: boolean
  node: string
}[] = [
  { shape: 'square', size: 'large', state: 'Default', checked: false, disabled: false, node: '19640-2740' },
  { shape: 'square', size: 'large', state: 'On', checked: true, disabled: false, node: '19640-2742' },
  { shape: 'square', size: 'large', state: 'Disabled', checked: false, disabled: true, node: '19640-2745' },
  { shape: 'square', size: 'large', state: 'SelectDisable', checked: true, disabled: true, node: '19640-2747' },
  { shape: 'square', size: 'small', state: 'Default', checked: false, disabled: false, node: '19640-2750' },
  { shape: 'square', size: 'small', state: 'On', checked: true, disabled: false, node: '19640-2752' },
  { shape: 'square', size: 'small', state: 'Disabled', checked: false, disabled: true, node: '19640-2755' },
  { shape: 'square', size: 'small', state: 'SelectDisable', checked: true, disabled: true, node: '19640-2757' },
  { shape: 'round', size: 'large', state: 'Default', checked: false, disabled: false, node: '19640-2760' },
  { shape: 'round', size: 'large', state: 'On', checked: true, disabled: false, node: '19640-2762' },
]

const GROUPS: { title: string; shape: CheckBoxShape; size: CheckBoxSize }[] = [
  { title: 'Shape=Square, Size=Large', shape: 'square', size: 'large' },
  { title: 'Shape=Square, Size=Small', shape: 'square', size: 'small' },
  { title: 'Shape=Round, Size=Large', shape: 'round', size: 'large' },
]

/** Figma 세트의 10개 variant 전부. 배치 순서도 원본 프레임과 같다. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-32">
      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-12">
          <p className="type-body-default-strong text-text-primary">{group.title}</p>
          <div className="flex flex-wrap gap-32">
            {FIGMA_VARIANTS.filter(
              (variant) => variant.shape === group.shape && variant.size === group.size,
            ).map((variant) => (
              <div key={variant.node} className="flex flex-col items-center gap-8">
                <CheckBox
                  shape={variant.shape}
                  size={variant.size}
                  checked={variant.checked}
                  disabled={variant.disabled}
                  readOnly
                  aria-label={`${group.title}, State=${variant.state}`}
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
