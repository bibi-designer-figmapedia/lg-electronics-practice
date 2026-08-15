import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { SignIn } from './SignIn'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다.
   시트 전체(118-7098)가 아니라 화면 프레임만 가리킨다 — 시트는 화면정의서
   (Specs/Sign in)가 참조하고, 이 story 가 판정하는 것은 화면 자체다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7100'

const meta = {
  title: 'Pages/SignIn',
  component: SignIn,
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
        component: '로그인 화면 전체를 조립하는 페이지 레이어.',
      },
    },
  },
} satisfies Meta<typeof SignIn>

export default meta

type Story = StoryObj<typeof meta>

/** Figma 원본 그대로. 주석 마커 없음. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* 시트가 override 한 문구가 실제로 반영되는지 — 라이브러리 기본값
       "Lorem ipsum*" 이 아니라 "Email*" 이어야 한다. */
    await expect(canvas.getByPlaceholderText('Email*')).toBeInTheDocument()

    /* Figma 원본에서 Continue 는 비활성이다. */
    await expect(canvas.getByRole('button', { name: 'Continue' })).toBeDisabled()

    /* 소셜 로그인 3종이 전부 있는지 (Description 03-3). 이름은 ButtonSocial 이
       aria-label 로 붙이는 문구다 — 버튼 안에 텍스트가 없다. */
    for (const provider of ['Apple', 'Google', 'Facebook']) {
      await expect(
        canvas.getByRole('button', { name: `Sign in with ${provider}` }),
      ).toBeInTheDocument()
    }
  },
}
