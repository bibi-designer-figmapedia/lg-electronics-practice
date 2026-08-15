import type { ButtonHTMLAttributes } from 'react'
import { IconUI } from './icons/IconUI'

/*
 * ButtonText — 텍스트 라벨 + 오른쪽 chevron 으로 이루어진 링크형 버튼.
 *
 * Figma 원본 (산출물 1)
 *   component set:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3700
 *   state=default:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3698
 *   state=hover:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3699
 *   부모 section:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19586-12041
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:3700) 로 읽었다.
 * 실제 값은 raw 로 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                        Figma 변수        코드 토큰                 유틸리티
 *   라벨 타이포                 subtitle/         (합성 유틸리티)           type-subtitle-medium-strong
 *                               medium-strong
 *   라벨 색                     text/primary      --color-text-primary      text-text-primary
 *   아이콘 색                   icon/default      --color-icon-default      text-icon-default (IconUI 기본값)
 *   라벨↔아이콘 gap             spacing/8         --spacing-8               gap-8
 *   콘텐츠↔밑줄 gap             spacing/8         --spacing-8               gap-8
 *   아이콘 정사각 크기          (변수 없음)       --spacing-18              size-18
 *   밑줄 두께                   (변수 없음)       --spacing-hairline        h-hairline
 *   밑줄 색                     border/focus      --color-border-focus      bg-border-focus
 *
 *   아이콘 크기와 밑줄 두께 2개는 Figma 에서 변수에 바인딩되어 있지 않은 실측값이라
 *   대응 토큰이 없었고, token-guardian 이 --spacing-18 · --spacing-hairline 으로
 *   등재한 뒤에 구현했다. 밑줄은 CSS border 가 아니라 채워진 사각형 노드이므로
 *   border-hairline 이 아니라 h-hairline + bg-border-focus 다.
 *
 * 구조 (get_metadata + get_design_context 로 확인)
 *
 *   state=default                     state=hover
 *     row (gap-8)                       column (gap-8)
 *     ├ Text_Button                     ├ ButtonContent  ← default 의 row 와 동일
 *     └ Icon/UI (size-18)               │   ├ Text_Button
 *                                       │   └ Icon/UI (size-18)
 *                                       └ "selected" (h-hairline, w-full)
 *
 *   hover 가 default 보다 높은 이유는 밑줄 단독이 아니라 `gap-8 + h-hairline` 두 개의
 *   합이다. 밑줄은 text-decoration 이 아니라 별도의 채워진 사각형 노드이므로
 *   underline / underline-offset 으로 구현하면 Figma 구조와 어긋난다.
 *
 * 확정된 판단 4가지:
 *   - state prop 을 만들지 않는다. Figma 의 variant 축은 state 하나뿐이고 그 값이
 *     default·hover 라서, 정적 prop 이 아니라 CSS 상태(group-hover)로 표현한다.
 *   - 높이가 hover 에서 늘어나는 것을 막지 않는다. Figma 원본이 그렇게 그려져 있어
 *     투명 플레이스홀더로 자리를 잡아두지 않는다 — hover 시 아래 콘텐츠가 밀린다.
 *     밑줄은 hidden 이라 flex gap 이 자리를 차지하지 않으므로 default 높이가 유지된다.
 *   - 아이콘은 Icon/UI 의 arrowRight(node 19655:33757)를 재사용한다. Figma 인스턴스가
 *     참조하는 노드와 동일하고, 축소 시 stroke 도 Figma 와 같은 비율로 얇아진다.
 *   - 아이콘 크기는 IconUI 에 size-18 을 넘겨서 바꿀 수 없다. IconUI 가 size-24 를
 *     직접 들고 있는데 빌드된 CSS 에서 .size-24 가 .size-18 보다 뒤에 나와(특이도는
 *     동일) size-24 가 이긴다 — 조용히 큰 아이콘이 렌더된다. 그래서 크기는 래퍼가
 *     들고 IconUI 에는 size-full 을 넘긴다. .size-full 은 .size-24 뒤에 나오므로
 *     이쪽은 의도대로 이긴다(빌드 산출 CSS 로 확인).
 */

export type ButtonTextProps = ButtonHTMLAttributes<HTMLButtonElement>

export function ButtonText({ children, className = '', ...props }: ButtonTextProps) {
  return (
    <button
      type="button"
      className={`group inline-flex flex-col items-center gap-8 ${className}`}
      {...props}
    >
      {/* Figma "ButtonContent" — default variant 는 이 row 하나가 전부다. */}
      <span className="flex items-center gap-8">
        <span className="type-subtitle-medium-strong whitespace-nowrap text-text-primary">
          {children}
        </span>
        {/* 크기는 래퍼가 정한다 — 위 "확정된 판단" 4번 참고. */}
        <span className="block size-18 shrink-0">
          <IconUI type="arrowRight" className="size-full" aria-hidden />
        </span>
      </span>

      {/* Figma "selected" — hover 에서만 나타난다. hidden 이므로 flex gap 도 함께
          사라지고, 그래서 default 높이가 Figma 원본과 같게 유지된다. */}
      <span className="hidden h-hairline w-full bg-border-focus group-hover:block" />
    </button>
  )
}
