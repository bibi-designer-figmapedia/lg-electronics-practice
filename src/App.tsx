import type { ReactElement } from 'react'
import { Button } from './components/Button'
import { PDP } from './page/PDP/PDP'

/*
 * App — 경로에 따라 페이지를 고르는 진입점.
 *
 * 라우터 라이브러리를 쓰지 않는 이유
 *   페이지가 아직 하나뿐이라 react-router 의 기능(중첩 · 로더 · 코드 스플리팅)이 쓰이는
 *   곳이 없다. 경로 하나를 고르는 데 필요한 것은 pathname 조회뿐이고 그건 표준 API 다.
 *   페이지가 늘어 중첩이나 지연 로딩이 실제로 필요해지면 그때 라우터로 갈아끼운다 —
 *   ROUTES 표가 그 교체 지점이다. (사용자와 확정한 선택)
 *
 * 이 파일에는 시각 값이 없다. 아래 랜딩 화면의 클래스는 이 작업 전부터 있던 것이고,
 * 이번 변경은 라우팅 분기와 버튼의 이동 동작 두 가지뿐이다.
 */

/* 경로 → 페이지. 여기 없는 경로는 전부 랜딩으로 떨어진다. */
const ROUTES: Record<string, ReactElement> = {
  '/pdp': <PDP />,
}

/* PDP 페이지 경로. 아래 버튼과 ROUTES 가 같은 문자열을 쓰도록 한 곳에 둔다. */
const PDP_PATH = '/pdp'

/* 기존 랜딩 화면. 내용은 그대로이고 버튼만 PDP 로 이동한다. */
function Landing() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-24 bg-bg-subtle p-32">
      <h1 className="type-title-small text-text-primary">
        LG Electronics Practice
      </h1>
      <p className="type-body-small text-text-tertiary">
        Vite 6 · React 19 · TypeScript 5 · Tailwind CSS v4 · Storybook 8
      </p>
      <Button
        onClick={() => {
          window.location.pathname = PDP_PATH
        }}
      >
        Get started
      </Button>
    </main>
  )
}

export function App() {
  return ROUTES[window.location.pathname] ?? <Landing />
}
