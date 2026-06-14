# Make.com 시나리오 설계

계정: `waterfirst@snu.ac.kr`

## 시나리오 A. 강사 피드백 문서 자동 분석

목표:

```text
Google Drive .docx/Google Docs 업로드
→ OpenAI 분석
→ Airtable 저장
→ Softr 학생 대시보드 노출
```

권장 모듈 순서:

1. Google Drive: Watch files in a folder
2. Google Drive: Download a file
3. Google Docs 또는 변환 단계: 본문 텍스트 추출
4. Tools: 파일명에서 studentId, lessonDate, level 추출
5. Airtable: Search records in Students
6. OpenAI: Create response 또는 HTTP request to OpenAI API
7. JSON: Parse JSON
8. Airtable: Create record in Lesson Feedback
9. Airtable: Create records in Quiz Items
10. Airtable: Search records in Listening Pool
11. Airtable: Create record in Recommended Listening
12. Activity Logs: `Review Generated` 기록

### 파일명 규칙

강사에게 파일명 규칙을 고정시키는 것이 중요하다.

```text
studentId_YYYY-MM-DD_level_topic.docx
kim001_2026-06-14_B1_cafe.docx
```

문서 본문에도 아래 항목을 넣도록 템플릿을 만든다.

```text
Student ID:
Student Name:
Lesson Date:
Level:
Lesson Topic:
Teacher Feedback:
Homework:
```

## 시나리오 B. SpeakMate 말하기 연습 기록 저장

목표:

```text
SpeakMate Academy
→ Make Custom Webhook
→ Google Drive 오디오 저장
→ Airtable Speaking Practice Records 저장
→ Activity Logs 저장
```

권장 모듈 순서:

1. Webhooks: Custom webhook
2. Tools: payload 검증
3. Airtable: Search records in Students by Student ID
4. Router
   - audioBase64가 있으면 Google Drive 저장
   - audioBase64가 없으면 텍스트 기록만 저장
5. Google Drive: Upload a file
   - 파일명: `{{studentId}}_{{recordId}}.webm`
6. Airtable: Create record in Speaking Practice Records
7. Airtable: Create record in Activity Logs
8. Webhooks: Webhook response

### Webhook response 설정

브라우저에서 Make webhook을 직접 호출하므로 CORS 응답이 필요할 수 있다.

Webhook response 예시:

```json
{
  "ok": true,
  "recordId": "{{recordId}}"
}
```

가능하면 응답 헤더:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

Make 설정에서 CORS가 어려우면 Softr 또는 작은 backend proxy를 중간에 둔다.

## 시나리오 C. 활동 로그 저장

Softr 버튼 또는 SpeakMate 이벤트에서 호출.

1. Webhooks: Custom webhook
2. Airtable: Search Students
3. Airtable: Create record in Activity Logs
4. Webhook response

## OpenAI Structured Output 예시

OpenAI 출력은 자유 문장이 아니라 JSON으로 고정한다.

```json
{
  "summary_ko": "오늘 수업 핵심 요약",
  "strengths": ["잘한 점 1", "잘한 점 2"],
  "improvement_points": ["개선점 1", "개선점 2"],
  "homework": ["숙제 1", "숙제 2"],
  "quiz_items": [
    {
      "word": "reservation",
      "meaning_kr": "예약",
      "example_sentence": "I made a reservation for two.",
      "question": "What does reservation mean?",
      "answer": "예약",
      "difficulty": "Normal"
    }
  ],
  "recommended_listening": {
    "level": "B1",
    "topic": "restaurant",
    "reason": "예약과 주문 표현을 반복 연습하기 좋음"
  }
}
```

## OpenAI API key 운영

- 테스트 중에는 개발자 API key를 Make의 OpenAI connection에 넣는다.
- 운영 전에는 반드시 원장 명의 OpenAI API key로 교체한다.
- API key는 Airtable, GitHub, Softr 화면에 노출하지 않는다.
- Make connection 이름 예시:

```text
OpenAI - TEMP - developer
OpenAI - OWNER - waterfirst
```

