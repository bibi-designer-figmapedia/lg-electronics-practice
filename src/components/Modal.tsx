import { useEffect, useId } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { IconUI } from './icons/IconUI'

/*
 * Modal — 오버레이 + 카드 셸. 헤더(타이틀 + 우상단 닫기)와 푸터는 셸이 그리고,
 * 본문은 호출부가 children 으로 넣는다.
 *
 * Figma 원본 (산출물 1)
 *   modal:  https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=158-8745
 *   sheet:  https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=158-8740
 *           (화면 MBR_020301 "쿠폰 등록" — page/SignIn 위에 얹힌 모달)
 *
 *   내부 노드 (get_design_context(158:8745) 가 내준 트리 그대로)
 *     158:8745  Modal        카드                      폭 660 · 높이 428
 *     158:8746  ButtonArea   닫기 버튼 줄              높이 40
 *     158:8747  Frame        닫기 버튼 자리            padding spacing/8
 *     158:8748  Icon/UI      인스턴스, type=close      상자 24
 *     158:8749  Container    타이틀 감싸개             아래 padding spacing/20
 *     158:8750  text         "Register a coupon"       subtitle/large
 *     158:8751  Container    본문 — 이 셸의 children   gap spacing/20
 *     158:8760  Container    푸터                      위 padding 실측 24
 *     158:8761  Button       [Register] 인스턴스       폭 140 · 높이 44
 *
 *   variant 축은 없다. Figma 에 이 모달의 다른 상태가 그려져 있지 않다.
 *
 * DS Figma 에 Modal 이 없다는 것을 먼저 확인했다 (원칙 2 조사 기록)
 *   디자인시스템 파일(Ma09rS3GL9ahAGRADSWDj3)을 search_design_system 으로
 *   "Modal" · "Popup dialog" 두 번 검색했고, 이 라이브러리의 결과는 0건이다
 *   (나온 Modal · ModalTop · ModalBottom 등은 전부 다른 팀의 라이브러리다).
 *   그래서 셸만 새로 만들고, 안에 들어가는 것은 전부 기존 컴포넌트를 쓴다.
 *
 * 재사용한 컴포넌트 (원칙 2 — 이 파일이 새로 그린 글리프는 0개다)
 *   IconUI  158:8748 과 1:1. type="close" · 상자 24 는 IconUI 의 기본값이고,
 *           색 icon/default 도 기본값이라 색 클래스를 붙이지 않았다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(158:8745) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   | 용도 | Figma 변수 / 실측 | 코드 토큰 | 유틸리티 |
 *   | --- | --- | --- | --- |
 *   | 오버레이 dim | 변수 없음 — 아래 "원본에 없는 것" 1번 | --color-surface-dim | `bg-surface-dim` |
 *   | 카드 배경 | background/base/neutral | --color-bg-light | `bg-bg-light` |
 *   | 카드 테두리 색 | border/strong | --color-border-strong | `border-border-strong` |
 *   | 카드 테두리 두께 | 변수 없음, 실측 1 | --border-width-hairline | `border-hairline` |
 *   | 카드 모서리 반경 | radius/28 | --radius-28 | `rounded-28` |
 *   | 카드 안쪽 여백 | spacing/40 | --spacing-40 | `p-40` |
 *   | 카드 세로 간격 | spacing/8 | --spacing-8 | `gap-8` |
 *   | 닫기 버튼 여백 | spacing/8 | --spacing-8 | `p-8` |
 *   | 타이틀 아래 여백 | spacing/20 | --spacing-20 | `pb-20` |
 *   | 타이틀 타이포 | subtitle/large | type-subtitle-large | `type-subtitle-large` |
 *   | 타이틀 색 | selectionControl_gift/border-active | --color-text-primary | `text-text-primary` |
 *   | 푸터 위 여백 | 변수 없음, 실측 24 | --spacing-24 | `pt-24` |
 *   | 푸터 버튼 사이 간격 | spacing/8 | --spacing-8 | `gap-8` |
 *   | 닫기 아이콘 | IconUI 로 위임 | icons/IconUI.tsx 의 매핑표 참고 |
 *
 *   selectionControl_gift/border-active 는 이 시트가 타이틀 색에 물려 둔 변수이고,
 *   값은 text/primary 와 같다. 이름이 가리키는 용도(선택 컨트롤의 테두리)와 실제
 *   쓰임(제목 글자)이 어긋나므로 역할이 맞는 --color-text-primary 에 매핑했다.
 *   Button.tsx 가 기록해 둔 바인딩 불일치와 같은 처리다.
 *
 * 흡수한 값 1건 — 새 토큰을 만들지 않고 스케일 안에서 가장 가까운 것을 썼다
 *   카드 배경 background/base/neutral 은 차가운 회색이고 --color-bg-light 는
 *   중립 회색이다. 이 저장소의 팔레트에 그 색조는 없고, bg/* 5개 중 가장 가까운
 *   것이 light 다(subtle · warm 은 따뜻한 쪽으로 더 멀다). 눈에 띄지 않는 차이지만
 *   원본과 정확히 같지는 않다.
 *
 * 새로 등재한 토큰 2개 (요청자 승인)
 *   --color-surface-dim  오버레이 dim. 아래 "원본에 없는 것" 1번.
 *   --spacing-660        카드 폭. 이 셸은 폭을 갖지 않으므로 여기서 쓰지 않고
 *                        호출부(Modal.stories.tsx)가 `w-660` 으로 쓴다. 등재
 *                        근거는 src/tokens/spacing.tokens.css 의 해당 항목에 있다.
 *
 * 원본에 없는 것 2가지 — 발명이 아니라 근거가 따로 있다
 *   1. 오버레이 dim. Figma 시트는 모달 카드만 그려 두었고 뒤를 가리는 판이 없다.
 *      화면정의서 01-1 이 "기존 화면 위에 겹쳐 노출하며, 뒤 화면은 어둡게 가린다"
 *      라고 글로만 요구한다. 그래서 색은 Figma 에서 읽은 값이 아니라 요청자가
 *      승인한 값이고, 그 사실은 --color-surface-dim 주석에 적어 두었다.
 *   2. 닫는 3경로. 화면정의서 01-3 이 "우상단 닫기 버튼 / 어두운 배경 영역 클릭 /
 *      ESC 키 — 3가지 모두 닫힘"이라고 요구한다. 셋 다 onClose 를 부르기만 한다 —
 *      이 컴포넌트는 열림 여부를 갖지 않으므로 스스로 닫지 않는다.
 *
 * 옮기지 않은 값 2가지 (하드코딩하지 않고 근거를 남긴다)
 *   1. 본문 컨테이너 3개의 고정 폭 558. 카드 안쪽 폭은 578 인데 ButtonArea 만
 *      578 로 늘어나고 나머지 3개는 558 로 고정돼 있다 — 즉 본문만 오른쪽으로 20
 *      더 들어가 있고 좌우가 비대칭이다. 558 은 토큰에 없는 값이고, 옮기면 카드
 *      폭이 바뀔 때 따라오지 않는다. `w-full` 로 흡수했다: 왼쪽 정렬은 원본과
 *      같고 오른쪽 끝만 20 바깥으로 나간다. FormSignIn 이 450 · 348 · 392 고정폭에
 *      대해 내린 것과 같은 결정이다.
 *   2. 158:8764 — 카드 오른쪽 위에 절대배치된 56 짜리 빈 프레임. 채움도 글자도
 *      없고 안에 든 20 짜리 자식도 비어 있어 렌더 결과가 없다. 158:8746 의 닫기
 *      버튼과 자리가 겹치는 잔재로 보여 옮기지 않았다. FormSignIn 이 높이 0 짜리
 *      빈 Container 2개를 버린 것과 같은 처리다.
 *
 * 확정된 구현 판단 4가지
 *   - 폭은 이 셸이 정하지 않는다. 호출부가 `w-660` 으로 준다 — Input · FormSignIn 이
 *     이미 쓰는 규칙이고, 그래야 다른 폭의 모달이 같은 셸을 쓸 수 있다.
 *   - 높이도 정하지 않는다. 원본의 428 은 안쪽 여백 · 간격 · 자식 높이의 합과
 *     정확히 맞아떨어지는 결과값이라(41+40+8+62+8+152+8+68+41) 따로 심을 값이 아니다.
 *   - 본문의 세로 간격은 셸이 갖지 않는다. 카드의 gap-8 은 헤더 · 타이틀 · 본문 ·
 *     푸터 4덩어리 사이 간격이고, 본문 안쪽 간격(158:8751 의 spacing/20)은 내용마다
 *     다르므로 children 을 넣는 쪽이 정한다.
 *   - footer 는 값이 없으면 통째로 렌더하지 않는다. 빈 푸터가 pt-24 만큼 카드를
 *     늘리는 것을 막는다.
 */

export interface ModalProps {
  /** 헤더 타이틀 (158:8750). 접근 가능한 이름도 여기서 온다. */
  title: string
  /**
   * 닫기 요청. 우상단 버튼 · 배경 클릭 · ESC 3경로가 모두 이것만 부른다
   * (위 "원본에 없는 것" 2번). 넘기지 않으면 3경로 모두 아무 일도 하지 않는다.
   */
  onClose?: () => void
  /** 푸터 슬롯 (158:8760). 오른쪽 정렬된다. 없으면 푸터를 그리지 않는다. */
  footer?: ReactNode
  /** 카드 본문 (158:8751 자리). */
  children: ReactNode
  /** 카드에 붙는 클래스. 폭은 여기로 받는다 — 위 "확정된 구현 판단" 1번 참고. */
  className?: string
}

/** 화면 MBR_020301 의 모달 셸. */
export function Modal({ title, onClose, footer, children, className = '' }: ModalProps) {
  const titleId = useId()

  /* 화면정의서 01-3 의 ESC 경로. onClose 가 없으면 리스너를 걸지 않는다. */
  useEffect(() => {
    if (!onClose) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  /* 화면정의서 01-3 의 배경 클릭 경로. 카드 안에서 시작된 클릭이 위로 올라와
     모달을 닫아 버리지 않도록, 판 자체가 눌린 경우만 센다. */
  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose?.()
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim"
    >
      {/* 158:8745 — 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex flex-col items-start justify-center gap-8 rounded-28 border-hairline border-border-strong bg-bg-light p-40 ${className}`}
      >
        {/* 158:8746 — ButtonArea */}
        <div className="flex w-full items-center justify-end">
          {/* 158:8747 */}
          <button type="button" aria-label="Close" onClick={onClose} className="flex items-center p-8">
            {/* 158:8748 — 접근 가능한 이름은 위 버튼이 갖는다. */}
            <IconUI type="close" aria-hidden="true" />
          </button>
        </div>

        {/* 158:8749 */}
        <div className="flex w-full flex-col items-start pb-20">
          <h2 id={titleId} className="type-subtitle-large text-text-primary">
            {title}
          </h2>
        </div>

        {/* 158:8751 — 본문 */}
        {children}

        {/* 158:8760 — 푸터 */}
        {footer ? (
          <div className="flex w-full items-start justify-end gap-8 pt-24">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
