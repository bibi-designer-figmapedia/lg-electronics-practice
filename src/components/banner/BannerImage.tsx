import type { ImgHTMLAttributes } from 'react'

/*
 * BannerImage — Figma "BannerImage" 의 구현체. 배너 한 칸을 꽉 채우는 사진 한 장이
 * 전부다. 텍스트도 상태도 없고, HeroBanner 가 배경으로 깔기 위해 쓴다.
 *
 * Figma 원본 (산출물 1)
 *   component set "BannerImage": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-16812
 *   type=1: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31147
 *   type=2: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19690-1023
 *   type=3: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19739-923
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
 *   프레임 높이   800           변수 없음 -> 폭 대비 비율로 옮긴다       -           aspect-12/5
 *
 *   신규 토큰 없음. 800 / 1920 = 0.41666… 로 정확히 5 / 12 라 나눗셈이 떨어지고,
 *   Tailwind 가 분수 비율을 그대로 받는다(PDPItemImage 의 aspect-4/3 과 같은 형식).
 *   폭이 1920 인 문맥에서는 높이가 정확히 800 이 되고, 그보다 좁은 폭에서도 비율이
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
 *   Figma 컴포넌트 세트에는 type=1 · type=2 가 실재했다(지금은 type=3 이 더 있다 — 아래
 *   "type=3 은 코드가 먼저다" 항목 참고). 그런데 그 두 variant 를
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
 * type=3 은 코드가 먼저다 (방향이 반대인 유일한 variant)
 *   type=1 · type=2 는 Figma 가 원본이고 코드가 옮겨 온 것이다. type=3(대리석 거실)은
 *   반대다 — Higgsfield(nano banana)로 type=2 를 참조 이미지 삼아 생성해 코드에 먼저
 *   넣고, 그 다음 Figma 세트에 variant 로 올렸다. 즉 Figma 의 type=3 노드는 코드
 *   에셋의 사본이지 그 반대가 아니다. 나중에 둘이 어긋났을 때 어느 쪽을 원본으로 볼지가
 *   이 방향에 달려 있어서 적어 둔다.
 *   이 축이 늘어나도 컴포넌트는 바뀌지 않았다 — 사진이 src prop 이라 variant 추가가
 *   코드 변경을 요구하지 않는다는 것이 위 결정의 결과다.
 *
 * alt 를 선택이 아니라 필수로 뒀다
 *   PDPItemImage 와 같은 규격이다. 장식용 배경이라면 호출부가 빈 문자열을 **명시적으로**
 *   넘긴다 — 빠뜨려서 비는 것과 의도해서 비우는 것은 다르고, 후자만 접근성상 올바르다.
 *   HeroBanner 가 실제로 그 선택을 한다(HeroBanner.tsx 의 "alt" 항목 참고).
 *
 * object-cover 를 두 variant 에 모두 건 이유
 *   Figma 의 type=2 출력에는 object-cover 가 있고 type=1 출력에는 없다. 이는 두 사진의
 *   원본 비율 차이 때문이다 — export 를 받아 확인하니 type=1 은 3840 x 1600 으로 프레임
 *   비율(12/5)과 정확히 같아 잘라낼 것이 없고, type=2 는 3840 x 1630 이라 프레임이
 *   위아래를 잘라낸다. 같은 컴포넌트가 사진 비율에 따라 다르게 동작할 이유가 없으므로
 *   프레임이 잘라내는 쪽(object-cover)으로 통일했다. 비율이 맞는 사진에서는 두 방식의
 *   렌더 결과가 픽셀 단위로 같다.
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
    <div className={`relative aspect-12/5 w-full overflow-clip ${className}`}>
      {/* 19635:27596 / 19690:1024 image 3 */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" {...props} />
    </div>
  )
}
