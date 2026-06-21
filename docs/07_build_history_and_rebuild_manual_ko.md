# 영어학원 AI 학습 대시보드 구축 기록 및 재현 매뉴얼

> 기준일: 2026-06-21  
> 저장소: `waterfirst/SpeakMate-Academy`  
> 목적: 프로젝트 파일이나 작업 환경이 사라져도 같은 MVP를 다시 구축할 수 있도록, 현재까지의 진행 내용과 다음 작업 절차를 기록한다.

![MVP 진행 현황](assets/mvp-progress-20260621.svg)

## 1. 최종 구축 방향

이번 프로젝트의 중심은 기존 SpeakMate 말하기 연습 웹앱이 아니라, 영어학원 원장이 요청한 학습 관리 대시보드 MVP다.

구축 방식:

```text
Google Docs
→ Make.com
→ OpenAI API
→ Airtable
→ Softr 학생/강사 대시보드
```

강사는 수업 후 Google Docs 템플릿에 피드백을 작성한다. Make가 지정 폴더의 새 문서를 감지하고, Google Docs 본문을 읽어 OpenAI에 보낸다. OpenAI는 복습 요약, 퀴즈, 듣기 링크, 맞춤 숙제를 JSON으로 생성하고, Make는 그 결과를 Airtable에 저장한다. Softr는 Airtable 데이터를 학생/강사 권한별 화면으로 보여준다.

## 2. 현재까지 완료된 범위

### 완료 1: Airtable 기본 DB

Base 이름:

```text
SpeakMate Review Hub
```

생성된 테이블:

```text
Students
Teachers
Classes
Lesson Feedback
Homework Submissions
Listening Pool
Activity Logs
Speaking Practice Records
```

`Speaking Practice Records`는 기존 SpeakMate 말하기 연습용 부가 테이블이다. Google Docs 기반 MVP의 핵심 테이블은 `Lesson Feedback`, `Homework Submissions`, `Students`, `Teachers`, `Classes`다.

샘플 학생:

```text
Name: 테스트학생
Student ID: kim001
Email: waterfirst@snu.ac.kr
Class Name Text: Test Class
Level: B1
Status/Active: Active
```

빠른 MVP에서는 Airtable의 Link 필드를 바로 쓰지 않고, `Student ID Text`, `Class Name Text` 같은 텍스트 필드를 우선 사용한다. Make에서 Link 필드에 `kim001` 같은 값을 넣으면 Airtable이 record ID를 요구해 오류가 나기 때문이다.

### 완료 2: Make 자동화

Make 시나리오 이름:

```text
Integration Google Drive
```

현재 성공한 흐름:

```text
Google Drive - Watch Files in a Folder
→ Google Docs - Get Content of a Document
→ OpenAI - Generate a response
→ Airtable - Create a Record
```

성공 확인:

- Google Docs 테스트 문서를 지정 폴더에 넣으면 Make가 실행된다.
- OpenAI 결과가 valid JSON으로 생성된다.
- Airtable `Lesson Feedback`에 새 행이 생성된다.
- `Topic`, `AI Summary`, `Improvement Points`, `Quiz Items`, `Listening Link`, `Listening Reason` 등이 저장된다.

주의:

- JSON Parse 또는 OpenAI 결과 매핑 시 OpenAI의 설정값(`format`, `verbosity`, `status`)이 아니라 실제 `Result` 또는 구조화된 `Result` 필드를 사용해야 한다.
- OpenAI `Status`가 `incomplete`이면 JSON이 잘렸을 수 있으므로 Max Output Tokens를 3000 이상으로 두고 다시 실행한다.

### 완료 3: Softr 학생 대시보드 1차

Softr 앱 이름:

```text
SpeakMate Student Portal
```

현재 완료:

- Softr에 Airtable `SpeakMate Review Hub` 연결
- 학생용 Home 페이지 생성
- 페이지 제목: `나의 영어 복습 자료`
- `Lesson Feedback` 리스트 표시
- 카드 필드 표시:
  - `Topic`
  - `Lesson Date`
  - `Level`
  - `AI Summary`
- 상세 페이지 생성:
  - `Topic`
  - `AI Summary`
  - `Level`
  - `Homework`
  - `Quiz Items`
  - `Improvement Points`
  - `Listening Link`
  - `Listening Reason`
- 숙제 제출 폼 추가
- 제출 폼이 Airtable `Homework Submissions`에 저장되는 것 확인

현재 테스트 방식:

```text
Student ID Text = kim001
```

아직 로그인 사용자 기준 자동 필터는 완성 전이다. 다음 단계에서 `Students.Email`과 Softr 로그인 사용자를 연결해 본인 자료만 보이게 해야 한다.

## 3. 1단계 상세 절차: Airtable 재구축

프로젝트를 처음부터 다시 만든다면 아래 순서로 진행한다.

### 3.1 Base 만들기

Airtable에서 새 Base를 만든다.

```text
Base Name: SpeakMate Review Hub
```

### 3.2 테이블 만들기

`+ Add or import` 또는 `Start from scratch`로 아래 테이블을 만든다.

```text
Students
Teachers
Classes
Lesson Feedback
Homework Submissions
Listening Pool
Activity Logs
```

기존 SpeakMate 연습기록까지 포함할 경우:

```text
Speaking Practice Records
```

### 3.3 Students 필드

```text
Name                 Single line text
Student ID           Single line text
Email                Email
Class Name Text      Single line text
Level                Single line text 또는 Single select
Active               Checkbox 또는 Single select
Notes                Long text
```

샘플:

```text
테스트학생 / kim001 / waterfirst@snu.ac.kr / Test Class / B1 / Active
```

### 3.4 Teachers 필드

```text
Name                 Single line text
Teacher ID           Single line text
Email                Email
Class Name Text      Single line text
Active               Checkbox
Notes                Long text
```

샘플:

```text
테스트강사 / t001 / waterfirst@snu.ac.kr / Test Class / Active
```

### 3.5 Classes 필드

```text
Class Name           Single line text
Class ID             Single line text
Teacher Name Text    Single line text
Notes                Long text
```

샘플:

```text
Test Class / class001 / 테스트강사
```

### 3.6 Lesson Feedback 필드

```text
Feedback ID             Single line text
Student ID Text         Single line text
Student Name Text       Single line text
Class Name Text         Single line text
Teacher Name Text       Single line text
Lesson Date             Date
Level                   Single line text
Topic                   Single line text
Source Doc URL          URL
AI Summary              Long text
Strengths               Long text
Improvement Points      Long text
Quiz Items              Long text
Homework Text           Long text
Listening Keywords      Long text
Listening Title         Single line text
Listening Link          URL
Listening Reason        Long text
Status                  Single select: Created, Error, Reviewed
Created At              Created time
```

### 3.7 Homework Submissions 필드

```text
Submission ID           Single line text 또는 Autonumber
Student ID Text         Single line text
Student Name Text       Single line text
Class Name Text         Single line text
Related Feedback ID     Single line text
Submitted File          Attachment
Submitted Text          Long text
Submitted At            Created time
Teacher Comment         Long text
Reviewed                Checkbox
```

### 3.8 Listening Pool 필드

```text
Listening ID            Single line text
Title                   Single line text
URL                     URL
Level                   Single line text
Topic Tags              Long text
Keywords                Long text
Active                  Checkbox
Notes                   Long text
```

### 3.9 Activity Logs 필드

```text
Log ID                  Single line text 또는 Autonumber
Student ID Text         Single line text
User Email              Email
User Role               Single select: Student, Teacher, Admin
Action                  Single select: ViewMaterial, SubmitHomework, TeacherReview
Related Record ID       Single line text
Created At              Created time
Notes                   Long text
```

## 4. 2단계 상세 절차: Make + OpenAI 자동화

### 4.1 Google Drive 폴더

Google Drive에 아래 폴더를 만든다.

```text
SpeakMate Academy
└── 02_google_docs_feedback
```

테스트 문서 제목 예시:

```text
2026-06-16_kim001_테스트학생_TestClass_수업피드백
```

본문 템플릿:

```text
학생 ID: kim001
학생명: 테스트학생
반: Test Class
강사: 테스트강사
수업일: 2026-06-16
레벨: B1
수업 주제: Cafe ordering

오늘 배운 내용:
- 카페에서 주문하기
- I'd like to...
- Can I get...?
- iced latte
- large size

학생 발화:
- I want big latte.
- I like ice latte.

교정 포인트:
- I would like a large latte, please.
- iced latte 표현 사용
- big latte보다 large latte가 자연스러움

강사 메모:
- 학생은 주문 의도를 잘 표현했으나 공손한 표현이 부족함
- 다음 수업에서는 주문 후 추가 요청 표현을 연습하면 좋음
```

### 4.2 Make 시나리오

새 Scenario를 만들고 아래 모듈을 순서대로 연결한다.

```text
1. Google Drive - Watch Files in a Folder
2. Google Docs - Get Content of a Document
3. OpenAI - Generate a response
4. Airtable - Create a Record
```

Google Drive:

```text
Watch Files: By Created Time
Drive: My Drive
Folder: SpeakMate Academy / 02_google_docs_feedback
File Types: Google Documents 또는 All
Limit: 1
```

Google Docs:

```text
Get Content of a Document: By Mapping
Document ID: 1. File ID
Include Tabs Content: Yes
```

OpenAI:

```text
Model: gpt-4o-mini 또는 사용 가능한 저비용 모델
Max Output Tokens: 3000
Store: false
Prompt Type: Text prompt
```

프롬프트 핵심:

```text
너는 한국 영어학원 보조 교사다.
아래 Google Docs 수업 피드백을 읽고 학생용 복습자료를 만든다.
반드시 valid JSON만 출력하라.
마크다운, 코드블록, 설명문, 인사말을 절대 출력하지 마라.
날짜는 YYYY-MM-DD 형식으로 출력하라.
```

출력 스키마:

```json
{
  "student_id": "",
  "student_name": "",
  "class_name": "",
  "teacher_name": "",
  "lesson_date": "",
  "level": "",
  "topic": "",
  "summary": "",
  "strengths": [],
  "improvement_points": [],
  "quiz_items": [
    {
      "word": "",
      "meaning_kr": "",
      "example": ""
    }
  ],
  "homework": "",
  "listening_keywords": [],
  "recommended_listening": {
    "title": "",
    "url": "",
    "reason": ""
  }
}
```

Airtable 매핑:

```text
Student ID Text       ← student_id
Student Name Text     ← student_name
Class Name Text       ← class_name
Teacher Name Text     ← teacher_name
Lesson Date           ← lesson_date
Level                 ← level
Topic                 ← topic
AI Summary            ← summary
Homework Text         ← homework
Improvement Points    ← improvement_points 첫 항목 또는 join 결과
Quiz Items            ← Raw Result 또는 quiz_items 텍스트 변환값
Listening Keywords    ← listening_keywords 첫 항목 또는 join 결과
Listening Title       ← recommended_listening.title
Listening Link        ← recommended_listening.url
Listening Reason      ← recommended_listening.reason
Status                ← Created
```

### 4.3 Make 테스트 기준

성공 기준:

- OpenAI Output Status가 `completed`
- Raw Result가 닫힌 JSON으로 끝남
- Airtable `Lesson Feedback`에 새 행 생성
- `Topic`, `AI Summary`, `Homework Text`, `Listening Link`가 비어 있지 않음

## 5. 3단계 진행할 내용: 학생별 권한 필터

현재 Softr 학생 페이지는 테스트용으로 `kim001` 자료만 보이게 구성되어 있다. 다음 단계에서는 로그인한 사용자의 이메일과 Airtable `Students.Email`을 연결해 자동 필터를 만든다.

목표:

```text
student.a@example.com 로그인 → student.a 자료만 표시
student.b@example.com 로그인 → student.b 자료만 표시
```

진행 절차:

1. Softr `Users`에서 학생 계정 2개를 만든다.
2. Airtable `Students.Email`에 같은 이메일을 넣는다.
3. Softr 학생 대시보드의 `Lesson Feedback` 리스트에 로그인 사용자 기준 필터를 건다.
4. 가능하면 `Student ID Text` 직접 필터가 아니라, 로그인 사용자와 매칭된 학생 ID를 기준으로 필터한다.
5. 숙제 제출 폼의 `Student ID Text`는 숨김 필드로 바꾸고 로그인 사용자 값으로 자동 입력한다.
6. 학생 A 계정으로 학생 B 자료가 보이지 않는지 검수한다.

검수:

- 학생 A가 학생 A 자료만 보는가
- 학생 A가 URL 직접 접근으로 학생 B 상세 페이지를 볼 수 없는가
- 제출 폼에서 학생 ID를 임의 변경할 수 없는가

## 6. 4단계 진행할 내용: 강사 대시보드

강사 대시보드는 학생 대시보드와 분리해서 만든다.

목표:

```text
강사 로그인
→ 담당 반 학생의 피드백/숙제 제출 현황만 보기
→ 제출 파일 다운로드
→ Teacher Comment 입력
→ Reviewed 체크
```

진행 절차:

1. Softr에 `Teacher Dashboard` 페이지를 만든다.
2. Airtable `Teachers.Email`을 강사 로그인 기준으로 사용한다.
3. `Lesson Feedback` 리스트를 `Class Name Text` 기준으로 필터한다.
4. `Homework Submissions` 리스트를 추가한다.
5. 표시 필드:
   - Student Name Text
   - Student ID Text
   - Class Name Text
   - Submitted Text
   - Submitted File
   - Submitted At
   - Reviewed
   - Teacher Comment
6. 강사가 제출 파일을 다운로드할 수 있게 한다.
7. 강사가 `Teacher Comment`, `Reviewed`만 수정할 수 있게 한다.

검수:

- 강사 A가 담당 반만 보는가
- 타 반 제출물이 보이지 않는가
- 제출 파일 다운로드가 되는가
- 강사 코멘트가 Airtable에 저장되는가

## 7. 최종 배포 전 체크리스트

- [ ] Softr 학생 페이지 Publish 완료
- [ ] 학생 A/B 계정 권한 테스트
- [ ] 강사 계정 권한 테스트
- [ ] Make 시나리오 ON 상태 확인
- [ ] OpenAI Billing/API Key 원장 명의로 교체
- [ ] Softr/Make/Airtable 구독 계정 원장 명의로 정리
- [ ] 테스트 데이터 삭제 또는 별도 표시
- [ ] 운영 매뉴얼 전달

## 8. 비용 및 세무 메모

제작자는 직장인 개인으로 작업하는 상황이므로, 견적 안내 시 세무 처리를 명확히 해야 한다.

권장 문구:

```text
제안 금액은 시스템 구축 용역비 기준이며, 부가세, 원천징수, 기타 세무 처리상 발생하는 비용은 의뢰자 부담 또는 별도 정산을 원칙으로 합니다. SaaS 구독료와 OpenAI API 사용료 역시 원장님 명의 계정에서 별도 결제하는 방식으로 진행합니다.
```

첫 구축 사례이므로 견적은 파일럿 성격으로 다소 낮게 제안할 수 있다. 단, 도구 구독료와 세금 부담은 별도로 분리한다.
