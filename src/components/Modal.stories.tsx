import { useId, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './Button'
import { CheckBoxSet } from './CheckBoxSet'
import { Input } from './Input'
import { Modal } from './Modal'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=158-8745'

/*
 * 스토리는 1개다 — 화면 MBR_020301 "쿠폰 등록" 모달.
 *
 * 이 파일이 조립을 맡는 이유: 신규 컴포넌트는 셸 1개만 만들기로 했으므로 쿠폰 모달
 * 자체는 컴포넌트가 아니라 셸 + 기존 컴포넌트의 조합이고, 그 조합을 보여주는 자리가
 * 스토리다. 안에 들어간 4개는 전부 기존 것이다 — Input · CheckBoxSet · Button ·
 * (셸 안의) IconUI.
 *
 * 상태 2개(입력값 · 동의)는 화면정의서 04-1 이 요구하는 [Register] 활성 조건을 그리기
 * 위한 것이다. 그 외의 동작은 넣지 않았다 — 등록 API · 로딩 · 04-2 의 성공/실패 분기는
 * 범위 밖이고, 02-1 의 입력 형식 제약(대문자·최대 20자)과 02-2 의 포커스아웃 검증도
 * 요청 범위에 없어 구현하지 않았다. 버튼은 콜백만 부른다.
 */

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    /* 셸이 오버레이를 fixed 로 깔기 때문에 캔버스 전체를 준다. */
    layout: 'fullscreen',
    // @storybook/addon-designs — "Design" 탭에 MBR_020301 시트의 Modal 프레임을 붙인다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '타이틀 · 닫기 · 푸터를 갖고 본문을 children 으로 받는 모달 셸.',
      },
    },
  },
  args: {
    title: 'Register a coupon',
    onClose: fn(),
    /* 본문은 아래 render 가 조립한다. 셸의 children 은 필수 prop 이라 자리만 채운다. */
    children: null,
  },
} satisfies Meta<typeof Modal>

/** 화면정의서 04-2 의 등록 동작은 범위 밖이다 — 버튼은 콜백만 부른다. */
const handleRegister = fn()

export default meta
type Story = StoryObj<typeof meta>

/*
 * 원본과 다르게 구현한 3가지 — 전부 기존 컴포넌트를 그대로 쓰기로 한 결과다.
 *
 *   1. 입력칸. 시트의 "Text Input"(158:8757)은 디자인시스템 Input 의 인스턴스가
 *      아니라 손으로 그린 프레임이라 테두리 색 · 모서리 반경 · 좌우 여백이 DS 의
 *      Input 과 다르다(반경은 시트 6, DS 12). 높이 44 는 같다. 새 variant 를 만드는
 *      대신 DS 의 `Input size="md"` 를 그대로 썼다 — 재사용이 요청 조건이고, 이
 *      차이는 시트 쪽이 컴포넌트를 안 쓴 데서 온다.
 *   2. [Register] 의 비활성 표현. 시트는 활성 외형(흰 배경 · 검정 테두리 · 검정 라벨)
 *      전체에 불투명도 40 을 걸어 비활성을 그린다. Button 의 secondary disabled 는
 *      불투명도 대신 테두리 · 라벨 색을 흐린 토큰으로 바꾼다. 둘 다 옅은 회색으로
 *      보이지만 같은 픽셀은 아니다.
 *   3. [Register] 라벨의 행간. 시트는 cta/medium(행간 16), Button 은
 *      body/default-strong(행간 20)이다. 높이 44 가 고정이라 렌더 결과는 같다.
 *
 * 라벨 "Coupon code" 는 Figma 원본(158:8756)대로 body/default-strong + dark-gray-1
 * 이다. 요청 문구의 "라벨은 body/default" 와 어긋나는 지점이고, Figma 를 따르기로
 * 요청자가 확정했다.
 */
function RegisterCouponModal({ title, onClose }: { title: string; onClose?: () => void }) {
  const codeId = useId()
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)

  /* 화면정의서 04-1: 코드 입력과 동의 체크를 둘 다 만족해야 활성. */
  const canRegister = code.trim().length > 0 && agreed

  return (
    <Modal
      title={title}
      onClose={onClose}
      className="w-660"
      footer={
        /* 158:8761 — Button 인스턴스. 폭 140 은 --spacing-140. */
        <Button
          variant="secondary"
          size="sm"
          trailingIcon={false}
          disabled={!canRegister}
          onClick={handleRegister}
          className="w-140"
        >
          Register
        </Button>
      }
    >
      {/* 158:8751 — 본문. 세로 간격은 본문을 넣는 쪽이 정한다(Modal.tsx 참고). */}
      <div className="flex w-full flex-col items-start gap-20">
        {/* 158:8752 / 158:8753 — 안내 문구 */}
        <p className="type-body-default text-text-secondary">
          Enter your coupon code to add it to My Coupons.
        </p>

        {/* 158:8754 / 158:8755 — 라벨 + 입력칸 */}
        <div className="flex w-full flex-col items-start gap-8">
          <label htmlFor={codeId} className="type-body-default-strong text-text-secondary">
            Coupon code
          </label>
          {/* 158:8757 — Input 인스턴스. 위 "원본과 다르게" 1번 참고.
              placeholder 색은 Preflight 가 흐리는 것을 원본의 text/disclaimer 로
              되돌린 것이다(FormSignIn 선례). */}
          <Input
            id={codeId}
            size="md"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter coupon code (ex-LG2026SPRING)"
            className="placeholder:text-text-disclaimer"
          />
        </div>

        {/* 158:8759 — CheckBoxSet 인스턴스. Figma 는 Shape=Round · Size=Large 다. */}
        <CheckBoxSet
          shape="round"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          label="I understand this coupon cannot be registered again once used."
        />
      </div>
    </Modal>
  )
}

/** 화면 MBR_020301 — 기본 상태(입력 없음 · 동의 해제)라 [Register] 는 비활성이다. */
export const RegisterCoupon: Story = {
  render: (args) => <RegisterCouponModal title={args.title} onClose={args.onClose} />,
}
