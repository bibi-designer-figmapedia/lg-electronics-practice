import type { HTMLAttributes, ReactNode } from 'react'
import { BodyText } from '../title/BodyText'
import type { BodyTextHeadingLevel } from '../title/BodyText'
import { PDPItemImage } from './PDPItemImage'

/*
 * PDPItem — Figma "PDPItem"(19661:21322) 의 구현체. 이미지 한 장 위, 텍스트 블록 아래.
 * 그 둘을 세로로 쌓는 것이 이 컴포넌트가 하는 전부다. Figma 에 variant 축도 상태도 없다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21322
 *   쓰이는 곳(인스턴스 3개): PDPComponent 의 Property 1=KeyBenefitSummary
 *     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15535
 *     19690:958 · 19690:979 · 19690:1000 — 세 인스턴스의 내용은 서로 같다.
 *   get_design_context(19661:21322) 로 읽었다. 추정한 값은 없다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:21322) 로 읽었다.
 *
 *   용도                  Figma 변수 / 실측     코드 토큰       유틸리티
 *   이미지↔텍스트 간격    spacing/20            --spacing-20    gap-20
 *   루트 폭               변수 없음, 실측 464   -               w-full (호출부가 정한다)
 *
 *   이 컴포넌트가 직접 쓰는 값은 위 2개뿐이다. get_variable_defs 가 함께 내주는
 *   spacing/8 · spacing/12 · spacing/24 · text/primary · text/secondary ·
 *   subtitle/large · body/default 는 중첩된 BodyText 인스턴스가 소비하는 값이고,
 *   아래 "재사용" 대로 기존 BodyText 가 이미 갖고 있다.
 *
 *   신규 토큰 없음.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   - 아래쪽 텍스트 블록은 Figma 에서 BodyText 인스턴스(19690:950)이고 참조 노드가
 *     layout=left(19661:4541) 다. src/components/title/BodyText.tsx 가 바로 그 노드의
 *     구현체이며 3줄 구조 · 타이포 · 색 · 간격이 전부 일치한다. 그대로 재사용했고 새
 *     텍스트 블록을 만들지 않았다.
 *   - 위쪽 이미지는 같은 폴더의 PDPItemImage(19661:17023) 인스턴스(19661:17024)다.
 *     이 작업에서 먼저 구현한 것을 그대로 쓴다.
 *   즉 이 파일이 새로 만드는 것은 "둘을 gap-20 으로 쌓는다" 하나뿐이다.
 *
 * 확정된 구현 판단 4가지
 *   - 텍스트 3줄과 이미지를 prop 으로 열었다. Figma 에서 이 문자열들은 중첩 BodyText
 *     인스턴스의 텍스트 override 이지 PDPItem 의 컴포넌트 속성이 아니다. ComponentTitle 은
 *     같은 상황에서 CTA 라벨을 고정했는데, 여기서는 반대로 열었다 — 규칙이 흔들린 것이
 *     아니라 상황이 다르기 때문이고 그 차이를 적어 둔다:
 *       ComponentTitle 의 "Read More" · "Sign in" · "Join US" 는 그 컴포넌트가 항상 그리는
 *       고정 라벨이다. 반면 BodyText 는 eyebrow · heading · body 를 **필수 prop** 으로
 *       요구하는 컴포넌트다. PDPItem 이 그 값을 어딘가에서 받지 않으면 렌더 자체가
 *       불가능하고, 대신 "Eyebrow Text" 같은 Figma 자리표시 문구를 코드에 박게 된다.
 *       즉 여기서 prop 을 여는 것은 API 발명이 아니라 이미 있는 BodyText API 의 전달이다.
 *   - 그래서 prop 이름도 BodyText 것을 그대로 쓴다(eyebrow · heading · body · headingLevel).
 *     이름을 바꿔 옮기면 두 컴포넌트 사이에 번역표가 하나 더 생긴다.
 *   - layout 축은 열지 않았다. BodyText 에는 layout=left / center 가 있지만 PDPItem 의
 *     Figma 인스턴스(19690:950)는 left 하나만 가리킨다. Figma 가 쓰지 않는 축을 코드에서
 *     열면 원본에 없는 선택지를 만드는 것이다.
 *   - 폭은 스스로 정하지 않는다(w-full). Figma 인스턴스 폭 464 에 대응하는 변수가 없고,
 *     이 값은 PDPComponent 의 3열 그리드에서 자동으로 나온다. BodyText · PDPItemImage 가
 *     같은 판단을 하고 있어 세 컴포넌트가 일관된다.
 */

export interface PDPItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 이미지 (Figma 19661:17024). 인스턴스마다 교체되는 내용이다. */
  imageSrc: string
  /** 이미지 대체 텍스트. 장식용이라면 빈 문자열을 명시적으로 넘긴다. */
  imageAlt: string
  /** BodyText 의 eyebrow (Figma 19655:34600). heading 이 아니다. */
  eyebrow: ReactNode
  /** BodyText 의 제목 (Figma 19655:34601). headingLevel 이 정한 heading 요소가 된다. */
  heading: ReactNode
  /** BodyText 의 본문 (Figma 19655:34606). */
  body: ReactNode
  /**
   * 제목을 렌더할 heading 레벨. 그대로 BodyText 에 넘긴다(기본 2).
   * 이 항목이 놓이는 자리(PDPComponent)는 위에 ComponentTitle 의 h2 가 있으므로
   * 호출부가 3 으로 낮춘다.
   */
  headingLevel?: BodyTextHeadingLevel
}

/** Figma "PDPItem"(19661:21322) 의 코드 정본. */
export function PDPItem({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  body,
  headingLevel,
  className = '',
  ...props
}: PDPItemProps) {
  return (
    /* 19661:21322 루트 — 이미지와 텍스트 사이가 gap-20 이다. */
    <div className={`flex w-full flex-col items-start gap-20 ${className}`} {...props}>
      {/* 19661:17024 PDPItemImage 인스턴스 */}
      <PDPItemImage src={imageSrc} alt={imageAlt} />
      {/* 19690:950 BodyText 인스턴스 — layout=left(19661:4541)를 가리킨다. */}
      <BodyText eyebrow={eyebrow} heading={heading} body={body} headingLevel={headingLevel} />
    </div>
  )
}
