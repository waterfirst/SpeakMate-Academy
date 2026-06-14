# SpeakMate Review Hub 기획안

## 목적

영어학원 원장이 원하는 시스템은 새 앱을 처음부터 크게 개발하는 것이 아니라, 강사가 올린 수업 피드백 문서를 AI가 분석하고 학생별 복습 대시보드에 자동 게시하는 운영 파이프라인이다.

## 역할 분담

| 구성요소 | 역할 |
| --- | --- |
| Google Drive | 강사용 피드백 파일, 녹음 파일 원본 보관 |
| Make.com | 자동화 실행 엔진 |
| OpenAI API | 피드백 문서 분석, 복습 요약, 퀴즈/단어 생성 |
| Airtable | 학생, 수업, 복습 콘텐츠, 활동 로그 DB |
| Softr | 학생/원장용 로그인 대시보드 |
| SpeakMate Academy | 학생 말하기 연습 위젯, 연습 결과 webhook 전송 |

## 권장 운영 흐름

1. 강사가 Google Drive 지정 폴더에 피드백 문서를 업로드한다.
2. Make.com이 새 파일을 감지한다.
3. Make.com이 문서 본문을 추출한다.
4. OpenAI API가 본문을 JSON 형식으로 분석한다.
5. Airtable에 학생별 복습 요약, 퀴즈, 추천 듣기 링크가 저장된다.
6. Softr 학생 대시보드가 Airtable 데이터를 보여준다.
7. 학생은 SpeakMate Academy에서 말하기 연습을 한다.
8. SpeakMate Academy가 Make webhook으로 연습 결과를 보낸다.
9. Make.com이 Airtable과 Google Drive에 말하기 기록을 저장한다.

## 기존 앱 수정 방향

기존 GitHub 저장 방식은 데모/백업용으로 남기고, 운영 기본 방식은 Make webhook으로 전환한다.

- 학생 ID는 URL 파라미터로 받을 수 있다.
- Make webhook URL을 입력하면 저장 버튼이 Airtable/Google Drive 저장 시나리오로 데이터를 전송한다.
- 원장 관리 화면, 장기 통계, 피드백 검수는 Softr/Airtable에서 처리한다.

예시 URL:

```text
https://waterfirst.github.io/SpeakMate-Academy/?studentId=kim001&lessonId=2026-06-14-B1&level=B1
```

Make webhook을 URL로 넘기는 테스트 URL:

```text
https://waterfirst.github.io/SpeakMate-Academy/?studentId=kim001&endpoint=https%3A%2F%2Fhook.eu2.make.com%2Fxxxx
```

운영에서는 endpoint를 URL에 직접 노출하기보다 Softr 로그인 페이지 안에서만 임베드하고, Make 쪽에서 secret 값을 검증하는 것이 좋다.

