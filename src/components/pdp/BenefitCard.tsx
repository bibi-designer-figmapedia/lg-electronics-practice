import type { HTMLAttributes, ReactNode } from 'react'
import type { BenefitIconName } from '../icons/IconBenefit.names'
import { IconBenefit } from '../icons/IconBenefit'

/*
 * BenefitCard — Figma "Container"(19661:15783) 의 구현체. 흰 카드 한 장에 제목 · 설명이
 * 왼쪽, 혜택 아이콘이 오른쪽으로 놓인다. Figma 에 variant 축도 상태도 없다.
 *
 * 이름이 Figma 와 다른 이유
 *   Figma 원본 이름은 "Container" 다. 이 저장소는 Figma 이름을 그대로 쓰는 것이 관례지만
 *   (FuntionalTab 의 오타까지 유지했다) 여기서는 BenefitCard 로 바꿨다 — 요청자 확정
 *   사항이다. 같은 파일 안에만 "Container" 라는 이름의 프레임이 4개 더 있어서
 *   (19661:15762 · 19649:32971 · 19649:32987 · 19649:32988) 이름으로는 어느 것을 가리키는지
 *   구분되지 않는다. 추적은 이름이 아니라 아래 노드 ID 가 담당한다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15783
 *   쓰이는 곳(인스턴스 3개): PDPComponent 의 Property 1=KeyBenefitPoint
 *     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15975
 *     19661:15784 "Welcome coupon" · 19661:15842 "Exclusive pricing" ·
 *     19661:15852 "Free delivery & installation"
 *   get_design_context(19661:15783) 와 get_design_context(19661:15975) 를 둘 다 읽었다.
 *   추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:15783) 로 읽었다. 값 자체는
 * 여기 적지 않는다(레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것.
 *
 *   용도                  Figma 변수 / 실측     코드 토큰                 유틸리티
 *   카드 배경             bg/default            --color-bg-default        bg-bg-default
 *   카드 모서리           radius/28             --radius-28               rounded-28
 *   카드 안쪽 여백        spacing/32            --spacing-32              p-32
 *   텍스트군↔아이콘 간격  spacing/32            --spacing-32              gap-32
 *   제목↔설명 간격        spacing/8             --spacing-8               gap-8
 *   제목 타이포           subtitle/large        type-subtitle-large       type-subtitle-large
 *   제목 색               text/primary          --color-text-primary      text-text-primary
 *   설명 타이포           body/default          type-body-default         type-body-default
 *   설명 색               text/secondary        --color-text-secondary    text-text-secondary
 *   아이콘 정사각 크기    변수 없음, 실측 64    --spacing-64              size-64
 *   아이콘 색             icon/default          --color-icon-default      IconBenefit 기본값
 *
 *   신규 토큰 없음 — 위 대응은 전부 이미 있던 토큰이다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   오른쪽 아이콘은 Figma 에서 Icon/Benefit 인스턴스(19661:15774)이고 Type=Line black 이다
 *   (변수가 icon/default 하나뿐이라 Line black 임이 확정된다). src/components/icons/
 *   IconBenefit.tsx 를 그대로 재사용했고 새 아이콘 컴포넌트를 만들지 않았다.
 *
 *   어떤 아이콘인지는 이름이 아니라 노드 ID 로 확인했다. get_design_context 가 내주는
 *   Union 레이어 ID 가 IconBenefit.linePaths.ts 의 주석에 적힌 노드 ID 와 1:1 로 맞는다:
 *     19620:23792 -> Welcome Coupon  -> name="welcomeCoupon"   (19661:15784 인스턴스)
 *     19620:23802 -> Discount        -> name="discount"        (19661:15842 인스턴스)
 *     19620:23818 -> Free Delivery   -> name="freeDelivery"    (19661:15852 인스턴스)
 *   세 인스턴스가 서로 다른 아이콘을 쓰므로 icon 은 prop 이다 — Figma 가 실제로 교체하는
 *   자리라서 발명이 아니다.
 *
 * 확정된 구현 판단 6가지
 *   - 아이콘 크기는 래퍼가 들고 IconBenefit 에는 size-full 을 넘긴다. IconBenefit 이
 *     size-96 을 직접 들고 있어 size-64 를 className 으로 넘기면 특이도가 같은 두 규칙이
 *     충돌하고, 빌드된 CSS 순서에 따라 조용히 96 이 이길 수 있다. ButtonText 가 IconUI 를
 *     다루는 방식과 같은 해법이고 그 파일 주석에 같은 근거가 적혀 있다.
 *   - 아이콘에 aria-hidden 을 넘긴다. IconBenefit 은 기본적으로 role="img" 와 Figma 원본
 *     이름의 aria-label 을 붙이는데, 이 카드에서는 제목 텍스트("Welcome coupon")가 같은
 *     뜻을 이미 전달한다. 그대로 두면 스크린리더가 같은 내용을 두 번 읽는다.
 *   - 제목은 headingLevel prop 이 정하는 h1~h6 로 렌더하고 기본값은 2 다. 설명은 제목이
 *     아니므로 <p> 다. src/components/title/ 의 3개 컴포넌트(BodyText · ComponentTitle ·
 *     MainContentTitle)가 쓰는 규격 · 기본값을 그대로 따랐다 — 카드마다 다른 규칙을 두면
 *     호출부가 컴포넌트별로 외워야 한다. 이 카드가 놓이는 자리(PDPComponent)는 위에
 *     ComponentTitle 의 h2 가 있으므로 호출부가 3 으로 낮춘다.
 *     ↳ Figma 에서 이 제목 레이어(19661:15764)의 이름은 텍스트 내용 그대로이고 레벨
 *       숫자가 없다. 즉 기본값 2 는 이 컴포넌트에서 읽어낸 값이 아니라 같은 저장소의
 *       규칙을 따른 것이다 — 확인한 것과 따라간 것을 구분해 적는다 (원칙 1).
 *   - 높이를 고정하지 않았다. Figma 프레임은 높이 196 고정이지만, 그 값은 3개 인스턴스 중
 *     가장 긴 카드("Free delivery & installation" — 제목 2줄 + 설명 2줄)의 자연 높이와
 *     같다: 안쪽 여백 32 x 2 + 제목 42 x 2 + 간격 8 + 설명 20 x 2 = 196. 그래서 카드는
 *     내용 높이로 두고, 3장을 나란히 놓는 쪽(PDPComponent 의 그리드)이 행 높이를 맞춘다.
 *     그 결과 Figma 와 같은 렌더가 나오면서 문구가 바뀌어도 잘리지 않는다.
 *     ↳ 카드 하나만 떼어 보는 story(Default)에서는 높이가 196 보다 낮게 나온다. 이는
 *       버그가 아니라 위 판단의 직접적인 결과다 — story 문서에도 적었다.
 *   - 설명 텍스트의 폭은 박지 않았다. Figma 는 304 고정으로 그려져 있지만 이는
 *     464 - 안쪽 여백 64 - 아이콘 64 - 간격 32 = 304 로, 남는 폭을 채운 결과와 같다.
 *     대응하는 변수도 없어 flex-1 + min-w-0 으로 두었다.
 *   - 내부 state 없음. Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * 그대로 옮기지 않은 것 1가지 (숨기지 않고 적는다)
 *   Figma 텍스트 컨테이너(19661:15762)의 flex-grow 304 와 제목에 걸린 min-content 폭.
 *   자식이 하나뿐인 flex 컨테이너에서 grow 값의 크기는 의미가 없고(혼자 남는 폭을 다
 *   가진다), min-content 폭은 같은 제목에 최소 폭 100% 가 함께 걸려 있어 결과가 부모 폭
 *   채우기와 같다. 둘 다 Figma 자동 레이아웃 산물이다.
 */

/* 제목이 렌더될 heading 레벨. src/components/title/ 의 3개 컴포넌트와 같은 타입 ·
   같은 기본값(2)을 쓴다. */
export type BenefitCardHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface BenefitCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /**
   * 제목을 렌더할 heading 레벨. 기본 2(`<h2>`) — 근거는 위 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다.
   */
  headingLevel?: BenefitCardHeadingLevel
  /** 카드 제목 (Figma 19661:15764). headingLevel 이 정한 heading 요소가 된다. */
  title: ReactNode
  /** 제목 아래 설명 (Figma 19661:15766). heading 이 아니다. */
  description: ReactNode
  /**
   * 오른쪽 혜택 아이콘 (Figma 19661:15774, Icon/Benefit Type=Line black).
   * Figma 인스턴스 3개가 서로 다른 아이콘을 쓰는 자리다.
   */
  icon: BenefitIconName
}

/** Figma "Container"(19661:15783) 의 코드 정본. */
export function BenefitCard({
  headingLevel = 2,
  title,
  description,
  icon,
  className = '',
  ...props
}: BenefitCardProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. BodyText ·
     ComponentTitle 과 같은 방식이다. */
  const Heading = `h${headingLevel}` as const

  return (
    /* 19661:15783 루트 — 높이는 내용이 정한다(위 주석 "높이를 고정하지 않았다" 참고). */
    <div
      className={`flex w-full items-start gap-32 rounded-28 bg-bg-default p-32 ${className}`}
      {...props}
    >
      {/* 19661:15762 Container — 남는 폭을 전부 갖는 텍스트군. */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-8">
        <Heading className="type-subtitle-large w-full text-text-primary">{title}</Heading>
        <p className="type-body-default w-full text-text-secondary">{description}</p>
      </div>

      {/* 19661:15774 Icon/Benefit — 크기는 이 래퍼가 들고 아이콘은 채우기만 한다.
          제목이 같은 뜻을 이미 전달하므로 aria-hidden 이다 (위 주석 참고). */}
      <span className="block size-64 shrink-0">
        <IconBenefit name={icon} className="size-full" aria-hidden />
      </span>
    </div>
  )
}
