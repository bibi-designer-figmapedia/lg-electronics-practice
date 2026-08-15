import type { HTMLAttributes, ReactNode } from 'react'

/*
 * BodyText — Figma "BodyText" 의 구현체. Eyebrow / 제목 / 본문 3줄을 세로로 쌓는
 * 텍스트 블록이며, layout 축이 정렬만 바꾼다.
 *
 * Figma 원본 (산출물 1)
 *   frame:           https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4543
 *   layout=left:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4541
 *   layout=center:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4542
 *   variant 2개를 모두 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs 로 두 variant 각각 읽었고
 * 두 집합은 완전히 동일했다. 값 자체는 여기 적지 않는다(레이어 3 hook 대상).
 * 값은 src/tokens/ 를 볼 것.
 *
 *   용도                      Figma 변수        코드 토큰                 유틸리티
 *   Eyebrow 타이포            body/default      type-body-default         type-body-default
 *   Eyebrow 색                text/secondary    --color-text-secondary    text-text-secondary
 *   제목 타이포               subtitle/large    type-subtitle-large       type-subtitle-large
 *   제목 색                   text/primary      --color-text-primary      text-text-primary
 *   본문 타이포               body/default      type-body-default         type-body-default
 *   본문 색                   text/secondary    --color-text-secondary    text-text-secondary
 *   루트 gap                  spacing/24        --spacing-24              gap-24
 *   Text gap (제목군↔본문군)  spacing/8         --spacing-8               gap-8
 *   Title gap (Eyebrow↔제목)  spacing/8         --spacing-8               gap-8
 *   Body gap                  spacing/12        --spacing-12              gap-12
 *
 *   신규 토큰 없음. 위 6개 대응은 모두 이미 있던 토큰이고, 합성 텍스트 스타일 2개는
 *   Figma 의 body/default · subtitle/large 정의(글꼴·크기·굵기·줄높이·자간)와
 *   src/tokens/typography.tokens.css 의 @utility 정의가 항목별로 일치함을 확인했다.
 *
 * 어느 텍스트가 어떤 스타일인지 (추정하지 않고 확인한 것)
 *   Eyebrow(19655:34600 / 19655:34617) 와 본문(19655:34606 / 19655:34623) 은 색·타이포가
 *   서로 같다 — 둘 다 text/secondary + body/default 다. 제목(19655:34601 / 19655:34618) 만
 *   text/primary + subtitle/large 다. 세 텍스트 모두 정의된 스타일에 정확히 대응하며,
 *   매핑하지 못한 텍스트는 없다.
 *
 * left 와 center 의 차이는 정렬 2개뿐이다
 *   get_design_context 두 결과를 비교하면 루트의 교차축 정렬(items-start↔items-center) 과
 *   텍스트 정렬(Figma 는 Title 그룹과 본문 각각에 text-center 를 건다) 만 다르다. 색·타이포·
 *   간격·구조는 완전히 같다. 코드에서는 text-align 이 상속되므로 루트에 한 번만 건다 —
 *   Figma 가 두 군데에 건 것과 결과가 같다.
 *
 * 확정된 구현 판단 5가지
 *   - 폭: Figma 인스턴스는 고정 폭을 갖지만 그 폭에 대응하는 Figma 변수가 없고, 내부
 *     텍스트 레이어는 전부 부모 폭을 채운다(fill). 임의값으로 폭을 박지 않고 루트를
 *     w-full 로 두어 호출부가 폭을 정한다 — Navigation 과 Input 이 쓰는 방식과 같다.
 *   - 요소 종류: 제목은 headingLevel prop 에 따라 h1~h6 중 하나로 렌더하고 기본값은 2 다.
 *     Eyebrow 와 본문은 제목이 아니므로 계속 <p> 다.
 *     ↳ 이 판단은 번복된 것이다. 이전 구현은 "Figma 에 레벨 정보가 없으므로 레벨을
 *       발명하지 않는다"는 이유로 제목까지 <p> 로 뒀다. design-reviewer 가 그 전제를
 *       반박했다 — 레벨 정보가 없다는 것이 heading 이 아니라는 뜻은 아니며, 시각적으로
 *       명확한 제목(type-subtitle-large)을 <p> 로 두면 스크린리더의 heading 탐색이
 *       불가능해 WCAG 2.1 SC 1.3.1 (Level A) 위반이다. 해소 방식(prop 이름 headingLevel ·
 *       기본값 2 · 값은 레벨 숫자)은 사용자가 확정했고, src/components/title/ 의 3개
 *       컴포넌트에 동일한 규격으로 적용된다.
 *     ↳ 기본값 2 의 근거 — 확인한 것과 추정한 것을 구분해서 적는다.
 *       확인: 같은 섹션 ComponentTitle 의 제목 레이어(19661:15684)는 이름이 "Heading 2" 다
 *             (get_metadata 로 직접 확인했다).
 *       확인: BodyText 자신의 제목 레이어(19655:34601 / 19655:34618)의 이름은 "Title Text",
 *             부모 프레임은 "Title" 이다. 즉 이 컴포넌트 내부에는 레벨 숫자가 없다.
 *       따라서 기본값 2 는 BodyText 안에서 읽어낸 값이 아니라 같은 섹션이 쓰는 규칙을
 *       따른 것이다. 페이지 문맥이 다르면 호출부가 headingLevel 로 바꾼다 — 기본값이
 *       있다는 것과 그것이 모든 문맥에서 옳다는 것은 다르다.
 *   - 태그가 바뀌어도 렌더 결과는 같다. 클래스 문자열은 한 글자도 바뀌지 않았고, 브라우저
 *     기본 heading 스타일(굵기 · 크기 · 바깥 여백)이 끼어들 여지도 없다: Tailwind preflight
 *     가 h1~h6 의 font-size · font-weight 를 inherit 로 되돌리고 바깥 여백을 지우며, 그
 *     위에 type-subtitle-large 가 글꼴 · 크기 · 굵기 · 줄높이 · 자간을 모두 명시한다.
 *     preflight 는 src/index.css 의 @import 'tailwindcss' 로 들어오고, Storybook 도
 *     .storybook/preview.ts 에서 같은 파일을 불러오므로 앱과 story 의 판정이 같다.
 *     이 변경으로 추가한 토큰은 없다.
 *   - 3개 텍스트는 모두 필수 prop 이다. Figma 세트의 속성은 layout 하나뿐이고 텍스트를
 *     숨기는 boolean 속성이 없다. 선택으로 풀면 빠뜨렸을 때 타입은 통과하지만 줄이
 *     조용히 사라진다 — Navigation 이 notification 을 필수로 둔 것과 같은 판단이다.
 *   - 내부 state 없음. Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * 그대로 옮기지 않은 것 2가지 (숨기지 않고 적는다)
 *   - Figma 내부 컨테이너(Text · Title · Body)의 items-start 는 자식이 전부 부모 폭을
 *     채우므로 렌더에 영향이 없다. 정렬은 layout 축이 실제로 바꾸는 루트에만 둔다.
 *   - 본문 래퍼의 truncate(overflow-hidden + text-ellipsis) 와 줄높이 0 은 Figma 자동
 *     레이아웃 export 산물이다. 줄 수 제한도 nowrap 도 없는 상태에서는 렌더 결과가
 *     같으므로 옮기지 않았다(줄높이 0 은 애초에 토큰 없는 임의값이다).
 */

export type BodyTextLayout = 'left' | 'center'

/* 제목이 렌더될 heading 레벨. src/components/title/ 의 3개 컴포넌트가 같은 이름 · 같은
   타입 · 같은 기본값(2)을 쓴다 — 세 컴포넌트의 규격이 어긋나면 호출부가 컴포넌트마다
   다른 규칙을 외워야 한다. 공용 파일로 빼지 않은 이유는 이 작업의 편집 범위가 BodyText
   2개 파일로 한정돼 있어서다(보고에 남겼다). */
export type BodyTextHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface BodyTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma 의 layout 축. 정렬만 바꾼다. */
  layout?: BodyTextLayout
  /**
   * 제목을 렌더할 heading 레벨. 기본 2(`<h2>`) — 근거는 위 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다. 문서의 heading 순서가 건너뛰지
   * 않도록 놓이는 위치에 맞춰 호출부가 지정한다.
   */
  headingLevel?: BodyTextHeadingLevel
  /** 제목 위 작은 라벨 (Figma 19655:34600 / 19655:34617). heading 이 아니다. */
  eyebrow: ReactNode
  /** 큰 제목 (Figma 19655:34601 / 19655:34618). headingLevel 이 정한 heading 요소가 된다. */
  heading: ReactNode
  /** 제목 아래 본문 (Figma 19655:34606 / 19655:34623). */
  body: ReactNode
}

/* layout 축이 바꾸는 것은 루트의 교차축 정렬과 텍스트 정렬 2개뿐이다 (위 주석 참고). */
const layoutClasses: Record<BodyTextLayout, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
}

/** Figma "BodyText"(19661:4543) 의 코드 정본. */
export function BodyText({
  layout = 'left',
  headingLevel = 2,
  eyebrow,
  heading,
  body,
  className = '',
  ...props
}: BodyTextProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. 템플릿 리터럴 타입이
     'h1'|...|'h6' 로 좁혀지므로 임의 태그가 들어올 수 없다. */
  const Heading = `h${headingLevel}` as const

  return (
    /* 19661:4541 / 19661:4542 루트 — gap-24 는 Figma 루트의 spacing/24 다. */
    <div
      className={`flex w-full flex-col justify-center gap-24 break-words ${layoutClasses[layout]} ${className}`}
      {...props}
    >
      {/* 19655:34598 / 19655:34615 Text — 제목군과 본문군 사이 간격 */}
      <div className="flex w-full flex-col justify-center gap-8">
        {/* 19655:34599 / 19655:34616 Title — Eyebrow 와 제목 사이 간격 */}
        <div className="flex w-full flex-col gap-8">
          <p className="type-body-default w-full text-text-secondary">{eyebrow}</p>
          {/* 클래스는 <p> 때와 동일하다 — 바뀐 것은 태그뿐이다. */}
          <Heading className="type-subtitle-large w-full text-text-primary">{heading}</Heading>
        </div>
        {/* 19655:34605 / 19655:34622 Body */}
        <div className="flex w-full flex-col gap-12">
          <p className="type-body-default w-full text-text-secondary">{body}</p>
        </div>
      </div>
    </div>
  )
}
