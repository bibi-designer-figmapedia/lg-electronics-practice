import type { HTMLAttributes } from 'react'
import { IconBenefit, type IconBenefitType } from '../icons/IconBenefit'
import type { BenefitIconName } from '../icons/IconBenefit.names'

/*
 * BenefitRow — Figma "BenefitRow" component set 의 구현체.
 * 혜택 아이콘 타일 + 2줄 라벨 쌍이 가로로 늘어선 한 줄이다. 상태도 상호작용도 없다.
 *
 * Figma 원본 (산출물 1)
 *   component set: https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-50
 *   부모 section "Pmax banner template": https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32050
 *
 *   tone=white (default)  node-id=1-51    항목 1:52 / 1:163 / 1:274, 라벨 1:162 / 1:273 / 1:384
 *   tone=black            node-id=1-385   항목 1:386 / 1:497 / 1:608, 라벨 1:496 / 1:607 / 1:718
 *
 *   두 variant 를 get_metadata · get_screenshot · get_design_context ·
 *   get_variable_defs 로 각각 읽었다. 추정한 값은 아래 "변수 없음, 실측" 로 표시한
 *   행뿐이고, 그 행들도 값 자체는 Figma 에서 잰 것이다 (원칙 1).
 *
 * 토큰 매핑 (산출물 2)
 *   Figma 변수는 get_variable_defs(1:50 · 1:51 · 1:385) 로 읽었다. 값은 여기 적지
 *   않는다(레이어 3 hook 대상) — 값은 src/tokens/ 를 볼 것. "변수 없음, 실측" 은
 *   해당 속성에 Figma 변수 바인딩이 아예 없다는 뜻이고, 옆 칸의 수는 잰 값이다.
 *
 *   용도                     Figma 변수 / 실측        코드 토큰                     유틸리티
 *   항목 사이 간격           변수 없음, 실측 24        --spacing-24                  gap-24
 *   아이콘 타일 크기         변수 없음, 실측 82        --spacing-82                  size-82
 *   아이콘 ↔ 라벨 간격       변수 없음, 실측 13.667    --spacing-benefit-label       gap-benefit-label   ← 신규 요청
 *   white 아이콘 배경        icon/white               --color-icon-white            (IconBenefit solidWhite)
 *   white 아이콘 글리프      icon/default             --color-icon-default          (IconBenefit solidWhite)
 *   black 아이콘 배경        icon/default             --color-icon-default          (IconBenefit solidBlack)
 *   black 아이콘 글리프      icon/white               --color-icon-white            (IconBenefit solidBlack)
 *   white 라벨 타이포        nav/menu (스타일 바인딩)  type-nav-menu                 type-nav-menu
 *   white 라벨 색            text/inverse             --color-text-inverse          text-text-inverse
 *   black 라벨 타이포        스타일 없음, 실측         type-benefit-label            type-benefit-label  ← 신규 요청
 *   black 라벨 색            text/primary             --color-text-primary          text-text-primary
 *
 *   신규 토큰 2건은 src/tokens/ 가 token-guardian 의 배타 범위라 여기서 만들지 않았다.
 *   등재되기 전까지 gap-benefit-label · type-benefit-label 은 CSS 가 생성되지 않아
 *   각각 간격 0 · 라벨 기본 타이포로 렌더된다. 숨기지 않고 적는다 (원칙 4).
 *
 *     --spacing-benefit-label   13.667 (= 41/3). 아이콘 타일과 라벨 사이 간격이고
 *                               두 variant 가 같다. 숫자 이름을 쓰지 않은 이유는
 *                               src/tokens/README.md 의 "스케일 위의 값일 때만
 *                               숫자 이름" 규칙 때문이다 — 이 값은 소수라 스텝이
 *                               아니고, Tailwind 가 gap-13.667 을 이름 없는 수로
 *                               계산해 버리는 문제도 그대로 남는다. 참고로
 *                               13.667 = 16 x (82 / 96) 이라 96 프레임 아이콘을
 *                               82 로 줄인 결과처럼 보이지만, 그 원본이 16 이었다는
 *                               증거는 파일에 없으므로 잰 값을 그대로 등재한다.
 *     type-benefit-label        tone=black 라벨. family text / weight semibold /
 *                               size 19 / line-height 114퍼센트 / letter-spacing 0.02em.
 *                               get_variable_defs(1:385) 는 스타일 항목을 내주지 않는다
 *                               — 대응하는 Figma 텍스트 스타일이 없다는 뜻이라
 *                               type-cta-large 와 같은 방식으로 역할 기반 이름을 붙였다.
 *                               패밀리 재편 후 같은 호출을 다시 돌려도 답은 그대로여서
 *                               family 는 Figma 판독이 아닌 코드 결정이고, --font-text
 *                               를 쓴다(근거는 typography.tokens.css 주석).
 *                               함께 필요한 atom 은 --text-19 와 --leading-benefit-label
 *                               이다. 행간은 절대값이 아니라 비율(1.14)로 등재됐다 —
 *                               export 가 크기·자간은 단위와 함께 내면서 행간만 단위
 *                               없는 1.14 로 내고, 19 x 1.14 = 21.66 이라 2줄이 44 가
 *                               되지 않기 때문이다. 라벨 노드 높이 44 는 두 줄을 세로
 *                               중앙 정렬하는 컨테이너 자기 높이이지 라인 박스의 합이
 *                               아니므로, 44 에서 행간을 역산하지 않는다.
 *                               letter-spacing 은 다른 type-* 유틸리티처럼 토큰 없이
 *                               유틸리티 안에 둔다. 실측 0.38 대신 0.02em 으로 적은 것은
 *                               크기가 rem, 행간이 비율이라 자간만 절대값이면 사용자
 *                               글자 크기를 따라오지 않기 때문이다 (0.38 은 19 의 정확히
 *                               2퍼센트라 이 크기에서 렌더가 같다). 다만 Figma 가
 *                               2퍼센트로 저술했는지는 확인된 것이 아니라 추론이다 —
 *                               확인된 값은 export 가 낸 실측 0.38 뿐이다.
 *
 * 아이콘 재사용 조사 (원칙 2)
 *   새로 그리지 않았다. Figma 인스턴스 3개가 참조하는 것이 이미 코드에 있는
 *   Icon/Benefit component set(node-id=19620-23774 / src/components/icons/IconBenefit.tsx)이다.
 *     - 이름: freeDelivery · freeDisposal · freeInstallation 3개가 IconBenefit.names.ts 에
 *       그대로 있다.
 *     - Type: 타일 배경 + 글리프 2겹 구조이므로 Line 계열이 아니라 Solid 계열이다.
 *       tone=white 는 흰 타일 + 검정 글리프 = solidWhite, tone=black 은 검정 타일 +
 *       흰 글리프 = solidBlack 이다 (get_screenshot 으로 확인).
 *     - 노드 대조: tone=black 의 Union 자식 노드는 19620:23984 / 19620:24011 /
 *       19620:24002 이고, IconBenefit.solidPaths.ts 가 기록한 Solid black variant 노드는
 *       19620:23982(Free Delivery) / 19620:24009(Free Disposal) / 19620:24000(Free
 *       Installation) 이다. 세 쌍 모두 +2 로 어긋나는데, 이는 variant 프레임 노드와
 *       그 안의 Union 자식 노드의 차이이고 오프셋이 3건 모두 같다 — 같은 3개
 *       아이콘이라는 근거다.
 *   IconPLP · IconUI 는 후보가 아니다. 두 세트에는 배송/수거/설치 혜택 아이콘이 없고
 *   (IconUI 는 화살표·체크 같은 UI 글리프, IconPLP 는 제품 카테고리), 무엇보다 Figma
 *   인스턴스가 참조하는 세트가 Icon/Benefit 이라 다른 세트를 쓰면 원본과 어긋난다.
 *
 * 확정된 구현 판단 5가지
 *   - 폭을 박지 않는다. Figma 의 597(white) · 604(black) 은 고정 폭이 아니라 hug 결과다
 *     (172.667 + 24 + 175.667 + 24 + 200.667 = 597 로 정확히 맞는다). 대응하는 Figma
 *     변수도 없으므로 PDPItemImage 가 세운 규칙 — "고정 폭에 대응하는 변수가 없으면
 *     폭은 호출부가 정한다" — 를 그대로 따른다. 컨테이너는 부모 폭을 채우고 Figma 의
 *     justify-center 로 항목을 가운데 모은다. 폭이 다른 문맥에서도 같은 배치가 된다.
 *   - 항목 구성은 내용이지 시각 정의가 아니다. Figma 는 3개 항목과 그 라벨을 프레임에
 *     그려 두었지만 이는 배너 문구이지 컴포넌트의 시각 규칙이 아니다. 그래서 items 를
 *     prop 으로 받고, 기본값을 Figma 원본 3개(BENEFIT_ROW_FIGMA_ITEMS)로 둔다 —
 *     아무것도 넘기지 않으면 Figma 인스턴스와 같은 렌더가 나온다.
 *   - 라벨 줄바꿈은 원본 문자열의 개행 그대로다. Figma 텍스트 노드 하나가 "Free" 와
 *     "Delivery" 두 줄을 담고 있어 개행 문자를 그대로 두고 whitespace-pre-line 으로
 *     옮겼다. 두 줄로 쪼갠 prop 을 새로 만들지 않았다 (원칙 2).
 *   - 아이콘 크기는 래퍼가 정한다. IconBenefit 이 size-96 을 직접 들고 있어 size-82 를
 *     넘기면 빌드 CSS 순서상 size-96 이 이긴다 — ButtonText 가 IconUI 에서 겪고 기록한
 *     것과 같은 문제다. 그래서 래퍼가 size-82 를 들고 IconBenefit 에는 size-full 을
 *     넘긴다.
 *   - 아이콘은 aria-hidden 이다. 바로 옆 라벨이 같은 뜻("Free Delivery")을 글로 말하고
 *     있어 IconBenefit 자신의 aria-label 을 그대로 두면 스크린리더가 두 번 읽는다.
 *     FuntionalTabItem 이 같은 이유로 내린 판단과 동일하다.
 *
 * 그대로 옮기지 않은 것 2가지 (숨기지 않고 적는다)
 *   - 아이콘 프레임의 overflow-clip. Figma export 가 붙여 주지만 IconBenefit 의 아트워크는
 *     viewBox 안에 들어 있어 잘라낼 것이 없다. 효과 없는 클래스를 늘리지 않았다.
 *   - tone 두 variant 의 라벨 타이포가 서로 다르다(white 는 nav/menu 20-regular,
 *     black 은 스타일 없는 19-semibold + letter-spacing). 코드에서 하나로 통일하지 않고
 *     Figma 원본대로 갈라 두었다. 디자인 쪽 불일치로 보이지만 임의로 고칠 근거가 없다 —
 *     디자이너에게 가져갈 신호다.
 */

/** Figma 의 tone 축. Figma 세트의 첫 variant 가 tone=white(1:51)이라 기본값은 white 다. */
export type BenefitRowTone = 'white' | 'black'

export interface BenefitRowItem {
  /** Icon/Benefit 세트의 variant 이름. Figma 인스턴스가 참조하는 것과 같은 세트다. */
  icon: BenefitIconName
  /** 라벨 문구. Figma 텍스트 노드의 개행을 그대로 담는다 (예: 'Free\nDelivery'). */
  label: string
}

/**
 * Figma 인스턴스에 그려져 있는 3개 항목 그대로. items 를 넘기지 않으면 이것이 쓰인다.
 * 라벨 문구와 아이콘 이름은 Figma 라벨 노드(1:162 / 1:273 / 1:384)와 Icon/Benefit
 * 인스턴스에서 각각 읽은 값이다.
 */
export const BENEFIT_ROW_FIGMA_ITEMS: readonly BenefitRowItem[] = [
  { icon: 'freeDelivery', label: 'Free\nDelivery' },
  { icon: 'freeDisposal', label: 'Free\nDisposal' },
  { icon: 'freeInstallation', label: 'Free\nInstallation' },
]

export interface BenefitRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma 의 tone 축. 세트의 첫 variant 가 tone=white 이므로 기본값은 white 다. */
  tone?: BenefitRowTone
  /** 표시할 혜택 항목. 기본값은 Figma 원본 3개다. */
  items?: readonly BenefitRowItem[]
  /** 바깥 행에 붙는 클래스. 폭은 여기서 정한다(기본은 부모 폭을 채운다). */
  className?: string
}

/**
 * tone 으로 갈리는 것은 아이콘 Type 과 라벨 타이포·색 3가지뿐이다.
 * 간격·크기·정렬은 두 variant 가 같다.
 */
const TONE_CLASSES: Record<BenefitRowTone, { iconType: IconBenefitType; label: string }> = {
  white: { iconType: 'solidWhite', label: 'type-nav-menu text-text-inverse' },
  black: { iconType: 'solidBlack', label: 'type-benefit-label text-text-primary' },
}

/** Figma "BenefitRow"(1:50) 의 코드 정본. */
export function BenefitRow({
  tone = 'white',
  items = BENEFIT_ROW_FIGMA_ITEMS,
  className = '',
  ...props
}: BenefitRowProps) {
  const tokens = TONE_CLASSES[tone]

  return (
    /* 1:51 / 1:385 — 항목을 가운데로 모으는 행. 폭은 호출부가 정한다. */
    <div className={`flex items-center justify-center gap-24 ${className}`} {...props}>
      {items.map((item) => (
        /* 1:52 등 "Benefit Item" — 아이콘 타일과 2줄 라벨 한 쌍. */
        <div key={item.icon} className="flex shrink-0 items-center gap-benefit-label">
          {/* 크기는 래퍼가 정한다 — 위 "확정된 구현 판단" 4번 참고. */}
          <span className="block size-82 shrink-0">
            <IconBenefit
              name={item.icon}
              type={tokens.iconType}
              className="size-full"
              aria-hidden
            />
          </span>
          {/* 1:162 등 "Label" — 원본 텍스트 노드의 개행을 그대로 유지한다. */}
          <span className={`shrink-0 whitespace-pre-line ${tokens.label}`}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
