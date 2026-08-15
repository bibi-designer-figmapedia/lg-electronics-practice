import type { HTMLAttributes } from 'react'
import { MainContentTitle } from '../title/MainContentTitle'
import type { MainContentTitleHeadingLevel } from '../title/MainContentTitle'
import { BannerImage } from './BannerImage'

/*
 * HeroBanner — Figma "HeroBanner" 의 구현체. 배너 사진 한 장 위에 제목 묶음을 얹는다.
 * 그 둘을 겹치는 것이 이 컴포넌트가 하는 전부다.
 *
 * Figma 원본 (산출물 1)
 *   component set "HeroBanner": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17371
 *   layout=left:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17370
 *   layout=center: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-17369
 *   부모 section "banner": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23347
 *
 *   두 variant 를 각각 get_metadata · get_screenshot · get_design_context ·
 *   get_variable_defs 로 읽었다. 추정한 값은 없다 — 추정이 남은 지점은 아래에서
 *   "미확인" 이라고 따로 적었다.
 *
 * variant 축 대응표 (Figma property 이름 -> 코드 prop)
 *   layout=left    ->  layout='left'
 *   layout=center  ->  layout='center'
 *   Figma 세트의 축은 layout 하나뿐이다. 다른 축은 만들지 않았다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:17370) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                   Figma 변수 / 실측    코드 토큰                 유틸리티
 *   배너 좌우 인셋         spacing/160          --spacing-banner-inset    inset-x-banner-inset
 *   배너 내부 패딩         spacing/80           --spacing-banner-padding  p-banner-padding
 *   배너 모서리            radius/banner-l      --radius-banner-l         rounded-banner-l
 *   제목 묶음 폭           변수 없음, 실측 860  --spacing-860             w-860
 *   루트 폭                변수 없음, 실측 1920 --container-viewport      max-w-viewport
 *   루트 높이              변수 없음, 실측 800  -                         (BannerImage 의 aspect-12/5)
 *
 *   신규 토큰 2개(--radius-banner-l · --spacing-860)를 등재했다. 등재 사유는 각각
 *   src/tokens/radius.tokens.css · src/tokens/spacing.tokens.css 의 주석에 적었다.
 *   나머지는 전부 기존 토큰이다.
 *
 *   같은 값을 가진 토큰이 둘 있는 자리에서 어느 쪽을 골랐는지, 근거와 함께 적는다.
 *   - spacing/80 -> --spacing-banner-padding. 값이 같은 --spacing-80 이 있지만 그 토큰의
 *     주석이 그것을 Button/Web 세트의 min-width 제약으로 못 박고 "layout/banner-padding 과
 *     값이 같은 것은 별개의 결정" 이라고 명시한다. 배너 패딩을 버튼 제약에 매달 이유가 없다.
 *   - spacing/160 -> --spacing-banner-inset. Figma 가 실제로 바인딩한 변수는 spacing/160
 *     이고 저장소에는 --spacing-160 이 없다. 같은 160 을 Figma 가 layout/banner-inset 이라는
 *     이름으로도 발행하고 있고(layout.tokens.css 의 "배너 좌우 여백"), 이 자리가 바로 그
 *     역할이다. 숫자 스텝을 새로 등재해 같은 값을 두 번 정의하는 것보다 이미 있는 역할
 *     토큰을 쓰는 것이 맞다고 판단했다 — 원칙 2 의 "중복 정의는 곧 불일치" 다.
 *     대가는 숨기지 않는다: 디자이너가 spacing/160 만 옮기고 layout/banner-inset 을 그대로
 *     두면 코드가 따라가지 않는다. 그때는 이 줄을 고친다.
 *
 *   get_variable_defs 가 함께 내주는 banner/label · text/primary · text/secondary ·
 *   text/inverse · action/primary · action/secondary · border/strong · radius/8 ·
 *   spacing/4 · spacing/8 · spacing/12 · spacing/16 · spacing/24 와 nav/menu ·
 *   title/xlarge · subtitle/medium · body/default-strong 텍스트 스타일은 전부 중첩된
 *   MainContentTitle(과 그 안의 Button)에서 올라온 값이다. 그쪽이 이미 토큰으로 갖고 있어
 *   이 파일은 하나도 다시 지정하지 않는다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   - 배경은 같은 폴더의 BannerImage(19661:16812) 인스턴스다(left 19690:1044 ·
 *     center 19690:1049). 이 작업에서 먼저 구현한 것을 그대로 쓴다. 두 variant 모두
 *     BannerImage 의 type=1 을 깔고 있다 — get_design_context 가 두 쪽 다 type="1" 로
 *     내준다.
 *   - 제목 묶음은 Figma 에서 MainContentTitle 인스턴스(left 19661:17311 ·
 *     center 19661:17329)이고, src/components/title/MainContentTitle.tsx 가 바로 그
 *     컴포넌트의 구현체다. Align 축 · 텍스트 3줄 · CTA 2개가 전부 일치한다. 그대로
 *     재사용했고 새 제목 마크업을 만들지 않았다.
 *   즉 이 파일이 새로 만드는 것은 "둘을 겹치고 안쪽 프레임을 정렬한다" 하나뿐이다.
 *
 * 두 variant 의 차이는 안쪽 프레임의 정렬 2곳뿐이다 — get_design_context 출력을 줄 단위로
 * 대조하고, get_metadata 의 좌표로 검산했다.
 *   1. 가로: items-start -> items-center.
 *      left  는 MainContentTitle 이 x=80  = 좌측 패딩 그대로.
 *      center 는 x=370 = 80 + (1440 - 860) / 2. 안쪽 폭 1440 은 프레임 1600 에서 좌우
 *      패딩 80 을 뺀 값이고, 860 은 제목 묶음 폭이다. 정확히 가운데다.
 *   2. 세로: justify-center -> (없음, 기본 위쪽).
 *      left  는 y=292 = (800 - 216) / 2 로 정확히 가운데다(216 은 그 인스턴스의 높이).
 *      center 는 y=80 = 상단 패딩 그대로다. 즉 justify 가 걸려 있지 않다.
 *      Figma 가 두 variant 에 세로 정렬을 다르게 준 것이고, 스크린샷에서도 center 쪽
 *      Eyebrow 가 배너 위쪽에 붙어 있다. 그대로 옮겼다. 이것이 의도인지 작업 중 남은
 *      상태인지는 이 파일이 판단할 문제가 아니다 — 원본이 그렇게 그려져 있다는 사실만
 *      옮기고, 바꿔야 한다면 Figma 를 먼저 고친다.
 *   layout 축은 MainContentTitle 의 align 축에도 그대로 전달된다(left -> 'left',
 *   center -> 'center'). Figma 인스턴스의 Align 값이 각 variant 와 같기 때문이다.
 *   색 · 타이포 · 간격 변수는 두 variant 가 완전히 동일하다.
 *
 * 제목 묶음 폭 860 을 감싸는 div 를 둔 이유
 *   MainContentTitle 은 자기 루트에 w-full 을 갖는다("폭은 호출부가 정한다" — 그 파일의
 *   "폭을 860 으로 박지 않은 이유" 참고). 그래서 폭은 바깥에서 정해야 하는데, className
 *   으로 w-860 을 넘기면 같은 요소에 w-full 과 w-860 이 함께 붙어 어느 쪽이 이기는지가
 *   클래스 문자열 순서가 아니라 생성된 스타일시트 순서에 달리게 된다. 폭을 정하는 div 를
 *   하나 두면 그 모호함이 사라지고, MainContentTitle 은 그 안에서 w-full 로 채우면 된다.
 *   Figma 에 없는 레이어가 하나 늘지만, 시각 결과에 기여하는 것은 폭 하나뿐이다.
 *
 * 크기를 박지 않고 비율로 옮긴 이유
 *   루트는 Figma 에서 1920 x 800 이다. 폭은 max-w-viewport 로 상한만 잡고 w-full 로
 *   채운다. 이 저장소의 다른 1920 루트 프레임들이 같은 방식이다(FuntionalTab ·
 *   ComponentTitle 이 w-full max-w-viewport 를 쓴다). 높이는 이 파일이 정하지 않는다 —
 *   정상 흐름에 놓인 BannerImage 의 aspect-12/5 가 정한다(아래 항목 참고).
 *   안쪽 프레임은 Figma 가 x=160 · 폭 1600 으로 그렸지만 좌우 인셋 160 을 잡고 폭은
 *   남는 만큼 채우게 했다 — 1920 에서는 폭이 정확히 1600 이 되고, 더 좁은 폭에서도
 *   배너가 같은 인셋을 유지한다. HeaderGNB 가 secondary 의 Link 폭을 박는 대신 인셋을
 *   잡은 것과 같은 판단이다.
 *
 * BannerImage 를 정상 흐름에 둔 이유 (번복 이력 1차)
 *   ↳ 최초 구현은 루트에 aspect-12/5 를 걸고 BannerImage 에 className="absolute inset-0"
 *     을 넘겨 배경처럼 깔았다. 그리고 주석에 "폭과 높이가 모두 확정되므로 BannerImage
 *     자신의 aspect-12/5 는 아무 일도 하지 않는다" 고 적었다. 그 두 문장이 **모두 사실과
 *     반대**였다는 것을 design-reviewer 가 실측으로 잡아냈다.
 *     BannerImage 의 기본 클래스는 relative 로 시작한다. 넘긴 absolute 와 합쳐지면 한
 *     요소에 `relative … absolute` 가 함께 붙는데, 두 규칙은 같은 @layer utilities · 같은
 *     명시도이고 빌드된 스타일시트 순서가 .absolute -> .relative 라 **뒤에 오는 .relative
 *     가 이긴다.** 즉 그 요소는 의도와 반대로 position: relative 로 계산됐고, 화면이
 *     멀쩡했던 것은 정상 흐름 상자가 마침 부모와 같은 크기를 차지한 우연이었다.
 *     아래 "제목 묶음 폭 860 을 감싸는 div 를 둔 이유" 가 w-full 대 w-860 에서 지적하는
 *     것과 정확히 같은 함정이다. 거기서는 래퍼를 뒀으면서 여기서는 밟았다.
 *   처리: 우연에 기대지 않고 구조로 맞춘다. BannerImage 를 정상 흐름에 그대로 두어 이
 *   배너의 높이를 정하게 하고(그 컴포넌트의 aspect-12/5 가 실제로 일하는 자리다), 루트는
 *   그 위에 제목 프레임을 얹기 위한 relative 컨테이너 역할만 한다. 위치 클래스를 밖에서
 *   덧붙이지 않으므로 position 이 겹칠 일 자체가 없다.
 *
 * rounded-banner-l 이 눈에 보이지 않는 이유 (그래도 옮긴 이유)
 *   안쪽 프레임은 배경이 없는 투명 프레임이라, 모서리를 둥글게 깎아도 화면에 곡선이
 *   나타나지 않는다. 실제로 하는 일은 overflow-clip 과 함께 자식을 잘라내는 것뿐이고,
 *   지금 자식(제목 묶음)은 모서리 근처까지 오지 않는다. 그래도 옮긴 것은 Figma 가
 *   radius/banner-l 변수를 이 프레임에 바인딩해 두었기 때문이다 — 배경이 생기는 날
 *   곡선이 필요해지고, 그때 이 줄이 없으면 원본과 어긋난다.
 *
 * 텍스트와 사진을 prop 으로 열었다
 *   Figma 에서 HeroBanner 자체의 속성은 layout 하나뿐이고, Eyebrow · Title ·
 *   Description 은 중첩 MainContentTitle 인스턴스의 텍스트 override 로만 존재한다
 *   (left 는 "Title", center 는 "Lorem ipsum dolor sit." 로 서로 다르다). 사진도 중첩
 *   BannerImage 의 내용이다. 이것들을 prop 으로 연 것은 사용자가 확정한 방향이고,
 *   같은 폴더 밖의 PDPItem 이 중첩 BodyText 의 override 문자열을 prop 으로 연 것과 같은
 *   판단이다 — 배너는 페이지마다 다른 문구와 사진으로 놓이는 자리라, 문구를 박으면
 *   컴포넌트가 아니라 스크린샷이 된다.
 *   반대로 CTA 라벨("Learn More" · "Buy Now")은 열지 않았다. 그것은 MainContentTitle 이
 *   자기 안에서 고정한 것이고(그 파일의 "CTA 라벨을 prop 으로 열지 않은 이유" 참고),
 *   이 파일이 뚫을 자리가 아니다.
 *
 * alt 를 필수로 유지한 이유
 *   BannerImage 의 alt 는 필수다. HeroBanner 가 그것을 기본값 있는 선택 prop 으로 덮으면
 *   "빠뜨려서 빈 것"이 다시 가능해진다. 배경 사진이 장식일 때는 호출부가 빈 문자열을
 *   명시적으로 넘긴다 — story 가 그 경우를 하나 보여준다.
 *
 * headingLevel 에 기본값을 다시 정하지 않은 이유
 *   MainContentTitle 이 기본 2 를 갖고 있고 그 근거가 그 파일에 적혀 있다. 여기서 1 로
 *   바꾸면 "히어로 배너는 보통 페이지의 h1" 이라는 추정을 코드에 박는 것이 된다 — Figma
 *   에는 heading 레벨 정보가 없다(미확인). 그래서 값을 그대로 통과시키고, 페이지에 놓는
 *   쪽이 문서의 heading 순서에 맞춰 정하게 둔다.
 *
 * 프레젠테이셔널 컴포넌트다. 내부 state 가 없고 Figma 에 없는 옵션 · variant 도 없다.
 */

export type HeroBannerLayout = 'left' | 'center'

export interface HeroBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma 의 layout 축. 안쪽 프레임의 정렬과 제목 묶음의 align 이 함께 바뀐다. */
  layout?: HeroBannerLayout
  /** 배경 사진. 중첩 BannerImage 의 내용이다. */
  src: string
  /**
   * 배경 사진의 대체 텍스트. 필수다 — 장식용이라면 빈 문자열을 명시적으로 넘긴다.
   * BannerImage 의 규격을 그대로 통과시킨다.
   */
  alt: string
  /** 제목. MainContentTitle 에서도 유일한 필수 텍스트다. */
  title: string
  /** 제목 위의 작은 라벨. 넘기지 않으면 렌더되지 않는다. */
  eyebrow?: string
  /** 제목 아래 본문. 넘기지 않으면 렌더되지 않는다. */
  description?: string
  /**
   * 제목을 렌더할 heading 레벨. 넘기지 않으면 MainContentTitle 의 기본값이 쓰인다.
   * 문서의 heading 순서가 건너뛰지 않도록 놓이는 위치에 맞춰 호출부가 지정한다.
   */
  headingLevel?: MainContentTitleHeadingLevel
}

/* 안쪽 프레임의 정렬. 두 variant 의 차이가 전부 여기에 있다 — 위 "두 variant 의 차이" 참고.
   center 에 justify 가 없는 것은 빠뜨린 것이 아니라 Figma 가 그렇게 그린 것이다. */
const frameLayoutClasses: Record<HeroBannerLayout, string> = {
  left: 'items-start justify-center',
  center: 'items-center',
}

/** Figma "HeroBanner"(19661:17371) 의 코드 정본. */
export function HeroBanner({
  layout = 'left',
  src,
  alt,
  title,
  eyebrow,
  description,
  headingLevel,
  className = '',
  ...props
}: HeroBannerProps) {
  return (
    /* 19661:17370 / 19661:17369 — 사진과 제목 묶음을 겹치는 배너 한 칸. */
    <div className={`relative w-full max-w-viewport ${className}`} {...props}>
      {/* 19690:1044 / 19690:1049 BannerImage — 정상 흐름에 두어 이 배너의 높이를
          정하게 한다. 위치 클래스를 넘기지 않는 이유는 위 "BannerImage 를 정상 흐름에
          둔 이유" 참고. */}
      <BannerImage src={src} alt={alt} />
      {/* 19661:17274 / 19661:17328 ST0001.Hero Banner — 배경 없는 프레임이다. */}
      <div
        className={`absolute inset-x-banner-inset inset-y-0 flex flex-col overflow-clip rounded-banner-l p-banner-padding ${frameLayoutClasses[layout]}`}
      >
        {/* 19661:17311 / 19661:17329 MainContentTitle — 폭만 정하는 상자다(위 주석 참고). */}
        <div className="w-860">
          <MainContentTitle
            align={layout}
            title={title}
            headingLevel={headingLevel}
            eyebrow={eyebrow}
            description={description}
          />
        </div>
      </div>
    </div>
  )
}
