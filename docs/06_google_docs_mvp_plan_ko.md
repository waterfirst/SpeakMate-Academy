# 영어학원 학습 대시보드 MVP 제작 기획안

> 버전: v2.1  
> 작성일: 2026-06-16  
> 방식: 노코드 툴 조립, Google Docs + Make.com + Airtable + Softr + OpenAI  
> 핵심 결정: `.docx` 업로드 방식이 아니라 강사가 Google Docs 템플릿을 복제해 작성하는 방식으로 진행한다.

## 1. 프로젝트 목적

오프라인 수업 후 강사가 작성한 Google Docs 피드백 노트를 기반으로, AI가 맞춤형 복습 자료, 퀴즈, 듣기 숙제, 개인 과제를 자동 생성한다. 생성된 자료는 Airtable에 저장되고, Softr 학생/강사 대시보드에서 권한별로 노출된다.

학생은 로그인 후 자기 자료만 보고 숙제를 제출하며, 강사는 담당 반 학생의 제출물을 확인하고 다운로드한다. 원장은 Airtable에서 전체 현황과 로그를 확인한다.

이번 프로젝트는 커스텀 백엔드 개발이 아니라, 기성 노코드 툴을 연결하는 빠른 MVP 구축이다.

## 2. Google Docs 채택 이유

빠른 MVP에서는 `.docx` 파일 업로드보다 Google Docs 직접 작성 방식이 안정적이다.

| 항목 | `.docx` 업로드 | Google Docs 작성 |
|---|---|---|
| Make 연동 | 파일 다운로드 후 본문 파싱 필요 | Google Docs 본문 추출 모듈로 바로 처리 |
| 양식 통제 | 강사별 문서 양식이 흔들리기 쉬움 | 공유 템플릿 복제로 양식 고정 |
| 파싱 안정성 | 표, 이미지, 인코딩 문제 가능 | 텍스트 기반이라 안정적 |
| 협업 | 파일 버전 관리 필요 | 실시간 편집과 코멘트 가능 |

운영 방식은 "강사가 지정 폴더에서 템플릿 문서를 복제해 작성"으로 고정한다.

## 3. 전체 아키텍처

```text
강사 Google Docs 피드백 작성
→ Google Drive 지정 폴더 저장
→ Make.com Watch Files 트리거
→ Google Docs 본문 읽기
→ OpenAI JSON 생성
→ JSON Parse
→ Airtable Lesson Feedback 저장
→ Softr 학생/강사 대시보드 노출
→ 학생 숙제 제출
→ 강사 확인/다운로드
→ Activity Logs 축적
```

기존 GitHub Pages 기반 SpeakMate 웹앱은 이번 MVP의 중심 기능이 아니다. 필요하면 Softr 학생 페이지에서 "말하기 연습 바로가기"로 연결하는 보조 기능으로 둔다.

## 4. MVP 범위

### 1차 MVP에 포함

- Google Docs 피드백 템플릿
- Google Drive 폴더 감시
- OpenAI 기반 복습자료/퀴즈/숙제 생성
- Airtable 중앙 DB 저장
- Softr 학생 로그인 및 본인 자료 조회
- Softr 학생 숙제 제출
- Softr 강사 로그인 및 담당 반 제출물 확인
- Airtable 기반 관리자 확인
- 최소 활동 로그

### 1차 MVP에서 단순화

- 로그인 로그는 완전 자동화하지 않고, 자료 확인/숙제 제출 로그부터 구현한다.
- Listening Pool 매칭은 먼저 기본 추천 필드까지 저장하고, 자동 검색/업데이트는 핵심 저장 성공 후 붙인다.
- Airtable Link 필드는 만들 수 있지만 Make에서 처음부터 Link 필드에 직접 쓰지 않는다. 빠른 안정화를 위해 `Student ID Text`, `Class Name Text` 같은 텍스트 필드를 먼저 사용한다.

### 1차 MVP에서 제외

- 자체 백엔드 서버
- 자체 로그인 시스템 개발
- 자동 결제/수강권 관리
- 모바일 앱 개발
- 고급 성적 분석 리포트
- 외부 퀴즈 서비스 실시간 API 연동

## 5. 사용자 역할

### 학생

- Softr에 로그인한다.
- 본인의 복습자료, 퀴즈, 듣기 링크, 개인 숙제를 확인한다.
- 숙제 파일이나 텍스트를 제출한다.
- 본인의 제출 내역을 확인한다.

### 강사

- Google Docs 템플릿으로 수업 피드백을 작성한다.
- Softr에서 담당 반의 학생 자료와 제출물을 확인한다.
- 제출 파일을 다운로드하고 코멘트를 남긴다.

### 관리자/원장

- Airtable에서 전체 학생, 강사, 반, 피드백, 제출, 로그를 확인한다.
- 필요 시 Softr 관리자 페이지는 2차 확장으로 만든다.

## 6. Airtable 스키마

필드명은 Make 매핑 안정성을 위해 영어로 고정한다. Softr 화면에서는 한글 라벨로 표시한다.

### Students

| 필드 | 타입 | 설명 |
|---|---|---|
| Student ID | Single line text | 예: kim001 |
| Name | Single line text | 학생 이름 |
| Email | Email | Softr 로그인/권한 기준 |
| Class Name Text | Single line text | 빠른 MVP용 반 이름 |
| Class | Link to Classes | 안정화 후 사용 |
| Level | Single select 또는 Text | 레벨 |
| Active | Checkbox | 재원 여부 |

### Teachers

| 필드 | 타입 | 설명 |
|---|---|---|
| Teacher ID | Single line text | 예: t001 |
| Name | Single line text | 강사 이름 |
| Email | Email | Softr 로그인/권한 기준 |
| Class Name Text | Single line text | 담당 반 이름 |
| Classes | Link to Classes | 안정화 후 사용 |
| Active | Checkbox | 활동 여부 |

### Classes

| 필드 | 타입 | 설명 |
|---|---|---|
| Class ID | Single line text | 예: class-a |
| Class Name | Single line text | 반 이름 |
| Teacher Name Text | Single line text | 빠른 MVP용 담당 강사 |
| Teacher | Link to Teachers | 안정화 후 사용 |
| Students | Link to Students | 안정화 후 사용 |

### Lesson Feedback

Make에서 가장 먼저 저장되는 핵심 테이블이다.

| 필드 | 타입 | 설명 |
|---|---|---|
| Feedback ID | Single line text 또는 Autonumber | 고유값 |
| Student ID Text | Single line text | Make가 직접 저장 |
| Student Name Text | Single line text | Make가 직접 저장 |
| Class Name Text | Single line text | Make가 직접 저장 |
| Teacher Name Text | Single line text | Make가 직접 저장 |
| Lesson Date | Date | 수업일 |
| Level | Single line text | AI 추출 레벨 |
| Topic | Single line text | 수업 주제 |
| Source Doc URL | URL | 원본 Google Docs 링크 |
| AI Summary | Long text | 복습 요약 |
| Strengths | Long text | 잘한 점 |
| Improvement Points | Long text | 보완점 |
| Quiz Items | Long text | 퀴즈 JSON 또는 줄단위 텍스트 |
| Homework Text | Long text | 개인 맞춤 과제 |
| Listening Keywords | Long text | 듣기 링크 매칭용 키워드 |
| Listening Title | Single line text | 추천 영상 제목 |
| Listening Link | URL | 추천 YouTube 링크 |
| Listening Reason | Long text | 추천 이유 |
| Status | Single select | Created, Error, Reviewed |
| Created At | Created time | 생성 시각 |

주의: `Student`, `Class` 같은 Link 필드는 빠른 MVP에서는 나중에 보강한다. 처음부터 Make에서 Link 필드에 `kim001` 같은 텍스트를 넣으면 Airtable이 record ID를 요구해 오류가 난다.

### Homework Submissions

| 필드 | 타입 | 설명 |
|---|---|---|
| Submission ID | Single line text 또는 Autonumber | 고유값 |
| Student ID Text | Single line text | 제출자 |
| Student Name Text | Single line text | 제출자 이름 |
| Class Name Text | Single line text | 반 |
| Related Feedback ID | Single line text | 연결할 피드백 ID |
| Submitted File | Attachment | 제출 파일 |
| Submitted Text | Long text | 텍스트 제출 |
| Submitted At | Created time | 제출 시각 |
| Teacher Comment | Long text | 강사 코멘트 |
| Reviewed | Checkbox | 강사 확인 여부 |

### Listening Pool

| 필드 | 타입 | 설명 |
|---|---|---|
| Listening ID | Single line text | 고유값 |
| Title | Single line text | 영상 제목 |
| URL | URL | YouTube 링크 |
| Level | Single line text | 난이도 |
| Topic Tags | Long text | 주제 태그 |
| Keywords | Long text | 매칭 키워드 |
| Active | Checkbox | 사용 여부 |

### Activity Logs

| 필드 | 타입 | 설명 |
|---|---|---|
| Log ID | Single line text 또는 Autonumber | 고유값 |
| Student ID Text | Single line text | 행위자 |
| User Email | Email | 로그인 이메일 |
| User Role | Single select | Student, Teacher, Admin |
| Action | Single select | ViewMaterial, SubmitHomework, TeacherReview |
| Related Record ID | Single line text | 관련 레코드 |
| Created At | Created time | 발생 시각 |
| Notes | Long text | 메모 |

## 7. Google Docs 템플릿

문서 제목 규칙:

```text
YYYY-MM-DD_학생ID_학생명_반명_수업피드백
예: 2026-06-16_kim001_김민아_중등A_수업피드백
```

문서 본문 템플릿:

```text
학생 ID: kim001
학생명: 김민아
반: 중등A
강사: Jane
수업일: 2026-06-16
레벨: A2
수업 주제: Cafe ordering

오늘 배운 내용:
- 카페에서 주문하기
- I'd like to...
- Can I get...?

학생 발화:
- I want big latte.
- I like ice latte.

교정 포인트:
- I would like a large latte, please.
- iced latte 표현 사용

강사 메모:
- 발음은 좋으나 관사와 공손한 표현 연습 필요
- 다음 시간에는 주문 후 추가 요청 표현 연습
```

## 8. Make.com 시나리오

### Scenario A: AI 콘텐츠 생성

핵심 시나리오:

```text
Google Drive - Watch Files in a Folder
→ Google Docs - Get Content of a Document
→ OpenAI - Generate a Response
→ JSON - Parse JSON
→ Airtable - Create a Record in Lesson Feedback
```

핵심 저장이 성공한 뒤 추가할 시나리오:

```text
JSON Parse
→ Airtable - Search Records in Listening Pool
→ Airtable - Update Lesson Feedback Listening fields
```

OpenAI JSON 출력 스키마:

```json
{
  "student_id": "kim001",
  "student_name": "김민아",
  "class_name": "중등A",
  "teacher_name": "Jane",
  "lesson_date": "2026-06-16",
  "level": "A2",
  "topic": "Cafe ordering",
  "summary": "오늘은 카페에서 주문할 때 쓰는 표현을 연습했습니다...",
  "strengths": ["주문 의도를 분명하게 말했습니다."],
  "improvement_points": ["polite expression과 관사 사용을 더 연습하세요."],
  "quiz_items": [
    {
      "word": "iced latte",
      "meaning_kr": "아이스 라떼",
      "example": "I'd like an iced latte, please."
    }
  ],
  "homework": "오늘 배운 표현을 사용해 카페 주문 대화문 5문장을 작성하세요.",
  "listening_keywords": ["cafe ordering", "A2", "polite requests"],
  "recommended_listening": {
    "title": "",
    "url": "",
    "reason": "카페 주문 표현 복습에 적합한 영상을 매칭하세요."
  }
}
```

OpenAI 프롬프트 핵심 규칙:

```text
너는 한국 영어학원 보조 교사다.
아래 Google Docs 피드백을 읽고 학생용 복습자료를 만든다.
반드시 valid JSON만 출력하라.
마크다운 설명, 코드블록, 추가 문장은 금지한다.
날짜는 YYYY-MM-DD 형식으로 출력한다.
배열 필드는 짧은 문장 배열로 출력한다.
한국어 피드백은 자연스러운 한국어로 작성한다.
영어 예문은 학생 레벨에 맞게 자연스럽게 작성한다.
```

JSON Parse에서 반드시 OpenAI의 실제 `Result` 텍스트를 넣는다. OpenAI 모듈의 `format`, `verbosity`, `status` 같은 설정값을 넣으면 파싱은 성공해도 필요한 필드가 나오지 않는다.

### Scenario B: 학생 숙제 제출

MVP에서는 Softr 기본 Form을 사용한다.

```text
Softr Form
→ Airtable Homework Submissions
→ Activity Logs
```

학생 제출 파일은 Airtable Attachment 필드에 저장한다.

### Scenario C: 활동 로그

1차 MVP에서는 다음 로그만 우선 남긴다.

- 학생이 자료 확인 버튼 클릭
- 학생이 숙제 제출
- 강사가 제출물 확인

로그인 로그 자동화는 2차 확장으로 둔다.

## 9. Softr 화면 구성

### 학생 대시보드

필터 기준:

```text
Logged-in user email = Students.Email
또는
Logged-in user Student ID = Lesson Feedback.Student ID Text
```

화면:

- 최근 복습자료
- AI Summary
- Quiz Items
- Listening Link
- Homework Text
- Homework Submission Form
- 제출 내역

### 강사 대시보드

필터 기준:

```text
Logged-in teacher email = Teachers.Email
Teacher.Class Name Text = Lesson Feedback.Class Name Text
```

화면:

- 담당 반 목록
- 반별 학생 리스트
- 학생별 피드백
- 숙제 제출 현황
- 제출 파일 다운로드
- Teacher Comment 입력

### 관리자 확인

빠른 MVP에서는 Airtable을 관리자 화면으로 사용한다. Softr 관리자 페이지는 2차 확장으로 둔다.

## 10. 권한 검수

MVP에서 가장 중요한 검수 항목은 권한이다.

- 학생 A는 학생 A 자료만 볼 수 있어야 한다.
- 학생 A는 학생 B 자료를 볼 수 없어야 한다.
- 강사는 담당 반 자료만 볼 수 있어야 한다.
- 원장은 Airtable에서 전체 자료를 볼 수 있어야 한다.

검수 계정:

- 학생 A: `student.a@example.com`
- 학생 B: `student.b@example.com`
- 강사: `teacher@example.com`
- 관리자: 원장 계정

## 11. 5일 제작 순서

### 1일차: Airtable 구조 확정

- 7개 테이블 생성
- Link 필드보다 텍스트 필드 우선
- 샘플 학생 3명, 강사 1명, 반 1개 입력
- Google Docs 템플릿 생성

### 2일차: Make Scenario A 핵심 저장

- Drive Watch Files
- Google Docs 본문 추출
- OpenAI JSON 생성
- JSON Parse
- Airtable Lesson Feedback 저장
- 테스트 문서 3건 검증

### 3일차: Softr 학생 페이지

- 로그인 설정
- 학생별 필터
- 복습자료/퀴즈/듣기/숙제 표시
- 숙제 제출 폼 연결

### 4일차: Softr 강사 페이지

- 강사별 필터
- 담당 반 제출 현황
- 파일 다운로드
- 강사 코멘트

### 5일차: 로그, 예외, 가이드

- Activity Logs 최소 구현
- Listening Pool 매칭 보강
- 학생/강사 권한 교차 테스트
- 원장용 운영 가이드 작성

## 12. 완료 체크리스트

- [ ] 강사가 Google Docs 피드백을 만들면 Make가 실행된다.
- [ ] Google Docs 본문이 Make에서 정상 추출된다.
- [ ] OpenAI가 valid JSON만 출력한다.
- [ ] JSON Parse에 필요한 필드가 나온다.
- [ ] Airtable Lesson Feedback에 값이 비지 않고 저장된다.
- [ ] 학생은 본인 자료만 본다.
- [ ] 학생은 숙제를 제출할 수 있다.
- [ ] 강사는 담당 반 제출물만 본다.
- [ ] 제출 파일 다운로드가 가능하다.
- [ ] Activity Logs에 핵심 행동이 남는다.

## 13. 견적과 유지보수

빠른 MVP 기준:

- 예상 공수: 5~7일
- 권장 제안가: 250만~350만원

운영 안정화 포함:

- 예상 공수: 2~3주
- 권장 제안가: 350만~600만원

월 구독료와 API 사용료는 원장 계정으로 별도 부담하는 전제로 안내한다. Make, Airtable, Softr, OpenAI의 실제 플랜과 단가는 계약 시점에 다시 확인한다.

유지보수는 다음 방식이 적합하다.

- 구축 후 2주 안정화 포함
- 이후 월정액 대신 건별 대응 가능
- 원장이 원하면 월 10만~30만원 선택형 유지보수 제안

## 14. 리스크와 대응

| 리스크 | 대응 |
|---|---|
| Google Docs 양식이 흔들림 | 템플릿 고정, 필수 항목 상단 배치 |
| OpenAI JSON 깨짐 | valid JSON only, JSON 출력 옵션, 수동 재실행 가이드 |
| Airtable Link 필드 오류 | 빠른 MVP에서는 텍스트 필드 우선 저장 |
| Airtable 필드명 변경 | 운영 매뉴얼에 필드명 변경 금지 명시 |
| Softr 권한 필터 오류 | 학생 A/B/강사 교차 테스트 |
| Make operations 초과 | 감시 주기 조정, 사용량 모니터링 |
| 듣기 링크 추천 부정확 | Listening Pool 20~50개 선적재 후 단계적 보정 |

## 15. 원장 제안 문구

```text
이번 프로젝트는 커스텀 개발이 아니라 Google Docs, Make.com, Airtable, Softr, OpenAI를 연결하는 노코드 MVP로 진행하는 것이 적합합니다.

강사님은 지정된 Google Docs 템플릿에 수업 피드백을 작성하기만 하면 됩니다. 이후 AI가 복습자료, 퀴즈, 듣기 과제, 개인 숙제를 자동 생성하고, 학생은 본인 대시보드에서 확인 및 숙제 제출을 할 수 있습니다. 강사는 담당 반의 제출물을 확인하고 다운로드할 수 있습니다.

빠른 MVP 제작 기간은 약 5~7일이며, 테스트와 운영 가이드까지 포함하면 1~2주 정도를 예상합니다. 구축 이후에는 원장님 또는 담당자가 직접 운영할 수 있도록 매뉴얼을 제공하고, 유지보수는 건별 대응 방식으로 진행할 수 있습니다.
```

## 16. 바로 시작할 구축 기준

지금부터는 아래 순서로 하나씩 진행한다.

1. Airtable 테이블 7개 생성
2. Students 필드 정리
3. Teachers 필드 정리
4. Classes 필드 정리
5. Lesson Feedback 필드 정리
6. Google Docs 템플릿 생성
7. Make Scenario A 재구축
8. Softr 학생 페이지
9. Softr 강사 페이지
10. 테스트와 가이드
