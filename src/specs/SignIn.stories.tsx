import type { Meta, StoryObj } from '@storybook/react'

import { ScreenSpecDoc, SpecMarker } from './ScreenSpecDoc'
import { SignIn } from '../page/SignIn/SignIn'
import { signInSpec } from './signIn.spec'

/*
 * Sign in 화면정의서의 Storybook 진입점.
 *
 * 본문은 SignIn.mdx 가 갖는다. 이 CSF 파일이 따로 있는 이유는 하나 —
 * addon-designs 의 Design 탭은 애드온 패널이고, 애드온 패널은 스토리 Canvas
 * 에만 붙는다. MDX 단독 docs 페이지에는 패널 자체가 없어서 parameters.design
 * 을 걸 자리가 없다. 그래서 parameters.design 은 여기에 두고, MDX 는
 * <Meta of={…}> 로 이 meta 에 붙는다.
 *
 * tags 로 autodocs 를 끈 것도 그 구조 때문이다. preview.ts 가 전역으로
 * autodocs 를 켜 두었는데, 붙는 MDX 가 있으면 두 곳이 같은 `--docs` 항목을
 * 만들어 인덱싱이 중복 id 로 실패한다. 문서 페이지는 MDX 쪽 하나만 남긴다.
 */
const meta = {
  title: 'Specs/Sign in',
  component: ScreenSpecDoc,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7098',
    },
  },
  args: {
    spec: signInSpec,
    /*
     * 화면은 src/page/SignIn 을 그대로 끼운다 — 문서용 사본을 따로 만들지 않는다.
     * 사본을 두면 페이지가 바뀔 때 문서가 조용히 낡는다.
     *
     * 마커 번호는 Figma 시트의 num 프레임(118:7129 · 118:7131 · 118:7133)이 가리키는
     * 대상과 같고, Description 표의 01 · 02 · 03 과 1:1로 대응한다.
     */
    screen: (
      <SignIn
        annotations={{
          title: <SpecMarker>1</SpecMarker>,
          action: <SpecMarker>2</SpecMarker>,
          options: <SpecMarker>3</SpecMarker>,
        }}
      />
    ),
  },
} satisfies Meta<typeof ScreenSpecDoc>

export default meta

type Story = StoryObj<typeof meta>

export const Spec: Story = {}
