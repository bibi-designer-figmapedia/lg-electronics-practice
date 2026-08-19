import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { IconPLP, type IconPLPName } from './icons/IconPLP'

/*
 * FuntionalTabItem — PLP 카테고리 필터 탭 1칸. 아이콘 + 라벨 + 설명문.
 *
 * 이름의 "Funtional" 은 오타가 아니라 Figma 레이어명 그대로다. 원본이 그렇게 쓰여 있고,
 * 코드에서만 고치면 Figma 이름으로 검색했을 때 이 파일이 걸리지 않는다.
 *
 * Figma 원본 (산출물 1)
 *   컴포넌트 프레임: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19907
 *   state=active:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19905
 *   state=default:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19906
 *   variant 2개를 모두 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:19907) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                     Figma 변수 / 실측       코드 토큰                유틸리티
 *   라벨 타이포              cta/medium              (composite)              type-cta-medium
 *   설명문 타이포            badge/small             (composite)              type-badge-small
 *   라벨·설명문 색           text/primary            --color-text-primary     text-text-primary
 *   아이콘 색 (default)      icon/default            --color-icon-default     text-icon-default
 *   아이콘 색 (active)       icon/active             --color-icon-active      text-icon-active
 *   밑줄 색                  state/error             --color-state-error      bg-state-error
 *   아이콘 프레임            변수 없음, 실측 64      --spacing-64             size-64 (IconPLP 기본값)
 *   아이콘↔글자 간격         변수 없음, 실측 12      --spacing-12             gap-12
 *   라벨↔설명문 간격         변수 없음, 실측 8       --spacing-8              gap-8
 *   라벨↔밑줄 간격           변수 없음, 실측 4       --spacing-4              gap-4
 *   밑줄 너비                변수 없음, 실측 18      --spacing-18             w-18
 *   밑줄 두께                변수 없음, 실측 2       --spacing-underline      h-underline
 *   글자 블록 너비 상한      변수 없음, 실측 180     --spacing-180            max-w-180
 *
 *   Primary Color/Black 도 get_variable_defs 에 함께 나오지만 원시 변수이고 text/primary ·
 *   icon/default 와 같은 값으로 해석되므로 역할 토큰 뒤에 그대로 둔다 — IconPLP 가 같은
 *   판단을 이미 기록해 두었다.
 *
 *   --spacing-180 은 이 컴포넌트 때문에 token-guardian 이 새로 등재한 유일한 토큰이다.
 *   나머지는 전부 기존 토큰으로 표현된다.
 *
 * 밑줄 색을 brand/primary 가 아니라 state/error 로 매핑한 근거
 *   header/Tab.tsx 의 밑줄은 brand/primary 다. 값은 같지만 Figma 가 이 노드(19661:18870)에
 *   실제로 바인딩한 변수는 state/error 이고, 요청자가 "Figma 바인딩 그대로" 로 확정했다.
 *   두 토큰의 값이 같다는 이유로 한쪽 이름을 빌려 쓰면 나중에 한쪽만 바뀔 때 조용히 어긋난다.
 *
 * 확정된 구현 판단
 *   - 요소 종류: Figma 는 정의하지 않는다. 카테고리 이동 항목이므로 header/Tab.tsx 선례대로
 *     <a> 로 렌더하고 state=active 에 aria-current="page" 를 붙인다(요청자 확정).
 *   - default 에 밑줄 자리를 남기지 않는다. Tab.tsx 는 opacity-0 으로 자리를 잡아 두지만
 *     이 컴포넌트의 Figma 원본은 default variant 에 밑줄 노드 자체가 없다 — 그래서 높이가
 *     active 134 / default 128 로 다르다. Figma 원본 그대로 두는 것이 요청자 확정 사항이고,
 *     FuntionalTab 의 행이 items-start 라 윗변은 어차피 맞는다.
 *   - TabLabel 프레임은 default 가 items-start, active 가 items-center 로 export 되지만
 *     그 안의 라벨이 부모 폭을 꽉 채우는 한 줄이라 두 값의 렌더 결과가 같다. 분기하지 않고
 *     items-center 하나로 둔다 — 시각 차이는 없고 분기만 는다.
 *   - 아이콘은 IconPLP(node-id=19661-19851) 를 그대로 재사용한다. 이 탭이 쓰는 6종이
 *     그 컴포넌트 세트의 6개 variant 와 정확히 같은 집합이다. 새로 그리지 않았다.
 *   - 아이콘 색은 className 으로 넘기되 important 수식자를 붙인다. IconPLP 는
 *     text-icon-default 를 자기 클래스로 직접 들고 있는데, 빌드된 CSS 에서 규칙 순서가
 *     .text-icon-active -> .text-icon-default 라 특이도가 같은 상태로는 default 가 이긴다
 *     (측정: storybook-static 의 preview CSS 에서 각각 29640 · 29689 바이트 위치. Tailwind 가
 *     같은 네임스페이스 안에서 이름순으로 내보내기 때문에 active 가 앞이다).
 *     HeaderNotification 이 text-icon-white 를 그냥 넘겨도 되는 것은 white 가 default 보다
 *     이름순으로 뒤라서 생긴 우연이고, active 에는 그 우연이 없다.
 *     그래서 순서에 기대지 않고 important 로 이긴다 — 값은 여전히 토큰 유틸리티 하나이고
 *     raw 값이 끼어들지 않는다. 빌드 산출 CSS 로 실제로 이기는 것을 확인했다.
 *   - 아이콘 크기는 넘기지 않는다. IconPLP 기본값이 size-64 이고 Figma 도 64 라 그대로 맞다.
 *     ButtonText 가 IconUI 를 줄일 때 겪은 문제(뒤에 나오는 size-24 가 이김)는 여기서는
 *     생기지 않는다 — 바꿀 필요가 없기 때문이다.
 *   - 아이콘은 aria-hidden 이다. 바로 옆에 같은 뜻의 라벨 텍스트가 있어 IconPLP 자신의
 *     role="img" 라벨까지 읽히면 이름이 두 번 읽힌다.
 *
 * 포커스 표시
 *   Figma 에 focus variant 가 없으므로 시각 표현을 발명하지 않고 이미 있는 토큰 2개만
 *   조합했다 — Tab · HeaderNotification 과 같은 문자열이다.
 *     색   --color-border-focus     outline-border-focus
 *     두께 --border-width-hairline  outline-(length:--border-width-hairline)
 *
 * 프레젠테이셔널 컴포넌트다
 *   내부 state 가 없다. 어떤 칸이 active 인지는 호출부가 정한다. Figma 에 없는 variant ·
 *   옵션(hover · disabled · size 등)은 만들지 않았다.
 */

export type FuntionalTabItemState = 'default' | 'active'

export interface FuntionalTabItemProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Figma 의 state 축. 값 2개가 전부다. */
  state?: FuntionalTabItemState
  /** IconPLP 의 variant 이름. Figma 인스턴스가 참조하는 것과 같은 컴포넌트 세트다. */
  icon: IconPLPName
  /** 굵은 라벨. Figma 의 `title` 텍스트(19661:18869). */
  label: ReactNode
  /** 라벨 아래 설명문. Figma 의 `txt` 텍스트(19661:18871). */
  description: ReactNode
}

/**
 * 아이콘 색만 state 로 갈린다. active 쪽의 important 수식자는 IconPLP 가 들고 있는
 * text-icon-default 를 이기기 위한 것이다 — 근거는 위 "확정된 구현 판단" 참고.
 */
const iconStateClasses: Record<FuntionalTabItemState, string> = {
  default: '',
  active: 'text-icon-active!',
}

/** Figma "FuntionalTabItem" 의 코드 정본. */
export function FuntionalTabItem({
  state = 'default',
  icon,
  label,
  description,
  className = '',
  ...props
}: FuntionalTabItemProps) {
  return (
    <a
      className={`inline-flex flex-col items-center gap-12 focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus ${className}`}
      aria-current={state === 'active' ? 'page' : undefined}
      {...props}
    >
      {/* 19661:19877 Icon/PLP — 크기는 IconPLP 기본값(size-64)이 Figma 와 같다. */}
      <IconPLP name={icon} className={iconStateClasses[state]} aria-hidden />

      {/* 19661:18867 txt — 이 블록이 칸의 글자 폭을 정한다. 고정이 아니라 상한이다:
          Figma 가 authoring 한 180 을 넘지 않으면서, 칸이 그보다 좁아지면 함께 줄어든다.
          고정 폭이던 때는 칸이 좁아져도 이 블록이 180 을 지켜 이웃 칸과 맞닿았다. */}
      <span className="flex max-w-180 flex-col items-center gap-8">
        {/* 19661:18868 TabLabel */}
        <span className="flex flex-col items-center gap-4">
          <span className="type-cta-medium w-full text-center text-text-primary">{label}</span>
          {/* 19661:18870 selected — active 에만 있는 노드다(위 판단 2). */}
          {state === 'active' && (
            <span aria-hidden="true" className="h-underline w-18 bg-state-error" />
          )}
        </span>
        {/* 19661:18871 txt */}
        <span className="type-badge-small text-center text-text-primary">{description}</span>
      </span>
    </a>
  )
}
