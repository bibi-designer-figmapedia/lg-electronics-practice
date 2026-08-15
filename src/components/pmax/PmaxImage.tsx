import type { ImgHTMLAttributes } from 'react'

/*
 * PmaxImage — Figma "PmaxImage" 의 구현체. Pmax 배너의 정사각 캔버스를 사진 한 장이
 * 꽉 채워 잘라내는 것이 전부다. 텍스트도 상태도 오버레이도 없다.
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19676-24840
 *   variant Default:  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32607
 *   variant Variant2: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19676-24841
 *   부모 section "Pmax banner template": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32050
 *   get_metadata + get_screenshot + get_design_context 를 두 variant 각각에 대해 읽었다.
 *
 * 토큰 매핑 (산출물 2)
 *   get_variable_defs(19676:24840) 의 결과는 **빈 객체**다 — 이 노드와 두 variant 어디에도
 *   바인딩된 Figma 변수가 하나도 없다. 그래서 아래 표의 근거는 "변수" 가 아니라 "실측값"
 *   이며, 그 구분을 숨기지 않는다 (원칙 1). PDPItemImage 가 같은 상황을 적은 방식을 따랐다.
 *
 *   용도            Figma 실측   대응 근거                                     코드 토큰   유틸리티
 *   프레임 폭       1200         변수 없음. src/tokens/layout.tokens.css 의
 *                                --container-viewport / --container-banner /
 *                                --container-container 를 뒤졌으나 1200 에
 *                                해당하는 토큰이 없다 → 폭을 박지 않는다        -           w-full
 *   프레임 높이     1200         변수 없음 → 폭 대비 비율로 옮긴다             -           aspect-square
 *   모서리 반경     0            디자인에 반경이 없다. radius.tokens.css 의
 *                                --radius-28 계열은 여기서 쓸 자리가 없다      -           (없음)
 *   색·간격·타이포  없음         노드에 색/간격/텍스트가 전혀 없어
 *                                --color-* / --spacing-* / --text-* 중
 *                                대응시킬 것이 없다                            -           (없음)
 *
 *   신규 토큰 없음. 이 컴포넌트는 토큰이 필요한 시각 값을 하나도 쓰지 않는다 —
 *   w-full · aspect-square · object-cover 는 값이 아니라 레이아웃 규칙이다.
 *   "코드 토큰" 칸이 전부 "-" 인 것은 조사를 건너뛴 것이 아니라, 위 3개 토큰 파일을
 *   확인한 뒤 대응시킬 값 자체가 없다고 판정한 결과다 (원칙 2).
 *
 * 확정된 구현 판단 4가지
 *   - variant prop 을 만들지 않았다. get_design_context 를 두 variant 각각에 대해 읽은
 *     결과, 19649:32607(Default) 과 19676:24841(Variant2) 의 출력은 img 의 src 를 뺀
 *     모든 부분이 문자 단위로 같다 — 같은 크기, 같은 object-cover, 반경도 오버레이도
 *     크롭 차이도 없다. get_screenshot 으로 봐도 다른 것은 사진 내용뿐이다(Default 는
 *     책상에서 노트북을 쓰는 인물, Variant2 는 가전이 놓인 거실). 즉 Figma 의
 *     `Property 1` 축은 시각 처리가 아니라 **어떤 사진을 넣었는가**를 가르는 축이고,
 *     그 축은 이미 src prop 이 표현한다. variant='default' | 'variant2' 를 두면 같은
 *     것을 두 번 표현하게 되고 렌더 결과가 완전히 같은 죽은 prop 이 남는다 (원칙 2).
 *   - 크기: 1200 x 1200 을 고정하지 않고 w-full + aspect-square 로 옮겼다. 정확히 1:1 이라
 *     비율로 옮겨도 값이 떨어지고, 이 컴포넌트가 놓이는 자리(같은 섹션의 PmaxLayout
 *     19649:32052 · PmaxBanner 19661:21073 이 둘 다 1200 x 1200 캔버스다)에서 폭이 1200 이면
 *     높이도 정확히 1200 이 된다. 폭에 대응하는 Figma 변수가 없으므로 폭은 호출부가
 *     정한다 — PDPItemImage 와 같은 규칙이다.
 *   - 이미지는 src / alt 를 필수 prop 으로 받는다. Figma 가 그린 사진은 이 컴포넌트의
 *     시각 정의가 아니라 **내용**이고, 인스턴스마다(=variant 마다) 교체되는 자리다.
 *     파일을 컴포넌트에 박으면 다른 캠페인 사진을 넣을 수 없다. Figma export 원본은
 *     story 가 쓰도록 PmaxImage.sample.png 로 같은 폴더에 두었다 — 컴포넌트는 그 파일을
 *     import 하지 않는다. alt 도 필수다: 장식용이면 호출부가 빈 문자열을 명시적으로
 *     넘긴다. 빠뜨려서 비는 것과 의도해서 비우는 것은 다르고, 후자만 올바르다.
 *   - object-cover + overflow-clip: Figma 프레임이 이미지를 잘라내는 방식 그대로다.
 *     원본 export 의 absolute inset-0 / size-full 과 같은 뜻이다.
 *
 * 그대로 옮기지 않은 것 3가지 (숨기지 않고 적는다)
 *   - Figma 프레임의 고정 크기 1200 x 1200. 위 "크기" 판단대로 비율로 대체했다. 폭이 1200 인
 *     문맥에서는 두 방식의 렌더 결과가 같다.
 *   - export 코드의 max-w-none. 이 프로젝트는 img 에 전역 max-width 를 걸지 않으므로
 *     지울 값이 없다. PDPItemImage 도 같은 이유로 옮기지 않았다.
 *   - export 코드의 pointer-events-none. Figma 뷰어 산물이다 — 이미지를 클릭 대상에서
 *     빼야 할 이유가 코드에는 없다.
 */

export interface PmaxImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** 정사각 캔버스를 채울 사진. Figma 의 Property 1 축이 가르던 바로 그 자리다. */
  src: string
  /**
   * 이미지 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * (빠뜨린 것과 의도해서 비운 것을 구분하기 위해서다.)
   */
  alt: string
  /** 바깥 프레임에 붙는 클래스. 폭은 여기서 정한다(기본은 w-full). */
  className?: string
}

/** Figma "PmaxImage"(19676:24840) 의 코드 정본. */
export function PmaxImage({ src, alt, className = '', ...props }: PmaxImageProps) {
  return (
    /* 19676:24840 — 사진을 꽉 채워 잘라내는 정사각 프레임. */
    <div className={`relative aspect-square w-full overflow-clip ${className}`}>
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" {...props} />
    </div>
  )
}
