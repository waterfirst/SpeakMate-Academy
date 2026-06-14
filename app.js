const scenes = window.SPEAKMATE_SCENES || {};
const GITHUB_OWNER = "waterfirst";
const GITHUB_REPO = "SpeakMate-Academy";
const GITHUB_BRANCH = "main";
const TOKEN_STORAGE_KEY = "speakmate_github_token";
const WEBHOOK_STORAGE_KEY = "speakmate_make_webhook_url";
const LAUNCH_PARAMS = new URLSearchParams(window.location.search);

const coaches = {
  female: {
    name: "Mina",
    bio: "친절하지만 정확한 여성 회화 파트너",
    image: "./assets/coach-female.png",
    voiceHints: ["female", "Samantha", "Jenny", "Google US English"],
  },
  male: {
    name: "Daniel",
    bio: "차분하고 실전적인 남성 회화 파트너",
    image: "./assets/coach-male.png",
    voiceHints: ["male", "Guy", "David", "Google UK English Male"],
  },
};

const samples = [
  ...Object.values(scenes).flatMap((scene) => scene.prompts.map((prompt) => prompt.sampleAnswer)),
  "I want speak English more better with my customer.",
  "Yesterday I meet my client and we was talking about price.",
];

const state = {
  scene: "cafe",
  promptIndex: 0,
  coach: "female",
  correctionCount: 0,
  score: 82,
  fit: 74,
  lastAnalysis: null,
  selectedRecordId: null,
  selectedRecord: null,
  mediaRecorder: null,
  audioChunks: [],
  lastAudio: null,
  lastAudioUrl: null,
  audioReadyPromise: null,
  stream: null,
  recognition: null,
  recognitionSupported: false,
  shouldRestartRecognition: false,
  transcriptWatchTimer: null,
  gotTranscript: false,
  adminUnlocked: false,
  isRecording: false,
  finalTranscript: "",
};

const el = {
  studentId: document.querySelector("#studentId"),
  loadStudentButton: document.querySelector("#loadStudentButton"),
  githubToken: document.querySelector("#githubToken"),
  rememberToken: document.querySelector("#rememberToken"),
  testGithubButton: document.querySelector("#testGithubButton"),
  githubStatus: document.querySelector("#githubStatus"),
  webhookUrl: document.querySelector("#webhookUrl"),
  rememberWebhook: document.querySelector("#rememberWebhook"),
  testWebhookButton: document.querySelector("#testWebhookButton"),
  webhookStatus: document.querySelector("#webhookStatus"),
  coachPortrait: document.querySelector("#coachPortrait"),
  stageCoachPortrait: document.querySelector("#stageCoachPortrait"),
  coachName: document.querySelector("#coachName"),
  coachBio: document.querySelector("#coachBio"),
  chatCoachName: document.querySelector("#chatCoachName"),
  coachChoices: document.querySelectorAll(".coach-choice"),
  sentenceInput: document.querySelector("#sentenceInput"),
  originalSentence: document.querySelector("#originalSentence"),
  correctedSentence: document.querySelector("#correctedSentence"),
  coachNotes: document.querySelector("#coachNotes"),
  correctButton: document.querySelector("#correctButton"),
  sampleButton: document.querySelector("#sampleButton"),
  savePracticeButton: document.querySelector("#savePracticeButton"),
  recordButton: document.querySelector("#recordButton"),
  recognitionStatus: document.querySelector("#recognitionStatus"),
  recordTitle: document.querySelector("#recordTitle"),
  recordSubtitle: document.querySelector("#recordSubtitle"),
  liveTranscript: document.querySelector("#liveTranscript"),
  confidenceText: document.querySelector("#confidenceText"),
  recordingPlayer: document.querySelector("#recordingPlayer"),
  playbackStatus: document.querySelector("#playbackStatus"),
  scoreValue: document.querySelector("#scoreValue"),
  fitValue: document.querySelector("#fitValue"),
  savedCount: document.querySelector("#savedCount"),
  sceneLabel: document.querySelector("#sceneLabel"),
  questionProgress: document.querySelector("#questionProgress"),
  coachPrompt: document.querySelector("#coachPrompt"),
  coachHint: document.querySelector("#coachHint"),
  promptTags: document.querySelector("#promptTags"),
  sampleAnswerText: document.querySelector("#sampleAnswerText"),
  drillText: document.querySelector("#drillText"),
  speakPromptButton: document.querySelector("#speakPromptButton"),
  nextPromptButton: document.querySelector("#nextPromptButton"),
  chatScene: document.querySelector("#chatScene"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  scenarioChips: document.querySelectorAll(".scenario-chip"),
  answerFitScore: document.querySelector("#answerFitScore"),
  answerFitText: document.querySelector("#answerFitText"),
  saveStatus: document.querySelector("#saveStatus"),
  saveDetail: document.querySelector("#saveDetail"),
  refreshRecordsButton: document.querySelector("#refreshRecordsButton"),
  recordsList: document.querySelector("#recordsList"),
  recordSummary: document.querySelector("#recordSummary"),
  teacherFeedback: document.querySelector("#teacherFeedback"),
  generateFeedbackButton: document.querySelector("#generateFeedbackButton"),
  saveFeedbackButton: document.querySelector("#saveFeedbackButton"),
  selectedRecordLabel: document.querySelector("#selectedRecordLabel"),
  feedbackStatus: document.querySelector("#feedbackStatus"),
  avgScore: document.querySelector("#avgScore"),
  avgFit: document.querySelector("#avgFit"),
  avgGrammar: document.querySelector("#avgGrammar"),
  lastPractice: document.querySelector("#lastPractice"),
  adminSection: document.querySelector("#adminSection"),
  adminContent: document.querySelector("#adminContent"),
  adminPassword: document.querySelector("#adminPassword"),
  adminUnlockButton: document.querySelector("#adminUnlockButton"),
  adminCollapseButton: document.querySelector("#adminCollapseButton"),
  adminStatus: document.querySelector("#adminStatus"),
};

function currentPrompt() {
  const scene = scenes[state.scene] || Object.values(scenes)[0];
  return scene.prompts[state.promptIndex] || scene.prompts[0];
}

function currentScene() {
  return scenes[state.scene] || Object.values(scenes)[0];
}

function sanitizeStudentId(value) {
  return value.trim().replace(/[^\w.-]/g, "-") || "student-001";
}

function unlockAdmin() {
  if (el.adminPassword.value !== "REDACTED") {
    el.adminStatus.textContent = "비밀번호가 맞지 않습니다.";
    el.adminPassword.select();
    return;
  }

  state.adminUnlocked = true;
  el.adminContent.hidden = false;
  el.adminSection.classList.remove("is-locked");
  el.adminSection.classList.add("is-open");
  el.adminStatus.textContent = "관리자 패널이 열렸습니다. 학생 기록, 피드백, 통계를 관리할 수 있습니다.";

  if (githubToken()) {
    loadStudentRecords();
  }
}

function collapseAdmin() {
  state.adminUnlocked = false;
  el.adminContent.hidden = true;
  el.adminSection.classList.add("is-locked");
  el.adminSection.classList.remove("is-open");
  el.adminStatus.textContent = "관리자 패널을 접었습니다. 다시 열려면 비밀번호를 입력하세요.";
  el.adminPassword.value = "";
}

function githubToken() {
  return el.githubToken.value.trim();
}

function makeWebhookUrl() {
  return el.webhookUrl.value.trim();
}

function rememberWebhookUrl() {
  if (el.rememberWebhook.checked && makeWebhookUrl()) {
    sessionStorage.setItem(WEBHOOK_STORAGE_KEY, makeWebhookUrl());
  } else {
    sessionStorage.removeItem(WEBHOOK_STORAGE_KEY);
  }
}

function buildRecordId(createdAt = new Date().toISOString()) {
  return `${createdAt.replace(/[^0-9A-Za-z]+/g, "-").replace(/^-|-$/g, "")}-${Math.random().toString(36).slice(2, 8)}`;
}

function rememberGithubToken() {
  if (el.rememberToken.checked && githubToken()) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, githubToken());
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

function pathForApi(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function utf8ToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function githubHeaders() {
  const token = githubToken();
  if (!token) {
    throw new Error("GitHub token is required for deployed storage.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function contentApiUrl(path) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${pathForApi(path)}`;
}

function audioExtension(mimeType = "") {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

async function githubGetContent(path) {
  const response = await fetch(`${contentApiUrl(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
    headers: githubHeaders(),
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function githubPutContent(path, contentBase64, message, sha) {
  const body = {
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  };

  if (sha) body.sha = sha;

  const response = await fetch(contentApiUrl(path), {
    method: "PUT",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function testGithubConnection() {
  rememberGithubToken();
  el.githubStatus.textContent = "GitHub 저장소 연결을 확인하고 있습니다.";

  try {
    const root = await githubGetContent("");
    const count = Array.isArray(root) ? root.length : 0;
    el.githubStatus.textContent = `연결 성공: ${GITHUB_OWNER}/${GITHUB_REPO} · root items ${count}`;
  } catch (error) {
    el.githubStatus.textContent = "연결 실패: token 권한 또는 네트워크를 확인하세요.";
  }
}

function sentenceCase(text) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

function replaceWithNote(text, pattern, replacement, note, notes) {
  const next = text.replace(pattern, replacement);
  if (next !== text) notes.push(note);
  return next;
}

function correctSentence(rawSentence) {
  const notes = [];
  let text = ` ${rawSentence.trim()} `;

  const replacements = [
    [/\bwant speak\b/gi, "want to speak", 'Use "want to" before a verb.'],
    [/\bwant learn\b/gi, "want to learn", 'Use "want to" before a verb.'],
    [/\bmore better\b/gi, "better", 'Use "better" instead of "more better".'],
    [/\bto home\b/gi, "home", 'Say "go home" without "to".'],
    [/\bbeen to there\b/gi, "been there", 'Say "been there" without "to".'],
    [/\brecommend me\b/gi, "recommend", 'Say "recommend a place to me" or simply "recommend a place".'],
    [/\bshe don't\b/gi, "she doesn't", 'Use "doesn\'t" with she, he, or it.'],
    [/\bhe don't\b/gi, "he doesn't", 'Use "doesn\'t" with she, he, or it.'],
    [/\bit don't\b/gi, "it doesn't", 'Use "doesn\'t" with she, he, or it.'],
    [/\bwe was\b/gi, "we were", 'Use "were" with we.'],
    [/\byou was\b/gi, "you were", 'Use "were" with you.'],
    [/\bI am exciting\b/gi, "I am excited", 'Use "excited" for your feeling and "exciting" for the thing.'],
    [/\bwas boring\b/gi, "was bored", 'Use "bored" for a person\'s feeling.'],
    [/\bcan to\b/gi, "can", 'After "can", use the base verb without "to".'],
    [/\bpeoples\b/gi, "people", 'Use "people" as the normal plural form.'],
    [/\bmy customer\b/gi, "my customers", 'For general conversation, plural "customers" sounds more natural.'],
    [/\bbusiness trip\b/gi, "a business trip", 'Add "a" before singular countable nouns.'],
    [/\bfor three day\b/gi, "for three days", 'Use plural nouns after numbers greater than one.'],
    [/\bI will staying\b/gi, "I will be staying", 'Use "will be staying" for a future stay.'],
  ];

  replacements.forEach(([pattern, replacement, note]) => {
    text = replaceWithNote(text, pattern, replacement, note, notes);
  });

  text = text.replace(/\bYesterday I meet\b/i, () => {
    notes.push('Use past tense after "yesterday": "met".');
    return "Yesterday I met";
  });

  text = text.replace(/\bwe were talking about price\b/i, () => {
    notes.push('Use "the price" when referring to a specific price.');
    return "we were talking about the price";
  });

  text = sentenceCase(text);
  const grammarScore = Math.max(55, 100 - notes.length * 11);

  if (notes.length === 0) {
    notes.push("The sentence is understandable and grammatically natural.");
  }

  return {
    original: rawSentence.trim(),
    corrected: text,
    notes,
    grammarScore,
  };
}

function evaluateAnswer(sentence) {
  const prompt = currentPrompt();
  const lower = sentence.toLowerCase();
  const matched = prompt.keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  let score = Math.min(100, 35 + matched.length * 14 + Math.min(wordCount, 16) * 2);

  if (wordCount < 4) score -= 18;
  if (/[?]$/.test(sentence.trim())) score -= 8;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const missing = prompt.expected.filter((item) => !lower.includes(item.split(" ")[0]));
  let feedback = "질문에 잘 맞는 답변입니다. 자연스럽게 한 문장 더 덧붙이면 더 좋습니다.";

  if (score < 55) {
    feedback = `질문에 대한 핵심 정보가 부족합니다. 이번 질문은 ${prompt.expected.join(", ")} 중심으로 답해야 합니다.`;
  } else if (score < 78) {
    feedback = `방향은 맞습니다. ${missing.slice(0, 2).join(", ") || "구체적인 정보"}를 더 넣으면 질문 적합도가 올라갑니다.`;
  }

  return {
    score,
    matched,
    missing,
    feedback,
    prompt: prompt.text,
    scene: currentScene().label,
    sampleAnswer: prompt.sampleAnswer,
    drill: prompt.drill,
  };
}

function analyzeSentence(rawSentence) {
  const correction = correctSentence(rawSentence);
  const fit = evaluateAnswer(correction.corrected || rawSentence);
  const notes = [...correction.notes];

  if (fit.score < 78) {
    notes.push(`Answer fit: ${fit.feedback}`);
  } else {
    notes.push("Answer fit: Your answer matches the current question.");
  }

  return {
    ...correction,
    fitScore: fit.score,
    fitFeedback: fit.feedback,
    matchedKeywords: fit.matched,
    missingItems: fit.missing,
    prompt: fit.prompt,
    scene: fit.scene,
    sampleAnswer: fit.sampleAnswer,
    drill: fit.drill,
    coach: coaches[state.coach].name,
    notes,
  };
}

function renderAnalysis(result, options = {}) {
  state.lastAnalysis = result;
  state.fit = result.fitScore;
  state.score = result.grammarScore;

  el.originalSentence.textContent = result.original || "No sentence yet.";
  el.correctedSentence.textContent = result.corrected || "Try speaking or typing a sentence.";
  el.answerFitScore.textContent = `${result.fitScore}%`;
  el.answerFitText.textContent = result.fitFeedback;
  el.fitValue.textContent = result.fitScore.toString();
  el.scoreValue.textContent = result.grammarScore.toString();
  el.coachNotes.innerHTML = "";

  result.notes.forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    el.coachNotes.append(item);
  });

  if (!options.silentMetric) {
    state.correctionCount += 1;
  }
}

function addMessage(role, text) {
  const message = document.createElement("article");
  message.className = `message ${role}`;

  const label = document.createElement("span");
  label.textContent = role === "coach" ? coaches[state.coach].name : "You";

  const body = document.createElement("p");
  body.textContent = text;

  message.append(label, body);
  el.chatLog.append(message);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

function coachReply(userText) {
  const result = analyzeSentence(userText);
  renderAnalysis(result);

  if (result.fitScore < 55) {
    return `Let's answer the question more directly. Try this structure: "${currentPrompt().expected[0]} + one detail." For grammar, a better sentence is: "${result.corrected}"`;
  }

  if (result.grammarScore < 88) {
    return `Your answer fits the question. A more natural version is: "${result.corrected}" Please repeat it once more.`;
  }

  return `Great. Your answer fits the question and sounds natural. Add one more detail if you want to sound more fluent.`;
}

function renderPromptTags() {
  el.promptTags.innerHTML = "";
  currentPrompt().expected.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    el.promptTags.append(tag);
  });
  el.sampleAnswerText.textContent = currentPrompt().sampleAnswer;
  el.drillText.textContent = currentPrompt().drill;
  el.questionProgress.textContent = `Question ${state.promptIndex + 1} / ${currentScene().prompts.length}`;
}

function updateScene(sceneKey) {
  state.scene = sceneKey;
  state.promptIndex = 0;
  const scene = currentScene();
  el.sceneLabel.textContent = scene.label;
  el.chatScene.textContent = scene.badge;
  el.coachPrompt.textContent = scene.prompts[0].text;
  el.coachHint.textContent = scene.prompts[0].hint;
  renderPromptTags();

  el.scenarioChips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.scene === sceneKey);
  });

  addMessage("coach", `Let's practice: ${scene.prompts[0].text}`);
  renderAnalysis(analyzeSentence(el.sentenceInput.value), { silentMetric: true });
}

function updateCoach(coachKey) {
  state.coach = coachKey;
  const coach = coaches[coachKey];
  el.coachName.textContent = coach.name;
  el.coachBio.textContent = coach.bio;
  el.chatCoachName.textContent = coach.name;
  el.coachPortrait.src = coach.image;
  el.stageCoachPortrait.src = coach.image;

  el.coachChoices.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.coach === coachKey);
  });

  addMessage("coach", `Hi, I am ${coach.name}. I will help you practice this question.`);
}

function nextPrompt() {
  const scene = currentScene();
  state.promptIndex = (state.promptIndex + 1) % scene.prompts.length;
  const prompt = scene.prompts[state.promptIndex];
  el.coachPrompt.textContent = prompt.text;
  el.coachHint.textContent = prompt.hint;
  renderPromptTags();
  addMessage("coach", prompt.text);
  renderAnalysis(analyzeSentence(el.sentenceInput.value), { silentMetric: true });
}

function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const hints = coaches[state.coach].voiceHints;
  return voices.find((voice) => hints.some((hint) => voice.name.toLowerCase().includes(hint.toLowerCase()))) || voices.find((voice) => voice.lang.startsWith("en")) || null;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function setPlaybackFromBlob(blob) {
  if (state.lastAudioUrl) {
    URL.revokeObjectURL(state.lastAudioUrl);
  }
  state.lastAudioUrl = URL.createObjectURL(blob);
  el.recordingPlayer.src = state.lastAudioUrl;
  el.playbackStatus.textContent = "녹음이 준비되었습니다. 아래 플레이어에서 다시 들어볼 수 있습니다.";
}

function setPlaybackFromSavedRecord(record) {
  if (!record.audioFile) {
    el.recordingPlayer.removeAttribute("src");
    el.playbackStatus.textContent = "선택한 기록에는 저장된 오디오가 없습니다.";
    return;
  }

  const studentId = sanitizeStudentId(el.studentId.value);
  el.recordingPlayer.src = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/student_records/${encodeURIComponent(studentId)}/${record.audioFile}`;
  el.playbackStatus.textContent = "선택한 저장 기록의 녹음을 재생할 수 있습니다.";
}

function clearTranscriptTimer() {
  if (state.transcriptWatchTimer) {
    window.clearTimeout(state.transcriptWatchTimer);
    state.transcriptWatchTimer = null;
  }
}

function armTranscriptTimer() {
  clearTranscriptTimer();
  state.transcriptWatchTimer = window.setTimeout(() => {
    if (!state.isRecording || state.gotTranscript) return;
    el.liveTranscript.textContent = "아직 음성 인식 결과가 없습니다. 마이크 권한, Chrome/Edge 사용 여부, 인터넷 연결을 확인하세요.";
    el.confidenceText.textContent = "녹음 파일은 계속 저장됩니다. 인식이 안 되면 Your sentence에 직접 수정 입력하세요.";
  }, 4500);
}

function setRecordingUi(isRecording) {
  state.isRecording = isRecording;
  el.recordButton.classList.toggle("is-listening", isRecording);
  el.recognitionStatus.textContent = isRecording ? "Listening" : "Ready";
  el.recordTitle.textContent = isRecording ? "녹음 중지" : "녹음 시작";
  el.recordSubtitle.textContent = isRecording ? "다시 누르면 녹음과 음성 인식을 종료합니다." : "질문에 맞춰 영어로 답하면 Your Sentence에 실시간으로 반영됩니다.";
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    el.recognitionStatus.textContent = "Typing mode";
    el.liveTranscript.textContent = "이 브라우저는 Live transcript를 지원하지 않습니다.";
    el.confidenceText.textContent = "Chrome 또는 Edge에서 http://127.0.0.1:8765/로 접속하면 브라우저 음성 인식을 사용할 수 있습니다.";
    el.recordSubtitle.textContent = "음성 인식은 지원되지 않지만 녹음 저장과 재생은 사용할 수 있습니다.";
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 3;
  state.recognitionSupported = true;
  el.confidenceText.textContent = "음성 인식 준비 완료: Chrome/Edge에서 가장 안정적으로 동작합니다.";

  recognition.addEventListener("start", () => {
    el.recognitionStatus.textContent = "Listening";
    armTranscriptTimer();
  });

  recognition.addEventListener("result", (event) => {
    let interimTranscript = "";
    let bestConfidence = 0;
    state.gotTranscript = true;
    clearTranscriptTimer();

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const best = result[0];
      bestConfidence = Math.max(bestConfidence, best.confidence || 0);

      if (result.isFinal) {
        state.finalTranscript = `${state.finalTranscript} ${best.transcript}`.trim();
      } else {
        interimTranscript += best.transcript;
      }
    }

    const combined = `${state.finalTranscript} ${interimTranscript}`.trim();
    if (combined) {
      el.sentenceInput.value = combined;
      el.liveTranscript.textContent = combined;
    }

    el.confidenceText.textContent = bestConfidence > 0 ? `음성 인식 신뢰도: ${Math.round(bestConfidence * 100)}%` : "음성 인식 신뢰도: 계산 중";
  });

  recognition.addEventListener("end", () => {
    clearTranscriptTimer();
    if (state.isRecording && state.shouldRestartRecognition) {
      window.setTimeout(() => {
        if (!state.isRecording || !state.shouldRestartRecognition) return;
        try {
          recognition.start();
        } catch {
          el.recognitionStatus.textContent = "Restart failed";
        }
      }, 350);
      return;
    }

    if (el.sentenceInput.value.trim()) {
      renderAnalysis(analyzeSentence(el.sentenceInput.value));
    }
  });

  recognition.addEventListener("error", (event) => {
    clearTranscriptTimer();
    const messages = {
      "no-speech": "음성이 감지되지 않았습니다. 조금 더 크게 말하거나 마이크 입력 장치를 확인하세요.",
      "audio-capture": "마이크 장치를 사용할 수 없습니다. 브라우저 마이크 권한을 확인하세요.",
      "not-allowed": "마이크 권한이 거부되었습니다. 주소창 왼쪽 권한 설정에서 마이크를 허용하세요.",
      network: "브라우저 음성 인식 서비스 연결에 실패했습니다. 인터넷 연결 또는 브라우저 지원 여부를 확인하세요.",
      aborted: "음성 인식이 중단되었습니다.",
    };
    el.recognitionStatus.textContent = event.error === "no-speech" ? "No speech" : "Typing mode";
    el.liveTranscript.textContent = messages[event.error] || `음성 인식 오류: ${event.error}`;
    el.recordSubtitle.textContent = "녹음 파일은 저장됩니다. 인식이 안 되면 Your sentence에 직접 입력하세요.";
  });

  return recognition;
}

async function startRecording() {
  state.finalTranscript = "";
  state.audioChunks = [];
  state.lastAudio = null;
  state.gotTranscript = false;
  state.shouldRestartRecognition = true;
  state.audioReadyPromise = Promise.resolve(null);
  if (state.lastAudioUrl) {
    URL.revokeObjectURL(state.lastAudioUrl);
    state.lastAudioUrl = null;
  }
  el.recordingPlayer.removeAttribute("src");
  el.playbackStatus.textContent = "녹음 중입니다. 종료 후 다시 들어볼 수 있습니다.";
  el.liveTranscript.textContent = "말하는 내용을 듣고 있습니다.";
  el.saveStatus.textContent = "Recording";
  el.saveDetail.textContent = "녹음 종료 후 분석하고 서버 저장을 누르세요.";
  setRecordingUi(true);

  try {
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.mediaRecorder = new MediaRecorder(state.stream);
    state.audioReadyPromise = new Promise((resolve) => {
      state.mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(state.audioChunks, { type: state.mediaRecorder.mimeType || "audio/webm" });
        setPlaybackFromBlob(blob);
        state.lastAudio = {
          mimeType: blob.type,
          base64: await blobToBase64(blob),
        };
        if (state.stream) {
          state.stream.getTracks().forEach((track) => track.stop());
        }
        resolve(state.lastAudio);
      }, { once: true });
    });

    state.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) state.audioChunks.push(event.data);
    });

    state.mediaRecorder.start();
  } catch (error) {
    el.saveStatus.textContent = "Mic blocked";
    el.saveDetail.textContent = "마이크 권한이 없어 오디오 저장 없이 문장만 저장합니다.";
    el.playbackStatus.textContent = "마이크 권한이 없어 녹음 재생 파일을 만들지 못했습니다.";
  }

  if (state.recognition) {
    try {
      state.recognition.start();
    } catch {
      el.recordSubtitle.textContent = "음성 인식은 이미 실행 중입니다.";
    }
  }
}

function stopRecording() {
  state.shouldRestartRecognition = false;
  setRecordingUi(false);
  clearTranscriptTimer();

  if (state.recognition) {
    try {
      state.recognition.stop();
    } catch {
      // Some browsers stop recognition automatically.
    }
  }

  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }

  if (!state.finalTranscript && !state.gotTranscript && el.sentenceInput.value.trim()) {
    el.liveTranscript.textContent = "자동 인식 결과가 없어 현재 Your sentence 입력값을 분석합니다.";
  }

  renderAnalysis(analyzeSentence(el.sentenceInput.value));
  el.saveStatus.textContent = "Ready to save";
  el.saveDetail.textContent = "답변 분석이 끝났습니다. 학생 ID로 서버에 저장할 수 있습니다.";
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const text = await response.text();
  if (!text) return { ok: true };

  try {
    return JSON.parse(text);
  } catch {
    return { ok: true, text };
  }
}

async function testWebhookConnection() {
  rememberWebhookUrl();

  if (!makeWebhookUrl()) {
    el.webhookStatus.textContent = "Make webhook URL을 먼저 입력하세요.";
    return;
  }

  el.webhookStatus.textContent = "Make webhook 연결을 확인하고 있습니다.";

  try {
    await postJson(makeWebhookUrl(), {
      eventType: "connection_test",
      source: "SpeakMate Academy",
      createdAt: new Date().toISOString(),
      studentId: sanitizeStudentId(el.studentId.value),
    });
    el.webhookStatus.textContent = "연결 성공: Make 시나리오가 요청을 받았습니다.";
  } catch {
    el.webhookStatus.textContent = "연결 실패: webhook URL, Make 시나리오 활성화, CORS 응답 설정을 확인하세요.";
  }
}

async function savePracticeToWebhook(studentId, analysis) {
  rememberWebhookUrl();

  const createdAt = new Date().toISOString();
  const recordId = buildRecordId(createdAt);
  const scene = currentScene();
  const prompt = currentPrompt();
  const payload = {
    eventType: "speaking_practice_saved",
    source: "SpeakMate Academy",
    storageProvider: "make_airtable",
    recordId,
    studentId,
    lessonId: LAUNCH_PARAMS.get("lessonId") || "",
    level: LAUNCH_PARAMS.get("level") || "",
    createdAt,
    savedAt: createdAt,
    pageUrl: window.location.href,
    sceneKey: state.scene,
    scene: scene.label,
    promptIndex: state.promptIndex,
    prompt: prompt.text,
    sampleAnswer: prompt.sampleAnswer,
    drill: prompt.drill,
    coachKey: state.coach,
    coachName: coaches[state.coach].name,
    transcript: analysis.original,
    corrected: analysis.corrected,
    notes: analysis.notes,
    fitScore: analysis.fitScore,
    grammarScore: analysis.grammarScore,
    matchedKeywords: analysis.matchedKeywords,
    missingItems: analysis.missingItems,
    audioBase64: state.lastAudio?.base64 || null,
    audioMimeType: state.lastAudio?.mimeType || null,
  };

  const response = await postJson(makeWebhookUrl(), payload);

  return {
    ok: true,
    recordId: response.recordId || recordId,
    provider: "make_airtable",
    response,
  };
}

async function savePracticeToGithub(studentId, analysis) {
  rememberGithubToken();

  const createdAt = new Date().toISOString();
  const recordId = buildRecordId(createdAt);
  let audioFile = null;

  if (state.lastAudio?.base64) {
    const extension = audioExtension(state.lastAudio.mimeType);
    audioFile = `audio/${recordId}.${extension}`;
    await githubPutContent(
      `student_records/${studentId}/${audioFile}`,
      state.lastAudio.base64,
      `Save audio for ${studentId} ${recordId}`
    );
  }

  const record = {
    recordId,
    studentId,
    storageProvider: "github",
    repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    branch: GITHUB_BRANCH,
    createdAt,
    savedAt: createdAt,
    audioFile,
    sceneKey: state.scene,
    scene: currentScene().label,
    promptIndex: state.promptIndex,
    prompt: currentPrompt().text,
    sampleAnswer: currentPrompt().sampleAnswer,
    drill: currentPrompt().drill,
    coachKey: state.coach,
    coachName: coaches[state.coach].name,
    transcript: analysis.original,
    corrected: analysis.corrected,
    notes: analysis.notes,
    fitScore: analysis.fitScore,
    grammarScore: analysis.grammarScore,
    matchedKeywords: analysis.matchedKeywords,
    missingItems: analysis.missingItems,
  };

  const jsonPath = `student_records/${studentId}/${recordId}.json`;
  const result = await githubPutContent(
    jsonPath,
    utf8ToBase64(JSON.stringify(record, null, 2)),
    `Save practice record for ${studentId} ${recordId}`
  );

  return {
    ok: true,
    recordId,
    audioFile,
    path: jsonPath,
    sha: result.content?.sha,
  };
}

async function loadStudentRecordsFromGithub(studentId) {
  rememberGithubToken();
  const directory = await githubGetContent(`student_records/${studentId}`);

  if (!directory || !Array.isArray(directory)) {
    return { records: [], stats: statsForRecords([]) };
  }

  const jsonFiles = directory.filter((entry) => entry.type === "file" && entry.name.endsWith(".json"));
  const records = [];

  for (const entry of jsonFiles) {
    const response = await fetch(`${entry.download_url}?t=${Date.now()}`);
    if (!response.ok) continue;
    const record = await response.json();
    record._sha = entry.sha;
    record._path = entry.path;
    record._downloadUrl = entry.download_url;
    records.push(record);
  }

  records.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return { records, stats: statsForRecords(records) };
}

function statsForRecords(records) {
  if (!records.length) {
    return {
      averageFit: 0,
      averageGrammar: 0,
      averageOverall: 0,
      lastPractice: null,
    };
  }

  const averageFit = records.reduce((sum, record) => sum + Number(record.fitScore || 0), 0) / records.length;
  const averageGrammar = records.reduce((sum, record) => sum + Number(record.grammarScore || 0), 0) / records.length;
  return {
    averageFit,
    averageGrammar,
    averageOverall: (averageFit + averageGrammar) / 2,
    lastPractice: records[0].createdAt,
  };
}

async function savePractice() {
  const studentId = sanitizeStudentId(el.studentId.value);
  el.studentId.value = studentId;
  const analysis = state.lastAnalysis || analyzeSentence(el.sentenceInput.value);
  renderAnalysis(analysis, { silentMetric: true });

  if (makeWebhookUrl()) {
    el.saveStatus.textContent = "Saving";
    el.saveDetail.textContent = "Make webhook으로 연습 기록을 전송하고 있습니다.";

    try {
      if (state.audioReadyPromise) {
        await state.audioReadyPromise;
      }
      const saved = await savePracticeToWebhook(studentId, analysis);
      el.saveStatus.textContent = "Saved";
      el.saveDetail.textContent = `Make/Airtable 저장 요청 완료: ${saved.recordId}`;
      el.webhookStatus.textContent = "최근 연습 기록이 Make webhook으로 전송되었습니다.";
      state.selectedRecordId = saved.recordId;
    } catch {
      el.saveStatus.textContent = "Webhook error";
      el.saveDetail.textContent = "Make webhook URL, 시나리오 활성화, Webhook Response CORS 설정을 확인하세요.";
    }
    return;
  }

  if (!state.adminUnlocked) {
    el.saveStatus.textContent = "Admin locked";
    el.saveDetail.textContent = "운영 저장은 Make webhook URL을 입력하면 사용할 수 있습니다. GitHub 저장은 관리자 패널이 필요합니다.";
    el.adminStatus.textContent = "Make webhook URL을 입력하거나, 비밀번호 REDACTED으로 관리자 패널을 열어 GitHub 저장을 사용하세요.";
    return;
  }

  el.saveStatus.textContent = "Saving";
  el.saveDetail.textContent = "GitHub student_records 폴더에 학생 기록을 저장하고 있습니다.";

  try {
    if (state.audioReadyPromise) {
      await state.audioReadyPromise;
    }
    const saved = await savePracticeToGithub(studentId, analysis);

    el.saveStatus.textContent = "Saved";
    el.saveDetail.textContent = `GitHub 저장 완료: student_records/${studentId}/${saved.recordId}.json`;
    state.selectedRecordId = saved.recordId;
    await loadStudentRecords();
  } catch (error) {
    el.saveStatus.textContent = "GitHub error";
    el.saveDetail.textContent = "GitHub token 권한을 확인하세요. Contents 읽기/쓰기 권한이 필요합니다.";
  }
}

async function loadStudentRecords() {
  if (!state.adminUnlocked) {
    el.recordSummary.textContent = "Admin locked";
    el.adminStatus.textContent = "학생 기록 조회는 관리자 패널을 연 뒤 사용할 수 있습니다.";
    return;
  }

  const studentId = sanitizeStudentId(el.studentId.value);
  el.studentId.value = studentId;

  try {
    const data = await loadStudentRecordsFromGithub(studentId);
    renderRecords(data.records || [], data.stats || {});
  } catch {
    renderRecords([], {});
    el.recordSummary.textContent = "GitHub not connected";
    el.githubStatus.textContent = "기록 조회 실패: token 권한 또는 student_records 경로를 확인하세요.";
  }
}

function renderRecords(records, stats) {
  el.savedCount.textContent = String(records.length);
  el.recordSummary.textContent = `${records.length} records`;
  el.avgScore.textContent = `${Math.round(stats.averageOverall || 0)}%`;
  el.avgFit.textContent = `${Math.round(stats.averageFit || 0)}%`;
  el.avgGrammar.textContent = `${Math.round(stats.averageGrammar || 0)}%`;
  el.lastPractice.textContent = stats.lastPractice ? new Date(stats.lastPractice).toLocaleString() : "-";
  el.recordsList.innerHTML = "";

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "아직 저장된 학생 기록이 없습니다.";
    el.recordsList.append(empty);
    return;
  }

  records.forEach((record) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-item";
    button.dataset.recordId = record.recordId;
    button.innerHTML = `
      <span>${record.scene || "Practice"} · ${record.coachName || "Coach"}</span>
      <strong>${Math.round(((record.fitScore || 0) + (record.grammarScore || 0)) / 2)}%</strong>
      <p>${record.transcript || ""}</p>
      <small>${record.createdAt ? new Date(record.createdAt).toLocaleString() : ""}${record.audioFile ? " · audio saved" : ""}</small>
    `;
    button.addEventListener("click", () => selectRecord(record));
    el.recordsList.append(button);
  });
}

function selectRecord(record) {
  state.selectedRecord = record;
  state.selectedRecordId = record.recordId;
  el.selectedRecordLabel.textContent = record.recordId;
  el.teacherFeedback.value = record.teacherFeedback || "";
  el.feedbackStatus.textContent = "선택한 기록에 피드백을 작성할 수 있습니다.";
  setPlaybackFromSavedRecord(record);
}

function generateFeedbackDraft() {
  const record = state.selectedRecord || state.lastAnalysis;
  if (!record) {
    el.feedbackStatus.textContent = "먼저 저장 기록을 선택하거나 답변 분석을 실행하세요.";
    return;
  }

  const transcript = record.transcript || record.original || "";
  const corrected = record.corrected || "";
  const fitScore = record.fitScore || 0;
  const grammarScore = record.grammarScore || 0;
  const nextTask = fitScore < 75 ? "다음 수업에서는 질문의 핵심 정보부터 먼저 말하는 훈련을 반복하세요." : "다음 수업에서는 같은 답변에 이유와 세부 정보를 한 문장 더 붙이는 훈련을 하세요.";

  el.teacherFeedback.value = [
    `학생 답변: ${transcript}`,
    `교정 문장: ${corrected}`,
    `질문 적합도 ${fitScore}%, 문장 점수 ${grammarScore}%입니다.`,
    `좋은 점: 답변을 영어로 완성하려는 시도가 좋습니다.`,
    `개선점: ${record.fitFeedback || "질문 의도와 핵심 표현을 더 명확히 연결하세요."}`,
    `예상 답변 예시: ${record.sampleAnswer || currentPrompt().sampleAnswer}`,
    `추가 연습: ${record.drill || nextTask}`,
  ].join("\n");
}

async function saveFeedback() {
  if (!state.selectedRecordId) {
    el.feedbackStatus.textContent = "피드백을 저장할 기록을 먼저 선택하세요.";
    return;
  }

  try {
    rememberGithubToken();
    const studentId = sanitizeStudentId(el.studentId.value);
    const current = state.selectedRecord || {};
    const path = current._path || `student_records/${studentId}/${state.selectedRecordId}.json`;
    let sha = current._sha;

    if (!sha) {
      const remote = await githubGetContent(path);
      sha = remote?.sha;
    }

    const updatedRecord = {
      ...current,
      teacherFeedback: el.teacherFeedback.value.trim(),
      feedbackUpdatedAt: new Date().toISOString(),
    };
    delete updatedRecord._sha;
    delete updatedRecord._path;
    delete updatedRecord._downloadUrl;

    await githubPutContent(
      path,
      utf8ToBase64(JSON.stringify(updatedRecord, null, 2)),
      `Save feedback for ${studentId} ${state.selectedRecordId}`,
      sha
    );
    el.feedbackStatus.textContent = "피드백이 GitHub 기록 파일에 저장되었습니다.";
    await loadStudentRecords();
  } catch {
    el.feedbackStatus.textContent = "피드백 저장 실패: GitHub token 권한을 확인하세요.";
  }
}

el.correctButton.addEventListener("click", () => {
  const result = analyzeSentence(el.sentenceInput.value);
  renderAnalysis(result);
  addMessage("user", result.original);
  addMessage("coach", coachReply(result.original));
});

el.sampleButton.addEventListener("click", () => {
  const currentIndex = samples.indexOf(el.sentenceInput.value);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % samples.length;
  el.sentenceInput.value = samples[nextIndex];
  renderAnalysis(analyzeSentence(el.sentenceInput.value));
});

el.recordButton.addEventListener("click", () => {
  if (state.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

el.savePracticeButton.addEventListener("click", savePractice);
el.loadStudentButton.addEventListener("click", loadStudentRecords);
el.adminUnlockButton.addEventListener("click", unlockAdmin);
el.adminCollapseButton.addEventListener("click", collapseAdmin);
el.adminPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlockAdmin();
  }
});
el.testGithubButton.addEventListener("click", testGithubConnection);
el.githubToken.addEventListener("change", rememberGithubToken);
el.rememberToken.addEventListener("change", rememberGithubToken);
el.testWebhookButton.addEventListener("click", testWebhookConnection);
el.webhookUrl.addEventListener("change", rememberWebhookUrl);
el.rememberWebhook.addEventListener("change", rememberWebhookUrl);
el.refreshRecordsButton.addEventListener("click", loadStudentRecords);
el.generateFeedbackButton.addEventListener("click", generateFeedbackDraft);
el.saveFeedbackButton.addEventListener("click", saveFeedback);

el.scenarioChips.forEach((chip) => {
  chip.addEventListener("click", () => updateScene(chip.dataset.scene));
});

el.coachChoices.forEach((button) => {
  button.addEventListener("click", () => updateCoach(button.dataset.coach));
});

el.nextPromptButton.addEventListener("click", nextPrompt);
el.speakPromptButton.addEventListener("click", () => speak(el.coachPrompt.textContent));

el.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userText = el.chatInput.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  el.sentenceInput.value = userText;
  const reply = coachReply(userText);
  addMessage("coach", reply);
  speak(reply.replace(/"[^"]+"/g, ""));
  el.chatInput.value = "";
});

state.recognition = setupSpeechRecognition();
renderPromptTags();
renderAnalysis(analyzeSentence(el.sentenceInput.value), { silentMetric: true });
const studentIdFromUrl = LAUNCH_PARAMS.get("studentId") || LAUNCH_PARAMS.get("student");
if (studentIdFromUrl) {
  el.studentId.value = sanitizeStudentId(studentIdFromUrl);
}
const webhookFromUrl = LAUNCH_PARAMS.get("webhookUrl") || LAUNCH_PARAMS.get("webhook") || LAUNCH_PARAMS.get("endpoint");
const rememberedWebhook = sessionStorage.getItem(WEBHOOK_STORAGE_KEY);
if (webhookFromUrl) {
  el.webhookUrl.value = webhookFromUrl;
  el.webhookStatus.textContent = "URL 파라미터로 Make webhook이 설정되었습니다.";
} else if (rememberedWebhook) {
  el.webhookUrl.value = rememberedWebhook;
  el.rememberWebhook.checked = true;
  el.webhookStatus.textContent = "저장된 Make webhook URL이 있습니다.";
} else {
  el.webhookStatus.textContent = "Make webhook URL을 입력하면 Airtable/Google Drive로 기록을 보낼 수 있습니다.";
}
const rememberedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
if (rememberedToken) {
  el.githubToken.value = rememberedToken;
  el.rememberToken.checked = true;
  el.githubStatus.textContent = "저장된 GitHub token이 있습니다. 관리자 패널을 열면 기록을 조회합니다.";
} else {
  el.githubStatus.textContent = "GitHub token을 입력하면 student_records/<student-id>/에 저장됩니다.";
}
collapseAdmin();
renderRecords([], {});
