import type { HTMLAttributes, ReactNode } from 'react'
import { Button } from '../Button'
import { ButtonText } from '../ButtonText'

/*
 * ComponentTitle — Figma "ComponentTitle" 의 구현체. 섹션 머리(제목 + 설명)와 그 오른쪽
 * 액션 영역을 한 줄로 배치하는 블록이며, Case 축이 액션 영역과 타이포·폭 규칙을 바꾼다.
 *
 * Figma 원본 (산출물 1)
 *   frame:         https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19574-8524
 *   Case=link:     https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19574-8523
 *   Case=Button:   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15712
 *   Case=tab:      https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21036
 *   부모 section "title": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-21338
 *   Case 3개를 각각 get_design_context 로 읽었다. 추정한 값은 없다. 그 외 Case 는 요청
 *   범위(선택 영역에 그려진 3개)에 없어 만들지 않았다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs 로 Case 별로 읽었다. 값 자체는
 * 여기 적지 않는다(레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것.
 *
 *   Case=link (19574:8523)
 *   용도                     Figma 변수 / 실측       코드 토큰                 유틸리티
 *   제목 타이포              subtitle/large          type-subtitle-large       type-subtitle-large
 *   제목 색                  text/primary            --color-text-primary      text-text-primary
 *   설명 타이포              subtitle/medium         type-subtitle-medium      type-subtitle-medium
 *   설명 색                  text/secondary          --color-text-secondary    text-text-secondary
 *   제목↔설명 간격           spacing/12              --spacing-12              gap-12
 *   루트 폭                  layout/container 1440   --container-container     max-w-container
 *
 *   Case=Button (19661:15712)
 *   용도                     Figma 변수 / 실측       코드 토큰                 유틸리티
 *   제목 타이포              title/medium            type-title-medium         type-title-medium
 *   제목 색                  text/primary            --color-text-primary      text-text-primary
 *   설명 타이포              subtitle/medium         type-subtitle-medium      type-subtitle-medium
 *   설명 색                  text/secondary          --color-text-secondary    text-text-secondary
 *   제목군↔설명군 간격       spacing/12              --spacing-12              gap-12
 *   설명 위쪽 여백           spacing/8               --spacing-8               pt-8
 *   버튼 2개 사이 간격       spacing/8               --spacing-8               gap-8
 *   버튼 고정 폭             변수 없음, 실측 140     --spacing-140             w-140
 *   루트 폭                  layout/container 1440   --container-container     max-w-container
 *
 *   Case=tab (19661:21036)
 *   용도                     Figma 변수 / 실측       코드 토큰                 유틸리티
 *   제목 타이포              title/medium            type-title-medium         type-title-medium
 *   제목 색                  text/primary            --color-text-primary      text-text-primary
 *   설명 타이포              subtitle/medium         type-subtitle-medium      type-subtitle-medium
 *   설명 색                  text/secondary          --color-text-secondary    text-text-secondary
 *   제목↔설명 간격           변수 없음, 실측 8       --spacing-8               gap-8
 *   상하 padding             spacing/24              --spacing-24              py-24
 *   좌우 인셋                layout/viewport-inset   --spacing-viewport-inset  px-viewport-inset
 *   아래 구분선 색           border/default          --color-border-default    border-border-default
 *   구분선 두께              변수 없음, 실측 1       --border-width-hairline   border-b-hairline
 *   루트 폭                  layout/viewport 1920    --container-viewport      max-w-viewport
 *
 *   신규 토큰 없음 — 위 대응은 전부 이미 있던 토큰이다. Case=Button 의 action/primary ·
 *   action/secondary · border/strong · text/inverse · radius/8 · spacing/4 · spacing/16 ·
 *   spacing/20 · body/default-strong 과 Case=link 의 icon/default ·
 *   subtitle/medium-strong 은 get_variable_defs 의 합집합에는 나오지만 이 파일이 직접
 *   쓰지 않는다 — 중첩된 Button · Button/Text 인스턴스가 소비하는 값이고, 아래 "재사용"
 *   대로 기존 컴포넌트가 이미 갖고 있다.
 *
 * 재사용 (원칙 2 — 새로 만들기 전에 조사한 기록)
 *   - Case=Button 의 버튼 2개는 Figma 에서 Button/Web 인스턴스(19676:25030 · 19676:25057)
 *     이고 둘 다 size=lg(높이 64 · py 는 spacing/20) · trailingIcon 없음이다. 그래서
 *     src/components/Button.tsx 를 size="lg" trailingIcon={false} 로 재사용한다.
 *     variant 는 각각 secondary · primary 다(아래 "Figma 원본에서 확인된 이상한 점" 1번).
 *   - Case=link 의 "Read More + 셰브론" 은 Figma 에서 Button/Text 인스턴스(19661:3701)이고
 *     참조 노드가 state=default(19661:3698) 다. src/components/ButtonText.tsx 가 바로 그
 *     노드의 구현체이며 타이포(subtitle/medium-strong) · 색(text/primary) · 간격(spacing/8) ·
 *     아이콘(Icon/UI arrowRight, 실측 18 정사각)이 전부 일치한다. 그대로 재사용하고 새
 *     텍스트 버튼을 만들지 않았다. IconUI 는 ButtonText 안에서 이미 쓰이므로 이 파일이
 *     직접 import 하지 않는다.
 *   - Case=tab 의 구분선은 기존 --border-width-hairline 을 border-b-hairline 으로 쓴다.
 *     같은 조합을 HeaderGNB 가 이미 쓰고 있어 새 토큰도 새 방식도 만들지 않았다.
 *
 * 확정된 구현 판단 7가지
 *   - prop 이름을 case 로 두고 값은 소문자로 통일했다. Figma 축 이름이 Case 이고 값이
 *     link · Button · tab 으로 대소문자가 섞여 있어, 코드에서는 'link' | 'button' | 'tab'
 *     로 소문자화했다(요청자 확정 사항). case 는 JS 예약어라 바인딩 식별자로 쓸 수 없어
 *     함수 안에서 componentCase 로 이름을 바꿔 받는다 — 외부 API 는 Figma 축 이름 그대로다.
 *   - 요소 종류: 제목은 headingLevel prop 이 정하는 h1~h6 로 렌더하고 기본값은 2 다.
 *     설명 텍스트는 제목이 아니므로 <p> 그대로다.
 *     ↳ 이 판단은 번복된 것이다. 이전 구현은 "Figma 가 요소 종류를 정의하지 않으므로
 *       레벨을 발명하지 않는다"는 이유로 제목까지 <p> 로 뒀다. design-reviewer 가 그
 *       전제를 반박했다 — 레벨 정보가 없다는 것이 heading 이 아니라는 뜻은 아니며,
 *       시각적으로 명확한 제목을 <p> 로 두면 스크린리더의 heading 탐색이 불가능해
 *       WCAG 2.1 SC 1.3.1 (Level A) 위반이다. 해소 방식(prop 이름 headingLevel ·
 *       값은 레벨 숫자 · 기본값 2)은 사용자가 확정했고, src/components/title/ 의 3개
 *       컴포넌트가 같은 규격을 쓴다 — BodyText 의 BodyTextHeadingLevel 과 이 파일의
 *       ComponentTitleHeadingLevel 은 이름만 다르고 타입 · 기본값이 같다.
 *     ↳ 기본값 2 의 근거 — 확인한 것과 따라간 것을 구분해 적는다.
 *       확인: Case=Button 의 제목 레이어 19661:15684 는 이름이 "Heading 2" 다. 이 작업에서
 *             get_metadata(19661:15712) 로 직접 다시 읽었다.
 *       확인: 나머지 두 Case 의 제목 레이어에는 레벨 정보가 없다. 같은 방법으로 확인했다 —
 *             Case=link 의 제목(19574:8520)은 레이어 이름이 "label" 이고, Case=tab 의
 *             제목(19661:21039)은 레이어 이름이 텍스트 내용("How can we help?") 이다.
 *             즉 3개 Case 중 레벨 숫자를 가진 것은 Case=Button 하나뿐이다.
 *       따라서 link · tab 에서의 기본값 2 는 그 Case 에서 읽어낸 값이 아니라, 같은
 *       컴포넌트의 Case=Button 이 쓰는 규칙을 따른 것이다. 페이지 문맥이 다르면 호출부가
 *       headingLevel 로 바꾼다 — 기본값이 있다는 것과 그것이 모든 문맥에서 옳다는 것은
 *       다르다.
 *     ↳ 태그가 바뀌어도 렌더 결과는 같다. 클래스 문자열은 한 글자도 바뀌지 않았고,
 *       Tailwind preflight 가 h1~h6 의 font-size · font-weight 를 inherit 로 되돌리고
 *       바깥 여백을 지운다. 그 위에 type-title-medium · type-subtitle-large 가 글꼴 ·
 *       크기 · 굵기 · 줄높이 · 자간을 모두 명시한다. 이 변경으로 추가한 토큰은 없다.
 *   - CTA 라벨을 prop 으로 열지 않았다. "Read More" · "Sign in" · "Join US" 는 이
 *     컴포넌트의 Figma 속성이 아니다 — 위 "Figma 원본" 의 3개 Case 를 읽어 확인된 속성은
 *     case · title · description · buttonText 뿐이고, 세 라벨은 중첩 인스턴스
 *     (19661:3701 Button/Text · 19676:25030 · 19676:25057)의 텍스트 override 로만
 *     존재한다. Figma 가 열지 않은 것을 코드에서 열면 원본에 없는 API 를 발명하는 것이라,
 *     라벨은 Figma 가 그린 문구 그대로 고정했다. 문구를 바꿔야 한다면 Figma 에 텍스트
 *     속성을 만드는 것이 먼저다.
 *     ↳ 이 판단은 번복된 것이다. 이전 구현은 linkLabel · secondaryLabel · primaryLabel
 *       3개 prop 으로 라벨을 열어 뒀다. 같은 납품물의 MainContentTitle 이 똑같은 상황
 *       (CTA 라벨이 중첩 인스턴스의 텍스트 override) 에서 정반대 규칙을 적용해 라벨을
 *       고정했고, 한 납품물 안에서 두 컴포넌트가 모순된다는 것이 design-reviewer FAIL 3
 *       의 사유였다. MainContentTitle 쪽 규칙으로 통일했다(요청자 확정 사항).
 *     ↳ buttonText boolean prop 은 남긴다. 이쪽은 Figma Case=link 에 실재하는 컴포넌트
 *       속성이라 발명이 아니다 — 라벨 3개와는 성격이 다르다.
 *   - 폭: Case 별로 다르게 처리한다. 세 프레임의 폭이 전부 layout 변수와 정확히 일치하기
 *     때문에(link · Button = layout/container, tab = layout/viewport) 임의값이 아니라
 *     토큰으로 옮길 수 있었다. BodyText 가 폭을 호출부에 넘긴 것은 그 인스턴스 폭에
 *     대응하는 변수가 없었기 때문이고, 여기는 사정이 다르다.
 *   - Case=tab 만 좌우 인셋(px-viewport-inset)을 스스로 갖는다. 이 Case 의 프레임은
 *     뷰포트 폭 밴드이고 안쪽 TabContent 가 정확히 container 폭이다(viewport - 인셋 2개).
 *     link · Button 은 패딩이 없는 container 폭 콘텐츠 블록이라 인셋이 없다.
 *   - 텍스트에 whitespace-nowrap 을 옮기지 않았다. Figma 의 nowrap 은 텍스트 컨테이너가
 *     hug 폭이라 붙은 것이고, Figma 폭에서는 줄바꿈이 일어나지 않아 렌더 결과가 같다.
 *     대신 좁은 폭에서 넘치지 않고 줄바꿈되도록 두었다(왼쪽 컬럼에 min-w-0).
 *   - 내부 state 없음. Figma 에 없는 variant · 옵션은 만들지 않았다.
 *
 * Figma 원본에서 확인된 이상한 점 2가지 — 임의로 보정하지 않았고 숨기지도 않는다 (원칙 1)
 *   1. Case=Button 의 "Sign in" 인스턴스는 Button/Web 의 type=secondary, state=hover
 *      (19649:31462)를 가리킨다 — enabled(19649:31459)가 아니다. 두 노드를 각각
 *      get_design_context 로 읽어 확인했다: enabled 는 action/primary-label 배경 ·
 *      border/focus 테두리 · text/primary 라벨이고, 인스턴스는 action/secondary 배경 ·
 *      border/strong 테두리 · text/secondary 라벨로 hover 쪽과 정확히 일치한다.
 *      ↳ 이 항목의 *처리* 는 번복됐다. 원문("코드는 <Button variant='secondary'> 의
 *        기본(enabled) 상태로 렌더한다 — 버튼의 상태는 Button 세트가 정본이고, 합성물이
 *        영구 hover 외형을 소유할 수는 없다. 따라서 렌더가 Figma 합성 스크린샷과
 *        테두리·라벨 색에서 다르게 보인다. Figma 쪽 수정이 필요한 사항으로 보고에
 *        남겼다.")은 더 이상 이 파일의 동작이 아니다. 아래 "번복 이력" 절이 현재 상태다.
 *   2. Case=Button 의 설명 텍스트 레이어가 부모 컨테이너보다 넓다(부모 hug 폭 1028 대
 *      텍스트 1108, nowrap). Figma 오토레이아웃 산물이며 프레임 폭 1440 안에서는 오른쪽
 *      버튼 영역과 겹치지 않는다. 코드는 왼쪽 컬럼을 flex-1 + min-w-0 으로 두어 넘침 대신
 *      줄바꿈이 되게 했다 — Figma 폭에서는 두 방식의 렌더 결과가 같다.
 *
 * 번복 이력 2차 (현재 구현) — "Sign in" 은 다시 enabled 로 렌더한다
 *   아래 1차에서 state="hover" 로 고정한 것은 접근성 회귀였다. design-reviewer 2라운드
 *   계측: hover variant 의 테두리(border/strong) 대 버튼 내부 배경(action/secondary)
 *   대비가 1.67:1 이고, 페이지 배경도 버튼 내부와 같은 밝은 면이라 이 컨트롤을 컨트롤로
 *   식별시키는 시각 정보는 그 테두리 하나뿐이다. WCAG 2.1 SC 1.4.11 Non-text Contrast
 *   (AA) 요구치 3:1 미달이다. enabled(테두리 border/focus)였을 때 같은 자리는 21:1 이었다.
 *
 *   Figma 원본이 hover variant 를 정적으로 배치하고 있다는 아래 1차의 관측은 여전히
 *   사실이다. 바뀐 것은 어느 쪽을 맞추는가다 — 사용자가 "Figma 쪽 Sign in 인스턴스
 *   (19676:25030)를 state=enabled 로 고친다"로 확정했고, 코드는 그 결정을 선반영해
 *   state 를 넘기지 않는다(Button 기본값 enabled).
 *
 *   따라서 Figma 파일이 아직 hover 인 동안에는 스크린샷 대조에서 이 버튼이 불일치로
 *   잡히는 것이 정상이다. 코드 결함이 아니라 디자인 쪽 수정 대기 상태다. 이 불일치를
 *   근거로 코드를 다시 state="hover" 로 되돌리지 마라 — 위 계측대로 WCAG 2.1 SC 1.4.11
 *   위반으로 되돌아가는 3번째 번복이다.
 *
 *   Button 은 이 작업에서 건드리지 않았다. state prop 은 사용자 결정에 따라 유지된다 —
 *   Figma Button/Web 세트에 실재하는 축이고 Button.stories.tsx 의 hover story 2개가 쓴다.
 *   이 파일이 그 prop 을 쓰지 않게 된 것뿐이다.
 *
 * 번복 이력 1차 — "Sign in" 을 hover 외형으로 고정했다 (위 2차로 번복됨)
 *   위 "이상한 점" 1번의 이전 처리(코드를 enabled 로 두고 Figma 쪽 수정을 요청)가
 *   번복돼, 한때 <Button variant="secondary" state="hover"> 로 Figma 인스턴스를
 *   그대로 옮겼다. 당시 번복 근거 2가지:
 *   (a) 요청자 결정 — 코드를 Figma 에 맞춘다(design-reviewer FAIL 6a).
 *   (b) Button 에 state prop 이 추가됐다('enabled' | 'hover', 기본 'enabled'). 이전
 *       처리의 전제("버튼 상태는 Button 세트가 정본이라 합성물이 고정할 수 없다")가
 *       사라졌다 — hover variant 를 정적으로 고정하는 경로가 이제 Button 안에 있고,
 *       합성물이 자기 클래스로 버튼 상태를 재현하지 않는다.
 *
 *   두 버튼을 각각 다시 읽어 확인했다 (기존 주석을 믿지 않고 재확인 — 원칙 1)
 *     "Sign in"(19676:25030) → action/secondary 배경 · border/strong 테두리 ·
 *       text/secondary 라벨. secondary hover(19649:31462)와 일치한다. (이 관측은 유효하나
 *       코드 처리는 위 번복 이력 2차에 따라 enabled 로 되돌렸다.)
 *     "Join US"(19676:25057) → action/primary 배경 · text/inverse 라벨 · 테두리 없음.
 *       primary enabled 와 일치하고 primary hover(action/primary-label 배경 ·
 *       border/strong 테두리 · text/primary 라벨)와는 다르다. hover 가 아님을 확인했으므로
 *       state 를 넘기지 않고 기본값 그대로 둔다 — 추측으로 바꾸지 않았다.
 *     get_variable_defs(19661:15712) 도 같은 판정을 낸다: 이 Case 의 변수에 action/secondary ·
 *       border/strong · text/inverse · action/primary 는 있고, secondary enabled 가 쓰는
 *       action/primary-label · border/focus 는 아예 없다.
 *
 * 토큰이 없어 옮기지 않은 값 2가지 (하드코딩하지 않고 보고에 남겼다)
 *   - Case=Button 루트의 최소 높이 실측 60. 제목 줄높이가 이미 60 이고 오른쪽 버튼이 64 라
 *     발현되지 않는 dead constraint 다(Button 의 최소 높이 36 과 같은 성격).
 *   - Case=Button 왼쪽 컨테이너의 hug 폭 실측 1028(소수점 포함). 위 이상한 점 2번 참고.
 *
 *   버튼 2개의 고정 폭은 이 목록에서 빠졌다 — 해소됐다. token-guardian 이 --spacing-140 을
 *   등재해 위 Case=Button 매핑표의 "버튼 고정 폭" 행으로 옮겼고 w-140 으로 적용한다.
 *   이 폭이 걸리면 Button 의 min-w-80 은 발현되지 않지만 둘은 서로 대체할 수 없다 —
 *   min-w-80 은 세트가 짧은 라벨에 두는 최소치이고, 140 은 이 합성물이 인스턴스에 준
 *   고정 width override 다. w-140 은 Button 의 className 이 클래스 문자열 마지막에
 *   합성되고 기본 클래스에 w-* 가 없어(min-w-80 만 있다) 덮어쓰기 없이 적용된다 —
 *   Button.tsx 를 직접 읽어 확인했다.
 */

/* Figma 축 Case. 값은 소문자로 통일했다 — 위 "확정된 구현 판단" 1번 참고. */
export type ComponentTitleCase = 'link' | 'button' | 'tab'

/* 제목이 렌더될 heading 레벨. src/components/title/ 의 3개 컴포넌트가 같은 타입 · 같은
   기본값(2)을 쓴다 — 규격이 어긋나면 호출부가 컴포넌트마다 다른 규칙을 외워야 한다.
   이름은 BodyText 의 BodyTextHeadingLevel 관례를 따랐다. 공용 파일로 빼지 않은 이유는
   이 작업의 편집 범위가 ComponentTitle 2개 파일로 한정돼 있어서다(보고에 남겼다). */
export type ComponentTitleHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface ComponentTitleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Figma 의 Case 축. 액션 영역과 제목 타이포·폭 규칙이 바뀐다. */
  case?: ComponentTitleCase
  /**
   * 제목을 렌더할 heading 레벨. 기본 2(`<h2>`) — 근거는 위 주석 참고.
   * 시각 스타일에는 영향이 없고 마크업 구조만 바뀐다. 문서의 heading 순서가 건너뛰지
   * 않도록 놓이는 위치에 맞춰 호출부가 지정한다.
   */
  headingLevel?: ComponentTitleHeadingLevel
  /**
   * 큰 제목 (Figma 19574:8520 / 19661:15685 / 19661:21039).
   * headingLevel 이 정한 heading 요소가 된다.
   */
  title: ReactNode
  /** 제목 아래 설명 (Figma 19574:8521 / 19661:15687 / 19661:21040). heading 이 아니다. */
  description: ReactNode
  /**
   * Figma Case=link 의 buttonText 속성. false 면 오른쪽 텍스트 링크만 빠진다.
   * case='link' 에서만 쓰인다.
   */
  buttonText?: boolean
}

/** Figma "ComponentTitle"(19574:8524) 의 코드 정본. */
export function ComponentTitle({
  case: componentCase = 'link',
  headingLevel = 2,
  title,
  description,
  buttonText = true,
  className = '',
  ...props
}: ComponentTitleProps) {
  /* 대문자로 받아야 JSX 가 컴포넌트가 아닌 태그 이름으로 읽는다. 템플릿 리터럴 타입이
     'h1'|...|'h6' 로 좁혀지므로 임의 태그가 들어올 수 없다. BodyText 와 같은 방식이다. */
  const Heading = `h${headingLevel}` as const

  /* Case=tab (19661:21036) — 뷰포트 폭 밴드 + 아래 구분선. 오른쪽 액션이 없다.
     Figma 루트의 gap 과 TabContent 의 gap 은 자식이 하나뿐이라 렌더에 영향이 없어
     옮기지 않았다. */
  if (componentCase === 'tab') {
    return (
      <div
        className={`flex w-full max-w-viewport flex-col items-start border-b-hairline border-border-default px-viewport-inset py-24 ${className}`}
        {...props}
      >
        {/* 19661:21038 Title */}
        <div className="flex w-full min-w-0 flex-col items-start justify-center gap-8">
          {/* 19661:21039 — 클래스는 <p> 때와 동일하다. 바뀐 것은 태그뿐이다. */}
          <Heading className="type-title-medium text-text-primary">{title}</Heading>
          <p className="type-subtitle-medium text-text-secondary">{description}</p>
        </div>
      </div>
    )
  }

  /* Case=Button (19661:15712) — 왼쪽 제목군 + 오른쪽 버튼 2개. */
  if (componentCase === 'button') {
    return (
      <div
        className={`mx-auto flex w-full max-w-container items-center justify-between ${className}`}
        {...props}
      >
        {/* 19661:15682 Container — 제목군과 설명군 사이가 gap-12 다. */}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-12">
          {/* 19661:15684 Heading 2 — 이 레이어 이름이 기본값 2 의 근거다(위 주석 참고).
              클래스는 <p> 때와 동일하다. 바뀐 것은 태그뿐이다. */}
          <Heading className="type-title-medium w-full text-text-primary">{title}</Heading>
          {/* 19661:15686 Paragraph — 이 래퍼가 렌더에 주는 영향은 위쪽 여백 pt-8 뿐이라
              래퍼를 두지 않고 텍스트에 직접 걸었다. gap-12 와 합쳐진 간격이 Figma 와 같다. */}
          <p className="type-subtitle-medium w-full pt-8 text-text-secondary">{description}</p>
        </div>

        {/* 19661:15688 Container — 버튼 2개. 둘 다 size=lg · 아이콘 없음 · 고정 폭 w-140 이다.
            둘 다 state 를 넘기지 않아 Button 의 기본값(enabled)으로 렌더한다.
            "Sign in"(19676:25030) 은 Figma 인스턴스가 아직 hover variant 를 가리키지만,
            코드는 사용자 결정(Figma 를 enabled 로 고친다)을 선반영한 상태다 — 근거와 대비
            계측값은 위 "번복 이력 2" 절 참고. "Join US"(19676:25057) 는 Figma 인스턴스가
            처음부터 enabled 다. 라벨은 Figma 원본 문구로 고정했다(중첩 인스턴스의 텍스트
            override 이지 이 컴포넌트의 속성이 아니다). */}
        <div className="flex shrink-0 items-center justify-end gap-8">
          <Button variant="secondary" size="lg" trailingIcon={false} className="w-140">
            Sign in
          </Button>
          <Button variant="primary" size="lg" trailingIcon={false} className="w-140">
            Join US
          </Button>
        </div>
      </div>
    )
  }

  /* Case=link (19574:8523) — 왼쪽 제목군 + 오른쪽 텍스트 링크.
     Figma 루트의 세로 gap 은 자식(Container)이 하나뿐이라 렌더에 영향이 없어 옮기지
     않았고, 그 Container 를 루트로 삼았다. */
  return (
    <div
      className={`mx-auto flex w-full max-w-container items-center justify-between ${className}`}
      {...props}
    >
      {/* 19574:8519 Text Container */}
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-12">
        {/* 19574:8520 — 클래스는 <p> 때와 동일하다. 바뀐 것은 태그뿐이다. */}
        <Heading className="type-subtitle-large text-text-primary">{title}</Heading>
        <p className="type-subtitle-medium text-text-secondary">{description}</p>
      </div>

      {/* 19661:3701 Button/Text — 기존 ButtonText 재사용 (위 "재사용" 참고).
          라벨은 Figma 인스턴스의 문구로 고정했다 — prop 이 아닌 이유는 위 주석 참고. */}
      {buttonText ? <ButtonText className="shrink-0">Read More</ButtonText> : null}
    </div>
  )
}
