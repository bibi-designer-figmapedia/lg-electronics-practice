import type { FormSignInAnnotations } from '../../components/FormSignIn'
import { FormSignIn } from '../../components/FormSignIn'
import { HeaderGNB } from '../../components/header/HeaderGNB'

/*
 * SignIn — Figma "page/SignIn" 의 구현체. 페이지 조립 레이어이고, 자체 지오메트리는
 * 세로 스택 2단(HeaderGNB · 폼을 가운데 둔 본문)이 전부다.
 *
 * Figma 원본 (산출물 1)
 *   page:  https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7100
 *   sheet: https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7098
 *
 *   내부 노드 (get_design_context(118:7100) 가 내준 트리 그대로)
 *     118:7101  headerGNB   인스턴스, Property 1=secondary   높이 76
 *     118:7102  container   폼을 가운데 두는 영역             높이 883
 *     118:7103  form        Form/SignIn 인스턴스              폭 450 · 높이 456
 *     118:7127 / 118:7128   높이 0 짜리 빈 Container 2개 — 아래 "옮기지 않은 값" 참고
 *     118:7129 / 118:7131 / 118:7133  num 마커 1·2·3 — 화면이 아니라 시트의 주석
 *
 * 재사용 — 새로 만든 컴포넌트가 0개다 (원칙 2)
 *   HeaderGNB     118:7101 과 1:1. variant="secondary" 는 로고만 있는 변형이라
 *                 CategoryMenu 도 RightMenu 도 렌더하지 않는다.
 *   FormSignIn    118:7103 과 1:1. 카드 안쪽(제목 · Input · Button · CheckBoxSet ·
 *                 구분선 · 소셜 버튼 3개)은 전부 그 컴포넌트가 이미 갖고 있다 —
 *                 여기서 다시 조립하지 않는다.
 *
 * 이 페이지가 override 하는 값은 2개뿐이다
 *   emailPlaceholder="Email*"  이 시트의 인스턴스(118:7107)가 라이브러리 기본 문구
 *                              ("Lorem ipsum*")를 덮어 쓴다. 요청자가 시트 쪽을
 *                              따르기로 확정했다.
 *   className="w-450"          FormSignIn 은 폭을 갖지 않고 호출부가 정한다고
 *                              기록해 두었다. 그 호출부가 여기다.
 *
 * 토큰 매핑 (산출물 2) — 이 파일이 소비하는 시각 값은 아래 4개가 전부다. 색 · 타이포 ·
 * 카드 내부 간격은 자식 컴포넌트가 이미 토큰으로 갖고 있어 다시 지정하지 않는다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   | 용도 | Figma 변수 / 실측 | 코드 토큰 | 유틸리티 |
 *   | --- | --- | --- | --- |
 *   | 페이지 배경 | bg/warm | --color-bg-warm | `bg-bg-warm` |
 *   | 페이지 폭 | 변수 없음, 실측 1920 | --container-viewport | `max-w-viewport` |
 *   | 폼 카드 폭 | 변수 없음, 실측 450 | --spacing-450 | `w-450` |
 *   | 본문 상하 여백 | 아래 "옮기지 않은 값" 1번 | --spacing-64 | `py-64` |
 *
 *   --spacing-450 은 이 페이지 때문에 새로 등재한 유일한 토큰이다. 등재 근거는
 *   src/tokens/spacing.tokens.css 의 해당 항목에 적었다.
 *
 * 옮기지 않은 값 3가지 (하드코딩하지 않고 근거를 남긴다)
 *   1. container 높이 실측 883. 1080 아트보드에서 헤더(76)를 뺀 나머지도 아니고
 *      (1080 - 76 = 1004), 자식의 합도 아니다(폼 456) — 아트보드 높이에 맞춰 손으로
 *      정한 값이고 대응하는 토큰이 없다. 그대로 심으면 뷰포트가 그보다 낮을 때 폼이
 *      잘린다. 대신 본문에 spacing/64 상하 여백을 주고 가운데 정렬로 뒀다. 폼이
 *      "헤더 아래 남는 자리의 한가운데" 라는 원본의 의도는 유지되고, 페이지 높이는
 *      내용이 정한다.
 *   2. 폼의 절대 위치 x 735 · y 213.5. 883 안에서 450 을 가운데 두면 나오는
 *      결과값이다. `items-center justify-center` 가 같은 배치를 만든다.
 *   3. 118:7127 · 118:7128 의 높이 0 짜리 Container 2개. 렌더 결과가 없는 빈
 *      프레임이라 옮기지 않았다. 하나는 Figma 기본 배경 변수를 물고 있지만 높이가
 *      0 이라 칠할 면이 없다.
 *
 * 번호 마커(118:7129 · 118:7131 · 118:7133)는 이 페이지의 일부가 아니다
 *   시트가 화면 위에 얹은 주석이고, 실제 Sign in 페이지에는 존재하지 않는다. 그래서
 *   기본 렌더에는 나오지 않고, 화면정의서가 annotations 로 넣을 때만 그려진다.
 *   이 페이지는 그것을 FormSignIn 에 그대로 넘기기만 한다 — 무엇을 그릴지도, 어디에
 *   붙일지도 정하지 않는다.
 *
 * 루트가 div 인 이유
 *   HeaderGNB 가 이미 `header` 를 렌더하고 `main` 은 아래에서 직접 쓴다. 루트까지
 *   랜드마크로 만들면 중복이라 배치용 div 다. PDP.tsx 가 같은 판단을 기록해 두었다.
 *
 * items 를 빈 배열로 넘기는 이유
 *   HeaderGNB 의 items 는 필수 prop 이지만 variant="secondary" 는 CategoryMenu 를
 *   렌더하지 않아 이 값을 쓰지 않는다. 그 컴포넌트가 "기본 variant 에서 빠뜨리면 빈
 *   메뉴가 조용히 렌더되기 때문에 필수로 뒀다" 고 기록해 두었으므로, 여기서는 쓰이지
 *   않는다는 뜻으로 빈 배열을 넘긴다 — 원본에 없는 메뉴를 지어내지 않는다.
 */

export interface SignInProps {
  /**
   * 화면정의서(src/specs/)가 폼 위에 얹는 번호 마커. FormSignIn 으로 그대로
   * 넘어간다. 실제 페이지에는 마커가 없으므로 기본값은 없다.
   */
  annotations?: FormSignInAnnotations
}

/** Figma "page/SignIn" 의 코드 정본. */
export function SignIn({ annotations }: SignInProps) {
  return (
    <div className="flex w-full max-w-viewport flex-col items-start bg-bg-warm">
      {/* 118:7101 */}
      <HeaderGNB variant="secondary" items={[]} />

      {/* 118:7102 — 위 "옮기지 않은 값" 1번 참고 */}
      <main className="flex w-full flex-col items-center justify-center py-64">
        {/* 118:7103 */}
        <FormSignIn
          emailPlaceholder="Email*"
          annotations={annotations}
          className="w-450"
        />
      </main>
    </div>
  )
}
