import type { HTMLAttributes } from 'react'
import { LogoLG } from '../LogoLG'
import { CategoryMenu, type CategoryMenuItem } from './CategoryMenu'
import { RightMenu, type RightMenuProps } from './RightMenu'

/*
 * HeaderGNB — Figma "Header/GNB" 의 구현체. 페이지 최상단 글로벌 네비게이션 바다.
 *
 * 이름에서 슬래시가 빠진 이유: Figma 원본 이름은 `Header/GNB` 지만 JSX 태그와 JS 식별자에
 * 슬래시를 쓸 수 없다. 그래서 슬래시만 제거하고 PascalCase 로 이어 붙였다
 * (`Header/GNB` -> `HeaderGNB`). 같은 규칙으로 만들어진 형제가 `HeaderNotification` 이다.
 * 원본 이름과 코드 이름을 잇는 연결은 이 주석과 아래 node 링크뿐이므로, 이름을 바꾸려면
 * 여기도 같이 고쳐야 한다.
 *
 * Figma 원본 (산출물 1)
 *   component set:        https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3966
 *   Property 1=Default:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-30719
 *   Property 1=secondary: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3965
 *
 *   variant 2개를 모두 get_metadata · get_screenshot · get_design_context 로 읽었다.
 *   추정한 값은 없다.
 *
 * variant 축 대응표 (Figma property 이름 -> 코드 prop)
 *   Figma 의 속성 이름이 그대로 `"Property 1"` 이라 JSX prop 으로 쓸 수 없다(공백이 들어간다).
 *   그래서 축 이름만 `variant` 로 바꿨고, 값은 Figma 와 1:1 이다. 같은 사정으로 이름을 바꾼
 *   선례가 `IconPLP` 의 `name` 이다.
 *     Property 1=Default    ->  variant='default'
 *     Property 1=secondary  ->  variant='secondary'
 *   Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:3966) 로 읽었다. 그 결과 16개
 * 중 대부분(text/primary · nav/menu 와 그 원자 · brand/primary · icon/default · brand/logo ·
 * brand/logo-inverse · brand/secondary · spacing/40 · spacing/8)은 자식 컴포넌트
 * (LogoLG · CategoryMenu · RightMenu)가 이미 소비한다. 이 파일이 직접 쓰는 것만 적는다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것.
 *
 *   용도                       Figma 변수 / 실측       코드 토큰                   유틸리티
 *   배경 (두 variant 공통)     bg/warm                 --color-bg-warm             bg-bg-warm
 *   아래쪽 구분선 색 (default) border/strong           --color-border-strong       border-border-strong
 *   구분선 두께                변수 없음, 실측 1       --border-width-hairline     border-b-hairline
 *   Link 좌우 padding (secondary) spacing/24           --spacing-24                px-24
 *   루트 최대 폭               변수 없음, 실측 1920    --container-viewport        max-w-viewport
 *   GNBContent 폭              변수 없음, 실측 1440    --container-container       max-w-container
 *   default 바 높이            변수 없음, 실측 80      --spacing-80                h-80
 *   default 로고 높이          변수 없음, 실측 44      --spacing-44                h-44 (중요도 표시)
 *   secondary 로고 높이        변수 없음, 실측 38      --spacing-38                h-38 (중요도 표시)
 *   secondary Link 높이        변수 없음, 실측 76      --spacing-76                h-76
 *   default 로고 좌측 위치     변수 없음, 실측 92      --spacing-92                left-92
 *   secondary Link 좌우 인셋   변수 없음, 실측 82      --spacing-82                px-82
 *
 *   spacing/40 과 spacing/8 은 이 파일에 쓸 자리가 없다 — 40 은 CategoryMenu 의 탭 간격,
 *   8 은 RightMenu 의 iconArea padding 이고 둘 다 해당 컴포넌트가 이미 갖고 있다.
 *   text/disclaimer 는 hidden 인 Brand 레이어가 쓰던 변수라 렌더 대상이 아니다.
 *   이 작업에서 새로 등재된 토큰은 --spacing-76 · --spacing-92 · --spacing-82 셋이고, 등재는
 *   전부 token-guardian 이 했다(아래 "Link 의 고정 높이 76" 및 "92 와 82" 참고). 나머지는
 *   전부 기존 토큰을 그대로 쓴다.
 *
 * 92 와 82 가 각각 단일 스텝이 된 경위 (두 스텝의 합에서 옮겨온 것이다)
 *   두 값 모두 Figma 가 변수를 걸지 않은 실측값이다 — get_variable_defs 를 default variant ·
 *   secondary variant · Link 프레임 셋에 각각 걸어 확인했고, 돌아오는 크기 변수는
 *   spacing/40 · spacing/8 · spacing/24 뿐이라 92 도 82 도 거기에 없다.
 *   처음에는 이름 붙은 스텝에도 없어 기존 스텝의 합으로 썼다(80 + 12 = 92, 64 + 18 = 82).
 *   합은 정확했지만 의미가 어긋나 있었다 — 80 은 Button/Web 의 min-width 제약, 18 은
 *   Button/Text 안 Icon/UI 의 리사이즈 값으로 등재된 토큰이다. 즉 헤더 로고 위치가 버튼
 *   최소너비에, 헤더 좌우 인셋이 버튼 아이콘 크기에 묶여 있었다. 둘 중 하나가 자기 사유로
 *   움직이는 날 헤더가 조용히 따라 움직이는데, 합은 여전히 유효한 CSS 라 레이어 3 hook 도
 *   verify:tokens 도 잡지 못한다. 그래서 --spacing-92 · --spacing-82 를 등재해 끊었다.
 *   대괄호 임의값이 막히는 것과는 별개로, 이름 없는 숫자는 Tailwind 내장 스케일에서 0.25 배
 *   rem 으로 조용히 해석되므로 스텝 등재가 그 구멍도 함께 닫는다. 값은 그대로라 렌더 위치는
 *   92 · 82 로 변함이 없다.
 *
 * Default(19643:30719) 구조 — get_design_context 로 확인한 것
 *   루트는 폭 1920 · 높이 80 고정에 bg/warm 배경과 아래쪽 border/strong 선을 갖는다.
 *   그 안에 GNBContent(폭 1440)가 가로 가운데 정렬로 놓이고, 좌우 끝에 CategoryMenu 와
 *   RightMenu 가 붙는다(justify-between: CategoryMenu x 0 폭 864, RightMenu x 1013 폭 427,
 *   1013 + 427 = 1440 으로 오른쪽 끝에 정확히 닿는다). Logo/LG 는 GNBContent 바깥의 왼쪽
 *   여백(0 부터 240 사이)에 절대 배치돼 있어 흐름에서 빼고 absolute 로 옮겼다.
 *
 *   높이 80 을 padding 파생이 아니라 h-80 으로 둔 이유: Figma 가 80 을 프레임 고정값으로
 *   authoring 하고 자식(GNBContent · Logo)을 둘 다 절대 좌표로 얹는다. 즉 80 은 내용에서
 *   나온 결과가 아니라 원인이다. CategoryMenu 가 LeftMenu 의 38 을 토큰화하고 그 안의 여백
 *   5 는 토큰화하지 않은 것과 같은 판단이다. 게다가 border 를 포함해 정확히 80 이 되어야 하는데
 *   (Figma 는 선을 프레임 안쪽에 그린다) padding 파생은 선 두께만큼 1 이 더 나온다.
 *
 *   GNBContent 의 세로 위치만 1.5 어긋난다 — Figma 는 바 가운데에서 1.5 아래에 놓았고
 *   (위 21 · 아래 19), 여기서는 items-center 로 가운데에 둔다. 21 도 19 도 스텝에 없어
 *   재현하려면 임의값이 필요하다. 눈에 띄지 않는 차이라 가운데 정렬을 택했다.
 *
 * secondary(19661:3965) 구조 — 로고만 있는 축소형
 *   루트는 bg/warm 만 갖고 아래쪽 선이 없다(Default 에만 border 가 있다 — get_design_context
 *   출력에서 secondary 루트에는 border 관련 클래스가 아예 없다). 그 안에 "Link" 프레임
 *   (19655:33547, 폭 1756 · 높이 76 · 좌우 padding spacing/24)이 가운데 정렬로 놓이고,
 *   그 왼쪽 끝에 로고(86 x 38)가 있다. 1756 은 1920 에서 좌우 82 씩 뺀 값이라, 폭을 고정하는
 *   대신 루트 px-82 로 인셋을 잡고 Link 는 남는 폭을 채우게 했다. 루트가 1920 보다 좁아져도
 *   인셋이 유지되는 쪽이 폭을 박는 쪽보다 맞기 때문이다.
 *   결과 로고 왼쪽 위치는 82 + 24 = 106 으로 Figma 실측과 같다.
 *
 * secondary 의 로고가 무엇인지 — 확인 결과 Logo/LG 인스턴스가 아니다
 *   get_design_context(19661:3965) 가 내준 것은 컴포넌트 인스턴스가 아니라 평범한 프레임
 *   "Image (LG logo (Life's Good))"(19655:33548) 안의 "Clip path group"(19655:33549) 이고,
 *   내용은 마스크가 걸린 내보내기 이미지다. 즉 Figma 쪽에서 Logo/LG 를 인스턴스로 쓰지 않고
 *   같은 로고를 이미지로 붙여 놓았다. 그림 자체는 Default 의 Logo/LG(type=color) 와 같은
 *   컬러 LG 로고이고(두 variant 스크린샷 대조), 아트 비율도 85.236 대 37.84 = 2.2525 로
 *   LogoLG 의 viewBox 비율 145.281 대 64 = 2.2700 과 1% 안쪽이다. 그래서 이미지를 새로
 *   내려받아 파일로 만들지 않고 이미 있는 LogoLG 를 그대로 썼다 — 같은 로고를 두 벌 두는
 *   것이 디자인 시스템에서는 더 큰 비용이다. 높이를 38 로 맞추면 너비가 86.26 이 되어
 *   Figma 의 85.24 보다 1 넓지만, 비율을 지키는 쪽이 임의 너비를 박는 쪽보다 정확하다.
 *
 * 로고 높이에 중요도 표시(느낌표)를 붙인 이유 (측정으로 확인한 사항)
 *   LogoLG 는 자기 클래스를 `h-64 w-auto ...` 로 먼저 붙이고 호출자 className 을 뒤에 잇지만,
 *   승패를 정하는 것은 문자열 순서가 아니라 생성된 CSS 안의 규칙 순서다. 이 저장소의 토큰으로
 *   컴파일해 확인한 결과 `.h-38` 과 `.h-44` 가 `.h-64` 보다 앞에 나온다(spacing 스텝이
 *   오름차순으로 방출된다). 따라서 표시 없이 넘기면 두 로고 모두 조용히 64 로 렌더된다.
 *   RightMenu 가 `size-16` 에 같은 표시를 붙인 것과 같은 이유이고, 같은 방법으로 확인했다.
 *
 * 렌더하지 않는 노드
 *   Default 안의 "Brand"(19643:30507, 134 x 32)는 Figma 에서 hidden 이다. 숨긴 레이어는
 *   디자인의 일부가 아니므로 마크업에 넣지 않았다. Figma 에서 보이게 바뀌면 그때 추가한다.
 *   (get_variable_defs 결과의 text/disclaimer 는 이 레이어가 쓰던 변수로 보인다.)
 *
 * 재사용 (원칙 2) — 이 파일이 새로 만든 마크업은 header 와 div 두 겹뿐이다
 *   로고            LogoLG (variant='color')
 *   카테고리 메뉴   CategoryMenu (layout='leftMenu')
 *   오른쪽 묶음     RightMenu
 *   SVG · 아이콘 · 탭 · 워드마크는 하나도 복제하지 않았다. 라벨 타이포 · 색 · 밑줄 · 아이콘
 *   색은 전부 자식 컴포넌트가 이미 토큰으로 갖고 있어 여기서 다시 지정하지 않는다.
 *
 * CategoryMenu 가 layout='leftMenu' 인 근거 (추정이 아니라 대조 결과다)
 *   get_design_context(19643:30719) 는 인스턴스 19655:33694 를 "가로 flex · 간격 spacing/40 ·
 *   고정 높이 38 · 세로 가운데 · shrink-0" 으로 내준다. CategoryMenu 의 두 variant 와 대조하면:
 *     1. 높이 38 — LeftMenu 의 고정 프레임 높이다. FillWidth 는 52 다.
 *     2. 탭 래퍼 프레임이 없다 — Tab 6개가 인스턴스 루트의 직계 자식이다. FillWidth 는 탭을
 *        "tab" 프레임에 담고 거기에 상하 padding(spacing/12)을 건다. 그 padding 도 없다.
 *     3. 탭이 6개다. FillWidth 는 8개다.
 *     4. 폭을 채우지 않고 내용을 감싼다(shrink-0 이고 폭 채움 클래스가 없다). LeftMenu 가 hug 다.
 *   네 가지가 모두 LeftMenu 를 가리킨다. 세 가지 이상이 독립적으로 일치하므로 확정으로 본다.
 *
 * 시맨틱 — 루트를 header 로 둔 이유
 *   Figma 는 프레임만 주고 요소 종류를 정의하지 않는다. 이것은 페이지 최상단의 사이트 공통
 *   머리 영역이고 그 안에 사이트 전역 네비게이션이 들어 있다. body 직계로 놓이면 header 는
 *   banner 랜드마크가 되어 스크린리더 사용자가 "머리말"로 건너뛸 수 있다. div 로 두면 그
 *   랜드마크가 사라진다. 네비게이션 랜드마크는 CategoryMenu 가 이미 nav 로 갖고 있으므로
 *   여기서 겹쳐 만들지 않는다. 안쪽 두 겹(GNBContent · Link)은 순전히 배치용이라 div 다.
 *
 *   "Link" 라는 이름의 프레임을 a 로 만들지 않은 이유: Figma 는 이 프레임에 목적지를 적어두지
 *   않았고, 확정된 API 에도 href prop 이 없다. 목적지 없는 a 는 초점을 받지 못해 조작할 수
 *   있다는 거짓 신호만 남기고, URL 을 지어내는 것은 원칙 1 위반이다. 그래서 배치용 div 로
 *   두었다 — 링크로 만들어야 한다면 그때 href 를 받는 것이 맞다.
 *
 * 프레젠테이셔널 컴포넌트다
 *   내부 state 가 없다. 어떤 카테고리가 현재 페이지인지는 호출부가 items[].active 로 넘기고
 *   CategoryMenu 가 그것을 Tab 으로 옮긴다. Figma 에 없는 옵션 · variant 는 만들지 않았다.
 *
 * RightMenu 의 동작을 넘기는 경로 — 그룹 prop 을 택했다 (design-reviewer a11y FAIL 대응)
 *   RightMenu 는 버튼 4개에 각각 선택적 핸들러(onBusiness · onSearch · onGuest · onBag)를
 *   갖는데, 이 파일이 그것을 넘겨주지 않아 HeaderGNB 를 통해 렌더된 버튼 4개가 전부 무동작이었다.
 *   초점은 받는데 아무 일도 일어나지 않는 상태다. "동작은 호출부 위임" 이 확정 범위인데
 *   위임할 자리가 없으면 그건 위임이 아니라 유실이다.
 *
 *   두 가지 방식을 놓고 골랐다.
 *     (a) 개별 prop 평면 전달 — onBusiness · onSearch · onGuest · onBag 을 이 파일에서 다시
 *         선언해 그대로 내려보낸다. 호출부 표기는 가장 짧다. 대신 같은 이름 4개가 이 파일에
 *         또 생기고, Navigation 까지 올리면 세 파일에 같은 이름이 세 벌 존재한다. 자식의
 *         핸들러 이름이 바뀌는 날 세 곳을 함께 고쳐야 하고, 최상위에서는 prop 이름만 봐서는
 *         그것이 어느 자식으로 가는지 알 수 없다(알림 바 3개까지 합치면 최상위에 7개가 평평하게
 *         늘어선다).
 *     (b) 그룹 prop — 자식 이름을 딴 prop 하나로 받아 그대로 스프레드한다. 타입은
 *         Pick<RightMenuProps, ...> 이라 핸들러 시그니처가 이 파일에 복제되지 않는다.
 *   (b) 를 택했다. 근거는 둘이다: 단계마다 늘어나는 API 표면이 1개뿐이라 조합이 깊어져도
 *   최상위가 넓어지지 않고, prop 이름이 곧 "이 값이 어느 자식으로 가는지" 를 말해 준다.
 *   비용은 호출부가 한 겹 더 중첩해서 적는 것인데, 조합 컴포넌트에서 그 한 겹은 잡음이 아니라
 *   목적지 정보라 손해로 보지 않았다.
 *   묶은 것은 표기일 뿐 요구가 아니다 — 그룹 자체도 안쪽 4개도 전부 선택이고 기본값이 없다.
 *   주지 않으면 지금까지와 똑같이 버튼이 아무 것도 하지 않는다(동작 변화 0).
 *   RightMenu.tsx 는 이 변경에서 읽기만 했다. 시각 표현도 마크업도 건드리지 않았다.
 *
 * secondary "Link" 프레임의 고정 높이 76 — 스텝 등재로 해결됐다
 *   Figma 는 Link 를 높이 76 으로 고정하고 그 안에서 38 짜리 로고를 세로 가운데에 둔다
 *   (위아래로 19 씩 남는다). 처음 구현할 때는 이름 붙은 스텝에 76 도 19 도 없어 높이를 아예
 *   걸지 않았고, 그래서 바 높이가 로고 높이인 38 에 머물러 Figma 와 38 어긋나 있었다.
 *   token-guardian 이 --spacing-76 을 등재해 그 자리를 채웠다 — CategoryMenu 가 LeftMenu 의
 *   38 을 남겨두고 보고했다가 --spacing-38 이 등재돼 채워진 것과 같은 경로다.
 *   토큰화된 것은 76 이지 19 가 아니다. Figma 가 authoring 하는 값은 프레임 높이 76 이고,
 *   19 는 38 을 76 안에 가운데 정렬한 결과일 뿐이다. 19 에 이름을 붙이면 결과를 원인으로
 *   굳혀 로고 높이가 바뀌는 날 프레임이 76 에서 어긋난다. LeftMenu 의 여백 5 를 토큰화하지
 *   않은 것과 같은 판단이다. 그래서 여기서는 h-76 으로 높이를 직접 걸고 세로 가운데 정렬은
 *   items-center 에 맡긴다 — 로고 높이가 바뀌어도 바 높이는 76 그대로다.
 *   `h-76` 이 Tailwind 내장 스케일에서 76 의 0.25 배 rem 으로 조용히 해석되던 문제도 스텝
 *   등재로 함께 닫혔다. 이름 붙은 스텝이 내장 해석을 이긴다.
 *
 * 아직 남은 차이 (근사하지 않고 남겨둔 것)
 *   default 의 GNBContent 세로 위치가 1.5 어긋난다(위 구조 설명 참고). 92 · 82 는 단일 스텝
 *   등재로 닫혔다 — 값도 그대로이고 의미 결합도 사라졌다.
 */

export type HeaderGNBVariant = 'default' | 'secondary'

export interface HeaderGNBProps extends HTMLAttributes<HTMLElement> {
  /** Figma 의 "Property 1" 축. 위 대응표를 볼 것. */
  variant?: HeaderGNBVariant
  /**
   * CategoryMenu 에 그대로 넘어가는 카테고리 목록. Figma 배치 순서대로 넘긴다.
   * variant='secondary' 는 CategoryMenu 도 RightMenu 도 렌더하지 않으므로 이 값을 쓰지
   * 않는다. 그래도 선택 prop 으로 만들지 않은 이유는, 기본 variant 인 'default' 에서는
   * 반드시 필요하고 빠뜨리면 빈 메뉴가 조용히 렌더되기 때문이다.
   */
  items: CategoryMenuItem[]
  /**
   * RightMenu 버튼 4개의 동작. 받은 것을 RightMenu 에 그대로 넘기기만 한다 — 이 컴포넌트는
   * 무엇을 열지도, 어디로 이동할지도 정하지 않는다. 그룹으로 묶은 근거는 위 주석의
   * "RightMenu 의 동작을 넘기는 경로" 를 볼 것.
   *
   * variant='secondary' 는 RightMenu 를 렌더하지 않으므로 이 값을 쓰지 않는다(items 와 같다).
   * items 와 달리 선택인 이유: 핸들러가 없어도 Figma 원본대로 버튼 4개가 그대로 렌더되고
   * 빠진 것이 눈에 보이지 않는 렌더 결과가 되지 않는다.
   */
  rightMenu?: Pick<RightMenuProps, 'onBusiness' | 'onSearch' | 'onGuest' | 'onBag'>
}

/*
 * variant 별 루트 클래스. 공통(폭 · 배경)은 아래 합성부에 두고 다른 것만 여기 담는다.
 *   default   — 높이 80 고정 · 아래쪽 구분선 · 로고를 absolute 로 얹기 위한 relative.
 *   secondary — 구분선 없음. 세로 쌓기 + px-82 가 Link 의 좌우 인셋이다.
 */
const rootVariantClasses: Record<HeaderGNBVariant, string> = {
  default: 'relative flex h-80 items-center border-b-hairline border-border-strong',
  secondary: 'flex flex-col px-82',
}

/** Figma "Header/GNB"(19661:3966) 의 코드 정본. */
export function HeaderGNB({
  variant = 'default',
  items,
  rightMenu,
  className = '',
  ...props
}: HeaderGNBProps) {
  return (
    <header
      className={`w-full max-w-viewport bg-bg-warm ${rootVariantClasses[variant]} ${className}`}
      {...props}
    >
      {variant === 'default' ? (
        <>
          {/* 19643:30488 GNBContent — 폭 1440 을 가운데 두고 좌우 끝에 두 묶음을 붙인다. */}
          <div className="mx-auto flex w-full max-w-container items-center justify-between">
            {/* 19655:33694 — layout=LeftMenu (위 대조 근거 참고) */}
            <CategoryMenu layout="leftMenu" items={items} />
            {/*
             * 19661:4413 — 받은 핸들러를 그대로 스프레드한다. rightMenu 가 없으면 아무 prop 도
             * 붙지 않아 이전과 같은 마크업이 나온다(스프레드는 클래스에 닿지 않는다).
             */}
            <RightMenu {...rightMenu} />
          </div>
          {/*
           * 19655:33588 Logo/LG — GNBContent 바깥 왼쪽 여백에 놓이므로 흐름에서 뺀다.
           * 흐름에 두면 높이 44 가 40 짜리 행을 밀어 바 높이가 어긋난다.
           * 왼쪽 92 는 left-92, 세로는 바 가운데(Figma 도 가운데에서 0.5 차이다).
           */}
          <LogoLG
            variant="color"
            className="absolute top-1/2 left-92 h-44! -translate-y-1/2"
          />
        </>
      ) : (
        /*
         * 19655:33547 Link — 고정 높이 76(h-76) + Figma 가 건 padding(px-24).
         * 좌우 인셋 82 는 루트의 px-82 가 갖는다. 로고는 items-center 로 세로 가운데에 둔다.
         */
        <div className="flex h-76 items-center px-24">
          {/* 19655:33548 — Logo/LG 인스턴스가 아니라 같은 로고의 이미지다(위 확인 근거 참고) */}
          <LogoLG variant="color" className="h-38!" />
        </div>
      )}
    </header>
  )
}
