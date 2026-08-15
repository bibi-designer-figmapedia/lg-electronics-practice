# lg-electronics-practice

Figma 디자인 시스템을 코드로 변환하는 하네스. 규칙·완료 기준은 [`CLAUDE.md`](./CLAUDE.md),
토큰 레이어 설명은 [`src/tokens/README.md`](./src/tokens/README.md), Figma 변수 ↔ 코드 토큰
대응표는 [`docs/design-tokens.md`](./docs/design-tokens.md) 에 있다.

스택: Vite 6 · React 19 · TypeScript 5 · Tailwind CSS v4 · Storybook 8

```bash
npm install
npm run storybook        # 컴포넌트 갤러리
npm run verify:tokens    # 하드코딩 0건 검사
npm run verify:process   # 컴포넌트 4단계 산출물 검사
npm run typecheck
```

---

## 폰트 설치 — 별도로 받아야 한다 (필수)

**이 저장소에는 폰트 파일이 없다.** `npm install` 로 받아지지 않으며, 파일을 넣지 않으면
모든 텍스트가 폴백 폰트로 렌더된다 — 에러는 나지 않고 조용히 어긋난다.

이 디자인 시스템은 **LG EI** 를 쓴다. LG 전용 라이선스 폰트라 npm 배포본이 없고,
**이 저장소는 공개**이므로 `.gitignore` 가 `public/fonts/*.otf` 를 제외한다. 커밋해도
되는지는 저장소 소유자가 판단한다.

### 1. 파일 6개를 `public/fonts/` 에 넣는다

사내 브랜드 자산 배포처에서 받아 아래 이름 그대로 배치한다.

```
public/fonts/
├── LGEIHeadline-Regular.otf
├── LGEIHeadline-Semibold.otf     ← 소문자 b
├── LGEIHeadline-Bold.otf
├── LGEIText-Regular.otf
├── LGEIText-SemiBold.otf         ← 대문자 B
└── LGEIText-Bold.otf
```

> **파일명 대소문자를 고치지 말 것.** Headline 은 `-Semibold`(소문자 b), Text 는
> `-SemiBold`(대문자 B) 다. Figma 도 같은 방식으로 어긋나 있다 — `title/*` 스타일은
> `style: Semibold` 를, 나머지 텍스트 스타일은 `style: SemiBold` 를 보고한다. 오타가
> 아니므로 "통일"하면 해당 face 의 `src` 가 404 가 되고 그 굵기만 조용히 폴백한다.
> macOS 기본 파일시스템은 대소문자를 구분하지 않아 로컬에서는 통과하고 CI(리눅스)에서만
> 깨질 수 있다.

### 2. 확인

```bash
ls public/fonts/*.otf | wc -l   # 6 이어야 한다
npm run storybook
```

Storybook 의 **Tokens → Typography** 스토리를 열어 `--font-headline` · `--font-text` 가
각각 `LG EI Headline` · `LG EI Text` 로 표시되는지 보고, 개발자도구 Computed →
Rendered Fonts 에서 실제로 그 face 가 쓰였는지 확인한다. 변수 이름이 맞게 나오는 것과
face 가 실제로 로드된 것은 별개다 — 이름만 맞고 파일이 없으면 폴백으로 렌더된다.

### 폰트가 코드에 걸리는 경로

| 위치 | 역할 |
| --- | --- |
| `public/fonts/*.otf` | 파일 (추적 안 됨) |
| `src/index.css` | `@font-face` 6개 — 패밀리 2개 × Regular 400 · SemiBold 600 · Bold 700, `font-display: swap` |
| `src/tokens/typography.tokens.css` | `--font-headline` · `--font-text` 토큰과 폴백 체인, `type-*` 유틸리티 15개 |
| `.storybook/main.ts` | `staticDirs: ['../public']` — 없으면 Storybook 에서만 404 난다 |

Bold 700 은 `@font-face` 로 선언만 되어 있고 **어떤 토큰도 선택하지 않는다.** Figma
Typography 컬렉션에 `font-weight/bold` 가 없고, 텍스트 스타일 13개는 전부 regular(400)
또는 semibold(600) 를 바인딩한다. 굵기 스텝을 늘리는 것은 토큰 레이어의 결정이므로
Figma 가 먼저 공개해야 한다.

### 패밀리 배분

Figma 텍스트 스타일이 각각 패밀리를 명시하므로 추측하지 않는다. 경계는 `title/*` 그룹에
정확히 걸린다.

| 패밀리 | Figma 텍스트 스타일 |
| --- | --- |
| `font-family/headline` → `--font-headline` | `title/xlarge` · `title/large` · `title/medium` · `title/small` |
| `font-family/text` → `--font-text` | `subtitle/large` · `subtitle/medium` · `subtitle/medium-strong` · `body/default` · `body/default-strong` · `body/small` · `cta/medium` · `nav/menu` · `badge/small` |

Figma 에 대응 스타일이 없는 `type-cta-large` · `type-benefit-label` 두 유틸리티는
`--font-text` 를 쓴다. 이것은 Figma 판독이 아니라 **코드 결정**이며 근거는 각 유틸리티의
주석에 있다.
