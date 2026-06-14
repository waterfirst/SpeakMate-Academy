# Airtable DB 설계

계정: `waterfirst@snu.ac.kr`

권장 base 이름:

```text
SpeakMate Review Hub
```

## 1. Students

학생 기본 정보 테이블.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Student ID | Single line text | `kim001` 같은 고유 ID |
| Name | Single line text | 학생 이름 |
| Email | Email | Softr 로그인 이메일 |
| Level | Single select | A1, A2, B1, B2, C1 |
| Class | Single line text | 반/과정명 |
| Teacher | Single line text | 담당 강사 |
| Status | Single select | Active, Paused, Alumni |
| Notes | Long text | 원장/강사용 메모 |

## 2. Lesson Feedback

강사가 올린 피드백 문서와 AI 분석 결과.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Feedback ID | Formula 또는 Autonumber | 고유 ID |
| Student | Link to Students | 학생 연결 |
| Student ID | Lookup | 학생 ID |
| Lesson Date | Date | 수업일 |
| Level | Single select | 수업 레벨 |
| Source File URL | URL | Google Drive 원본 문서 |
| Raw Feedback Text | Long text | 문서에서 추출한 원문 |
| AI Summary | Long text | 복습용 요약 |
| Strengths | Long text | 잘한 점 |
| Improvement Points | Long text | 개선점 |
| Homework | Long text | 숙제/복습 지시 |
| Publish Status | Single select | Draft, Reviewed, Published |
| Created At | Date/time | 생성 시각 |

## 3. Quiz Items

복습용 단어/표현 퀴즈.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Quiz ID | Formula 또는 Autonumber | 고유 ID |
| Lesson Feedback | Link to Lesson Feedback | 관련 수업 |
| Student | Lookup | 학생 |
| Word | Single line text | 단어/표현 |
| Meaning KR | Single line text | 한국어 뜻 |
| Example Sentence | Long text | 예문 |
| Question | Long text | 퀴즈 질문 |
| Answer | Single line text | 정답 |
| Difficulty | Single select | Easy, Normal, Hard |

## 4. Listening Pool

레벨별 추천 듣기 자료 풀.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Listening ID | Formula 또는 Autonumber | 고유 ID |
| Level | Single select | A1, A2, B1, B2, C1 |
| Topic | Single line text | 주제 |
| Title | Single line text | 영상 제목 |
| YouTube URL | URL | 듣기 링크 |
| Notes | Long text | 추천 이유 |
| Active | Checkbox | 추천 가능 여부 |

## 5. Recommended Listening

각 수업 피드백에 자동 매칭된 듣기 자료.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Lesson Feedback | Link to Lesson Feedback | 관련 수업 |
| Listening | Link to Listening Pool | 추천 영상 |
| Student | Lookup | 학생 |
| Reason | Long text | AI 또는 규칙 기반 추천 이유 |

## 6. Speaking Practice Records

SpeakMate Academy에서 넘어오는 말하기 연습 결과.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Record ID | Single line text | SpeakMate가 생성한 recordId |
| Student | Link to Students | 학생 연결 |
| Student ID | Single line text | webhook에서 받은 학생 ID |
| Lesson ID | Single line text | Softr/URL에서 넘긴 수업 ID |
| Created At | Date/time | 연습 시각 |
| Scene | Single line text | 카페, 공항 등 |
| Prompt | Long text | 질문 |
| Transcript | Long text | 학생 발화/인식 문장 |
| Corrected | Long text | 교정 문장 |
| Notes | Long text | 코치 노트 |
| Fit Score | Number | 질문 적합도 |
| Grammar Score | Number | 문장 점수 |
| Audio File URL | URL | Google Drive 녹음 파일 |
| Teacher Feedback | Long text | 원장/강사 피드백 |

## 7. Activity Logs

학생 활동 기록.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Log ID | Formula 또는 Autonumber | 고유 ID |
| Student | Link to Students | 학생 연결 |
| Student ID | Single line text | 학생 ID |
| Activity Type | Single select | Login, Review Opened, Quiz Completed, Speaking Saved |
| Detail | Long text | 활동 상세 |
| Related Record ID | Single line text | 수업/연습 기록 ID |
| Created At | Date/time | 활동 시각 |

## 주의

Airtable 필드명을 바꾸면 Make.com mapping이 깨질 수 있다. 운영 시작 후에는 필드명 변경을 금지하고, 필요한 경우 새 필드를 추가한 뒤 Make 시나리오를 같이 수정한다.

