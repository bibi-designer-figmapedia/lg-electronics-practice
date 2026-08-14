import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

/*
 * Elevation gallery.
 *
 * Two things make this file different from the other four galleries:
 *
 *   1. The `--shadow-*` steps are NOT from Figma. design-tokens.css says so
 *      outright: the Figma file defines no shadow effect variables, only the
 *      two shadow *colors* (see the Colors gallery). These three steps predate
 *      the Figma extraction and are kept so existing `shadow-*` utilities keep
 *      working. The warning below repeats that in the UI so nobody treats
 *      these as design-approved values. There is no `design` parameter here
 *      for the same reason — there is no Figma node to point at.
 *
 *   2. Their values cannot be read from `:root`. Tailwind's shadow utilities
 *      inline the step's value instead of referencing the variable, so the
 *      custom property is never emitted. The rows therefore read the computed
 *      `box-shadow` off the rendered card, which is the value that actually
 *      applies.
 */

const SHADOW_STEPS = ['shadow-sm', 'shadow-md', 'shadow-lg'] as const

function ShadowCard({ utility }: { utility: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [applied, setApplied] = useState('')

  useEffect(() => {
    if (!cardRef.current) return
    setApplied(getComputedStyle(cardRef.current).boxShadow)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={cardRef}
        className={`h-64 w-full rounded-12 bg-surface-card ${utility}`}
      />
      <code className="type-body-default-strong">{utility}</code>
      <span className="type-body-small break-all text-text-tertiary">
        --{utility} · {applied || '—'}
      </span>
    </div>
  )
}

function ElevationGallery() {
  return (
    <div className="bg-bg-subtle p-24 text-text-primary">
      <h1 className="type-title-small">Elevation</h1>

      <div className="mt-16 rounded-8 border border-state-warning bg-surface-toast-warning p-16">
        <p className="type-body-default-strong text-text-on-toast-warning">
          이 3 스텝은 Figma 출처가 아니다.
        </p>
        <p className="type-body-small mt-4 text-text-on-toast-warning">
          Figma 파일에는 그림자 효과 변수가 없고 그림자 *색상* 두 개만 있다. 아래 값은
          Figma 추출 이전부터 있던 것으로, 기존 shadow-* 유틸리티가 계속 동작하도록
          남겨둔 것이다. Figma 가 실제 elevation 변수를 게시하면 교체 대상이다.
        </p>
      </div>

      <div className="mt-32 grid grid-cols-1 gap-32 sm:grid-cols-3">
        {SHADOW_STEPS.map((utility) => (
          <ShadowCard key={utility} utility={utility} />
        ))}
      </div>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">카드 위에서</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          bg-subtle 배경 위에 올린 surface-card. 단계가 올라갈수록 면이 떠 보인다.
        </p>
        <div className="mt-16 flex flex-wrap gap-24">
          {SHADOW_STEPS.map((utility) => (
            <div
              key={utility}
              className={`rounded-12 bg-surface-card p-24 ${utility}`}
            >
              <p className="type-body-default-strong">카드 제목</p>
              <p className="type-body-small mt-4 text-text-tertiary">{utility}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof ElevationGallery> = {
  title: 'Design Tokens/Elevation',
  component: ElevationGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'src/tokens/design-tokens.css 의 --shadow-* 3 스텝. Figma 출처가 아니며, 값은 렌더된 카드의 계산된 box-shadow 에서 읽는다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AllShadows: Story = {}
