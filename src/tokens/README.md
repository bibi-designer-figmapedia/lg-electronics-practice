# Design tokens

`src/tokens/`은 이 저장소에서 **raw 값이 허용되는 유일한 위치**다. 다른 모든 파일은 여기 정의된 토큰만 참조한다. 위반은 `.claude/hooks/check-hardcode.mjs`가 파일에 기록되기 전에 차단한다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `design-tokens.css` | **진입점.** 축별 파일을 `@import`하고, 축 하나에 토큰이 한둘뿐이라 파일을 나눌 이유가 없는 border-width · shadow · text-shadow · blur · breakpoint를 직접 정의한다. 이 중 blur만 Figma 변수 출처이고 나머지는 Figma에 대응 변수가 없다 |
| `colors.tokens.css` | primitive 팔레트(`:root`의 `--lg-*`) + semantic 색상(`@theme`의 `--color-*`) + 뱃지 그라디언트 `@utility bg-gradient-badge` |
| `spacing.tokens.css` | `--spacing-*` 숫자 스텝 — Figma `spacing/*` 10개 + Figma에 변수가 없는 실측 스텝 + 역할 이름 `--spacing-hairline` |
| `radius.tokens.css` | `--radius-*` 숫자 스텝 |
| `typography.tokens.css` | font-family · size · weight · line-height 원자 토큰 + 텍스트 스타일 `@utility type-*` |
| `layout.tokens.css` | 페이지 골격 — 너비는 `--container-*`, 여백·간격은 `--spacing-*`(역할 이름). `spacing.tokens.css` **뒤에** import 해야 한다: `--spacing-gutter`가 그 파일의 스텝을 참조한다 |

**진입점은 항상 `design-tokens.css` 하나**다 — `src/index.css`는 이 파일만 import한다. 축을 추가할 때도 새 `*.tokens.css`를 만들고 여기서 `@import`한다. hook의 면제 목록은 `design-tokens.css`와 `*.tokens.css` 두 패턴만 인정하므로 파일명은 이 규칙을 따라야 한다.

Figma 변수 → 토큰 대응표는 `docs/design-tokens.md`에 있다.

## 네이밍: 값이 아니라 역할로

토큰 이름에 **색상값·수치를 넣지 않는다.** 이름이 값을 가리키면 값이 바뀔 때 이름이 거짓이 된다.

| ⭕ 역할 기반 | ❌ 값 기반 | 왜 |
| --- | --- | --- |
| `--color-accent` | `--color-blue-500` | 강조색이 회색으로 바뀌어도 이름이 유효하다 |
| `--color-text-muted` | `--color-gray-600` | "덜 강조된 본문"이라는 의도가 이름에 남는다 |
| `--spacing-md` | `--spacing-16` | 값을 조정해도 호출부를 고치지 않는다 |
| `--radius-lg` | `--radius-12px` | 단위가 바뀌어도 이름이 그대로다 |

역할 이름은 3단계까지 쓴다: `--color-<역할>-<변형>` (`--color-accent-hover`, `--color-text-inverse`).

### 예외 3가지

이 규칙에는 등재된 예외가 **3개**뿐이다. 그 외에는 위 표가 그대로 적용된다.

| 예외 | 범위 | 사유 |
| --- | --- | --- |
| **스케일 스텝의 숫자 이름** | `--spacing-*` · `--radius-*` | Figma가 `spacing/16`·`radius/8`이라는 숫자 이름을 정본으로 쓴다. 코드에서 `--spacing-md`로 개명하면 Figma에 없는 매핑을 코드가 발명하게 되고, 디자이너가 말하는 "spacing 16"과 개발자가 읽는 `p-md`가 어긋난다. 숫자를 유지해 1:1 추적을 택했다. 값이 바뀌면 Figma 쪽 이름도 함께 바뀐다 |
| **primitive 팔레트 이름** | `colors.tokens.css`의 `:root` 안 `--lg-*` | primitive 레이어에서는 색상값 자체가 정체성이다(`--lg-active-red`). 대신 이들은 `@theme` 밖에 있어 **유틸리티로 노출되지 않는다** — 컴포넌트는 semantic 레이어(`--color-*`)만 쓸 수 있다 |
| **서드파티 브랜드 마크 색** | `--color-brand-google-*` · `--color-brand-facebook` | 벤더 로고의 고정 색이다. 우리가 바꿀 수 없으므로 "다시 가리킬 역할"이 존재하지 않고, 색상값 자체가 계약이다 — Google 자산 스펙이 쓰는 red/yellow/green/blue를 그대로 쓴다. 역할 이름(`--color-brand-social-1` 등)을 붙이면 추적 불가능해진다. primitive 예외와 같은 논리를, 우리 것이 아닌 팔레트에 적용한 경우 |

**그 외 semantic 레이어(`--color-*`)에는 예외가 없다.** `--color-text-primary` ⭕ / `--color-black` ❌. 세 번째 예외는 **LG가 값을 통제하지 못하는 색에만** 적용된다 — 우리 팔레트의 색에 색상값 이름을 붙이는 근거로 쓰지 않는다.

### 실측 스텝도 숫자 이름을 쓴다 — 단, 스케일 위의 값일 때만

Figma에 변수가 없는 실측 프레임 값(`--spacing-44` `--spacing-78` 등)에도 위 예외를 적용한다. 이유는 하나 더 있다: **Tailwind v4는 이름 없는 숫자를 `n × 0.25rem`으로 조용히 계산한다.** `h-78`은 토큰이 없으면 19.5rem으로 렌더되고 빌드·타입체크·hook 어느 것도 잡지 못한다. 디자이너가 잰 78과 개발자가 쓴 `h-78`을 일치시키려면 그 숫자를 스텝으로 등재하는 수밖에 없다.

**스케일 위의 값이 아니면 이 예외가 적용되지 않는다.** `--spacing-hairline`(1px)이 그 경우다 — 숫자로 이름 붙이면 `--spacing-1`이 되어 Tailwind 내장 `h-1`(0.25rem)을 덮어쓰고, 헤어라인은 루트 글자 크기를 따라 굵어져서도 안 되므로 rem 스케일에 속하지도 않는다. 스케일의 한 칸이 아니라 "가장 얇은 선"이라는 역할이므로 역할 이름을 쓴다.

같은 판정을 받은 예가 둘 더 있다. `--spacing-benefit-label`(13.667)은 **소수**라 4부터의 정수 스케일 위의 값이 아니고, `--leading-benefit-label`(1.14)은 **비율**이라 절대 px `--leading-*` 스케일 위의 값이 아니다 — 이 네임스페이스의 숫자 이름은 전부 px를 뜻하므로 `--leading-22` 같은 이름은 값을 잘못 말하게 된다. 반면 같은 작업에서 등재된 `--text-19`는 스케일 위의 실측값이라 숫자 이름을 그대로 쓴다(`--text-30`과 같은 사례). 판정 기준은 "Figma 변수가 있느냐"가 아니라 **"스케일의 한 칸이냐"**다.

타이포그래피 텍스트 스타일은 CSS 변수가 아니라 `@utility type-*` 클래스다 — 합성 토큰(family+size+weight+line-height)이라 변수 1개에 담기지 않는다. 자세한 이유는 `typography.tokens.css` 주석 참고.

## 사용법

Tailwind v4가 `@theme`의 키를 유틸리티로 노출한다 — 컴포넌트에서 `var()`를 직접 쓸 일은 거의 없다.

| 토큰 | 유틸리티 클래스 |
| --- | --- |
| `--color-bg-subtle` | `bg-bg-subtle` |
| `--color-text-tertiary` | `text-text-tertiary` |
| `--color-border-default` | `border-border-default` |
| `--color-brand-facebook` | `bg-brand-facebook` · `text-brand-facebook` · `fill-brand-facebook` |
| `--spacing-24` | `p-24` · `gap-24` · `mt-24` |
| `--spacing-56` | `size-56` · `w-56` · `h-56` |
| `--radius-8` | `rounded-8` |
| `--spacing-hairline` | `h-hairline` · `w-hairline` |
| `--border-width-hairline` | `border-hairline` · `border-b-hairline` |
| `--shadow-md` | `shadow-md` |
| `--text-shadow-disclaimer-glow` | `text-shadow-disclaimer-glow` |
| `--blur-blind` | `backdrop-blur-blind` (`--backdrop-blur-*`라는 네임스페이스는 없다) |
| `--breakpoint-lg` | `lg:` 변형 |
| `--container-container` | `max-w-container` · `w-container` |
| `--spacing-gutter` | `gap-gutter` · `px-gutter` |
| (텍스트 스타일) | `type-title-large` · `type-body-default` · `type-cta-medium` … |
| (그라디언트) | `bg-gradient-badge` |

`bg-bg-*`·`text-text-*`의 접두어 중복은 Figma 그룹 이름(`bg/`, `text/`)을 그대로 옮긴 결과다. 어색하지만 Figma 변수와 클래스 이름이 1:1로 대응한다.

**접두어는 Figma 그룹 이름 그대로 쓴다 — 비슷한 그룹으로 줄여 쓰지 않는다.** `background/LV1`은 `--color-background-lv1`(`bg-background-lv1`)이지 `--color-bg-lv1`이 아니다. 색상 문서 프레임이 발행하는 `bg/*`는 다섯 개뿐이고 그중 `bg/lv1`은 없으므로, 줄여 쓴 이름은 **존재하지 않는 변수를 주장**하고 Figma가 나중에 그 이름을 발행하면 자리를 뺏는다. `banner/label`을 `text/*`에 합치지 않은 것과 같은 규칙이다.

**글자 크기·굵기를 개별로 지정하지 않는다.** `text-32 font-semibold`처럼 조합하면 Figma 텍스트 스타일에서 조용히 어긋난다 — `type-title-small` 하나를 쓴다. `text-*`·`font-weight-*`·`leading-*` 원자 토큰은 `type-*` 클래스를 정의하기 위한 재료다.

**헤어라인은 이름이 하나, 토큰이 둘이다.** 같은 굵기를 그리는 방법이 둘이고 Tailwind는 네임스페이스마다 변수를 따로 요구한다 — 실제 CSS 테두리는 `border-hairline`(+`border-border-*`로 색), 채워진 인디케이터 막대는 `h-hairline`(+`bg-*`로 색). 값은 `--border-width-hairline`이 `--spacing-hairline`을 참조하므로 한 곳에만 있다. Tailwind 내장 `border`(=1px)는 토큰이 아니므로 쓰지 않는다.

**`--text-shadow-<X>`를 추가하기 전에 `--color-<X>`가 있는지 본다.** Tailwind는 `text-<이름>`을 `--text-shadow-*`와 `--color-*` **양쪽**에 대해 해석하므로, 두 이름이 겹치면 그 클래스가 그림자와 함께 **글자색까지** 바꾼다. `--text-shadow-disclaimer`가 그 경우였다(`--color-shadow-disclaimer`와 충돌) — 그래서 `--text-shadow-disclaimer-glow`로 등재했다. 이 충돌은 생성된 CSS가 유효해서 hook · `verify:tokens` · typecheck 어느 것도 잡지 못한다. 확인 방법은 **빌드한 뒤 그 클래스의 규칙을 직접 조회하는 것뿐**이다. 자세한 내용은 `docs/design-tokens.md`의 text-shadow 절.

**이 확인은 text-shadow 전용 절차가 아니다.** 토큰을 추가할 때마다 빌드된 CSS에서 그 유틸리티가 **어떤 속성을 내는지**까지 본다 — 클래스가 생성됐다는 사실만으로는 위 사고를 잡지 못한다(`text-shadow-disclaimer`도 생성은 됐다). 예: `bg-background-lv1`·`bg-surface-blur-blind`는 `background-color`를, `backdrop-blur-blind`는 `backdrop-filter`를 내야 한다.

CSS 안에서 필요하면 `var(--color-bg-subtle)`로 참조한다. primitive(`--lg-*`)는 참조하지 않는다.

## raw 값 금지

- 컴포넌트·페이지·story·CSS 어디에도 hex · `rgb()` · `hsl()` · px/rem 리터럴 · Tailwind arbitrary value(`p-[13px]`, `text-[#ff0000]`)를 쓰지 않는다.
- **토큰에 없는 값이 필요하면 여기에 토큰을 추가한 뒤 참조한다.** 컴포넌트에 값을 적는 우회는 없다.
- 새 토큰을 추가할 때는 위 네이밍 규칙을 먼저 통과시킨다. 역할 이름이 떠오르지 않는다면 그 값은 아직 토큰이 될 준비가 안 된 것이다 — 기존 토큰으로 해결되는지 다시 본다.

## token-exempt (예외)

hook을 통과시켜야 하는 정당한 raw 값은 줄 끝에 사유와 함께 표기한다.

```css
transform: translateY(1px); /* token-exempt: 1px optical nudge, not a spacing step */
```

- **사유가 없으면 면제되지 않는다.** `token-exempt`만 적으면 차단된다.
- 시각 값을 토큰화하기 귀찮아서 쓰는 것은 남용이다. 정당한 사례는 서브픽셀 보정, 서드파티 API가 요구하는 고정 단위처럼 **토큰화가 의미 없는 값**뿐이다.
- 색상에는 쓰지 않는다. 색은 예외 없이 토큰이다.
