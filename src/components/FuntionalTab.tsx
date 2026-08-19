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
 *   목록 폭 상한           변수 없음, 실측 1440    --container-container       max-w-container
 *   칸 사이 간격           변수 없음, 실측 30      --spacing-24                gap-24
 *   화살표 상자            변수 없음, 실측 48      --spacing-48                size-48
 *
 *   새로 만든 토큰 없음. 루트 밴드의 조합(max-w-viewport · border-b-hairline ·
 *   border-border-default · px-viewport-inset · py-24)은 ComponentTitle 의 Case=tab 이
 *   이미 쓰고 있는 것과 같다.
 *
 * 좌우 인셋을 이 컴포넌트가 갖는 이유 (확정된 인셋 모델의 full-bleed 갈래)
 *   인셋 모델에는 갈래가 둘 있다. 일반 섹션은 페이지 래퍼가 px-viewport-inset 을 주고
 *   컴포넌트는 인셋을 갖지 않는다(PDP 의 contents 가 그렇다). 이 컴포넌트는 그쪽이 아니다 —
 *   자체 배경(bg/warm)과 아래쪽 구분선이 화면 전체 폭인 full-bleed 밴드이고, 그런 밴드는
 *   바깥이 폭을 채우면서 배경을 갖고 안쪽 콘텐츠가 인셋을 갖는다. 페이지가 padding 으로
 *   인셋을 주면 배경과 구분선까지 함께 들어가 밴드가 아니게 된다.
 *   같은 갈래에 HeaderNotification · Footer · HeroBanner · ComponentTitle 의 Case=tab 이 있고,
 *   특히 Case=tab 은 이 밴드 바로 위에 놓이므로 둘의 인셋이 같아야 한다(둘 다 240).
 *
 * 칸 폭과 간격 — 왜 고정 폭이 아니라 균등 분할인가 (요청자 확정)
 *   Figma 의 "category icon set"(19661:18760)은 폭 1440 안에 칸 7개를 x 0 · 210 · 420 ·
 *   630 · 840 · 1050 · 1260 으로 놓는다. 칸 폭이 180 이므로 authoring 된 간격은 30 이고
 *   7 × 180 + 6 × 30 = 1440 으로 프레임에 정확히 들어맞는다.
 *
 *   이전 구현은 칸을 180 으로 고정하고 간격을 justify-between 의 남는 공간에 맡겼다. 남는
 *   공간이 0 이하가 되는 폭(줄 폭이 1260 미만)에서 간격이 0 이 되고, 칸이 맞닿아 이웃한
 *   설명문이 공백 없이 이어졌다. 간격이 값이 아니라 계산 결과였던 것이 원인이다.
 *
 *   그래서 간격을 gap 으로 명시하고 칸은 flex-1 로 균등 분할한다. 실측 30 은 우리 스페이싱
 *   스케일에 없는 값이고, 없는 값을 위해 스텝을 새로 등재하지 않기로 요청자가 확정했다 —
 *   가장 가까운 기존 스텝인 24 로 흡수한다. 대가는 1920 기준 칸 폭이 180 에서 185 로 5
 *   커지는 것이다(글자 블록은 자기 상한 180 을 지키므로 실제 글자 폭은 그대로고, 남는 5 는
 *   칸 안쪽 여유가 된다). 이 편차는 승인된 것이며 버그로 보고 되돌리지 말 것.
 *
 * 화살표가 인셋 밖(거터)에 놓이는 것은 원본 그대로다 (좌표로 확인)
 *   get_metadata(19661:18858) 실측은 좌화살표 200–248 · 목록 240–1680 · 우화살표 1720–1768
 *   이다. 즉 화살표는 목록의 1440 밴드 밖, 좌우 240 거터 안에 있다.
 *   1920 에서 콘텐츠 합은 48 + 40 + 1440 + 40 + 48 = 1616 이고 인셋 안쪽 폭 1440 보다 넓어서
 *   justify-center 가 좌우로 대칭으로 넘치게 만든다 — 목록 240–1680 · 우화살표 1720–1768 로
 *   원본과 같고, 넘친 화살표는 240 인셋(거터) 안에 들어간다. 좌화살표만 152–200 으로 원본의
 *   200–248 보다 48 왼쪽이다. 원본 자체가 비대칭이라(좌화살표 오른쪽 끝 248 이 목록 시작
 *   240 을 8 침범한다) 우화살표 쪽 간격 40 을 좌우 대칭으로 맞추는 쪽을 택했다. 이 48 은
 *   남겨둔 차이이고 근사하지 않았다.
 *   목록에 shrink-0 을 주는 이유가 이것이다. 없으면 목록이 인셋 안쪽 폭에서 화살표 몫
 *   176 을 뺀 1264 로 줄어들어 1920 에서도 폭 1440 이 나오지 않는다.
 *   1920 보다 좁아지면 목록은 인셋 안쪽 폭(폭 − 480)을 그대로 쓰고, 칸이 flex-1 이라 줄어든
 *   폭을 균등하게 나눠 갖는다. 화살표는 계속 인셋 안으로 넘치므로(한쪽 88 ≤ 240) 가로
 *   스크롤은 생기지 않는다.
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

      {/* 19661:18760 category icon set — 폭 상한 1440. 칸은 균등 분할이고 간격은 gap-24 다.
          shrink-0 이 필요한 이유는 아래 "화살표가 인셋 밖(거터)에 놓이는 것" 항목에 있다. */}
      <ul className="flex w-full max-w-container shrink-0 items-start gap-24">
        {items.map((item, index) => (
          /* Figma 원본의 마지막 두 칸이 라벨까지 똑같아서 라벨만으로는 key 가 유일하지
             않다. 순서가 곧 정체성인 정적 목록이므로 인덱스를 쓴다(CategoryMenu 선례).

             칸은 flex-1 로 균등 분할하고 min-w-0 으로 내용 최소폭을 풀어 준다. 폭을 고정하면
             줄이 좁아질 때 칸이 서로 맞닿는다(아래 "칸 폭과 간격" 참고). 안쪽 글자 블록이
             자기 상한 180 을 넘지 않으므로 남는 여유는 justify-center 가 칸 안에서 나눈다. */
          <li key={index} className="flex min-w-0 flex-1 justify-center">
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
