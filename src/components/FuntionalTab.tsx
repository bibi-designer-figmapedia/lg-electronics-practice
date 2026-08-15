import type { HTMLAttributes, ReactNode } from 'react'
import { IconUI, type IconUIType } from './icons/IconUI'
import { FuntionalTabItem } from './FuntionalTabItem'
import type { IconPLPName } from './icons/IconPLP'

/*
 * FuntionalTab — FuntionalTabItem 을 한 줄로 늘어놓은 PLP 카테고리 필터 밴드.
 *
 * 이름의 "Funtional" 은 오타가 아니라 Figma 레이어명 그대로다.
 *
 * Figma 원본 (산출물 1)
 *   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-18858
 *   variant 축이 없는 단일 symbol 이다. 내부는 FuntionalTabItem 인스턴스 7개와
 *   icon_page_arrow 인스턴스 2개(19661:18808 · 19661:18809)가 전부다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:18858) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                   Figma 변수 / 실측       코드 토큰                   유틸리티
 *   밴드 배경              bg/warm                 --color-bg-warm             bg-bg-warm
 *   아래 구분선 색         border/default          --color-border-default      border-border-default
 *   아래 구분선 두께       변수 없음, 실측 1       --border-width-hairline     border-b-hairline
 *   화살표↔목록 간격       spacing/40              --spacing-40                gap-40
 *   상하 padding           spacing/24              --spacing-24                py-24
 *   화살표 아이콘 색       icon/default            --color-icon-default        text-icon-default
 *   밴드 폭                변수 없음, 실측 1920    --container-viewport        max-w-viewport
 *   좌우 인셋              변수 없음, 실측 240     --spacing-viewport-inset    px-viewport-inset
 *   목록 폭                변수 없음, 실측 1440    --container-container       max-w-container
 *   화살표 상자            변수 없음, 실측 48      --spacing-48                size-48
 *
 *   새로 만든 토큰 없음. 루트 밴드의 조합(max-w-viewport · border-b-hairline ·
 *   border-border-default · px-viewport-inset · py-24)은 ComponentTitle 의 Case=tab 이
 *   이미 쓰고 있는 것과 같다.
 *
 * 칸 사이 간격에 토큰이 필요 없는 이유
 *   Figma 의 "category icon set"(19661:18760)은 폭 1440 에 justify-between 이고 칸이
 *   7개 × 180 이다. 남는 180 을 6칸으로 나눈 30 은 Figma 가 계산해 낸 결과값이지 값으로
 *   지정된 간격이 아니다. justify-between 을 그대로 쓰면 같은 30 이 나오므로 gap 토큰을
 *   만들지 않았다 — 만들었다면 없는 디자인 결정을 발명하는 것이다.
 *
 * 화살표가 인셋 밖으로 나가는 것은 원본 그대로다 (좌표로 확인)
 *   get_metadata 기준 좌화살표 152–200 · 목록 240–1680 · 우화살표 1720–1768 이다.
 *   즉 콘텐츠 합(48 + 40 + 1440 + 40 + 48 = 1616)이 인셋 안쪽 폭 1440 보다 넓어서
 *   좌우로 대칭으로 넘친다. px-viewport-inset + justify-center 를 그대로 쓰면 flexbox 가
 *   같은 결과를 낸다 — 화살표를 인셋 안으로 밀어 넣으려고 값을 바꾸지 않았다.
 *   목록에 shrink-0 을 주는 이유가 이것이다. 없으면 목록이 1264 로 줄어 칸 간격이 어긋난다.
 *
 * 화살표 아이콘 — Icon/UI 재사용과 그 대가 (요청자 확정)
 *   Figma 원본은 icon_page_arrow(48 프레임, Arrow_M 벡터, 획 두께 2.5, square cap)라는
 *   별도 컴포넌트다. 저장소에는 없다. 새 아이콘 파일을 만드는 대신 이미 있는 Icon/UI 의
 *   arrowLeft · arrowRight 를 48 로 키워 쓰기로 요청자가 확정했다.
 *   대가: Icon/UI 는 24 프레임에 획 1.5 라 2배로 키우면 화면상 획이 3 이 된다. 원본은 2.5 다.
 *   즉 원본보다 살짝 굵다. **사용자가 인지하고 선택한 승인된 편차이며, 버그로 보고 되돌리지
 *   말 것.** 원본 획을 그대로 재현하려면 icon_page_arrow 를 별도 아이콘 컴포넌트로 새로
 *   만들어야 하는데, 그 컴포넌트를 만들지 않는 쪽으로 확정됐다.
 *   실측 대조 결과(렌더 산출물과 Figma 스크린샷의 픽셀 비교): 잉크 총량 비 1.03, 화살표
 *   bbox 는 Figma 23×42 대 코드 22×40 이다. 확대해야 구분되는 수준이고 1배에서는 사실상
 *   같아 보인다.
 *   resizedTo 를 쓰지 않는 이유: 그 prop 은 축소 렌더에서 획이 얇아지는 것을 되돌리는
 *   보정이고, 여기에 48 을 넘기면 획이 오히려 1.5 로 얇아져 원본(2.5)에서 더 멀어진다.
 *   그냥 키우는 쪽(3)이 원본에 더 가깝다.
 *   크기를 IconUI 에 직접 넘기지 않는 것은 ButtonText 가 기록한 이유와 같다 — IconUI 가
 *   들고 있는 size-24 가 빌드된 CSS 에서 뒤에 나와 이긴다. 그래서 크기는 버튼이 정하고
 *   IconUI 에는 size-full 을 넘긴다.
 *
 * 확정된 구현 판단
 *   - 화살표는 <button> 이고 onPrev / onNext 를 받는다(요청자 확정, HeaderNotification 선례).
 *     핸들러를 안 주면 버튼은 그대로 렌더되고 아무 일도 하지 않는다.
 *   - 화살표 aria-label 은 Figma 에 없다. 버튼의 역할을 그대로 옮긴 문구를 쓰고, IconUI 는
 *     aria-hidden 으로 빼서 이름이 두 번 읽히지 않게 한다(HeaderNotification 과 같은 규칙).
 *   - 목록은 <ul>/<li> 다. 카테고리 목록을 <ul> 로 내는 것은 CategoryMenu 선례와 같다.
 *   - 칸 내용은 items prop 으로 받는다. Figma 의 7칸은 story 기본값에 있다.
 *   - 내부 state 가 없다. 어떤 칸이 active 인지도, 화살표가 무엇을 하는지도 호출부가 정한다.
 *     Figma 에 없는 variant · 옵션(스크롤 · 페이징 · disabled 화살표)은 만들지 않았다.
 */

export interface FuntionalTabItemData {
  /** IconPLP 의 variant 이름. */
  icon: IconPLPName
  /** 굵은 라벨. */
  label: ReactNode
  /** 라벨 아래 설명문. */
  description: ReactNode
  /** 링크 목적지. */
  href: string
  /** 현재 선택된 칸인지. Figma 의 state=active 에 대응한다. */
  active?: boolean
}

export interface FuntionalTabProps extends HTMLAttributes<HTMLDivElement> {
  /** 칸 목록. Figma 배치 순서대로 넘긴다. */
  items: FuntionalTabItemData[]
  /** 왼쪽 화살표. */
  onPrev?: () => void
  /** 오른쪽 화살표. */
  onNext?: () => void
}

/**
 * 화살표 하나 = 버튼 하나. 크기를 정하는 쪽이 버튼이라는 점이 핵심이다
 * (위 "화살표 아이콘" 참고). 포커스 표시는 Tab · HeaderNotification 과 같은 조합이다.
 */
function PageArrowButton({
  type,
  label,
  onClick,
}: {
  type: IconUIType
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-48 shrink-0 items-center justify-center focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus"
    >
      <IconUI type={type} className="size-full" aria-hidden />
    </button>
  )
}

/** Figma "FuntionalTab" 의 코드 정본. */
export function FuntionalTab({
  items,
  onPrev,
  onNext,
  className = '',
  ...props
}: FuntionalTabProps) {
  return (
    <div
      className={`flex w-full max-w-viewport items-center justify-center gap-40 border-b-hairline border-border-default bg-bg-warm px-viewport-inset py-24 ${className}`}
      {...props}
    >
      {/* 19661:18808 icon_page_arrow — 원본은 오른쪽 화살표를 뒤집은 인스턴스다. */}
      <PageArrowButton type="arrowLeft" label="Previous categories" onClick={onPrev} />

      {/* 19661:18760 category icon set — 폭 1440 고정, 남는 폭은 justify-between 이 나눈다. */}
      <ul className="flex w-full max-w-container shrink-0 items-start justify-between">
        {items.map((item, index) => (
          /* Figma 원본의 마지막 두 칸이 라벨까지 똑같아서 라벨만으로는 key 가 유일하지
             않다. 순서가 곧 정체성인 정적 목록이므로 인덱스를 쓴다(CategoryMenu 선례). */
          <li key={index}>
            <FuntionalTabItem
              icon={item.icon}
              label={item.label}
              description={item.description}
              href={item.href}
              state={item.active ? 'active' : 'default'}
            />
          </li>
        ))}
      </ul>

      {/* 19661:18809 icon_page_arrow */}
      <PageArrowButton type="arrowRight" label="Next categories" onClick={onNext} />
    </div>
  )
}
