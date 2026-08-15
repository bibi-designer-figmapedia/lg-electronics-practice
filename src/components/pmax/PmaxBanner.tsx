import { useId, type HTMLAttributes } from 'react'
import { PmaxImage } from './PmaxImage'
import { PmaxLayout, type PmaxLayoutProps } from './PmaxLayout'

/*
 * PmaxBanner — Figma "PmaxBanner" 의 구현체. 이 폴더의 마지막 조각이고, 앞의 셋을
 * 합성한다: 사진(PmaxImage) 두 장을 겹쳐 배경을 만들고, 그 위에 글자 레이어
 * (PmaxLayout)를 얹는다. 이 파일이 새로 그리는 것은 사진 두 장 사이에 끼는
 * 반투명 블러 판 하나와, 아래 사진을 물결 모양으로 잘라내는 벡터 하나뿐이다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21073
 *   부모 section "Pmax banner template": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32050
 *
 *   19661:21073  PmaxBanner (캔버스 1200 x 1200, 배경색 있음)
 *     19661:17028  Background image 프레임 (0,0 · 1200 x 1200)
 *       19661:17181  Image 인스턴스 (0,0 · 1200 x 1200)
 *       19661:17030  Blur blind 사각형 (0,0 · 1200 x 1200)
 *       19661:17031  shape 벡터 (마스크로 쓰인다 — 아래 "shape" 항목)
 *       19661:17179  Image 인스턴스 (-240,0 · 1680 x 1680, 위 shape 로 마스크됨)
 *     19661:21565  PmaxLayout 인스턴스 (0,0 · 1200 x 1200)
 *
 *   get_metadata · get_screenshot · get_design_context · get_variable_defs 를 이 노드에
 *   대해 모두 호출했고, Background image 프레임(19661:17028)과 shape 벡터(19661:17031)는
 *   겹침 구조와 path 데이터를 확인하려고 각각 한 번 더 get_design_context 로 읽었다.
 *   추정한 값은 없다 — 변수 바인딩이 없는 값은 아래 표에서 "변수 없음, 실측" 으로
 *   따로 표시했다 (원칙 1).
 *
 * 토큰 매핑 (산출물 2)
 *   Figma 변수는 get_variable_defs(19661:21073) 로 읽었다. 값 자체는 여기 적지 않는다
 *   (레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것.
 *
 *   용도                    Figma 변수 / 실측         코드 토큰               유틸리티
 *   캔버스 배경색           background/LV1            --color-background-lv1      bg-background-lv1
 *   블러 판 색              surface/blur-blind        --color-surface-blur-blind  bg-surface-blur-blind
 *   블러 판 배경 흐림       Blur/Background 150       --blur-blind                backdrop-blur-blind
 *   캔버스 폭               변수 없음, 실측 1200      -                       w-full
 *   캔버스 높이             변수 없음, 실측 1200      -                       aspect-square
 *   두 사진 · 글자 레이어의 위치·간격·타이포는 이 파일이 지정하지 않는다 —
 *   PmaxImage(19676:24840) 와 PmaxLayout(19649:32052) 가 각자 자기 매핑표를 들고 있다.
 *
 *   get_variable_defs 가 함께 내주는 나머지 변수는 전부 자식이 소비한다. brand/logo ·
 *   brand/logo-inverse · brand/secondary 는 PmaxLayout 안의 LogoLG 가, text/primary ·
 *   subtitle/large · title/large 는 카피 3줄이, nav/menu · text/disclaimer ·
 *   shadow/disclaimer 는 고지문이, icon/default · icon/white · black ·
 *   body/default-strong 은 BenefitRow 가, white 와 active-red 는 Button/Promotion 이
 *   쓴다. font-family/sans · font-size/16 · 20 · 36 · 60 · font-weight/regular ·
 *   semibold 는 그 텍스트 스타일들이 참조하는 원자라 이 파일에서 개별로 쓸 자리가 없다.
 *   Warm Gray 05 는 shape 벡터의 fill 인데 그 벡터는 마스크로만 쓰여 색이 렌더되지
 *   않는다 — 그래서 토큰을 대응시키지 않았다(대응시키면 화면에 없는 색을 코드가
 *   주장하게 된다).
 *
 *   신규 토큰 3건은 src/tokens/ 가 token-guardian 의 배타 범위라 여기서 만들지 않았고,
 *   token-guardian 이 등재를 마쳤다. 이 파일이 처음 요청한 이름 중 둘이 등재 과정에서
 *   바뀌었고, 바뀐 이유는 다음 컴포넌트에서 그대로 반복될 종류라 남겨 둔다.
 *
 *     --color-background-lv1      캔버스 배경. Figma background/LV1 이고 값은 이미 팔레트에
 *                           있는 --lg-light-gray-3 과 같다. 그 primitive 를 가리키는
 *                           semantic 은 --color-border-default 뿐인데 "테두리 색" 이라는
 *                           다른 역할이라 배경에 씌우면 역할을 속이는 매핑이 된다.
 *                           처음에 --color-bg-lv1 로 요청했으나 그 이름은 쓸 수 없다:
 *                           Figma 에서 bg/ 와 background/ 는 **다른 그룹**이고, bg/ 가
 *                           발행하는 것은 default · warm · subtle · elevated · light
 *                           다섯뿐이라 bg/lv1 은 존재하지 않는다. 없는 변수를 주장하는
 *                           이름이 되고, Figma 가 실제로 bg/lv1 을 발행하는 날 이름을
 *                           뺏는다. 그룹 이름을 접두어로 유지하는 것이 이 저장소 규칙이다
 *                           (banner/label 을 text/* 에 합치지 않은 선례와 같다).
 *     --color-surface-blur-blind  Blur blind 의 반투명 흰 판. 처음에 "overlay 계열 토큰이
 *                           없으니 역할 이름을 발명한다" 며 --color-overlay-blind 로
 *                           요청했는데, 그 전제가 틀렸다 — Figma 색상 문서 프레임
 *                           19561:25592 가 surface/blur-blind 를 이미 발행하고 있다.
 *                           사용 노드(19661:17030)가 채움을 primitive 쪽에 바인딩해 두어서
 *                           그 노드만 읽으면 semantic 이 보이지 않는다. 노드 하나만 보고
 *                           "semantic 없음" 으로 판정하면 있는 이름을 두고 새 이름을
 *                           만들게 된다(원칙 2 위반). 문서 프레임을 함께 확인해야 한다.
 *     --blur-blind          같은 판의 backdrop 흐림 반경. Figma 이펙트 변수
 *                           Blur/Background 150 이지만 코드 값은 150 이 아니다 —
 *                           get_design_context(19661:17030) 가 직접 내는 CSS 값이 75 이고,
 *                           그것을 그대로 등재했다. "Figma radius 의 절반" 이라는 환산
 *                           규칙은 이 값에서 맞았을 뿐이라 코드에 남기지 않았다.
 *                           이름에 150 을 넣지 않은 것도 같은 이유다 — 그 숫자는 CSS 값이
 *                           아니라서 숫자 이름이 거짓이 된다. Tailwind v4 는 backdrop-blur-*
 *                           를 --blur-* 네임스페이스에서 읽는데, 이 토큰이 그 저장소 첫
 *                           --blur-* 다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   이 파일이 새로 만든 마크업은 묶음 div 3개 · 블러 판 div 1개 · svg 1개뿐이다.
 *     19661:17181 Image      → PmaxImage (뒤에 깔리는 사진)
 *     19661:17179 Image      → PmaxImage (물결로 잘린 앞 사진)
 *     19661:21565 PmaxLayout → PmaxLayout
 *   세 인스턴스 모두 원본이 이 폴더에 이미 있어 새로 만들 것이 없었다. PmaxImage 에는
 *   variant prop 이 없고(두 Figma variant 가 사진 내용만 다르다는 판정), PmaxLayout 의
 *   로고·CTA·혜택 줄 값은 그 파일이 고정값으로 확정해 둔 것이라 여기서 다시 정하지
 *   않는다. 텍스트 5종과 headingLevel 은 PmaxLayoutProps 에서 Pick 으로 그대로 이어
 *   받는다 — 같은 prop 을 두 번 선언하면 설명이 갈라진다.
 *
 * 확정된 구현 판단 6가지
 *   - 두 Image 인스턴스는 **같은 사진**이다. get_design_context(19661:17028) 가 낸 두
 *     인스턴스는 property1 도 이미지 상수도 같다 — 다른 것은 놓인 자리와 크기뿐이다
 *     (하나는 캔버스에 딱 맞고, 다른 하나는 1.4배로 키워 왼쪽으로 밀려 있다). 그래서
 *     사진은 src 하나로 받고, 뒤 사진만 따로 갈아끼우고 싶을 때 쓰라고 backdropSrc 를
 *     선택 prop 으로 열되 기본값을 src 로 두었다. 두 자리를 각각 필수 prop 으로 만들면
 *     Figma 가 같은 사진을 넣은 사실이 호출부에서 사라진다.
 *   - alt 는 하나다. 같은 사진이 두 겹으로 깔려 있을 뿐이므로 대체 텍스트를 두 번
 *     읽히면 스크린리더에 같은 설명이 두 번 나온다. 뒤 사진은 반투명 흰 판과 블러에
 *     가려 내용을 읽을 수 없는 장식이라 alt 를 빈 문자열로 넘기고(PmaxImage 가 요구하는
 *     "의도해서 비운" 경우다), 물결 안의 선명한 앞 사진이 alt 를 갖는다.
 *   - Blur blind 는 blur 가 아니라 **backdrop-blur + 반투명 흰 채움**이다. 이름만 보고
 *     짐작하지 않고 get_design_context(19661:17028) 로 확인했다: 이 노드는 자기 자신을
 *     흐리는 것이 아니라 뒤에 깔린 사진을 흐리고(Figma BACKGROUND_BLUR), 그 위에 흰색
 *     60퍼센트 판을 덮는다. 그래서 위쪽 절반이 뿌옇게 밝아지고 글자가 읽힌다.
 *     그라디언트도 아니고 이미지 필터도 아니다.
 *   - shape 벡터는 **그려지지 않는다 — 앞 사진의 마스크로만 쓰인다.** 이것도 이름과
 *     스크린샷만 보면 "흰 물결을 위에 덮은 것" 으로 오독하기 쉬운데, export 코드에서
 *     마스크 속성이 붙는 곳은 shape 자신이 아니라 두 번째 Image 인스턴스다. 즉 화면의
 *     경계선은 흰 도형의 아래쪽 가장자리가 아니라 **선명한 사진이 시작되는 자리**다.
 *     이 구분이 중요한 이유: 도형을 그리는 방식으로 옮기면 물결 위쪽이 단색으로 덮여
 *     블러 처리된 사진이 사라진다.
 *   - 마스크는 CSS 가 아니라 인라인 svg 의 clipPath 로 옮겼다. path 데이터는 Figma 가
 *     내준 것을 한 글자도 고치지 않고 그대로 쓴다(LogoLG 선례). 좌표를 0~1 로 다시
 *     계산하는 방식(clipPathUnits 를 바꾸는 방식)은 곧 path 를 다시 그리는 것이라
 *     택하지 않았고, CSS mask-image 로 옮기려면 도형을 데이터 URI 문자열로 만들어야
 *     해서 같은 문제가 생긴다. viewBox 를 캔버스 크기로 두면 Figma 좌표를 그대로 적을
 *     수 있고(-240,0 · 1680 크기 · 마스크 변환), svg 가 알아서 폭에 맞춰 확대·축소한다.
 *     프레임 밖으로 나가는 부분은 svg 루트가 기본으로 잘라낸다 — 별도 처리가 필요 없다.
 *     사진 자체는 foreignObject 안에 넣어 PmaxImage 를 그대로 재사용했다. svg 의 image
 *     요소로 다시 그리면 PmaxImage 가 정의한 잘라내기 규칙을 이 파일이 복제하게 된다.
 *   - 마스크 변환 translate(1320.7 371) rotate(90) 은 지어낸 것이 아니라 Figma 노드의
 *     변환 그대로다. shape 는 자기 좌표계에서 가로로 누운 도형인데(내려받은 svg 의
 *     viewBox 가 가로 1542.6 · 세로 1441.4) 인스턴스에서는 90도 돌아 세로 1542.6 이
 *     된다 — get_metadata 가 이 노드의 크기를 1441.4 x 1542.6 으로, 위치를 x 1320.7 ·
 *     y 371 로 내주는 것이 그 회전의 증거다. 회전 뒤 도형의 왼쪽 물결 가장자리가
 *     캔버스의 위쪽 경계가 된다.
 *   - 크기: 1200 x 1200 을 박지 않고 w-full + aspect-square 로 옮겼다. 같은 폴더의
 *     PmaxImage · PmaxLayout 이 같은 캔버스에 세운 규칙과 동일하다 — 셋이 겹쳐 놓이는
 *     사이라 폭 규칙이 어긋나면 포개지지 않는다. 근거는 PmaxImage.tsx 상단에 있다.
 *     svg 안의 숫자(viewBox · foreignObject 좌표 · path 좌표)는 CSS 길이가 아니라
 *     벡터 좌표계의 단위라 이 규칙의 예외가 아니다: 폭이 바뀌면 함께 늘어난다.
 *
 * 그대로 옮기지 못한 것 3가지 (숨기지 않고 적는다)
 *   - Blur blind 가 흐리는 대상. Figma 는 BACKGROUND_BLUR 를 자기 뒤의 형제 노드에만
 *     적용하지만, CSS backdrop-filter 는 그 요소 뒤에 있는 모든 것을 흐린다. 여기서는
 *     블러 판 뒤에 뒤 사진 한 장뿐이라 결과가 같다 — 다만 이 컴포넌트를 흐림이 비쳐야
 *     하는 배경 위에 얹으면 Figma 와 달라진다.
 *   - PmaxLayout 이 요구하는 신규 토큰 9건은 이 파일이 만들지 않는다. 그 토큰이
 *     등재되기 전까지 글자 레이어의 간격이 Figma 와 다르게 렌더된다. 그것은 그
 *     컴포넌트의 책임 범위이고 이 작업에서 PmaxLayout.tsx 를 고치지 않았다.
 *   - export 코드의 pointer-events-none · max-w-none 같은 Figma 뷰어 산물.
 *     PmaxImage · PDPItemImage 가 같은 이유로 옮기지 않은 것들과 같다.
 */

export interface PmaxBannerProps
  extends HTMLAttributes<HTMLDivElement>,
    Pick<
      PmaxLayoutProps,
      'eyebrow' | 'headline' | 'headingLevel' | 'subcopy' | 'ctaLabel' | 'disclaimer'
    > {
  /** 19661:17179 — 물결 안에 선명하게 보이는 사진. 배너의 주 사진이다. */
  src: string
  /**
   * 위 사진의 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * 뒤에 깔리는 사진은 같은 사진의 흐린 사본이라 대체 텍스트를 갖지 않는다.
   */
  alt: string
  /**
   * 19661:17181 — 뒤에 깔려 흐려지는 사진. Figma 는 두 자리에 같은 사진을 넣으므로
   * 기본값이 src 다. 다른 사진을 깔아야 할 때만 넘긴다.
   */
  backdropSrc?: string
  /** 바깥 캔버스에 붙는 클래스. 폭은 여기서 정한다(기본은 w-full). */
  className?: string
}

/** Figma "PmaxBanner"(19661:21073) 의 코드 정본. */
export function PmaxBanner({
  src,
  alt,
  backdropSrc = src,
  eyebrow,
  headline,
  headingLevel,
  subcopy,
  ctaLabel,
  disclaimer,
  className = '',
  ...props
}: PmaxBannerProps) {
  /* clipPath 는 문서 전역 id 로 참조되므로 인스턴스마다 달라야 한다. useId 가 내는
     문자열에는 url 조각에서 쓸 수 없는 구분 문자가 섞여 있어 영숫자만 남긴다.
     Input.tsx 가 useId 를 쓰는 방식과 같고, 새 유틸을 만들지 않았다. */
  const waveClipId = `pmax-banner-wave-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    /* 19661:21073 — 정사각 캔버스. 배경색은 사진에 가려 보이지 않지만 Figma 가 칠해 둔
       것이라 그대로 옮긴다(사진이 로드되지 않으면 이 색이 드러난다). */
    <div
      className={`relative aspect-square w-full overflow-clip bg-background-lv1 ${className}`}
      {...props}
    >
      {/* 19661:17028 Background image — 사진 두 장과 블러 판이 겹치는 프레임. */}
      <div className="absolute inset-0 overflow-clip">
        {/* 19661:17181 Image — 캔버스에 딱 맞는 뒤 사진. 위의 블러 판이 이것을 흐린다. */}
        <PmaxImage src={backdropSrc} alt="" />

        {/* 19661:17030 Blur blind — 뒤 사진을 흐리고 그 위에 반투명 흰 판을 덮는다.
            글자 레이어가 사진 위에서도 읽히는 것은 이 판 덕분이다. */}
        <div className="absolute inset-0 bg-surface-blur-blind backdrop-blur-blind" />

        {/* 19661:17179 Image — 물결로 잘린 앞 사진. viewBox 가 Figma 캔버스와 같은
            좌표계를 만들어 주므로 아래 숫자는 전부 Figma 값 그대로다. */}
        <svg viewBox="0 0 1200 1200" className="absolute inset-0 size-full">
          <defs>
            {/* 19661:17031 shape — 벡터를 그리지 않고 잘라내는 데만 쓴다. transform 은
                Figma 인스턴스의 회전과 위치(90도 회전 + 1320.7,371) 그대로이고,
                path 데이터는 내려받은 svg 에서 한 글자도 고치지 않았다. */}
            <clipPath id={waveClipId}>
              <path
                transform="translate(1320.7 371) rotate(90)"
                d="M213.185 0C188.445 0 163.817 3.24422 139.903 9.65526C12.9054 43.8258 -41.0764 198.443 34.877 307.209C119.12 427.978 164.422 572.303 164.578 720.317C164.726 868.333 119.697 1012.75 35.7073 1133.69C-39.9945 1242.66 13.9204 1397.28 140.944 1431.17C164.745 1437.51 189.225 1440.73 213.808 1440.73C213.877 1440.73 213.94 1440.73 214.011 1440.73L803.804 1440.73C813.588 1441.13 823.356 1441.4 833.263 1441.4C1225.09 1441.4 1542.6 1118.73 1542.6 720.699C1542.6 322.669 1225.09 0.000766158 833.276 0.000766158C823.523 0.000766158 813.605 0.271159 803.845 0.67344V0.000766158L213.304 0C213.268 0 213.222 0 213.185 0Z"
              />
            </clipPath>
          </defs>
          {/* 앞 사진은 캔버스보다 크고 왼쪽으로 밀려 있다(-240,0 · 1680 x 1680).
              foreignObject 안에서 PmaxImage 를 그대로 쓰므로 잘라내기 규칙은 그 파일이
              정한 것을 따른다. */}
          <foreignObject
            x="-240"
            y="0"
            width="1680"
            height="1680"
            clipPath={`url(#${waveClipId})`}
          >
            <PmaxImage src={src} alt={alt} />
          </foreignObject>
        </svg>
      </div>

      {/* 19661:21565 PmaxLayout — 글자 레이어. 배경을 칠하지 않으므로 위 사진이 비친다. */}
      <div className="absolute inset-0">
        <PmaxLayout
          eyebrow={eyebrow}
          headline={headline}
          headingLevel={headingLevel}
          subcopy={subcopy}
          ctaLabel={ctaLabel}
          disclaimer={disclaimer}
        />
      </div>
    </div>
  )
}
