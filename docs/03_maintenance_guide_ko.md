# 운영 및 유지보수 가이드

목표는 개발자가 장기 유지보수를 맡지 않고, 원장 또는 운영 담당자가 직접 관리 가능한 수준으로 넘기는 것이다.

## 월 1회 점검

1. Make.com 로그인
2. Scenarios 메뉴에서 실패 표시 확인
3. 최근 30일 실행 로그 확인
4. 실패한 실행은 원인 확인 후 재실행
5. OpenAI API 사용량/결제 확인
6. Airtable record 수와 attachment 용량 확인
7. Google Drive 저장 용량 확인
8. Softr 학생 로그인/권한 샘플 확인

## 매주 또는 수시 점검

- 새 학생 등록 시 Airtable `Students`에 학생 추가
- 퇴원 학생은 `Status = Alumni`로 변경
- 강사 피드백 파일명 규칙 위반 여부 확인
- Publish Status가 `Draft`인 AI 결과를 원장이 검토 후 `Published`로 변경

## 절대 하지 말아야 할 일

- Airtable 필드명 변경
- Make 시나리오 모듈 삭제
- OpenAI API key를 문서나 GitHub에 저장
- 학생 개인정보가 들어간 Airtable view를 공개 링크로 공유
- Google Drive 녹음 폴더를 전체 공개로 열기

## OpenAI API key 교체 절차

1. 원장 명의 OpenAI Platform 계정 생성
2. Billing 결제수단 등록
3. API key 생성
4. Make.com에서 OpenAI connection 추가 또는 기존 connection 수정
5. 테스트 피드백 문서 1개 업로드
6. Airtable에 AI Summary, Quiz Items가 생성되는지 확인
7. 기존 개발자 API key 삭제 또는 비활성화

## Make 실패 시 조치

### Google Drive 파일 감지 실패

- 시나리오가 ON인지 확인
- 감시 폴더가 맞는지 확인
- 파일이 `.docx` 또는 Google Docs 형식인지 확인
- 파일명 규칙을 확인

### OpenAI 응답 실패

- API key가 유효한지 확인
- OpenAI 결제수단/한도 확인
- 문서 텍스트가 너무 길면 요약 전처리 단계 추가
- JSON Parse 실패 시 OpenAI prompt/schema 확인

### Airtable 저장 실패

- Airtable connection 권한 확인
- 필드명 변경 여부 확인
- 필수 필드가 비어 있는지 확인
- linked record 대상 학생이 존재하는지 확인

### SpeakMate 저장 실패

- Make webhook URL 확인
- 시나리오 ON 확인
- Webhook response/CORS 설정 확인
- SpeakMate 관리자 패널에서 Webhook 연결 테스트 실행

## 유지보수 계약 없이 넘기는 조건

유지보수를 맡지 않으려면 아래 산출물을 반드시 인수인계한다.

- Airtable base 구조 설명
- Make 시나리오 캡처 또는 단계별 설명
- OpenAI prompt/schema
- 학생 추가/퇴원 처리 방법
- API key 교체 방법
- 실패 로그 확인 및 재실행 방법
- 견적 범위와 제외 범위

추천 방식:

```text
초기 구축 + 2주 안정화 + 운영 매뉴얼 제공
이후 유지보수는 선택형/건별 지원
```

