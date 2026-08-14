# 디자인 토큰 매핑

Figma 변수 → 코드 토큰 대응표. **이 문서는 사본이 아니라 매핑 기록이다** — 값의 정본은 항상 Figma이고, 코드의 정본은 `src/tokens/`다. 값이 바뀌면 Figma에서 다시 읽어 토큰을 갱신하고 이 표를 고친다.

## 출처

| 항목 | 값 |
| --- | --- |
| Figma 파일 | [LG전자 실습자료 — Figma 강의 실습용 자료](https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/-LG%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%8C%E1%85%A1--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C--Figma-%E1%84%80%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%B4-%E1%84%89%E1%85%B5%E1%86%AF%E1%84%89%E1%85%B3%E1%86%B8%E1%84%8B%E1%85%AD%E1%86%BC-%E1%84%8C%E1%85%A1%E1%84%85%E1%85%AD-?node-id=19561-25592) |
| fileKey | `Ma09rS3GL9ahAGRADSWDj3` |
| nodeId | `19561:25592` |
| 추출 도구 | Figma MCP `get_variable_defs` + `get_metadata` (가이드 프레임의 값 테이블) |
| 최초 추출일 | 2026-08-14 |
| 최근 동기화 | 2026-08-14 — 아래 [변경 이력](#변경-이력) 참고 |

> **`get_variable_defs` 하나로는 부족하다.** 이 도구는 **해당 노드가 실제로 사용하는** 변수만 반환한다. `layout/*` 8개는 가이드 프레임이 이름과 값을 표로 적어 두었을 뿐 어떤 노드의 속성에도 바인딩하지 않았기 때문에 응답에 나오지 않는다. `icon/white`도 이 노드에서 쓰이지 않아 빠진다 — 삭제된 것이 아니다.
>
> 따라서 동기화는 **두 경로를 교차 확인**한다: (a) `get_variable_defs`로 값을, (b) `get_metadata`로 가이드 프레임의 라벨·값 테이블을 읽어 (a)가 놓친 변수를 찾는다. (a)만 보고 "코드에만 있는 토큰"을 삭제하면 안 된다.

## 요약

| 축 | Figma | 매핑됨 | 코드 위치 |
| --- | --- | --- | --- |
| 색상 primitive | 24 | 24 | `src/tokens/colors.tokens.css` (`:root`) |
| 색상 semantic | 51 | 51 | `src/tokens/colors.tokens.css` (`@theme`) |
| 색상 gradient (스타일) | 1 | 1 | `src/tokens/colors.tokens.css` (`--gradient-badge` + `@utility`) |
| 타이포 원자 | 13 | 13 | `src/tokens/typography.tokens.css` (`@theme`) |
| 타이포 텍스트 스타일 | 13 | 13 | `src/tokens/typography.tokens.css` (`@utility`) |
| 스페이싱 | 10 | 10 | `src/tokens/spacing.tokens.css` |
| 레이아웃 | 8 | 8 | `src/tokens/layout.tokens.css` |
| 라디우스 | 6 | 6 | `src/tokens/radius.tokens.css` |
| 그림자 | **0** | — | Figma에 그림자 효과 변수가 없음 |
| **합계** | **126** | **126** | |

## 변환 규칙

1. Figma 변수명의 `/` → `-`. `bg/warm` → `--color-bg-warm`. 그룹 이름을 접두어로 유지하므로 `bg-bg-warm` 같은 중복이 생기지만, Figma 변수와 클래스 이름이 1:1로 대응한다.
2. **primitive → semantic 참조 구조.** semantic 토큰은 hex를 다시 적지 않고 primitive를 `var()`로 참조한다. primitive 값 1곳만 고치면 그것을 쓰는 semantic 전부가 따라온다.
3. **primitive는 `@theme` 밖 `:root`에 둔다.** `@theme`에 넣으면 Tailwind가 `bg-lg-active-red` 유틸리티를 만들어 semantic 레이어를 우회할 수 있다. `:root`에 두면 semantic 정의에서만 참조 가능하다.
4. Figma의 unitless px 값(spacing·radius·font-size·line-height)은 16px 루트 기준 **rem**으로 환산한다. 사용자 브라우저 글자 크기 설정을 따르기 위함.
5. 스케일 스텝(`spacing`·`radius`)은 **Figma의 숫자 이름을 유지**한다. `src/tokens/README.md`의 예외 조항 참고.
6. 텍스트 스타일은 합성 토큰(family+size+weight+line-height)이라 CSS 변수 1개에 담기지 않으므로 **`@utility type-*` 클래스**로 변환한다.

---

## 색상 — primitive (24)

`colors.tokens.css`의 `:root`. **컴포넌트에서 직접 쓰지 않는다** — 유틸리티로 노출되지 않는다.

| Figma 변수 | 코드 토큰 | 값 |
| --- | --- | --- |
| `active-red` | `--lg-active-red` | `#ea1917` |
| `heritage-red` | `--lg-heritage-red` | `#a50034` |
| `bright-red` | `--lg-bright-red` | `#ff3224` |
| `ad-red` | `--lg-ad-red` | `#fd312e` |
| `light-gray-0` | `--lg-light-gray-0` | `#f6f6f6` |
| `light-gray-1` | `--lg-light-gray-1` | `#f6f3eb` |
| `light-gray-2` | `--lg-light-gray-2` | `#f0ece4` |
| `light-gray-3` | `--lg-light-gray-3` | `#e6e1d6` |
| `mid-gray-1` | `--lg-mid-gray-1` | `#cbc8c2` |
| `mid-gray-2` | `--lg-mid-gray-2` | `#646464` |
| `mid-gray-3` | `--lg-mid-gray-3` | `#4a4946` |
| `dark-gray-1` | `--lg-dark-gray-1` | `#333333` |
| `dark-gray-2` | `--lg-dark-gray-2` | `#262626` |
| `dark-gray-3` | `--lg-dark-gray-3` | `#1a1a1a` |
| `toast-gray` | `--lg-toast-gray` | `#303030` |
| `near-black` | `--lg-near-black` | `#141414` |
| `black` | `--lg-black` | `#000000` |
| `white` | `--lg-white` | `#ffffff` |
| `logo-gray` | `--lg-logo-gray` | `#6b6b6b` |
| `green-1` | `--lg-green-1` | `#287d00` |
| `green-2` | `--lg-green-2` | `#316d15` |
| `yellow-1` | `--lg-yellow-1` | `#f7b500` |
| `yellow-2` | `--lg-yellow-2` | `#eeb404` |
| `teal-1` | `--lg-teal-1` | `#006a63` |

**semantic이 참조하지 않는 primitive 4개**: `mid-gray-3` · `dark-gray-2` · `dark-gray-3` · `near-black`. Figma 팔레트에는 있으나 semantic 변수 어디에도 연결되어 있지 않다. 팔레트 완결성을 위해 옮겨두었고, 이 값이 필요해지면 **컴포넌트에서 직접 쓰지 말고 semantic 토큰을 새로 정의해 연결한다.**

`bright-red`는 semantic 변수는 아니지만 아래 [gradient](#색상--gradient-1)의 첫 스톱으로 참조된다. `logo-gray`는 `brand/secondary`가 참조한다.

## 색상 — semantic (51)

`colors.tokens.css`의 `@theme`. 컴포넌트가 쓰는 레이어.

### bg — 페이지 배경 (5)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `bg/default` | `--color-bg-default` | `--lg-white` | `#ffffff` | `bg-bg-default` |
| `bg/warm` | `--color-bg-warm` | `--lg-light-gray-2` | `#f0ece4` | `bg-bg-warm` |
| `bg/subtle` | `--color-bg-subtle` | `--lg-light-gray-1` | `#f6f3eb` | `bg-bg-subtle` |
| `bg/elevated` | `--color-bg-elevated` | `--lg-white` | `#ffffff` | `bg-bg-elevated` |
| `bg/light` | `--color-bg-light` | `--lg-light-gray-0` | `#f6f6f6` | `bg-bg-light` |

### surface — 컴포넌트 면 (5)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `surface/card` | `--color-surface-card` | `--lg-white` | `#ffffff` | `bg-surface-card` |
| `surface/toast-error` | `--color-surface-toast-error` | `--lg-toast-gray` | `#303030` | `bg-surface-toast-error` |
| `surface/toast-warning` | `--color-surface-toast-warning` | `--lg-yellow-2` | `#eeb404` | `bg-surface-toast-warning` |
| `surface/toast-info` | `--color-surface-toast-info` | `--lg-teal-1` | `#006a63` | `bg-surface-toast-info` |
| `surface/inverse` | `--color-surface-inverse` | `--lg-dark-gray-1` | `#333333` | `bg-surface-inverse` |

### text (11)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `text/primary` | `--color-text-primary` | `--lg-black` | `#000000` | `text-text-primary` |
| `text/secondary` | `--color-text-secondary` | `--lg-dark-gray-1` | `#333333` | `text-text-secondary` |
| `text/tertiary` | `--color-text-tertiary` | `--lg-mid-gray-2` | `#646464` | `text-text-tertiary` |
| `text/disabled` | `--color-text-disabled` | `--lg-mid-gray-1` | `#cbc8c2` | `text-text-disabled` |
| `text/inverse` | `--color-text-inverse` | `--lg-white` | `#ffffff` | `text-text-inverse` |
| `text/brand` | `--color-text-brand` | `--lg-active-red` | `#ea1917` | `text-text-brand` |
| `text/disclaimer` | `--color-text-disclaimer` | `--lg-black` | `#000000` | `text-text-disclaimer` |
| `text/disclaimer-inverse` | `--color-text-disclaimer-inverse` | `--lg-white` | `#ffffff` | `text-text-disclaimer-inverse` |
| `text/on-toast-error` | `--color-text-on-toast-error` | `--lg-white` | `#ffffff` | `text-text-on-toast-error` |
| `text/on-toast-warning` | `--color-text-on-toast-warning` | `--lg-black` | `#000000` | `text-text-on-toast-warning` |
| `text/on-toast-info` | `--color-text-on-toast-info` | `--lg-white` | `#ffffff` | `text-text-on-toast-info` |

### border (4)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `border/default` | `--color-border-default` | `--lg-light-gray-3` | `#e6e1d6` | `border-border-default` |
| `border/strong` | `--color-border-strong` | `--lg-mid-gray-1` | `#cbc8c2` | `border-border-strong` |
| `border/focus` | `--color-border-focus` | `--lg-black` | `#000000` | `border-border-focus` |
| `border/inverse` | `--color-border-inverse` | `--lg-white` | `#ffffff` | `border-border-inverse` |

### brand (4)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `brand/primary` | `--color-brand-primary` | `--lg-active-red` | `#ea1917` | `bg-brand-primary` |
| `brand/logo` | `--color-brand-logo` | `--lg-heritage-red` | `#a50034` | `text-brand-logo` |
| `brand/logo-inverse` | `--color-brand-logo-inverse` | `--lg-white` | `#ffffff` | `text-brand-logo-inverse` |
| `brand/secondary` | `--color-brand-secondary` | `--lg-logo-gray` | `#6b6b6b` | `fill-brand-secondary` |

`brand/secondary`는 예전에 코드 전용 토큰 `--color-brand-logo-wordmark`였다. `Logo/LG` 컴포넌트(node `1:23`)의 "LG" 글자 path에 박혀 있던 raw fill을 컴포넌트가 hex 대신 참조할 수 있게 이름 붙인 것이었고, "Figma가 이 색을 변수로 발행하면 그 변수명으로 교체한다"고 이 문서에 예고해 두었다. Figma가 primitive `logo-gray` / semantic `brand/secondary`로 발행했으므로 예고대로 교체했다 — 코드가 발명한 이름은 사라지고 `src/components/LogoLG.tsx`가 `fill-brand-secondary`를 쓴다.

### state (6)

`*-on-warm`은 `--color-bg-warm` 위에서 쓰는 대비 보정 쌍이다. 배경이 warm이면 `-on-warm`을 쓴다.

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `state/success` | `--color-state-success` | `--lg-green-1` | `#287d00` | `text-state-success` |
| `state/success-on-warm` | `--color-state-success-on-warm` | `--lg-green-2` | `#316d15` | `text-state-success-on-warm` |
| `state/warning` | `--color-state-warning` | `--lg-yellow-2` | `#eeb404` | `text-state-warning` |
| `state/error` | `--color-state-error` | `--lg-active-red` | `#ea1917` | `text-state-error` |
| `state/error-on-warm` | `--color-state-error-on-warm` | `--lg-heritage-red` | `#a50034` | `text-state-error-on-warm` |
| `state/info` | `--color-state-info` | `--lg-teal-1` | `#006a63` | `text-state-info` |

### review · icon · flag (7)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `review/star` | `--color-review-star` | `--lg-yellow-1` | `#f7b500` | `fill-review-star` |
| `icon/default` | `--color-icon-default` | `--lg-black` | `#000000` | `text-icon-default` |
| `icon/white` | `--color-icon-white` | `--lg-white` | `#ffffff` | `text-icon-white` |
| `icon/active` | `--color-icon-active` | `--lg-active-red` | `#ea1917` | `text-icon-active` |
| `icon/muted` | `--color-icon-muted` | `--lg-mid-gray-2` | `#646464` | `text-icon-muted` |
| `flag/general` | `--color-flag-general` | `--lg-black` | `#000000` | `bg-flag-general` |
| `flag/promotion` | `--color-flag-promotion` | `--lg-active-red` | `#ea1917` | `bg-flag-promotion` |

### action (7)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `action/primary` | `--color-action-primary` | `--lg-active-red` | `#ea1917` | `bg-action-primary` |
| `action/promo` | `--color-action-promo` | `--lg-ad-red` | `#fd312e` | `bg-action-promo` |
| `action/primary-label` | `--color-action-primary-label` | `--lg-white` | `#ffffff` | `text-action-primary-label` |
| `action/secondary` | `--color-action-secondary` | `--lg-white` | `#ffffff` | `bg-action-secondary` |
| `action/secondary-label` | `--color-action-secondary-label` | `--lg-black` | `#000000` | `text-action-secondary-label` |
| `action/secondary-border` | `--color-action-secondary-border` | `--lg-mid-gray-2` | `#646464` | `border-action-secondary-border` |
| `action/disabled` | `--color-action-disabled` | `--lg-mid-gray-1` | `#cbc8c2` | `bg-action-disabled` |

### shadow — 색상만 (2)

Figma의 `shadow/*`는 **색상 변수**다. offset·blur·spread는 변수로 존재하지 않으므로 그림자 자체는 토큰화할 수 없다. 색상만 옮겼다.

| Figma 변수 | 코드 토큰 | → primitive | 값 |
| --- | --- | --- | --- |
| `shadow/disclaimer` | `--color-shadow-disclaimer` | `--lg-white` | `#ffffff` |
| `shadow/disclaimer-inverse` | `--color-shadow-disclaimer-inverse` | `--lg-black` | `#000000` |

## 색상 — gradient (1)

Figma의 `gradient/badge`는 **변수가 아니라 color style**이다. 그라디언트 스톱에는 변수를 바인딩할 수 없어서, Figma 쪽 값은 raw hex로 적혀 있다. 원본 파일이 그 결과를 직접 경고한다: *"⚠ Primitive 값 변경 시 그라디언트는 자동 반영되지 않으므로 수동 동기화 필요."*

| Figma 스타일 | 코드 토큰 | 스톱 | 유틸리티 |
| --- | --- | --- | --- |
| `gradient/badge` | `--gradient-badge` | `--lg-bright-red` 0% → `--lg-active-red` 50% → `--lg-heritage-red` 100%, 좌→우 | `bg-gradient-badge` |

**코드에는 Figma의 경고가 해당되지 않는다.** 스톱을 hex로 복사하지 않고 primitive를 `var()`로 참조했기 때문에, `--lg-active-red`를 고치면 그라디언트 중간 스톱도 따라 움직인다. Figma 쪽이 수동 동기화를 요구하는 지점이 코드에서는 자동이다.

`--color-*`가 아닌 이유: 그라디언트는 색이 아니라 `background-image`다. `--color-*`에 넣으면 Tailwind가 `text-gradient-badge`·`border-gradient-badge`처럼 성립하지 않는 유틸리티까지 만든다. Tailwind v4에 `--gradient-*` 테마 네임스페이스가 없어 유틸리티가 자동 생성되지 않으므로, 텍스트 스타일과 같은 방식으로 `@utility`로 노출했다.

**추출 경로**: `get_variable_defs`는 이 스타일의 값을 빈 문자열(`""`)로 반환한다. 스톱은 (a) 가이드 프레임의 라벨 텍스트와 (b) `get_design_context`가 그라디언트 노드(`19561:25710`)에서 뽑아낸 CSS, 두 곳에서 일치를 확인해 옮겼다.

---

## 스페이싱 (10)

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `spacing/4` | `--spacing-4` | `4` | `0.25rem` | `p-4` `gap-4` `mt-4` |
| `spacing/8` | `--spacing-8` | `8` | `0.5rem` | `p-8` … |
| `spacing/12` | `--spacing-12` | `12` | `0.75rem` | `p-12` … |
| `spacing/16` | `--spacing-16` | `16` | `1rem` | `p-16` … |
| `spacing/20` | `--spacing-20` | `20` | `1.25rem` | `p-20` … |
| `spacing/24` | `--spacing-24` | `24` | `1.5rem` | `p-24` … |
| `spacing/32` | `--spacing-32` | `32` | `2rem` | `p-32` … |
| `spacing/40` | `--spacing-40` | `40` | `2.5rem` | `p-40` … |
| `spacing/48` | `--spacing-48` | `48` | `3rem` | `p-48` … |
| `spacing/64` | `--spacing-64` | `64` | `4rem` | `p-64` … |

> ### ⚠️ 숫자가 두 가지를 뜻한다 — 두 체계를 섞지 말 것
>
> Tailwind v4에는 내장 배수 스케일이 있어 **이름 없는 스텝**은 `calc(var(--spacing) * n)`으로 계산된다. 즉 같은 `h-<숫자>` 문법이 숫자에 따라 다른 의미가 된다:
>
> | 클래스 | 해석 | 값 |
> | --- | --- | --- |
> | `h-32` | 토큰 `--spacing-32` (스텝 이름) | `2rem` = 32px |
> | `h-10` | 내장 배수 `10 × 0.25rem` | `2.5rem` = 40px |
>
> **토큰에 있는 숫자는 px, 토큰에 없는 숫자는 ×4px다.** 이 추출 작업 중 실제로 이것에 걸렸다: `Button.tsx`의 `h-8`은 Tailwind 기본에서 `2rem`(32px)이었으나 `--spacing-8`(=8px)이 정의되자 조용히 `0.5rem`으로 바뀌었다. 빌드도 타입체크도 hook도 통과한다 — **CSS가 유효하기 때문에 어떤 검증도 잡지 못한다.**
>
> 규칙: **컴포넌트에서는 토큰 스텝(4·8·12·16·20·24·32·40·48·64)만 쓴다.** 그 외 숫자(`p-5`, `h-10`)는 토큰이 아니며 hook도 잡지 못하므로, 필요하면 Figma에 스텝을 추가하고 토큰을 동기화한다. 아래 [후속 과제](#후속-과제) 2번이 이 구멍을 CSS 레벨에서 닫는 방법이다.

## 레이아웃 (8)

Figma의 `layout/*` 그룹 (가이드 "02. Layout", node `19682:12251`). 페이지 골격 — 뷰포트·배너·컨테이너 너비와 그 사이 여백.

**`get_variable_defs`에 나오지 않는다.** 가이드 프레임이 이름과 값을 표로 적어 두었을 뿐 어떤 노드 속성에도 바인딩하지 않았기 때문이다. `get_metadata`로 가이드의 값 테이블을 읽어 옮겼다.

### 너비 → `--container-*`

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 | 유틸리티 | 용도 |
| --- | --- | --- | --- | --- | --- |
| `layout/viewport` | `--container-viewport` | `1920` | `120rem` | `w-viewport` `max-w-viewport` | 전체 뷰포트 너비 |
| `layout/banner` | `--container-banner` | `1600` | `100rem` | `max-w-banner` | 배너 영역 최대 너비 |
| `layout/container` | `--container-container` | `1440` | `90rem` | `max-w-container` | 콘텐츠 컨테이너 최대 너비 |
| `layout/filter-width` | `--container-filter-width` | `240` | `15rem` | `w-filter-width` | 필터 패널 너비 |

### 여백 · 간격 → `--spacing-*`

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 | 유틸리티 | 용도 |
| --- | --- | --- | --- | --- | --- |
| `layout/gutter` | `--spacing-gutter` | `24` | `var(--spacing-24)` | `gap-gutter` | 그리드 컬럼 간격 |
| `layout/viewport-inset` | `--spacing-viewport-inset` | `240` | `15rem` | `px-viewport-inset` | 뷰포트 좌우 여백 |
| `layout/banner-inset` | `--spacing-banner-inset` | `160` | `10rem` | `px-banner-inset` | 배너 좌우 여백 |
| `layout/banner-padding` | `--spacing-banner-padding` | `80` | `5rem` | `p-banner-padding` | 배너 내부 패딩 |

**네임스페이스를 둘로 쪼갠 이유.** Tailwind v4에는 `--layout-*` 테마 네임스페이스가 없다. Figma 그룹 이름을 그대로 접두어로 쓰면 **유틸리티가 하나도 생성되지 않아** 컴포넌트에서 `className`으로 쓸 수 없고, 인라인 `style`은 hook이 차단하므로 사용처가 CSS 파일로 제한된다. 그래서 토큰의 *성격*에 맞는 네임스페이스로 나눠 넣었다 — 너비는 `--container-*`(→ `max-w-*`·`w-*`), 여백은 `--spacing-*`(→ `p-*`·`px-*`·`gap-*`). Figma 이름은 각 줄의 표와 `layout.tokens.css` 주석에 남아 1:1 추적이 유지된다.

이 이름들은 역할 기반이므로 `src/tokens/README.md`의 기본 규칙을 그대로 만족한다 — `spacing/*`·`radius/*`처럼 예외 등재가 필요하지 않다.

**`layout/gutter`만 값을 다시 적지 않았다.** Figma에서 `24`이고 이는 `spacing/24`와 같은 값이다. 값을 복사하는 대신 `var(--spacing-24)`를 참조하므로 두 스텝이 어긋날 수 없고, Figma가 gutter를 24에서 옮기면 이 한 줄만 고친다.

**두 `*-inset`은 Figma에서 파생값이다** — `viewport-inset = (viewport − container) / 2`, `banner-inset = (viewport − banner) / 2`. CSS `calc()`로 계산할 수도 있지만 Figma가 각각을 **독립 변수로 발행**했으므로 값을 그대로 적었다. `calc()`로 두면 디자이너가 손으로 다른 값을 넣었을 때 코드가 그것을 조용히 무시한다.

## 라디우스 (6)

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `radius/4` | `--radius-4` | `4` | `0.25rem` | `rounded-4` |
| `radius/6` | `--radius-6` | `6` | `0.375rem` | `rounded-6` |
| `radius/8` | `--radius-8` | `8` | `0.5rem` | `rounded-8` |
| `radius/12` | `--radius-12` | `12` | `0.75rem` | `rounded-12` |
| `radius/28` | `--radius-28` | `28` | `1.75rem` | `rounded-28` |
| `radius/full` | `--radius-full` | `9999` | `9999px` | `rounded-full` |

---

## 타이포그래피 — 원자 토큰 (13)

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 |
| --- | --- | --- | --- |
| `font-family/sans` | `--font-sans` | `Noto Sans KR` | `'Noto Sans KR', ui-sans-serif, system-ui, -apple-system, sans-serif` |
| `font-size/12` | `--text-12` | `12` | `0.75rem` |
| `font-size/14` | `--text-14` | `14` | `0.875rem` |
| `font-size/16` | `--text-16` | `16` | `1rem` |
| `font-size/20` | `--text-20` | `20` | `1.25rem` |
| `font-size/24` | `--text-24` | `24` | `1.5rem` |
| `font-size/32` | `--text-32` | `32` | `2rem` |
| `font-size/36` | `--text-36` | `36` | `2.25rem` |
| `font-size/56` | `--text-56` | `56` | `3.5rem` |
| `font-size/60` | `--text-60` | `60` | `3.75rem` |
| `font-size/80` | `--text-80` | `80` | `5rem` |
| `font-weight/regular` | `--font-weight-regular` | `400` | `400` |
| `font-weight/semibold` | `--font-weight-semibold` | `600` | `600` |

`--text-14`는 예전에 코드 전용이었다. Figma가 `font-size/14`를 발행했으므로 이제 대응 변수가 있다.

> **변수가 있다는 것 ≠ 스타일이 그 변수를 쓴다는 것.** `font-size/14`와 `font-size/80`은 변수로 존재하지만, 이를 쓸 만한 두 스타일(`body/small` 14, `title/xlarge` 80)은 Figma 쪽에서 **여전히 크기를 값으로 직접 적고 있다.** 즉 Figma에서 `font-size/80`을 고쳐도 `title/xlarge`는 따라오지 않는다. 근본 해결은 Figma 쪽에서 바인딩을 고치는 것이다.

**Figma에 대응 변수가 없는 코드 토큰:**

| 코드 토큰 | 값 | 왜 추가했는가 |
| --- | --- | --- |
| `--leading-14` `--leading-16` `--leading-20` `--leading-24` `--leading-28` `--leading-36` `--leading-42` `--leading-60` `--leading-80` | `0.875rem` `1rem` `1.25rem` `1.5rem` `1.75rem` `2.25rem` `2.625rem` `3.75rem` `5rem` | Figma 텍스트 스타일은 절대 px line-height를 쓰지만 그것을 변수로 노출하지 않는다. 스타일에서 쓰인 px 값을 그대로 스텝으로 명명했다 |
| 폰트 fallback 체인 | `ui-sans-serif, system-ui, …` | Figma는 `Noto Sans KR` 하나만 지정한다. 웹폰트 미로드 시를 위한 fallback은 코드에서 추가 |

## 타이포그래피 — 텍스트 스타일 (13)

CSS 변수가 아니라 **`@utility` 클래스**다. 합성 토큰이므로 `font-size`와 `font-weight`를 손으로 조합하면 Figma 스타일에서 조용히 어긋난다 — 반드시 클래스 하나를 쓴다.

Figma 가이드가 "13개 로컬 Text Style"이라고 명시하며, 13개 전부 매핑됐다. 각 스타일의 `원본 스타일` 열(예: `Web/EI Headline/80-semibold`)은 LG 전사 타입 스케일에서 가져온 출처 표기이므로 코드에는 옮기지 않았다.

| Figma 텍스트 스타일 | 유틸리티 클래스 | size | weight | line-height | 용도 |
| --- | --- | --- | --- | --- | --- |
| `title/xlarge` | `type-title-xlarge` | `--text-80` (80) † | semibold (600) | `--leading-80` (80) | 대형 헤드라인 |
| `title/large` | `type-title-large` | `--text-60` (60) | semibold (600) | `--leading-60` (60) | Hero 헤드라인 |
| `title/medium` | `type-title-medium` | `--text-56` (56) | semibold (600) | `--leading-60` (60) | 섹션 타이틀 |
| `title/small` | `type-title-small` | `--text-32` (32) | semibold (600) | `--leading-36` (36) | 카드·블록 타이틀 |
| `subtitle/large` | `type-subtitle-large` | `--text-36` (36) | regular (400) | `--leading-42` (42) | Hero 서브 카피 |
| `subtitle/medium` | `type-subtitle-medium` | `--text-24` (24) | regular (400) | `--leading-28` (28) | 섹션 서브 카피 |
| `subtitle/medium-strong` | `type-subtitle-medium-strong` | `--text-24` (24) | semibold (600) | `--leading-28` (28) | 강조 서브 카피 |
| `body/default` | `type-body-default` | `--text-16` (16) | regular (400) | `--leading-20` (20) | 본문 |
| `body/default-strong` | `type-body-default-strong` | `--text-16` (16) | semibold (600) | `--leading-20` (20) | 본문 강조 |
| `body/small` | `type-body-small` | `--text-14` (14) † | regular (400) † | `--leading-16` (16) | 보조 본문 |
| `cta/medium` | `type-cta-medium` | `--text-16` (16) | semibold (600) | `--leading-16` (16) | 버튼 라벨 |
| `nav/menu` | `type-nav-menu` | `--text-20` (20) | regular (400) | `--leading-24` (24) | 네비게이션 메뉴 |
| `badge/small` | `type-badge-small` | `--text-12` (12) | regular (400) | `--leading-14` (14) | 뱃지·라벨 |

모든 스타일의 `letter-spacing`은 Figma에서 `0`이며 그대로 옮겼다. `font-family`는 전부 `font-family/sans`다.

† `body/small`과 `title/xlarge` 2개만 Figma에서 크기가 변수에 바인딩되지 않은 raw 값(각각 14, 80)이다. 나머지 11개는 `font-size/*`·`font-weight/*` 변수를 참조한다 — **Figma 쪽에서 바인딩을 고치는 것이 근본 해결이다.** 코드에서는 두 스타일도 `--text-14`·`--text-80` 토큰을 참조하므로, 어긋날 수 있는 지점은 Figma 안에만 남는다.

---

## 미해결 항목

| 항목 | 상태 | 사유 |
| --- | --- | --- |
| 그림자(효과) | **원천에 없음** | Figma 이 노드에 그림자 효과 변수가 정의되어 있지 않다. `design-tokens.css`의 `--shadow-sm/md/lg`는 Figma 추출 이전부터 있던 값이며 **Figma 출처가 아니다**. Figma에 elevation 변수가 생기면 교체한다 |
| Noto Sans KR 웹폰트 | **미로드** | `--font-sans`가 `Noto Sans KR`을 1순위로 지정하지만 이 프로젝트는 해당 웹폰트를 로드하지 않는다. 현재는 fallback으로 렌더된다 |
| 브레이크포인트 | **원천에 없음** | Figma에 브레이크포인트 변수가 없다. `design-tokens.css`의 `--breakpoint-*`는 Figma 출처가 아니다 |
| `title/xlarge` · `body/small` 크기 바인딩 | **Figma 쪽 문제** | 두 스타일이 `font-size/80`·`font-size/14` 변수가 존재하는데도 크기를 값으로 직접 적고 있다. 코드는 토큰을 참조하므로 코드 안에서는 어긋나지 않지만, Figma에서 변수를 고쳐도 스타일이 따라오지 않는다 |

## 후속 과제

1. **`src/components/Button.tsx` 색상·타이포 마이그레이션** — spacing은 이번에 토큰으로 옮겼다(`h-32 px-12` 등, 값 변화 없음). 남은 것은 **색상**(`bg-neutral-900` `text-white` `ring-neutral-300` `outline-neutral-900` → `action/*`)과 **타이포**(`text-sm` `text-base` `font-medium` → `type-cta-medium`)다. 둘 다 Tailwind 기본 팔레트라 hook이 차단하지 않지만 토큰이 아니다.
2. **Tailwind 내장 spacing 배수 스케일 차단** — `@theme { --spacing: initial; }`을 추가하면 토큰에 없는 숫자(`p-5`, `h-10`)가 CSS 자체에서 생성되지 않아 위의 "숫자 두 체계" 함정이 사라진다. 지금 켜도 `src/`에는 걸리는 곳이 없다(전수 스캔 확인). 다만 앞으로 추가되는 컴포넌트가 임의 숫자를 쓰면 **조용히 무시**되므로(잘못된 값이 아니라 스타일 없음) 도입 시 그 실패 모드를 문서화해야 한다.
3. **Noto Sans KR 로드** — 웹폰트를 실제로 로드하거나, 로드하지 않기로 결정하고 `--font-sans` 1순위를 조정한다.
4. **`layout/*` 실사용** — 토큰은 정의됐지만 아직 이것을 쓰는 레이아웃 컴포넌트가 없다. 현재 사용처는 `Layout.stories.tsx`의 구조 데모뿐이다.

---

## 변경 이력

### 2026-08-14 — 2차 동기화 (17건)

Figma에서 토큰이 추가·수정되어 재추출했다. 이 동기화에서 **`get_variable_defs` 단독으로는 8건(`layout/*` 전체)을 놓친다**는 것이 드러나 위의 [출처](#출처) 절에 교차 확인 절차를 명시했다.

| 축 | 변경 |
| --- | --- |
| 색상 | primitive `light-gray-0` 추가 · semantic `bg/light` `brand/secondary` 추가 · `logo-gray`가 Figma 변수로 발행됨 |
| 색상 | `gradient/badge` 토큰화 — 1차 동기화의 미해결 항목이 닫혔다 |
| 타이포 | `font-size/12` `/20` `/80` 추가 · `font-size/14`가 Figma 변수로 발행됨(기존 코드 전용) |
| 타이포 | 텍스트 스타일 `title/xlarge` `nav/menu` `badge/small` 추가 (10개 → 13개) |
| 레이아웃 | 축 자체가 신규 — `layout/*` 8개, `src/tokens/layout.tokens.css` 신설 |

코드에서 사라진 이름 1개: `--color-brand-logo-wordmark` → `--color-brand-secondary`. 코드가 발명한 이름이 Figma 변수명으로 대체된 사례이며, 1차 동기화 때 이 문서가 예고한 교체다.

변경 없음이 확인된 축: `spacing/*` 10스텝 · `radius/*` 6스텝 · `text/*` `border/*` `state/*` `action/*` `flag/*` `review/*` `shadow/*` 전체.
