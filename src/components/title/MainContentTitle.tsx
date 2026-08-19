import type { HTMLAttributes } from 'react'
import { Button } from '../Button'

/*
 * MainContentTitle — Figma "MainContentTitle" 의 구현체. 본문 섹션 맨 앞에 놓이는
 * 제목 묶음이다(Eyebrow · Headline · Subcopy · CTA 버튼 1개).
 *
 * Figma 원본 (산출물 1)
 *   component "MainContentTitle": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19832-1348
 *   부모 section "title":         https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21338
 *
 *   레이어 (get_metadata 19832:1348 로 읽은 트리 그대로)
 *     19832:1304 Copy
 *       19832:1305 eyebrowText
 *       19832:1306 textContainer
 *         19832:1307 headlineText
 *         19832:1308 subcopyText
 *     19832:1344 Button/Web (인스턴스)
 *
 *   get_metadata · get_screenshot · get_design_context · get_variable_defs 를 이 노드에
 *   직접 호출해 읽었다. 추정한 값은 없다 — 추정이 남은 지점은 아래에서 "미확인" 이라고
 *   따로 적었다.
 *
 * 이 파일은 같은 이름의 다른 노드를 옮긴 이전 판을 대체한다 (숨기지 않고 적는다)
 *   이전 구현이 참조하던 노드 19613:13769 는 Figma 에서 삭제됐다 — get_metadata 가
 *   "invalid node selection" 을 낸다. 부모 section "title"(19661:21338)을 다시 읽으니
 *   MainContentTitle 은 variant set 이 아니라 단일 컴포넌트 19832:1348 하나이고, 구조도
 *   값도 이전 판과 다르다. 그래서 이 파일은 부분 수정이 아니라 새 원본으로 다시 썼다.
 *   사라진 것을 열거해 둔다 — 되살리려는 다음 사람이 원본을 다시 확인하도록:
 *     - Align 축(Left · Center)          -> 단일 컴포넌트라 variant 축 자체가 없다
 *     - Eyebrow 의 banner/label 색       -> Copy 프레임의 text/primary 를 그대로 상속한다
 *     - Description 의 text/secondary 색 -> 같음. subcopyText 도 text/primary 다
 *     - CTA 2개(Learn More · Buy Now)    -> Buy now 하나만 남았다
 *     - title/xlarge · subtitle/medium   -> title/medium · body/default 로 바뀌었다
 *   이전 판이 길게 남겼던 "Learn More 를 hover 로 그릴 것인가" 번복 이력 3단계는 그
 *   인스턴스가 사라지면서 함께 무효가 됐다. Button 의 state prop 은 그대로 있고 이 파일이
 *   쓰지 않을 뿐이다(Button.stories.tsx 의 hover story 2개가 쓴다).
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19832:1348) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                       Figma 변수 / 실측     코드 토큰               유틸리티
 *   루트 폭                    변수 없음, 실측 542   --container-banner-copy w-banner-copy
 *   Copy <-> CTA 간격          변수 없음, 실측 27    --spacing-24            gap-24
 *   Eyebrow <-> 본문 간격      변수 없음, 실측 10    --spacing-8             gap-8
 *   Headline <-> Subcopy 간격  변수 없음, 실측 20    --spacing-20            gap-20
 *   Copy 전체 글자색           text/primary          --color-text-primary  text-text-primary
 *   Eyebrow 타이포             nav/menu              type-nav-menu         type-nav-menu
 *   Headline 타이포            title/medium          type-title-medium     type-title-medium
 *   Subcopy 타이포             body/default          type-body-default     type-body-default
 *
 *   신규 토큰 1개(--container-banner-copy)만 등재했다. 등재 사유와 이 저장소의 두
 *   네임스페이스 규칙(폭은 --container-*, 간격은 --spacing-*)은 src/tokens/layout.tokens.css
 *   의 주석에 적었다. 나머지는 전부 기존 토큰이다.
 *
 *   간격 3개 중 20 만 Figma 변수이고 542 · 27 · 10 은 변수 없는 실측값이다 — 그 구분을
 *   숨기지 않는다(원칙 1). 근거: get_variable_defs 가 내주는 크기 변수는 spacing/4 ·
 *   spacing/12 · spacing/20 · radius/8 넷뿐이고 그중 spacing/4 · spacing/12 · radius/8 은
 *   중첩 Button/Web 인스턴스에서 올라온 것이다. get_design_context 도 Button 의
 *   padding · radius 는 var(--spacing/...) 참조로 내면서 542 · 27 · 10 은 맨 숫자로 낸다.
 *   오토레이아웃 높이로도 검산된다 — Copy 194 = 24 + 10 + 160,
 *   textContainer 160 = 120 + 20 + 20, 루트 265 = 194 + 27 + 44.
 *
 *   ⚠ 간격 27 · 10 은 스케일 스텝으로 스냅했다 (Figma 와 의도적으로 다른 유일한 값)
 *     이 저장소의 스페이싱 스케일은 4 · 8 · 12 · 16 · 20 · 24 … 이고 27 · 10 은 그 위에
 *     없다. 실측치대로 토큰을 등재하면 스케일에 스텝 2개가 늘어나는데, 두 값 모두 Figma
 *     변수에 바인딩되지 않은 by-eye 값이라 스케일을 오염시킬 만한 근거가 아니다. 그래서
 *     27 -> gap-24, 10 -> gap-8 로 가장 가까운 기존 스텝을 쓴다(요청자 확정 사항).
 *     결과: 루트 높이가 265 대신 260 이 된다(24 + 8 + 160 + 24 + 44). 스크린샷 대조에서
 *     이 5 의 차이가 잡히는 것은 정상이며 코드 결함이 아니다. 되돌리지 말 것 — 되돌리면
 *     스케일 밖 스텝 2개가 다시 들어온다.
 *
 *   get_variable_defs 가 함께 내주는 action/primary · text/inverse · body/default-strong ·
 *   spacing/4 · spacing/12 · spacing/20 · radius/8 은 전부 중첩 Button/Web 에서 올라온
 *   값이다. Button 이 이미 토큰으로 갖고 있어 이 파일은 하나도 다시 지정하지 않는다.
 *   font-size/* · font-weight/* · font-family/* 는 위 텍스트 스타일이 참조하는 원자라
 *   개별로 쓸 자리가 없다.
 *
 * 재사용 (원칙 2) — CTA 는 기존 Button 을 그대로 쓴다. 새 버튼 마크업은 만들지 않았다.
 *   variant='primary'    — 배경 action/primary · 라벨 text/inverse · 테두리 없음.
 *   size='sm'            — 인스턴스 높이가 44 이고 상하 padding 이 spacing/12 다.
 *                          Button 의 sm 이 정확히 그 조합이다(md 는 48, lg 는 64).
 *   trailingIcon={false} — Button/Web 세트의 variant 는 Icon 자식(19676:24904)을 갖는데,
 *                          get_metadata 상 이 인스턴스(19832:1344)의 자식은 라벨 하나뿐이고
 *                          폭도 100 이다. 즉 세트의 trailingIcon 속성이 꺼져 있다.
 *   state 는 넘기지 않는다 — 라벨 자식 id 가 I19832:1344;19676:24903 이고 19676:24903 은
 *   "size=sm, state=enabled, type=primary"(19676:24902)의 Label Text 다. Button 의
 *   기본값이 enabled 라 명시할 것이 없다.
 *
 *   ↳ 좌우 padding 불일치는 해소됐다. 이전 판은 "get_design_context(19676:24902) 가 좌우
 *     padding 을 spacing/20 으로 내는데 Button.tsx 는 spacing/16 이다" 를 미해결로 남겼다.
 *     Button 이 spacing/20 으로 고쳐져(요청자 확정 사항) 이제 양쪽이 같다 — 근거와 3사이즈
 *     표는 Button.tsx 의 토큰 매핑 절 참고.
 *
 * CTA 라벨을 prop 으로 열지 않은 이유
 *   "Buy now" 는 이 컴포넌트의 Figma 속성이 아니다. get_design_context 가 내준 이
 *   컴포넌트의 속성은 eyebrowtext · subcopyText 두 boolean 뿐이고, 라벨은 중첩 인스턴스의
 *   텍스트 override 로만 존재한다. Figma 가 열지 않은 것을 코드에서 열면 원본에 없는 API 를
 *   발명하는 것이라, 라벨은 Figma 가 그린 문구 그대로 고정했다. 문구를 바꿔야 한다면 Figma 에
 *   텍스트 속성을 만드는 것이 먼저다. 같은 납품물의 ComponentTitle 이 같은 규칙을 쓴다.
 *   이 판단은 사용자가 이번 작업에서 다시 확정했다.
 *
 *   같은 이유로 onClick 같은 핸들러도 넣지 않았다 — Figma 에 목적지도 동작도 없다.
 *
 * showEyebrow · showSubcopy 는 Figma 에 실재하는 boolean 속성이다 (발명한 옵션이 아니다)
 *   get_design_context 가 내주는 이 컴포넌트의 시그니처가
 *   { eyebrowtext = true, subcopyText = true } 이고, 둘 다 켜진 것이 기본값이다. 코드 이름은
 *   요청자가 확정한 showEyebrow · showSubcopy 를 쓴다 — Figma 의 eyebrowtext 는 대소문자
 *   규칙이 형제 속성 subcopyText 와도 어긋나 있어 그대로 옮기면 오타처럼 읽힌다.
 *
 *   ↳ 이전 판과 규칙이 반대다. 이전 구현은 "텍스트 prop 을 넘기지 않으면 렌더하지 않는다"로
 *     축을 하나로 줄였고, 그때는 Figma 의 boolean 을 그렇게 흡수하는 것이 축을 아끼는
 *     방법이었다. 이번에는 요청자가 boolean 2개를 명시적으로 지정했으므로 축을 그대로 연다.
 *     그래서 eyebrow · subcopy 텍스트는 선택 prop 이고, 렌더 여부는 오직 boolean 이 정한다.
 *     "문구는 줬는데 show 가 false" 는 문구가 안 보이는 것으로 일관되게 처리되고, 반대
 *     조합(show 가 true 인데 문구가 없음)은 빈 줄이 된다 — 후자를 텍스트 유무로 다시
 *     가리면 boolean 이 유일한 스위치가 아니게 되므로 그렇게 하지 않았다.
 *
 *   끈 모습은 Figma 에 그려져 있지 않다(미확인 — 껐을 때 Figma 가 어떤 간격을 내는지는
 *   대조할 원본이 없다). 코드는 해당 레이어만 빼고 gap 은 그대로 둔다. Subcopy 를 끄면
 *   textContainer 안에 Headline 만 남으므로 gap 이 아무 일도 하지 않는다.
 *
 * 시맨틱 — Headline 은 headingLevel 이 정하는 heading 요소다
 *   Figma 에 레벨 정보는 없다. 레이어 이름은 "headlineText" 이고 부모는 "textContainer"
 *   로, 이 서브트리 어디에도 heading 레벨 숫자가 없다(get_metadata 로 확인). 그러나 레벨이
 *   없다는 것이 heading 이 아니라는 뜻은 아니다 — 시각적으로 명확한 제목(type-title-medium)
 *   을 p 로 두면 스크린리더의 heading 탐색이 불가능해 WCAG 2.1 SC 1.3.1 (Level A) 위반이다.
 *   이 판정은 이 저장소에서 이미 세 번 내려졌고(BodyText · ComponentTitle · 이 컴포넌트의
 *   이전 판), prop 이름 · 타입 · 기본값 2 규격도 그때 확정됐다. 같은 규격을 그대로 쓴다.
 *   기본값 2 는 이 컴포넌트의 Figma 원본에서 읽어낸 값이 아니라 src/components/title/ 세
 *   컴포넌트의 규격을 맞춘 값이다 — 페이지 문맥이 다르면 호출부가 바꾼다.
 *   Eyebrow · Subcopy 는 제목이 아니므로 p 다.
 *
 *   태그가 바뀌어도 렌더 결과는 같다. Tailwind preflight 가 h1~h6 의 font-size ·
 *   font-weight 를 inherit 로 되돌리고 바깥 여백을 지우며, 그 위에 type-title-medium 이
 *   글꼴 · 크기 · 굵기 · 줄높이 · 자간을 모두 명시한다.
 *
 * headline 의 하드 개행을 살린다 (whitespace-pre-line)
 *   Figma 원본의 headlineText 는 한 문단이 아니라 두 줄이다 — get_design_context 가 이
 *   레이어만 p 두 개("Lorem ipsum dolor sit" / "ametap consectetur")로 내주고, 높이 120 도
 *   title/medium 의 줄높이 60 × 2줄이다. 폭 542 짜리 상자에서 소프트 랩이 우연히 그 자리에
 *   떨어질 이유가 없으므로 원본 문자열의 하드 개행으로 본다.
 *   처리 — headline 에만 whitespace-pre-line 을 건다. 개행이 없는 문자열의 동작은 normal 과
 *   같으므로 개행을 넘기지 않는 호출부는 영향을 받지 않는다. Eyebrow · Subcopy 는 각각 한
 *   줄이라 걸지 않았다 — 없는 근거로 동작을 바꾸지 않는다.
 *
 * 프레젠테이셔널 컴포넌트다. 내부 state 가 없고 Figma 에 없는 옵션 · variant 도 없다.
 */

/* Headline 이 렌더될 heading 레벨. src/components/title/ 의 컴포넌트들이 같은 이름 · 같은
   타입 · 같은 기본값(2)을 쓴다 — 규격이 어긋나면 호출부가 컴포넌트마다 다른 규칙을 외워야
   한다. */
export type MainContentTitleHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface MainContentTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Headline 텍스트. Figma 에서 끌 수 없는 유일한 텍스트다. */
  headline: string
  /**
   * Headline 을 렌더할 heading 레벨. 기본 2(`<h2>`) — 근거는 위 "시맨틱" 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다. 문서의 heading 순서가 건너뛰지
   * 않도록 놓이는 위치에 맞춰 호출부가 지정한다. Eyebrow · Subcopy 는 heading 이 아니다.
   */
  headingLevel?: MainContentTitleHeadingLevel
  /** Headline 위의 작은 라벨. 렌더 여부는 `showEyebrow` 가 정한다. */
  eyebrow?: string
  /** Headline 아래 본문 한 줄. 렌더 여부는 `showSubcopy` 가 정한다. */
  subcopy?: string
  /** Figma 의 eyebrowtext 속성. 기본 true. */
  showEyebrow?: boolean
  /** Figma 의 subcopyText 속성. 기본 true. */
  showSubcopy?: boolean
}

/** Figma "MainContentTitle"(19832:1348) 의 코드 정본. */
export function MainContentTitle({
  headline,
  headingLevel = 2,
  eyebrow,
  subcopy,
  showEyebrow = true,
  showSubcopy = true,
  className = '',
  ...props
}: MainContentTitleProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. 템플릿 리터럴 타입이
     'h1'|...|'h6' 로 좁혀지므로 임의 태그가 들어올 수 없다. */
  const Heading = `h${headingLevel}` as const

  return (
    <div
      className={`flex w-banner-copy flex-col items-start gap-24 ${className}`}
      {...props}
    >
      {/* 19832:1304 Copy — 글자색을 여기 한 번만 건다. Figma 도 프레임에 걸었다. */}
      <div className="flex w-full flex-col items-start gap-8 break-words text-text-primary">
        {showEyebrow ? (
          /* 19832:1305 eyebrowText */
          <p className="type-nav-menu w-full">{eyebrow}</p>
        ) : null}
        {/* 19832:1306 textContainer */}
        <div className="flex w-full flex-col items-start gap-20">
          {/* 19832:1307 headlineText — whitespace-pre-line 의 근거는 파일 상단
              "headline 의 하드 개행을 살린다" 참고. */}
          <Heading className="type-title-medium w-full whitespace-pre-line">
            {headline}
          </Heading>
          {showSubcopy ? (
            /* 19832:1308 subcopyText */
            <p className="type-body-default w-full">{subcopy}</p>
          ) : null}
        </div>
      </div>
      {/* 19832:1344 Button/Web — 라벨은 Figma 가 그린 문구 그대로 고정이다(위 주석 참고). */}
      <Button variant="primary" size="sm" trailingIcon={false}>
        Buy now
      </Button>
    </div>
  )
}
