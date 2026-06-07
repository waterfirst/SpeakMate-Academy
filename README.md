# SpeakMate Academy

SpeakMate Academy is a browser-based English conversation helper for Korean learners and academy owners.

## Deployment

This repository is designed to run on GitHub Pages from the repository root.

Open the deployed app:

```text
https://waterfirst.github.io/SpeakMate-Academy/
```

## GitHub Student Storage

Practice records are saved under:

```text
student_records/<student-id>/
student_records/<student-id>/audio/
```

The app uses the GitHub Contents API from the browser. For writing records, the academy owner must enter a GitHub fine-grained token with contents read/write access to this repository.

Do not give the owner token to students. For production use, replace browser-token storage with a backend service or GitHub App.

## Current Learning Features

- Voice recording and playback
- Live transcript through browser Web Speech API
- Question-fit scoring
- Sentence correction feedback
- Male/female coach selection
- 6 conversation situations with 10+ questions each
- Expected answer and extra practice for every question
- Student records, audio, teacher feedback, and statistics
