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
    title: "毕业季旧物代卖",
    summary: "为毕业生集中拍照、登记成色和约定取货时间。先做教材、收纳盒等容易验货的物品，成交后结算。",
    tags: ["毕业季", "集中交付", "成交收费"],
    user: "临近离校、没时间逐个回复买家的毕业生。买家主要是同校低年级学生。",
    pain: "几十元的东西，反复拍照、议价、等人取货，很容易觉得不值得。最后一天还没卖掉，只能丢弃或低价处理。",
    solution: "先和一栋宿舍约定收件时段，给物品编号，拍清瑕疵和尺寸。买家在固定时间验货取走，卖家收到结算单；未卖出的物品按约定退回或捐赠。",
    innovation: "把买卖双方反复约时间，改成一个固定交付时段。团队卖的是代办服务，不需要先出钱收购。",
    business: "事先谈好代卖费，成交后收取。低价物品可以打包出售，避免忙一下午还覆盖不了人工成本。",
    pilot: "先收 30 件物品，做一个周末。记下拍照、沟通和交付各花多久，再算每小时实际收入。",
    validation: "先拿到场地许可。物品清单、底价和未售处理方式要让卖家确认，首批不收手机等难验货的高价物品。",
  },
  {
    id: "green-return", number: "02", category: "绿色创业", icon: "leaf", tone: "green",
    title: "周末装备租借",
    summary: "从露营桌椅和野餐垫做起，提供周五取、周日还的租借套餐。新手拿到装备时，也能看懂怎么用。",
    tags: ["以租代买", "周末出行", "清洁验收"],
    user: "偶尔周末郊游、又没有地方存放装备的学生和年轻家庭。",
    pain: "第一次出去玩，不知道要买哪些。买齐以后占地方；临时向朋友借，又怕损坏后不好开口。",
    solution: "先备几套耐用的桌椅和野餐垫，按人数打包。交接时一起拍照验收，附上使用说明和归还清单，回来后统一清洁。",
    innovation: "按一次出行来准备物品，把购买、存放和清洁的麻烦交给租借点处理。首期不碰需要专业操作的装备。",
    business: "按周末套餐收租金，逾期和损坏怎么处理提前写明。押金是要退的钱，不能算收入。",
    pilot: "先准备 5 套，跑满四个周末。观察租出次数、清洁时间和损坏情况，算算要租几次才能收回购置成本。",
    validation: "确认场地是否允许摆放和使用装备。天气取消时如何退款、正常磨损如何认定，都要在下单前说明。",
  },
  {
    id: "parcel-reuse", number: "03", category: "绿色创业", icon: "leaf", tone: "violet",
    title: "社区快递包装回收",
    summary: "和快递驿站合作，收集居民拆下的纸箱，按尺寸整理。完好的纸箱留给下一位寄件人，其余定时交给回收站。",
    tags: ["纸箱复用", "定点回收", "驿站合作"],
    user: "经常收寄快递的社区居民，以及需要备纸箱、又没有太多空间堆放的快递驿站。",
    pain: "居民家里放不下纸箱，零散卖掉也不值当。驿站愿意留下好箱子，但没有人固定整理，尺寸混在一起，忙起来顾不上挑。",
    solution: "在一家驿站设置纸箱交还区，约好每天的整理时间。先去除面单，检查纸箱是否干净完好，再按尺寸上架；破损和多余的纸箱定时清走。",
    innovation: "把收集、挑选和再次使用放在同一个地方。居民取件时就能交箱，寄件时也能现场选箱。",
    business: "先和驿站谈可复用纸箱的结算方式，其余纸箱与回收站按重量结算。把分拣工时和搬运费用算进去，确认小规模也能覆盖成本。",
    pilot: "先在一个驿站做两周，记录收到多少箱、多少能再次使用，以及每天整理多久。再问驿站是否愿意长期付费合作。",
    validation: "先取得场地同意，安排好存放和清运时间，不占消防通道。及时清除面单信息，不收受潮、污染或装过危险物品的包装。",
  },
  {
    id: "silver-help", number: "04", category: "社区服务", icon: "community", tone: "orange",
    title: "医院预约陪诊",
    summary: "和已有服务团队合作，从一家医院的复诊陪同做起：出门前核对材料，到院后协助找诊室，结束后把资料交回家属。",
    tags: ["老人复诊", "预约陪同", "家属沟通"],
    user: "需要定期复诊、家属又难以全程陪同的老人。付款和沟通对象通常还包括子女。",
    pain: "找诊室、签到、取报告，一次看病要跑好几个地方。子女不在现场，最担心的是不知道老人进行到哪一步。",
    solution: "先与经过培训的陪诊团队合作，限定一家医院和预约时段。出发前列好材料清单，关键节点给家属报平安，结束后清点票据和报告。",
    innovation: "把陪诊前的准备和结束后的交接补完整，让老人和家属都知道今天谁负责、负责到哪一步。",
    business: "按约定服务时段收费，超时费用提前确认。先核算等待时间和交通成本，再决定能否接跨院订单。",
    pilot: "由有经验的人员带教，完成少量预约订单。逐单记录等候时间、遗漏材料和家属提出的问题。",
    validation: "不作诊断、不解释药物用量，也不承诺挂到特定号源。健康资料须经本人授权，突发情况按医院流程处理。",
  },
  {
    id: "holiday-pets", number: "05", category: "社区服务", icon: "community", tone: "teal",
    title: "假期上门喂猫",
    summary: "只接同一片社区的订单，上门前见面熟悉宠物。每次照看按清单完成，关门离开前再核对一遍。",
    tags: ["假期托管", "固定片区", "服务留痕"],
    user: "假期回家或出游、希望猫留在熟悉环境里的养宠人。服务先限定在步行可达的几个小区。",
    pain: "把钥匙交给陌生人很难放心。只收到一张照片，也看不出水换没换、猫砂清没清、窗户关没关。",
    solution: "第一次先上门熟悉，确认喂食量、藏身点和门窗要求。每次用同一张清单核对粮、水、猫砂和精神状态，再把约定的视频发给主人。",
    innovation: "用固定服务人员和可核对的交接记录减少陌生感。把订单集中在同一片区，节省来回路上的时间。",
    business: "按次收取照看费，多猫、加时和节假日费用提前写清。先算一天能认真完成几单，不靠赶场压缩照看时间。",
    pilot: "从熟人介绍的 5 户开始，跑一个短假期。复盘每户耗时、路线安排，以及主人是否愿意再次预约。",
    validation: "提前约定钥匙保管、紧急联系人和就医授权。入户拍摄范围要获同意，不接需要打针、喂药等专业照护的订单。",
  },
  {
    id: "local-notes", number: "06", category: "数字服务", icon: "digital", tone: "rose",
    title: "小店实拍服务",
    summary: "为周边小店拍真实商品和使用细节，保留原片、尺寸与拍摄日期。一套照片拆成商品页和短视频，两处都能用。",
    tags: ["商品实拍", "原片留存", "按包交付"],
    user: "没有专职摄影师、需要更新网店图片的周边小店。先服务商品种类少、可以现场拍摄的商户。",
    pain: "老板用手机随手拍，细节交代不清；套现成图片又容易与实物不符，顾客拿到后觉得被误导。",
    solution: "约定到店时间，拍正面、尺寸参照和关键细节，保存原片。允许裁切和校正曝光，不修掉商品瑕疵，最后交一套商品图和一条短视频。",
    innovation: "把交付标准从“好看”变成“看清楚”。商品有什么、没有什么，都能在照片里找到依据。",
    business: "按商品数量和拍摄时长报价，补拍、加急另行约定。先用手机和简易灯光接小单，收入稳定后再考虑添设备。",
    pilot: "找 3 家小店，各拍一组商品。记录拍摄和修图工时，回访商户：顾客还在反复问哪些问题？",
    validation: "实拍只能证明拍摄时的样子，不是商品质量认证。拍摄范围与素材使用权写清，不制作虚假评价或冒充顾客晒单。",
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
      <h3>${item.title}</h3><p class="case-summary">${item.summary}</p>
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
  const fields = [["谁会用", item.user], ["卡在哪里", item.pain], ["具体怎么做", item.solution], ["换个做法", item.innovation], ["谁来付钱", item.business], ["先试一小步", item.pilot], ["要想清楚的事", item.validation]];
  document.querySelector("#caseDetailContent").innerHTML = `
    <span class="detail-category ${item.tone}">${item.category}</span><h2 id="caseDetailTitle">${item.title}</h2>
    <div class="detail-highlight">${item.summary}</div>
    <dl class="detail-fields">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
    <p class="detail-note">以上为教学方案，尚未开展经营验证。</p>`;
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
