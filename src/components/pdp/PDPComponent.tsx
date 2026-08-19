import type { HTMLAttributes, ReactNode } from 'react'
import { ComponentTitle } from '../title/ComponentTitle'
import type { ComponentTitleHeadingLevel } from '../title/ComponentTitle'

/*
 * PDPComponent — Figma "PDPComponent"(19661:16406) 의 구현체. 섹션 머리(ComponentTitle)
 * 아래에 3열짜리 항목 줄을 놓는 PDP 섹션이며, variant 축이 머리의 종류와 바깥 여백을
 * 바꾼다.
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16406
 *   Property 1=KeyBenefitSummary: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15535
 *   Property 1=KeyBenefitPoint:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15975
 *   부모 section "PDP": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16839
 *   variant 2개를 각각 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * Figma 축 값 <-> 코드 prop 값 (산출물 2 보조)
 *   Figma 축 이름은 "Property 1" 이다 — 이름이 비어 있는 것과 같아서 코드에서는 variant
 *   로 받는다. IconBenefit 이 Figma 의 Type 축을 그대로 type 으로 받은 것과 달리, 여기는
 *   따라 쓸 이름이 없다. 값은 첫 글자만 소문자로 바꿔 옮겼다:
 *     KeyBenefitSummary -> 'keyBenefitSummary'
 *     KeyBenefitPoint   -> 'keyBenefitPoint'
 *   이 표가 원본과 코드값을 잇는 유일한 연결이므로 이름을 바꾸려면 여기도 같이 고쳐야 한다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs 로 variant 별로 읽었다.
 * 이 파일이 **직접** 쓰는 값만 적는다.
 *
 *   Property 1=KeyBenefitSummary (19661:15535)
 *   용도                   Figma 변수 / 실측       코드 토큰                 유틸리티
 *   머리↔항목줄 간격       spacing/24              --spacing-24              gap-24
 *   항목 사이 간격         spacing/24              --spacing-24              gap-24
 *   루트 폭                실측 1440 = container   --container-container     max-w-container
 *
 *   Property 1=KeyBenefitPoint (19661:15975)
 *   용도                   Figma 변수 / 실측       코드 토큰                 유틸리티
 *   루트 상하 여백         spacing/48              --spacing-48              py-48
 *   머리↔항목줄 간격       spacing/20              --spacing-20              gap-20
 *   항목 사이 간격         spacing/24              --spacing-24              gap-24
 *   내용 폭                실측 1440 = container   --container-container     max-w-container
 *
 *   신규 토큰 없음 — 위 대응은 전부 이미 있던 토큰이다. get_variable_defs 가 함께 내주는
 *   나머지(title/medium · subtitle/medium · action/primary · radius/8 · bg/default ·
 *   radius/28 · spacing/32 등)는 중첩된 ComponentTitle · BenefitCard · PDPItem 인스턴스가
 *   소비하는 값이고, 그 컴포넌트들이 이미 갖고 있다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   - 두 variant 의 머리는 둘 다 Figma ComponentTitle 인스턴스다. Summary 는
 *     Case=link(19574:8523), Point 는 Case=Button(19661:15712) 을 가리킨다 — 두 노드를
 *     각각 get_design_context 로 읽어 확인했다. src/components/title/ComponentTitle.tsx 가
 *     그 두 Case 의 구현체이므로 그대로 재사용한다. "Read More" 텍스트 링크와
 *     "Sign in" · "Join US" 버튼은 이미 ComponentTitle 안에 있어 이 파일이 다시 만들지
 *     않는다.
 *   - 항목 3개는 이 작업에서 먼저 구현한 PDPItem(Summary) · BenefitCard(Point) 다.
 *     이 파일은 그것들을 배치만 한다.
 *   즉 이 파일이 새로 만드는 것은 "머리 + 3열 그리드" 배치 규칙 하나뿐이다.
 *
 * 확정된 구현 판단 5가지
 *   - 항목 3개를 children 으로 받는다. Figma 가 그린 PDPComponent 의 속성은 Property 1
 *     하나뿐이라 "항목 배열" 같은 자료 구조는 원본에 없다. 항목마다 필드 스키마를 발명하는
 *     대신, 이미 있는 PDPItem · BenefitCard 를 호출부가 직접 조립해 넣게 했다. variant 에
 *     따라 들어갈 컴포넌트가 다른 것도 children 이 맞는 이유다.
 *   - title · description 은 prop 이다. Figma 에서 이 문자열들은 중첩 ComponentTitle
 *     인스턴스의 텍스트 override 이지만, ComponentTitle 이 둘을 **필수 prop** 으로
 *     요구하므로 값을 받지 않으면 렌더 자체가 불가능하다. PDPItem 이 BodyText 의 prop 을
 *     전달한 것과 같은 이유이며, ComponentTitle 이 CTA 라벨을 고정한 것과는 상황이 다르다
 *     (그쪽은 컴포넌트가 항상 그리는 고정 라벨이다).
 *   - 3열 배치는 두 variant 모두 grid 3열 등폭 + gap-24 로 옮겼다. Figma 는 Summary 를
 *     flex(고정 폭 464 자식 + justify-center)로, Point 를 grid(464 3열)로 서로 다르게
 *     그렸지만, container 폭에서 두 방식의 결과는 같다: (1440 - 24 x 2) / 3 = 464.
 *     방식을 하나로 맞춘 대신 각 항목이 고정 폭을 들지 않아도 되고, 그래서 PDPItem ·
 *     BenefitCard · PDPItemImage 가 전부 w-full 로 일관될 수 있다.
 *   - Point 의 카드 3장은 그리드 행이 높이를 맞춘다(grid 기본 stretch). BenefitCard 가
 *     고정 높이 196 을 들지 않고도 Figma 와 같은 렌더가 나오는 지점이다 — 근거는
 *     BenefitCard.tsx 의 "높이를 고정하지 않았다" 참고.
 *   - 내부 state 없음. Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * 그대로 옮기지 않은 것 3가지 (숨기지 않고 적는다)
 *   1. KeyBenefitPoint 루트의 고정 높이 425 와 overflow-clip. 내용 높이 합(여백 48 +
 *      내용 324 + 아래 빈 프레임 16 = 388)보다 크고, 남는 37 은 배경도 테두리도 없어
 *      화면에 아무것도 그리지 않는다. 대응하는 변수도 없어 옮기지 않았다 — 루트는 내용
 *      높이를 갖는다.
 *   2. KeyBenefitPoint 맨 아래의 Text 프레임(19649:33016, 높이 16). **자식이 하나도 없는
 *      빈 프레임**이다. 문구가 정해지면 채워질 자리로 보이지만 지금 옮기면 빈 상자만
 *      만든다. 위 1번의 overflow-clip 때문에 Figma 에서도 그 아래가 잘려 있어, 이 프레임을
 *      빼도 보이는 결과가 달라지지 않는다.
 *   3. KeyBenefitPoint 루트 폭 1486 과 안쪽 프레임 폭 1438 · 오프셋 -1. container(1440) 에
 *      좌우 인셋 24 를 더하면 1488 이라 2 가 어긋나고, 안쪽도 1440 에서 소수점만큼
 *      어긋난다. Figma 자동 레이아웃의 반올림 산물이라 판단해 폭은 w-full +
 *      max-w-container 로 옮겼다 — 어긋난 2 를 재현하려면 토큰 없는 임의값이 필요하다.
 *
 * 루트 좌우 인셋 — 이 컴포넌트는 갖지 않는다 (확정된 인셋 모델)
 *   Figma 의 KeyBenefitPoint 인스턴스는 폭 1486 에 좌우 padding 24 를 갖고, 그것을 그대로
 *   px-24 로 옮겨 두었다. 그 결과 페이지가 인셋 240 을 주는 모델에서는 240 + 24 가 겹쳐
 *   안쪽 컨테이너가 1920 기준 1392 로 나왔다 — Figma 실측 1438 보다 46 좁다.
 *   인셋은 페이지 래퍼(PDP 의 contents)가 주고 이 컴포넌트는 max-w-container 로 폭 상한만
 *   갖는다. 그러면 1920 에서 1440 이 되어 실측 1438 과 2 안쪽에서 맞는다 — 그 2 는 위 3번의
 *   반올림 산물이다. 24 라는 값을 버린 것이 아니라, 같은 인셋을 두 곳에서 더하지 않는다는
 *   뜻이다. 형제 variant(KeyBenefitSummary)가 이미 같은 형태다.
 */

/* Figma 축 "Property 1". 값 대응은 위 주석의 표가 정본이다. */
export type PDPComponentVariant = 'keyBenefitSummary' | 'keyBenefitPoint'

/* HTMLAttributes 의 title 은 툴팁 문자열이라 이 컴포넌트의 섹션 제목(ReactNode)과
   타입이 충돌한다. ComponentTitle 이 같은 이유로 title 을 Omit 한 것과 같다. */
export interface PDPComponentProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Figma 의 Property 1 축. 머리의 종류와 바깥 여백이 바뀐다. */
  variant?: PDPComponentVariant
  /** 섹션 제목. 그대로 ComponentTitle 에 넘어간다. */
  title: ReactNode
  /** 섹션 설명. 그대로 ComponentTitle 에 넘어간다. */
  description: ReactNode
  /**
   * 섹션 제목의 heading 레벨. 그대로 ComponentTitle 에 넘긴다(기본 2).
   * 안에 놓는 PDPItem · BenefitCard 는 이보다 한 단계 낮은 레벨을 쓴다.
   */
  headingLevel?: ComponentTitleHeadingLevel
  /**
   * 3열 그리드에 놓일 항목들.
   *   variant='keyBenefitSummary' -> PDPItem 3개
   *   variant='keyBenefitPoint'   -> BenefitCard 3개
   * Figma 가 항목 배열을 속성으로 갖고 있지 않아 스키마를 발명하지 않았다 (위 주석 참고).
   */
  children: ReactNode
}

/** Figma "PDPComponent"(19661:16406) 의 코드 정본. */
export function PDPComponent({
  variant = 'keyBenefitSummary',
  title,
  description,
  headingLevel,
  children,
  className = '',
  ...props
}: PDPComponentProps) {
  /* Property 1=KeyBenefitPoint (19661:15975) — 상하 여백이 있는 밴드 + 버튼형 머리. */
  if (variant === 'keyBenefitPoint') {
    return (
      <section className={`flex w-full flex-col items-start py-48 ${className}`} {...props}>
        {/* 19649:32971 Container — 인셋을 갖지 않는다(아래 "루트 좌우 인셋" 항목 참고). */}
        <div className="flex w-full flex-col items-start gap-20">
          {/* 19661:15712 ComponentTitle Case=Button — 스스로 container 폭으로 좁힌다. */}
          <ComponentTitle
            case="button"
            headingLevel={headingLevel}
            title={title}
            description={description}
          />
          {/* 19649:32988 Container — BenefitCard 3장. 행 높이는 그리드가 맞춘다. */}
          <div className="mx-auto grid w-full max-w-container grid-cols-3 gap-24">
            {children}
          </div>
        </div>
      </section>
    )
  }

  /* Property 1=KeyBenefitSummary (19661:15535) — 여백 없는 container 폭 블록 + 링크형 머리.
     Figma 의 symbol 과 그 안쪽 container(19661:16073)는 폭 · 크기가 같아 한 겹으로 합쳤다. */
  return (
    <section
      className={`mx-auto flex w-full max-w-container flex-col items-start gap-24 ${className}`}
      {...props}
    >
      {/* 19574:8523 ComponentTitle Case=link — "Read More" 링크를 이미 갖고 있다. */}
      <ComponentTitle
        case="link"
        headingLevel={headingLevel}
        title={title}
        description={description}
      />
      {/* 19649:33026 Rows — PDPItem 3개. */}
      <div className="grid w-full grid-cols-3 gap-24">{children}</div>
    </section>
  )
}
