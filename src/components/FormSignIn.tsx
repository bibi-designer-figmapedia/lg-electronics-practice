import type { FormHTMLAttributes, ReactNode } from 'react'
import { Button } from './Button'
import { ButtonSocial } from './ButtonSocial'
import { CheckBoxSet } from './CheckBoxSet'
import { Input } from './Input'

/*
 * FormSignIn — Figma "Form/SignIn" 의 구현체. 이메일 로그인 + 소셜 로그인 카드.
 *
 * Figma 원본 (산출물 1)
 *   component:                https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-15302
 *   parent section "sign-in": node-id=19661-16991
 *
 *   내부 노드 (get_design_context(19661:15302) 가 내준 트리 그대로)
 *     19661-15249  container   제목 + 입력 영역        gap spacing/24
 *     19661-15250  text        "Sign in or join us with your email."
 *     19661-15251  container   Input + Button          gap spacing/20
 *     19661-15252  Input       인스턴스 (높이 48)
 *     19661-15253  Button/Web  인스턴스 (불투명도 30)
 *     19661-15254  container   체크박스 + 구분선 + 소셜 gap spacing/20
 *     19661-15255  checkboxArea                        gap spacing/12
 *     19661-15257  container   안내 문단 감싸개
 *     19661-15258  text        안내 문단 + "Join us"
 *     19661-15259  container   구분선 + 소셜 목록      gap spacing/16
 *     19661-15260  Container   "or" 줄 (높이 24)
 *     19661-15261  Paragraph   선 + "or" + 선          gap spacing/8
 *     19661-15262  Text        왼쪽 선
 *     19661-15263  text        "or"
 *     19661-15264  Text        오른쪽 선
 *     19661-15265  List        소셜 버튼 3개           gap spacing/16
 *     19661-15266 / 15269 / 15276  ListItem 인스턴스 (apple / google / facebook)
 *
 *   variant 축은 없다. Figma 에 이 컴포넌트의 다른 상태가 그려져 있지 않다.
 *
 * 재사용한 컴포넌트 (원칙 2 — 새로 만들지 않았다)
 *   Input        19661:15252 와 1:1. size="lg"(높이 48) · state="default".
 *   Button       19661:15253 과 1:1. variant="primary" · size="md" · disabled ·
 *                trailingIcon={false}. Figma 인스턴스의 불투명도 30 은 Button 의
 *                primary disabled 스타일에 이미 들어 있다 — 여기서 다시 칠하지 않는다.
 *   CheckBoxSet  기본값 그대로에 label 만 "Remember email".
 *   ButtonSocial 19661:15266 / 15269 / 15276 과 1:1.
 *
 *   "Join us" 에 ButtonText 를 쓰지 않았다. Figma 원본(19661:15258)에서 이것은 별도
 *   컴포넌트 인스턴스가 아니라 한 문단 안의 인라인 텍스트 조각이고, ButtonText 가 가진
 *   밑줄 · 후행 아이콘 · cta 타이포가 하나도 없다. 문단 크기(16)와 색(text/brand)만
 *   다르다. 컴포넌트를 끼워 넣으면 원본에 없는 장식이 붙으므로 span 으로 옮겼다.
 *
 * 토큰 매핑 (산출물 2) — Figma 변수는 get_variable_defs(19661:16991) 로 읽었다.
 * 값 자체는 여기 적지 않는다(레이어 3 hook 대상). 값은 src/tokens/ 를 볼 것.
 *
 *   용도                          Figma 변수 / 실측    코드 토큰                    유틸리티
 *   카드 배경                     bg/default           --color-bg-default           bg-bg-default
 *   카드 모서리 반경              radius/12            --radius-12                  rounded-12
 *   카드 좌우 padding             spacing/32           --spacing-32                 px-32
 *   카드 상하 padding             spacing/40           --spacing-40                 py-40
 *   카드 세로 간격                spacing/20           --spacing-20                 gap-20
 *   제목↔입력영역 간격            spacing/24           --spacing-24                 gap-24
 *   Input↔Button 간격             spacing/20           --spacing-20                 gap-20
 *   체크박스↔안내문단 간격        spacing/12           --spacing-12                 gap-12
 *   구분선↔소셜목록 간격          spacing/16           --spacing-16                 gap-16
 *   소셜 버튼 사이 간격           spacing/16           --spacing-16                 gap-16
 *   선↔"or" 간격                  spacing/8            --spacing-8                  gap-8
 *   "or" 줄 높이                  변수 없음, 실측 24   --spacing-24                 h-24
 *   구분선 두께                   변수 없음, 실측 1    --spacing-hairline           h-hairline
 *   구분선 색                     border/strong        --color-border-strong        bg-border-strong
 *   제목 타이포                   subtitle/medium-strong  type-subtitle-medium-strong
 *   제목 색                       text/disclaimer      --color-text-disclaimer      text-text-disclaimer
 *   필수 표시(*)                  text/brand           (미적용 — 위 "원본과 다르게" 4번)
 *   안내 문단 타이포              body/default         type-body-default            type-body-default
 *   안내 문단 색                  text/disclaimer      --color-text-disclaimer      text-text-disclaimer
 *   "Join us" 색                  text/brand           --color-text-brand           text-text-brand
 *   "or" 타이포                   fontSize/14 + regular  type-body-small            type-body-small
 *   "or" 색                       mid-gray-2           --color-text-tertiary        text-text-tertiary
 *   Input · Button · CheckBoxSet · ButtonSocial 의 내부 토큰은 각 파일의 매핑표 참고
 *
 *   mid-gray-2 는 Figma 의 원시(primitive) 변수다. 역할 토큰 text/tertiary 가 같은 값을
 *   가리키므로 새 토큰을 만들지 않고 --color-text-tertiary 에 매핑했다(원칙 2).
 *
 * 원본과 다르게 구현한 4가지 — 전부 의도된 것이고 이유가 있었다. 1번은 해소되어 지금
 * 남은 것은 2·3·4 세 개다. 번호는 다른 파일이 참조하므로 다시 매기지 않는다.
 *   1. ~~폰트 패밀리 대체 ("or")~~ — 해소됨. Figma 가 이 한 줄만 다른 패밀리로 지정하고
 *      나머지는 font-family/sans 였던 상황이, Typography 컬렉션이 font-family/headline ·
 *      font-family/text 두 개로 재편되면서 사라졌다. 이제 이 화면의 본문 텍스트가 전부
 *      font-family/text = "LG EI Text" 이므로 "or" 도 같은 패밀리이고, type-body-small
 *      이 그 패밀리를 참조한다 — 대체가 아니라 원본과 같은 지정이다. 새 타이포 토큰은
 *      여전히 만들지 않았다. 단, 실제 face 로드는 public/fonts/ 에 .otf 파일이 있어야
 *      한다(루트 README.md). 파일이 없으면 이 화면 전체가 폴백으로 렌더된다.
 *   2. "or" 구분선의 폭
 *      Figma 의 선은 172 고정 폭이고 그 둘을 감싼 Paragraph 도 392 고정이다. 고정 폭을
 *      옮기면 카드 폭이 바뀔 때 선이 따라오지 않고, 그 값들을 표현할 토큰도 없다.
 *      대신 두 선에 flex-1 을 줘 남는 자리를 나눠 갖게 했다 — 카드가 원본 폭일 때
 *      결과가 같고, 다른 폭에서도 깨지지 않는다.
 *   3. 카드 · 문단의 고정 폭
 *      원본은 카드 450 · 안내 문단 348 고정이다. 둘 다 토큰에 없는 값이라 옮기지
 *      않았고, 카드는 부모가 준 폭을 채우고 문단은 그 안에서 흐른다. 폭은 호출부가
 *      정한다 — Input.tsx 가 이미 같은 규칙을 쓴다.
 *   4. Input 의 필수 표시(*) 색 — 요청자가 확정한 선택이다
 *      Figma 는 "Lorem ipsum" + 빨간 "*" 를 입력칸 **안쪽**에 그려 두었다. 위치는
 *      원본 그대로 placeholder 로 옮겼다. 다만 실제 input 요소의 placeholder 는 일부
 *      글자만 다른 색으로 칠할 수 없어 "*" 가 나머지 글자와 같은 색으로 나온다.
 *      **남은 차이는 이 하나뿐이다** — 문구 전체의 색은 placeholder:text-text-primary
 *      로 원본과 같게 고정했다(아래 className 주석 참고).
 *      색까지 맞추려면 Input.tsx 에 슬롯 prop 을 뚫어야 하는데, Input 은 다른 화면들이
 *      이미 쓰는 공용 컴포넌트다. 레이아웃 일치를 우선해 색 차이를 받아들였다.
 *      (검토 이력: 입력칸 위에 진짜 label 을 그리는 안도 있었다. 접근성은 그쪽이 낫지만
 *      원본에 없는 행이 생겨 카드가 높아지므로 반려됐다. 대신 아래 aria-label 로
 *      접근 가능한 이름을 유지한다.)
 *      문구 "Lorem ipsum" 은 Figma 에 적힌 그대로다 — 임의로 "Email" 로 바꾸지
 *      않았다(원칙 1).
 *
 * 나중에 추가된 선택 prop 2개 (기본값이 이전 동작과 같아 기존 사용처는 그대로다)
 *   emailPlaceholder  시트마다 인스턴스에서 override 되는 값이라 열었다. 기본값은
 *                     컴포넌트 원본의 문구 그대로다.
 *   annotations       화면정의서가 얹는 번호 마커의 자리. 좌표를 코드에 심지 않기
 *                     위한 것이고, 근거는 FormSignInAnnotations 주석에 있다.
 *
 * 확정된 구현 판단 3가지
 *   - 루트가 form 이다. 이메일 한 칸 + 제출 버튼이라 폼이 맞고, label-input 연결도
 *     자연스럽다. onSubmit 같은 동작 prop 은 새로 만들지 않았다 — FormHTMLAttributes
 *     를 상속하므로 호출부가 표준 속성으로 넘긴다.
 *   - Continue 버튼은 disabled 다(Figma 원본이 그렇다). 그래서 이 폼은 기본 상태에서
 *     제출되지 않는다. 소셜 버튼이 폼을 제출해 버리지 않도록 ButtonSocial 은
 *     type="button" 을 명시한다(ButtonSocial.tsx 참고).
 *   - 구분선 두 개는 장식이라 aria-hidden 이다. 스크린리더에는 "or" 만 읽힌다.
 *
 * Input 에 넘긴 표준 속성 3개 (Figma 에 그림으로는 없는 것 — 근거를 밝힌다)
 *   required  빨간 "*" 를 스크린리더에도 전달한다. 별표는 시각 표시일 뿐이라 이 속성이
 *             없으면 필수라는 정보가 눈으로만 존재한다. 원본 그림의 의미를 옮긴 것이다.
 *   aria-label
 *             원본에 보이는 라벨이 placeholder 뿐이라 이 칸에는 접근 가능한 이름이
 *             없다. placeholder 는 입력이 시작되면 사라지므로 이름으로 삼을 수 없다.
 *             화면에 아무것도 더 그리지 않으면서 이름만 채운다. 문구는 원본과 같고
 *             "*" 는 뺐다 — 별표는 required 가 이미 전달한다.
 *   type      "with your email" 이라는 제목과 필드 하나뿐인 구성에서 이메일 칸이라고
 *             읽었다. Figma 는 입력 종류를 표시하지 않으므로 이것은 확인이 아니라
 *             추론이다 — 다른 종류가 맞다면 이 한 줄만 고치면 된다.
 */

/*
 * 화면정의서용 주석 슬롯 3개. 값이 없으면 아무것도 렌더하지 않으므로 기존 사용처의
 * 마크업은 그대로다.
 *
 * 왜 이 컴포넌트가 슬롯을 갖는가 — 화면정의서(src/specs/)는 폼 위에 번호 마커를
 * 얹어야 하는데, Figma 원본(118:7129 · 118:7131 · 118:7133)은 그것을 페이지 좌표에
 * 절대배치로 박아 두었다(left 715 / top 324 …). 그 좌표를 옮기려면 토큰에 없는 값
 * 6개를 코드에 심어야 하고, 폼의 내부 간격이 바뀌면 조용히 어긋난다. 마커를 가리킬
 * 블록의 형제로 두면 `right-full` 하나로 정렬이 끝나고 좌표가 0개가 된다 — 그래서
 * 위치를 아는 유일한 쪽인 이 컴포넌트가 자리를 내준다.
 *
 * 키 이름은 Figma 의 마커 번호(1·2·3)가 아니라 가리키는 블록의 역할이다. 번호는
 * 화면정의서마다 다시 매겨지는 값이고, 블록은 그렇지 않다.
 */
export type FormSignInAnnotations = {
  /** 제목 "Sign in or join us with your email." (Figma 마커 1) */
  title?: ReactNode
  /** [Continue] 버튼 (Figma 마커 2) */
  action?: ReactNode
  /** checkboxArea — Remember email + 안내 문단 (Figma 마커 3) */
  options?: ReactNode
}

export interface FormSignInProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * 이메일 칸의 placeholder. 기본값은 컴포넌트 원본(19661:15252)에 적힌 문구
   * 그대로이고, 이것을 소비하는 시트가 인스턴스에서 override 한 경우에만 넘긴다
   * (예: page/SignIn 시트의 118:7107 은 "Email*" 로 덮어 쓴다).
   * 접근 가능한 이름도 이 값에서 파생된다 — 아래 aria-label 참고.
   */
  emailPlaceholder?: string
  /** 화면정의서용 번호 마커. 위 FormSignInAnnotations 주석 참고. */
  annotations?: FormSignInAnnotations
}

/*
 * 마커를 붙일 자리. `right-full` 은 마커의 오른쪽 끝을 대상 블록의 왼쪽 변에
 * 맞추고, `top-1/2 -translate-y-1/2` 는 블록 높이의 한가운데에 세운다. 셋 다
 * 비율·논리 위치라 옮겨야 할 픽셀 값이 없다.
 */
const ANNOTATION_SLOT = 'absolute top-1/2 right-full -translate-y-1/2 mr-8'

/** Figma "Form/SignIn" 의 코드 정본. */
export function FormSignIn({
  emailPlaceholder = 'Lorem ipsum*',
  annotations,
  className = '',
  ...props
}: FormSignInProps) {
  return (
    <form
      className={`flex flex-col items-center gap-20 rounded-12 bg-bg-default px-32 py-40 ${className}`}
      {...props}
    >
      {/* 19661:15249 — 제목 + 입력 영역 */}
      <div className="flex w-full flex-col items-start gap-24">
        <div className="relative">
          {annotations?.title && (
            <span className={ANNOTATION_SLOT}>{annotations.title}</span>
          )}
          <p className="type-subtitle-medium-strong text-text-disclaimer">
            Sign in or join us with your email.
          </p>
        </div>

        {/* 19661:15251 */}
        <div className="flex w-full flex-col items-start gap-20">
          {/* 19661:15252 — Input 인스턴스. 필수 표시는 위 "원본과 다르게" 4번 참고. */}
          <Input
            type="email"
            size="lg"
            state="default"
            required
            placeholder={emailPlaceholder}
            /* "*" 는 required 가 이미 전달하므로 이름에서는 뺀다 — 아래
               "Input 에 넘긴 표준 속성 3개" 의 aria-label 항목 참고. */
            aria-label={emailPlaceholder.replace(/\*$/, '')}
            /*
             * Tailwind Preflight 가 ::placeholder 를 currentColor 의 50% 로 흐린다.
             * 그대로 두면 원본보다 옅어지고 대비가 AA 아래로 떨어지므로 토큰으로
             * 되돌린다. 새 토큰은 없다 — 라벨에 쓰던 것과 같은 text/primary 다.
             */
            className="placeholder:text-text-primary"
          />

          {/* 19661:15253 — Button 인스턴스 */}
          <div className="relative w-full">
            {annotations?.action && (
              <span className={ANNOTATION_SLOT}>{annotations.action}</span>
            )}
            <Button variant="primary" size="md" trailingIcon={false} disabled className="w-full">
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* 19661:15254 — 체크박스 + 구분선 + 소셜 */}
      <div className="flex w-full flex-col items-start gap-20">
        {/* 19661:15255 — checkboxArea */}
        <div className="relative flex w-full flex-col items-start gap-12">
          {annotations?.options && (
            <span className={ANNOTATION_SLOT}>{annotations.options}</span>
          )}
          <CheckBoxSet label="Remember email" />
          {/* 19661:15258 */}
          <p className="type-body-default text-text-disclaimer">
            Sign up as a member, receive $50 towards your next purchase over $350 on LG.com{' '}
            <span className="text-text-brand">Join us</span>
          </p>
        </div>

        {/* 19661:15259 — 구분선 + 소셜 목록 */}
        <div className="flex w-full flex-col items-start gap-16">
          {/* 19661:15260 / 15261 — 선 + "or" + 선 */}
          <div className="flex h-24 w-full items-center justify-center gap-8">
            <span aria-hidden="true" className="h-hairline flex-1 bg-border-strong" />
            <span className="type-body-small text-text-tertiary">or</span>
            <span aria-hidden="true" className="h-hairline flex-1 bg-border-strong" />
          </div>

          {/* 19661:15265 — List */}
          <div className="flex w-full items-start justify-center gap-16">
            <ButtonSocial variant="apple" />
            <ButtonSocial variant="google" />
            <ButtonSocial variant="facebook" />
          </div>
        </div>
      </div>
    </form>
  )
}
