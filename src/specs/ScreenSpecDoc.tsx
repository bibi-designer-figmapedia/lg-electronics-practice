import type { ReactNode } from 'react'
import type { ScreenSpec } from './types'

/*
 * ScreenSpecDoc — 화면정의서 1건을 Figma 원본과 같은 표 모양으로 그린다.
 *
 * Figma 원본 (산출물 1)
 *   시트 전체:   https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7098
 *   상단 5칸:    https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7175
 *   Description: https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7135
 *   세 노드 모두 get_design_context 로 읽었다. 추정한 값은 없다.
 *
 * 화면 자체는 이 컴포넌트가 그리지 않는다 — `screen` 슬롯으로 받아 자리에 끼운다.
 * 화면을 그리는 것은 src/page/ 의 페이지 컴포넌트이고, 여기는 문서 프레임이다.
 * 슬롯으로 둔 이유: 화면정의서마다 화면이 다르므로 템플릿이 알 수 없고, 알게 만들면
 * 화면 1건이 늘 때마다 이 파일을 고쳐야 한다.
 *
 * 축척에 관하여 — 원본 시트는 1920 페이지를 2880 아트보드에 올려 두었고, 문서
 * 프레임(표·라벨)은 그 아트보드 기준으로 1.5배 크기로 그려져 있다. 그래서 실측을
 * 1.5 로 나눈 뒤 기존 스케일에 스냅했다. 아래 표의 "실측/1.5" 열이 그 값이다.
 * 나누면 거의 전부 기존 스텝에 정확히 떨어진다 — 새 토큰은 1개도 만들지 않았다.
 *
 * 토큰 매핑 (산출물 2) — 원본 시트는 Figma 변수를 쓰지 않는 순수 도면이라
 * get_variable_defs 가 아니라 get_design_context 의 실측값을 기준으로 흡수했다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                      실측 / 1.5        코드 토큰                 유틸리티
 *   문서 배경                 흰색              --color-bg-default        bg-bg-default
 *   라벨·영역명·소제목 색     222               --color-text-primary      text-text-primary
 *   값·항목 본문 색           666               --color-text-tertiary     text-text-tertiary
 *   번호 칼럼 배경            f7f7f7            --color-bg-light          bg-bg-light
 *   셀 구분선                 eee               --color-border-default    border-border-default
 *   구획선(굵은 검정)         444 / 검정        --color-border-focus      border-border-focus
 *   선 두께                   1.425 -> 1        --border-width-hairline   border-*-hairline
 *   셀 좌우 패딩              11.4·12.5 -> 8    --spacing-8               px-8
 *   셀 상하 패딩              17.1·18.8 -> 12   --spacing-12              py-12
 *   번호 칼럼 너비            91.2 -> 60.8      --spacing-64              w-64
 *   제목↔표 간격              17.1 -> 11.4      --spacing-12              gap-12
 *   상단 블록↔Description     여백              --spacing-32              mt-32
 *   셀 안 블록 간격           빈 줄 -> 25.7     --spacing-24              gap-24
 *   "Description" 제목        28.5 SemiBold     (composite)               type-subtitle-medium-strong
 *   라벨(화면/화면 ID …)      30 Medium -> 20   (composite)               type-body-default-strong
 *   값·번호·항목              25.7 Regular      (composite)               type-body-default
 *   영역명·소제목             25.7 Bold         (composite)               type-body-default-strong
 *
 * 흡수하면서 원본과 달라진 3가지 (새 토큰을 만들지 않기로 한 대가, 보고 대상)
 *   1. 구분선 eee -> border/default. 저장소의 border/default 는 웜톤 회색이고
 *      원본은 뉴트럴 회색이다. 색조가 다르다.
 *   2. 라벨의 Medium(500) -> SemiBold(600). 토큰 스케일에 500 이 없다.
 *   3. location 블록 아래 굵은 선(5)과 Description 위 선(1.425) 모두 hairline 로
 *      흡수했다. 저장소의 border-width 토큰은 hairline 하나뿐이라 두께 위계가
 *      사라지고, 대신 색(border/focus)으로만 구분된다.
 *
 * 상단 5칸의 칼럼 폭은 원본의 절대 폭(1200/800/563 …)을 옮기지 않고 6등분
 * 그리드로 뒀다. 원본 비율은 2880 아트보드 전용이고, 폭을 토큰화하려면 기존
 * spacing 토큰(각각 Button·Header 용도로 등재된 것들)을 용도 밖으로 빌려 써야
 * 한다 — src/tokens/spacing.tokens.css 가 반복해서 경고하는 결합이다. LOCATION
 * 값 칸만 3칸을 차지해 원본의 "왼쪽이 넓고 오른쪽에 화면구분" 배치를 유지한다.
 */

type ScreenSpecDocProps = {
  spec: ScreenSpec
  /**
   * 화면 자체. Figma 시트에서 Description 왼쪽에 놓이는 프레임이고, 이 저장소에서는
   * src/page/ 의 페이지 컴포넌트다. 넘기지 않으면 문서에 표만 남는다.
   */
  screen?: ReactNode
}

/*
 * SpecMarker — 화면 위에 얹는 번호 마커. Figma 의 "num" 프레임
 * (118:7129 · 118:7131 · 118:7133) 에 대응한다.
 *
 * 이 컴포넌트는 자기 위치를 모른다. 붙일 자리는 화면 쪽이 정한다 — page/SignIn 은
 * FormSignIn 의 annotations 슬롯으로 넘기고, 그 슬롯이 대상 블록의 왼쪽 변에
 * 정렬한다. 좌표를 여기 두면 화면마다 달라져 재사용이 깨진다.
 *
 * 토큰 매핑 — 원 지름 실측 40 -> --spacing-40(size-40) · 배경 ea1917 ->
 * --color-brand-primary(bg-brand-primary) · 글자 흰색 -> --color-text-inverse ·
 * 글자 22.4 Regular -> type-subtitle-medium(24/400) · 완전한 원 -> --radius-full.
 * 반경 실측 105.415 는 지름보다 크기만 하면 결과가 같은 값이라 옮기지 않았다.
 */
export function SpecMarker({ children }: { children: ReactNode }) {
  return (
    <span
      /* 주석 번호는 문서 구조가 아니라 그림 위의 표식이라 스크린리더에서 뺀다.
         같은 번호가 Description 표의 첫 칸에 텍스트로 이미 읽힌다. */
      aria-hidden="true"
      className="type-subtitle-medium bg-brand-primary text-text-inverse rounded-full flex size-40 items-center justify-center"
    >
      {children}
    </span>
  )
}

/* 행 사이 구분선은 두 번째 행의 셀들에 윗변으로 긋는다. 그리드에 빈 <div> 를
   하나 끼워 넣는 편이 짧지만, <dl> 은 dt/dd 를 감싸지 않는 div 를 자식으로
   허용하지 않아 마크업이 무효가 된다. */
const DIVIDED = 'border-t-hairline border-border-default'

/** 조건부 클래스를 빈 문자열 없이 잇는다. 문자열이 아닌 것은 버린다. */
function cx(...parts: unknown[]) {
  return parts.filter((p): p is string => typeof p === 'string' && p !== '').join(' ')
}

function InfoLabel({
  children,
  divided = false,
}: {
  children: string
  divided?: boolean
}) {
  return (
    <dt
      className={cx(
        'type-body-default-strong text-text-primary px-8 py-12',
        divided && DIVIDED,
      )}
    >
      {children}
    </dt>
  )
}

function InfoValue({
  children,
  wide = false,
  divided = false,
}: {
  children: string
  wide?: boolean
  divided?: boolean
}) {
  return (
    <dd
      className={cx(
        'type-body-default text-text-tertiary px-8 py-12',
        wide && 'col-span-3',
        divided && DIVIDED,
      )}
    >
      {children}
    </dd>
  )
}

/*
 * font-text 는 이 문서의 기본 패밀리다. Figma 가 font-family/sans 를
 * font-family/headline · font-family/text 로 쪼개면서 --font-sans 가 사라졌고,
 * 이 자리에 있던 font-sans 는 토큰이 아니라 Tailwind 기본 sans 스택으로 조용히
 * 폴백하게 됐다(에러 없이). 본문 문서이므로 title/* 4개만 바인딩하는 headline 이
 * 아니라 text 쪽이다.
 */
export function ScreenSpecDoc({ spec, screen }: ScreenSpecDocProps) {
  return (
    <article className="bg-bg-default font-text">
      {/* 상단 5칸 — Figma "location" 프레임 (118:7175) */}
      <dl className="border-b-hairline border-border-focus grid grid-cols-6">
        <InfoLabel>화면</InfoLabel>
        <InfoValue>{spec.screen}</InfoValue>
        <InfoLabel>화면 ID</InfoLabel>
        <InfoValue>{spec.screenId}</InfoValue>
        <InfoLabel>화면타입</InfoLabel>
        <InfoValue>{spec.screenType}</InfoValue>

        <InfoLabel divided>LOCATION</InfoLabel>
        <InfoValue wide divided>
          {spec.location}
        </InfoValue>
        <InfoLabel divided>화면구분</InfoLabel>
        <InfoValue divided>{spec.screenKind}</InfoValue>
      </dl>

      {/*
        Figma 시트는 화면(왼쪽 1920)과 Description(오른쪽 600)을 가로로 나란히
        둔다. 그 폭들은 2880 아트보드 전용이라 옮기지 않고 2:1 비율로 뒀다.
        좁은 화면에서는 세로로 쌓는다 — 시트의 가로 배치는 아트보드가 넓어서
        가능한 것이고, 문서 페이지 폭에서 그대로 하면 양쪽 다 읽히지 않는다.
      */}
      <div className="mt-32 flex flex-col items-start gap-32 lg:flex-row">
        {screen && (
          /* 화면 슬롯. 페이지 컴포넌트는 자기 폭을 채우므로 여기서 크기를 정하지
             않는다 — 열 폭이 곧 화면 폭이다. */
          <div className="w-full min-w-0 lg:basis-2/3">{screen}</div>
        )}

        {/* Description 표 — Figma "Description" 프레임 (118:7135) */}
        <section
          className={cx(
            'flex w-full min-w-0 flex-col gap-12',
            screen && 'lg:basis-1/3',
          )}
        >
          <h2 className="type-subtitle-medium-strong text-text-primary">
            Description
          </h2>

          <div className="border-t-hairline border-border-focus">
            {spec.sections.map((section) => (
              <div
                key={section.no}
                className="border-b-hairline border-border-default flex items-stretch"
              >
                <div className="border-r-hairline border-border-default bg-bg-light type-body-default text-text-primary flex w-64 shrink-0 items-center px-8 py-12">
                  {section.no}
                </div>

                <div className="flex flex-1 flex-col gap-24 px-8 py-12">
                  <h3 className="type-body-default-strong text-text-primary">
                    {section.area}
                  </h3>

                  {section.groups.map((group) => (
                    <div key={group.title}>
                      <h4 className="type-body-default-strong text-text-primary">
                        {group.title}
                      </h4>
                      {group.items.map((item) => (
                        /* 원본이 이어지는 줄을 앞 공백으로 들여쓰기 때문에
                           whitespace-pre-wrap 으로 공백을 보존한다. */
                        <p
                          key={item}
                          className="type-body-default text-text-tertiary whitespace-pre-wrap"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  ))}

                  {/* 글머리표를 여기서 붙이는 이유는 types.ts 의 components 주석 참고. */}
                  {section.components && section.components.length > 0 && (
                    <div>
                      <h4 className="type-body-default-strong text-text-primary">
                        사용 컴포넌트
                      </h4>
                      <ul>
                        {section.components.map((component) => (
                          <li
                            key={component}
                            className="type-body-default text-text-tertiary"
                          >
                            - {component}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.note && (
                    <div>
                      <h4 className="type-body-default-strong text-text-primary">
                        비고
                      </h4>
                      <p className="type-body-default text-text-tertiary whitespace-pre-wrap">
                        {section.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
