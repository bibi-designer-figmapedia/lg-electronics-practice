import type { HTMLAttributes, ReactNode } from 'react'
import type { CategoryMenuItem } from './CategoryMenu'
import { HeaderGNB, type HeaderGNBProps } from './HeaderGNB'
import { HeaderNotification, type HeaderNotificationProps } from './HeaderNotification'

/*
 * Navigation — Figma "Navigation" 의 구현체. header 섹션의 마지막 조각이고, 앞서 만든
 * 두 바를 세로로 쌓는 조합 레이어다.
 *
 * Figma 원본 (산출물 1)
 *   component: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3947
 *
 *   내부 노드 (get_metadata 로 읽음)
 *     19661:4209  Header/Notification   y 0,  높이 60
 *     19661:4225  Header/GNB            y 60, 높이 80
 *   두 인스턴스가 전부다. 자체 지오메트리가 없다 — get_design_context 가 내준 이 노드의 루트는
 *   세로 auto-layout(배경 · padding · 간격 없음)뿐이고, 프레임 높이 140 은 60 + 80 의 결과다.
 *
 * 토큰 매핑 (산출물 2) — 이 파일이 직접 소비하는 토큰은 하나도 없다.
 *
 *   get_variable_defs(19661:3947) 는 변수 19개를 내주는데, 그 집합은 이미 구현된 두 자식의
 *   변수 집합의 합집합과 정확히 같다. 즉 이 노드가 새로 들이는 변수가 없다.
 *     Notification 쪽   surface/inverse · text/inverse · icon/white · spacing/20 · spacing/24 ·
 *                       font-size/16 · font-family/sans · font-weight/regular
 *     GNB 쪽            bg/warm · border/strong · text/primary · nav/menu · font-size/20 ·
 *                       brand/primary · brand/logo · brand/logo-inverse · brand/secondary ·
 *                       icon/default · spacing/8 · spacing/40
 *   전부 HeaderNotification.tsx · HeaderGNB.tsx(그리고 그 자식들)의 매핑표에 이미 있고, 그
 *   컴포넌트들이 소비한다. 여기서 다시 지정하면 같은 값이 두 곳에 살아 불일치의 출처가 된다.
 *   이 파일이 쓰는 클래스는 배치용(세로 flex · 폭 채움)뿐이라 시각 값이 없다.
 *   새 토큰은 만들지 않았고 src/tokens/ 는 이 작업에서 읽기만 했다.
 *
 * 높이 140 을 고정 유틸리티로 걸지 않은 이유
 *   140 은 Figma 가 authoring 한 값이 아니라 자식 두 개의 합이다(60 + 80). 게다가 spacing
 *   스케일에 140 스텝이 없어서 `h-140` 은 Tailwind 내장 스케일에서 140 의 0.25 배로 조용히
 *   해석된다 — 레이어 3 hook 은 hex · 색상 함수 · raw 단위 · 대괄호 임의값만 보므로 잡지
 *   못한다. HeaderNotification 이 높이 60 을 padding 파생으로 둔 것과 같은 판단이다.
 *
 * 폭 1920 을 루트에 걸지 않은 이유
 *   두 자식이 각자 `w-full max-w-viewport`(= --container-viewport)로 이미 1920 에서 멈춘다.
 *   루트에 같은 상한을 한 번 더 걸어도 렌더 결과가 달라지지 않고(배경이 없어 루트 상자는
 *   보이지 않는다) 같은 값이 세 곳에 생긴다. 그래서 루트는 폭을 채우기만 한다.
 *
 * 두 인스턴스의 override — get_design_context(19661:3947) 로 확인한 것
 *   1. Header/GNB(19661:4225) 는 variant='default' 다. 추정이 아니라 네 가지가 동시에
 *      일치한 결과다: (a) 루트가 고정 높이 80 이다, (b) 루트에 border/strong 아래쪽 선이
 *      있다 — secondary 루트에는 border 관련 클래스가 아예 없다, (c) 안에 GNBContent(폭
 *      1440)가 있고 CategoryMenu + RightMenu 를 담는다 — secondary 는 "Link" 프레임에
 *      로고만 담는다, (d) 로고 높이가 44 다(secondary 는 38). 로고 가로 중심이 142 이고
 *      너비가 100 이라 왼쪽 끝이 92 인 것도 Default 실측과 같다.
 *   2. 그 안의 CategoryMenu 인스턴스는 높이 38 · 탭 6개 · 탭 래퍼 프레임 없음으로
 *      layout='leftMenu' 다(HeaderGNB 가 Default 원본에서 확인한 것과 같은 대조).
 *   3. 텍스트 override 는 없다. 알림 문구도 카테고리 라벨 6개(Shop · TV/Audio/Video ·
 *      Appliances · Air Solution · Computer Products · Support, Shop 만 active)도 각
 *      원본 컴포넌트의 기본값과 문자 단위로 같다. 이 인스턴스들이 원본 문구를 덮어쓰지
 *      않았다는 뜻이다. 그래서 story 의 args 도 두 형제 story 에 이미 있는 값을 그대로
 *      재사용하고 새로 지어내지 않았다.
 *   4. 색 · 간격 · 아이콘 override 도 없다. 두 인스턴스가 내준 클래스는 각 원본 컴포넌트를
 *      단독으로 읽었을 때와 동일하다.
 *
 * 재사용 (원칙 2) — 이 파일이 새로 만든 마크업은 div 한 겹뿐이다
 *   위쪽 바   HeaderNotification (이미 구현됨)
 *   아래쪽 바 HeaderGNB (variant='default', 이미 구현됨)
 *   아이콘 · 로고 · 탭 · 텍스트는 하나도 복제하지 않았다. HeaderNotification.tsx 는 지금까지
 *   읽기만 했고, HeaderGNB.tsx 는 아래 "동작 위임 경로" 에서 통과용 prop 하나를 받은 것이
 *   전부다 — 양쪽 다 시각 표현과 마크업은 그대로다.
 *
 * 시맨틱 — 루트가 header 가 아니라 div 인 이유 (a11y)
 *   HeaderGNB 가 이미 자기 루트를 header 로 렌더한다. 여기서 또 header 를 쓰면 header 가
 *   중첩되고, 중첩된 안쪽 header 도 banner 랜드마크로 노출돼 한 페이지에 banner 가 둘이
 *   된다 — 스크린리더 사용자에게는 "머리말"이 두 개로 보이는 상태이고, 어느 쪽이 진짜인지
 *   구분할 방법이 없다. 그래서 이 루트는 랜드마크를 만들지 않는 배치용 div 로 두고,
 *   banner 는 HeaderGNB 의 header 하나만 갖는다. 네비게이션 랜드마크는 그보다 더 안쪽에서
 *   CategoryMenu 가 nav 로 이미 갖고 있다.
 *
 *   대안(이 루트를 header 로 올리고 HeaderGNB 를 div 로 내리는 쪽)은 시맨틱상 더 자연스럽지만
 *   HeaderGNB.tsx 를 고쳐야 하고, 그 파일은 이 작업의 범위 밖이다(원칙 3). HeaderGNB 를
 *   단독으로 쓰는 호출부에서 banner 가 사라지는 부작용도 생긴다.
 *
 * 프레젠테이셔널 컴포넌트다
 *   내부 state 가 없다. 알림 바의 열림/닫힘도, 어떤 카테고리가 현재 페이지인지도 호출부가
 *   정한다. Figma 에 없는 variant · 옵션은 만들지 않았다.
 */

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  /**
   * 위쪽 알림 바에 표시할 메시지. HeaderNotification 의 `children` 으로 그대로 넘어간다.
   *
   * 선택이 아니라 필수인 이유: HeaderNotification 이 `children` 을 필수로 받는다. 여기서만
   * 선택으로 풀면 빠뜨렸을 때 타입은 통과하지만 빈 알림 바가 조용히 렌더된다. HeaderGNB 가
   * `items` 를 필수로 둔 것과 같은 판단이다.
   */
  notification: ReactNode
  /** HeaderGNB -> CategoryMenu 로 그대로 넘어가는 카테고리 목록. Figma 배치 순서대로 넘긴다. */
  items: CategoryMenuItem[]
  /**
   * 위쪽 알림 바 버튼 3개의 동작. HeaderNotification 에 그대로 넘어간다.
   *
   * 이름이 `notification` 이 아닌 이유는 아래 "이름을 notificationHandlers 로 지은 이유" 참고.
   */
  notificationHandlers?: Pick<HeaderNotificationProps, 'onPrev' | 'onNext' | 'onClose'>
  /**
   * 아래쪽 바 오른쪽 묶음 버튼 4개의 동작. HeaderGNB 를 거쳐 RightMenu 로 그대로 넘어간다.
   *
   * 타입을 여기서 다시 쓰지 않고 HeaderGNBProps 에서 그대로 가져오는 이유: 이 값의 목적지는
   * 결국 RightMenu 이고, 중간 단계마다 Pick 을 새로 적으면 자식이 핸들러를 하나 늘렸을 때
   * 세 파일의 목록이 조용히 갈라진다. 한 곳(RightMenuProps)만 정본으로 둔다.
   */
  rightMenu?: HeaderGNBProps['rightMenu']
}

/*
 * 동작 위임 경로 — 왜 지금 통과시키는가 (design-reviewer a11y FAIL 대응)
 *   이전 판단은 "핸들러를 통과시키지 않는다, 조작이 필요한 호출부는 두 컴포넌트를 직접 조합하면
 *   된다" 였다. 그 판단을 뒤집는다. 이 컴포넌트를 쓰면 초점 가능한 버튼 7개(알림 바 3 +
 *   RightMenu 4)가 전부 무동작이 되는데, 키보드로 도달은 되면서 아무 일도 일어나지 않는 조작
 *   대상은 조작 가능하다는 거짓 신호다. 확정 범위인 "내부 state 없음, 동작은 호출부 위임" 은
 *   위임할 자리가 있을 때만 위임이고, 자리가 없으면 유실이다. "필요하면 직접 조합하라" 는
 *   이 조합 컴포넌트를 쓰는 호출부에게는 이 컴포넌트를 쓰지 말라는 말과 같다.
 *
 *   방식은 HeaderGNB 와 동일하게 그룹 prop 이다.
 *     (a) 개별 prop 평면 전달 — onPrev · onNext · onClose · onBusiness · onSearch · onGuest ·
 *         onBag 7개를 최상위에 평평하게 올린다. NavigationProps 가 2개에서 9개로 늘고, 그중
 *         어느 것이 알림 바 것이고 어느 것이 RightMenu 것인지는 이름만으로 구분되지 않는다.
 *         자식이 핸들러를 하나 늘리면 중간 단계마다 선언이 하나씩 더 늘어난다.
 *     (b) 그룹 prop — 자식별로 하나씩 받아 그대로 넘긴다. 늘어나는 API 표면이 2개이고,
 *         타입은 자식에서 가져오므로 시그니처가 이 파일에 복제되지 않는다.
 *   (b) 를 택했다. 대신 호출부는 한 겹 중첩해 적어야 한다.
 *
 *   두 그룹 다 선택이고 기본값이 없다. 주지 않으면 지금까지와 완전히 같다 — 버튼은 그대로
 *   렌더되고 아무 것도 하지 않는다. 시각 표현 · 마크업 · 랜드마크 구조는 하나도 바뀌지 않았고,
 *   Figma 에 없는 variant · 옵션도 추가하지 않았다.
 *   (`...props` 는 루트 div 에만 닿으므로 그 경로로는 버튼에 전달되지 않는다. 그래서 이
 *   prop 들이 필요하다.)
 *
 * 이름을 notificationHandlers 로 지은 이유
 *   HeaderGNB 쪽은 자식 이름을 그대로 딴 `rightMenu` 로 충분한데, 알림 바 쪽은 그 자리가 이미
 *   차 있다 — `notification` 은 바에 표시할 **문구** 를 받는 기존 prop 이다. 같은 이름을 쓸 수
 *   없고, 기존 prop 을 개명하면 이 변경과 무관한 호출부까지 깨진다. 그래서 새 prop 쪽에 접미사를
 *   붙였다.
 *   `notificationActions` 를 쓰지 않은 것은 의도적이다. Figma 에 NotificationActions
 *   (19661:4207)라는 프레임이 실제로 있는데 그 안에는 다음 · 닫기 2개뿐이고 이전 버튼은 밖에
 *   있다. 그 이름을 3개짜리 묶음에 붙이면 Figma 이름과 코드 이름이 서로 다른 집합을 가리킨다.
 *   `Handlers` 는 Figma 에 없는 단어라 그런 오독이 생기지 않는다.
 */

/** Figma "Navigation"(19661:3947) 의 코드 정본. */
export function Navigation({
  notification,
  items,
  notificationHandlers,
  rightMenu,
  className = '',
  ...props
}: NavigationProps) {
  return (
    <div className={`flex w-full flex-col ${className}`} {...props}>
      {/* 19661:4209 Header/Notification — 시각 override 는 없다. 넘기는 것은 동작뿐이다. */}
      <HeaderNotification {...notificationHandlers}>{notification}</HeaderNotification>
      {/* 19661:4225 Header/GNB — variant='default' (위 확인 근거 1 참고) */}
      <HeaderGNB variant="default" items={items} rightMenu={rightMenu} />
    </div>
  )
}
