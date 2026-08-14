---
name: figma-to-code
description: Figma 링크나 노드 ID를 토큰 기반 React 컴포넌트로 구현한다. Figma URL이 포함된 구현 요청, "이 디자인 구현해줘", "Figma대로 만들어줘" 같은 요청에 사용한다.
---

# /figma-to-code

**이 스킬은 항상 `figma-implementer` 에이전트를 Agent 도구로 호출한다. 직접 구현하지 않는다.**

## 절차

1. **Figma 출처 확인** — 요청에 Figma URL 또는 노드 ID가 있는지 본다.
   - 없으면 **사용자에게 요청한다.** 추측으로 진행하지 않는다 (원칙 1).
   - Figma 출처가 애초에 없는 신규 컴포넌트 요청이면 이 스킬이 아니라 `/new-component`다.
2. **`figma-implementer` 호출** — Agent 도구로 호출하며 다음을 그대로 전달한다:
   - Figma URL / 노드 ID
   - 컴포넌트 이름과 배치 경로
   - 사용자가 명시한 variant·상태·반응형 요구
   - 범위 제약: 요청한 컴포넌트 외 파일을 건드리지 말 것
3. **결과 확인** — 에이전트가 산출물 4개를 냈는지 본다: Figma 참조 · 토큰 매핑 · `*.tsx` · `*.stories.tsx`(design parameter).
4. **`/review-design`으로 이어간다** — 구현 에이전트의 자체 검증만으로 완료를 선언하지 않는다.

## 하지 않는 것

- 이 스킬 안에서 직접 파일을 만들거나 고치지 않는다.
- Figma MCP를 이 스킬에서 호출하지 않는다 — MCP 직접 호출은 `figma-implementer`의 역할이다.
- 에이전트가 FAIL을 보고했는데 완료로 요약하지 않는다.
