---
name: new-component
description: Figma 없이 기존 토큰만으로 컴포넌트를 새로 만들거나 variant/size를 추가한다. "버튼 만들어줘", "이 컴포넌트에 variant 추가" 같은 요청에 사용한다.
---

# /new-component

**이 스킬은 항상 `component-builder` 에이전트를 Agent 도구로 호출한다. 직접 구현하지 않는다.**

## 절차

1. **경로 판별** — 요청에 Figma URL/노드 ID가 있으면 이 스킬이 아니다. `/figma-to-code`로 보낸다.
2. **요구 확정** — 컴포넌트 이름, 필요한 variant·size·상태, 접근성 요구가 불명확하면 **먼저 질문한다** (원칙 1). 스스로 정의하지 않는다.
3. **`component-builder` 호출** — Agent 도구로 호출하며 다음을 전달한다:
   - 컴포넌트 이름과 배치 경로
   - 필요한 variant/size/상태 목록 (요청된 것만)
   - Surgical 제약: 요청한 파일 외 편집 금지, 요청하지 않은 prop·추상화 추가 금지
   - 새 토큰이 필요하면 직접 만들지 말고 `token-guardian`으로 넘길 것
4. **토큰 부족 시 분기** — 에이전트가 "기존 토큰으로 표현 불가"를 보고하면 `/sync-tokens`로 토큰을 먼저 추가한 뒤 이 스킬을 다시 실행한다.
5. **`/review-design`으로 이어간다.**

## 산출물 주의

Figma 출처가 없으므로 **목적 3의 산출물 1(Figma 참조)이 비어 있다.** `verify:process` 기준으로는 미완료로 잡히는 것이 정상이며, 이 사실을 완료 보고에서 숨기지 않는다.

## 하지 않는 것

- 이 스킬 안에서 직접 파일을 만들거나 고치지 않는다.
- 토큰 파일(`src/tokens/**`)을 건드리지 않는다 — `token-guardian`의 영역이다.
