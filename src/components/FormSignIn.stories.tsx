import type { Meta, StoryObj } from '@storybook/react'
import { FormSignIn } from './FormSignIn'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%EC%A0%84%EC%9E%90-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C?node-id=19661-15302'

/*
 * FormSignIn 은 variant 축이 없다 — Figma 원본(19661:15302)에 다른 상태가 그려져 있지
 * 않다. 그래서 story 도 기본형 하나이고 controls 로 바꿀 축이 없다.
 *
 * 폭은 이 컴포넌트가 정하지 않는다. 원본 카드는 450 고정이지만 그 값을 표현할 spacing
 * 토큰이 없고 하드코딩은 목적 1 위반이라, 카드가 부모 폭을 채우도록 두었다. 그래서
 * 아래 story 도 폭을 지정하지 않고 Storybook 캔버스 폭을 그대로 쓴다 — 원본과 폭이
 * 다르면 안내 문단의 줄바꿈 위치와 "or" 구분선 길이가 달라진다. 그 두 가지는 의도된
 * 차이다(FormSignIn.tsx 의 "원본과 다르게 구현한 4가지" 2·3번).
 *
 * "or" 한 줄만 다른 패밀리로 렌더되던 차이는 해소됐다. Figma Typography 컬렉션이
 * font-family/headline · font-family/text 로 재편되면서 이 화면의 본문이 전부
 * font-family/text = "LG EI Text" 가 됐고, type-body-small 이 그 패밀리를 참조한다 —
 * 이제 이 한 줄도 Design 탭과 같은 글꼴이어야 정상이다(FormSignIn.tsx 1번 참고).
 * 단 face 로드는 public/fonts/ 에 .otf 파일이 있어야 한다. 파일이 없으면 이 story
 * 전체가 폴백 폰트로 렌더되므로, 글꼴이 달라 보이면 먼저 루트 README.md 의 설치
 * 안내를 확인한다.
 *
 * 이메일 칸의 필수 표시("*")도 Design 탭과 다르게 보인다. 원본은 "*" 만 빨간색인데
 * 실제 input 의 placeholder 는 일부 글자만 다른 색으로 칠할 수 없어 나머지 글자와
 * 같은 색으로 렌더된다. 위치 · 문구 · 문구 전체의 색은 원본과 같고, 다른 것은 "*"
 * 하나의 색뿐이다. 자세한 경위는 FormSignIn.tsx 의 "원본과 다르게 구현한 4가지"
 * 4번 참고.
 */

const meta = {
  title: 'Components/FormSignIn',
  component: FormSignIn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // @storybook/addon-designs — "Design" 탭에 Figma 의 Form/SignIn 을 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
} satisfies Meta<typeof FormSignIn>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 19661:15302 그대로. Continue 는 원본과 같이 disabled 다. */
export const Default: Story = {}

/**
 * 카드를 sign-in 섹션(19661:16991)의 배경 위에 올린 모습. 카드 배경(bg/default)과
 * 섹션 배경이 갈리는 것을 확인하는 용도다. 섹션 배경은 원본의 bg/subtle 이다.
 */
export const OnSectionBackground: Story = {
  render: () => (
    <div className="flex justify-center rounded-16 bg-bg-subtle p-40">
      <FormSignIn />
    </div>
  ),
}
