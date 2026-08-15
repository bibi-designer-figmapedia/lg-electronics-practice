import type { ImgHTMLAttributes } from 'react'

/*
 * PDPItemImage — Figma "PDPItemImage" 의 구현체. 모서리가 둥근 프레임 하나가 이미지를
 * 꽉 채워 잘라내는 것이 전부다. 텍스트도 상태도 없다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17023
 *   부모 section "PDP": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16839
 *   get_design_context(19661:17023) 로 읽었다. Figma 속성(variant 축)은 없다.
 *
 * 토큰 매핑 (산출물 2)
 *   get_variable_defs(19661:17023) 의 결과는 **빈 객체**다 — 이 노드에 바인딩된 Figma
 *   변수가 하나도 없다. 그래서 아래 표의 근거는 "변수" 가 아니라 "실측값 + 그 값과
 *   일치하는 기존 토큰" 이며, 그 구분을 숨기지 않는다 (원칙 1).
 *
 *   용도            Figma 실측   대응 근거                                코드 토큰      유틸리티
 *   모서리 반경     28           같은 섹션 BenefitCard(19661:15783)의     --radius-28    rounded-28
 *                                radius/28 변수와 값이 같다
 *   프레임 폭       464          변수 없음 → 폭을 박지 않는다             -              w-full
 *   프레임 높이     348          변수 없음 → 폭 대비 비율로 옮긴다        -              aspect-4/3
 *
 *   신규 토큰 없음. --radius-28 은 이미 있던 토큰이다(src/tokens/radius.tokens.css).
 *
 * 확정된 구현 판단 4가지
 *   - 크기: 464 x 348 을 고정하지 않고 w-full + aspect-4/3 로 옮겼다. 348 / 464 = 0.75 로
 *     정확히 4:3 이라 나눗셈이 떨어지고, 이 컴포넌트가 놓이는 자리(PDPComponent 의 3열
 *     그리드)에서 열 폭이 정확히 464 가 되므로 높이도 정확히 348 이 된다. 즉 Figma 와
 *     같은 렌더를 내면서 폭이 다른 문맥에서도 비율이 유지된다. BodyText 가 "고정 폭에
 *     대응하는 변수가 없으면 폭은 호출부가 정한다" 고 판단한 것과 같은 규칙이다.
 *   - 이미지는 src / alt 를 필수 prop 으로 받는다. Figma 가 그린 사진은 이 컴포넌트의
 *     시각 정의가 아니라 **내용**이고, 인스턴스마다 교체되는 자리다. 파일을 컴포넌트에
 *     박으면 다른 상품을 넣을 수 없다. Figma export 원본은 story 가 쓰도록
 *     PDPItemImage.sample.png 로 같은 폴더에 두었다 — 컴포넌트는 그 파일을 import 하지
 *     않는다.
 *   - alt 를 선택이 아니라 필수로 뒀다. 장식용 이미지라면 호출부가 빈 문자열을 명시적으로
 *     넘긴다 — 빠뜨려서 비는 것과 의도해서 비우는 것은 다르고, 후자만 접근성상 올바르다.
 *   - object-cover + overflow-clip: Figma 프레임이 이미지를 잘라내는 방식 그대로다.
 *     원본 export 코드의 absolute inset-0 / size-full / max-w-none 도 같은 뜻이라 그대로
 *     옮겼다. pointer-events-none 은 Figma 뷰어 산물이라 옮기지 않았다 — 이미지를 클릭
 *     대상에서 빼야 할 이유가 코드에는 없다.
 *
 * 그대로 옮기지 않은 것 1가지 (숨기지 않고 적는다)
 *   Figma 프레임의 고정 높이 348. 위 "크기" 판단대로 비율로 대체했다. 폭이 464 인
 *   문맥에서는 두 방식의 렌더 결과가 픽셀 단위로 같다.
 */

export interface PDPItemImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** 프레임을 채울 이미지. Figma 인스턴스마다 교체되는 내용이다. */
  src: string
  /**
   * 이미지 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * (빠뜨린 것과 의도해서 비운 것을 구분하기 위해서다.)
   */
  alt: string
  /** 바깥 프레임에 붙는 클래스. 폭은 여기서 정한다(기본은 w-full). */
  className?: string
}

/** Figma "PDPItemImage"(19661:17023) 의 코드 정본. */
export function PDPItemImage({ src, alt, className = '', ...props }: PDPItemImageProps) {
  return (
    /* 19661:17023 — 둥근 모서리로 이미지를 잘라내는 프레임. */
    <div className={`relative aspect-4/3 w-full overflow-clip rounded-28 ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" {...props} />
    </div>
  )
}
