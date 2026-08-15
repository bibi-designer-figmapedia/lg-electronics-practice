/*
 * 화면정의서(스펙 문서) 템플릿의 데이터 계약.
 *
 * Figma 원본 (템플릿의 출처가 된 첫 화면)
 *   https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7098
 *
 * 이 파일은 타입만 정의한다. 화면 1건의 내용은 `<이름>.spec.ts` 가 갖고,
 * 그리는 일은 ScreenSpecDoc.tsx 가 한다 — 새 화면을 추가할 때 건드릴 파일은
 * spec 하나뿐이라는 것이 이 3분할의 목적이다.
 *
 * 상단 5칸을 자유 배열이 아니라 명명 필드로 고정한 이유: 화면정의서 양식은
 * 화면 · 화면 ID · 화면타입 · LOCATION · 화면구분 5칸으로 항상 같다. 배열로
 * 두면 칸이 빠지거나 라벨이 어긋나도 타입이 잡아 주지 못한다.
 */

/** Description 셀 안의 소제목 1개와 그에 딸린 항목들. */
export type SpecGroup = {
  /** 소제목. 예: "1. 노출 조건" */
  title: string
  /** 항목. 원본 문구를 그대로 담는다. 예: "- GNB 우측 계정 아이콘 클릭 시 노출" */
  items: string[]
}

/** Description 표의 한 행. */
export type SpecSection = {
  /** 행 번호. 예: "01" */
  no: string
  /** 영역명. 예: "[이메일] 입력 필드" */
  area: string
  groups: SpecGroup[]
  /**
   * 이 영역이 쓰는 디자인 시스템 컴포넌트. 시스템에 없는 요소는 뒤에
   * "— 신규 필요" 와 그 이유를 붙인다.
   *
   * groups 의 items 와 달리 앞의 "- " 를 데이터에 넣지 않는다. items 는 Figma 문구를
   * 한 글자도 고치지 않고 옮기는 칸이라 원본의 글머리표까지 그대로 들어가지만, 이
   * 칸은 문서 작성자가 채우는 우리 쪽 필드다. 글머리표는 ScreenSpecDoc 이 붙인다.
   */
  components?: string[]
  /** 비고. 이 영역에만 붙는 단서. 예: 배포 전 제거 대상 표기. */
  note?: string
}

/** 화면정의서 1건 전체. */
export type ScreenSpec = {
  /** 화면 */
  screen: string
  /** 화면 ID */
  screenId: string
  /** 화면타입 */
  screenType: string
  /** LOCATION */
  location: string
  /** 화면구분 */
  screenKind: string
  sections: SpecSection[]
}
