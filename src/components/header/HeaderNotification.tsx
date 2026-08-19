import type { HTMLAttributes, ReactNode } from 'react'
import { IconUI, type IconUIType } from '../icons/IconUI'

/*
 * HeaderNotification — Figma "Header/Notification" 의 구현체.
 *
 * 이름에서 슬래시가 빠진 이유: Figma 원본 이름은 `Header/Notification` 이지만 JSX 태그와
 * JS 식별자에 슬래시를 쓸 수 없다. 그래서 슬래시만 제거하고 PascalCase 로 이어 붙였다
 * (`Header/Notification` -> `HeaderNotification`). 원본 이름과 코드 이름을 잇는 연결은
 * 이 주석과 아래 node 링크뿐이므로, 이름을 바꾸려면 여기도 같이 고쳐야 한다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4208
 *
 *   내부 노드 (get_metadata 로 읽음)
 *     19661:4096  Icon/UI            왼쪽 아이콘
 *     19661:4009  NotificationText   가운데 텍스트 프레임
 *     19661:4010  텍스트 레이어
 *     19661:4207  NotificationActions 오른쪽 아이콘 2개
 *     19661:4100  Icon/UI            다음
 *     19661:4186  Icon/UI            닫기
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:4208) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                    Figma 변수 / 실측       코드 토큰                    유틸리티
 *   배경                    surface/inverse         --color-surface-inverse      bg-surface-inverse
 *   메시지 색               text/inverse            --color-text-inverse         text-text-inverse
 *   아이콘 색               icon/white              --color-icon-white           text-icon-white
 *   메시지 타이포           font-size/16 +          type-body-default            type-body-default
 *                           font-family/sans +
 *                           font-weight/regular +
 *                           행간 20
 *   상하 padding            spacing/20              --spacing-20                 py-20
 *   다음↔닫기 간격          spacing/24              --spacing-24                 gap-24
 *   밴드 좌우 거터          layout/gutter 24        --spacing-gutter             px-gutter
 *   콘텐츠 폭 상한          변수 없음, 실측 1440    --container-container        max-w-container
 *   (좌우 인셋 240 은 위 둘의 조합에서 나온다 — 아래 "인셋을 패딩으로 쓰지 않는 이유")
 *   아이콘 박스             변수 없음, 실측 16      --spacing-16                 size-16
 *
 *   새 토큰은 하나도 만들지 않았다. 위 5개 변수는 전부 기존 토큰에 이미 대응이 있었고,
 *   변수가 없는 4개(240 · 1920 · 16 · 높이)도 기존 스텝으로 표현된다.
 *
 * 확정된 구현 판단 5가지
 *   1. 높이 60 을 고정 유틸리티로 쓰지 않는다. spacing 스케일에 60 스텝이 없어 `h-60` 은
 *      Tailwind 내장 스케일(60 * 0.25rem)로 조용히 잘못 해석된다 — hook 도 못 잡는다.
 *      대신 Figma 와 같은 방식으로 py-20 + 내용 높이 20(= type-body-default 의 행간)
 *      으로 60 이 나오게 둔다.
 *   2. 아이콘 크기 16 은 IconUI 에 className 으로 넘기지 않는다. IconUI 는 자기 클래스를
 *      `size-24 ...` 로 먼저 붙이고 호출자 className 을 뒤에 잇지만, CSS 우선순위는
 *      class 속성의 순서가 아니라 생성된 스타일시트의 순서로 정해진다. 이 프로젝트의
 *      토큰으로 컴파일해 확인한 결과 `.size-24` 가 `.size-16` 보다 뒤에 나와, `size-16`
 *      을 넘기면 조용히 무시된다. 그래서 크기는 버튼(= 16 정사각 박스)이 정하고 IconUI
 *      에는 `size-full` 을 넘긴다 — 같은 방식으로 확인했을 때 `.size-full` 은 `.size-24`
 *      보다 뒤에 나오므로 이쪽은 실제로 이긴다.
 *   3. 색은 반대로 className 으로 넘겨도 된다. `.text-icon-white` 가 IconUI 기본값인
 *      `.text-icon-default` 보다 뒤에 나오는 것을 같은 방법으로 확인했다.
 *   4. 상태를 갖지 않는다. 이전/다음/닫기는 전부 핸들러 prop 으로 호출부에 넘긴다 —
 *      Figma 에 상태 variant 가 없고, 닫힘 여부는 이 바가 아니라 호출부의 관심사다.
 *      핸들러를 주지 않아도 버튼 3개는 그대로 렌더된다(Figma 원본이 항상 3개다).
 *   5. 너비는 컴포넌트가 정하지 않는다. `w-full` 로 부모 폭을 채우고 상한도 하한도 걸지
 *      않는다. Figma 프레임 폭 1920 은 콘텐츠 폭 1440 + 거터로 재현된다(아래 항목 참고).
 *
 * Figma 에 없어서 발명한 것 — aria-label 3개
 *   원본에는 아이콘의 용도 주석이 없다. 배치(왼쪽 arrowLeft / 오른쪽 arrowRight + close)
 *   에서 읽은 역할을 라벨로 적었다. 문맥이 다른 곳에서는 호출부가 덮어써야 한다.
 *
 * 축소 렌더 시의 획 두께 (design-reviewer 6번 FAIL 대응)
 *   FAIL 내용: 셰브론의 실효 획이 Figma 의 절반이었다(측정 0.64 대 1.4).
 *
 *   원인 — Figma 를 직접 읽어 확인했다. 이 바의 아이콘 3개는 Icon/UI 마스터(24 프레임)를
 *   16 으로 리사이즈한 인스턴스다. Figma 는 리사이즈할 때 path 만 2/3 로 줄이고 stroke
 *   두께는 그대로 둔다 — get_design_context(19661:4096 · 19661:4100)가 내준 SVG 가
 *   글리프 상자 6 곱하기 12(= 24 좌표계의 9 곱하기 18 을 2/3 한 값)에 stroke-width 1.5 다.
 *   반면 위 판단 2 대로 svg 전체를 CSS 로 축소하면 stroke 도 같이 줄어 1.0 이 된다.
 *   즉 경로 기하는 정확히 일치했고 획만 달랐다.
 *
 *   고친 방법: IconUI 에 resizedTo 로 이 바의 아이콘 상자 크기를 알려준다. IconUI 는 그
 *   축소비의 역수만큼 stroke-width 만 미리 키우므로(1.5 가 2.25 로 그려지고 화면에서 2/3 로
 *   줄어 다시 1.5 가 된다) 글리프 위치·크기는 그대로 두고 획만 Figma 값으로 돌아온다 —
 *   위 판단 2(크기는 버튼이 정하고 IconUI 에는 size-full 을 넘긴다)를 바꾸지 않는다.
 *   opt-in 이라 이 파일 밖 호출부(RightMenu 의 Crossup, ButtonText, 24 로 쓰는 곳)는
 *   영향이 없다 — 측정으로 확인했다.
 *
 *   버린 대안: vector-effect non-scaling-stroke 는 한 줄로 끝나 보였지만 Chrome 이 그
 *   획을 기기 화소 단위로 그려서, 고해상도 화면일수록 오히려 얇아진다(기기 배율 2 · 4 · 10
 *   에서 잉크 면적 13.3 · 6.3 · 2.5 로 측정). 근거는 IconUI 주석에 남겼다.
 *
 *   해소됨 — 닫기
 *     닫기는 IconUI 에서 fill 로 옮겨 온 boolean union 이라 stroke 두께가 없었고, 그래서
 *     위 보정이 닿지 않아 혼자 2/3 인 1.5 로 렌더됐다(Figma 대비 잉크 면적 비 0.681).
 *     Figma 의 close 인스턴스(19661:4186)도 셰브론과 같은 규칙을 따른다 — 막대 두께
 *     2.25 는 절대값으로 남고 대각선만 짧아진다. IconUI 가 이 글리프를 union outline
 *     대신 중심선 2개의 stroke 로 갖게 되면서 여기서도 보정이 걸린다. 이 파일에서는
 *     고칠 것이 없었고 resizedTo 를 넘기는 방식도 그대로다. 근거와 되읽은 기하는 IconUI
 *     주석의 "close 를 stroke 로 되돌린 이유" 에 있다.
 *
 * 포커스 표시 추가 (design-reviewer a11y FAIL 대응)
 *   근거: 빌드된 스타일시트에 :focus-visible 규칙이 하나도 없었고, --color-border-focus
 *   토큰이 어디에서도 포커스 표시로 쓰이지 않았다. Figma 에 focus variant 가 없으므로 시각
 *   표현을 발명하는 대신 이미 있는 토큰 2개만 조합했다. 아이콘 버튼 3개가 모두 같은
 *   유틸리티 문자열을 쓰고, 두께·구조는 Tab 과도 동일하다(디자인 시스템 내 포커스 표시
 *   불일치 방지). 색만 이 바의 배경 때문에 반전 짝을 쓴다 — 아래 참고:
 *     색   --color-border-focus-inverse  outline-border-focus-inverse
 *     두께 --border-width-hairline       outline-(length:--border-width-hairline)
 *   ring(box-shadow) 이 아니라 outline 을 택한 이유는 Tab 의 같은 항목에 적어 두었다 —
 *   요약하면 레이아웃을 밀지 않고, 강제 색 대비 모드에서 살아남고, 두께를 이 저장소에
 *   실제로 있는 토큰 변수로 지정할 수 있는 유일한 방식이기 때문이다. 오프셋은 지정하지
 *   않는다(CSS 초깃값 0) — 오프셋에 해당하는 이름 붙은 토큰이 없어 근사하지 않았다.
 *
 *   해소됨 — 반전 배경 위의 포커스 색 대비
 *     이 바의 배경은 surface/inverse 다. --color-border-focus 는 검정 하나뿐이라 그 위에서
 *     대비가 1.66:1 이었다 — WCAG 2.1 SC 1.4.11(비텍스트 대비)이 포커스 표시에 요구하는
 *     3:1 미달이다. token-guardian 이 --color-border-focus-inverse 를 등재해(대비 12.64:1)
 *     여기서 색 유틸리티만 그것으로 바꿨다. 두께와 구조는 Tab · RightMenu 와 그대로 같다.
 *     Figma 에는 대응 변수가 없다 — get_variable_defs(19661:4208) 가 focus 관련 변수를
 *     반환하지 않는 것을 확인했고, 그 사실과 값 선택 근거는 토큰 정의 주석에 있다.
 *
 * 인셋을 패딩으로 쓰지 않는 이유 (모든 full-bleed 밴드가 공유하는 구조)
 *   이 밴드는 뷰포트 전체 폭을 쓴다. 좌우 인셋 240 을 루트 padding 으로 직접 주면
 *   (px-viewport-inset) 그 240 이 어떤 폭에서도 고정이라, 뷰포트가 1920 보다 좁아지는 순간
 *   콘텐츠가 남은 폭에서 눌리거나 밖으로 넘쳐 가로 스크롤이 생긴다. 밴드에 하한
 *   (min-w-viewport)을 걸어 막아 보기도 했는데, 그것은 넘침을 없애는 대신 좁은 화면에서
 *   항상 넘치게 만드는 쪽이었다. 그래서 인셋을 값으로 주지 않고 컨테이너가 만들게 둔다.
 *     바깥 층   w-full + 배경 + px-gutter        (최소 폭 · 최대 폭 지정 없음)
 *     안쪽 층   mx-auto w-full max-w-container
 *   1920 에서 (1920 - 48 - 1440) / 2 + 24 = 240 이 그대로 나온다. 1920 보다 좁으면 상한 1440
 *   쪽이 먼저 줄어들어 레이아웃이 자연스럽게 좁아지고(가로 스크롤 0), 1920 보다 넓으면 배경은
 *   화면 전체로 늘고 콘텐츠는 1440 중앙에 남는다. 같은 구조가 full-bleed 밴드 6개
 *   (HeaderGNB · HeaderNotification · Footer · FuntionalTab · ComponentTitle · HeroBanner)와
 *   페이지 섹션에 같은 모양으로 들어가 있다.
 *   --spacing-viewport-inset 토큰은 그대로 있다 — Figma layout/viewport-inset 변수의 대응이고
 *   토큰 갤러리가 시연한다. 이 파일이 그것을 padding 으로 쓰지 않을 뿐이다.
 */

export interface HeaderNotificationProps extends HTMLAttributes<HTMLDivElement> {
  /** 바에 표시할 메시지. Figma 의 텍스트 레이어(19661:4010)에 대응한다. */
  children: ReactNode
  /** 왼쪽 화살표. */
  onPrev?: () => void
  /** 오른쪽 화살표. */
  onNext?: () => void
  /** 닫기. 이 컴포넌트는 스스로 사라지지 않는다 — 호출부가 언마운트한다. */
  onClose?: () => void
}

/**
 * 아이콘 버튼 한 변. 아래 size-16 과 같은 값이며, IconUI 에 넘겨 stroke 보정 기준으로 쓴다
 * (위 "축소 렌더 시의 획 두께" 참고). 유틸리티와 함께 고쳐야 하는 값이라 한 곳에 둔다.
 */
const ICON_BOX = 16

/**
 * 아이콘 하나 = 버튼 하나. 크기를 정하는 쪽이 버튼이라는 점이 핵심이다(위 판단 2).
 * IconUI 는 aria-hidden 으로 접근성 트리에서 빼고, 이름은 버튼의 aria-label 이 갖는다 —
 * 그러지 않으면 IconUI 자신의 role="img" 라벨과 버튼 라벨이 둘 다 읽힌다.
 */
function NotificationIconButton({
  type,
  label,
  onClick,
}: {
  type: IconUIType
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      /* 포커스 표시: 위 블록 주석의 "포커스 표시 추가" 참고. 버튼 3개가 이 함수를 공유하므로
         한 곳에 적으면 셋 다 같은 표현이 된다. 두께·구조는 Tab 과 같고 색만 반전 짝이다. */
      className="inline-flex size-16 shrink-0 items-center justify-center focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus-inverse"
    >
      {/* resizedTo: 위 블록 주석의 "축소 렌더 시의 획 두께" 참고. 크기는 여전히 버튼이 정한다. */}
      <IconUI
        type={type}
        className="size-full text-icon-white"
        resizedTo={ICON_BOX}
        aria-hidden
      />
    </button>
  )
}

/** Figma "Header/Notification" 의 코드 정본. */
export function HeaderNotification({
  children,
  onPrev,
  onNext,
  onClose,
  className = '',
  ...props
}: HeaderNotificationProps) {
  return (
    <div
      className={`flex w-full items-center bg-surface-inverse px-gutter py-20 ${className}`}
      {...props}
    >
      {/*
       * 안쪽 콘텐츠 층 — 폭 상한 1440 을 잡고 가운데 선다. 좌우 인셋 240 은 이 층이 아니라
       * 루트의 px-gutter 와 이 상한의 조합에서 나온다(아래 "인셋을 패딩으로 쓰지 않는 이유").
       * justify-between 도 루트가 아니라 여기 있다 — 나눌 대상은 뷰포트 폭이 아니라 콘텐츠 폭이다.
       */}
      <div className="mx-auto flex w-full max-w-container items-center justify-between">
        {/* 19661:4096 — type=arrowLeft (아래 variant 확인 근거 참고) */}
        <NotificationIconButton
          type="arrowLeft"
          label="Previous notification"
          onClick={onPrev}
        />
        {/*
         * 19661:4009 NotificationText — Figma 에서 flex-1 로 남는 폭을 전부 먹고 그 안에서
         * 가운데 정렬된다. min-w-0 이 없으면 긴 메시지가 flex 아이템의 기본 최소 폭에 걸려
         * 좌우 아이콘을 밀어낸다.
         */}
        <div className="flex min-w-0 flex-1 items-center justify-center">
          {/*
           * Figma 텍스트 노드는 줄바꿈 없는 한 줄이라 export 에 whitespace-pre 가 붙는다.
           * 그대로 쓰면 좁은 폭에서 줄바꿈을 막아 바 밖으로 흘러나가므로 pre-wrap 을
           * 쓴다 — 연속 공백은 보존하면서 줄바꿈은 허용하는 쪽이다.
           *
           * 이 한 칸이 실제로 눈에 보이는 차이다. Figma 원문은 문장 끝과 Sign-up
           * 사이에 공백 두 개를 두는데, 기본 white-space 는 그것을 한 칸으로 접는다.
           * 접힌 상태에서는 Sign-up 앞 간격이 Figma 대비 좁고 문구 전체 잉크 폭도
           * 짧아진다. pre-wrap 을 걸면 잉크 시작·끝·폭·간격 네 수치가 Figma 와
           * 일치한다 (design-reviewer 6번 항목 측정).
           */}
          <p className="type-body-default text-center whitespace-pre-wrap text-text-inverse">
            {children}
          </p>
        </div>
        {/* 19661:4207 NotificationActions — 두 아이콘 사이만 spacing/24 다. */}
        <div className="flex shrink-0 items-center gap-24">
          {/* 19661:4100 — type=arrowRight */}
          <NotificationIconButton
            type="arrowRight"
            label="Next notification"
            onClick={onNext}
          />
          {/* 19661:4186 — type=close */}
          <NotificationIconButton
            type="close"
            label="Close notification"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  )
}

/*
 * Icon/UI variant 확인 근거 (추정이 아니라 대조 결과다)
 *
 * get_design_context(19661:4208) 는 인스턴스 3개의 자식 노드를 `I<인스턴스>;<원본자식>`
 * 형식으로 내준다. 그 뒷부분(원본 컴포넌트 안의 자식 ID)을 각 variant 의 get_metadata
 * 결과와 대조하면 어떤 variant 인지가 한 개씩 확정된다.
 *
 *   인스턴스     원본 자식 ID   그 자식을 가진 variant                 결론
 *   19661:4096   19660:34801    19655:33756 type=arrowLeft             arrowLeft
 *   19661:4100   19649:31493    19655:33757 type=arrowRight            arrowRight
 *   19661:4186   19629:25964    19655:33763 type=close                 close
 *
 * arrowRight 와 Arrow 는 둘 다 오른쪽 chevron 이라 모양만으로는 구분되지 않는데,
 * type=Arrow(19655:33760)의 자식은 19629:25968 로 위 어느 것과도 다르다. 즉 이 바에
 * Arrow 는 쓰이지 않았음이 ID 대조로 확정된다.
 */
