import type { HTMLAttributes } from 'react'
import { Button } from '../Button'

/*
 * MainContentTitle — Figma "MainContentTitle" 의 구현체. 본문 섹션 맨 앞에 놓이는
 * 제목 묶음이다(작은 Eyebrow · 큰 Title · Description · CTA 버튼 2개).
 *
 * Figma 원본 (산출물 1)
 *   frame "MainContentTitle": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19613-13769
 *   parent section "title":   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21338
 *
 *   Size=Large, Align=Left:   node-id=19613-13120
 *   Size=Large, Align=Center: node-id=19613-13201
 *
 *   위 프레임에 그려진 인스턴스는 이 2개뿐이고, 둘 다 get_metadata · get_screenshot ·
 *   get_design_context · get_variable_defs 로 읽었다. 추정한 값은 없다 — 추정이 남은
 *   지점은 아래에서 "미확인"이라고 따로 적었다.
 *
 * variant 축 대응표 (Figma property 이름 -> 코드 prop)
 *   Align=Left    ->  align='left'
 *   Align=Center  ->  align='center'
 *   Size=Large    ->  prop 없음. 그려진 인스턴스가 Large 하나뿐이라 축을 만들지 않았다.
 *                     세트에 다른 Size 가 있어도 이번 범위가 아니다(요청자 확정 사항).
 *
 * 두 variant 의 차이는 정렬 3곳뿐이다 — get_design_context 출력을 줄 단위로 대조한 결과
 *   1. 루트: items-start  ->  items-center. 폭을 채우지 않는 Actions 만 이 값에 반응한다
 *      (Text 는 두 variant 모두 w-full 이라 움직이지 않는다). 실제로 Actions 의 x 는
 *      Left 에서 0, Center 에서 316 이고, 폭 860 에 Actions 폭 228 이므로
 *      (860 - 228) / 2 = 316 으로 정확히 가운데다.
 *   2. Header 프레임에 text-center 가 붙는다(Eyebrow · Title 이 상속받는다).
 *   3. Description 에 text-center 가 붙는다.
 *   Figma 는 2·3 을 각각의 레이어에 걸었지만, 여기서는 그 둘의 공통 조상인 Text 한 곳에
 *   건다. Text 의 직계 텍스트가 그 둘뿐이라 결과가 같고, 정렬 규칙이 한 곳에 모인다.
 *   Actions 는 Text 의 형제여서 이 상속에 걸리지 않는다.
 *   색 · 타이포 · 간격 변수는 두 variant 가 완전히 동일하다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19613:13120) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                      Figma 변수            코드 토큰                유틸리티
 *   Text 묶음 <-> Actions 간격 spacing/24            --spacing-24             gap-24
 *   Header <-> Body 간격       spacing/8             --spacing-8              gap-8
 *   Eyebrow <-> Title 간격     spacing/8             --spacing-8              gap-8
 *   버튼 2개 사이 간격         spacing/8             --spacing-8              gap-8
 *   Eyebrow 색                banner/label          --color-banner-label     text-banner-label
 *   Eyebrow 타이포            nav/menu              type-nav-menu            type-nav-menu
 *   Title 색                  text/primary          --color-text-primary     text-text-primary
 *   Title 타이포              title/xlarge          type-title-xlarge        type-title-xlarge
 *   Description 색            text/secondary        --color-text-secondary   text-text-secondary
 *   Description 타이포        subtitle/medium        type-subtitle-medium     type-subtitle-medium
 *
 *   banner/label 이 어느 레이어의 것인지 확인했다: Eyebrow 텍스트(Left 19613:13083 ·
 *   Center 19613:13164) 하나뿐이다. 이 프레임 서브트리에서 banner/label 을 쓰는 레이어는
 *   그 둘 말고 없다. 새로 등재된 토큰은 --color-banner-label 이고, 등재는 token-guardian 이
 *   했다. 나머지는 전부 기존 토큰을 그대로 쓴다.
 *
 *   get_variable_defs 가 함께 내주는 action/primary · action/secondary · border/strong ·
 *   text/inverse · radius/8 · spacing/4 · spacing/12 · spacing/16 · body/default-strong 은
 *   전부 중첩된 Button/Web 인스턴스에서 올라온 값이다. Button 이 이미 토큰으로 갖고 있어
 *   이 파일은 하나도 다시 지정하지 않는다. font-size/* · font-weight/* · font-family/sans 는
 *   위 텍스트 스타일이 참조하는 원자라 개별로 쓸 자리가 없다.
 *
 * 재사용 (원칙 2) — CTA 는 기존 Button 을 그대로 쓴다. 새 버튼 마크업은 만들지 않았다.
 *   size='sm'           — 두 인스턴스 모두 높이가 44 이고, 상하 padding 이 spacing/12 다.
 *                         Button 의 sm 이 정확히 그 조합이다(md 는 48, lg 는 64).
 *   trailingIcon={false} — Button/Web 세트의 모든 variant 는 Icon 자식(예: 19676:24910)을
 *                         갖는데, 여기 두 인스턴스의 get_design_context 출력에는 아이콘
 *                         노드가 없다. 즉 세트의 trailingIcon 속성이 꺼져 있다.
 *   variant='primary'   — "Buy Now"(Left 19676:24984 · Center 19676:25013). 배경
 *                         action/primary + 라벨 text/inverse 이고, 인스턴스의 라벨 자식
 *                         id 가 I…;19676:24903 인데 19676:24903 은
 *                         "size=sm, state=enabled, type=primary"(19676:24902)의 Label Text 다.
 *                         두 근거가 같은 variant 를 가리킨다.
 *   variant='secondary' — "Learn More"(Left 19676:24957 · Center 19676:25012). 아래 항목 참고.
 *
 * Learn More: Figma 인스턴스는 state=hover 지만 코드는 enabled 로 렌더한다 (사용자 결정)
 *   사실: 이 인스턴스의 라벨 자식 id 는 I…;19676:24909 이고, 19676:24909 는
 *   "size=sm, state=hover, type=secondary"(19676:24908)의 Label Text 다. 그려진 값도
 *   그것과 일치한다 — 배경 action/secondary · 테두리 border/strong · 라벨 text/secondary.
 *   secondary 의 enabled 는 테두리 border/focus · 라벨 text/primary 여서 서로 다르다.
 *   Left(19676:24957) · Center(19676:25012) 두 인스턴스가 똑같이 hover 로 고정돼 있다.
 *   이 사실은 이번 수정에서 get_design_context 로 두 variant 를 각각 다시 읽어 재확인했다
 *   (원칙 1 — 기존 주석을 믿지 않고 원본을 다시 봤다). get_variable_defs(19613:13120) 가
 *   내주는 변수 집합에 border/focus 가 아예 없다는 것도 같은 결론을 가리킨다.
 *
 *   처리: Learn More 에 state 를 넘기지 않는다 — Button 의 기본값 enabled 로 렌더한다.
 *   근거는 아래 번복 이력 2차다.
 *
 *   ↳ 번복 이력 1차. 최초 구현은 "Button 이 state 를 prop 으로 두지 않아 hover 로 굳힌
 *     모습을 API 로 표현할 방법이 없다"는 이유로 enabled 로 렌더했고, 그 차이를 "이 파일에서
 *     유일하게 남은 Figma 와의 시각 차이"로 남기면서 "Figma 쪽 인스턴스를 enabled 로 고치는
 *     것이 맞다고 보지만 판단은 디자이너에게 남긴다"고 적었다. design-reviewer 가 그 차이를
 *     스크린샷 대조 FAIL(6a)로 판정하고 사용자가 "코드를 Figma 에 맞춘다"로 방향을 정했다.
 *     그에 따라 Button 에 state prop('enabled' | 'hover', 기본 'enabled')이 추가됐고
 *     (다른 에이전트의 작업 — Button.tsx 의 "번복 이력" 절), 여기서 state="hover" 를 넘겼다.
 *
 *   ↳ 번복 이력 2차 (현재 구현). state="hover" 는 접근성 회귀였다. design-reviewer 2라운드
 *     계측: hover variant 의 테두리(border/strong) 대 버튼 내부 배경(action/secondary) 대비가
 *     1.67:1 이고, 페이지 배경도 버튼 내부와 같은 밝은 면이라 이 컨트롤을 컨트롤로
 *     식별시키는 시각 정보는 그 테두리 하나뿐이다. WCAG 2.1 SC 1.4.11 Non-text Contrast
 *     (AA) 요구치 3:1 미달이다. enabled(테두리 border/focus)였을 때 같은 자리는 21:1 이었다
 *     — 즉 hover 로 고정한 것이 회귀를 만든 것이다.
 *
 *     Figma 원본이 hover variant(19676:24908)를 정적으로 배치하고 있다는 위 "사실" 항목은
 *     여전히 유효하다. 바뀐 것은 그 사실을 어느 쪽에서 맞추는가다 — 사용자가 "Figma 쪽
 *     Learn More 인스턴스(19676:24957 · 19676:25012)를 state=enabled 로 고친다"로 확정했고,
 *     코드는 그 결정을 선반영해 enabled 로 렌더한다.
 *
 *     따라서 Figma 파일이 아직 hover 인 동안에는 스크린샷 대조에서 이 버튼이 불일치로 잡히는
 *     것이 정상이다. 그것은 코드 결함이 아니라 디자인 쪽 수정 대기 상태다. 이 불일치를
 *     근거로 코드를 다시 state="hover" 로 되돌리지 마라 — 위 계측대로 WCAG 2.1 SC 1.4.11
 *     위반으로 되돌아가는 3번째 번복이다. Figma 인스턴스가 enabled 로 고쳐지면 불일치는
 *     그쪽에서 사라진다.
 *
 *     Button 은 이 작업에서 건드리지 않았다. state prop 은 사용자 결정에 따라 그대로
 *     유지된다 — Figma Button/Web 세트에 실재하는 축이고 Button.stories.tsx 의 hover story
 *     2개가 쓴다. 이 파일이 그 prop 을 쓰지 않게 된 것뿐이다.
 *
 *   Buy Now 는 건드리지 않았다 — 추측이 아니라 확인한 결과다. 라벨 자식 id 가 Left
 *   (I…;19676:24903) · Center(I…;19676:24903) 모두 19676:24903 이고, 이것은
 *   "size=sm, state=enabled, type=primary"(19676:24902)의 Label Text 다. 그려진 값도
 *   배경 action/primary · 라벨 text/inverse · 테두리 없음으로 enabled 와 일치한다.
 *   그래서 primary 버튼에는 state 를 넘기지 않고 기본값 enabled 로 둔다.
 *
 * CTA 라벨을 prop 으로 열지 않은 이유
 *   "Learn More" · "Buy Now" 는 이 컴포넌트의 Figma 속성이 아니다. get_design_context 가
 *   내준 이 컴포넌트의 속성은 align · size · title · eyebrow · description ·
 *   showEyebrow · showDescription 뿐이고, 두 라벨은 중첩 인스턴스의 텍스트 override 로만
 *   존재한다(Left · Center 가 같은 문구다). Figma 가 열지 않은 것을 코드에서 열면 원본에
 *   없는 API 를 발명하는 것이라, 라벨은 Figma 가 그린 문구 그대로 고정했다. 문구를 바꿔야
 *   한다면 Figma 에 텍스트 속성을 만드는 것이 먼저다.
 *
 *   같은 이유로 onClick 같은 핸들러도 넣지 않았다 — Figma 에 목적지도 동작도 없다.
 *   HeaderGNB 가 "Link" 프레임을 a 로 만들지 않은 것과 같은 판단이다.
 *
 * eyebrow · description 이 선택 prop 인 이유 (발명한 옵션이 아니다)
 *   Figma 컴포넌트에 showEyebrow · showDescription 두 boolean 속성이 실재한다(위 속성
 *   목록). 그 축을 별도 boolean prop 으로 두는 대신, 텍스트 prop 을 넘기지 않으면 그
 *   레이어가 렌더되지 않게 했다 — 축이 2개에서 1개로 줄고, "문구는 줬는데 show 가 false"
 *   같은 모순 조합이 애초에 생기지 않는다. title 만 필수다(제목 없는 제목 묶음은 없다).
 *   description 이 없으면 Body 프레임 자체를 렌더하지 않는다. 빈 프레임을 남기면 Text 의
 *   gap 이 그대로 붙어 아래 여백만 남기 때문이다. 그려진 인스턴스 2개는 둘 다 Eyebrow ·
 *   Description 을 켜 두었고, 끈 모습은 Figma 에 그려져 있지 않다(미확인 — 껐을 때 Figma
 *   가 어떤 간격을 내는지는 대조할 원본이 없다).
 *
 * 폭을 860 으로 박지 않은 이유
 *   두 인스턴스의 실측 폭은 860 이지만, 이것은 부모 프레임(942)에서 좌우 여백 41 을 뺀
 *   값이다. 내부 텍스트가 전부 w-full(폭 채움)이라 w-full 로 두면 어떤 컨테이너 폭에서도
 *   같은 비율로 재현된다. HeaderGNB 가 secondary 의 Link 폭을 박는 대신 인셋을 잡은 것과
 *   같은 판단이다.
 *
 * 시맨틱 — Title 은 headingLevel 이 정하는 heading 요소다
 *   ↳ 이 항목은 번복됐다. 이전 구현은 "Figma 가 요소 종류도 heading 레벨도 정의하지
 *     않으므로 레벨을 발명하지 않는다"는 이유로 세 텍스트를 모두 p 로 뒀다.
 *     design-reviewer 가 그 전제를 반박했다 — 레벨 정보가 없다는 것이 heading 이 아니라는
 *     뜻은 아니며, 시각적으로 명확한 제목(type-title-xlarge)을 p 로 두면 스크린리더의
 *     heading 탐색이 불가능해 WCAG 2.1 SC 1.3.1 (Level A) 위반이다. 해소 방식(prop 이름
 *     headingLevel · 값은 heading 레벨 숫자 · 기본값 2)은 사용자가 확정했고,
 *     src/components/title/ 의 컴포넌트들이 같은 규격을 쓴다(BodyText 가 먼저 같은 규격으로
 *     적용됐다 — BodyTextHeadingLevel). Eyebrow 와 Description 은 제목이 아니므로 계속 p 다.
 *
 *   기본값 2 의 근거 — 확인한 것과 추정한 것을 구분해서 적는다.
 *     확인: 이 컴포넌트의 제목 레이어 이름은 두 variant 모두 그냥 "Title" 이고
 *           (Left 19613:13084 · Center 19613:13165), 그 부모 프레임은 "Header" 다.
 *           get_metadata 로 19613:13120 · 19613:13201 을 직접 읽어 확인했다. 즉 이 컴포넌트
 *           서브트리에는 heading 레벨 숫자가 어디에도 없다.
 *     확인: design-reviewer 가 근거로 든 "Heading 2" 레이어(19661:15684)는 같은 섹션
 *           ComponentTitle 의 레이어이고, MainContentTitle 안이 아니다.
 *     따라서 기본값 2 는 이 컴포넌트의 Figma 원본에서 읽어낸 값이 아니다. 같은 섹션이 쓰는
 *     규칙을 따른 값이고, src/components/title/ 세 컴포넌트의 규격을 맞추기 위한 선택이다.
 *     페이지 문맥이 다르면 호출부가 headingLevel 로 바꾼다 — 기본값이 있다는 것과 그것이
 *     모든 문맥에서 옳다는 것은 다르다.
 *
 *   태그가 바뀌어도 렌더 결과는 같다. 클래스 문자열은 한 글자도 바뀌지 않았고, 브라우저
 *   기본 heading 스타일(굵기 · 크기 · 바깥 여백)이 끼어들 여지도 없다: Tailwind preflight
 *   가 h1~h6 의 font-size · font-weight 를 inherit 로 되돌리고 바깥 여백을 지우며, 그 위에
 *   type-title-xlarge 가 글꼴 · 크기 · 굵기 · 줄높이 · 자간을 모두 명시한다(node_modules 의
 *   preflight.css 에서 그 규칙을 직접 확인했다). preflight 는 src/index.css 의
 *   @import 'tailwindcss' 로 들어오고 .storybook/preview.ts 도 같은 파일을 불러오므로 앱과
 *   story 의 판정이 같다. 이 변경으로 추가한 토큰은 없다.
 *
 * title 의 하드 개행을 살린다 (whitespace-pre-line) — 범위 밖 요청으로 추가됨
 *   이 한 줄은 HeroBanner(19661:17371) 작업에서 들어왔다. 사용자가 범위 확장을 명시적으로
 *   승인했고, 그 작업의 design-reviewer 판정 6번(스크린샷 대조) FAIL 을 푸는 유일한 수단이다.
 *
 *   사실 — Figma 원본에 하드 개행이 있다. HeroBanner 의 layout=center 인스턴스가 이
 *   컴포넌트를 title="Lorem ipsum dolor sit." 로 쓰는데(19661:17329), Figma 는 그것을
 *   "Lorem ipsum" / "dolor sit." 두 줄로 그린다. 이것이 폭 때문일 수 없다는 것을 계측으로
 *   확정했다:
 *     - get_metadata(19661:17329) 상 Title 텍스트 노드는 width 860 · height 160 이다
 *       (title/xlarge 의 line-height 80 × 2줄).
 *     - Figma 렌더의 실제 최대 줄 폭은 492 다. 폭 860 짜리 상자에서 소프트 랩이 492 에서
 *       끊길 수 없다.
 *     - 브라우저에서 "Lorem ipsum dolor" 는 724 로, 860 안에 들어간다. 즉 CSS 자동
 *       줄바꿈은 Figma 와 다른 자리에서 끊는다.
 *     - 폰트 메트릭 차이가 아니다 — 같은 세트의 layout=left 인스턴스에서 "Title" 이
 *       양쪽 다 정확히 170, Eyebrow 77, Description 124 로 일치한다.
 *   남는 설명은 원본 문자열의 하드 개행 하나뿐이다. get_variable_defs 도
 *   get_design_context 도 그 개행을 드러내지 않는다 — 후자는 문자열을 한 줄로 내준다.
 *   그래서 이 사실은 MCP 출력이 아니라 렌더 좌표 대조로만 잡힌다(미확인 아님 — 계측으로
 *   확정했다. 다만 Figma 파일 안에서 개행 문자를 직접 본 것은 아니다).
 *
 *   처리 — Title 에만 whitespace-pre-line 을 건다. 개행이 없는 문자열의 동작은 normal 과
 *   같으므로(연속 공백을 접는 것도 동일하다) 기존 호출부는 하나도 영향을 받지 않는다.
 *   Eyebrow 에는 걸지 않았다 — 그쪽은 Figma 가 truncate + whitespace-nowrap 으로 한 줄로
 *   잘라내는 레이어라 개행을 살리는 것 자체가 원본과 어긋난다. Description 에도 걸지
 *   않았다 — 그 자리에 하드 개행이 있다는 증거가 없고, 없는 근거로 동작을 바꾸지 않는다.
 *
 *   부수 효과가 하나 있고, 이것이 오히려 이 처리의 이유다. 개행 없이도 HeroBanner 의
 *   center 인스턴스는 2줄로 접히긴 한다 — 전체 문자열이 폭 860 을 약 20 넘기기 때문이다.
 *   그러나 그것은 끊기는 **자리**가 Figma 와 다르고, 문구나 폰트가 조금만 바뀌면 줄 수까지
 *   달라지는 우연이다. 호출부가 개행을 명시하면 줄바꿈이 결정적이 된다.
 *
 * 프레젠테이셔널 컴포넌트다. 내부 state 가 없고 Figma 에 없는 옵션 · variant 도 없다.
 */

export type MainContentTitleAlign = 'left' | 'center'

/* Title 이 렌더될 heading 레벨. src/components/title/ 의 컴포넌트들이 같은 이름 · 같은
   타입 · 같은 기본값(2)을 쓴다 — 규격이 어긋나면 호출부가 컴포넌트마다 다른 규칙을 외워야
   한다. 타입 이름의 컴포넌트 접두사는 이 폴더의 기존 관례(MainContentTitleAlign ·
   BodyTextHeadingLevel)를 따른다. 공용 파일로 빼지 않은 이유는 이 작업의 편집 범위가
   MainContentTitle 2개 파일로 한정돼 있어서다(보고에 남겼다). */
export type MainContentTitleHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface MainContentTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma 의 Align 축. 정렬만 바뀌고 색 · 타이포 · 간격은 그대로다. */
  align?: MainContentTitleAlign
  /** Title 텍스트. Figma 에서도 항상 켜져 있는 유일한 텍스트다. */
  title: string
  /**
   * Title 을 렌더할 heading 레벨. 기본 2(`<h2>`) — 근거는 위 "시맨틱" 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다. 문서의 heading 순서가 건너뛰지
   * 않도록 놓이는 위치에 맞춰 호출부가 지정한다. Eyebrow · Description 은 heading 이 아니다.
   */
  headingLevel?: MainContentTitleHeadingLevel
  /** Title 위의 작은 라벨. 넘기지 않으면 렌더되지 않는다(Figma 의 showEyebrow=false). */
  eyebrow?: string
  /** Title 아래 본문. 넘기지 않으면 렌더되지 않는다(Figma 의 showDescription=false). */
  description?: string
}

/* 폭을 채우지 않는 Actions 만 이 값에 반응한다 — Text 는 두 variant 모두 폭을 채운다. */
const rootAlignClasses: Record<MainContentTitleAlign, string> = {
  left: 'items-start',
  center: 'items-center',
}

/* Figma 는 Left 에 정렬 속성을 걸지 않는다(기본 왼쪽). Center 만 text-center 를 갖는다. */
const textAlignClasses: Record<MainContentTitleAlign, string> = {
  left: '',
  center: 'text-center',
}

/** Figma "MainContentTitle"(19613:13769) 의 코드 정본. */
export function MainContentTitle({
  align = 'left',
  title,
  headingLevel = 2,
  eyebrow,
  description,
  className = '',
  ...props
}: MainContentTitleProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. 템플릿 리터럴 타입이
     'h1'|...|'h6' 로 좁혀지므로 임의 태그가 들어올 수 없다. */
  const Heading = `h${headingLevel}` as const

  return (
    <div
      className={`flex w-full flex-col gap-24 ${rootAlignClasses[align]} ${className}`}
      {...props}
    >
      {/* 19613:13081 / 19613:13162 Text */}
      <div
        className={`flex w-full flex-col justify-center gap-8 ${textAlignClasses[align]}`}
      >
        {/* 19613:13082 / 19613:13163 Header */}
        <div className="flex w-full flex-col gap-8 break-words">
          {eyebrow ? (
            /* 19613:13083 / 19613:13164 Eyebrow — Figma 가 한 줄로 잘라낸다(줄바꿈 없음). */
            <p className="type-nav-menu w-full truncate text-banner-label">
              {eyebrow}
            </p>
          ) : null}
          {/* 19613:13084 / 19613:13165 Title — whitespace-pre-line 의 근거는 파일 상단
              "title 의 하드 개행을 살린다" 참고. 나머지 클래스는 그대로다. */}
          <Heading className="type-title-xlarge w-full whitespace-pre-line text-text-primary">
            {title}
          </Heading>
        </div>
        {description ? (
          /* 19613:13086 / 19613:13167 Body — Description 을 담기만 하는 프레임이다. */
          <div className="flex w-full flex-col">
            {/* 19613:13088 / 19613:13169 Description */}
            <p className="type-subtitle-medium w-full text-text-secondary">
              {description}
            </p>
          </div>
        ) : null}
      </div>
      {/*
       * 19676:24932 / 19676:25011 Actions — 내용을 감싸는 폭이라 루트의 items-* 가
       * 이 묶음을 좌우로 움직인다. 안쪽 정렬은 Figma 가 건 items-start 그대로다.
       */}
      <div className="flex items-start gap-8">
        {/*
         * 19676:24957 / 19676:25012 — state 를 넘기지 않는다(Button 기본값 enabled).
         * Figma 원본은 hover variant(size=sm, state=hover, type=secondary / 19676:24908)를
         * 정적으로 배치하고 있지만, 그것을 코드로 옮기면 WCAG 2.1 SC 1.4.11 (3:1) 미달이다.
         * 사용자가 Figma 인스턴스를 state=enabled 로 고치기로 확정했고 코드가 그것을
         * 선반영한다 — 자세한 계측과 번복 이력은 파일 상단 "번복 이력 2차" 참고.
         */}
        <Button variant="secondary" size="sm" trailingIcon={false}>
          Learn More
        </Button>
        {/* 19676:24984 / 19676:25013 — Figma 인스턴스가 enabled 라 state 를 넘기지 않는다. */}
        <Button variant="primary" size="sm" trailingIcon={false}>
          Buy Now
        </Button>
      </div>
    </div>
  )
}
