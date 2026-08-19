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
 *   밴드 좌우 거터             layout/gutter 24        --spacing-gutter            px-gutter
 *   GNBContent 폭              변수 없음, 실측 1440    --container-container       max-w-container
 *   default 바 높이            변수 없음, 실측 80      --spacing-80                h-80
 *   default 로고 높이          변수 없음, 실측 44      --spacing-44                h-44 (중요도 표시)
 *   secondary 로고 높이        변수 없음, 실측 38      --spacing-38                h-38 (중요도 표시)
 *   secondary Link 높이        변수 없음, 실측 76      --spacing-76                h-76
 *   GNBContent 항목 최소 간격  아래 "항목 사이 간격"   --spacing-24                gap-24
 *   (좌우 인셋 240 은 거터와 GNBContent 상한의 조합에서 나온다 — 아래 "인셋을 패딩으로
 *    쓰지 않는 이유")
 *
 *   spacing/40 과 spacing/8 은 이 파일에 쓸 자리가 없다 — 40 은 CategoryMenu 의 탭 간격,
 *   8 은 RightMenu 의 iconArea padding 이고 둘 다 해당 컴포넌트가 이미 갖고 있다.
 *   text/disclaimer 는 hidden 인 Brand 레이어가 쓰던 변수라 렌더 대상이 아니다.
 *   header 작업에서 등재된 토큰은 --spacing-76 하나이고 token-guardian 이 등재했다
 *   (아래 "Link 의 고정 높이 76" 참고). 나머지는 전부 기존 토큰을 그대로 쓴다.
 *
 * 인셋 92 · 82 가 사라진 경위 (Figma 마진 영역 수정 반영)
 *   이전 원본은 default 바에 자체 인셋 92, secondary Link 에 82 를 썼고 그 두 값이 각각
 *   --spacing-gnb-inset · --spacing-82 로 등재돼 있었다. 요청자가 Figma 에서 마진 영역을
 *   고쳐 두 variant 모두 콘텐츠 컨테이너와 같은 인셋 240 으로 옮겼다(아래 두 구조 항목의
 *   좌표 참고). 그래서 이 파일은 두 토큰을 더 이상 참조하지 않고, 240 을 값으로 쓰지도
 *   않는다 — 거터와 콘텐츠 폭 상한의 조합이 그 자리를 만든다(아래 "인셋을 패딩으로 쓰지
 *   않는 이유"). GNB 만 쓰던 인셋 축이 없어지고 다른 밴드와 같은 구조로 합쳐졌다.
 *   --spacing-82 는 BenefitRow 가 size-82 로 계속 쓰므로 그대로 두고, 참조가 0 이 된
 *   --spacing-gnb-inset 은 src/tokens/layout.tokens.css 에서 삭제했다 — 지운 자리에 다시
 *   등재하지 말라는 노트를 남겼다(같은 파일의 --spacing-92 처리와 같은 방식).
 *
 * Default(19643:30719) 구조 — get_metadata · get_design_context 로 확인한 것
 *   루트는 폭 1920 · 높이 80 고정에 bg/warm 배경과 아래쪽 border/strong 선을 갖는다.
 *   그 안에 GNBContent(x 240 · 폭 1440 · 높이 44)가 놓이고, 자식 셋이 전부 그 안에 있다.
 *     Logo/LG      19655:33588  상대 x 0     절대 240    100 x 44
 *     CategoryMenu 19655:33694  상대 x 156   절대 396    809 x 38
 *     RightMenu    19661:4413   상대 x 1021  절대 1261   419 x 40  (오른쪽 끝 1680)
 *   GNBContent 자체는 justify-between 이고 간격 변수가 없다. 세 항목의 폭 합이 1328 이라
 *   남는 112 가 두 간격에 56 씩 나뉜다 — 그래서 실측 간격이 56 · 56 이다.
 *
 * 로고가 콘텐츠 컨테이너 안으로 들어온 변경 (확정된 레이아웃 모델)
 *   이전 원본은 로고를 GNBContent 바깥 왼쪽 거터(x 92)에 두고 메뉴 두 묶음만 1440 안에
 *   넣었다. 지금 원본은 로고까지 1440 안의 첫 항목이다. 즉 좌표가 92 · 240 두 개에서
 *   240 하나로 줄었고, 코드도 루트의 gap 을 없애고 자식 하나(GNBContent)만 두면 된다.
 *   절대 좌표는 여전히 쓰지 않는다. 역할을 두 겹으로 나눈다 — 바깥(header)이 배경과 거터
 *   24 를 갖고(bg-bg-warm · px-gutter), 안쪽(GNBContent)이 콘텐츠 폭 1440 을 갖는다
 *   (mx-auto w-full max-w-container). 그래서 폭 1920 에서 왼쪽 끝 240 · 오른쪽 끝 1680 이
 *   되고 좌우 거터가 240 으로 대칭이다 — 이전 모델의 비대칭(오른쪽만 92)은 로고가 거터에
 *   살던 사정에서 나온 것이라 함께 사라졌다.
 *
 * 인셋을 패딩으로 쓰지 않는 이유 (모든 full-bleed 밴드가 공유하는 구조)
 *   이 바는 뷰포트 전체 폭을 쓰는 full-bleed 밴드다. 좌우 인셋 240 을 루트 padding 으로 직접
 *   주면(px-viewport-inset) 그 240 이 어떤 폭에서도 고정이라, 뷰포트가 1920 보다 좁아지는
 *   순간 GNBContent 가 남은 폭에서 눌리거나 밖으로 넘쳐 가로 스크롤이 생긴다. 반대로 밴드에
 *   하한(min-w-viewport)을 걸어 막아 보기도 했는데, 그것은 넘침을 없애는 대신 좁은 화면에서
 *   항상 넘치게 만드는 쪽이었다. 그래서 인셋을 값으로 주지 않고 컨테이너가 만들게 둔다.
 *     바깥 층(header)      w-full + 배경 + px-gutter     (최소 폭 · 최대 폭 지정 없음)
 *     안쪽 층(GNBContent)  mx-auto w-full max-w-container
 *   1920 에서 (1920 - 48 - 1440) / 2 + 24 = 240 이 그대로 나오고 오른쪽 끝은 1680 이다.
 *   1920 보다 좁으면 상한 1440 쪽이 먼저 줄어 레이아웃이 자연스럽게 좁아지며(가로 스크롤 0),
 *   1920 보다 넓으면 배경은 화면 전체로 늘고 콘텐츠는 1440 중앙에 남는다. 같은 구조가
 *   HeaderNotification · Footer · FuntionalTab · ComponentTitle · HeroBanner 에도 같은 모양으로
 *   들어가 있다.
 *   --spacing-viewport-inset 토큰은 그대로 있다 — Figma layout/viewport-inset 변수의 대응이고
 *   토큰 갤러리가 시연한다. 이 파일이 그것을 padding 으로 쓰지 않을 뿐이다.
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
 * 항목 사이 간격 — justify-between 에 gap-24 를 함께 거는 이유 (겹침 버그 수정의 연장)
 *   Figma 는 GNBContent 에 간격을 authoring 하지 않고 justify-between 으로 둔다. 그것을
 *   그대로 옮기면 간격이 값이 아니라 남는 공간의 계산 결과가 되고, 남는 공간이 0 이 되는
 *   폭부터 간격도 0 이 되어 두 묶음이 맞닿는다 — 실제로 Support 와 LG SIGNATURE 가 겹쳤고
 *   (1600 미만) 그것이 직전 청크에서 고친 버그다. FuntionalTab 의 칸 간격과 같은 원인이다.
 *
 *   그래서 최소 간격 gap-24 를 명시한다. 폭 1920 렌더는 이 값과 무관하게 Figma 와 같다 —
 *   남는 공간(1440 − 자식 폭 합 1324.5 = 115.5)이 24 보다 넉넉해서 justify-between 이 그것을
 *   두 간격에 57.8 씩 나누고, Figma 실측 56 · 56 과 같은 자리에 선다(자식 폭이 Figma 프레임
 *   폭보다 3.5 좁은 만큼만 어긋난다. 그 3.5 를 두 간격에 나눠 RightMenu 오른쪽 끝이 1680 에
 *   정확히 서는 것이 justify-between 을 남기는 이유다). 56 을 값으로 고정하지 않는 이유가
 *   이것이다 — 56 은 Figma 가 authoring 한 간격이 아니라 justify-between 이 만든 결과이고,
 *   고정하면 자식 폭이 바뀌는 날 오른쪽 끝이 1680 에서 어긋난다.
 *   24 는 남는 공간이 그보다 작아지는 폭에서만 발동하는 바닥값이다 — 그 아래로 내려가면
 *   간격이 0 이 되어 라벨이 맞닿기 때문이다.
 *
 *   자식 셋에 shrink-0 을 주는 이유가 이것과 한 쌍이다. 없으면 gap 은 지켜지지만 자식이
 *   대신 눌려 탭 라벨과 오른쪽 항목이 줄바꿈되고, 루트가 h-80 고정이라 세로로도 깨진다.
 *   자식 셋의 최소 폭 합(1324.5)에 거터 48 과 최소 간격 48 을 더한 1420.5 아래로 뷰포트가
 *   좁아지면 압축하지 말고 넘친다 — 겹침은 정보가 가려지는 것이라 다르다. 확정된 지원 폭
 *   (1512 · 1920 · 2600)은 전부 그 위이므로 가로 스크롤이 생기지 않는다. 시안이 1920
 *   하나뿐이므로 더 좁은 폭을 맞추려는 반응형 분기나 요소 축소는 만들지 않는다(요청자 확정).
 *
 * secondary(19661:3965) 구조 — 로고만 있는 축소형
 *   루트는 bg/warm 만 갖고 아래쪽 선이 없다(Default 에만 border 가 있다 — get_design_context
 *   출력에서 secondary 루트에는 border 관련 클래스가 아예 없다). 마진 영역 수정 후 루트는
 *   좌우 padding 240 을 직접 갖고(get_design_context 가 px-240 으로 내준다), 그 안에 "Link"
 *   프레임(19655:33547, x 240 · 폭 1440 · 높이 76 · 좌우 padding spacing/24)이 놓이고
 *   그 왼쪽 끝에 로고(86 x 38)가 있다. 이전 원본은 Link 가 x 82 · 폭 1756 이었다 — 즉
 *   secondary 의 좌우 여백은 82 도 92 도 아니고 지금은 240 이다.
 *   코드는 그 240 을 값으로 박지 않는다. default 와 같은 구조(루트 px-gutter + 안쪽
 *   max-w-container)를 쓰고 Link 가 그 컨테이너 자리에 선다 — 1920 에서 Link 240–1680 ·
 *   로고 왼쪽 240 + 24 = 264 로 Figma 실측과 같고, 좁은 폭에서는 Link 가 함께 줄어든다.
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
 *   default 의 GNBContent 세로 위치가 1.5 어긋난다(위 구조 설명 참고).
 *   폭 1920 에서 로고 240–340 · GNBContent 240–1680 은 Figma 실측과 같다. CategoryMenu 와
 *   RightMenu 의 시작 좌표는 자식 컴포넌트의 실제 폭이 Figma 프레임 폭보다 3.5 좁은 만큼
 *   어긋난다(간격이 56 이 아니라 57.8 로 나뉜다) — 자식의 폭은 이 파일이 정하지 않으므로
 *   여기서 임의값으로 덮지 않고 남겨둔다. 오른쪽 끝 1680 은 정확하다.
 *   뷰포트가 1920 보다 좁아지면 콘텐츠 폭이 1440 에서 함께 줄어 좌표도 같이 줄어든다 —
 *   그것이 확정된 동작이다(위 "인셋을 패딩으로 쓰지 않는 이유" 참고).
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
 *   default   — 높이 80 고정 · 아래쪽 구분선 · px-gutter 가 밴드의 거터다(좌우 인셋 240 은
 *               안쪽 컨테이너와의 조합에서 나온다). absolute 를 쓰지 않으므로 relative 도
 *               필요하지 않다.
 *   secondary — 구분선 없음. 세로 쌓기 + 같은 px-gutter.
 */
const rootVariantClasses: Record<HeaderGNBVariant, string> = {
  default:
    'flex h-80 items-center border-b-hairline border-border-strong px-gutter',
  secondary: 'flex flex-col px-gutter',
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
      className={`w-full bg-bg-warm ${rootVariantClasses[variant]} ${className}`}
      {...props}
    >
      {variant === 'default' ? (
        <>
          {/*
           * 19643:30488 GNBContent — 안쪽 콘텐츠 층. 폭 상한 1440 을 잡고 mx-auto 로 가운데
           * 선다. 1920 에서 루트의 px-gutter(24)와 합쳐 왼쪽 끝 240 · 오른쪽 끝 1680 이 되고
           * 좌우 거터가 240 으로 대칭이다. 자식 셋(로고 · CategoryMenu · RightMenu)이 모두
           * 이 안에 산다.
           */}
          <div className="mx-auto flex w-full max-w-container items-center justify-between gap-24">
            {/*
             * 19655:33588 Logo/LG — GNBContent 안의 첫 아이템이다. 세로는 items-center 가
             * 가운데에 둔다(Figma 도 가운데에서 0.5 차이다). 높이 44 는 GNBContent 자체
             * 높이지만 루트 높이가 h-80 고정이라 바 높이를 밀지 않는다.
             */}
            <LogoLG variant="color" className="h-44! shrink-0" />
            {/* 19655:33694 — layout=LeftMenu (위 대조 근거 참고) */}
            <CategoryMenu layout="leftMenu" items={items} className="shrink-0" />
            {/*
             * 19661:4413 — 받은 핸들러를 그대로 스프레드한다. rightMenu 가 없으면 아무 prop 도
             * 붙지 않아 이전과 같은 마크업이 나온다(스프레드는 클래스에 닿지 않는다).
             */}
            <RightMenu {...rightMenu} className="shrink-0" />
          </div>
        </>
      ) : (
        /*
         * 19655:33547 Link — 고정 높이 76(h-76) + Figma 가 건 padding(px-24). 이 프레임이
         * default 의 GNBContent 와 같은 자리를 맡는다: 폭 1440 을 상한으로 잡고 가운데 서서,
         * 루트의 px-gutter 와 합쳐 1920 에서 240–1680 이 된다. 로고는 items-center 로 세로
         * 가운데에 둔다.
         */
        <div className="mx-auto flex h-76 w-full max-w-container items-center px-24">
          {/* 19655:33548 — Logo/LG 인스턴스가 아니라 같은 로고의 이미지다(위 확인 근거 참고) */}
          <LogoLG variant="color" className="h-38!" />
        </div>
      )}
    </header>
  )
}
