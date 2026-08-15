import type { ScreenSpec } from './types'

/*
 * Sign in 화면정의서의 내용.
 *
 * Figma 원본
 *   시트 전체:   https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7098
 *   상단 5칸:    https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7175
 *   Description: https://www.figma.com/design/GskFyUHuqkVOzqgytOAenb/?node-id=118-7135
 *
 * 문구는 get_design_context 가 돌려준 텍스트를 한 글자도 고치지 않고 옮겼다.
 * 요약·재작성·맞춤법 교정 금지 — 이 파일이 도면과 어긋나는 순간 문서로서의
 * 값이 없어진다.
 *
 * 원본 표에는 01 위에 "❖" 행이 하나 더 있지만 내용 셀이 비어 있어 01 에
 * 통합된 것으로 보고 sections 에 넣지 않았다(요청자 확정).
 *
 * 그룹 사이의 빈 줄은 항목으로 옮기지 않는다 — 원본에서 그것은 여백이고,
 * ScreenSpecDoc 이 gap 으로 재현한다. 반대로 항목 앞의 공백 들여쓰기는 문구의
 * 일부라 그대로 남겼다(01 의 "  로그인 완료 후 …").
 */
export const signInSpec: ScreenSpec = {
  screen: 'Sign in',
  screenId: 'MBR_010101',
  screenType: 'React',
  location: 'LG.com > Sign in',
  screenKind: 'Page',
  sections: [
    {
      no: '01',
      area: '[Page] Sign in',
      groups: [
        {
          title: '1. 노출 조건',
          items: [
            '- GNB 우측 계정 아이콘 클릭 시 노출',
            '- 비로그인 상태로 마이페이지 · 주문내역 · 위시리스트 진입 시 노출',
            '  로그인 완료 후 진입하려던 페이지로 복귀',
          ],
        },
        {
          title: '2. 검증',
          items: [
            '- 이메일 형식 불일치 시 입력 필드 caution 상태 + 오류 문구 노출',
            '- 미입력 상태에서는 [Continue] 버튼 비활성',
          ],
        },
      ],
    },
    {
      no: '02',
      area: '[Continue] 버튼',
      groups: [
        {
          title: '1. 상태',
          items: ['- 이메일 미입력: 비활성', '- 이메일 입력: 활성'],
        },
        {
          title: '2. 클릭 시',
          items: [
            '- 가입 이력 있음: 비밀번호 입력 화면으로 이동',
            '- 가입 이력 없음: 회원가입 화면으로 이동',
            '- 서버 오류: 페이지 유지, 토스트로 오류 메시지 노출',
          ],
        },
      ],
    },
    {
      no: '03',
      area: '[Remember email] 체크박스 · 소셜 로그인',
      groups: [
        {
          title: '1. Remember email',
          items: ['- 기본 해제 상태', '- 체크 시 다음 방문에 이메일 자동 입력'],
        },
        {
          title: '2. [Join us] 링크',
          items: ['- 회원가입 화면으로 이동'],
        },
        {
          title: '3. 소셜 로그인',
          items: [
            '- Apple · Google · Facebook 3종',
            '- 클릭 시 각 사업자 인증 창 실행',
            '- 성공 시 로그인 처리 후 직전 페이지로 복귀',
          ],
        },
      ],
    },
  ],
}
