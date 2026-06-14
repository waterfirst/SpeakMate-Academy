# SpeakMate Academy

SpeakMate Academy is a browser-based English conversation helper for Korean learners and academy owners.

## Deployment

This repository is designed to run on GitHub Pages from the repository root.

Open the deployed app:

```text
https://waterfirst.github.io/SpeakMate-Academy/
```

## Make / Airtable Student Storage

The production direction is:

```text
SpeakMate Academy
→ Make.com custom webhook
→ Airtable Speaking Practice Records
→ Google Drive audio file storage
→ Softr student / owner dashboard
```

Open the admin panel, enter password `0000`, then add a Make webhook URL under `Make / Airtable Storage`.

The app also accepts launch parameters:

```text
?studentId=kim001&lessonId=2026-06-14-B1&level=B1
```

For testing, a Make endpoint can be passed as:

```text
?endpoint=https%3A%2F%2Fhook.eu2.make.com%2Fxxxx
```

Do not treat a browser-visible webhook URL as a strong secret. In production, show SpeakMate inside a Softr login page and validate student IDs in Make/Airtable.

## GitHub Student Storage Demo

Practice records are saved under:

```text
student_records/<student-id>/
student_records/<student-id>/audio/
```

The app uses the GitHub Contents API from the browser. For writing records, the academy owner must enter a GitHub fine-grained token with contents read/write access to this repository.

Do not give the owner token to students. For production use, replace browser-token storage with a backend service or GitHub App.

The GitHub storage path remains available as a demo/back-up path, but the operational path should be Make.com + Airtable.

## Current Learning Features

- Voice recording and playback
- Live transcript through browser Web Speech API
- Question-fit scoring
- Sentence correction feedback
- Male/female coach selection
- 6 conversation situations with 10+ questions each
- Expected answer and extra practice for every question
- Student records, audio, teacher feedback, and statistics

## Project Planning Docs

- [Project brief](docs/00_project_brief_ko.md)
- [Airtable schema](docs/01_airtable_schema_ko.md)
- [Make.com scenarios](docs/02_make_scenarios_ko.md)
- [Maintenance guide](docs/03_maintenance_guide_ko.md)
- [Quote and scope](docs/04_quote_and_scope_ko.md)
- [SpeakMate webhook payload](docs/05_speakmate_webhook_payload_ko.md)

## Automation Assets

- [OpenAI structured output schema](automation/openai_lesson_feedback_schema.json)
- [Listening pool seed CSV](automation/listening_pool_seed.csv)
- [Teacher feedback template](automation/teacher_feedback_template.md)
