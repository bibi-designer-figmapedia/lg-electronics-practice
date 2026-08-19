import type { HTMLAttributes } from 'react'
import { MainContentTitle } from '../title/MainContentTitle'
import type { MainContentTitleHeadingLevel } from '../title/MainContentTitle'
import { BannerImage } from './BannerImage'

/*
 * HeroBanner — Figma "HeroBanner" 의 구현체. 배너 사진 한 장 위에 카피 열을 얹는다.
 * 그 둘을 겹치고 카피 열의 위치를 잡는 것이 이 컴포넌트가 하는 전부다.
 *
 * Figma 원본 (산출물 1)
 *   component "HeroBanner": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19832-1364
 *   부모 section "banner":  https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23347
 *
 *   레이어 (get_metadata 19832:1364 로 읽은 트리 그대로)
 *     19832:1365 BannerImage (인스턴스)   x 0        y 0       1920 x 720
 *     19832:1363 container                x 240.02   y 78.64   542 x 623
 *       19832:1349 MainContentTitle (인스턴스)  y 0     542 x 265
 *       19832:1320 Disclaimer (optional)        y 591   542 x 32
 *
 *   get_metadata · get_screenshot · get_design_context · get_variable_defs 를 이 노드에
 *   직접 호출해 읽었다. 추정한 값은 없다 — 추정이 남은 지점은 아래에서 "미확인" 이라고
 *   따로 적었다.
 *
 * 이 파일은 같은 이름의 다른 노드를 옮긴 이전 판을 대체한다 (숨기지 않고 적는다)
 *   이전 구현이 참조하던 것은 component **set** 19661:17371 이고 layout=left(19661:17370) ·
 *   layout=center(19661:17369) 두 variant 를 가졌다. 새 원본 19832:1364 는 variant 축이
 *   없는 단일 컴포넌트이고 크기도 1920 x 800 에서 1920 x 720 으로 바뀌었다. 그래서 이
 *   파일은 부분 수정이 아니라 새 원본으로 다시 썼다. 사라진 것을 열거해 둔다:
 *     - layout 축(left · center)  -> 단일 컴포넌트라 variant 축 자체가 없다
 *     - MainContentTitle 의 align 전달 -> 그쪽도 align 축이 없어졌다
 *     - 폭 860 을 정해 주던 상자   -> MainContentTitle 이 자기 폭 542 를 갖는다
 *   새로 생긴 것은 Disclaimer 한 줄과 그것을 켜고 끄는 showDisclaimer 다.
 *
 *   가이드 시안에 보이는 Indicator 는 이 노드의 자식이 아니다 — get_metadata 상
 *   19832:1364 의 자식은 BannerImage 와 container 둘뿐이다. 요청 범위에도 없어 만들지
 *   않았다. 필요해지면 Figma 에 실재하는 노드를 먼저 확인할 것.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19832:1364) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                   Figma 변수 / 실측       코드 토큰                  유틸리티
 *   루트 폭                layout/viewport 1920    --container-viewport       max-w-viewport
 *   루트 높이              실측 720                -                          (BannerImage 의 aspect-8/3)
 *   카피 열 좌측 인셋      실측 240.02             --spacing-viewport-inset   pl-viewport-inset
 *   카피 열 상단 인셋      실측 78.64              --spacing-banner-padding   pt-banner-padding
 *   카피 열 하단 인셋      실측 18.36              --spacing-20               pb-20
 *   카피 열 폭             실측 542                --container-banner-copy    w-banner-copy
 *   Disclaimer 타이포      body/small              type-body-small            type-body-small
 *   Disclaimer 색          text/primary            --color-text-primary       text-text-primary
 *
 *   신규 토큰 없음. --container-banner-copy 는 MainContentTitle 작업에서 등재된 것을
 *   그대로 쓴다. 나머지는 전부 기존 토큰이다.
 *
 *   get_variable_defs 가 함께 내주는 나머지 변수(nav/menu · title/medium · body/default ·
 *   body/default-strong · action/primary · text/inverse · spacing/4 · spacing/12 ·
 *   spacing/20 · radius/8 과 그 font-* 원자들)는 전부 중첩된 MainContentTitle 과 그 안의
 *   Button 에서 올라온 값이다. 그쪽이 이미 토큰으로 갖고 있어 이 파일은 하나도 다시
 *   지정하지 않는다.
 *
 * ⚠ 세로 인셋 2개는 스케일 스텝으로 스냅했다 (Figma 와 의도적으로 다른 유일한 값)
 *   Figma 실측은 위 78.64453125 · 아래 18.35546875 로 소수점이고, 어느 쪽도 Figma 변수에
 *   바인딩돼 있지 않다. get_design_context 가 container 를 absolute left/top 으로만 내주는
 *   것이 그 근거다 — 오토레이아웃 padding 이었다면 변수 참조로 나온다. 소수점 실측치를
 *   그대로 토큰으로 등재하면 스케일에 스텝 2개가 늘어나는데, by-eye 값이라 그럴 근거가
 *   아니다. 그래서 가장 가까운 기존 토큰을 쓴다(요청자 확정 사항):
 *     위  78.64 -> pt-banner-padding (layout/banner-padding 80, Figma 실재 변수). 오차 1.36
 *     아래 18.36 -> pb-20            (spacing/20, Figma 실재 변수).              오차 1.64
 *   좌측 240.02 는 스냅이 아니다 — layout/viewport-inset 이 정확히 240 이라 소수점 0.02 는
 *   Figma 의 부동소수 잡음이다.
 *   결과: Disclaimer 바닥이 Figma 701.6 대신 700 에 놓인다. 스크린샷 대조에서 이 1.6 의
 *   차이가 잡히는 것은 정상이며 코드 결함이 아니다.
 *
 * 두 하위 컴포넌트를 import 해서 조립한다 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   - 배경은 같은 폴더의 BannerImage(19643:31147 = 세트의 type=1)다. get_design_context 가
 *     이 인스턴스를 type="1" 로 내준다. 사진은 src / alt 로 그대로 통과시킨다.
 *   - 카피 묶음은 src/components/title/MainContentTitle.tsx 다. Figma 인스턴스
 *     19832:1349 가 바로 그 컴포넌트(19832:1348)이고, 폭 · 구조 · 텍스트가 전부 일치한다.
 *   즉 이 파일이 새로 만드는 것은 Disclaimer 한 줄과 "둘을 겹치고 인셋을 잡는다" 뿐이다.
 *   두 컴포넌트의 마크업을 여기서 다시 그리지 않는다 — 그렇게 하면 같은 것이 두 곳에
 *   정의돼 조용히 어긋난다.
 *
 * BannerImage 를 정상 흐름에 둔 이유
 *   Figma 는 이것을 absolute 로 깔지만 코드는 정상 흐름에 둔다. BannerImage 의 루트
 *   클래스가 relative 로 시작하므로 밖에서 absolute 를 덧붙이면 한 요소에 두 position
 *   유틸리티가 붙고, 빌드된 스타일시트 순서상 .relative 가 이겨 position 이 relative 로
 *   계산된다. 정상 흐름에 두면 그 모호함이 없고, BannerImage 의 aspect-8/3 이 이 배너
 *   한 칸의 높이를 정한다 — 폭 1920 에서 정확히 720 이다. 겹치는 것은 카피 오버레이 쪽이
 *   맡는다(absolute inset-0).
 *
 * 크기를 박지 않고 비율로 옮긴 이유
 *   루트는 Figma 에서 1920 x 720 이다. 폭은 max-w-viewport 로 상한만 잡고 w-full 로
 *   채운다. 이 저장소의 다른 1920 루트 프레임들이 같은 방식이다(FuntionalTab ·
 *   ComponentTitle 이 w-full max-w-viewport 를 쓴다). 높이는 이 파일이 정하지 않는다.
 *
 * Disclaimer 를 p 로 두고 하드 개행을 살린다
 *   Figma 원본(19832:1320)은 body/small 두 줄이다 — get_design_context 가 이 레이어를
 *   p 두 개로 내주고, 높이 32 도 줄높이 16 x 2줄이다. 제목이 아니므로 heading 이 아니라
 *   p 이고, whitespace-pre-line 으로 호출부의 개행을 살린다(MainContentTitle 의 headline 과
 *   같은 처리). Figma 출력은 whitespace-pre-wrap 인데 그쪽은 줄 끝 공백까지 보존한다 —
 *   원본 문자열의 줄 끝 공백은 Figma 편집 잔여물이라 재현 대상이 아니다.
 *   레이어 이름이 "Disclaimer (optional)" 이고 showDisclaimer 로 끌 수 있다.
 *
 * showEyebrow · showSubcopy 를 여기서도 노출한다
 *   MainContentTitle 의 boolean 2개를 그대로 통과시킨다(요청자 확정 사항). 기본값을 이
 *   파일에서 다시 정하지 않는다 — 넘기지 않으면 undefined 가 가고 MainContentTitle 의
 *   기본값(둘 다 true)이 적용된다. 같은 기본값을 두 파일에 적으면 조용히 어긋난다.
 *
 * 프레젠테이셔널 컴포넌트다. 내부 state 가 없고 Figma 에 없는 옵션 · variant 도 없다.
 */

export interface HeroBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 배경 사진. 중첩 BannerImage 의 내용이다. */
  src: string
  /**
   * 배경 사진의 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * BannerImage 의 규격을 그대로 통과시킨다.
   */
  alt: string
  /** 제목. MainContentTitle 에서도 끌 수 없는 유일한 텍스트다. */
  headline: string
  /** 제목 위의 작은 라벨. 렌더 여부는 showEyebrow 가 정한다. */
  eyebrow?: string
  /** 제목 아래 본문. 렌더 여부는 showSubcopy 가 정한다. */
  subcopy?: string
  /** MainContentTitle 의 showEyebrow 를 그대로 통과시킨다. 기본값도 그쪽 것을 따른다. */
  showEyebrow?: boolean
  /** MainContentTitle 의 showSubcopy 를 그대로 통과시킨다. 기본값도 그쪽 것을 따른다. */
  showSubcopy?: boolean
  /** 배너 하단 고지문. 렌더 여부는 showDisclaimer 가 정한다. */
  disclaimer?: string
  /** Figma 의 "Disclaimer (optional)" 레이어를 켜고 끈다. 기본 true. */
  showDisclaimer?: boolean
  /**
   * 제목을 렌더할 heading 레벨. 넘기지 않으면 MainContentTitle 의 기본값이 쓰인다.
   * 문서의 heading 순서가 건너뛰지 않도록 놓이는 위치에 맞춰 호출부가 지정한다.
   */
  headingLevel?: MainContentTitleHeadingLevel
}

/** Figma "HeroBanner"(19832:1364) 의 코드 정본. */
export function HeroBanner({
  src,
  alt,
  headline,
  eyebrow,
  subcopy,
  showEyebrow,
  showSubcopy,
  disclaimer,
  showDisclaimer = true,
  headingLevel,
  className = '',
  ...props
}: HeroBannerProps) {
  return (
    /* 19832:1364 — 사진과 카피 열을 겹치는 배너 한 칸. */
    <div className={`relative w-full max-w-viewport ${className}`} {...props}>
      {/* 19832:1365 BannerImage — 정상 흐름에 두어 이 배너의 높이를 정하게 한다.
          위치 클래스를 넘기지 않는 이유는 위 "BannerImage 를 정상 흐름에 둔 이유" 참고. */}
      <BannerImage src={src} alt={alt} />
      {/*
       * 19832:1363 container — 사진 위에 겹치는 카피 열이다. Figma 는 이 프레임을
       * absolute left/top 으로 놓고 자식 사이에 고정 간격을 주지만, 코드는 인셋 +
       * justify-between 으로 옮긴다. 그러면 자식 사이의 간격이 배너 높이에서 따라 나오는
       * 결과가 되고, Figma 가 그린 326 을 상수로 굳히지 않아도 된다.
       */}
      <div className="absolute inset-0 flex flex-col items-start justify-between pt-banner-padding pb-20 pl-viewport-inset">
        {/* 19832:1349 MainContentTitle — 폭 542 는 그 컴포넌트가 스스로 갖는다. */}
        <MainContentTitle
          headline={headline}
          headingLevel={headingLevel}
          eyebrow={eyebrow}
          subcopy={subcopy}
          showEyebrow={showEyebrow}
          showSubcopy={showSubcopy}
        />
        {showDisclaimer ? (
          /* 19832:1320 Disclaimer (optional) */
          <p className="type-body-small w-banner-copy whitespace-pre-line text-text-primary">
            {disclaimer}
          </p>
        ) : null}
      </div>
    </div>
  )
}
