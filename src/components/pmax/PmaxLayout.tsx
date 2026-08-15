import type { HTMLAttributes } from 'react'
import { ButtonPromotion } from '../ButtonPromotion'
import { LogoLG } from '../LogoLG'
import { BenefitRow } from './BenefitRow'

/*
 * PmaxLayout — Figma "PmaxLayout" 의 구현체. Pmax 배너의 정사각 캔버스 위에 얹히는
 * 글자 레이어다: 왼쪽 위 로고 · 가운데 카피 3줄 + CTA · 아래 혜택 줄 · 맨 아래 고지문.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32052
 *   부모 section "Pmax banner template": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32050
 *
 *   19649:32053  Logo/LG 인스턴스
 *   19649:32057  Copy + CTA btn 프레임
 *     19649:32058  Copy 프레임
 *       19649:32059 Eyebrow · 19649:32060 Headline · 19649:32061 Subcopy
 *     19649:32062  Button/Promotion 인스턴스
 *   19661:21449  BenefitRow 인스턴스
 *   19649:32054  Disclaimer 프레임 → 19649:32055 text
 *
 *   get_metadata · get_screenshot · get_design_context · get_variable_defs 를 이 노드에
 *   대해 모두 호출했고, 중첩 인스턴스의 원본(BenefitRow 의 tone=black variant 1:385)은
 *   따로 한 번 더 get_design_context 로 읽어 대조했다. 추정한 값은 없다 — 변수 바인딩이
 *   없는 값은 아래 표에서 "변수 없음, 실측" 으로 따로 표시했다 (원칙 1).
 *
 * 토큰 매핑 (산출물 2)
 *   Figma 변수는 get_variable_defs(19649:32052) 로 읽었다. 값 자체는 여기 적지 않는다
 *   (레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것. "변수 없음, 실측" 은 그 속성에
 *   Figma 변수 바인딩이 아예 없다는 뜻이고, 옆 칸의 수는 이 노드에서 잰 값이다.
 *
 *   용도                     Figma 변수 / 실측        코드 토큰                 유틸리티
 *   로고 인셋(상·좌)         변수 없음, 실측 33        --spacing-33              pt-33 pl-33   ← 신규 요청
 *   로고 높이                변수 없음, 실측 50        --spacing-50              h-50!         ← 신규 요청
 *   로고 ↔ 카피 간격         변수 없음, 실측 4         --spacing-4               gap-4
 *   카피 블록 좌우 padding   변수 없음, 실측 200       --spacing-200             px-200        ← 신규 요청
 *   카피 ↔ CTA 간격          변수 없음, 실측 36        --spacing-36              gap-36
 *   카피 3줄 사이 간격       변수 없음, 실측 12        --spacing-12              gap-12
 *   Eyebrow 타이포           subtitle/large           type-subtitle-large       type-subtitle-large
 *   Eyebrow 최대 높이        변수 없음, 실측 40        --spacing-40              max-h-40
 *   Headline 타이포          title/large              type-title-large          type-title-large
 *   Headline 최대 높이       변수 없음, 실측 144       --spacing-144             max-h-144     ← 신규 요청
 *   Subcopy 타이포           subtitle/large           type-subtitle-large       type-subtitle-large
 *   Subcopy 최대 높이        변수 없음, 실측 88        --spacing-88              max-h-88      ← 신규 요청
 *   카피 3줄 색              text/primary             --color-text-primary      text-text-primary
 *   혜택 줄 ↔ 고지문 간격    변수 없음, 실측 48        --spacing-48              gap-48
 *   고지문 좌우 padding      변수 없음, 실측 30        --spacing-30              px-30         ← 신규 요청
 *   고지문 아래 padding      변수 없음, 실측 42        --spacing-42              pb-42         ← 신규 요청
 *   고지문 최대 높이         변수 없음, 실측 46        --spacing-46              max-h-46      ← 신규 요청
 *   고지문 타이포            nav/menu                 type-nav-menu             type-nav-menu
 *   고지문 색                text/disclaimer          --color-text-disclaimer   text-text-disclaimer
 *   고지문 글자 글로우       shadow/disclaimer        --text-shadow-disclaimer-glow  text-shadow-disclaimer-glow
 *
 *   중첩 인스턴스가 소비하는 변수는 이 파일이 다시 지정하지 않는다. get_variable_defs 가
 *   함께 내주는 brand/logo · brand/logo-inverse · brand/secondary 는 LogoLG(type=color)가,
 *   icon/default · icon/white 와 primitive black 은 BenefitRow 가, primitive white 와
 *   active-red 는 Button/Promotion 인스턴스가 각각 쓴다. font-family/sans · font-size/16 ·
 *   font-size/20 · font-size/36 · font-size/60 · font-weight/regular · font-weight/semibold 는
 *   위 텍스트 스타일이 참조하는 원자라 개별로 쓸 자리가 없고, body/default-strong 은
 *   BenefitRow 인스턴스가 라벨에 덮어쓴 스타일이다(아래 "원본에서 확인된 어긋남" 2번).
 *
 *   신규 토큰 9건은 src/tokens/ 가 token-guardian 의 배타 범위라 여기서 만들지 않았고,
 *   token-guardian 이 등재를 마쳤다. 등재 전까지 이 컴포넌트가 정상 렌더되지 않았던
 *   이유를 남겨 둔다 — 같은 함정이 다음 컴포넌트에서 반복되기 때문이다.
 *
 *   spacing 8개: Tailwind 내장 스케일이 같은 이름을 4배 큰 값으로 계산해 버린다
 *   (예: px-200 이 200 x 0.25rem 로 해석된다). spacing.tokens.css 가 38 · 76 · 78 · 92 ·
 *   96 · 140 · 180 스텝마다 적어 둔 것과 같은 "조용한 실패" 이고, hook 도 verify:tokens 도
 *   대괄호 임의값이 아닌 이 오류는 잡지 못한다.
 *
 *   그림자 1개: 처음 요청한 이름 --text-shadow-disclaimer 는 쓸 수 없다. Tailwind 는
 *   text-<이름> 을 --color-* 에 대해서도 해석하는데 이 저장소에 이미
 *   --color-shadow-disclaimer 가 있어서, 그 이름의 클래스는 글로우가 아니라
 *   흰 글자색 선언을 만든다. token-guardian 이 실제 빌드 CSS 로 확인해
 *   --text-shadow-disclaimer-glow 로 바꿔 등재했다. 이것도 세 검증이 모두
 *   통과시키는 종류다 — 생성된 CSS 자체는 유효하기 때문이다.
 *
 *     --spacing-33   로고 인스턴스의 좌·상 인셋. 두 축이 같은 값이라 스텝 하나로 덮는다.
 *     --spacing-50   같은 인스턴스의 높이. LogoLG 원본은 64 이고 여기서 50 으로 줄여 쓴다.
 *     --spacing-200  Copy + CTA 프레임의 좌우 padding. 프레임이 캔버스 폭을 채우고
 *                    안쪽 Copy 가 800 이 되는 것은 이 padding 의 결과다 — 즉 200 이
 *                    원인이고 800 은 결과라, 이름을 붙일 쪽은 padding 이다.
 *     --spacing-144  Headline 의 최대 높이. Figma 가 이 텍스트에 max-height 를 걸어
 *                    3줄째를 잘라낸다(카피가 짧으면 그냥 hug 로 줄어든다).
 *     --spacing-88   Subcopy 의 최대 높이. Figma 원문 카피에서는 2줄 84 라 발현되지
 *                    않지만 3줄부터 걸리는 살아 있는 제약이다.
 *     --spacing-46   고지문 텍스트의 최대 높이. 한 줄 24 는 통과하고 두 줄 48 은 잘린다.
 *     --spacing-42   Disclaimer 프레임의 아래 padding.
 *     --spacing-30   Disclaimer 프레임의 좌우 padding.
 *     --text-shadow-disclaimer-glow  고지문 뒤에 깔리는 흰 글로우. Figma 가 텍스트에
 *                    그림자 2겹(블러 30 · 블러 10)을 같은 흰색으로 겹쳐 둔 것이고, 색만
 *                    shadow/disclaimer 변수에 묶여 있어 이미 --color-shadow-disclaimer 로
 *                    등재돼 있다. 없는 것은 블러 값을 담을 그림자 토큰뿐이라, 색은 기존
 *                    토큰을 참조하고 새 토큰은 그림자 정의 하나만 요청했다. -glow 접미가
 *                    붙은 이유는 위 "그림자 1개" 항목에 있다. 참고로 Figma 는 2겹 중
 *                    두 번째에만 변수를 묶고 첫 겹은 리터럴 흰색으로 두는데, 코드는 두 겹
 *                    모두 같은 토큰을 참조한다 — 재도색 때 절반만 움직이는 것을 막는다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   이 파일이 새로 만든 마크업은 묶음 div 5개와 텍스트 4개뿐이다. 로고 SVG · 버튼 ·
 *   혜택 아이콘은 하나도 복제하지 않았다.
 *     19649:32053 Logo/LG          → LogoLG (variant='color')
 *     19649:32062 Button/Promotion → ButtonPromotion (color='red')
 *     19661:21449 BenefitRow       → BenefitRow (tone='black')
 *
 *   세 값은 전부 get_design_context(19649:32052) 로 확인한 것이지 짐작이 아니다.
 *     variant='color' — 로고 자리에 brand/logo · brand/logo-inverse · brand/secondary 세
 *       변수가 함께 잡힌다. 이 조합은 LogoLG 의 Type=color(1:23) 만 쓴다. white(1:32)는
 *       icon/white 하나, Black(1:41)은 icon/default 하나뿐이다. 스크린샷도 같은 판정이다.
 *     color='red' — 인스턴스 배경이 붉은 계열이고 라벨이 흰색이다. Button/Promotion 의
 *       3색 중 이 조합은 Red 뿐이다(Black 은 검정 배경, White 는 흰 배경 + 검정 라벨).
 *       다만 정확한 붉은색은 세트의 것과 다르다 — 아래 "원본에서 확인된 어긋남" 1번.
 *     tone='black' — 아이콘 타일이 검정이고 글리프가 흰색이다. BenefitRow 의 두 tone 중
 *       이 조합은 black(1:385) 뿐이다. 라벨 타이포는 다르다 — 같은 항목 2번.
 *
 *   텍스트 3종(Eyebrow · Headline · Subcopy)에 대한 조사 결과: src/components/title/ 의
 *   세 컴포넌트 중 쓸 수 있는 것이 없어 이 파일 안에서 처리했다. 근거는 타이포가 다르다는
 *   것이고, 세 컴포넌트의 매핑표와 이 노드의 스타일을 항목별로 대조해 확인했다.
 *     BodyText          eyebrow=body/default · 제목=subtitle/large · 본문=body/default.
 *                       이 노드는 subtitle/large · title/large · subtitle/large 다.
 *     MainContentTitle  eyebrow=nav/menu + banner/label 색 · 제목=title/xlarge ·
 *                       설명=subtitle/medium 이고, 게다가 CTA 버튼 2개를 항상 달고 나온다.
 *     ComponentTitle    제목=title/medium 또는 subtitle/large · 설명=subtitle/medium 이고
 *                       가로 2단 배치다. 세로로 쌓는 이 블록과 구조가 다르다.
 *   즉 세 후보 모두 크기가 한두 단계씩 어긋나서, 재사용하려면 타이포를 바깥에서 덮어써야
 *   한다 — 그것은 재사용이 아니라 그 컴포넌트의 정의를 무시하는 것이다. 대신 이 파일이
 *   쓰는 타이포는 전부 기존 토큰(type-subtitle-large · type-title-large)이라 새로 만든
 *   시각 정의는 없다.
 *
 * 확정된 구현 판단 6가지
 *   - 캔버스: 1200 x 1200 을 박지 않고 w-full + aspect-square 로 옮겼다. 같은 폴더의
 *     PmaxImage 가 같은 캔버스에 세운 규칙과 동일하게 맞춘 것이고, 그 파일의 근거
 *     ("정확히 1:1 이라 비율로 옮겨도 값이 떨어지고, 폭에 대응하는 Figma 변수가 없으므로
 *     폭은 호출부가 정한다")가 여기에도 그대로 적용된다. 두 컴포넌트가 겹쳐 놓이는 사이라
 *     폭 규칙이 어긋나면 겹치지 않는다.
 *   - 루트는 Figma 에서 오토레이아웃이 아니다. get_design_context 가 내는 루트는
 *     `relative size-...` 에 자식 4개가 전부 absolute 로 얹힌 형태다. 그래서 "간격을
 *     읽어 flex 로 옮긴다"를 그대로 적용할 오토레이아웃이 루트에는 없다. 절대좌표를
 *     그대로 옮기는 대신(그러면 87 · 1004 같은 위치까지 토큰이 필요해진다) 세로 flex +
 *     justify-between 으로 재구성했다: 위 묶음(로고 + 카피/CTA)과 아래 묶음(혜택 줄 +
 *     고지문)을 각각 흐름으로 쌓고, 그 사이 남는 공간을 justify-between 이 흡수한다.
 *     캔버스 높이가 1200 일 때 네 블록의 위치는 Figma 와 정확히 같다 —
 *     33 + 50 + 4 + 406 = 493 으로 카피 블록이 끝나고, 아래 묶음은 82 + 48 + 66 = 196 을
 *     차지해 혜택 줄이 1004 에서 시작하고 고지문이 1134 에서 시작한다. 안쪽 프레임 4개는
 *     Figma 에서도 오토레이아웃이라 간격을 그대로 gap 으로 옮겼다.
 *   - 텍스트 5종은 prop 이다. Figma 의 lorem ipsum 과 "Shop now" · 고지문은 이 컴포넌트의
 *     시각 정의가 아니라 인스턴스마다 바뀌는 **내용**이다. 컴포넌트에 박으면 다른 캠페인에
 *     쓸 수 없다 — PmaxImage 가 사진을 src prop 으로 연 것과 같은 판단이고, Figma 원문은
 *     story 가 그대로 쓴다.
 *   - 로고 variant · CTA color · BenefitRow tone 은 prop 이 아니라 고정값이다. Figma
 *     PmaxLayout(19649:32052)에는 variant 축이 하나도 없다 — get_design_context 가 내는
 *     컴포넌트 시그니처에 className 말고 속성이 없다. 축이 없는 곳에 prop 을 열면 원본에
 *     없는 API 를 발명하는 것이라, ComponentTitle · MainContentTitle 이 중첩 버튼 라벨에
 *     적용한 규칙을 그대로 따랐다. 위 "재사용" 의 세 값은 그래서 기본값이 아니라 확정값이다.
 *   - Headline 은 headingLevel 이 정하는 heading 요소다. Figma 에 레벨 정보는 없지만,
 *     레벨이 없다는 것이 heading 이 아니라는 뜻은 아니다 — 시각적으로 명확한 제목을
 *     <p> 로 두면 스크린리더의 heading 탐색이 불가능해 WCAG 2.1 SC 1.3.1 (Level A)
 *     위반이라는 판정이 이 저장소에서 이미 세 번 내려졌고(BodyText · ComponentTitle ·
 *     MainContentTitle), prop 이름 · 타입 · 기본값 2 규격도 그때 확정됐다. 같은 규격을
 *     그대로 쓴다. Eyebrow · Subcopy · 고지문은 제목이 아니므로 <p> 다. 태그가 바뀌어도
 *     렌더 결과는 같다 — Tailwind preflight 가 h1~h6 의 크기 · 굵기 · 바깥 여백을
 *     지우고 그 위에 type-title-large 가 네 항목을 모두 명시한다.
 *   - 배경을 칠하지 않았다. get_design_context 의 루트에 배경 클래스가 없다 — 스크린샷의
 *     크림색은 이 노드의 fill 이 아니라 뒤에 깔린 캔버스다. 고지문에 흰 글로우가 걸려
 *     있다는 것도 이 레이어가 사진 위에 얹히는 오버레이라는 같은 사실을 가리킨다.
 *     그래서 배경은 호출부(=아래에 놓이는 PmaxImage)가 정한다.
 *
 * 원본에서 확인된 어긋남 2가지 — 임의로 보정하지 않았고 숨기지도 않는다 (원칙 1)
 *   1. Button/Promotion 인스턴스(19649:32062)가 세트의 red 와 다르다. 두 군데다.
 *      (a) 배경이 세트의 action/promo 가 아니라 primitive active-red 로 덮여 있다
 *          (get_design_context 가 이 자리만 semantic 변수가 아닌 primitive 를 낸다).
 *          코드로는 --color-action-primary 가 정확히 그 primitive 를 가리키지만,
 *          그것은 "기본 버튼 색" 이라는 다른 역할의 토큰이다. 프로모션 버튼에 그 토큰을
 *          강제로 씌우면 역할을 속이는 매핑이 되므로 ButtonPromotion 을 그대로 쓴다.
 *      (b) 라벨 타이포가 세트의 cta/large(30 크기 · 줄높이 30)가 아니라 subtitle/large
 *          (36 크기 · 줄높이 42)로 덮여 있다.
 *      따라서 렌더가 Figma 스크린샷과 붉은색 계열 하나와 라벨 크기에서 다르게 보인다.
 *      ButtonPromotion 은 이 작업의 편집 범위 밖이고(읽기만 한다), 무엇보다 합성물이
 *      버튼의 색과 라벨 타이포를 소유하는 것은 ComponentTitle 이 같은 상황에서 세운
 *      규칙("버튼의 외형은 Button 세트가 정본이다")에 어긋난다. 디자이너에게 가져갈
 *      신호다 — 인스턴스를 세트의 red 로 되돌리거나, 세트에 새 color 축을 추가하거나.
 *   2. BenefitRow 인스턴스(19661:21449)가 세트의 tone=black 과 라벨 타이포가 다르다.
 *      세트(1:385)의 라벨은 크기 19 · 줄높이 114퍼센트 · 자간 0.38 · 색 text/primary 인데
 *      (이 작업에서 get_design_context(1:385) 로 직접 다시 읽어 확인했다 — BenefitRow.tsx
 *      의 기록과 일치한다), 이 인스턴스의 라벨은 body/default-strong(크기 16 · 줄높이 20)
 *      에 색이 primitive black 이다. 인스턴스 폭이 세트의 604 가 아니라 553 인 것도 같은
 *      이유의 결과다. BenefitRow 는 편집 범위 밖이고 라벨 타이포를 바깥에서 덮어쓸 수 있는
 *      prop 도 없으므로 tone='black' 을 그대로 쓴다. 혜택 줄 라벨이 Figma 보다 조금 크게
 *      렌더되는 것은 그래서다. 이것도 디자이너에게 가져갈 신호다.
 *
 * 그대로 옮기지 못한 것 3가지 (숨기지 않고 적는다)
 *   - 카피 3줄의 말줄임. Figma 뷰어는 max-height 로 잘린 자리에 말줄임표를 그리지만,
 *     CSS 의 text-overflow 는 여러 줄 텍스트에 말줄임표를 만들지 못한다. 그래서 상자
 *     높이는 Figma 와 같지만, 상자를 넘치는 카피는 마지막 줄이 글자 중간에서 잘린다.
 *     line-clamp 로 바꾸면 말줄임표는 생기지만 상자 높이가 줄 수에 끌려가 Figma 가 지정한
 *     높이(그리고 그 아래 CTA 위치)가 달라진다 — Figma 가 지정한 것은 줄 수가 아니라
 *     높이이므로 높이 쪽을 지켰다. 상자에 들어가는 길이의 카피에서는 두 방식이 같다.
 *   - Disclaimer 프레임의 고정 폭. Figma 는 이 프레임을 캔버스와 같은 폭으로 박아 두었지만
 *     루트를 채우면 같은 결과라 폭을 박지 않았다. 안쪽 텍스트의 flex-[1 0 0] 도 같은
 *     이유로 flex-1 로 옮겼다(줄어들 여지가 없는 자리라 두 값의 렌더가 같다).
 *   - export 코드의 max-w-none · pointer-events-none · leading-0 같은 Figma 뷰어 산물.
 *     PmaxImage · PDPItemImage 가 같은 이유로 옮기지 않은 것들과 같다.
 */

/* 제목이 렌더될 heading 레벨. src/components/title/ 의 세 컴포넌트가 쓰는 규격(같은 타입 ·
   같은 기본값 2)을 그대로 따른다 — 규격이 어긋나면 호출부가 컴포넌트마다 다른 규칙을
   외워야 한다. 공용 파일로 빼지 않은 이유는 이 작업의 편집 범위가 PmaxLayout 2개 파일로
   한정돼 있어서다(보고에 남겼다). */
export type PmaxLayoutHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface PmaxLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** 19649:32059 Eyebrow — 헤드라인 위 한 줄. 상자를 넘치면 잘린다. */
  eyebrow: string
  /** 19649:32060 Headline — headingLevel 이 정한 heading 요소가 된다. */
  headline: string
  /**
   * Headline 을 렌더할 heading 레벨. 기본 2 — 근거는 파일 상단 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다. 문서의 heading 순서가 건너뛰지
   * 않도록 놓이는 위치에 맞춰 호출부가 지정한다.
   */
  headingLevel?: PmaxLayoutHeadingLevel
  /** 19649:32061 Subcopy — 헤드라인 아래 본문. */
  subcopy: string
  /** 19649:32062 Button/Promotion 의 라벨. */
  ctaLabel: string
  /** 19649:32055 고지문. 맨 아래 왼쪽에 놓인다. */
  disclaimer: string
  /** 바깥 캔버스에 붙는 클래스. 폭과 배경은 여기서 정한다(기본은 w-full · 배경 없음). */
  className?: string
}

/** Figma "PmaxLayout"(19649:32052) 의 코드 정본. */
export function PmaxLayout({
  eyebrow,
  headline,
  headingLevel = 2,
  subcopy,
  ctaLabel,
  disclaimer,
  className = '',
  ...props
}: PmaxLayoutProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. 템플릿 리터럴 타입이
     'h1'|...|'h6' 로 좁혀지므로 임의 태그가 들어올 수 없다. BodyText 와 같은 방식이다. */
  const Heading = `h${headingLevel}` as const

  return (
    /* 19649:32052 — 정사각 캔버스. 위/아래 묶음 사이 남는 공간은 justify-between 이 먹는다. */
    <div
      className={`flex aspect-square w-full flex-col justify-between overflow-clip ${className}`}
      {...props}
    >
      {/* 위 묶음 — 로고와 카피 블록. 둘 사이 간격은 Figma 좌표 차이 그대로다. */}
      <div className="flex flex-col gap-4">
        {/* 19649:32053 Logo/LG — 높이에 중요도 표시를 붙인 이유는 HeaderGNB 와 같다:
            LogoLG 가 자기 클래스로 h-64 를 들고 있고, 생성된 CSS 에서 작은 스텝이 먼저
            방출되므로 표시가 없으면 h-50 이 조용히 진다. */}
        <div className="flex pt-33 pl-33">
          <LogoLG variant="color" className="h-50!" />
        </div>

        {/* 19649:32057 Copy + CTA btn */}
        <div className="flex flex-col items-center gap-36 px-200">
          {/* 19649:32058 Copy — 색과 정렬을 여기 한 번만 걸어 세 줄이 상속받는다. */}
          <div className="flex w-full flex-col items-center gap-12 text-center text-text-primary">
            {/* 19649:32059 Eyebrow */}
            <p className="type-subtitle-large max-h-40 w-full overflow-hidden">{eyebrow}</p>
            {/* 19649:32060 Headline — 클래스는 <p> 때와 동일하다. 바뀐 것은 태그뿐이다. */}
            <Heading className="type-title-large max-h-144 w-full overflow-hidden">
              {headline}
            </Heading>
            {/* 19649:32061 Subcopy */}
            <p className="type-subtitle-large max-h-88 w-full overflow-hidden">{subcopy}</p>
          </div>

          {/* 19649:32062 Button/Promotion — 색은 세트의 red 다(인스턴스가 덮어쓴 붉은색과의
              차이는 파일 상단 "원본에서 확인된 어긋남" 1번). */}
          <ButtonPromotion color="red">{ctaLabel}</ButtonPromotion>
        </div>
      </div>

      {/* 아래 묶음 — 혜택 줄과 고지문. 캔버스 아래쪽에 붙는다. */}
      <div className="flex flex-col gap-48">
        {/* 19661:21449 BenefitRow — 폭을 넘기지 않으면 부모 폭을 채우고 항목을 가운데
            모은다. Figma 인스턴스도 캔버스 가운데에 있다. */}
        <BenefitRow tone="black" />

        {/* 19649:32054 Disclaimer */}
        <div className="flex items-end px-30 pb-42">
          {/* 19649:32055 text — 흰 글로우는 사진 위에서도 읽히게 하려고 Figma 가 건 것이다. */}
          <p className="type-nav-menu max-h-46 min-w-0 flex-1 overflow-hidden text-text-disclaimer text-shadow-disclaimer-glow">
            {disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
