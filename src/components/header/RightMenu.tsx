import type { HTMLAttributes } from 'react'
import { LogoLGSignature } from '../LogoLGSignature'
import { IconUI, type IconUIType } from '../icons/IconUI'

/*
 * RightMenu — 헤더 오른쪽 묶음. LG SIGNATURE 워드마크 + "Business" 텍스트 버튼 +
 * 유틸리티 아이콘 3개(돋보기 · 사람 · 장바구니).
 *
 * Figma 원본 (산출물 1)
 *   RightMenu:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4412
 *   textButton: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-30973
 *   utlMenu:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-30976
 *
 *   구조 · 좌표 · 크기는 get_metadata(19661:4412) 와 get_design_context(19661:4412) 로
 *   읽었다. 추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — get_variable_defs(19661:4412) 가 내준 변수는 icon/default ·
 * text/primary · nav/menu(원자: font-family/sans · font-size/20 · font-weight/regular) ·
 * spacing/8 뿐이다. 값 자체는 여기 적지 않는다(레이어 3 hook 대상) — src/tokens/ 를 볼 것.
 *
 *   용도                      Figma 변수 / 실측     코드 토큰              유틸리티
 *   라벨 색                   text/primary          --color-text-primary   text-text-primary
 *   아이콘 색                 icon/default          --color-icon-default   text-icon-default (IconUI 기본값)
 *   라벨 타이포               nav/menu              type-nav-menu          type-nav-menu
 *   iconArea 안쪽 여백        spacing/8             --spacing-8            p-8
 *   3개 블록 사이 간격        변수 없음, 실측 24    --spacing-24           gap-24
 *   iconArea 사이 간격        변수 없음, 실측 12    --spacing-12           gap-12
 *   라벨↔화살표 간격          변수 없음, 실측 4     --spacing-4            gap-4
 *   Icon/UI 박스              변수 없음, 실측 24    --spacing-24           size-24 (IconUI 기본값)
 *   textButton 화살표 박스    변수 없음, 실측 16    --spacing-16           size-16
 *
 *   새 토큰은 하나도 만들지 않았다 — 필요한 스텝(4 · 8 · 12 · 16 · 24)이 전부 이미 있다.
 *   고정 높이도 쓰지 않는다: Figma 의 iconArea 40 은 24 아이콘 + p-8 상하에서, utlMenu 와
 *   루트의 40 은 그 iconArea 에서 자연히 나온다. 그래서 --spacing-40 을 참조할 자리가 없다.
 *   워드마크의 36 도 LogoLGSignature 가 자체 py-12 로 만든다.
 *
 * 재사용 (원칙 2) — 새로 만든 SVG 는 없다
 *   워드마크        LogoLGSignature (Logo/LGSignature 인스턴스 19655:33728)
 *   돋보기          IconUI type="Search"
 *   사람            IconUI type="guest"
 *   장바구니        IconUI type="bag"
 *   외부링크 화살표  IconUI type="Crossup"
 *
 *   장바구니 확인 근거: get_design_context 가 19661:4399 에 내준 Union path 가
 *   IconUI 의 bag glyph 와 문자 단위로 동일하다(같은 fillRule, 같은 좌표).
 *
 * 확인 과정에서 드러난 사실 2가지 — 임의로 넘기지 않고 근거를 남긴다 (원칙 1)
 *   1. 요청서는 화살표를 IconUI type="Arrow" 로 지목했지만, 실제 IconUI 에서 "Arrow" 는
 *      오른쪽 chevron 이고 aria-label 도 "Arrow" 다. 요청서가 함께 적은 식별자
 *      ("Arrow up right" 라벨)와 스크린샷의 대각선 ↗ 모양에 해당하는 것은 "Crossup" 이다.
 *      두 단서가 같은 곳을 가리키므로 Crossup 을 썼다.
 *   2. Figma 상 이 화살표는 Icon/UI 인스턴스가 아니라 Foundation/Icon(19643:30975) 이다.
 *      16 프레임 안의 12 글리프이고 stroke 굵기는 1.5 다. IconUI 의 Crossup 은 24 프레임에
 *      stroke 2.25 인데, 24 -> 16 축소비 2/3 을 곱하면 stroke 가 정확히 1.5 가 되고
 *      선분 길이도 양쪽 다 12 · 10.286 으로 일치한다. 즉 같은 글리프를 다른 배율로 그린
 *      것이라 재사용이 정확하다. 프레임 안 위치만 Foundation/Icon 쪽이 미세하게 치우쳐
 *      있는데(중심에서 0.53 · 0.75), 그 치우침을 재현하려고 글리프를 복제하지는 않았다.
 *
 * size-16! 의 느낌표가 붙은 이유 (측정으로 확인한 사항)
 *   IconUI 는 className 을 `size-24 ... ${className}` 순서로 이어 붙이지만, 승패를 정하는
 *   것은 문자열 순서가 아니라 생성된 CSS 안의 규칙 순서다. 이 저장소를 빌드해 확인한 결과
 *   .size-24 규칙이 .size-16 보다 뒤에 나온다(spacing 스텝이 오름차순으로 방출된다).
 *   따라서 느낌표 없이 size-16 만 넘기면 조용히 24 로 렌더된다. 대안으로 글리프를 이 파일에
 *   복제하는 방법이 있었지만, 디자인 시스템에서 같은 아이콘을 두 벌 두는 쪽이 더 큰 비용이라
 *   보고 중복 대신 우선순위 지정을 택했다.
 *
 * 렌더하지 않는 노드
 *   utlMenu 의 Foundation/Icon_Menu(19643:30980)는 Figma 에서 hidden 이다. 숨긴 레이어는
 *   디자인의 일부가 아니므로 마크업에 넣지 않았다. Figma 에서 보이게 바뀌면 그때 추가한다.
 *
 * 접근성 — 아이콘 버튼을 button 으로 감싼 이유
 *   Figma 의 iconArea 는 그냥 프레임이라 시맨틱이 없다. 그대로 div 로 옮기면 키보드로
 *   도달할 수도, 스크린리더가 조작 대상으로 읽을 수도 없는 그림이 된다. 그래서 각 iconArea 를
 *   <button type="button"> 로 만들고 aria-label 을 붙였다(type 을 명시하지 않으면 폼 안에서
 *   submit 로 동작한다). 라벨 문구는 IconUI 가 variant 별로 이미 갖고 있는 것을 그대로
 *   가져와 두 곳이 갈라지지 않게 했다. 내부 svg 에는 aria-hidden 을 넘겨 버튼 라벨과 아이콘
 *   라벨이 중복해 읽히는 것을 막는다.
 *   textButton 도 같은 이유로 button 이다 — 레이어 이름 자체가 "textButton" 이라 조작 대상인
 *   것이 Figma 에 명시돼 있다. 보이는 글자 "Business" 가 접근 가능한 이름이 되므로 여기엔
 *   aria-label 을 따로 붙이지 않았다.
 *
 * 접근성 — 포커스 표시
 *   초점 가능한 4개 요소 모두에 focus-visible:outline-border-focus 로 --color-border-focus
 *   토큰 색을, focus-visible:outline-(length:--border-width-hairline) 로 --border-width-hairline
 *   토큰 굵기를 준다. 두 값 다 이름 붙은 토큰이고 지어낸 수치가 아니다. outline-style 은 따로
 *   쓰지 않는다 — Tailwind 의 outline-width 유틸리티가 style 을 자기 기본값(solid)에서 읽는다.
 *   굵기 토큰을 이것으로 고른 근거: Figma 에 포커스 링 두께 변수가 없고, 이 저장소에 있는
 *   stroke-weight 토큰은 --border-width-hairline 하나뿐이며, 같은 헤더의 Tab 이 이미 같은
 *   조합을 쓰고 있어 헤더 안에서 표시가 갈라지지 않는다. 더 굵은 링이 필요하다면 여기서
 *   근사하지 말고 토큰을 먼저 추가해야 한다.
 *   오프셋은 주지 않는다 — 이름 붙은 오프셋 토큰이 없다.
 *   outline 을 고른 이유: box-shadow 기반 ring 과 달리 조상의 overflow 에 잘리지 않고 레이아웃도
 *   밀지 않아, 시각 표현을 바꾸지 않는다는 제약과 충돌하지 않는다.
 *
 * 프레젠테이셔널 컴포넌트다
 *   내부 state 는 없다. 다만 동작을 호출부에 "위임"하려면 넘겨받을 자리가 있어야 하므로,
 *   버튼 4개에 각각 선택적 핸들러 prop 을 둔다. 무엇을 열고 어디로 이동할지는 여전히 호출부가
 *   정한다. Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * 핸들러 이름을 이렇게 지은 이유
 *   HeaderNotification 의 onPrev · onNext · onClose 와 같은 모양이다: `on` + 그 버튼이
 *   무엇인지 한 단어. 단어는 새로 짓지 않고 버튼이 이미 갖고 있는 이름을 그대로 쓴다 —
 *   onBusiness 는 보이는 글자이자 Figma 레이어인 textButton 의 라벨, onSearch · onGuest ·
 *   onBag 은 아래 UTIL_ICONS 의 IconUI variant 이자 각 버튼의 aria-label 이다. 그래서 prop
 *   하나가 어느 버튼인지 코드에서 한 번에 짚인다.
 *   동사(onSearchClick · onOpenCart 같은 것)를 붙이지 않은 것은 의도적이다. 검색을 열지
 *   이동할지는 이 컴포넌트가 정하지 않는다 — 이름에 동작을 박으면 프레젠테이셔널이라는
 *   전제와 어긋난다.
 */

export interface RightMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** "Business" 텍스트 버튼(19643:30973). */
  onBusiness?: () => void
  /** 돋보기 아이콘 버튼. */
  onSearch?: () => void
  /** 사람 아이콘 버튼. */
  onGuest?: () => void
  /** 장바구니 아이콘 버튼. */
  onBag?: () => void
}

/** utlMenu 의 iconArea 3개. Figma 배치 순서(x = 0 · 52 · 104) 그대로다. */
const UTIL_ICONS: { type: IconUIType; label: string }[] = [
  { type: 'Search', label: 'Search' },
  { type: 'guest', label: 'Guest' },
  { type: 'bag', label: 'Shopping bag' },
]

/** Figma "RightMenu"(19661:4412) 의 코드 정본. */
export function RightMenu({
  onBusiness,
  onSearch,
  onGuest,
  onBag,
  className = '',
  ...props
}: RightMenuProps) {
  /*
   * UTIL_ICONS 의 type 을 그대로 키로 쓴다. 아이콘 ↔ 핸들러 대응이 이 한 곳에서만 정해지므로
   * 배열과 핸들러가 따로 놀 수 없다.
   */
  const utilHandlers: Partial<Record<IconUIType, () => void>> = {
    Search: onSearch,
    guest: onGuest,
    bag: onBag,
  }

  return (
    <div
      className={`flex items-center justify-end gap-24 ${className}`}
      {...props}
    >
      <LogoLGSignature />

      {/* textButton (19643:30973) — 라벨 + 외부링크 화살표 */}
      <button
        type="button"
        onClick={onBusiness}
        className="type-nav-menu inline-flex items-center gap-4 text-text-primary focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus"
      >
        Business
        <IconUI
          type="Crossup"
          aria-hidden="true"
          focusable="false"
          className="size-16! shrink-0"
        />
      </button>

      {/* utlMenu (19643:30976) — iconArea 3개 */}
      <div className="flex items-center justify-end gap-12">
        {UTIL_ICONS.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            aria-label={label}
            onClick={utilHandlers[type]}
            className="inline-flex items-center justify-center p-8 focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus"
          >
            <IconUI type={type} aria-hidden="true" focusable="false" />
          </button>
        ))}
      </div>
    </div>
  )
}
