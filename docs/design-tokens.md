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
| 최근 동기화 | 2026-08-15 — 아래 [변경 이력](#변경-이력) 참고 |

> **`get_variable_defs` 하나로는 부족하다.** 이 도구는 **해당 노드가 실제로 사용하는** 변수만 반환한다. `layout/*` 8개는 가이드 프레임이 이름과 값을 표로 적어 두었을 뿐 어떤 노드의 속성에도 바인딩하지 않았기 때문에 응답에 나오지 않는다. `icon/white`도 이 노드에서 쓰이지 않아 빠진다 — 삭제된 것이 아니다.
>
> 따라서 동기화는 **두 경로를 교차 확인**한다: (a) `get_variable_defs`로 값을, (b) `get_metadata`로 가이드 프레임의 라벨·값 테이블을 읽어 (a)가 놓친 변수를 찾는다. (a)만 보고 "코드에만 있는 토큰"을 삭제하면 안 된다.

## 요약

| 축 | Figma | 매핑됨 | 코드 전용 | 코드 위치 |
| --- | --- | --- | --- | --- |
| 색상 primitive | 25 | 25 | — | `src/tokens/colors.tokens.css` (`:root`) |
| 색상 semantic | 53 | 53 | **1** (`border-focus-inverse`) | `src/tokens/colors.tokens.css` (`@theme`) |
| 색상 gradient (스타일) | 1 | 1 | — | `src/tokens/colors.tokens.css` (`--gradient-badge` + `@utility`) |
| 타이포 원자 | 13 | 13 | **13** (`--leading-*` 9 + `--text-30` + `--leading-30` + `--text-19` + `--leading-benefit-label`) | `src/tokens/typography.tokens.css` (`@theme`) |
| 타이포 텍스트 스타일 | 13 | 13 | **2** (`type-cta-large` `type-benefit-label`) | `src/tokens/typography.tokens.css` (`@utility`) |
| 스페이싱 | 10 | 10 | **20** (`44` `96` `18` `36` `78` `80` `38` `76` `82` `30` `33` `42` `46` `50` `88` `144` `200` `hairline` `underline` `benefit-label`) | `src/tokens/spacing.tokens.css` |
| 레이아웃 | 8 | 8 | — | `src/tokens/layout.tokens.css` |
| 라디우스 | 6 | 6 | **1** (`16`) | `src/tokens/radius.tokens.css` |
| border-width | **0** | — | **1** (`hairline`) | `src/tokens/design-tokens.css` — Figma에 스트로크 굵기 변수가 없음 |
| 그림자 | **0** | — | 3 (`sm` `md` `lg`) | Figma에 그림자 효과 변수가 없음 |
| text-shadow | **0** | — | **1** (`disclaimer-glow`) | `src/tokens/design-tokens.css` — Figma에 대응 효과 변수가 없고 색만 `shadow/disclaimer`로 발행됨 |
| blur | 1 | 1 | — | `src/tokens/design-tokens.css` — `Blur/Background 150` → `--blur-blind`. **Figma가 발행하는 유일한 효과 변수다** |
| **합계** | **130** | **130** | **31** | |

> **합계 행과 일부 "코드 전용" 칸은 최신이 아니다.** 4차 동기화 이후 여러 컴포넌트 작업이 각자 스텝을 등재하면서 이 표를 함께 고치지 않았다(작성 시점 기준 `--spacing-56` · `140` · `180` · `450` · `860`이 위 스페이싱 칸과 아래 실측 스텝 표 양쪽에 빠져 있다). **정본은 항상 `src/tokens/`의 파일이고, 이 문서는 매핑 기록이다** — 숫자가 어긋나면 파일 쪽을 믿는다. 빠진 스텝을 여기서 대신 채우지 않은 이유는 각 스텝의 "왜 Figma 변수가 아닌가"가 그 값을 실측한 작업만 정확히 쓸 수 있기 때문이다.

**"코드 전용" 열이 뜻하는 것.** Figma에 대응 변수가 없어 코드 쪽에서 등재한 토큰이다. 두 종류가 섞여 있다: (a) Figma가 **변수로 발행하지 않은 실측값** — 프레임에서 잰 크기, 텍스트 스타일이 raw로 적은 값. Figma가 나중에 변수를 발행하면 그 이름으로 교체한다. (b) Figma에 **축 자체가 없는 것** — border-width·shadow·breakpoint. 각 항목의 사유는 해당 절의 표에 있다.

## 변환 규칙

1. Figma 변수명의 `/` → `-`. `bg/warm` → `--color-bg-warm`. 그룹 이름을 접두어로 유지하므로 `bg-bg-warm` 같은 중복이 생기지만, Figma 변수와 클래스 이름이 1:1로 대응한다.
2. **primitive → semantic 참조 구조.** semantic 토큰은 hex를 다시 적지 않고 primitive를 `var()`로 참조한다. primitive 값 1곳만 고치면 그것을 쓰는 semantic 전부가 따라온다.
3. **primitive는 `@theme` 밖 `:root`에 둔다.** `@theme`에 넣으면 Tailwind가 `bg-lg-active-red` 유틸리티를 만들어 semantic 레이어를 우회할 수 있다. `:root`에 두면 semantic 정의에서만 참조 가능하다.
4. Figma의 unitless px 값(spacing·radius·font-size·line-height)은 16px 루트 기준 **rem**으로 환산한다. 사용자 브라우저 글자 크기 설정을 따르기 위함.
5. 스케일 스텝(`spacing`·`radius`)은 **Figma의 숫자 이름을 유지**한다. `src/tokens/README.md`의 예외 조항 참고.
6. 텍스트 스타일은 합성 토큰(family+size+weight+line-height)이라 CSS 변수 1개에 담기지 않으므로 **`@utility type-*` 클래스**로 변환한다.

---

## 색상 — primitive (25)

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
| `white-60` | `--lg-white-60` | `#ffffff99` |
| `logo-gray` | `--lg-logo-gray` | `#6b6b6b` |
| `green-1` | `--lg-green-1` | `#287d00` |
| `green-2` | `--lg-green-2` | `#316d15` |
| `yellow-1` | `--lg-yellow-1` | `#f7b500` |
| `yellow-2` | `--lg-yellow-2` | `#eeb404` |
| `teal-1` | `--lg-teal-1` | `#006a63` |

**semantic이 참조하지 않는 primitive 4개**: `mid-gray-3` · `dark-gray-2` · `dark-gray-3` · `near-black`. Figma 팔레트에는 있으나 semantic 변수 어디에도 연결되어 있지 않다. 팔레트 완결성을 위해 옮겨두었고, 이 값이 필요해지면 **컴포넌트에서 직접 쓰지 말고 semantic 토큰을 새로 정의해 연결한다.**

`bright-red`는 semantic 변수는 아니지만 아래 [gradient](#색상--gradient-1)의 첫 스톱으로 참조된다. `logo-gray`는 `brand/secondary`가 참조한다.

**`white-60`은 팔레트에서 유일한 반투명 primitive다.** 8자리 hex로 적는데, `get_variable_defs`가 그 형태로 반환하기 때문이다(`99` = 153/255 = 이름이 말하는 60%). 요소에 `opacity`를 60%로 주는 것과 같지 않다 — `opacity`는 상자 안의 모든 것을 흐리고 이 값은 채움만 반투명하게 한다. 유일한 사용처는 `surface/blur-blind`다.

## 색상 — semantic (53)

`colors.tokens.css`의 `@theme`. 컴포넌트가 쓰는 레이어.

### bg — 페이지 배경 (5)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `bg/default` | `--color-bg-default` | `--lg-white` | `#ffffff` | `bg-bg-default` |
| `bg/warm` | `--color-bg-warm` | `--lg-light-gray-2` | `#f0ece4` | `bg-bg-warm` |
| `bg/subtle` | `--color-bg-subtle` | `--lg-light-gray-1` | `#f6f3eb` | `bg-bg-subtle` |
| `bg/elevated` | `--color-bg-elevated` | `--lg-white` | `#ffffff` | `bg-bg-elevated` |
| `bg/light` | `--color-bg-light` | `--lg-light-gray-0` | `#f6f6f6` | `bg-bg-light` |

### background — Pmax 배너 캔버스 (1)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `background/LV1` | `--color-background-lv1` | `--lg-light-gray-3` | `#e6e1d6` | `bg-background-lv1` |

**`bg/*`와 다른 그룹이다 — 접두어 차이는 오타가 아니다.** 색상 문서 프레임(`19561:25592`)은 `bg/*` 다섯 개를 발행하고 `bg/lv1`은 없다. `background/LV1`은 Pmax 배너 캔버스(`get_variable_defs(19661:21073)`)에서만 나온다. 변환 규칙 1번(그룹 이름을 접두어로 유지)을 그대로 적용해 두 그룹을 합치지 않았다 — `banner/label`을 `text/*`에 합치지 않고 `--color-banner-label`로 둔 것과 같은 판정이다(`colors.tokens.css`의 banner 블록 주석). 요청받은 이름은 `--color-bg-lv1`이었으나 그 이름은 **존재하지 않는 `bg/lv1` 변수를 주장**하고, Figma가 실제로 `bg/lv1`을 발행하는 날 이름을 뺏는다. `LV1`의 대소문자만 다른 토큰들과 맞춰 소문자로 적는다.

값은 이미 팔레트에 있는 `light-gray-3`과 같다(Figma는 같은 값을 `Warm Gray 05`라는 이름으로도 발행하며 `background/LV1`이 그것을 참조한다). 이 primitive를 가리키는 다른 semantic은 `border/default` 하나뿐인데 **병합하지 않았다** — 하나는 스트로크 색이고 하나는 1200×1200 캔버스의 면색이라, 테두리 색을 다시 칠하는 날 배너가 조용히 같이 칠해진다.

### surface — 컴포넌트 면 (6)

| Figma 변수 | 코드 토큰 | → primitive | 값 | 유틸리티 |
| --- | --- | --- | --- | --- |
| `surface/card` | `--color-surface-card` | `--lg-white` | `#ffffff` | `bg-surface-card` |
| `surface/toast-error` | `--color-surface-toast-error` | `--lg-toast-gray` | `#303030` | `bg-surface-toast-error` |
| `surface/toast-warning` | `--color-surface-toast-warning` | `--lg-yellow-2` | `#eeb404` | `bg-surface-toast-warning` |
| `surface/toast-info` | `--color-surface-toast-info` | `--lg-teal-1` | `#006a63` | `bg-surface-toast-info` |
| `surface/inverse` | `--color-surface-inverse` | `--lg-dark-gray-1` | `#333333` | `bg-surface-inverse` |
| `surface/blur-blind` | `--color-surface-blur-blind` | `--lg-white-60` | `#ffffff99` | `bg-surface-blur-blind` |

**`surface/blur-blind`는 노드가 아니라 색상 문서 프레임에서 나왔다.** 사용처인 Pmax 배너의 "Blur blind" 판(`19661:17030`)은 채움을 **primitive** `white-60`에 바인딩하고 있어 `get_variable_defs`가 그 노드에서는 semantic 이름을 주지 않는다. 그런데 색상 문서 프레임(`19561:25592`)이 같은 값을 **그 레이어 이름 그대로** `surface/blur-blind`로 발행한다 — 즉 역할 이름이 이미 Figma에 있으므로 코드가 이름을 발명하지 않는다. 구현 요청은 `--color-overlay-blind`였으나 그 이름은 이 팔레트에 없는 `overlay/*` 그룹을 만드는 셈이 된다(원본 파일에 `overlay/*`도 `scrim/*`도 없다).

이 토큰은 **혼자서는 아무 효과도 내지 못한다.** 판은 채움(이 토큰)과 배경 흐림(아래 [blur](#blur-1) 절의 `--blur-blind`) 두 가지로 이루어지고, 둘 중 하나만 쓰면 Figma와 다르게 렌더된다.

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

#### Figma에 변수가 없는 코드 전용 (1)

| 코드 토큰 | → primitive | 값 | 유틸리티 | 왜 Figma 변수가 아닌가 |
| --- | --- | --- | --- | --- |
| `--color-border-focus-inverse` | `--lg-white` | `#ffffff` | `outline-border-focus-inverse` | Figma에 focus variant 자체가 없다. `get_variable_defs(19661:4208)`가 반환하는 7개(`surface/inverse` `text/inverse` `icon/white` `spacing/20` `spacing/24` + 타이포 원자 2개)에 focus 관련 변수가 없고, `border/focus`에도 반전 짝이 없다 |

**대비 미달이 사유다.** `border/focus`는 검정이고, `HeaderNotification`에서 그것이 놓이는 유일한 면은 `surface/inverse`(`#333333`)다. 두 값의 대비는 **1.66:1**로 WCAG 2.1 SC 1.4.11(비텍스트 대비)이 포커스 표시에 요구하는 **3:1** 미달이다. 흰색은 같은 면에서 **12.64:1**이다.

**`--color-border-inverse`를 빌려 쓰지 않았다.** 값(`--lg-white`)은 같지만 역할이 다르다 — 위 [미해결 항목](#미해결-항목)의 "흰 배경이 두 변수로 갈림"과 같은 판단이다. 이 토큰은 `border/focus`를 따라 움직인다(Figma가 포커스 색을 검정에서 옮기면 이 줄이 함께 바뀌고 `--color-border-inverse`는 그대로다). 반대로 빌려 썼다면 **키보드 포커스 표시가 장식용 테두리 색에 묶여**, 그쪽이 자기 사유로 회색 계열이 되는 날 표시가 조용히 3:1 아래로 내려간다 — `--spacing-92`·`--spacing-82`가 버튼 토큰에 묶여 있던 것과 같은 무성 실패 계열이다.

이름의 `-inverse` 접미사는 기존 선례(`border/inverse` · `text/disclaimer-inverse` · `shadow/disclaimer-inverse` · `brand/logo-inverse`)를 그대로 따랐다. Figma가 `border/focus-inverse`를 발행하면 이름을 유지한 채 위 표로 옮긴다.

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

> **정정: "토큰화할 수 없다"는 색에만 해당한다.** 기하가 변수가 아니라는 것이지 토큰이 될 수 없다는 뜻이 아니다. `--text-shadow-disclaimer-glow`가 그 예다 — 블러는 노드에서 재고 색은 아래 `--color-shadow-disclaimer`를 참조한다. 아래 [text-shadow](#text-shadow-0--코드-전용-1) 절 참고.

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

### Figma에 변수가 없는 실측 스텝 (21)

컴포넌트 프레임에서 잰 값이다. `get_variable_defs`가 반환하지 않으므로 동기화 대상이 아니며, **왜 변수가 아닌지**를 각 줄에 남긴다.

| 코드 토큰 | 코드 값 | 출처 노드 | 왜 Figma 변수가 아닌가 |
| --- | --- | --- | --- |
| `--spacing-44` | `2.75rem` | Input `19563:5289` | inputbox md 높이에 size 변수 미바인딩. 형제인 lg 높이는 Figma 스텝 `spacing/48` |
| `--spacing-96` | `6rem` | Icon/Benefit `19620:23774` | 아이콘 프레임이 고정 96 정사각. 크기 변수 없음(`icon/default`·`icon/white` 색상만) |
| `--spacing-18` | `1.125rem` | Button/Text `19661:3700` | Icon/UI 24 마스터를 프레임에서 18로 리사이즈. 크기 변수 미바인딩 |
| `--spacing-36` | `2.25rem` | Button/Promotion `1:15` | 세트 전체에 spacing 변수가 하나도 바인딩되지 않음. 32↔40 사이 스텝 없음 |
| `--spacing-78` | `4.875rem` | Button/Promotion `1:15` | 위와 동일. 64↔96 사이 스텝 없음 |
| `--spacing-80` | `5rem` | Button/Web `19649:31393` | 18개 variant 전부에 raw `min-width: 80`. 값은 `--spacing-banner-padding`과 같지만 역할이 달라 별개 토큰 |
| `--spacing-38` | `2.375rem` | CategoryMenu `19655:33598` | `layout=LeftMenu` 루트 프레임의 고정 높이에 size 변수 미바인딩(`get_variable_defs`가 반환하는 size 변수는 탭 간격 `spacing/40` 하나뿐). Figma 스텝 36↔40 사이 |
| `--spacing-76` | `4.75rem` | Header/GNB `19655:33547` (`Property 1=secondary` `19661:3965` 안의 `Link`) | 프레임 고정 높이에 size 변수 미바인딩(`get_variable_defs`가 반환하는 size 변수는 좌우 padding `spacing/24` 하나뿐). Figma 스텝 64↔96 사이 |
| ~~`--spacing-92`~~ → `--spacing-gnb-inset` | `5.75rem` | Header/GNB `19643:30719` (`Property 1=Default`) | **숫자 스텝은 제거됐다.** 값(92)은 그대로이고 이름만 옮겼다 — Logo/LG를 `absolute left-92`로 얹던 때는 위치였으나, 지금 GNB는 자기 루트에 padding을 걸고 로고를 흐름 첫 아이템으로 둔다. 즉 위치가 아니라 **인셋**이라 `layout.tokens.css`의 인셋 3개(viewport-inset 240 · gnb-inset 92 · banner-inset 160) 옆으로 갔다. 아래 문단들의 `--spacing-92` 언급은 그 이전 이력이다 |
| `--spacing-82` | `5.125rem` | Header/GNB `19655:33547` (`Property 1=secondary` `19661:3965` 안의 `Link`) | Link 프레임의 좌우 인셋에 size 변수 미바인딩(`get_variable_defs`가 반환하는 size 변수는 좌우 padding `spacing/24` 하나뿐). Figma 스텝 80↔96 사이 |
| `--spacing-30` | `1.875rem` | PmaxLayout `19649:32052` (`Disclaimer` `19649:32054`) | 아래 8개 공통 — 이 노드는 size 변수를 **하나도** 바인딩하지 않는다. 고지문 프레임의 좌우 padding |
| `--spacing-33` | `2.0625rem` | PmaxLayout `19649:32052` (`Logo/LG` `19649:32053`) | 로고 인스턴스의 절대 x·y 위치(상·좌 인셋). 두 축이 같은 값이라 스텝 하나. **결과가 아니라 원인** — 정렬의 잔여값이 아니라 Figma가 직접 적은 위치다 |
| `--spacing-42` | `2.625rem` | PmaxLayout `19649:32052` (`Disclaimer` `19649:32054`) | 고지문 프레임의 아래 padding |
| `--spacing-46` | `2.875rem` | PmaxLayout `19649:32052` (고지문 text `19649:32055`) | 고지문 텍스트의 max-height. `nav/menu` 행간에서 1줄(24)은 통과하고 2줄(48)은 잘리는 **살아 있는 제약** |
| `--spacing-50` | `3.125rem` | PmaxLayout `19649:32052` (`Logo/LG` `19649:32053`) | 로고 인스턴스 높이. 마스터 64를 50으로 리사이즈한 값이라 로고가 아니라 합성물의 스텝이다(`--spacing-18`과 같은 관계). 폭 113.501은 마크 비율의 **결과**라 토큰화하지 않았다 |
| `--spacing-88` | `5.5rem` | PmaxLayout `19649:32052` (`Subcopy` `19649:32061`) | Subcopy의 max-height. Figma 원문은 2줄(84)이라 발현되지 않지만 3줄부터 걸린다 — 카피가 prop이므로 살아 있는 제약이다 |
| `--spacing-144` | `9rem` | PmaxLayout `19649:32052` (`Headline` `19649:32060`) | Headline의 max-height. `title/large` 행간 60에서 2줄(120)은 들어가고 3줄(180)은 잘린다 |
| `--spacing-200` | `12.5rem` | PmaxLayout `19649:32052` (`Copy + CTA btn` `19649:32057`) | 카피 블록의 좌우 padding. 안쪽 Copy 폭 800은 `1200 − 2 × 200`의 **결과**라 이름은 padding이 받는다 |
| `--spacing-hairline` | `1px` | Button/Text `19661:3683` | `selected` 밑줄 사각형 높이. **숫자 이름 금지** — 아래 참고 |
| `--spacing-underline` | `2px` | Tab `19643:31067` (active `19643:31065`) | active 밑줄 사각형의 두께 + 라벨↔밑줄 간격. `get_variable_defs`가 색·타이포 변수만 반환하고 size 변수는 없음. **숫자 이름 금지** — 아래 참고 |
| `--spacing-benefit-label` | `0.8542rem` | BenefitRow `1:50` (`Benefit Item` `1:52`) | 아이콘 타일↔라벨 간격(13.667). 두 variant 동일. `get_variable_defs`가 `1:52`·`1:385` 어느 쪽에서도 size 변수를 하나도 반환하지 않음(색·타이포만). **숫자 이름 금지** — 아래 참고 |

**역할 이름을 쓰는 토큰 3개.** `--spacing-hairline`과 `--spacing-underline`은 숫자 이름을 쓰지 않는다. 이유가 같다.

- **(a) 내장 스케일 잠식.** `--spacing-1`은 Tailwind 내장 `h-1`·`p-1`(0.25rem)을, `--spacing-2`는 `h-2`·`p-2`·`gap-2`(0.5rem)를 덮어써 **기존·향후의 모든 사용처를 조용히 바꾼다** — 아래 경고 박스의 `h-8` 사고와 같은 종류다.
- **(b) 스케일의 한 칸이 아니다.** 두 값 모두 rem 변환 규칙을 적용하면 안 된다. 20px 루트에서 각각 1.25px·2.5px가 되어 서브픽셀로 흐려지는데, 이 둘은 "선명하게 그려지는 것"이 존재 이유인 막대다. 그래서 px로 고정했다. 게다가 이 스케일은 4에서 시작하므로 2는 스텝 자체가 아니다 — 숫자 이름의 예외(`src/tokens/README.md`)는 **스케일 위의 값**에만 적용된다.

`--spacing-underline`이 두께와 간격 **한 토큰으로 둘 다** 담당하는 것은 의도다. 같은 밑줄 요소의 두 치수이고 Figma가 둘을 함께 움직인다(28 높이 프레임 = 라인 박스 24 + 간격 + 막대). 갈라지는 날 쪼갠다.

**`--spacing-benefit-label`도 위 (b)에 걸린다 — 그리고 (a)는 더 나쁜 형태로 걸린다.** 이 스케일은 4부터의 정수인데 13.667은 12와 16 **사이의 소수**라 스텝 자체가 아니다. 게다가 Tailwind v4는 내장 스케일에서 소수를 받으므로, 등재하지 않은 `gap-13.667`은 CSS가 생성되지 않는 것이 아니라 `13.667 × 0.25rem = 3.417rem`으로 **조용히 컴파일된다** — 위 경고 박스의 `h-8` 사고와 같은 계열이며 hook도 `verify:tokens`도 잡지 못한다. 단위는 hairline·underline과 달리 **rem**이다: 저 둘은 선명해야 하는 막대라 px로 고정했지만 이것은 레이아웃 간격이라 사용자 글자 크기를 따라야 한다.

**13.667을 `calc()`로 유도하지 않은 것은 의도다.** `16 × (82 / 96)`이 정확히 13.667이라 96 정사각 `Icon/Benefit` 마스터에 그린 16 간격을 82로 줄인 결과처럼 보인다. 그럴듯하지만 **파일에 원본이 16이었다는 근거가 없고**, 식으로 적으면 BenefitRow의 간격이 `--spacing-96`(아이콘 마스터 크기)과 `--spacing-82`(헤더 좌우 인셋)에 묶인다 — `--spacing-92`·`--spacing-82`를 등재해 **끊어낸** 바로 그 의미 결합을 반대 방향으로 다시 만드는 셈이다. 그래서 잰 값을 그대로 등재했다. Figma가 이 관계를 발행하면 그때 재검토한다.

**`--spacing-38`·`--spacing-76`·`--spacing-82`는 숫자 이름이 안전하다.** 위 (a)의 위험이 없기 때문이다 — 셋 다 내장 해석값이 각각 9.5rem·19rem·20.5rem이라 의도적으로 쓸 일이 없는 희소 고역대이고, 등재 직전 저장소 전수 grep에서 `*-38`·`*-76`·`*-82` 사용처가 0건, `*-92`는 위험을 설명하는 주석 한 줄뿐이었다. Figma가 authoring하는 값도 그 숫자 자체다.

**`--spacing-92`(현재 이름 `--spacing-gnb-inset`)·`--spacing-82`는 클래스를 줄이려고 만든 것이 아니라 의미 결합을 끊으려고 만들었다.** 두 값은 원래 기존 스텝의 합으로 쓰였다 — `left-80` + `ml-12` = 92, `px-64` + `mx-18` = 82. 수치는 오차 0으로 정확했지만, `--spacing-80`은 `Button/Web`의 `min-width: 80` 제약으로, `--spacing-18`은 `Button/Text` 안 `Icon/UI`의 리사이즈 값으로 등재된 토큰이다. 즉 **헤더 로고 위치가 버튼 최소너비에, 헤더 좌우 인셋이 버튼 아이콘 크기에 묶여 있었다.** 둘 중 하나가 자기 사유로 움직이는 날 헤더가 조용히 따라 움직이는데, 합은 여전히 유효한 CSS라 hook도 `verify:tokens`도 잡지 못한다. 아래 경고 박스의 `h-8` 사고와 같은 무성 실패 계열이며, **값이 같아도 역할이 다르면 나눈다**는 `--spacing-80` ↔ `--spacing-banner-padding` 판단의 반대 방향 적용이다.

`--spacing-82`만 의존 방향이 Figma와 반대라는 점은 기록해 둔다. Figma는 `Link`를 폭 1756 고정으로 그리고 1920 안에 가운데 정렬하므로 **그쪽에서 82는 `(1920 − 1756) / 2`의 결과**다. 구현은 이를 뒤집어 인셋을 고정하고 프레임이 남는 폭을 채우게 했다 — 루트가 1920보다 좁아져도 성립해야 하기 때문이다. 코드의 모델에서는 인셋이 원인이고 폭이 결과이므로 이름은 인셋이 받는다. 아래 "토큰화하지 않기로 한 값"의 `19`·`5`와 다른 경우다: 그 둘은 **코드의 모델에서도** 결과였다. Figma가 Link 폭을 변수로 발행하면 이 토큰을 옆에 하나 더 만들지 말고 이 토큰을 재검토한다.

**76과 78이 나란히 놓이는 것은 중복이 아니다.** 값이 2 차이라 눈에는 노이즈처럼 보이지만 출처가 다르다 — 78은 `Button/Promotion` 프레임 높이, 76은 header 바 높이이고 Figma가 둘을 따로 움직인다. 합치면 우연을 규칙으로 굳히는 것이 된다(값이 같아도 역할이 다르면 나누는 `--spacing-80` ↔ `--spacing-banner-padding`과 같은 판단이며, 여기는 값마저 다르다). 다만 이 고역대에 세 번째 이웃이 생기면 그것은 "실측 스텝을 더 쌓을 때가 아니라 Figma에 실제 스케일이 필요하다"는 신호다.

> **그 조건은 이미 발동했다.** `--spacing-82`·`--spacing-92` 등재로 이 고역대는 한때 **76 · 78 · 80 · 82 · 92 · 96** 여섯 개였다(92가 `--spacing-gnb-inset`으로 옮겨간 뒤로는 다섯 개다). 이것은 등재를 막는 사유가 아니다 — 등재하지 않는 쪽의 대안은 "토큰이 적은 상태"가 아니라 "헤더 두 값이 버튼 두 토큰에 조용히 의존하는 상태"였다. 다만 실측 스텝을 이 이상 쌓기 전에 **디자이너에게 이 구간의 실제 스케일을 요청해야 한다**는 신호이며, 아래 [후속 과제](#후속-과제) 8번으로 옮겼다.

**PmaxLayout 8개는 "응답의 부재"가 가장 선명한 사례다.** 위 표의 다른 실측 스텝들은 `get_variable_defs`가 size 변수를 **몇 개는** 반환하면서 그 값만 빠뜨린 경우였다(헤더는 `spacing/24`를, CategoryMenu는 `spacing/40`을 반환한다). PmaxLayout(`19649:32052`)은 19개 변수를 반환하는데 **그중 size가 하나도 없다** — 색·타이포·텍스트 스타일뿐이다. 동시에 `get_design_context`는 같은 노드의 색과 폰트를 전부 `var(--...)`로 내면서 위 8개 수치만 맨 리터럴로 낸다. 두 도구의 응답이 같은 방향을 가리키므로 이 8개가 실측값이라는 판정에 추정이 섞이지 않았다.

그중 `200`은 등재 실패의 결과가 특히 크다. 이름이 없으면 `px-200`은 `200 × 0.25rem = 50rem`이 되어 1200 정사각 캔버스 좌우에 각각 800을 밀어 넣는다 — 값이 조금 틀리는 것이 아니라 **카피 블록의 폭이 0이 된다.** 그런데도 CSS는 유효하므로 hook도 `verify:tokens`도 빌드도 통과한다. 위 경고 박스의 `h-8` 사고와 같은 계열의 가장 극단적인 형태다.

**밀도는 늘었고, 그것은 등재를 막는 사유가 아니라 신호다.** `88`이 고역대에 들어가 그 구간은 `76 · 78 · 80 · 82 · 88 · 92 · 96` 일곱 개가 됐고, 나머지 일곱 개는 30-56 구간을 `30 · 32 · 33 · 36 · 38 · 40 · 42 · 44 · 46 · 48 · 50 · 56`으로 채웠다. 새 후속 과제를 열지 않고 아래 [후속 과제](#후속-과제) 8번에 합산한다 — 요청 내용이 같기 때문이다(디자이너에게 이 구간의 실제 `spacing/*` 스케일을 요청할 것). 등재하지 않는 쪽의 대안은 "토큰이 적은 상태"가 아니라 **컴포넌트가 4배 값으로 조용히 렌더되는 상태**다.

**토큰화하지 않기로 한 값 4개.**

- Button/Web 프레임의 `min-height: 36` — 세 사이즈 높이가 44·48·64로 고정이라 **절대 발현되지 않는 dead constraint**다.
- CategoryMenu LeftMenu의 위아래 여백 `5` — 28 높이 탭을 38에 세로 중앙 정렬한 **결과**이지 원인이 아니다. 이름 붙이면 결과를 원인으로 굳혀 탭 높이가 바뀌는 날 루트가 38에서 어긋난다. 게다가 `--spacing-5`는 내장 `p-5`·`h-5`(1.25rem)를 덮어쓴다.
- Header/GNB secondary Link의 위아래 여백 `19` — 38 높이 로고를 76에 세로 중앙 정렬한 **결과**다. `5`와 같은 이유로 이름을 붙이지 않았다: 결과를 원인으로 굳히면 로고 높이가 바뀌는 날 프레임이 76에서 어긋난다. 게다가 `19`를 padding으로 쓰면 76이 로고 높이에 의존하게 되어 의존 방향이 Figma와 반대가 된다. 대신 높이 자체를 `--spacing-76`으로 걸고 정렬은 `items-center`에 맡긴다.
- `--spacing-underline`의 border-width 형제 — 헤어라인과 달리 이 값을 **실제 CSS 테두리로 그리는 곳이 없다**. 아래 [border-width](#border-width-0--코드-전용-1) 절 참고.

넷 다 같은 이유로 만들지 않았다: 쓰이지 않을 토큰은 오용된다.

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
> 규칙: **컴포넌트에서는 토큰 스텝(4·8·12·16·18·20·24·32·36·38·40·44·48·64·76·78·80·82·92·96)만 쓴다.** 그 외 숫자(`p-5`, `h-10`)는 토큰이 아니며 hook도 잡지 못하므로, 필요하면 Figma에 스텝을 추가하고 토큰을 동기화한다. 아래 [후속 과제](#후속-과제) 2번이 이 구멍을 CSS 레벨에서 닫는 방법이다.
>
> 이 목록에서 **18·36·38·44·76·78·80·82·96은 Figma 스텝이 아니라 실측 스텝**이다(위 표 참조). 등재 이유가 추적성만이 아니라는 점이 중요하다 — 이름이 없으면 `h-78`은 19.5rem, `h-76`은 19rem, `px-36`은 9rem, `h-38`은 9.5rem, `size-18`은 4.5rem, `px-82`는 20.5rem으로 조용히 렌더된다(같은 이유로 `--spacing-gnb-inset`이 필요하다 — 이름이 없으면 `px-92`가 23rem이 된다). **스텝 등재가 이 구멍을 닫는 유일한 방법이다.** 반대로 `rounded-*`에는 내장 숫자 폴백이 없어, 토큰이 없으면 CSS가 아예 생성되지 않는다(값이 틀리는 대신 스타일이 없다).

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

### Figma에 변수가 없는 실측 스텝 (1)

| 코드 토큰 | 코드 값 | 유틸리티 | 출처 노드 | 왜 Figma 변수가 아닌가 |
| --- | --- | --- | --- | --- |
| `--radius-16` | `1rem` | `rounded-16` | Button/Promotion `1:15` | 세트에 radius 변수가 바인딩되지 않음(`get_variable_defs`가 색상만 반환). Figma 스텝 12와 28 사이에 해당 |

스페이싱과 달리 `rounded-*`에는 Tailwind 내장 숫자 폴백이 없다. 이 토큰 이전에는 `rounded-16`이 **CSS를 아예 생성하지 않았다** — 값이 틀리는 게 아니라 모서리가 각지게 렌더된다.

---

## border-width (0 / 코드 전용 1)

**Figma에 스트로크 굵기 변수가 없다.** `border/*` 그룹은 **색상**만 발행한다(`border/default` `border/strong` `border/focus` `border/inverse` — 위 [border 절](#border-4) 참조). 굵기는 각 노드가 raw 값으로 갖고 있다.

| 코드 토큰 | 코드 값 | 유틸리티 | 출처 노드 |
| --- | --- | --- | --- |
| `--border-width-hairline` | `var(--spacing-hairline)` | `border-hairline` · `border-b-hairline` | Button/Web `19649:31393` (테두리 1) |

**이름이 하나인데 토큰이 둘인 이유.** 같은 "가장 얇은 선"을 그리는 방법이 둘이고, Tailwind v4는 네임스페이스마다 변수를 따로 요구한다 — `h-*`는 `--spacing-*`만, `border-*`(굵기)는 `--border-width-*`만 읽는다. 실측으로 확인됐다: `--spacing-hairline`만 정의하면 `border-b-hairline`은 생성되지 않는다.

| 그리는 방법 | 굵기 유틸리티 | 색 유틸리티 | 실사용 |
| --- | --- | --- | --- |
| 실제 CSS 테두리 | `border-hairline` | `border-border-*` | Button/Web의 버튼 외곽선 |
| 채워진 인디케이터 막대 | `h-hairline` | `bg-*` | Button/Text의 hover 밑줄 — Figma에서도 `text-decoration`이 아니라 별도 사각형 노드다 |

**두 방법은 헤어라인 전용이 아니다.** 밑줄이면 다 `h-hairline`인 것이 아니라, **그 굵기일 때만** 이 토큰이다 — Tab의 active 밑줄은 2단위라 `h-underline` + `bg-brand-primary`를 쓴다(위 [스페이싱](#스페이싱-10) 절). 굵기 토큰을 고르는 기준은 "어떻게 그리는가"(테두리/막대)와 "몇 단위인가" 둘 다다.

두 토큰이지만 **값의 정본은 한 곳**이다: `--border-width-hairline`이 `--spacing-hairline`을 `var()`로 참조하므로 어긋날 수 없다. 선례는 `--spacing-gutter: var(--spacing-24)`. 향후 둘이 갈라져야 하면 이 한 줄만 고친다.

**축 이름에 숫자를 쓰지 않은 이유.** `--spacing-*`·`--radius-*`의 숫자 예외는 "Figma가 `spacing/16`이라는 숫자 이름을 정본으로 발행하기 때문"이라는 전제 위에 있다. border-width는 Figma에 변수 자체가 없으므로 그 전제가 성립하지 않는다 — `--border-width-1`은 Figma에 없는 스케일을 코드가 발명하는 것이 된다. 따라서 `src/tokens/README.md`의 기본 규칙(역할 기반)이 그대로 적용된다.

**Tailwind 내장 `border`(=1px)는 토큰이 아니므로 쓰지 않는다.** `bg-neutral-900`과 같은 부류다 — hook은 통과하지만 토큰 계약 밖이다.

---

## text-shadow (0 / 코드 전용 1)

Figma는 **그림자·글로우** 효과(offset·blur·spread) 변수를 하나도 발행하지 않는다. 위 [shadow — 색상만](#shadow--색상만-2) 절과 같은 공백이며, 그래서 `--shadow-sm/md/lg`처럼 이 토큰도 Figma 출처가 아니다. 다만 **색만은 Figma가 발행한다** — 기하는 실측, 색은 변수인 반쪽 상태다.

> **정정(2026-08-15, PmaxBanner 등재).** 이전 판은 여기에 "Figma는 효과 변수를 **하나도** 발행하지 않는다"고 적혀 있었고 그것은 사실이 아니다. 배경 흐림 효과 변수 `Blur/Background 150`이 발행되어 있다 — 아래 [blur](#blur-1) 절. 그림자 계열에 한해 공백이 맞다.

| 코드 토큰 | 코드 값 | 유틸리티 | 출처 노드 |
| --- | --- | --- | --- |
| `--text-shadow-disclaimer-glow` | `0 0 1.875rem var(--color-shadow-disclaimer), 0 0 0.625rem var(--color-shadow-disclaimer)` | `text-shadow-disclaimer-glow` | PmaxLayout `19649:32052`의 고지문 text `19649:32055` |

`get_design_context(19649:32055)`가 이 효과를 `0px 0px 30px white, 0px 0px 10px var(--shadow/disclaimer, white)`로 낸다 — 오프셋·스프레드 없이 블러만 30·10인 흰 글로우 2겹이다. 사진 위에 얹히는 레이어라 고지문이 배경과 무관하게 읽히게 하는 장치다.

**두 겹 모두 `--color-shadow-disclaimer`를 참조한다.** Figma는 변수를 두 번째 겹에만 묶고 첫 겹은 리터럴 흰색으로 두었지만, 같은 색으로 같은 글로우를 그리는 두 겹이다. 한쪽을 리터럴로 남기면 `shadow/disclaimer`를 다시 칠하는 날 효과의 절반만 따라 움직인다. `--border-width-hairline`이 `--spacing-hairline`을 참조하는 것과 같은 판단이다.

**블러는 rem이다.** 위 `--shadow-*` 3개는 px지만 이것은 글자 뒤에 깔리는 글로우라, 뒤에 깔린 글자와 함께 커져야 한다. 값 변환 규칙 4번(unitless px → 16px 루트 기준 rem)이 그대로 적용된다.

**`30`을 `var(--spacing-30)`으로 적지 않았다.** 첫 겹의 블러 30은 같은 프레임의 좌우 padding 30(`--spacing-30`)과 정확히 같지만 **우연이다** — padding과 블러 반경은 서로 다른 결정이 움직인다. 식으로 묶으면 `--spacing-92`·`--spacing-82`가 끊어낸 의미 결합을 다시 만드는 것이 된다. 위 [스페이싱](#스페이싱-10) 절의 `13.667` 판정과 같은 규칙이다.

### 이름이 `disclaimer`가 아니라 `disclaimer-glow`인 이유 — 실측으로 확인한 네임스페이스 충돌

구현 요청은 `--text-shadow-disclaimer`였고, **그 이름은 동작하지 않는다.** Tailwind v4는 `text-<이름>`을 `--text-shadow-*`와 `--color-*` **양쪽**에 대해 해석한다. 이 저장소에는 이미 `--color-shadow-disclaimer`가 있으므로 `text-shadow-disclaimer`는 색 유틸리티로도 성립하고, 생성된 규칙에 `color: var(--color-shadow-disclaimer)` — 즉 **흰색** — 이 함께 들어간다.

빌드된 CSS에서 그대로 확인된다(`npm run build-storybook` 산출물):

| 클래스 | 생성된 선언 |
| --- | --- |
| `text-shadow-disclaimer` (요청 이름) | `color: var(--color-shadow-disclaimer)` — **text-shadow는 없음** |
| `text-shadow-disclaimer-glow` (등재 이름) | `text-shadow: 0 0 1.875rem …, 0 0 0.625rem …` — 색 선언 없음 |

`--text-*`가 font-size 네임스페이스인 것 자체는 문제가 아니었다. 실측 결과 Tailwind는 `--text-shadow-*`를 font-size 후보에서 제외한다(`--text-shadow-disclaimer-glow`가 `font-size` 규칙을 만들지 않는다). **충돌한 것은 font-size가 아니라 색이다.**

지금 이 순간 저 흰색이 화면을 깨뜨리지 않는 것은 Tailwind가 `.text-shadow-disclaimer`를 `.text-text-disclaimer`보다 **앞에** 방출해 뒤엣것이 이기기 때문인데, 이것은 정렬 순서의 우연이지 보장이 아니다. 글자색을 명시하지 않은 요소가 이 유틸리티를 쓰면 흰 바탕에 흰 글자가 된다.

`disclaimer-glow`는 우연이 아니라 **구조적으로** 안전하다. 충돌하려면 `--color-disclaimer-glow`가 있어야 하는데, 이 저장소의 semantic 색 이름은 예외 없이 Figma 그룹으로 시작한다(`action` `bg` `border` `brand` `flag` `icon` `review` `shadow` `state` `surface` `text`) — `disclaimer`는 그중 없다. 역할 이름 규칙(`src/tokens/README.md`)도 그대로 만족한다: Figma에 대응하는 글로우 효과 변수가 없으므로 숫자 이름의 전제가 성립하지 않고, "고지문의 글로우"는 값이 아니라 역할이다.

> **일반화.** `--text-shadow-<X>`를 추가할 때는 `--color-<X>`가 있는지 먼저 본다. 있으면 그 이름은 못 쓴다. hook도 `verify:tokens`도 typecheck도 이 충돌을 잡지 못한다 — 생성된 CSS가 유효하기 때문이다. 확인 방법은 하나뿐이다: **빌드한 뒤 그 클래스의 규칙을 직접 조회한다.**

---

## blur (1)

**Figma가 발행하는 유일한 효과 변수다.** `get_variable_defs(19661:17030)`이 `Blur/Background 150`을 `Effect(type: BACKGROUND_BLUR, radius: 150)`으로 반환한다 — 위 shadow·text-shadow 두 축이 "Figma에 효과 변수가 없다"로 시작하는 것과 달리, 이 축만 원천이 있다.

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 | 유틸리티 | 출처 노드 |
| --- | --- | --- | --- | --- | --- |
| `Blur/Background 150` | `--blur-blind` | radius `150` | `75px` | `backdrop-blur-blind` | PmaxBanner `19661:21073`의 Blur blind 판 `19661:17030` |

**Figma 150 → CSS 75는 코드가 한 환산이 아니다.** 같은 노드에 `get_design_context`를 호출하면 export가 그 판을 `backdrop-blur-[75px]`로 낸다 — 75는 **Figma 자신이 CSS로 낸 숫자**다. Figma의 블러 반경은 감쇠 전체를, CSS `backdrop-filter: blur()`는 표준편차를 뜻해서 두 숫자가 다르다. 코드에는 CSS 쪽 값만 적고 150은 어디에도 남기지 않는다 — 이쪽에서 150은 아무 의미가 없다.

**이름에 숫자를 쓰지 않았다.** `--blur-background-150`은 이 토큰이 갖지 않은 숫자를 이름으로 주장한다. `src/tokens/README.md`의 숫자 이름 예외는 "Figma의 숫자가 곧 값"인 스케일 스텝(`spacing/16`)에만 적용되고, 여기는 그 전제가 깨진 자리다. 그래서 역할 이름 — 이 판(Figma 레이어 이름 "Blur blind")의 흐림이다.

**px다.** 위 `--text-shadow-disclaimer-glow`가 rem인 것과 반대이며 이유도 반대다: 그것은 글자 뒤 글로우라 글자와 함께 커져야 하고, 이것은 사진 위 필터라 루트 글자 크기를 따라 커지면 사진이 녹는 정도가 바뀐다.

**네임스페이스.** Tailwind v4는 `backdrop-blur-*`를 `--backdrop-blur-*`가 아니라 **`--blur-*`**에서 읽는다. `--blur-*`는 이 저장소의 신규 네임스페이스이고, 등재 전에는 `backdrop-blur-blind`가 CSS를 아예 생성하지 않았다(`--radius-16` 이전의 `rounded-16`과 같은 무성 실패). 같은 변수로 `blur-blind`(직접 필터)도 생성되지만 사용처는 없다.

**혼자 쓰지 않는다.** 판은 흐림(이 토큰)과 반투명 흰 채움(`--color-surface-blur-blind`) 둘을 함께 그린다. 하나만 쓰면 사진이 그냥 흐려지거나 그냥 밝아질 뿐, Figma의 "글자가 읽히는 판"이 되지 않는다.

---

## 타이포그래피 — 원자 토큰 (14)

| Figma 변수 | 코드 토큰 | Figma 값 | 코드 값 |
| --- | --- | --- | --- |
| `font-family/headline` | `--font-headline` | `LG EI Headline` | `'LG EI Headline', ui-sans-serif, system-ui, -apple-system, sans-serif` |
| `font-family/text` | `--font-text` | `LG EI Text` | `'LG EI Text', ui-sans-serif, system-ui, -apple-system, sans-serif` |
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

> **폰트 패밀리가 1개에서 2개로 갈렸다(4차 동기화).** `font-family/sans`(`Noto Sans KR`)가 컬렉션에서 사라지고 `font-family/headline`·`font-family/text`가 들어왔다. 코드에서도 `--font-sans`를 남겨 두지 않고 지웠다 — Figma가 더 이상 아는 이름이 아니기 때문이다. 어느 스타일이 어느 패밀리를 쓰는지는 아래 텍스트 스타일 표의 `family` 열에 있고, 경계는 `title/*` 4개(headline) 대 나머지 9개(text)에 정확히 걸린다. **`font-size/*`·`font-weight/*`·행간은 이 동기화에서 한 값도 바뀌지 않았다** — 바뀐 것은 패밀리뿐이다.
>
> 실제 face 로드는 `public/fonts/`에 `.otf` 6개가 있어야 한다. LG 전용 라이선스 폰트이고 이 저장소는 공개라 파일을 추적하지 않는다 — 설치 안내는 루트 [`README.md`](../README.md)에 있다. 파일이 없으면 이름만 맞고 렌더는 폴백 폰트로 떨어진다(에러 없음).

> **~~변수가 있다는 것 ≠ 스타일이 그 변수를 쓴다는 것~~ — 해소됨(4차 동기화).** `body/small`(14)과 `title/xlarge`(80)가 크기를 값으로 직접 적던 문제가, 폰트 재편과 함께 재authoring되면서 사라졌다. 이제 두 스타일 모두 `font-size/14`·`font-size/80`을 바인딩하므로 Figma에서 변수를 고치면 스타일이 따라온다. **13개 스타일 전부가 `font-size/*`·`font-weight/*`·`font-family/*`를 참조한다.**

**Figma에 대응 변수가 없는 코드 토큰:**

| 코드 토큰 | 값 | 왜 추가했는가 |
| --- | --- | --- |
| `--leading-14` `--leading-16` `--leading-20` `--leading-24` `--leading-28` `--leading-36` `--leading-42` `--leading-60` `--leading-80` | `0.875rem` `1rem` `1.25rem` `1.5rem` `1.75rem` `2.25rem` `2.625rem` `3.75rem` `5rem` | Figma 텍스트 스타일은 절대 px line-height를 쓰지만 그것을 변수로 노출하지 않는다. 스타일에서 쓰인 px 값을 그대로 스텝으로 명명했다 |
| `--text-30` · `--leading-30` | `1.875rem` · `1.875rem` | Button/Promotion 라벨(`1:17`) 실측. 이 라벨은 **명명된 텍스트 스타일 없이** 크기·굵기·행간을 raw로 적고 있다. `type-cta-large`의 재료다 |
| `--text-19` | `1.1875rem` | BenefitRow tone=black 라벨(`1:496`, `1:385` 안) 실측. 위와 같은 경우다 — 명명된 스타일도, 바인딩된 `font-size/*`도 없다. `type-benefit-label`의 재료다 |
| `--leading-benefit-label` | `1.14` | 같은 라벨의 행간. **이 축에서 유일하게 절대 길이가 아니라 비율이고, 유일하게 역할 이름이다** — 아래 참고 |
| 폰트 fallback 체인 | `ui-sans-serif, system-ui, …` | Figma는 패밀리 이름(`LG EI Headline`·`LG EI Text`) 하나씩만 지정한다. 웹폰트 로드 실패 시를 대비한 fallback은 코드에서 추가. LG EI 는 저장소에 커밋되지 않는 파일이라 이 체인이 실제로 쓰이는 경우가 드물지 않다 |

**`--leading-benefit-label`만 비율인 이유 — 출처의 *형태*가 다르다.** 위 `--leading-*` 9개가 절대 길이인 것은 Figma 텍스트 스타일이 행간을 절대 px로 적기 때문인데, BenefitRow tone=black 라벨은 **텍스트 스타일이 아니고 퍼센트로 적혀 있다.** 근거는 숫자가 아니라 export의 모양이다: `get_design_context(1:386)`이 같은 라벨의 크기와 자간은 `19px`·`0.38px`로 내면서 행간만 **단위 없는 `1.14`**로 낸다. Figma는 절대 행간이면 저 둘과 같은 px로 내므로, 비율이 돌아왔다는 것은 읽을 px이 없다는 뜻이다.

**절대값 `22`(→ `--leading-22`)로 등재하지 않았다.** 22는 닿을 수는 있는 숫자다 — 라벨 프레임이 44 높이에 2줄을 담고 있다. 하지만 **결과이지 원인이 아니고, 계산도 맞지 않는다**: `19 × 1.14 = 21.66`이라 2줄은 43.32이고, 프레임의 44는 텍스트를 세로 중앙 정렬한 자기 높이다(export가 두 줄을 `flex flex-col justify-center` 박스로 감싼다). 44에서 22를 유도하면 **컨테이너 치수를 행간으로 굳히는 것**이라, 위 "토큰화하지 않기로 한 값"의 `19`·`5`가 떨어진 것과 같은 시험에 걸린다. 비율로 두면 크기가 움직여도 Figma의 114%가 유지되지만, 22로 얼려 두면 조용히 다른 퍼센트가 된다. 이름을 숫자로 못 쓰는 이유도 같다 — 이 네임스페이스의 숫자는 **전부 px를 뜻하므로** `--leading-22`는 거짓말이 된다.

## 타이포그래피 — 텍스트 스타일 (13)

CSS 변수가 아니라 **`@utility` 클래스**다. 합성 토큰이므로 `font-size`와 `font-weight`를 손으로 조합하면 Figma 스타일에서 조용히 어긋난다 — 반드시 클래스 하나를 쓴다.

Figma 가이드가 "13개 로컬 Text Style"이라고 명시하며, 13개 전부 매핑됐다. 각 스타일의 `원본 스타일` 열(예: `Web/EI Headline/80-semibold`)은 LG 전사 타입 스케일에서 가져온 출처 표기이므로 코드에는 옮기지 않았다.

| Figma 텍스트 스타일 | 유틸리티 클래스 | family | size | weight | line-height | 용도 |
| --- | --- | --- | --- | --- | --- | --- |
| `title/xlarge` | `type-title-xlarge` | `--font-headline` | `--text-80` (80) | semibold (600) | `--leading-80` (80) | 대형 헤드라인 |
| `title/large` | `type-title-large` | `--font-headline` | `--text-60` (60) | semibold (600) | `--leading-60` (60) | Hero 헤드라인 |
| `title/medium` | `type-title-medium` | `--font-headline` | `--text-56` (56) | semibold (600) | `--leading-60` (60) | 섹션 타이틀 |
| `title/small` | `type-title-small` | `--font-headline` | `--text-32` (32) | semibold (600) | `--leading-36` (36) | 카드·블록 타이틀 |
| `subtitle/large` | `type-subtitle-large` | `--font-text` | `--text-36` (36) | regular (400) | `--leading-42` (42) | Hero 서브 카피 |
| `subtitle/medium` | `type-subtitle-medium` | `--font-text` | `--text-24` (24) | regular (400) | `--leading-28` (28) | 섹션 서브 카피 |
| `subtitle/medium-strong` | `type-subtitle-medium-strong` | `--font-text` | `--text-24` (24) | semibold (600) | `--leading-28` (28) | 강조 서브 카피 |
| `body/default` | `type-body-default` | `--font-text` | `--text-16` (16) | regular (400) | `--leading-20` (20) | 본문 |
| `body/default-strong` | `type-body-default-strong` | `--font-text` | `--text-16` (16) | semibold (600) | `--leading-20` (20) | 본문 강조 |
| `body/small` | `type-body-small` | `--font-text` | `--text-14` (14) | regular (400) | `--leading-16` (16) | 보조 본문 |
| `cta/medium` | `type-cta-medium` | `--font-text` | `--text-16` (16) | semibold (600) | `--leading-16` (16) | 버튼 라벨 |
| `nav/menu` | `type-nav-menu` | `--font-text` | `--text-20` (20) | regular (400) | `--leading-24` (24) | 네비게이션 메뉴 |
| `badge/small` | `type-badge-small` | `--font-text` | `--text-12` (12) | regular (400) | `--leading-14` (14) | 뱃지·라벨 |

Figma 가 각 스타일의 `style` 이름을 패밀리에 따라 다르게 적는다 — `title/*` 4개는 `Semibold`(소문자 b), 텍스트 계열은 `SemiBold`(대문자 B). 폰트 파일명도 같은 방식으로 갈리므로 어느 쪽도 "통일"하면 안 된다(루트 `README.md` 참고).

### Figma 텍스트 스타일이 아닌 코드 전용 유틸리티 (2)

| 유틸리티 클래스 | family | size | weight | line-height | 출처 노드 | 용도 |
| --- | --- | --- | --- | --- | --- | --- |
| `type-cta-large` | `--font-text` ‡ | `--text-30` (30) | regular (400) | `--leading-30` (30) | Button/Promotion `1:17` | 프로모션 버튼 라벨 |
| `type-benefit-label` | `--font-text` ‡ | `--text-19` (19) | semibold (600) | `--leading-benefit-label` (114%) | BenefitRow `1:385` (라벨 `1:496`) | 혜택 라벨(tone=black) |

‡ **이 두 칸만 Figma 판독이 아니라 코드 결정이다.** 두 노드는 텍스트 스타일을 바인딩하지 않으므로 패밀리를 지정하는 주체가 Figma에 없다. 폰트 재편 후 `get_variable_defs(1:15)`·`get_variable_defs(1:385)`를 다시 돌렸고 둘 다 여전히 색상만 반환한다 — 도구 한계가 아니라 authoring 상태다. `--font-text`를 택한 근거는 역할이다: 발행된 13개 중 `font-family/headline`을 쓰는 것은 `title/*` 4개뿐이고, 버튼 라벨(`cta/medium`)과 본문·네비게이션은 전부 `font-family/text`다. Figma가 이 두 라벨에 스타일을 발행하면 그 값을 따른다.

**Figma에 대응 스타일이 없다는 것을 두 경로로 확인했다.** `get_variable_defs(1:15)`가 스타일 항목을 반환하지 않고, `get_design_context(1:16)`에도 "These styles are contained in the design" 절이 없다. 도구의 한계가 아니다 — **같은 `get_variable_defs` 호출이 Button/Text에서는 `subtitle/medium-strong`을 반환한다.** 즉 이 도구는 명명된 스타일을 반환할 수 있는데 `1:15`에는 없는 것이다.

기존 13개 중 재사용 가능한 것이 없다. 가장 가까운 `type-title-small`은 32 / semibold / 36으로 **크기·굵기·행간 셋 다** 다르고, 역할도 카드 타이틀이지 버튼 라벨이 아니다. 그래서 같은 역할(버튼 라벨)의 `type-cta-medium`(Figma `cta/medium`)의 형제로 역할 기반 명명했다.

> **주의: Figma에 `cta/large`라는 스타일은 없다.** 이름이 형제처럼 보이지만 한쪽만 Figma 출처다. Figma가 이 스타일을 발행하면 그 이름으로 개명하고 이 절을 위 표로 옮긴다 — `--color-brand-logo-wordmark` → `--color-brand-secondary`와 같은 경로다.

**`type-benefit-label`도 같은 판정을 같은 두 경로로 받았다.** `get_variable_defs(1:385)`가 `icon/default`·`icon/white`·`text/primary` 셋만 반환하고 스타일 항목이 없는데, **같은 호출이 tone=white 쪽 항목(`1:52`)에서는 `nav/menu` 스타일과 `font-size/20`·`font-family/text`·`font-weight/regular`를 반환한다.** 도구 한계가 아니라 이 variant에 스타일이 없다는 증거다. 재사용 후보도 없다 — tone=white 라벨이 실제로 바인딩하는 `type-nav-menu`가 20/regular/24라 **크기·굵기·행간 셋 다** 다르고, 19를 쓰는 스타일은 이 파일에 하나도 없다.

> **두 tone의 라벨 타이포가 Figma에서 서로 다르다.** tone=white는 `nav/menu`(20-regular)를 바인딩하고 tone=black은 스타일 없이 19-semibold + 자간을 raw로 적는다. 디자인 쪽 불일치로 보이지만 코드에서 통일하지 않았다 — 임의로 고치면 Figma에 없는 것을 발명하는 것이다. **디자이너에게 가져갈 신호**이며 아래 [후속 과제](#후속-과제) 9번에 있다.

**자간이 0이 아닌 유일한 유틸리티다.** 나머지 13개는 전부 `letter-spacing: 0`이다. 값은 토큰으로 빼지 않고 그 13개와 같이 유틸리티 안에 인라인으로 두었다. 다만 `get_design_context(1:386)`이 내는 `0.38px` 대신 **`0.02em`으로 적었다** — 0.38은 19의 정확히 2%이고, em은 그 2%를 유지하는 반면 px는 길이를 얼린다. 이 크기에서 둘은 같은 값이며, em 쪽이 유틸리티 내부와 일관된다(크기는 rem, 행간은 비율이라 이미 사용자 글자 크기를 따르는데 자간만 px면 따라오지 않는다). Figma가 절대 `0.38`을 authoring하는 것으로 확인되면 이 한 줄만 고친다.

모든 스타일의 `letter-spacing`은 Figma에서 `0`이며 그대로 옮겼다. `font-family`는 위 표의 `family` 열대로 `font-family/headline` 4개 · `font-family/text` 9개로 갈린다.

이전 판에 있던 † 각주(`body/small`·`title/xlarge`만 크기가 raw 값)는 **해소되어 삭제했다** — 4차 동기화에서 두 스타일 모두 `font-size/14`·`font-size/80`을 바인딩하게 됐다. 이제 13개 전부가 size·weight·family를 변수로 참조하므로, Figma 안에서 어긋날 수 있는 지점이 남지 않는다.

---

## 미해결 항목

| 항목 | 상태 | 사유 |
| --- | --- | --- |
| 그림자(효과) | **원천에 없음** | Figma 이 노드에 그림자 효과 변수가 정의되어 있지 않다. `design-tokens.css`의 `--shadow-sm/md/lg`는 Figma 추출 이전부터 있던 값이며 **Figma 출처가 아니다**. Figma에 elevation 변수가 생기면 교체한다 |
| LG EI 폰트 파일 | **환경마다 다름 (설치 필요)** | 4차 동기화로 폰트가 `Noto Sans KR`에서 LG 전용 `LG EI Headline`·`LG EI Text`로 바뀌었다. npm 배포본이 없고 이 저장소는 공개라 `.gitignore`가 `public/fonts/*.otf`를 제외한다 — `src/index.css`에 `@font-face` 6개가 선언되어 있지만 **파일이 없는 환경에서는 전부 폴백으로 렌더된다(에러 없음).** `@fontsource/noto-sans-kr` 의존성은 제거됐다. 설치 안내는 루트 [`README.md`](../README.md), 확인은 Storybook `Tokens → Typography` |
| 브레이크포인트 | **원천에 없음** | Figma에 브레이크포인트 변수가 없다. `design-tokens.css`의 `--breakpoint-*`는 Figma 출처가 아니다 |
| ~~`title/xlarge` · `body/small` 크기 바인딩~~ | **해소됨(4차 동기화)** | 두 스타일이 이제 `font-size/80`·`font-size/14`를 바인딩한다. Figma에서 변수를 고치면 스타일이 따라온다 |
| `type-cta-large` · `type-benefit-label` 의 패밀리 | **Figma 쪽 미지정** | 두 노드(`1:15`·`1:385`)가 텍스트 스타일을 바인딩하지 않아 패밀리를 정하는 주체가 Figma에 없다. 코드가 역할 근거로 `--font-text`를 골랐다(위 ‡ 참고). **디자이너에게 가져갈 신호** — 스타일이 발행되면 그 값을 따른다 |
| `action/secondary-border` 미사용 | **Figma 쪽 바인딩 불일치** | 어느 컴포넌트도 이 변수를 쓰지 않는다(사용처는 `Colors.stories.tsx` 갤러리 스와치뿐). Button/Web은 같은 자리에 `border/focus`·`border/strong`·`border/default`를 바인딩했다. **버튼 테두리용으로 발행된 semantic 변수를 실제 버튼이 쓰지 않는 상태**다. 코드에서 이름을 지우면 Figma 변수와의 1:1 대응이 깨지므로 삭제 대상이 아니다 — 디자이너에게 "버튼에 바인딩할 것인가, 폐기할 것인가"를 물어야 한다 |
| `action/*` 나머지는 사용 중 | 해당 없음 (기록용) | 동기화 시점에 `action/secondary-label`·`action/disabled`도 미사용으로 보였으나, **Button/Web만 보고 판단한 착오**였다. 실사용 확인: `action/secondary-label` → Button/Promotion의 black 배경, `action/disabled` → CheckBox. 미사용 여부는 컴포넌트 전체를 대상으로, story 갤러리를 제외하고 세야 한다 |
| 흰 배경이 두 변수로 갈림 | **Figma 쪽 문제(코드는 현행 유지)** | primary hover·disabled와 secondary *enabled*는 `action/primary-label`에, secondary hover·disabled는 `action/secondary`에 바인딩돼 있다. 값은 같다. **코드에서 병합하지 않는다** — 하나는 primary 버튼의 라벨색, 하나는 secondary 버튼의 면색이라 역할이 다르고, 한쪽만 바뀌는 날 병합해 둔 코드가 틀린다 |
| Button/Web `type=primary, state=hover` 색 | **디자이너 확인 필요** | primary hover가 빨강 계열이 아니라 흰 배경 + `border/strong` + `text/primary`다 — hover하면 secondary처럼 보인다. sm·md·lg 3개가 모두 동일하게 그려져 있어 단발 실수로 단정할 수 없어 **Figma 그대로 구현**했다. 의도가 아니라면 Figma를 고치고 재동기화한다 |
| opacity 축 | **원천에 없음 · 토큰 미생성** | Button/Web disabled가 불투명도 30을 쓰지만 Figma에 opacity 변수가 없다. 코드는 Tailwind 내장 `opacity-30`을 쓴다 — 값이 정확히 30%로 1:1 대응해 spacing 같은 조용한 어긋남이 없고, `CLAUDE.md` 목적 1의 위반 표에도 opacity 항목이 없어 토큰을 만들지 않았다. 다만 "토큰이 아닌 내장 값"인 것은 사실이며, opacity가 두 번째 사용처를 가지면 축을 신설한다 |

## 후속 과제

1. ~~**`src/components/Button.tsx` 색상·타이포 마이그레이션**~~ — **완료(3차 동기화).** `Button.tsx`는 셋업 검증용 임시 구현이었고, Figma `Button/Web`(`19649:31393`)의 구현체로 교체되면서 `bg-neutral-900` `text-white` `ring-neutral-300` `outline-neutral-900` `text-sm` `font-medium`이 전부 사라졌다. 내장 `border`(=1px)도 `border-hairline`으로 치환됐다. 남은 비토큰 값은 `opacity-30` 하나이며 사유는 위 [미해결 항목](#미해결-항목)에 있다.
2. **Tailwind 내장 spacing 배수 스케일 차단** — `@theme { --spacing: initial; }`을 추가하면 토큰에 없는 숫자(`p-5`, `h-10`)가 CSS 자체에서 생성되지 않아 위의 "숫자 두 체계" 함정이 사라진다. 지금 켜도 `src/`에는 걸리는 곳이 없다(전수 스캔 확인). 다만 앞으로 추가되는 컴포넌트가 임의 숫자를 쓰면 **조용히 무시**되므로(잘못된 값이 아니라 스타일 없음) 도입 시 그 실패 모드를 문서화해야 한다.
3. **LG EI 폰트 파일 배치** — 4차 동기화로 폰트가 LG 전용 `LG EI Headline`·`LG EI Text`로 바뀌었고 `@fontsource/noto-sans-kr`는 제거됐다. `@font-face` 6개와 토큰·유틸리티는 코드에 있지만 **`.otf` 파일은 저장소에 없다**(공개 저장소이므로 `.gitignore` 제외). 각자 `public/fonts/`에 넣어야 하며 안내는 루트 [`README.md`](../README.md)에 있다. 파일 없이도 빌드·`verify:tokens`·`typecheck`는 통과하므로, **폴백 렌더는 어떤 자동 검사에도 걸리지 않는다** — 확인은 Storybook `Tokens → Typography` + 개발자도구 Rendered Fonts 뿐이다.
4. **`layout/*` 실사용** — 토큰은 정의됐지만 아직 이것을 쓰는 레이아웃 컴포넌트가 없다. 현재 사용처는 `Layout.stories.tsx`의 구조 데모뿐이다.
5. **`IconUI`가 기본 크기를 직접 들고 있다** — `IconUI` 루트에 `size-24`가 박혀 있어 호출부에서 `className="size-18"`을 넘겨도 **조용히 24로 렌더된다.** 특이도가 같고 빌드 CSS에서 `.size-24`가 `.size-18`보다 뒤에 나오기 때문이다. hook·typecheck·빌드 어느 것도 잡지 못하는, 위 "숫자 두 체계"와 같은 부류의 무성 실패다. `ButtonText`는 크기를 래퍼가 들고 `IconUI`에 `size-full`을 넘기는 방식으로 우회했다(`.size-full`은 `.size-24` 뒤에 나와 이긴다). 근본 해결은 `IconUI`에서 기본 크기를 떼어 호출부로 옮기는 것이다.
6. **버튼 3종의 포커스 링이 토큰이 아니다** — Figma에 focus variant가 없어(`Button/Text`의 축은 `default`/`hover` 둘뿐) 발명하지 않았고, 그 결과 브라우저 UA 기본 링에 의존한다. **표시 자체는 있다** — Tailwind v4 preflight가 `outline`을 리셋하지 않아 3개 모두 `:focus-visible`에서 UA 링이 그려지는 것을 헤드리스 렌더로 확인했다(WCAG 2.4.7 충족). 문제는 링 색이 브라우저 값이라 **토큰이 아니고**, 같은 저장소의 `header/Tab.tsx`가 이미 토큰 패턴(`focus-visible:outline-(length:--border-width-hairline) focus-visible:outline-border-focus`)을 쓰고 있어 **포커스 외형이 시스템 안에서 갈린다**는 점이다. 통일하려면 Figma에 focus 디자인이 먼저 있어야 한다 — 지금 코드에서 정하면 Figma에 없는 것을 발명하는 것이다.
8. **`type="button"` 기본값이 컴포넌트마다 다르다** — `ButtonText`만 설정하고 `Button`·`ButtonPromotion`은 설정하지 않아, 후자 둘은 `<form>` 안에서 submit으로 동작한다. Figma와 무관한 코드 레벨 불일치다.
7. **토큰 갤러리가 16개만큼 불완전하다** — `Spacing.stories.tsx` · `Radius.stories.tsx` · `Typography.stories.tsx`에 3차 동기화의 신규 토큰 행이 없고, header 작업에서 등재된 `--spacing-38` · `--spacing-underline` · `--spacing-76` · `--spacing-82` 4개도 `Spacing.stories.tsx`에 없다. BenefitRow 작업의 4개(`--spacing-benefit-label` · `--text-19` · `--leading-benefit-label` · `type-benefit-label`)도 마찬가지로 빠져 있다. `Colors.stories.tsx`에도 이번에 등재된 `--color-border-focus-inverse` 행이 없다 — border 스와치 목록이 4개에서 멈춰 있다.

   **단순 행 추가로 끝나지 않는다.** `Typography.stories.tsx`를 실제로 열어 확인한 함정 2가지:
   - `--leading-*`는 **10개 전부** 빠져 있다. 누락된 행이 아니라 **line-height 섹션 자체가 없다.**
   - `SIZE_STEPS`에 `--text-30`을 넣으면 "Figma `font-size/*` 변수 10개 **전부**"라는 갤러리 문구가 거짓이 된다. `--text-30`은 Figma 변수가 아니라 Button/Promotion 라벨(`1:17`)의 raw 값에서 뽑은 코드 전용 토큰이기 때문이다. 행만 추가하고 문구를 두면 **새 낡은 사실이 생긴다.**
   - `TEXT_STYLES`는 `[Figma 텍스트 스타일, 유틸리티]` 쌍 타입이고 렌더러가 "Figma {스타일명}"으로 출력하는데, `type-cta-large`에는 **대응하는 Figma 스타일이 없다.** 쌍 타입이나 렌더를 손봐야 한다.

   즉 갤러리 보강은 "코드 전용 토큰을 Figma 유래 토큰과 어떻게 구분해 표시할 것인가"를 먼저 정해야 하는 작업이다. 이 문서의 [요약](#요약) 표가 이미 "코드 전용" 열로 그 구분을 도입했으므로, 갤러리도 같은 구분을 따르는 것이 일관적이다.
8. **스페이싱 고역대에 실제 스케일이 필요하다 (디자이너 요청 대상)** — 실측 스텝이 `76 · 78 · 80 · 82 · 88 · 92 · 96`으로 일곱 개가 됐다(`88`은 PmaxLayout Subcopy의 max-height). PmaxLayout 등재로 **30-56 구간도 같은 상태가 됐다** — `30 · 32 · 33 · 36 · 38 · 40 · 42 · 44 · 46 · 48 · 50 · 56`이며 이 중 Figma `spacing/*`은 32 · 40 · 48 셋뿐이다. 요청 내용이 같으므로 별도 항목을 열지 않고 여기에 합산한다: **두 구간 모두 실제 스케일을 발행받아야 한다.** `--spacing-76` 등재 시 "이 구간에 세 번째 이웃이 생기면 실측 스텝을 더 쌓을 때가 아니라 Figma에 실제 스케일이 필요하다는 신호"라고 적어 둔 조건이 **발동한 상태**다(위 [스페이싱](#스페이싱-10) 절). 여섯 값 모두 출처가 다르고 Figma가 따로 움직이므로 코드에서 병합하지 않는다 — 해결은 코드가 아니라 Figma 쪽에서 이 구간의 `spacing/*` 스텝을 발행하는 것이고, 발행되면 실측 스텝을 그 이름으로 교체한다. 그전까지 이 구간에 스텝을 추가할 때는 (a) 새 값이 정말 authoring된 값인지(중앙 정렬의 잔여값 같은 결과가 아닌지)와 (b) 기존 스텝의 합으로 대신하려다 역할이 다른 토큰에 묶이지 않는지를 함께 확인한다.
9. **BenefitRow 두 tone의 라벨 타이포가 Figma에서 갈린다 (디자이너 요청 대상)** — `tone=white`(`1:51`)는 텍스트 스타일 `nav/menu`(20-regular)를 바인딩하는데 `tone=black`(`1:385`)은 **스타일 없이** 19-semibold에 자간까지 raw로 적는다. 같은 컴포넌트 세트의 같은 역할 라벨이므로 의도된 차이로 보기 어렵다. 코드는 원본대로 갈라 두었다(`type-nav-menu` / `type-benefit-label`) — 통일은 Figma에서 먼저 결정할 일이고, 지금 코드에서 정하면 Figma에 없는 것을 발명하는 것이다. 위 [코드 전용 유틸리티](#figma-텍스트-스타일이-아닌-코드-전용-유틸리티-2) 절 참고. Figma가 `tone=black`에도 스타일을 발행하면 `type-benefit-label`을 그 이름으로 개명하고 `--text-19`·`--leading-benefit-label`이 그 스타일의 값과 맞는지 다시 확인한다.

---

## 변경 이력

### 2026-08-15 — PmaxBanner 구현에서 드러난 Figma 변수 (4건, 전부 Figma 출처)

**Figma 변경 없음.** `PmaxBanner`(`19661:21073`)의 캔버스 배경과 "Blur blind" 판(`19661:17030`)이 참조하는 값 4개를 등재했다. 앞선 세 동기화와 달리 **코드 전용 토큰이 하나도 없다** — 4개 모두 Figma가 이름과 값을 발행한 변수다. 기존 토큰의 값·이름은 하나도 바뀌지 않았다.

| 축 | 추가 |
| --- | --- |
| 색상 primitive | `--lg-white-60` (Figma `white-60` — 팔레트 유일의 반투명 primitive) |
| 색상 semantic | `--color-background-lv1` (Figma `background/LV1`) · `--color-surface-blur-blind` (Figma `surface/blur-blind`) |
| **blur** | **축 자체가 신규** — `--blur-blind` (Figma `Blur/Background 150`). Tailwind가 `backdrop-blur-*`를 읽는 네임스페이스 |

**요청받은 이름 3개 중 2개를 바꿨다.** 앞선 배치의 `--text-shadow-disclaimer` 사고 이후 이름을 그대로 받지 않고 원천을 다시 확인한 결과다.

| 요청 이름 | 등재 이름 | 왜 |
| --- | --- | --- |
| `--color-overlay-blind` | `--color-surface-blur-blind` | 발명이 필요 없었다. 색상 문서 프레임이 같은 값을 **그 레이어 이름 그대로** `surface/blur-blind`로 이미 발행한다. 사용 노드가 primitive `white-60`에 바인딩돼 있어 그 노드만 보면 보이지 않는다 |
| `--color-bg-lv1` | `--color-background-lv1` | Figma 그룹이 `bg/`가 아니라 `background/`다. `bg-lv1`은 존재하지 않는 `bg/lv1` 변수를 주장한다 |
| `--blur-blind` | `--blur-blind` (그대로) | Figma 이름이 값 기반(`Background 150`)이고 그 150이 CSS 값도 아니라, 역할 이름이 맞다 |

이 등재에서 드러난 것 3가지:

1. **`get_variable_defs`는 노드마다 다른 층을 보여준다.** 사용 노드(`19661:17030`)는 primitive `white-60`만 반환하고, 색상 문서 프레임(`19561:25592`)은 같은 값의 semantic `surface/blur-blind`를 반환한다. 노드 하나만 읽고 "semantic이 없다"고 판정하면 있는 이름을 두고 새 이름을 발명하게 된다 — **이름을 짓기 전에 문서 프레임을 다시 읽는다.**
2. **Figma가 발행하는 효과 변수가 실은 있었다.** 이 문서는 3·4차 이후 "Figma는 효과 변수를 하나도 발행하지 않는다"고 적어 왔는데 `Blur/Background 150`이 반례다. 그림자 계열이 공백인 것과 효과 전체가 공백인 것은 다르며, 위 [text-shadow](#text-shadow-0--코드-전용-1) 절에 정정을 달았다.
3. **Figma의 숫자와 CSS의 숫자가 다를 수 있다.** 블러 반경 150은 CSS에서 75다. 요청서도 "그 절반"이라고 적어 왔지만 절반이라는 규칙을 믿지 않고 `get_design_context`가 내는 `backdrop-blur-[75px]`로 확인했다 — 환산 규칙을 코드가 기억하면 다음 값에서 틀린다.

이번 세 유틸리티는 등재 후 **빌드 CSS를 조회해 각각의 선언까지 확인**했다(`bg-background-lv1`·`bg-surface-blur-blind`는 `background-color`, `backdrop-blur-blind`는 `backdrop-filter`). 앞 배치의 네임스페이스 충돌 이후 이 확인은 선택이 아니다 — 위 [일반화](#이름이-disclaimer가-아니라-disclaimer-glow인-이유--실측으로-확인한-네임스페이스-충돌) 참고.

### 2026-08-15 — PmaxLayout 구현에서 파생된 코드 전용 토큰 (9건)

**Figma 변경 없음.** `PmaxLayout`(`19649:32052`, 1200 정사각) 구현에서 Figma가 변수로 발행하지 않은 값 9개가 드러나 등재했다. 기존 토큰의 값·이름은 하나도 바뀌지 않았고, 기존 스텝으로 대체 가능한 값도 없었다(8개 값 전부 기존 어느 토큰과도 값이 다르다).

| 축 | 추가 |
| --- | --- |
| 스페이싱 | `--spacing-30` `33` `42` `46` `50` `88` `144` `200` (실측 스텝 8개) |
| **text-shadow** | **축 자체가 신규** — `--text-shadow-disclaimer-glow`. Figma는 효과 변수를 발행하지 않고 색(`shadow/disclaimer`)만 발행한다 |

이 등재에서 드러난 것 3가지:

1. **이름을 요청받은 대로 쓰면 안 되는 경우가 있다.** 요청은 `--text-shadow-disclaimer`였으나 Tailwind가 `text-<이름>`을 `--color-*`에 대해서도 해석하는 탓에 기존 `--color-shadow-disclaimer`와 충돌해, 그 클래스는 **그림자 대신 흰 글자색을** 만든다. 빌드 CSS를 조회해 확인하고 `disclaimer-glow`로 등재했다. 위 [text-shadow](#text-shadow-0--코드-전용-1) 절 참고. **네임스페이스 충돌은 세 검증(hook · `verify:tokens` · typecheck) 어느 것도 잡지 못한다** — 생성된 CSS가 유효하기 때문이며, 3차의 "hook을 통과하는 것과 토큰인 것은 다르다"의 새 형태다.
2. **`get_variable_defs`의 응답이 19개인데 size가 0개일 수 있다.** 지금까지의 실측 스텝은 "size 변수를 몇 개는 주면서 그 값만 빠뜨린" 경우였다. 이 노드는 색·타이포만 19개를 주고 크기는 하나도 주지 않는다 — 3차의 "무엇을 반환하지 *않는지*가 정보다"가 노드 전체 규모로 나타난 사례다.
3. **미등재의 대가가 값의 오차가 아니라 레이아웃의 소실일 수 있다.** `px-200`은 토큰이 없으면 `50rem`으로 컴파일돼 1200 캔버스 좌우에 800씩 밀어 넣고, 카피 블록의 폭을 0으로 만든다. 그런데도 CSS는 유효해 어떤 검증도 통과한다.

### 2026-08-15 — 4차: BenefitRow 구현에서 파생된 코드 전용 토큰 (4건)

**Figma 변경 없음.** `BenefitRow` 컴포넌트 세트(`1:50` — `tone=white` `1:51` · `tone=black` `1:385`)를 구현하면서 Figma가 변수로 발행하지 않은 값 4개가 드러나 등재했다. 기존 토큰의 값·이름은 하나도 바뀌지 않았다.

| 축 | 추가 |
| --- | --- |
| 스페이싱 | `--spacing-benefit-label` (역할 이름 — 스케일 위의 값이 아님) |
| 타이포 | `--text-19` (실측 스텝) · `--leading-benefit-label` (역할 이름 — **비율**) + `@utility type-benefit-label` |

이 동기화에서 드러난 것 2가지:

1. **export의 *단위*가 Figma의 authoring 방식을 알려 준다.** `get_design_context(1:386)`은 같은 라벨의 크기·자간을 `19px`·`0.38px`로 내면서 행간만 단위 없는 `1.14`로 낸다. Figma는 절대 행간이면 px로 내므로 이것은 **퍼센트로 적혀 있다**는 증거이고, 그래서 이 토큰만 절대 길이가 아니라 비율이다. `get_variable_defs`가 무엇을 반환하지 *않는지*가 정보라는 3차의 관찰과 같은 계열 — 응답의 부재만이 아니라 **형태**도 근거가 된다.
2. **닿을 수 있는 숫자가 옳은 숫자는 아니다.** 라벨 프레임 44에서 `44 ÷ 2 = 22`로 행간을 유도할 수 있어 보이지만 `19 × 1.14 = 21.66`이라 맞지 않고, 44는 텍스트를 세로 중앙 정렬한 컨테이너 높이다. 같은 함정이 간격에도 있었다 — `13.667 = 16 × (82 / 96)`이 정확히 떨어져 기존 두 스텝의 식으로 쓸 수 있어 보이지만, 그러면 BenefitRow 간격이 아이콘 마스터 크기와 헤더 인셋에 묶인다. **둘 다 "결과를 원인으로 굳히지 않는다"는 같은 규칙에 걸렸고, 둘 다 잰 값을 그대로 등재하는 쪽으로 판정했다.**

### 2026-08-15 — 3차: 버튼 3종 구현에서 파생된 코드 전용 토큰 (8건)

**Figma 변경 없음.** `button` section(`19586:12041`)의 컴포넌트 세트 3개 — `Button/Promotion`(`1:15`) · `Button/Web`(`19649:31393`) · `Button/Text`(`19661:3700`) — 를 구현하면서, **Figma가 변수로 발행하지 않은 값**들이 드러나 코드 쪽에 스텝으로 등재했다. 기존 토큰의 값·이름은 하나도 바뀌지 않았다.

| 축 | 추가 |
| --- | --- |
| 스페이싱 | `--spacing-18` `--spacing-36` `--spacing-78` `--spacing-80` (실측 스텝) · `--spacing-hairline` (역할 이름) |
| 라디우스 | `--radius-16` (실측 스텝) |
| 타이포 | `--text-30` `--leading-30` 원자 토큰 + `@utility type-cta-large` |
| **border-width** | **축 자체가 신규** — `--border-width-hairline`. Figma는 `border/*` 색상만 발행하고 굵기 변수가 없다 |

이 동기화에서 드러난 것 3가지:

1. **`get_variable_defs`가 무엇을 반환하지 *않는지*가 정보다.** `Button/Text`에서는 텍스트 스타일 `subtitle/medium-strong`을 반환하는 같은 호출이 `Button/Promotion`에서는 스타일 항목을 전혀 반환하지 않는다 → 도구 한계가 아니라 **Figma에 그 스타일이 없다**는 증거다. `type-cta-large`를 역할 기반으로 명명한 근거가 여기서 나왔다.
2. **hook을 통과하는 것과 토큰인 것은 다르다.** 같은 1px에 대해 한 구현은 내장 `border`를 썼고 다른 구현은 내장 `h-px`를 거부했다 — hook이 둘 다 통과시키기 때문에 판정이 갈렸다. border-width 축 신설로 양쪽이 `border-hairline`·`h-hairline`으로 수렴했다. 목적 1(hook)이 목적 3(리뷰)을 대체하지 못한다는 것을 보여주는 사례다.
3. **실측 스텝 등재는 추적성이 아니라 오작동 차단이 주목적이다.** `h-78`·`px-36`·`size-18`·`min-w-80`은 토큰이 없으면 각각 19.5rem·9rem·4.5rem·20rem으로 **조용히** 컴파일된다. CSS가 유효하므로 hook·typecheck·빌드 어느 것도 잡지 못한다.

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
