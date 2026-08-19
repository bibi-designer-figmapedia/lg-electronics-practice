import type { ImgHTMLAttributes } from 'react'

/*
 * BannerImage — Figma "BannerImage" 의 구현체. 배너 한 칸을 꽉 채우는 사진 한 장이
 * 전부다. 텍스트도 상태도 없고, HeroBanner 가 배경으로 깔기 위해 쓴다.
 *
 * Figma 원본 (산출물 1)
 *   component set "BannerImage": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16812
 *   type=1: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31147
 *   type=2: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19690-1023
 *   부모 section "banner": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23347
 *
 *   두 variant 를 각각 get_design_context · get_variable_defs 로 읽었다. 추정한 값은
 *   없다 — 추정이 남은 지점은 아래에서 "미확인" 이라고 따로 적었다.
 *
 * 토큰 매핑 (산출물 2)
 *   get_variable_defs(19643:31147) 의 결과는 **빈 객체**다 — 이 노드에 바인딩된 Figma
 *   변수가 하나도 없다. 그래서 아래 표의 근거는 "변수" 가 아니라 실측값이며, 그 구분을
 *   숨기지 않는다 (원칙 1). PDPItemImage 가 같은 상황이었다.
 *
 *   용도          Figma 실측    대응                                    코드 토큰   유틸리티
 *   프레임 폭     1920          변수 없음 -> 폭을 박지 않는다            -           w-full
 *   프레임 높이   720           변수 없음 -> 폭 대비 비율로 옮긴다       -           aspect-8/3
 *
 *   신규 토큰 없음. 720 / 1920 = 0.375 로 정확히 3 / 8 이라 나눗셈이 떨어지고,
 *   Tailwind 가 분수 비율을 그대로 받는다(PDPItemImage 의 aspect-4/3 과 같은 형식).
 *   폭이 1920 인 문맥에서는 높이가 정확히 720 이 되고, 그보다 좁은 폭에서도 비율이
 *   유지된다. --container-viewport(1920)를 폭에 박지 않은 이유는 이 컴포넌트가 놓이는
 *   자리를 호출부가 정하기 때문이다 — HeroBanner 는 이것을 정상 흐름에 그대로 두고, 이
 *   비율이 배너 한 칸의 높이를 정한다.
 *
 *   ↳ 이 문단은 번복됐다. 이전 판은 "HeroBanner 는 이것을 absolute inset-0 으로 깔고,
 *     그때는 폭과 높이가 모두 확정되므로 aspect-ratio 는 아무 일도 하지 않는다" 였고,
 *     두 문장 모두 사실과 반대였다. 루트 클래스가 relative 로 시작하므로 밖에서 absolute
 *     를 덧붙이면 한 요소에 두 position 유틸리티가 붙고, 빌드된 스타일시트 순서상
 *     .relative 가 이겨 position 은 relative 로 계산됐다. 그러면 aspect-ratio 는 "아무
 *     일도 안 하는" 것이 아니라 상자 크기를 정하는 유일한 근거가 된다. 자세한 계측과
 *     처리는 HeroBanner.tsx 의 "BannerImage 를 정상 흐름에 둔 이유" 참고.
 *     이 파일 자체는 그 번복에서 한 줄도 바뀌지 않았다 — 고쳐야 했던 것은 호출 방식이다.
 *
 * type 축을 코드 prop 으로 옮기지 않았다 (숨기지 않고 적는다)
 *   Figma 컴포넌트 세트에 실재하는 variant 는 type=1 · type=2 두 개다. 그 두 variant 를
 *   get_design_context 로 나란히 읽어 대조한 결과, 마크업 · 크기 · 변수가 완전히 같고
 *   **다른 것은 프레임에 들어간 사진 파일 하나뿐**이다 (type=1 은 주방/냉장고, type=2 는
 *   거실/TV). 즉 이 축이 나르는 것은 시각 정의가 아니라 내용이다.
 *   그래서 사진을 src / alt 필수 prop 으로 열었다 — PDPItemImage 가 같은 근거로 내린
 *   결정이고, 사진을 컴포넌트에 박으면 다른 배너를 만들 수 없다. Figma export 원본 2장은
 *   story 가 쓰도록 같은 폴더에 BannerImage.type1.sample.png · BannerImage.type2.sample.png
 *   로 두었다 — 컴포넌트는 그 파일을 import 하지 않는다.
 *   이 판단은 사용자가 확정했다. 대안(type='1' | '2' 축으로 옮기고 사진 2장을 번들에
 *   넣는 안)은 Figma 에 더 충실하지만 배너를 재사용 불가능하게 만들어서 택하지 않았다.
 *
 * type=3 은 Figma 에서 사라졌다 (세트가 3개 -> 2개로 줄었다)
 *   이전 판의 세트에는 type=3(대리석 거실, 19739:923)이 있었고, 그것만 방향이 반대였다 —
 *   Higgsfield(nano banana)로 type=2 를 참조 이미지 삼아 생성해 코드에 먼저 넣고 그 다음
 *   Figma 세트에 올린 것이었다. 이번 실측(get_metadata 19661:16812)에서 세트의 자식은
 *   type=1 · type=2 둘뿐이므로 그 variant 는 Figma 에서 삭제된 것으로 확정하고 story 에서
 *   뺐다. 생성물이었던 BannerImage.type3.sample.png 도 함께 지웠다 — 대응하는 Figma
 *   variant 가 없어졌고 어느 파일도 그것을 import 하지 않는다(요청자 확정 사항).
 *   세트가 줄어도 컴포넌트는 바뀌지 않았다 — 사진이 src prop 이라 variant 증감이 코드
 *   변경을 요구하지 않는다는 것이 위 결정의 결과다.
 *
 * alt 를 선택이 아니라 필수로 뒀다
 *   PDPItemImage 와 같은 규격이다. 장식용 배경이라면 호출부가 빈 문자열을 **명시적으로**
 *   넘긴다 — 빠뜨려서 비는 것과 의도해서 비우는 것은 다르고, 후자만 접근성상 올바르다.
 *   HeroBanner 가 실제로 그 선택을 한다(HeroBanner.tsx 의 "alt" 항목 참고).
 *
 * object-cover 를 두 variant 에 모두 걸고, 잘라내는 위치는 가운데로 통일했다
 *   프레임이 720 으로 낮아지면서 두 사진 모두 세로가 넘친다. get_design_context 가 내는
 *   안쪽 사진의 배치는 두 variant 가 서로 다르다.
 *     type=1 (19643:31147)  높이 111.11% · top 0        -> 아래쪽만 잘린다
 *     type=2 (19690:1023)   높이 113.19% · top -13.15%  -> 위쪽만 잘린다
 *   두 값을 넘침 비율로 환산하면 각각 3840 x 1600(12/5) · 3840 x 1630 짜리 원본을 8/3
 *   프레임에 채운 결과이고, 잘라내는 쪽이 정반대다. 즉 이 오프셋은 컴포넌트의 규칙이
 *   아니라 **사진마다 디자이너가 Figma 안에서 잡은 crop** 이다 — 규칙이라면 두 variant 가
 *   같은 방향이어야 한다. 사진을 src prop 으로 받는 이 컴포넌트가 그것을 재현할 근거는
 *   없으므로 object-cover 기본값(가운데)으로 통일했다. 특정 배너가 다른 앵커를 요구하면
 *   그때 Figma 에 속성으로 만드는 것이 먼저다.
 *   ↳ 이 문단은 번복됐다. 프레임이 800 이던 이전 판에서는 type=1 이 12/5 와 정확히 같아
 *     "잘라낼 것이 없다" 고 적었는데, 720 에서는 그 전제가 사라졌다.
 *   pointer-events-none 은 Figma 뷰어 산물이라 옮기지 않았다 — 배경 사진을 클릭 대상에서
 *   빼야 할 이유가 코드에는 없다. PDPItemImage 가 같은 판단을 했다.
 *
 * 프레젠테이셔널 컴포넌트다. 내부 state 가 없고 Figma 에 없는 옵션 · variant 도 없다.
 */

export interface BannerImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** 프레임을 채울 사진. Figma 의 type 축이 나르던 바로 그 내용이다. */
  src: string
  /**
   * 사진의 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * (빠뜨린 것과 의도해서 비운 것을 구분하기 위해서다.)
   */
  alt: string
  /** 바깥 프레임에 붙는 클래스. 크기와 위치는 여기서 정한다(기본은 w-full + 비율). */
  className?: string
}

/** Figma "BannerImage"(19661:16812) 의 코드 정본. */
export function BannerImage({ src, alt, className = '', ...props }: BannerImageProps) {
  return (
    /* 19643:31147 / 19690:1023 — 사진을 비율대로 잘라내는 프레임. */
    <div className={`relative aspect-8/3 w-full overflow-clip ${className}`}>
      {/* 19635:27596 / 19690:1024 image 3 */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" {...props} />
    </div>
  )
}
