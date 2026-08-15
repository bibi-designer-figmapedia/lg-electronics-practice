import type { HTMLAttributes } from 'react'
import { Tab } from './Tab'

/*
 * CategoryMenu — Figma "CategoryMenu" 컴포넌트 세트의 구현체. Tab 여러 개를 한 줄로
 * 늘어놓은 카테고리 네비게이션이다.
 *
 * Figma 원본 (산출물 1)
 *   component set:      https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3412
 *   layout=FillWidth:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3411
 *   layout=LeftMenu:    https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33598
 *   variant 2개를 모두 get_metadata · get_design_context · get_screenshot 로 읽었다.
 *   추정한 값은 없다.
 *
 * layout 축 대응표 (Figma variant 이름 -> 코드 union 멤버)
 *   layout=FillWidth  ->  'fillWidth'
 *   layout=LeftMenu   ->  'leftMenu'
 *   camelCase 로만 바꿨고 축 자체는 Figma 와 1:1 이다. Figma 에 없는 layout 은 만들지 않았다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:3412) 로 읽었다. 그 결과는
 * text/primary · brand/primary · nav/menu(+원자 font-family/sans · font-size/20 ·
 * font-weight/regular) · spacing/40 · spacing/12 6개가 전부다. 값 자체는 여기 적지 않는다
 * (레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것.
 *
 *   용도                    Figma 변수        코드 토큰                유틸리티          적용 위치
 *   탭 사이 간격            spacing/40        --spacing-40             gap-40            이 파일
 *   tab 프레임 상하 padding spacing/12        --spacing-12             py-12             이 파일 (fillWidth 만)
 *   루트 고정 높이          변수 없음, 실측 38 --spacing-38            h-38              이 파일 (leftMenu 만)
 *   라벨 타이포             nav/menu          type-nav-menu            type-nav-menu     Tab 이 담당
 *   라벨 색                 text/primary      --color-text-primary     text-text-primary Tab 이 담당
 *   밑줄 색                 brand/primary     --color-brand-primary    bg-brand-primary  Tab 이 담당
 *
 *   기존 스텝으로 해결되지 않은 값은 leftMenu 의 고정 높이 하나뿐이었고, 그 한 개만
 *   --spacing-38 로 등재했다(근거는 spacing.tokens.css 주석). 나머지(40 · 12)는 이미 있던
 *   스텝을 그대로 쓴다.
 *
 * 재사용 (원칙 2) — 새로 만든 마크업은 nav/ul/li 뿐이다
 *   탭 1개는 전부 기존 Tab (./Tab, Figma Tab 세트 19643:31067) 인스턴스다. Figma 도 두
 *   variant 모두 Tab 인스턴스만 배치하고 있어 재사용이 구조적으로 정확하다. 라벨·밑줄·
 *   타이포·색은 Tab 이 이미 토큰으로 갖고 있으므로 여기서 다시 지정하지 않는다.
 *
 * 두 variant 의 차이 — 확인 결과 "간격/폭"만 다르고 탭 자체는 동일하다
 *   같은 것: 탭 사이 간격이 양쪽 다 spacing/40 이다. FillWidth 는 탭 폭 합 529 + 간격 40 x 7
 *     = 809 로 tab 프레임 폭과 일치하고, LeftMenu 는 탭 x 좌표가 0 · 92 · 184 · 276 · 368 ·
 *     460 (폭 52 + 간격 40) 으로 역시 40 이다. 세로 정렬도 양쪽 다 가운데다.
 *   다른 것 2가지만 Record 맵으로 표현했다:
 *     1. 루트 폭·높이 — FillWidth 는 폭을 채우고(프레임 1440) 높이는 내용에서 나온다.
 *        LeftMenu 는 내용을 감싸고(512) 높이만 38 로 고정돼 있다.
 *     2. 상하 padding — FillWidth 에만 spacing/12 가 걸려 있다.
 *   구조 차이 1가지: FillWidth 는 탭들을 "tab" 래퍼 프레임(19661:3348)에 담고 LeftMenu 는
 *     탭이 루트의 직계 자식이다. 하지만 그 래퍼가 하는 일이 위 padding 하나뿐이라 코드에서는
 *     양쪽 다 <ul> 한 겹으로 통일하고 padding 만 갈랐다. 프레임 하나를 살리려고 variant 별로
 *     DOM 깊이를 다르게 만들지 않았다.
 *
 * 렌더하지 않는 노드 (요청자 확인 + get_metadata 실측)
 *   LeftMenu 안의 Menu x4 · 텍스트 "normal" x3 · out_link x3 은 Figma 에서 전부
 *   hidden 이다. 숨긴 레이어는 디자인의 일부가 아니므로 마크업에 넣지 않았다. Figma 에서
 *   보이게 바뀌면 그때 추가한다.
 *
 * 표현하지 못한 값 없음 — LeftMenu 의 고정 높이 38 은 토큰으로 해결했다
 *   LeftMenu 루트는 높이가 38 로 고정이고 그 안에서 탭(높이 28)이 세로 가운데 정렬돼 위아래로
 *   5 씩 남는다. 기존 spacing 스텝에는 38 도 5 도 없어서 token-guardian 이 --spacing-38 을
 *   등재했고, 여기서는 h-38 로 참조한다. 토큰 없이 h-38 이라고만 쓰면 Tailwind 내장 스케일이
 *   조용히 9배 이상 큰 값으로 계산하고 hook 도 잡지 못하므로, 등재가 선행 조건이었다.
 *   높이(38) 를 등재하고 여백(5) 을 등재하지 않은 이유는 spacing.tokens.css 주석에 있다 —
 *   요약하면 Figma 가 authoring 하는 값은 프레임 높이 쪽이고, 5 는 28 을 38 에 가운데 맞춘
 *   결과일 뿐이며, --spacing-5 는 Tailwind 내장 p-5/h-5 를 덮어쓴다.
 *   (fillWidth 의 높이 52 는 고정값이 아니라 padding 에서 나오므로 토큰이 필요 없다.)
 *
 *   높이는 <nav> 에 걸고 <ul> 은 늘어나게 둔다. 그래야 이미 있던 items-center 가 Figma 와
 *   같은 가운데 정렬을 그대로 만든다. 탭이 잘릴 걱정은 없다 — 박스는 루트 글자 크기를 따라
 *   커지고 탭에서 고정 단위로 남는 부분은 밑줄 두께·간격뿐이라, 글자가 커질수록 위아래 여백은
 *   오히려 늘어난다.
 *
 * 시맨틱 구조를 nav > ul > li > Tab(a) 로 택한 이유
 *   Figma 는 프레임만 주고 요소 종류를 정의하지 않는다. 이것은 같은 층위의 링크 묶음이므로
 *   (a) 랜드마크로 건너뛸 수 있게 <nav> 로 감싸고, (b) 스크린리더가 "목록, 항목 8개 중 1번"
 *   처럼 개수와 위치를 읽어주도록 <ul>/<li> 로 열거했다. Tab 이 이미 <a> 를 렌더하므로 <li>
 *   안에 그대로 넣으면 되고, 링크 마크업을 복제할 필요가 없다.
 *   <nav> 의 접근 가능한 이름은 붙이지 않았다 — Figma 에 문구가 없어 발명하지 않는다. 한 페이지에
 *   nav 가 여럿이면 호출부가 aria-label 을 넘기면 되고, 그 속성은 props 스프레드로 전달된다.
 *   <ul> 의 기본 불릿·들여쓰기는 Tailwind preflight 가 이미 지운다(src/index.css).
 *
 * 프레젠테이셔널 컴포넌트다
 *   내부 state 가 없다. 어떤 항목이 현재 페이지인지는 호출부가 item.active 로 넘기고, 이
 *   컴포넌트는 그것을 Tab 의 state 로 옮기기만 한다(요청자 확정 사항). Figma 에 없는 옵션 ·
 *   variant 는 만들지 않았다.
 */

export type CategoryMenuLayout = 'fillWidth' | 'leftMenu'

export interface CategoryMenuItem {
  /** 탭에 보이는 문구. */
  label: string
  /** 링크 목적지. Tab 의 앵커 href 로 그대로 넘어간다. */
  href?: string
  /** 현재 페이지인 항목. Tab 의 state=active(밑줄 + aria-current)로 옮겨진다. */
  active?: boolean
}

export interface CategoryMenuProps extends HTMLAttributes<HTMLElement> {
  /** Figma 의 layout 축. */
  layout?: CategoryMenuLayout
  /** 왼쪽부터의 탭 목록. Figma 배치 순서 그대로 넘긴다. */
  items: CategoryMenuItem[]
}

/* 차이 1 — 루트 폭·높이. FillWidth 는 폭을 채우고 높이는 내용에서 나온다.
   LeftMenu 는 내용을 감싸고 높이만 Figma 대로 38 로 고정한다. */
const rootLayoutClasses: Record<CategoryMenuLayout, string> = {
  fillWidth: 'flex w-full',
  leftMenu: 'inline-flex h-38',
}

/* 차이 2 — 상하 padding. FillWidth 의 "tab" 프레임에만 걸려 있다. */
const listLayoutClasses: Record<CategoryMenuLayout, string> = {
  fillWidth: 'py-12',
  leftMenu: '',
}

/** Figma "CategoryMenu"(19661:3412) 의 코드 정본. */
export function CategoryMenu({
  layout = 'fillWidth',
  items,
  className = '',
  ...props
}: CategoryMenuProps) {
  return (
    <nav className={`${rootLayoutClasses[layout]} ${className}`} {...props}>
      {/* LeftMenu 는 라벨 6개가 전부 같은 문구라 라벨만으로는 key 가 유일하지 않다.
          순서가 곧 정체성인 정적 목록이므로 인덱스를 함께 쓴다. */}
      <ul className={`flex items-center gap-40 ${listLayoutClasses[layout]}`}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <Tab href={item.href} state={item.active ? 'active' : 'default'}>
              {item.label}
            </Tab>
          </li>
        ))}
      </ul>
    </nav>
  )
}
