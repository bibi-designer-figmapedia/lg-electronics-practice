import type { HTMLAttributes, ReactNode } from 'react'

/*
 * Footer — 사이트 최하단 링크 모음. 6개 컬럼 × (제목 + 링크 목록).
 *
 * Figma 원본 (산출물 1)
 *   https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15436
 *   variant 축이 없는 단일 symbol 이다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:15436) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                   Figma 변수 / 실측       코드 토큰                   유틸리티
 *   배경                   bg/warm                 --color-bg-warm             bg-bg-warm
 *   위 구분선 색           border/strong           --color-border-strong       border-border-strong
 *   위 구분선 두께         변수 없음, 실측 1       --border-width-hairline     border-t-hairline
 *   컬럼 제목 타이포       nav/menu                (composite)                 type-nav-menu
 *   컬럼 제목 색           text/primary            --color-text-primary        text-text-primary
 *   링크 타이포            body/default            (composite)                 type-body-default
 *   링크 색                text/secondary          --color-text-secondary      text-text-secondary
 *   링크 사이 간격         spacing/8               --spacing-8                 pt-8
 *   제목↔목록 간격         spacing/16              --spacing-16                pt-16
 *   컬럼 간격 · 섹션 간격  spacing/24              --spacing-24                gap-24 · pt-24
 *   상하 padding           spacing/40              --spacing-40                py-40
 *   밴드 좌우 거터         layout/gutter 24        --spacing-gutter            px-gutter
 *   콘텐츠 폭 상한         변수 없음, 실측 1440    --container-container       max-w-container
 *   (좌우 인셋 240 은 위 둘의 조합에서 나온다 — 아래 "인셋을 패딩으로 쓰지 않는 이유")
 *
 *   새로 만든 토큰 없음.
 *
 * 위 구분선이 있다는 근거
 *   get_variable_defs 는 border/strong 을 돌려주는데 하위 트리 어디에도 선이 없다. 렌더된
 *   원본의 픽셀을 직접 읽어 확인했다: 맨 윗줄이 border/strong 값이고 그 아래부터 bg/warm 이다.
 *   아래쪽에는 선이 없다. 프레임 높이 403 = 1(선) + 40 + 322(목록) + 40 도 이와 맞는다.
 *
 * 컬럼 폭 220 에 토큰이 필요 없는 이유
 *   Figma 는 폭 1488 짜리 List 에 좌우 padding 24 와 컬럼 간격 24 를 주고, 그 List 를 1920
 *   안에서 가운데 정렬해 x=216 에 둔다. 결과적으로 첫 컬럼이 240 에서 시작하고 마지막 컬럼이
 *   1680 에서 끝난다 — 즉 콘텐츠가 차지하는 범위는 정확히 layout/viewport-inset 안쪽이다.
 *   그래서 px-gutter + max-w-container + gap-24 + 컬럼 flex-1 로 옮겼다. 안쪽 폭 1440 에서 간격 5개를
 *   빼고 6등분하면 220 이 그대로 나온다. 1488 · 216 · 220 에 토큰을 만들 필요가 없다.
 *
 * Figma 렌더와 다른 점 — 승인된 편차다. 버그로 보고 되돌리지 말 것.
 *   1. 링크 행 피치. 코드는 링크마다 pt-8 에 body/default 의 줄높이(--leading-20)라 행
 *      간격이 28 이고, Figma 렌더는 26 이다.
 *      원인은 원본의 저작 아티팩트다: List Item 프레임이 고정 높이 26 인데 그 안의 텍스트는
 *      y=8 에 높이 20 으로 놓여 프레임을 2 만큼 넘친다. 클리핑되지 않고, 부모는 넘친 텍스트가
 *      아니라 프레임 높이 26 을 기준으로 쌓는다. 그래서 렌더 결과가 프레임이 선언한 값보다
 *      촘촘하다 — "spacing/8 을 따랐더니 어쩔 수 없이 벌어졌다" 가 아니라 원본 프레임 높이가
 *      자기 콘텐츠와 어긋나게 저작돼 있는 것이다.
 *      코드는 Figma 가 실제로 바인딩한 spacing/8 과 body/default 를 그대로 따른다. 그 결과
 *      가장 긴 컬럼에서 12, 전체 높이에서 18 만큼(421 대 403) 커진다. 실측값이다.
 *      맞추려면 어느 Figma 변수에도 대응하지 않는 26 스텝을 새로 만들어 바인딩된 변수를
 *      버려야 한다. 사용자가 현재 구현(28)을 유지하기로 확정했다. pt-8 을 줄이지 말 것.
 *   2. List 프레임의 고정 높이 322 를 적용하지 않는다. 1번과 같은 아티팩트의 다른 얼굴이다 —
 *      프레임 높이가 자기 콘텐츠보다 작게 저작돼 있어 그대로 옮기면 모순까지 옮긴다.
 *      자연 높이로 둔다(요청자 확정).
 *   3. 텍스트에 whitespace-nowrap 을 붙이지 않는다. 원본 export 에는 붙어 있지만 1920 폭에서
 *      가장 긴 링크도 컬럼 220 안에 들어가므로 렌더 결과가 같고, 더 좁은 폭에서 컬럼 밖으로
 *      흘러나가는 것만 막는다. HeaderNotification 이 같은 이유로 내린 판단이다.
 *
 * 구조를 컴포넌트로 쪼개지 않은 이유
 *   Figma 의 최상위 자식 프레임 이름이 Navigation(19649:33301)인데 저장소에는 이미 헤더의
 *   Navigation(src/components/header/Navigation.tsx)이 있다. 같은 이름의 파일을 하나 더
 *   만들면 두 Navigation 이 서로 다른 것을 가리킨다. 이 프레임은 padding 을 얹는 것 외에
 *   하는 일이 없으므로 별도 파일로 쪼개지 않고 <footer> 안의 <nav> 마크업으로 둔다
 *   (요청자 확정).
 *
 * 확정된 구현 판단
 *   - 내용은 columns prop 으로 받는다. Figma 의 6컬럼은 story 기본값에 있다(CategoryMenu 선례).
 *   - 컬럼 제목은 Figma 에서 링크가 아니라 순수 텍스트 노드다. 링크로 만들지 않았다.
 *     대신 목록의 이름 역할을 하므로 <h2> 로 낸다 — 시각 표현은 type-nav-menu 가 정하고
 *     브라우저 기본 크기·여백은 Tailwind preflight 가 이미 지운다.
 *   - 링크 하나(Our Brand)만 원본에 "opens in a new window" 래퍼가 있다. 그 하나에만
 *     external 을 세워 target/rel 과 스크린리더용 안내 문구를 붙인다(요청자 확정).
 *   - 포커스 표시는 Tab · HeaderNotification 과 같은 조합이다. Figma 에 focus variant 가
 *     없으므로 새 시각 표현을 발명하지 않고 이미 있는 토큰 2개만 조합했다.
 *   - 내부 state 가 없다. Figma 에 없는 variant · 옵션(접기 · 반응형 컬럼 수)은 만들지 않았다.
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

export interface FooterLink {
  /** 링크 문구. */
  label: ReactNode
  /** 링크 목적지. */
  href: string
  /** 새 창으로 여는 링크인지. Figma 에서 이 표시가 붙은 링크는 Our Brand 하나뿐이다. */
  external?: boolean
}

export interface FooterSection {
  /** 컬럼 안의 소제목. Figma 의 "Container" 안 텍스트 노드에 대응한다. */
  heading: ReactNode
  /** 소제목 아래 링크들. Figma 의 LG Subscribe 처럼 링크가 없는 섹션도 있다. */
  links: FooterLink[]
}

/** 컬럼 1개 = 섹션 여러 개. Monitor/PC 와 Support 컬럼만 섹션이 2개 이상이다. */
export type FooterColumn = FooterSection[]

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** 컬럼 목록. Figma 배치 순서대로 넘긴다. */
  columns: FooterColumn[]
}

/** 새 창 링크에만 붙는 안내. 화면에는 보이지 않고 스크린리더에서만 읽힌다. */
const NEW_WINDOW_HINT = ' (opens in a new window)'

/* 포커스 표시: Tab · HeaderNotification 과 같은 문자열이다(위 "확정된 구현 판단" 참고). */
const FOCUS_CLASSES =
  'focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus'

/** Figma "Footer" 의 코드 정본. */
export function Footer({ columns, className = '', ...props }: FooterProps) {
  return (
    <footer
      className={`w-full border-t-hairline border-border-strong bg-bg-warm px-gutter py-40 ${className}`}
      {...props}
    >
      {/* 19649:33301 Navigation + 19649:33302 Container:margin + 19649:33303 List —
          세 프레임이 하는 일은 인셋과 컬럼 간격뿐이라 한 겹으로 합쳤다(위 참고). */}
      <nav aria-label="Footer" className="mx-auto flex w-full max-w-container gap-24">
        {columns.map((sections, columnIndex) => (
          /* 컬럼도 섹션도 제목이 ReactNode 라 문자열 key 를 만들 수 없다. 순서가 곧
             정체성인 정적 목록이므로 인덱스를 쓴다(CategoryMenu · FuntionalTab 선례). */
          <div key={columnIndex} className="flex flex-1 flex-col items-start">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                /* 첫 섹션만 위 여백이 없다 — Figma 도 두 번째 Container 부터 pt 를 준다. */
                className={`flex w-full flex-col items-start ${sectionIndex > 0 ? 'pt-24' : ''}`}
              >
                <h2 className="type-nav-menu text-text-primary">{section.heading}</h2>

                {section.links.length > 0 && (
                  <ul className="flex w-full flex-col items-start pt-16">
                    {section.links.map((link, linkIndex) => (
                      <li
                        key={linkIndex}
                        /* 첫 링크의 위 여백은 목록의 pt-16 이 이미 만든다. */
                        className={`flex w-full flex-col items-start ${linkIndex > 0 ? 'pt-8' : ''}`}
                      >
                        <a
                          href={link.href}
                          className={`type-body-default text-text-secondary ${FOCUS_CLASSES}`}
                          {...(link.external
                            ? { target: '_blank', rel: 'noreferrer' }
                            : {})}
                        >
                          {link.label}
                          {link.external && <span className="sr-only">{NEW_WINDOW_HINT}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </footer>
  )
}
