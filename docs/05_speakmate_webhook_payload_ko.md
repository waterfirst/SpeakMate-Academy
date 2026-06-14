# SpeakMate Webhook Payload

SpeakMate Academy의 `연습 기록 저장` 버튼은 Make webhook URL이 설정되어 있으면 아래 JSON을 전송한다.

## 설정 방법

1. 관리자 패널 열기
2. 비밀번호 `REDACTED` 입력
3. `Make / Airtable Storage`의 `Make webhook URL` 입력
4. `Webhook 연결 테스트`
5. 정상 응답 확인 후 학생 연습 기록 저장

URL 파라미터로도 설정할 수 있다.

```text
?studentId=kim001&lessonId=2026-06-14-B1&level=B1&endpoint=https%3A%2F%2Fhook.eu2.make.com%2Fxxxx
```

## Payload 예시

```json
{
  "eventType": "speaking_practice_saved",
  "source": "SpeakMate Academy",
  "storageProvider": "make_airtable",
  "recordId": "2026-06-14T12-00-00-000Z-a1b2c3",
  "studentId": "kim001",
  "lessonId": "2026-06-14-B1",
  "level": "B1",
  "createdAt": "2026-06-14T12:00:00.000Z",
  "savedAt": "2026-06-14T12:00:00.000Z",
  "pageUrl": "https://waterfirst.github.io/SpeakMate-Academy/?studentId=kim001",
  "sceneKey": "cafe",
  "scene": "카페 주문",
  "promptIndex": 0,
  "prompt": "Good afternoon. What would you like to order today?",
  "sampleAnswer": "I would like a large iced latte, please.",
  "drill": "같은 주문을 더 공손하게 말해보세요.",
  "coachKey": "female",
  "coachName": "Mina",
  "transcript": "I would like a large latte, please.",
  "corrected": "I would like a large latte, please.",
  "notes": [
    "The sentence is understandable and grammatically natural."
  ],
  "fitScore": 91,
  "grammarScore": 100,
  "matchedKeywords": ["drink", "size"],
  "missingItems": [],
  "audioBase64": "AAAA...",
  "audioMimeType": "audio/webm"
}
```

## Make에서 해야 할 일

- `eventType = connection_test`이면 연결 테스트 응답만 반환
- `eventType = speaking_practice_saved`이면 Airtable 저장
- `audioBase64`가 있으면 Google Drive에 파일 업로드
- Airtable `Speaking Practice Records`에 `Audio File URL` 저장
- Airtable `Activity Logs`에 `Speaking Saved` 저장

## 보안 주의

정적 GitHub Pages 앱은 secret을 숨길 수 없다. 운영 시 아래 중 하나를 적용한다.

- Softr 로그인 사용자에게만 SpeakMate iframe 노출
- Make webhook payload에 shared secret 필드를 추가하고 Make에서 검증
- 학생 ID가 Airtable `Students`에 없으면 저장 거부
- Make scenario 실행 로그를 월 1회 확인

