const STORAGE_KEY = "qisi-innovation-coach-v1";
const SESSION_VERSION = 2;
const WELCOME_GREETING = "Hi，我是你的 AI 创新陪练 Cheese。";

const STAGES = [
  { id: "start", icon: "启", title: "陪练启动", subtitle: "明确真实问题" },
  { id: "break", icon: "破", title: "四问破题", subtitle: "重新表征问题" },
  { id: "expand", icon: "扩", title: "四维发散", subtitle: "打开方案空间" },
  { id: "screen", icon: "筛", title: "四则收敛", subtitle: "形成创新决策" },
  { id: "result", icon: "果", title: "成果整理", subtitle: "思维反思与导出" },
];

const CRITERIA = [
  {
    id: "user",
    name: "用户",
    mark: "人",
    headerPrompt: "找准了吗？",
    question: "这个方案找准用户了吗？谁是最直接、最核心的受益者？",
    note: "判断谁真正受益，避免把用户说得过于宽泛。",
    feedback: "用户边界已记录。接下来继续检验问题是否真实、重要。",
    options: ["通过", "待调整"],
    positiveValue: "通过",
  },
  {
    id: "pain",
    name: "痛点",
    mark: "痛",
    headerPrompt: "抓住了吗？",
    question: "这个方案抓住核心痛点了吗？它是真实、高频且重要的问题吗？",
    note: "痛点看现在：这个问题值不值得解决。",
    feedback: "痛点判断已记录。下一步看方案是否符合现实条件。",
    options: ["通过", "待调整"],
    positiveValue: "通过",
  },
  {
    id: "resource",
    name: "资源",
    mark: "资",
    headerPrompt: "现实满足吗？",
    question: "结合时间、成本、人员和技术，这个方案当前做得到吗？",
    note: "若条件不足，可考虑缩小规模，或判断更适合现在还是以后。",
    feedback: "现实条件已记录。最后检验它能否推动核心目标。",
    options: ["满足", "暂不满足"],
    positiveValue: "满足",
  },
  {
    id: "goal",
    name: "目标",
    mark: "标",
    headerPrompt: "推动了吗？",
    question: "方案实施后，什么变化能够证明它推动了本轮创新目标？",
    note: "目标看未来：它能否把问题改善到希望的状态。",
    feedback: "四则检验已完成。我们继续比较下一项候选方案。",
    options: ["推动", "推动有限"],
    positiveValue: "推动",
  },
];

function isRecordedScreeningValue(criterion, value) {
  const normalized = String(value || "").trim();
  return criterion.options.includes(normalized) || normalized.length >= 6;
}

function screeningConclusion(checks = {}) {
  const complete = CRITERIA.every((criterion) => isRecordedScreeningValue(criterion, checks[criterion.id]));
  if (!complete) return { label: "待完成", tone: "pending" };

  const usesLegacyText = CRITERIA.some(
    (criterion) => !criterion.options.includes(String(checks[criterion.id] || "").trim()),
  );
  if (usesLegacyText) return { label: "已记录", tone: "recorded" };

  const allPositive = CRITERIA.every(
    (criterion) => checks[criterion.id] === criterion.positiveValue,
  );
  return allPositive
    ? { label: "可优先考虑", tone: "positive" }
    : { label: "需要调整", tone: "adjust" };
}

const TEXT_STEPS = {
  problem: {
    stage: "start",
    eyebrow: "陪练启动",
    title: "明确你的真实问题",
    badge: "准备开始",
    label: "你想解决的真实问题",
    placeholder: "例如：校园创新创业活动参与度不高……",
    question: "请先把你要解决的真实问题告诉我。尽量描述真实场景，而不是直接给出解决方案。",
    minLength: 8,
    next: "facts",
    progress: 3,
    hint: "先说清楚谁、在什么场景、遇到了什么问题。",
  },
  facts: {
    stage: "break",
    eyebrow: "第一阶 · 破",
    title: "事实是什么？",
    badge: "破 1/4",
    label: "列出 2—3 条可观察或验证的事实",
    placeholder: "一行一条，例如：过去三次活动的到场率均低于报名人数的 50%",
    question: "关于这个问题，哪些信息是已经客观发生、可以被观察或验证的事实？请先列出 2—3 条。",
    minLength: 8,
    next: "constraints",
    progress: 10,
    hint: "事实可以被记录或验证；“我觉得”通常是观点。",
  },
  constraints: {
    stage: "break",
    eyebrow: "第一阶 · 破",
    title: "约束是什么？",
    badge: "破 2/4",
    label: "写下当前必须面对的现实约束",
    placeholder: "可从时间、成本、空间、制度、技术等方面思考",
    question: "哪些条件是当前必须面对、暂时不能忽略的现实约束？它们真的不能改变吗？",
    minLength: 6,
    next: "assumptions",
    progress: 18,
    hint: "区分“确实受限”和“过去一直这样做”。",
  },
  assumptions: {
    stage: "break",
    eyebrow: "第一阶 · 破",
    title: "假设是什么？",
    badge: "破 3/4",
    label: "识别 1—2 个尚未被证明的默认假设",
    placeholder: "例如：我们默认学生只有获得学分才愿意参加……",
    question: "哪些条件是你习惯性认为“必须如此”，但其实并没有被证明？至少找出 1 个隐藏假设。",
    minLength: 6,
    next: "reframe",
    progress: 26,
    hint: "追问自己：为什么必须这样？如果它不存在呢？",
  },
  reframe: {
    stage: "break",
    eyebrow: "第一阶 · 破",
    title: "问题还能怎么问？",
    badge: "破 4/4",
    label: "写出一个能改变搜索方向的新问题",
    placeholder: "拿掉一个默认假设，重新表述问题……",
    question: "如果暂时拿掉刚才发现的一个默认假设，你会怎样重新表述这个问题？",
    minLength: 10,
    next: "object",
    progress: 34,
    hint: "不只是换词，新问题应当打开不同的解决方向。",
  },
  object: {
    stage: "expand",
    eyebrow: "第二阶 · 扩",
    title: "对象：换谁？",
    badge: "扩 1/4",
    label: "从参与者、角色或关系出发提出方案方向",
    placeholder: "可以一行写一个方向；暂时不要判断可行性",
    question: "目前的思路主要在改变谁？还能改变哪些参与者的行为、角色或关系？请提出至少一个方向。",
    minLength: 6,
    next: "time",
    progress: 42,
    hint: "关注不同利益相关者，而不是急着给出完整方案。",
  },
  time: {
    stage: "expand",
    eyebrow: "第二阶 · 扩",
    title: "时间：换何时？",
    badge: "扩 2/4",
    label: "从时点或发生顺序出发提出方案方向",
    placeholder: "能否提前、延后，或改变发生顺序？",
    question: "这个问题一定要在现在这个时点解决吗？能不能提前、延后，或者改变发生顺序？",
    minLength: 6,
    next: "space",
    progress: 50,
    hint: "先打开可能性，不急着评价成本和难度。",
  },
  space: {
    stage: "expand",
    eyebrow: "第二阶 · 扩",
    title: "空间：换何处？",
    badge: "扩 3/4",
    label: "从地点或空间结构出发提出方案方向",
    placeholder: "能否转移、分散、集中或重新组合？",
    question: "问题一定要在当前地点或空间结构中解决吗？能否转移、分散、集中或重新组合？",
    minLength: 6,
    next: "process",
    progress: 58,
    hint: "空间既可以是物理地点，也可以是线上或组织空间。",
  },
  process: {
    stage: "expand",
    eyebrow: "第二阶 · 扩",
    title: "流程：换哪一步？",
    badge: "扩 4/4",
    label: "从流程步骤出发提出方案方向",
    placeholder: "哪一步可以取消、前移、后移、拆分、合并或重做？",
    question: "整个过程可以拆成哪些步骤？其中哪一步可以取消、前移、后移、拆分、合并或重新设计？",
    minLength: 6,
    next: "candidate_select",
    progress: 66,
    hint: "尝试改变流程结构，而不只是给原流程增加工具。",
  },
  reflection: {
    stage: "result",
    eyebrow: "思维反思",
    title: "看见思路的变化",
    badge: "最后一步",
    label: "你的思维反思",
    placeholder: "哪一步改变了你的第一答案？为什么？",
    question: "与你最开始的第一答案相比，哪一步最明显地改变了你的思路？",
    minLength: 8,
    next: "complete",
    progress: 99,
    hint: "回看“破、扩、筛”中最关键的一次转折。",
  },
};

const NO_IDEA_PATTERN = /^(不知道|没想法|没有思路|想不到|不会|不清楚|没有)$/;
const OPINION_PATTERN = /(我觉得|我认为|可能|大概|应该|似乎|肯定会|一定会)/;

const elements = {
  stageNav: document.querySelector("#stageNav"),
  phaseEyebrow: document.querySelector("#phaseEyebrow"),
  phaseTitle: document.querySelector("#phaseTitle"),
  stepBadge: document.querySelector("#stepBadge"),
  overallProgressBar: document.querySelector("#overallProgressBar"),
  stageIntro: document.querySelector("#stageIntro"),
  messageList: document.querySelector("#messageList"),
  interactionCard: document.querySelector("#interactionCard"),
  chatScroll: document.querySelector("#chatScroll"),
  resultContent: document.querySelector("#resultContent"),
  resultPanel: document.querySelector("#resultPanel"),
  savedStatus: document.querySelector("#savedStatus"),
  toast: document.querySelector("#toast"),
  sidebar: document.querySelector(".sidebar"),
  overlay: document.querySelector("#overlay"),
};

let state = loadState();
let saveTimer;
let toastTimer;
let fireworksTimer;
let activeRecognition = null;
let activeVoiceButton = null;

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

function createInitialState() {
  return {
    version: SESSION_VERSION,
    step: "problem",
    answers: {},
    attempts: {},
    messages: [
      {
        role: "coach",
        text: "你好，我是你的创新思维陪练。我不会直接替你生成答案，而会陪你按照“破—扩—筛”一步步形成方案。我们先从真实问题开始。",
      },
      {
        role: "coach",
        text: TEXT_STEPS.problem.question,
      },
    ],
    candidates: [],
    screening: {},
    screeningCursor: { candidate: 0, criterion: 0 },
    decision: { candidateId: "" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === SESSION_VERSION && saved.step && Array.isArray(saved.messages)) {
      const removedSteps = ["responsibility_user", "responsibility_ethics", "responsibility_cost", "responsibility_green"];
      const wasRemovedStep = removedSteps.includes(saved.step);
      let migrated = false;
      removedSteps.forEach((step) => {
        if (Object.prototype.hasOwnProperty.call(saved.answers || {}, step)) {
          delete saved.answers[step];
          migrated = true;
        }
      });

      const removedMessageStart = saved.messages.findIndex((message) => message.text?.includes("接下来做创新责任检查"));
      if (removedMessageStart >= 0) {
        const removedMessageEnd = saved.messages.findIndex(
          (message, index) => index >= removedMessageStart && message.text?.includes("责任检查完成"),
        );
        const deleteCount = removedMessageEnd >= 0
          ? removedMessageEnd - removedMessageStart + 1
          : saved.messages.length - removedMessageStart;
        saved.messages.splice(removedMessageStart, deleteCount);
        migrated = true;
      }

      if (wasRemovedStep) {
        saved.step = "reflection";
        saved.messages.push({ role: "coach", text: TEXT_STEPS.reflection.question });
        migrated = true;
      }

      // 兼容旧版允许选择 4—5 个候选方向的未完成筛选进度。
      if (saved.step === "screening" && Array.isArray(saved.candidates) && saved.candidates.length > 3) {
        saved.candidates = saved.candidates.slice(0, 3);
        saved.screening = Object.fromEntries(
          saved.candidates.map((candidate) => [candidate.id, saved.screening?.[candidate.id] || {}]),
        );
        saved.screeningCursor = { candidate: 0, criterion: 0 };
        migrated = true;
      }
      if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      return saved;
    }
  } catch (error) {
    console.warn("无法恢复本地进度，将开始新训练。", error);
  }
  return createInitialState();
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  elements.savedStatus.classList.add("saving");
  elements.savedStatus.lastChild.textContent = "正在保存";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    elements.savedStatus.classList.remove("saving");
    elements.savedStatus.lastChild.textContent = "进度已保存";
  }, 420);
}

function addMessage(role, text, status = "recorded") {
  state.messages.push({ role, text, status, at: new Date().toISOString() });
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function meaningfulParts(value) {
  return value
    .split(/[\n；;。]+/)
    .map((item) => item.replace(/^\s*(?:[-•·]|\d+[.、）)])\s*/, "").trim())
    .filter((item) => item.length >= 3);
}

function currentStage() {
  if (TEXT_STEPS[state.step]) return TEXT_STEPS[state.step].stage;
  if (["candidate_select"].includes(state.step)) return "expand";
  if (["screening", "decision"].includes(state.step)) return "screen";
  if (state.step === "complete") return "result";
  return "start";
}

function currentMeta() {
  if (TEXT_STEPS[state.step]) return TEXT_STEPS[state.step];

  if (state.step === "candidate_select") {
    return {
      eyebrow: "第二阶 · 扩",
      title: "形成多类型方案池",
      badge: "发散质量检查",
      progress: 68,
    };
  }

  if (state.step === "screening") {
    return {
      eyebrow: "第三阶 · 筛",
      title: "用四则表格筛选三个方案",
      badge: "筛 · 3 × 4",
      progress: 78,
    };
  }

  if (state.step === "decision") {
    return {
      eyebrow: "第三阶 · 筛",
      title: "做出当前情境下的选择",
      badge: "四则汇总",
      progress: 87,
    };
  }

  return {
    eyebrow: "训练完成",
    title: "三阶创新思维成果单",
    badge: "已完成",
    progress: 100,
  };
}

function stageIntroCopy() {
  const copies = {
    start: ["本轮起点", "先把问题说清楚，不急着给答案。"],
    break: ["第一阶 · 破", "识别事实、约束与假设，重新表征问题。"],
    expand: ["第二阶 · 扩", "暂缓可行性判断，从不同类别打开解空间。"],
    screen: ["第三阶 · 筛", "不算简单总分，用四则比较后由你做决定。"],
    result: ["成果整理", "回看思维发生变化的地方，并整理训练成果。"],
  };
  return copies[currentStage()];
}

function renderStageNav() {
  const activeIndex = STAGES.findIndex((stage) => stage.id === currentStage());
  elements.stageNav.innerHTML = STAGES.map((stage, index) => {
    const done = index < activeIndex || state.step === "complete";
    const active = index === activeIndex && state.step !== "complete";
    const status = done ? '<span class="stage-status" aria-label="已完成">✓</span>' : "";
    return `
      <div class="stage-item ${active ? "active" : ""} ${done ? "done" : ""}" ${active ? 'aria-current="step"' : ""}>
        <span class="stage-icon" aria-hidden="true">${done ? "✓" : stage.icon}</span>
        <span class="stage-copy"><strong>${stage.title}</strong><small>${stage.subtitle}</small></span>
        ${status}
      </div>`;
  }).join("");
}

function renderHeader() {
  const meta = currentMeta();
  elements.phaseEyebrow.textContent = meta.eyebrow;
  elements.phaseTitle.textContent = meta.title;
  elements.stepBadge.textContent = meta.badge;
  elements.overallProgressBar.style.width = `${Math.min(100, Math.max(0, meta.progress))}%`;

  const [badge, copy] = stageIntroCopy();
  elements.stageIntro.className = "stage-intro visible";
  elements.stageIntro.innerHTML = `<span class="stage-intro-badge">${escapeHTML(badge)}</span><span>${escapeHTML(copy)}</span>`;
}

function renderMessages() {
  elements.messageList.innerHTML = state.messages.map((message) => {
    const isUser = message.role === "user";
    return `
      <article class="message ${isUser ? "user" : "coach"}">
        ${isUser ? "" : '<div class="avatar" aria-hidden="true">AI</div>'}
        <div class="bubble-wrap">
          <div class="speaker">
            ${isUser ? "你的回答" : '启思教练 <span class="coach-tag">陪练中</span>'}
          </div>
          <div class="bubble">${escapeHTML(message.text)}</div>
          ${isUser ? `<div class="message-note">${message.status === "retry" ? "↳ 继续思考中" : "✓ 已记录到成果单"}</div>` : ""}
        </div>
        ${isUser ? '<div class="avatar user-avatar" aria-hidden="true">我</div>' : ""}
      </article>`;
  }).join("");
}

function voiceInputButton(targetId) {
  return `
    <button
      class="voice-button"
      type="button"
      data-voice-target="${escapeHTML(targetId)}"
      aria-label="使用语音输入"
      aria-pressed="false"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="3" width="8" height="12" rx="4"></rect>
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"></path>
      </svg>
      <span data-voice-label>语音输入</span>
    </button>`;
}

function setVoiceButtonState(button, listening) {
  if (!button) return;
  button.classList.toggle("listening", listening);
  button.setAttribute("aria-pressed", String(listening));
  button.querySelector("[data-voice-label]").textContent = listening ? "停止识别" : "语音输入";
}

function stopActiveRecognition() {
  if (!activeRecognition) return;
  const recognition = activeRecognition;
  activeRecognition = null;
  setVoiceButtonState(activeVoiceButton, false);
  activeVoiceButton = null;
  try {
    recognition.abort();
  } catch {
    // Recognition may already have ended.
  }
}

function appendRecognizedText(existingText, recognizedText) {
  const base = existingText.trimEnd();
  const recognized = recognizedText.trim();
  if (!base) return recognized;
  if (!recognized) return base;
  const separator = /[\s\n，。！？；：、]$/.test(base) ? "" : " ";
  return `${base}${separator}${recognized}`;
}

function setupVoiceInput(input) {
  const button = document.querySelector(`[data-voice-target="${input.id}"]`);
  if (!button) return;

  if (!SpeechRecognitionAPI) {
    button.disabled = true;
    button.title = "当前浏览器不支持语音识别，请使用最新版 Chrome、Edge 或 Safari";
    button.querySelector("[data-voice-label]").textContent = "暂不支持";
    return;
  }

  button.addEventListener("click", () => {
    if (activeRecognition && activeVoiceButton === button) {
      activeRecognition.stop();
      return;
    }

    stopActiveRecognition();
    document.querySelector("#welcomeAudio")?.pause();
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognitionAPI();
    const originalText = input.value;
    let finalTranscript = "";
    let reportedError = false;

    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("start", () => {
      activeRecognition = recognition;
      activeVoiceButton = button;
      setVoiceButtonState(button, true);
      showToast("正在识别语音，可再次点击麦克风停止");
    });

    recognition.addEventListener("result", (event) => {
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript || "";
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }
      input.value = appendRecognizedText(originalText, `${finalTranscript}${interimTranscript}`);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    });

    recognition.addEventListener("error", (event) => {
      reportedError = true;
      const messages = {
        "not-allowed": "请在浏览器地址栏允许麦克风权限后重试",
        "service-not-allowed": "浏览器未允许语音识别服务",
        "audio-capture": "没有检测到可用麦克风",
        "no-speech": "没有听到语音，请靠近麦克风后重试",
        network: "语音识别网络连接失败，请稍后重试",
      };
      showToast(messages[event.error] || "语音识别失败，请重试");
    });

    recognition.addEventListener("end", () => {
      if (activeRecognition !== recognition) return;
      activeRecognition = null;
      activeVoiceButton = null;
      setVoiceButtonState(button, false);
      if (!reportedError && finalTranscript.trim()) showToast("语音已写入输入框，请检查并修改后提交");
      input.focus({ preventScroll: true });
    });

    try {
      recognition.start();
    } catch {
      setVoiceButtonState(button, false);
      showToast("语音识别暂时无法启动，请稍后重试");
    }
  });
}

function renderTextInteraction(step) {
  elements.interactionCard.innerHTML = `
    <form class="input-shell" id="answerForm">
      <label class="answer-label" for="answerInput">${escapeHTML(step.label)}</label>
      <textarea
        class="answer-input"
        id="answerInput"
        rows="2"
        maxlength="800"
        placeholder="${escapeHTML(step.placeholder)}"
        aria-describedby="answerHint"
        required
      ></textarea>
      <div class="input-footer">
        <span class="input-hint" id="answerHint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> 提交 · ${escapeHTML(step.hint)}</span>
        <div class="form-actions">
          ${voiceInputButton("answerInput")}
          <button class="submit-button" id="submitAnswer" type="submit">提交并继续 <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </form>`;

  const form = document.querySelector("#answerForm");
  const input = document.querySelector("#answerInput");
  setupVoiceInput(input);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitTextAnswer(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  window.setTimeout(() => input.focus({ preventScroll: true }), 60);
}

function collectIdeas() {
  const dimensions = [
    ["对象", state.answers.object],
    ["时间", state.answers.time],
    ["空间", state.answers.space],
    ["流程", state.answers.process],
  ];
  const ideas = [];
  dimensions.forEach(([dimension, value]) => {
    meaningfulParts(value || "").forEach((text) => ideas.push({ dimension, text }));
  });

  const seen = new Set();
  return ideas.filter((idea) => {
    const key = idea.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 12);
}

function renderCandidateSelection() {
  const ideas = collectIdeas();
  const cards = ideas.map((idea, index) => `
    <label class="choice-card" data-choice-card>
      <input type="checkbox" name="candidate" value="${index}" />
      <span class="choice-index">${index + 1}</span>
      <span class="choice-copy"><strong>${escapeHTML(idea.dimension)}维度</strong><p>${escapeHTML(idea.text)}</p></span>
    </label>`).join("");

  elements.interactionCard.innerHTML = `
    <form class="special-shell" id="candidateForm">
      <div class="special-header">
        <h3>从方案池中选择 3 个候选方向</h3>
        <p>选择来自不同维度的 3 个方向，下一步将在同一张表单中完成四则检验。</p>
      </div>
      <div class="special-body">${cards}</div>
      <div class="special-footer">
        <span class="selection-count" id="selectionCount">已选择 0/3 个</span>
        <button class="submit-button" id="candidateSubmit" type="submit" disabled>生成四则检验表 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#candidateForm");
  const count = document.querySelector("#selectionCount");
  const button = document.querySelector("#candidateSubmit");
  const inputs = [...form.querySelectorAll('input[name="candidate"]')];

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selected = inputs.filter((item) => item.checked);
      if (selected.length > 3) {
        input.checked = false;
        showToast("候选方向固定选择 3 个");
      }
      const finalSelected = inputs.filter((item) => item.checked);
      inputs.forEach((item) => item.closest(".choice-card").classList.toggle("selected", item.checked));
      const valid = finalSelected.length === 3;
      count.textContent = valid ? "已选择 3/3 个 · 可以生成表单" : `已选择 ${finalSelected.length}/3 个`;
      count.classList.toggle("valid", valid);
      button.disabled = !valid;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedIdeas = inputs
      .filter((input) => input.checked)
      .map((input) => ideas[Number(input.value)]);
    if (selectedIdeas.length !== 3) return;

    state.candidates = selectedIdeas.map((idea, index) => ({
      id: String.fromCharCode(65 + index),
      name: `方案${String.fromCharCode(65 + index)}`,
      dimension: idea.dimension,
      text: idea.text,
    }));
    state.screening = Object.fromEntries(state.candidates.map((candidate) => [candidate.id, {}]));
    state.screeningCursor = { candidate: 0, criterion: 0 };
    addMessage("user", `我选择了 ${state.candidates.length} 个候选方向：\n${state.candidates.map((candidate) => `${candidate.name}：${candidate.text}`).join("\n")}`);
    addMessage("coach", "3 个候选方向已经确定。请在四则收敛表中，通过下拉选项依次判断用户、痛点、资源和目标；全部选择后统一提交。");
    state.step = "screening";
    commitAndRender();
  });
}

function renderScreening() {
  const candidateRows = state.candidates.map((candidate) => {
    const checks = state.screening[candidate.id] || {};
    const conclusion = screeningConclusion(checks);
    const cells = CRITERIA.map((criterion) => {
      const selectId = `screening-${candidate.id}-${criterion.id}`;
      const selectedValue = criterion.options.includes(checks[criterion.id]) ? checks[criterion.id] : "";
      const options = criterion.options.map((option) => (
        `<option value="${escapeHTML(option)}" ${selectedValue === option ? "selected" : ""}>${escapeHTML(option)}</option>`
      )).join("");
      return `
        <td data-label="${escapeHTML(criterion.name)}">
          <select
            class="screening-select"
            id="${selectId}"
            data-candidate-id="${escapeHTML(candidate.id)}"
            data-criterion-id="${escapeHTML(criterion.id)}"
            aria-label="${escapeHTML(`${candidate.name}${criterion.name}检验`)}"
            required
          >
            <option value="">请选择</option>
            ${options}
          </select>
        </td>`;
    }).join("");

    return `
      <tr data-candidate-row="${escapeHTML(candidate.id)}">
        <th scope="row">
          <div class="screening-candidate-summary">
            <span class="choice-index">${escapeHTML(candidate.id)}</span>
            <div>
              <strong>${escapeHTML(candidate.name)} · ${escapeHTML(candidate.dimension)}维度</strong>
              <p>${escapeHTML(candidate.text)}</p>
            </div>
          </div>
        </th>
        ${cells}
        <td class="screening-conclusion-cell" data-label="结论">
          <span class="screening-conclusion ${escapeHTML(conclusion.tone)}" data-screening-conclusion="${escapeHTML(candidate.id)}">${escapeHTML(conclusion.label)}</span>
        </td>
      </tr>`;
  }).join("");

  elements.interactionCard.innerHTML = `
    <form class="special-shell screening-form" id="screeningForm">
      <div class="special-header">
        <h3>3 个候选方向 · 四则收敛表</h3>
        <p>参照 4·4·4 工具单，通过下拉选项直接完成横向比较。</p>
      </div>
      <div class="screening-table-wrap">
        <table class="screening-table">
          <thead>
            <tr>
              <th scope="col">候选方案</th>
              ${CRITERIA.map((criterion) => `<th scope="col"><strong>${escapeHTML(criterion.name)}</strong><span>${escapeHTML(criterion.headerPrompt)}</span></th>`).join("")}
              <th scope="col">结论</th>
            </tr>
          </thead>
          <tbody>${candidateRows}</tbody>
        </table>
      </div>
      <div class="screening-guide">
        <strong>判断重点</strong>
        <span>用户＝是否明确真正受益者</span>
        <span>痛点＝是否真实、高频、重要</span>
        <span>资源＝时间、成本、人员、技术等是否允许</span>
        <span>目标＝是否有效推动核心目标实现</span>
      </div>
      <div class="special-footer">
        <span class="selection-count" id="screeningCompletionCount">已选择 0/12 项</span>
        <button class="submit-button" id="screeningSubmit" type="submit" disabled>提交四则检验 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#screeningForm");
  const inputs = [...form.querySelectorAll(".screening-select")];
  const completionCount = document.querySelector("#screeningCompletionCount");
  const submitButton = document.querySelector("#screeningSubmit");

  const updateCompletion = () => {
    const completed = inputs.filter((input) => input.value).length;
    completionCount.textContent = `已选择 ${completed}/${inputs.length} 项`;
    completionCount.classList.toggle("valid", completed === inputs.length);
    submitButton.disabled = completed !== inputs.length;
    state.candidates.forEach((candidate) => {
      const row = form.querySelector(`[data-candidate-row="${candidate.id}"]`);
      const rowInputs = inputs.filter((input) => input.dataset.candidateId === candidate.id);
      const checks = Object.fromEntries(rowInputs.map((input) => [input.dataset.criterionId, input.value]));
      const conclusion = screeningConclusion(checks);
      const conclusionElement = row.querySelector("[data-screening-conclusion]");
      conclusionElement.textContent = conclusion.label;
      conclusionElement.className = `screening-conclusion ${conclusion.tone}`;
      row.classList.toggle("completed", rowInputs.every((input) => input.value));
    });
  };

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      const candidateId = input.dataset.candidateId;
      const criterionId = input.dataset.criterionId;
      state.screening[candidateId] ||= {};
      state.screening[candidateId][criterionId] = input.value;
      saveState();
      updateCompletion();
      renderResults();
    });
  });
  updateCompletion();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitScreeningForm(inputs);
  });
  window.setTimeout(() => inputs[0]?.focus({ preventScroll: true }), 60);
}

function renderDecision() {
  const options = state.candidates.map((candidate) => `
    <label class="choice-card" data-choice-card>
      <input type="radio" name="priority" value="${escapeHTML(candidate.id)}" />
      <span class="choice-index">${escapeHTML(candidate.id)}</span>
      <span class="choice-copy"><strong>${escapeHTML(candidate.name)} · ${escapeHTML(candidate.dimension)}维度</strong><p>${escapeHTML(candidate.text)}</p></span>
    </label>`).join("");

  elements.interactionCard.innerHTML = `
    <form class="special-shell" id="decisionForm">
      <div class="special-header">
        <h3>哪个方案目前最值得行动？</h3>
        <p>结合四则作出你的判断。这里没有脱离情境的绝对最优，也不采用简单总分。</p>
      </div>
      <div class="special-body">
        ${options}
      </div>
      <div class="special-footer">
        <span class="selection-count">决定权在你手中</span>
        <button class="submit-button" type="submit">确认优先方案 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#decisionForm");
  form.querySelectorAll('input[name="priority"]').forEach((input) => {
    input.addEventListener("change", () => {
      form.querySelectorAll("[data-choice-card]").forEach((card) => {
        card.classList.toggle("selected", card.querySelector("input").checked);
      });
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="priority"]:checked');
    if (!selected) {
      showToast("请先选择一个当前最值得行动的方案");
      return;
    }
    const candidate = state.candidates.find((item) => item.id === selected.value);
    state.decision = { candidateId: selected.value };
    addMessage("user", `我选择 ${candidate.name}：${candidate.text}`);
    addMessage("coach", "选择来自你的比较与判断。四则收敛不是寻找绝对最优，而是筛出当前情境下更值得行动的方案。最后回看整个过程，思考哪一步改变了你的第一答案。\n" + TEXT_STEPS.reflection.question);
    state.step = "reflection";
    commitAndRender();
  });
}

function launchFireworks() {
  document.querySelector(".fireworks-layer")?.remove();
  window.clearTimeout(fireworksTimer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.className = "fireworks-layer";
  layer.setAttribute("aria-hidden", "true");
  const bursts = [
    { x: 18, y: 25, color: "#2f75e8", delay: 0, distance: 66 },
    { x: 79, y: 21, color: "#ffb52e", delay: 0.35, distance: 72 },
    { x: 34, y: 13, color: "#20b486", delay: 0.7, distance: 58 },
    { x: 66, y: 33, color: "#8b5cf6", delay: 1.05, distance: 68 },
    { x: 49, y: 20, color: "#ef5da8", delay: 1.35, distance: 76 },
  ];

  bursts.forEach((config) => {
    const burst = document.createElement("span");
    burst.className = "firework-burst";
    burst.style.setProperty("--burst-x", `${config.x}%`);
    burst.style.setProperty("--burst-y", `${config.y}%`);
    burst.style.setProperty("--burst-color", config.color);
    burst.style.setProperty("--burst-delay", `${config.delay}s`);
    for (let index = 0; index < 14; index += 1) {
      const spark = document.createElement("span");
      spark.className = "firework-spark";
      spark.style.setProperty("--spark-color", config.color);
      spark.style.setProperty("--spark-angle", `${(360 / 14) * index}deg`);
      spark.style.setProperty("--spark-distance", `${config.distance + (index % 3) * 8}px`);
      spark.style.setProperty("--spark-delay", `${config.delay + (index % 2) * 0.035}s`);
      burst.append(spark);
    }
    layer.append(burst);
  });

  document.body.append(layer);
  fireworksTimer = window.setTimeout(() => layer.remove(), 3600);
}

function renderCompletion() {
  elements.interactionCard.innerHTML = `
    <div class="completion-shell">
      <div class="completion-mark" aria-hidden="true">✓</div>
      <h3>你完成了一次完整的创新思维迁移</h3>
      <p>从重新表征，到发散生成，再到聚合决策。答案来自你的思考，成果单已经整理完成。</p>
      <div class="completion-actions">
        <button class="secondary-button" id="completionReview" type="button">查看成果单</button>
        <button class="primary-button compact" id="completionExport" type="button">导出成果单</button>
      </div>
    </div>`;
  document.querySelector("#completionReview").addEventListener("click", openResultPanel);
  document.querySelector("#completionExport").addEventListener("click", exportResult);
  window.setTimeout(launchFireworks, 100);
}

function renderInteraction() {
  stopActiveRecognition();
  const step = TEXT_STEPS[state.step];
  if (step) renderTextInteraction(step);
  else if (state.step === "candidate_select") renderCandidateSelection();
  else if (state.step === "screening") renderScreening();
  else if (state.step === "decision") renderDecision();
  else renderCompletion();
}

function resultField(label, value) {
  return `<dl class="result-field"><dt>${escapeHTML(label)}</dt><dd class="${value ? "" : "empty"}">${escapeHTML(value || "等待你的回答……")}</dd></dl>`;
}

function activeResultKey() {
  const stage = currentStage();
  if (stage === "start") return "problem";
  if (stage === "break") return "break";
  if (stage === "expand") return "expand";
  if (stage === "screen") return "screen";
  return "reflection";
}

function sectionMarkup(number, key, title, fields, done) {
  const active = key === activeResultKey();
  return `
    <section class="result-section ${active ? "active" : ""}" data-result-key="${key}" ${active ? 'aria-current="step"' : ""}>
      <div class="result-section-header">
        <span class="result-section-number">${number}</span>
        <strong>${escapeHTML(title)}</strong>
        <span class="result-section-status ${done ? "done" : ""}">${done ? "已完成" : active ? "进行中" : "待完成"}</span>
      </div>
      <div class="result-section-body">${fields}</div>
    </section>`;
}

function renderResults() {
  const screenedCandidates = state.candidates.map((candidate) => {
    const checks = state.screening[candidate.id] || {};
    const checkCount = CRITERIA.filter(
      (criterion) => isRecordedScreeningValue(criterion, checks[criterion.id]),
    ).length;
    const conclusion = screeningConclusion(checks);
    return `<div class="candidate-mini"><strong>${escapeHTML(candidate.name)}</strong> · ${escapeHTML(candidate.text)}<br>${checkCount}/4 项检验已记录 · ${escapeHTML(conclusion.label)}</div>`;
  }).join("");
  const priority = state.candidates.find((candidate) => candidate.id === state.decision.candidateId);

  elements.resultContent.innerHTML = [
    sectionMarkup("01", "problem", "原始问题", resultField("真实问题", state.answers.problem), Boolean(state.answers.problem)),
    sectionMarkup(
      "02",
      "break",
      "破 · 四问破题",
      resultField("事实", state.answers.facts) +
        resultField("约束", state.answers.constraints) +
        resultField("隐藏假设", state.answers.assumptions) +
        resultField("重构后的问题", state.answers.reframe),
      Boolean(state.answers.reframe),
    ),
    sectionMarkup(
      "03",
      "expand",
      "扩 · 四维发散",
      resultField("对象", state.answers.object) +
        resultField("时间", state.answers.time) +
        resultField("空间", state.answers.space) +
        resultField("流程", state.answers.process),
      Boolean(state.answers.process),
    ),
    sectionMarkup(
      "04",
      "screen",
      "筛 · 四则收敛",
      (screenedCandidates || resultField("候选方案", "")) +
        resultField("最终优先方案", priority ? `${priority.name}：${priority.text}` : ""),
      Boolean(state.decision.candidateId),
    ),
    sectionMarkup("05", "reflection", "思维反思", resultField("思路改变", state.answers.reflection), state.step === "complete"),
  ].join("");

  window.requestAnimationFrame(() => {
    const activeSection = elements.resultContent.querySelector(".result-section.active");
    if (!activeSection) return;
    const targetTop = activeSection.offsetTop - elements.resultContent.offsetTop;
    elements.resultContent.scrollTo({ top: Math.max(0, targetTop - 4), behavior: "smooth" });
  });
}

function validateText(stepId, raw) {
  const step = TEXT_STEPS[stepId];
  if (raw.length < step.minLength) return "先把想法再写具体一点，我会继续陪你拆解。";

  if (stepId === "facts") {
    if (meaningfulParts(raw).length < 2) return "目前只有一条清晰信息。请再补充至少一条可观察或验证的事实。";
    if (OPINION_PATTERN.test(raw) && !state.attempts.factOpinion) {
      state.attempts.factOpinion = 1;
      return "其中似乎混入了判断或推测。试着把“我觉得/可能”改写成可以被记录、观察或验证的信息。";
    }
  }

  if (stepId === "constraints" && meaningfulParts(raw).length < 1) {
    return "请至少写出一个具体约束，并判断它是否真的暂时不能改变。";
  }

  if (stepId === "reframe" && raw === state.answers.problem) {
    return "新问题还和原问题完全相同。试着拿掉一个隐藏假设，让搜索方向真正发生变化。";
  }

  return "";
}

function noIdeaResponse(stepId) {
  const count = (state.attempts[stepId] || 0) + 1;
  state.attempts[stepId] = count;
  if (count < 2) {
    return "先不用追求完整答案。回到一个具体的人、场景或动作，只写下你最先注意到的一点。";
  }
  return `给你一个思考框架，不替你作答：${TEXT_STEPS[stepId].hint} 请沿这个方向先写一句自己的判断。`;
}

function feedbackFor(stepId, raw) {
  const feedback = {
    problem: "问题已经记录。先不评价解决方案，我们从可验证的事实开始拆解。",
    facts: `你列出了 ${meaningfulParts(raw).length} 条信息。事实层已经更清楚，下一步区分哪些是必须面对的现实条件。`,
    constraints: "现实条件已经显现。现在要警惕：有些“约束”可能只是过去的做法。接下来寻找默认假设。",
    assumptions: "你已经开始松动原问题的边界。先不急着想方案，下一步用这些假设重构问题。",
    reframe: "问题的搜索方向已经发生变化。第一阶“破”完成，接下来暂缓可行性判断，进入四维发散。",
    object: "对象维度已打开。不要评价它好不好，继续改变方案发生的时点。",
    time: "时间维度已记录。现在换一个空间视角，看看场景结构能否变化。",
    space: "空间维度已打开。最后把整个过程拆开，从流程步骤寻找改变。",
    process: "四个维度都已有方向。现在从不同类别中选择 3 个候选方案。",
    reflection: "你的反思已经写入成果单。你完成了“重新表征 → 发散生成 → 聚合决策”的完整训练。",
  };
  return feedback[stepId] || "已记录。";
}

function nextPrompt(stepId) {
  const next = TEXT_STEPS[stepId]?.next;
  if (TEXT_STEPS[next]) return TEXT_STEPS[next].question;
  if (next === "candidate_select") return "请从刚才的四维方向中选择 3 个候选方案，尽量保持类型多样。";
  return "";
}

function submitTextAnswer(value) {
  const raw = value.trim();
  const stepId = state.step;
  if (!raw) {
    showToast("先写下你的想法，再继续下一步");
    return;
  }

  addMessage("user", raw, "retry");

  if (NO_IDEA_PATTERN.test(raw)) {
    addMessage("coach", noIdeaResponse(stepId));
    commitAndRender();
    return;
  }

  const validation = validateText(stepId, raw);
  if (validation) {
    addMessage("coach", validation);
    commitAndRender();
    return;
  }

  state.attempts[stepId] = 0;
  state.answers[stepId] = raw;
  state.messages[state.messages.length - 1].status = "recorded";
  const feedback = feedbackFor(stepId, raw);
  const next = TEXT_STEPS[stepId].next;
  state.step = next;
  addMessage("coach", next === "complete" ? feedback : `${feedback}\n${nextPrompt(stepId)}`);
  commitAndRender();
}

function submitScreeningForm(inputs) {
  const firstInvalid = inputs.find((input) => !input.value);
  if (firstInvalid) {
    const candidate = state.candidates.find((item) => item.id === firstInvalid.dataset.candidateId);
    const criterion = CRITERIA.find((item) => item.id === firstInvalid.dataset.criterionId);
    showToast(`请选择${candidate?.name || "候选方案"}的“${criterion?.name || "四则"}”判断`);
    firstInvalid.focus({ preventScroll: true });
    return;
  }

  inputs.forEach((input) => {
    const candidateId = input.dataset.candidateId;
    const criterionId = input.dataset.criterionId;
    state.screening[candidateId] ||= {};
    state.screening[candidateId][criterionId] = input.value;
  });
  addMessage("user", `我已完成 ${state.candidates.length} 个候选方案的用户、痛点、资源和目标四则检验。`);
  state.step = "decision";
  addMessage("coach", "3 个候选方案的四则检验已经全部记录。现在综合用户、痛点、资源和目标：你认为哪个方案目前最值得行动？请由你作出选择并说明依据。并不存在由系统宣布的“标准最佳方案”。");
  commitAndRender();
}

function commitAndRender() {
  saveState();
  render();
  window.setTimeout(() => {
    elements.chatScroll.scrollTo({ top: elements.chatScroll.scrollHeight, behavior: "smooth" });
  }, 70);
}

function render() {
  renderStageNav();
  renderHeader();
  renderMessages();
  renderInteraction();
  renderResults();
}

function markdownResult() {
  const value = (key) => state.answers[key] || "待完成";
  const priority = state.candidates.find((candidate) => candidate.id === state.decision.candidateId);
  const tableRows = state.candidates.map((candidate) => {
    const checks = state.screening[candidate.id] || {};
    const safe = (text) => String(text || "待完成").replaceAll("|", "｜").replaceAll("\n", " ");
    return `| ${candidate.name}：${safe(candidate.text)} | ${safe(checks.user)} | ${safe(checks.pain)} | ${safe(checks.resource)} | ${safe(checks.goal)} | ${screeningConclusion(checks).label} |`;
  }).join("\n") || "| 待形成 | 待完成 | 待完成 | 待完成 | 待完成 | 待完成 |";

  return `# 三阶创新思维迁移任务成果单

生成时间：${new Date().toLocaleString("zh-CN")}

## 一、原始问题

${value("problem")}

## 二、破：四问破题

- **事实：** ${value("facts")}
- **约束：** ${value("constraints")}
- **假设：** ${value("assumptions")}
- **重构后的问题：** ${value("reframe")}

## 三、扩：四维发散

- **对象：** ${value("object")}
- **时间：** ${value("time")}
- **空间：** ${value("space")}
- **流程：** ${value("process")}

## 四、筛：四则收敛

| 候选方案 | 用户 | 痛点 | 资源 | 目标 | 结论 |
| --- | --- | --- | --- | --- | --- |
${tableRows}

- **最终优先方案：** ${priority ? `${priority.name}：${priority.text}` : "待完成"}

## 五、思维反思

${value("reflection")}
`;
}

function escapeXML(value = "") {
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wordRun(value, { bold = false, color = "", size = "" } = {}) {
  const properties = [
    '<w:rFonts w:ascii="Hiragino Sans GB" w:hAnsi="Hiragino Sans GB" w:eastAsia="Hiragino Sans GB" w:cs="Hiragino Sans GB"/>',
    '<w:lang w:val="zh-CN" w:eastAsia="zh-CN"/>',
    bold ? "<w:b/>" : "",
    color ? `<w:color w:val="${color}"/>` : "",
    size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : "",
  ].join("");
  const runProperties = properties ? `<w:rPr>${properties}</w:rPr>` : "";

  return String(value).split("\n").map((line, index) => {
    const breakRun = index ? "<w:r><w:br/></w:r>" : "";
    return `${breakRun}<w:r>${runProperties}<w:t xml:space="preserve">${escapeXML(line)}</w:t></w:r>`;
  }).join("");
}

function wordParagraph(content, style = "Normal") {
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr>${content}</w:p>`;
}

function wordField(label, value) {
  return wordParagraph(
    wordRun(`${label}：`, { bold: true, color: "1D4ED8" }) + wordRun(value || "待完成"),
  );
}

function wordTableCell(value, width, { label = false } = {}) {
  const fill = label ? '<w:shd w:val="clear" w:color="auto" w:fill="E8EEF5"/>' : "";
  return `<w:tc>
    <w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${fill}<w:vAlign w:val="center"/></w:tcPr>
    <w:p><w:pPr><w:spacing w:after="0" w:line="300" w:lineRule="auto"/></w:pPr>${wordRun(value || "待完成", {
      bold: label,
      color: label ? "1F4D78" : "",
      size: "20",
    })}</w:p>
  </w:tc>`;
}

function wordLabelTable(rows) {
  const labelWidth = 1700;
  const detailWidth = 7660;
  const tableRows = rows.map(([label, value]) => `<w:tr>${wordTableCell(label, labelWidth, { label: true })}${wordTableCell(value, detailWidth)}</w:tr>`).join("");

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="9360" w:type="dxa"/>
      <w:tblInd w:w="120" w:type="dxa"/>
      <w:tblLayout w:type="fixed"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:color="CBD5E1"/>
        <w:left w:val="single" w:sz="4" w:color="CBD5E1"/>
        <w:bottom w:val="single" w:sz="4" w:color="CBD5E1"/>
        <w:right w:val="single" w:sz="4" w:color="CBD5E1"/>
        <w:insideH w:val="single" w:sz="4" w:color="CBD5E1"/>
        <w:insideV w:val="single" w:sz="4" w:color="CBD5E1"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/>
        <w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    <w:tblGrid><w:gridCol w:w="${labelWidth}"/><w:gridCol w:w="${detailWidth}"/></w:tblGrid>
    ${tableRows}
  </w:tbl>`;
}

function wordDocumentXML() {
  const value = (key) => state.answers[key] || "待完成";
  const priority = state.candidates.find((candidate) => candidate.id === state.decision.candidateId);
  const screeningBlocks = state.candidates.map((candidate) => {
    const checks = state.screening[candidate.id] || {};
    return [
      wordParagraph(wordRun(`${candidate.name}：${candidate.text}`), "Heading2"),
      wordLabelTable([
        ["用户", checks.user || "待完成"],
        ["痛点", checks.pain || "待完成"],
        ["资源", checks.resource || "待完成"],
        ["目标", checks.goal || "待完成"],
        ["结论", screeningConclusion(checks).label],
      ]),
    ].join("");
  }).join("") || [
    wordParagraph(wordRun("候选方案待形成"), "Heading2"),
    wordLabelTable([["筛选进度", "待完成"]]),
  ].join("");

  const content = [
    wordParagraph(wordRun("三阶创新思维迁移任务成果单"), "Title"),
    wordParagraph(wordRun(`生成时间：${new Date().toLocaleString("zh-CN")}`), "Subtitle"),
    wordParagraph(wordRun("一、原始问题"), "Heading1"),
    wordField("真实问题", value("problem")),
    wordParagraph(wordRun("二、破：四问破题"), "Heading1"),
    wordField("事实", value("facts")),
    wordField("约束", value("constraints")),
    wordField("隐藏假设", value("assumptions")),
    wordField("重构后的问题", value("reframe")),
    wordParagraph(wordRun("三、扩：四维发散"), "Heading1"),
    wordField("对象", value("object")),
    wordField("时间", value("time")),
    wordField("空间", value("space")),
    wordField("流程", value("process")),
    wordParagraph(wordRun("四、筛：四则收敛"), "Heading1"),
    screeningBlocks,
    wordField("最终优先方案", priority ? `${priority.name}：${priority.text}` : "待完成"),
    wordParagraph(wordRun("五、思维反思"), "Heading1"),
    wordParagraph(wordRun(value("reflection"))),
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${content}
    <w:sectPr>
      <w:footerReference w:type="default" r:id="rId2"/>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
      <w:cols w:space="708"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function wordStylesXML() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Hiragino Sans GB" w:hAnsi="Hiragino Sans GB" w:eastAsia="Hiragino Sans GB" w:cs="Hiragino Sans GB"/><w:lang w:val="zh-CN" w:eastAsia="zh-CN"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="1E293B"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="0" w:after="120" w:line="300" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Hiragino Sans GB" w:hAnsi="Hiragino Sans GB" w:eastAsia="Hiragino Sans GB" w:cs="Hiragino Sans GB"/><w:lang w:val="zh-CN" w:eastAsia="zh-CN"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="1E293B"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Subtitle"/><w:qFormat/>
    <w:pPr><w:spacing w:before="0" w:after="120"/><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:color w:val="173B7A"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>
    <w:pPr><w:spacing w:before="0" w:after="160"/></w:pPr>
    <w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:uiPriority w:val="9"/>
    <w:pPr><w:keepNext/><w:spacing w:before="360" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="2E74B5"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:uiPriority w:val="9"/>
    <w:pPr><w:keepNext/><w:spacing w:before="280" w:after="140"/><w:outlineLvl w:val="1"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="2E74B5"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
  </w:style>
</w:styles>`;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipWordFiles(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  const header = (size) => new DataView(new ArrayBuffer(size));
  const bytesOf = (view) => new Uint8Array(view.buffer);

  files.forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const checksum = crc32(data);
    const local = header(30);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, checksum, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);
    localParts.push(bytesOf(local), nameBytes, data);

    const central = header(46);
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, dosTime, true);
    central.setUint16(14, dosDate, true);
    central.setUint32(16, checksum, true);
    central.setUint32(20, data.length, true);
    central.setUint32(24, data.length, true);
    central.setUint16(28, nameBytes.length, true);
    central.setUint16(30, 0, true);
    central.setUint16(32, 0, true);
    central.setUint16(34, 0, true);
    central.setUint16(36, 0, true);
    central.setUint32(38, 0, true);
    central.setUint32(42, offset, true);
    centralParts.push(bytesOf(central), nameBytes);
    offset += 30 + nameBytes.length + data.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = header(22);
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(4, 0, true);
  end.setUint16(6, 0, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  end.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, bytesOf(end)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function wordResultBlob() {
  const now = new Date().toISOString();
  return zipWordFiles([
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
        <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
        <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
        <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
        <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
        <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
      </Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
        <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
        <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
      </Relationships>`],
    ["word/document.xml", wordDocumentXML()],
    ["word/styles.xml", wordStylesXML()],
    ["word/fontTable.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:font w:name="Hiragino Sans GB"><w:charset w:val="86"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>
      </w:fonts>`],
    ["word/footer1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:p><w:pPr><w:jc w:val="right"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="D6E4F5"/></w:pBdr></w:pPr>
          ${wordRun("启思 · AI 创新陪练  |  第 ", { color: "64748B", size: "18" })}
          <w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
          <w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
          <w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r>
          <w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:t>1</w:t></w:r>
          <w:r><w:rPr><w:color w:val="64748B"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>
          ${wordRun(" 页", { color: "64748B", size: "18" })}
        </w:p>
      </w:ftr>`],
    ["word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
        <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
        <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
      </Relationships>`],
    ["docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <dc:title>三阶创新思维迁移任务成果单</dc:title><dc:creator>启思 · AI 创新陪练</dc:creator>
        <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
      </cp:coreProperties>`],
    ["docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
        <Application>启思 · AI 创新陪练</Application><AppVersion>1.0</AppVersion>
      </Properties>`],
  ]);
}

async function copyResult() {
  try {
    await navigator.clipboard.writeText(markdownResult());
    showToast("成果单已复制到剪贴板");
  } catch {
    showToast("当前浏览器未允许剪贴板访问，请使用导出功能");
  }
}

function exportResult() {
  const blob = wordResultBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `三阶创新思维迁移任务成果单-${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Word 成果单已导出");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function openResultPanel() {
  elements.resultPanel.classList.add("open");
  elements.overlay.classList.add("open");
  elements.resultPanel.querySelector("h2").focus?.();
}

function closePanels() {
  elements.resultPanel.classList.remove("open");
  elements.sidebar.classList.remove("open");
  elements.overlay.classList.remove("open");
}

function resetSession() {
  if (!window.confirm("确定要清除本次训练的全部回答并重新开始吗？")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = createInitialState();
  closePanels();
  commitAndRender();
  elements.chatScroll.scrollTop = 0;
  showToast("已开始一轮新的训练");
}

let welcomePlaybackStatus = "idle";
let welcomeVoiceTimer;

function chooseFemaleVoice(voices) {
  const femaleHint = /(ting[- ]?ting|meijia|mei[- ]?jia|sin[- ]?ji|xiaoxiao|xiaoyi|xiaomeng|huihui|yaoyao|hanhan|lili|female|女声|samantha|serena|victoria|karen|moira|susan|zira)/i;
  const maleHint = /(male|男声|yunxi|yunyang|yunjian|kangkang|daniel|alex|thomas)/i;
  const chineseVoices = voices.filter((voice) => /^zh(?:-|_)/i.test(voice.lang));

  return chineseVoices.find((voice) => femaleHint.test(voice.name))
    || chineseVoices.find((voice) => !maleHint.test(voice.name))
    || voices.find((voice) => femaleHint.test(voice.name))
    || chineseVoices[0]
    || voices[0]
    || null;
}

function removeWelcomeRetryListeners() {
  document.removeEventListener("pointerdown", retryWelcomeGreeting, true);
  document.removeEventListener("keydown", retryWelcomeGreeting, true);
}

function setWelcomePlaybackStatus(status, source = "recorded") {
  welcomePlaybackStatus = status;
  document.documentElement.dataset.welcomeSpeech = status;
  document.documentElement.dataset.welcomeSource = source;
}

function speakWelcomeFallback(force = false) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    setWelcomePlaybackStatus("unsupported", "none");
    return;
  }
  if (["playing", "played"].includes(welcomePlaybackStatus)) return;

  const synthesis = window.speechSynthesis;
  const voices = synthesis.getVoices();
  if (!voices.length && !force) {
    setWelcomePlaybackStatus("waiting", "synthesis");
    const speakWhenReady = () => {
      if (["pending", "playing", "played"].includes(welcomePlaybackStatus)) return;
      welcomePlaybackStatus = "idle";
      speakWelcomeFallback(true);
    };
    synthesis.addEventListener("voiceschanged", speakWhenReady, { once: true });
    window.clearTimeout(welcomeVoiceTimer);
    welcomeVoiceTimer = window.setTimeout(speakWhenReady, 700);
    return;
  }

  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(WELCOME_GREETING);
  const voice = chooseFemaleVoice(voices);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "zh-CN";
  utterance.rate = 0.94;
  utterance.pitch = 1.08;
  utterance.volume = 1;

  setWelcomePlaybackStatus("pending", "synthesis");
  document.documentElement.dataset.welcomeVoice = voice?.name || "default";
  utterance.addEventListener("start", () => {
    setWelcomePlaybackStatus("playing", "synthesis");
    removeWelcomeRetryListeners();
  });
  utterance.addEventListener("end", () => {
    setWelcomePlaybackStatus("played", "synthesis");
    removeWelcomeRetryListeners();
  });
  utterance.addEventListener("error", () => {
    setWelcomePlaybackStatus("blocked", "synthesis");
  });
  synthesis.speak(utterance);
}

function playWelcomeGreeting(force = false) {
  if (["playing", "played"].includes(welcomePlaybackStatus)) return;
  const audio = document.querySelector("#welcomeAudio");
  if (!audio || audio.error) {
    speakWelcomeFallback(force);
    return;
  }

  setWelcomePlaybackStatus("pending", "recorded");
  document.documentElement.dataset.welcomeVoice = "Tingting";
  const playAttempt = audio.play();
  playAttempt?.catch(() => {
    if (["playing", "played"].includes(welcomePlaybackStatus)) return;
    setWelcomePlaybackStatus("blocked", "recorded");
    if (force) speakWelcomeFallback(true);
    else showToast("浏览器已阻止自动播放，点击页面即可播放欢迎语");
  });
}

function retryWelcomeGreeting() {
  if (["playing", "played"].includes(welcomePlaybackStatus)) return;
  window.clearTimeout(welcomeVoiceTimer);
  welcomePlaybackStatus = "idle";
  playWelcomeGreeting(true);
}

function scheduleWelcomeGreeting() {
  const audio = document.querySelector("#welcomeAudio");
  audio?.addEventListener("playing", () => {
    setWelcomePlaybackStatus("playing", "recorded");
    removeWelcomeRetryListeners();
  });
  audio?.addEventListener("ended", () => {
    setWelcomePlaybackStatus("played", "recorded");
    removeWelcomeRetryListeners();
  });
  audio?.addEventListener("error", () => speakWelcomeFallback(), { once: true });
  document.addEventListener("pointerdown", retryWelcomeGreeting, { once: true, capture: true });
  document.addEventListener("keydown", retryWelcomeGreeting, { once: true, capture: true });
  playWelcomeGreeting();
}

document.querySelectorAll("[data-reset-session]").forEach((button) => {
  button.addEventListener("click", resetSession);
});

document.querySelector("#presentationButton").addEventListener("click", () => {
  document.body.classList.toggle("presentation-mode");
  closePanels();
  showToast(document.body.classList.contains("presentation-mode") ? "已进入教学展示模式，按 Esc 退出" : "已退出教学展示模式");
});

document.querySelector("#resultToggleButton").addEventListener("click", openResultPanel);
document.querySelector("#resultCloseButton").addEventListener("click", closePanels);
document.querySelector("#mobileMenuButton").addEventListener("click", () => {
  elements.sidebar.classList.add("open");
  elements.overlay.classList.add("open");
});
elements.overlay.addEventListener("click", closePanels);
document.querySelector("#copyButton").addEventListener("click", copyResult);
document.querySelector("#exportButton").addEventListener("click", exportResult);

elements.chatScroll.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;

  const pageStep = Math.max(160, elements.chatScroll.clientHeight * 0.78);
  const scrollActions = {
    ArrowUp: -64,
    ArrowDown: 64,
    PageUp: -pageStep,
    PageDown: pageStep,
  };

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    elements.chatScroll.scrollTo({
      top: event.key === "Home" ? 0 : elements.chatScroll.scrollHeight,
      behavior: "smooth",
    });
    return;
  }

  if (scrollActions[event.key]) {
    event.preventDefault();
    elements.chatScroll.scrollBy({ top: scrollActions[event.key], behavior: "smooth" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.body.classList.contains("presentation-mode")) {
    document.body.classList.remove("presentation-mode");
    showToast("已退出教学展示模式");
  }
  closePanels();
});

render();
window.requestAnimationFrame(() => {
  elements.chatScroll.scrollTop = elements.chatScroll.scrollHeight;
});

if (document.readyState === "complete") scheduleWelcomeGreeting();
else window.addEventListener("load", scheduleWelcomeGreeting, { once: true });
