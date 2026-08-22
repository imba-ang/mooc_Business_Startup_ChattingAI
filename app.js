const STORAGE_KEY = "qisi-innovation-coach-v1";
const SESSION_VERSION = 2;

const STAGES = [
  { id: "start", icon: "启", title: "陪练启动", subtitle: "明确真实问题" },
  { id: "break", icon: "破", title: "四问破题", subtitle: "重新表征问题" },
  { id: "expand", icon: "扩", title: "四维发散", subtitle: "打开方案空间" },
  { id: "screen", icon: "筛", title: "四则收敛", subtitle: "形成创新决策" },
  { id: "result", icon: "果", title: "成果整理", subtitle: "责任检查与反思" },
];

const CRITERIA = [
  {
    id: "user",
    name: "用户",
    mark: "人",
    question: "这个方案找准用户了吗？谁是最直接、最核心的受益者？",
    note: "判断谁真正受益，避免把用户说得过于宽泛。",
    feedback: "用户边界已记录。接下来继续检验问题是否真实、重要。",
  },
  {
    id: "pain",
    name: "痛点",
    mark: "痛",
    question: "这个方案抓住核心痛点了吗？它是真实、高频且重要的问题吗？",
    note: "痛点看现在：这个问题值不值得解决。",
    feedback: "痛点判断已记录。下一步看方案是否符合现实条件。",
  },
  {
    id: "resource",
    name: "资源",
    mark: "资",
    question: "结合时间、成本、人员和技术，这个方案当前做得到吗？",
    note: "若条件不足，可考虑缩小规模，或判断更适合现在还是以后。",
    feedback: "现实条件已记录。最后检验它能否推动核心目标。",
  },
  {
    id: "goal",
    name: "目标",
    mark: "标",
    question: "方案实施后，什么变化能够证明它推动了本轮创新目标？",
    note: "目标看未来：它能否把问题改善到希望的状态。",
    feedback: "四则检验已完成。我们继续比较下一项候选方案。",
  },
];

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
  responsibility_user: {
    stage: "result",
    eyebrow: "成果整理",
    title: "创新责任检查",
    badge: "责任 1/4",
    label: "用户价值",
    placeholder: "它为核心用户带来什么可感知的价值？",
    question: "回看你的优先方案：它为核心用户带来什么真实、可感知的价值？",
    minLength: 6,
    next: "responsibility_ethics",
    progress: 90,
    hint: "用用户能感受到的变化回答。",
  },
  responsibility_ethics: {
    stage: "result",
    eyebrow: "成果整理",
    title: "隐私与伦理",
    badge: "责任 2/4",
    label: "隐私与伦理风险",
    placeholder: "可能影响谁？需要怎样避免伤害或不公平？",
    question: "这个方案可能带来哪些隐私、伦理或公平风险？你准备怎样降低风险？",
    minLength: 6,
    next: "responsibility_cost",
    progress: 93,
    hint: "考虑数据、知情同意、公平性与潜在负面影响。",
  },
  responsibility_cost: {
    stage: "result",
    eyebrow: "成果整理",
    title: "资源与成本",
    badge: "责任 3/4",
    label: "资源与成本边界",
    placeholder: "最小规模需要哪些人、时间、资金和技术？",
    question: "如果先做一个最小可行尝试，需要哪些关键资源？成本边界在哪里？",
    minLength: 6,
    next: "responsibility_green",
    progress: 95,
    hint: "优先描述可以马上验证的最小行动。",
  },
  responsibility_green: {
    stage: "result",
    eyebrow: "成果整理",
    title: "绿色与可持续",
    badge: "责任 4/4",
    label: "绿色与可持续性",
    placeholder: "如何减少浪费，并让方案长期可持续？",
    question: "这个方案怎样减少不必要的资源消耗，并具备持续运行的可能？",
    minLength: 6,
    next: "reflection",
    progress: 97,
    hint: "同时考虑环境成本与长期运营能力。",
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
    decision: { candidateId: "", reason: "" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === SESSION_VERSION && saved.step && Array.isArray(saved.messages)) {
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
    const candidate = state.candidates[state.screeningCursor.candidate];
    const criterion = CRITERIA[state.screeningCursor.criterion];
    const total = state.candidates.length || 1;
    const completed = state.screeningCursor.candidate * 4 + state.screeningCursor.criterion;
    const progress = 70 + (completed / (total * 4)) * 15;
    return {
      eyebrow: "第三阶 · 筛",
      title: `${candidate?.name || "候选方案"} · ${criterion?.name || "四则"}检验`,
      badge: `筛 ${state.screeningCursor.candidate + 1}/${total} · ${state.screeningCursor.criterion + 1}/4`,
      progress,
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
    result: ["成果整理", "检查创新责任，并回看思维发生变化的地方。"],
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
        <button class="submit-button" id="submitAnswer" type="submit">提交并继续 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#answerForm");
  const input = document.querySelector("#answerInput");
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
        <h3>从方案池中选择 3—5 个候选方向</h3>
        <p>先检查变通性：候选方案最好来自不同维度，而不是同一路径的多个版本。</p>
      </div>
      <div class="special-body">${cards}</div>
      <div class="special-footer">
        <span class="selection-count" id="selectionCount">已选择 0 个 · 请选择 3—5 个</span>
        <button class="submit-button" id="candidateSubmit" type="submit" disabled>进入四则收敛 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#candidateForm");
  const count = document.querySelector("#selectionCount");
  const button = document.querySelector("#candidateSubmit");
  const inputs = [...form.querySelectorAll('input[name="candidate"]')];

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selected = inputs.filter((item) => item.checked);
      if (selected.length > 5) {
        input.checked = false;
        showToast("候选方案最多选择 5 个");
      }
      const finalSelected = inputs.filter((item) => item.checked);
      inputs.forEach((item) => item.closest(".choice-card").classList.toggle("selected", item.checked));
      const valid = finalSelected.length >= 3 && finalSelected.length <= 5;
      count.textContent = valid ? `已选择 ${finalSelected.length} 个 · 可以继续` : `已选择 ${finalSelected.length} 个 · 请选择 3—5 个`;
      count.classList.toggle("valid", valid);
      button.disabled = !valid;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedIdeas = inputs
      .filter((input) => input.checked)
      .map((input) => ideas[Number(input.value)]);
    if (selectedIdeas.length < 3 || selectedIdeas.length > 5) return;

    state.candidates = selectedIdeas.map((idea, index) => ({
      id: String.fromCharCode(65 + index),
      name: `方案${String.fromCharCode(65 + index)}`,
      dimension: idea.dimension,
      text: idea.text,
    }));
    state.screening = Object.fromEntries(state.candidates.map((candidate) => [candidate.id, {}]));
    state.screeningCursor = { candidate: 0, criterion: 0 };
    addMessage("user", `我选择了 ${state.candidates.length} 个候选方向：\n${state.candidates.map((candidate) => `${candidate.name}：${candidate.text}`).join("\n")}`);
    addMessage("coach", "方案池已经形成。接下来不简单算总分，而是逐项用“用户、痛点、资源、目标”进行检验。先看方案A。\n" + getScreeningPrompt());
    state.step = "screening";
    commitAndRender();
  });
}

function getScreeningPrompt() {
  const candidate = state.candidates[state.screeningCursor.candidate];
  const criterion = CRITERIA[state.screeningCursor.criterion];
  if (!candidate || !criterion) return "请继续完成四则检验。";
  return `${candidate.name}：${candidate.text}\n${criterion.question}`;
}

function renderScreening() {
  const candidate = state.candidates[state.screeningCursor.candidate];
  const criterion = CRITERIA[state.screeningCursor.criterion];
  elements.interactionCard.innerHTML = `
    <form class="special-shell" id="screeningForm">
      <div class="special-header">
        <h3>${escapeHTML(candidate.name)} · ${escapeHTML(candidate.dimension)}维度</h3>
        <p>${escapeHTML(candidate.text)}</p>
      </div>
      <div class="criterion-banner">
        <span class="criterion-mark">${escapeHTML(criterion.mark)}</span>
        <span><strong>${escapeHTML(criterion.name)}检验</strong><small>${escapeHTML(criterion.note)}</small></span>
        <span class="criterion-progress">${state.screeningCursor.criterion + 1} / 4</span>
      </div>
      <div class="criterion-input-wrap">
        <label class="answer-label" for="screeningInput">${escapeHTML(criterion.question)}</label>
        <textarea class="answer-input" id="screeningInput" maxlength="600" placeholder="写下你的判断依据，而不是只回答“是”或“否”" required></textarea>
      </div>
      <div class="special-footer">
        <span class="selection-count">候选 ${state.screeningCursor.candidate + 1}/${state.candidates.length} · 四则 ${state.screeningCursor.criterion + 1}/4</span>
        <button class="submit-button" type="submit">记录判断 <span aria-hidden="true">→</span></button>
      </div>
    </form>`;

  const form = document.querySelector("#screeningForm");
  const input = document.querySelector("#screeningInput");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitScreening(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  window.setTimeout(() => input.focus({ preventScroll: true }), 60);
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
        <div class="decision-reason">
          <label for="decisionReason">选择理由</label>
          <textarea id="decisionReason" maxlength="800" placeholder="请综合用户、痛点、资源和目标说明理由" required></textarea>
        </div>
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
    const reason = document.querySelector("#decisionReason").value.trim();
    if (!selected) {
      showToast("请先选择一个当前最值得行动的方案");
      return;
    }
    if (reason.length < 8) {
      showToast("请再具体说明选择依据");
      return;
    }
    const candidate = state.candidates.find((item) => item.id === selected.value);
    state.decision = { candidateId: selected.value, reason };
    addMessage("user", `我选择 ${candidate.name}：${candidate.text}\n理由：${reason}`);
    addMessage("coach", "选择来自你的比较与判断。四则收敛不是寻找绝对最优，而是筛出当前情境下更值得行动的方案。接下来做创新责任检查。\n" + TEXT_STEPS.responsibility_user.question);
    state.step = "responsibility_user";
    commitAndRender();
  });
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
}

function renderInteraction() {
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
  if (["reflection", "complete"].includes(state.step)) return "reflection";
  return "responsibility";
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
    const checkCount = CRITERIA.filter((criterion) => checks[criterion.id]).length;
    return `<div class="candidate-mini"><strong>${escapeHTML(candidate.name)}</strong> · ${escapeHTML(candidate.text)}<br>${checkCount}/4 项检验已记录</div>`;
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
        resultField("最终优先方案", priority ? `${priority.name}：${priority.text}` : "") +
        resultField("选择理由", state.decision.reason),
      Boolean(state.decision.candidateId),
    ),
    sectionMarkup(
      "05",
      "responsibility",
      "创新责任检查",
      resultField("用户价值", state.answers.responsibility_user) +
        resultField("隐私与伦理", state.answers.responsibility_ethics) +
        resultField("资源与成本", state.answers.responsibility_cost) +
        resultField("绿色与可持续", state.answers.responsibility_green),
      Boolean(state.answers.responsibility_green),
    ),
    sectionMarkup("06", "reflection", "思维反思", resultField("思路改变", state.answers.reflection), state.step === "complete"),
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
    process: "四个维度都已有方向。现在检查方案是否来自不同类别，并形成 3—5 个候选方案。",
    responsibility_user: "用户价值已经明确。接下来检查方案可能带来的隐私、伦理与公平风险。",
    responsibility_ethics: "风险与应对已经记录。现在把方案缩小到现实可启动的资源边界。",
    responsibility_cost: "最小行动的资源边界更清楚了。最后检查它能否绿色、持续地运行。",
    responsibility_green: "责任检查完成。最后回看整个过程，只回答一个关于思维变化的问题。",
    reflection: "你的反思已经写入成果单。你完成了“重新表征 → 发散生成 → 聚合决策”的完整训练。",
  };
  return feedback[stepId] || "已记录。";
}

function nextPrompt(stepId) {
  const next = TEXT_STEPS[stepId]?.next;
  if (TEXT_STEPS[next]) return TEXT_STEPS[next].question;
  if (next === "candidate_select") return "请从刚才的四维方向中选择 3—5 个候选方案，尽量保持类型多样。";
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

function submitScreening(value) {
  const raw = value.trim();
  if (raw.length < 6) {
    showToast("请写下具体判断依据，而不只回答“是”或“否”");
    return;
  }

  const candidate = state.candidates[state.screeningCursor.candidate];
  const criterion = CRITERIA[state.screeningCursor.criterion];
  state.screening[candidate.id][criterion.id] = raw;
  addMessage("user", `【${candidate.name} · ${criterion.name}】${raw}`);

  const lastCriterion = state.screeningCursor.criterion === CRITERIA.length - 1;
  const lastCandidate = state.screeningCursor.candidate === state.candidates.length - 1;

  if (!lastCriterion) {
    state.screeningCursor.criterion += 1;
    addMessage("coach", `${criterion.feedback}\n${getScreeningPrompt()}`);
  } else if (!lastCandidate) {
    state.screeningCursor.candidate += 1;
    state.screeningCursor.criterion = 0;
    addMessage("coach", `方案${candidate.id}的四则检验完成。先不下结论，继续看下一项候选。\n${getScreeningPrompt()}`);
  } else {
    state.step = "decision";
    addMessage("coach", "所有候选方案都完成了四则检验。现在综合用户、痛点、资源和目标：你认为哪个方案目前最值得行动？请由你作出选择并说明依据。并不存在由系统宣布的“标准最佳方案”。");
  }
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
    return `| ${candidate.name}：${safe(candidate.text)} | ${safe(checks.user)} | ${safe(checks.pain)} | ${safe(checks.resource)} | ${safe(checks.goal)} |`;
  }).join("\n") || "| 待形成 | 待完成 | 待完成 | 待完成 | 待完成 |";

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

| 候选方案 | 用户 | 痛点 | 资源 | 目标 |
| --- | --- | --- | --- | --- |
${tableRows}

- **最终优先方案：** ${priority ? `${priority.name}：${priority.text}` : "待完成"}
- **选择理由：** ${state.decision.reason || "待完成"}

## 五、创新责任检查

- **用户价值：** ${value("responsibility_user")}
- **隐私与伦理：** ${value("responsibility_ethics")}
- **资源与成本：** ${value("responsibility_cost")}
- **绿色与可持续：** ${value("responsibility_green")}

## 六、思维反思

${value("reflection")}
`;
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
  const blob = new Blob([markdownResult()], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `三阶创新思维迁移任务成果单-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("成果单已导出");
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
