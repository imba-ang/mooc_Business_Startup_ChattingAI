const PASSWORD_DIGEST = "ab6cf2eb3e90a8fb47fccc92230122bc3722a36791823ee67573e085c79d79e0";
const SESSION_KEY = "qisi-admin-demo-session";
const SESSION_DURATION = 2 * 60 * 60 * 1000;

const icons = {
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  shield: '<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  book: '<path d="M12 6v15M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Z"/>',
  arrow: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  logout: '<path d="M9 4H5v16h4m6-12 4 4-4 4m-6-4h10"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  chart: '<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  campus: '<path d="m2 9 10-6 10 6-10 6L2 9Zm4 3v6c4 3 8 3 12 0v-6m4-3v8"/>',
  leaf: '<path d="M20 3C9 2 3 7 4 14c1 6 9 7 13 2 3-4 3-9 3-13ZM6 19 16 8"/>',
  digital: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4m-4-11 3 3 5-5"/>',
  community: '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z"/>',
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
}

const cases = [
  {
    id: "campus-loop", number: "01", category: "校园服务", icon: "campus", tone: "blue",
    title: "校园循环站", subtitle: "让闲置物品，在校园里继续发光。",
    summary: "以宿舍楼为单位设置预约取件与集中交付点，让毕业季的闲置物品高效流转。",
    tags: ["闲置循环", "楼栋交付", "低成本试点"],
    user: "有闲置教材、小家电的毕业生，以及需要低价生活用品的在校生。",
    pain: "二手交易信息分散，约时间、搬运和验货成本高，毕业季常出现集中丢弃。",
    solution: "由学生团队组织楼栋循环站；线上登记品类与成色，统一预约验货，在固定时段集中交付。首期只接收教材与完好小型日用品。",
    innovation: "把零散的个人交易变成“楼栋集中交付”，同时改变参与对象、交易地点和交付流程。",
    business: "试点阶段免费撮合；验证需求后，可对可选的上门搬运收取服务费，并与校内合规回收方合作。",
    pilot: "在两栋宿舍开展两周试点，记录有效上架量、成交率、交付耗时与纠纷情况。",
    validation: "先确认校内场地许可，明确验货、退款及责任边界；不接收高风险电器与个人敏感物品。",
  },
  {
    id: "green-return", number: "02", category: "绿色创业", icon: "leaf", tone: "green",
    title: "青盒回流计划", subtitle: "把一次性消耗，变成可重复使用。",
    summary: "围绕校内咖啡店与轻食店，试点可重复使用的外带容器及就近归还服务。",
    tags: ["绿色消费", "共享容器", "闭环运营"],
    user: "经常购买校内外带饮品与轻食的师生，以及希望减少包装消耗的商户。",
    pain: "环保意愿难以转化为日常习惯，个人自带容器不便，商户独立回收的成本较高。",
    solution: "与合规清洗服务方和两家商户合作，提供统一规格的循环容器、押金借还与固定归还点。",
    innovation: "把归还时间延后、归还地点分散，降低学生携带和商户回收的成本。",
    business: "探索商户按使用次数支付服务费的模式；押金仅作为可退还保证，不计入收入。",
    pilot: "先在单一品类中试用，统计归还率、周转次数、单次清洗成本及学生满意度。",
    validation: "食品接触材料与清洗卫生必须合规；先验证损耗率和清洗成本能否支持持续运营。",
  },
  {
    id: "skill-bridge", number: "03", category: "数字服务", icon: "digital", tone: "violet",
    title: "技能搭子工作室", subtitle: "用真实的小任务，连接第一份作品。",
    summary: "将校园组织的设计、剪辑和数据整理需求拆成微项目，帮助学生积累可展示的作品。",
    tags: ["技能匹配", "微型项目", "作品积累"],
    user: "具备基础数字技能但缺少项目经验的学生，以及有明确内容制作需求的校园组织。",
    pain: "学生难以找到适合起步的小项目，需求方又缺少清楚的任务描述和交付标准。",
    solution: "提供任务模板、技能标签和人工匹配；每个微项目明确交付范围、时间、费用与验收标准。",
    innovation: "把“找一个人做大项目”改为“为一个小任务匹配合适技能”，通过流程拆分降低参与门槛。",
    business: "在验证交付质量后，按完成项目收取透明的协调服务费，可拓展面向校园组织的项目管理服务。",
    pilot: "邀请一个社团发布五个小任务，观察匹配耗时、按时交付率、返工次数和复购意愿。",
    validation: "明确版权归属与素材授权，保护学生隐私，并设置争议处理及拒绝不合理需求的机制。",
  },
  {
    id: "silver-help", number: "04", category: "社区服务", icon: "community", tone: "orange",
    title: "银龄数字小站", subtitle: "让数字生活，多一份耐心陪伴。",
    summary: "与社区合作开展小班教学，帮助老年人学习手机操作、出行查询和信息辨别。",
    tags: ["适老服务", "社区共建", "小班陪练"],
    user: "希望学习日常手机操作的社区老年居民，以及需要开展数字助老服务的社区组织。",
    pain: "一次性讲座难以解决具体操作困难，老人缺少可重复练习、安心提问的场景。",
    solution: "把大课堂拆成围绕一个生活任务的小班陪练，配合纸质操作卡和定期答疑。",
    innovation: "从集中讲授转向就近、可重复的小任务训练，调整服务地点、时间和学习流程。",
    business: "由社区合作方购买课程服务，或面向家庭提供明确收费的基础教学；基础防诈骗内容可公益开放。",
    pilot: "联合一个社区开展三次小班，观察老人独立完成任务的比例、复习后的保持情况及参与意愿。",
    validation: "不代管密码、验证码或支付账户，不替学员进行金融交易；服务前明确隐私与上门安全规则。",
  },
  {
    id: "light-breakfast", number: "05", category: "校园服务", icon: "campus", tone: "teal",
    title: "晨光早餐预约", subtitle: "把排队的时间，还给清晨。",
    summary: "联合校内食堂提供分时预约、固定窗口取餐服务，改善早课前的高峰排队问题。",
    tags: ["分时取餐", "食堂协同", "流程优化"],
    user: "早课前时间紧张的学生，以及需要优化早餐备餐和窗口流量的校内食堂。",
    pain: "学生集中到店，等待时间不稳定；食堂也难以提前判断各品类的需求量。",
    solution: "先以少量标准套餐开展前晚预约，设置分时取餐窗口，由食堂负责制作与食品安全。",
    innovation: "把需求确认从早晨前移到前一晚，并分离预约、制作和取餐流程，减少高峰拥堵。",
    business: "探索面向食堂的预约工具服务费，先验证是否真正节省运营成本，再确定收费方式。",
    pilot: "与一个窗口合作试行一周，比较预约与现场取餐的等待时间、爽约率和备餐损耗。",
    validation: "确认校方与食堂授权，清楚规定退款和超时取餐规则；不自行承担无资质的食品加工。",
  },
  {
    id: "local-notes", number: "06", category: "数字服务", icon: "digital", tone: "rose",
    title: "街角内容实验室", subtitle: "让小店的好故事，被更多人看见。",
    summary: "为周边小微商户提供轻量化内容服务，将店铺特色转化为可持续发布的短视频和图文。",
    tags: ["小微商户", "内容共创", "轻量交付"],
    user: "有稳定产品和服务，但缺少内容策划能力的校园周边小微商户。",
    pain: "商户无暇持续制作内容，外包套餐成本较高，也难以判断内容是否带来有效咨询。",
    solution: "学生团队围绕一个产品或人物故事进行拍摄，交付少量可复用素材、发布模板和基础反馈记录。",
    innovation: "从一次性制作大片转向低频拍摄、多次复用，把制作流程拆成小店可负担的模块。",
    business: "按小批次内容包收费，明确修改次数与素材用途，验证复购后再提供月度服务。",
    pilot: "选择三家商户各制作一个内容包，记录交付工时、有效咨询、商户满意度和复购意愿。",
    validation: "获得人物与场地授权，使用合规音乐和图片；不承诺流量、销售额或虚构评价。",
  },
];

const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const passwordInput = document.querySelector("#adminPassword");
const loginError = document.querySelector("#loginError");
const caseDialog = document.querySelector("#caseDialog");
let expiryTimer;

document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});

function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    return session?.expiresAt > Date.now() && session.expiresAt <= Date.now() + SESSION_DURATION
      ? session : null;
  } catch {
    return null;
  }
}

function showDashboard(session) {
  window.clearTimeout(expiryTimer);
  loginView.hidden = true;
  dashboardView.hidden = false;
  document.querySelector("#adminSkipLink").hidden = false;
  document.title = "教学管理中心 · 启思 AI 创新陪练";
  renderCases("全部");
  document.querySelector("#adminMain").focus({ preventScroll: true });
  expiryTimer = window.setTimeout(() => logout("登录已到期，请重新输入密码。"), Math.max(0, session.expiresAt - Date.now()));
}

function logout(message = "") {
  window.clearTimeout(expiryTimer);
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* The login form still works when storage is unavailable. */ }
  if (caseDialog.open) caseDialog.close();
  dashboardView.hidden = true;
  loginView.hidden = false;
  document.querySelector("#adminSkipLink").hidden = true;
  document.querySelector("#caseGrid").replaceChildren();
  document.querySelector("#caseDetailContent").replaceChildren();
  passwordInput.value = "";
  passwordInput.type = "password";
  passwordToggle.textContent = "显示";
  passwordToggle.setAttribute("aria-label", "显示密码");
  passwordToggle.setAttribute("aria-pressed", "false");
  passwordInput.removeAttribute("aria-invalid");
  loginError.textContent = message;
  passwordInput.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

const passwordToggle = document.querySelector("#passwordToggle");
passwordToggle.addEventListener("click", () => {
  const visible = passwordInput.type === "password";
  passwordInput.type = visible ? "text" : "password";
  passwordToggle.textContent = visible ? "隐藏" : "显示";
  passwordToggle.setAttribute("aria-label", visible ? "隐藏密码" : "显示密码");
  passwordToggle.setAttribute("aria-pressed", String(visible));
  passwordInput.focus();
});

passwordInput.addEventListener("input", () => {
  loginError.textContent = "";
  passwordInput.removeAttribute("aria-invalid");
});

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = document.querySelector("#loginSubmit");
  if (submit.disabled) return;
  submit.disabled = true;
  loginError.textContent = "";
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(passwordInput.value));
    const value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    if (value !== PASSWORD_DIGEST) {
      passwordInput.setAttribute("aria-invalid", "true");
      loginError.textContent = "密码不正确，请重新输入。";
      passwordInput.focus();
      passwordInput.select();
      return;
    }
    const session = { expiresAt: Date.now() + SESSION_DURATION };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* Keep this visit usable if storage is blocked. */ }
    passwordInput.value = "";
    passwordInput.removeAttribute("aria-invalid");
    showDashboard(session);
  } catch {
    loginError.textContent = "登录暂时不可用，请通过 HTTPS 网页访问后重试。";
  } finally {
    submit.disabled = false;
  }
});

function renderCases(category) {
  const filtered = category === "全部" ? cases : cases.filter((item) => item.category === category);
  document.querySelector("#caseCount").textContent = `${filtered.length} 个方案示例`;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#caseGrid").innerHTML = filtered.map((item) => `
    <article class="case-card ${item.tone}">
      <div class="case-card-top"><span class="case-icon">${icon(item.icon)}</span><span class="case-category">${item.category}</span><span class="case-number">${item.number}</span></div>
      <h3>${item.title}</h3><p class="case-subtitle">${item.subtitle}</p><p class="case-summary">${item.summary}</p>
      <div class="case-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <button class="case-detail-button" type="button" data-case-id="${item.id}" aria-label="查看${item.title}方案详情">查看方案详情 <span aria-hidden="true">↗</span></button>
    </article>`).join("");
}

document.querySelector(".case-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (button) renderCases(button.dataset.filter);
});

document.querySelector("#caseGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-case-id]");
  if (!button) return;
  const item = cases.find((entry) => entry.id === button.dataset.caseId);
  if (!item) return;
  const fields = [["核心用户", item.user], ["真实痛点", item.pain], ["方案设计", item.solution], ["创新亮点", item.innovation], ["商业模式", item.business], ["最小试点", item.pilot], ["待验证事项", item.validation]];
  document.querySelector("#caseDetailContent").innerHTML = `
    <span class="detail-category ${item.tone}">${item.category} · 教学示例</span><h2 id="caseDetailTitle">${item.title}</h2><p class="detail-subtitle">${item.subtitle}</p>
    <div class="detail-highlight">${item.summary}</div><dl class="detail-fields">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
    <p class="detail-note">此方案为生成的教学示例，用于训练讨论；实施前需开展用户访谈与小规模验证。</p>`;
  caseDialog.showModal();
  caseDialog.scrollTop = 0;
});

document.querySelector("#dialogClose").addEventListener("click", () => caseDialog.close());
caseDialog.addEventListener("click", (event) => {
  if (event.target !== caseDialog) return;
  const rect = caseDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) caseDialog.close();
});
document.querySelector("#logoutButton").addEventListener("click", () => logout());

const navLinks = [...document.querySelectorAll(".admin-nav .nav-link")];
function setActiveNav(target) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${target}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setActiveNav(entry.target.id); });
  }, { rootMargin: "-15% 0px -50% 0px" }).observe(document.querySelector("#cases"));
  window.addEventListener("scroll", () => {
    if (document.querySelector("#cases").getBoundingClientRect().top > window.innerHeight * 0.5) setActiveNav("overview");
  }, { passive: true });
}

const savedSession = readSession();
if (savedSession) showDashboard(savedSession);
