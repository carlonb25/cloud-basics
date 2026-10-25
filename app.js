import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { STACK, PRETEST_QUIZ, POSTTEST_QUIZ, QUIZ_VERSION, LESSONS, SCENARIOS, REFLECTION_PROMPTS, CLOUD_LANDSCAPE, COURSE_SOURCES, QUESTION_METHOD } from "./content.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const blank = () => ({ pretest: null, posttest: null, lessons: {}, scenarios: {}, reflection: null });
const merge = (a, b) => { for (const k in b) { const v = b[k]; a[k] = v && typeof v === "object" && !Array.isArray(v) ? merge(a[k] && typeof a[k] === "object" ? a[k] : {}, v) : v; } return a; };

let app, auth, db, user = null, data = blank(), isAdmin = false;
const configured = !firebaseConfig.apiKey.startsWith("YOUR_");

/* ---------- data layer ---------- */
async function load() {
  const snap = await getDoc(doc(db, "users", user.uid));
  data = merge(blank(), snap.exists() ? snap.data() : {});
  const adminSnap = await getDoc(doc(db, "admins", user.uid));
  isAdmin = adminSnap.exists() && adminSnap.data().enabled === true;
}
async function save(patch) {
  merge(data, patch);
  try { await setDoc(doc(db, "users", user.uid), { ...patch, email: user.email, updatedAt: serverTimestamp() }, { merge: true }); }
  catch (e) { toast("Your answer could not be saved. Check your connection and try again."); throw e; }
}
function toast(msg) { const t = $("#toast") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "toast", role: "status" })); t.textContent = msg; t.hidden = false; setTimeout(() => t.hidden = true, 5000); }

/* ---------- helpers ---------- */
const view = html => { $("#view").innerHTML = html; $("#view").focus({ preventScroll: true }); window.scrollTo(0, 0); };
const pct = (n, d) => d ? Math.round(100 * n / d) : 0;
const score = t => t ? t.score : null;
const quizFor = kind => kind === "pretest" ? PRETEST_QUIZ : POSTTEST_QUIZ;
const currentQuiz = t => t?.quizVersion === QUIZ_VERSION;
const COURSE_TOPICS = [
  { id: "iaas", label: "IaaS", description: "Infrastructure as a Service: rent virtual machines, storage, and networking while managing the operating system and software you install. Examples include Amazon EC2, Azure Virtual Machines, and Google Compute Engine." },
  { id: "paas", label: "PaaS", description: "Platform as a Service: deploy your application while a provider manages the runtime and underlying infrastructure. Examples include Azure App Service, Google App Engine, and AWS Elastic Beanstalk." },
  { id: "saas", label: "SaaS", description: "Software as a Service: use a complete application operated by its provider; you configure users, settings, and your data. Examples include Microsoft 365 and Google Workspace." },
  { id: "public-cloud", label: "Public cloud", description: "Use cloud services on provider-operated infrastructure that serves multiple customers, with resources separated logically. Major providers include AWS, Microsoft Azure, and Google Cloud." },
  { id: "private-cloud", label: "Private cloud", description: "Learn how a cloud environment dedicated to one organization can provide more control, along with the added operational responsibilities it may bring." },
  { id: "hybrid-cloud", label: "Hybrid cloud", description: "Connect private and public cloud environments and understand the planning needed for identity, networking, and moving data between them." },
  { id: "fundamentals", label: "Cloud fundamentals", description: "Learn what cloud computing means, why organizations use it, and how to distinguish service models from deployment models." },
  { id: "on-demand", label: "On-demand access", description: "Explore how cloud resources can be provisioned when needed, adjusted as demand changes, and billed based on usage." },
  { id: "responsibility", label: "Shared responsibility", description: "Understand which security and maintenance tasks belong to the provider and which remain with you—and how that changes between IaaS, PaaS, and SaaS." },
  { id: "security", label: "Security basics", description: "Build foundational habits for cloud accounts and data, including managing identities, limiting access, and understanding provider-versus-customer responsibilities." },
  { id: "cost", label: "Cost awareness", description: "Learn why cloud usage can grow into a bill and how to think about unused resources, capacity, budgets, and monitoring." }
];
const nextStep = () => {
  if (!data.pretest) return { href: "#/pretest", label: "Take the 8-question pre-test" };
  if (!currentQuiz(data.pretest)) return { href: "#/pretest/current", label: "Update your pre-test" };
  const l = LESSONS.find(l => !data.lessons[l.id]?.done);
  if (l) return { href: `#/lesson/${l.id}`, label: `Continue: ${l.title}` };
  if (SCENARIOS.some(s => !data.scenarios[s.id])) return { href: "#/scenarios", label: "Practice with scenarios" };
  if (!data.posttest || !currentQuiz(data.posttest)) return { href: data.posttest ? "#/posttest/current" : "#/posttest", label: data.posttest ? "Update your post-test" : "Take the post-test" };
  if (!data.reflection) return { href: "#/reflection", label: "Write your reflection" };
  return null;
};

/* ---------- shell ---------- */
function header() {
  const h = location.hash || "#/";
  const link = (href, text) => `<a href="${href}" ${h.startsWith(href) ? 'aria-current="page"' : ""}>${text}</a>`;
  $("#top").innerHTML = user ? `<div class="bar"><a class="brand" href="#/">Cloud Basics</a>
    <nav aria-label="Main">${link("#/dashboard", "Dashboard")}${link("#/pretest", "Pre-test")}${link("#/lesson", "Lessons")}${link("#/scenarios", "Scenarios")}${link("#/posttest", "Post-test")}${link("#/landscape", "Cloud landscape")}${link("#/reflection", "Reflection")}${isAdmin ? link("#/admin", "Admin") : ""}</nav>
    <button class="ghost" id="out">Sign out</button></div>` : `<div class="bar"><span class="brand">Cloud Basics</span></div>`;
  $("#out")?.addEventListener("click", () => signOut(auth));
}

/* ---------- stack diagram ---------- */
function stackHTML(model) {
  const n = STACK.youManage[model];
  return `<ul class="stack" aria-label="${model} responsibility stack">${STACK.layers.map((l, i) =>
    `<li class="${i < n ? "you" : "prov"}"><span>${l}</span><b>${i < n ? "You manage" : "Provider manages"}</b></li>`).join("")}</ul>`;
}

/* ---------- multiple choice ---------- */
function mcq(el, id, q, saved, cb, opts = {}) {
  const name = `q-${id}`;
  el.innerHTML = `<fieldset><legend>${esc(q.q || q.text)}</legend>${q.options.map((o, i) =>
    `<label class="opt"><input type="radio" name="${name}" value="${i}" ${saved && saved.choice === i ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}</fieldset>
    ${opts.reason ? `<label class="reason">Why did you choose that? <span class="hint">(one or two sentences)</span><textarea rows="2">${esc(saved?.reasoning || "")}</textarea></label>` : ""}
    <button class="btn">${saved ? "Check again" : "Check answer"}</button><div class="fb" aria-live="polite"></div>`;
  const fb = el.querySelector(".fb");
  const show = (c, correct) => {
    fb.className = "fb " + (correct ? "ok" : "bad");
    fb.innerHTML = correct
      ? `<b>Correct.</b> ${esc(q.options[q.answer])} is the best answer. <b>Why:</b> ${esc(q.why)}`
      : `<b>Not quite.</b> You chose ${esc(q.options[c])}. ${esc(q.miss || "")} The best answer is ${esc(q.options[q.answer])}. <b>Why:</b> ${esc(q.why)}`;
  };
  if (saved) show(saved.choice, saved.choice === q.answer);
  el.querySelector("button").addEventListener("click", async e => {
    const sel = el.querySelector(`input[name="${name}"]:checked`);
    if (!sel) { fb.className = "fb bad"; fb.textContent = "Select an answer first."; return; }
    const c = +sel.value, correct = c === q.answer;
    show(c, correct);
    e.target.disabled = true;
    try { await cb(c, correct, el.querySelector("textarea")?.value.trim() || ""); } finally { e.target.disabled = false; e.target.textContent = "Check again"; }
  });
}

/* ---------- views ---------- */
function authView(mode = "signin") {
  const up = mode === "signup";
  view(`<section class="auth-layout">
    <div class="auth-story">
      <h1>Cloud-Computing Concepts, Made Clear.</h1>
      <p class="auth-intro">Build a solid foundation in how cloud services work, who manages what, and how to choose the right model.</p>
      <div class="auth-topics" id="auth-topics" aria-label="Course topics">
        ${COURSE_TOPICS.map(t => `<span class="topic-bubble-wrap"><button type="button" class="topic-bubble" aria-describedby="topic-tip-${t.id}" aria-expanded="false" data-topic="${t.id}">${t.label}</button><span class="topic-tip" role="tooltip" id="topic-tip-${t.id}"><strong>${t.label}</strong><br>${t.description}</span></span>`).join("")}
      </div>
    </div>
    <form id="auth" class="auth-card" novalidate>
      <h2>${up ? "Create your account" : "Sign in to continue"}</h2>
      <p class="hint">${up ? "Save your learning progress and return anytime." : "Your lessons and progress are saved to your account."}</p>
    ${configured ? "" : `<p class="fb bad">Firebase is not configured yet. Add your keys to firebase-config.js.</p>`}
    <label>Email address<input type="email" name="email" autocomplete="email" placeholder="you@example.com" required></label>
    <label>Password<input type="password" name="pw" autocomplete="${up ? "new-password" : "current-password"}" minlength="6" placeholder="${up ? "At least 6 characters" : "Enter your password"}" required></label>
    <div class="fb bad" id="err" aria-live="polite" hidden></div>
    <button class="btn auth-submit">${up ? "Create account" : "Sign in"} <span aria-hidden="true">→</span></button>
    <p class="auth-alt">${up ? `Already have an account? <a href="#/signin">Sign in</a>` : `New to Cloud Basics? <a href="#/signup">Create an account</a>`}</p>
    ${up ? "" : `<p class="auth-reset"><a href="#" id="reset">Forgot your password?</a></p>`}
    <p class="auth-footnote">Free, self-paced learning · Progress saved securely</p>
    </form>
    <footer class="auth-credit"><span>Final Project · CS6460</span><span aria-hidden="true">·</span><span>Created by <strong>Carlon Brown</strong></span><span aria-hidden="true">·</span><a href="mailto:cbrown420@gatech.edu">cbrown420@gatech.edu</a></footer>
  </section>`);
  const topics = $("#auth-topics");
  topics.addEventListener("click", e => {
    const selected = e.target.closest(".topic-bubble");
    if (!selected) return;
    const shouldOpen = selected.getAttribute("aria-expanded") !== "true";
    topics.querySelectorAll(".topic-bubble").forEach(button => {
      button.setAttribute("aria-expanded", button === selected && shouldOpen ? "true" : "false");
    });
  });
  topics.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    topics.querySelectorAll('.topic-bubble[aria-expanded="true"]').forEach(button => button.setAttribute("aria-expanded", "false"));
  });
  const err = m => { const e = $("#err"); e.textContent = m; e.hidden = false; };
  const msg = c => ({ "auth/invalid-credential": "That email and password do not match.", "auth/email-already-in-use": "An account with that email already exists. Sign in instead.", "auth/weak-password": "Use a password with at least 6 characters.", "auth/invalid-email": "Enter a valid email address.", "auth/missing-password": "Enter your password." }[c] || "Something went wrong. Try again.");
  $("#auth").addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(e.target), email = f.get("email").trim(), pw = f.get("pw");
    try { await (up ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, email, pw); }
    catch (x) { err(msg(x.code)); }
  });
  $("#reset")?.addEventListener("click", async e => {
    e.preventDefault();
    const email = $("#auth").email.value.trim();
    if (!email) return err("Enter your email above, then select Reset password.");
    try { await sendPasswordResetEmail(auth, email); err("Reset link sent. Check your inbox."); } catch { err("Could not send a reset link to that address."); }
  });
}

function dashboardView() {
  const lessonsDone = LESSONS.filter(l => data.lessons[l.id]?.done).length;
  const answered = SCENARIOS.filter(s => data.scenarios[s.id]);
  const right = answered.filter(s => data.scenarios[s.id].choice === s.answer).length;
  const pre = score(data.pretest), post = score(data.posttest);
  const preTotal = data.pretest?.quizLength || 5, postTotal = data.posttest?.quizLength || 5;
  const comparable = currentQuiz(data.pretest) && currentQuiz(data.posttest);
  const wrong = new Set();
  const t = data.posttest || data.pretest;
  const reviewQuiz = data.posttest && currentQuiz(data.posttest) ? POSTTEST_QUIZ : PRETEST_QUIZ;
  if (t && currentQuiz(t)) reviewQuiz.forEach((q, i) => { if (t.answers[i] !== q.answer) wrong.add(q.conceptLabel); });
  SCENARIOS.forEach(s => { const a = data.scenarios[s.id]; if (a && a.choice !== s.answer) wrong.add(s.concept); });
  const n = nextStep();
  const stepsDone = Number(currentQuiz(data.pretest)) + lessonsDone + answered.length + Number(currentQuiz(data.posttest)) + Number(Boolean(data.reflection));
  const stepsTotal = LESSONS.length + SCENARIOS.length + 3;
  const progress = pct(stepsDone, stepsTotal);
  view(`<section class="dashboard-page">
    <div class="dashboard-welcome">
      <div><p class="eyebrow">Your learning space</p><h1>Welcome back</h1><p class="dashboard-email">${esc(user.email)} <span>·</span> Your progress saves automatically</p></div>
      <div class="dashboard-progress"><div class="row"><span>Course progress</span><b>${progress}%</b></div><progress aria-label="Course progress" max="${stepsTotal}" value="${stepsDone}"></progress><span class="hint">${stepsDone} of ${stepsTotal} activities complete</span></div>
    </div>
    <section class="dashboard-next">
      <div class="next-copy"><p class="eyebrow">${n ? "Up next" : "Course complete"}</p><h2>${n ? "Keep your momentum going." : "You made it through the course."}</h2><p>${n ? "Pick up where you left off on your cloud learning path." : "Review your progress and see how your understanding changed."}</p></div>
      ${n ? `<a class="btn dashboard-cta" href="${n.href}">${esc(n.label)} <span aria-hidden="true">→</span></a>` : `<span class="tag done">All activities complete</span>`}
    </section>
    <div class="dashboard-section-heading"><div><p class="eyebrow">At a glance</p><h2>Your progress</h2></div><span class="hint">A little progress adds up.</span></div>
    <div class="dashboard-stats">
      <section class="stat-card"><span class="stat-icon" aria-hidden="true">01</span><p class="stat-label">Starting quiz</p><p class="big-num">${pre === null ? "—" : `${pre}<span> / ${preTotal}</span>`}</p><p class="hint">${pre === null ? "Ready when you are" : "Your starting point"}</p></section>
      <section class="stat-card"><span class="stat-icon" aria-hidden="true">02</span><p class="stat-label">Lessons</p><p class="big-num">${lessonsDone}<span> / ${LESSONS.length}</span></p><progress aria-label="Lessons completed" max="${LESSONS.length}" value="${lessonsDone}"></progress><p class="hint">${lessonsDone === LESSONS.length ? "All lessons complete" : "Build your cloud foundation"}</p></section>
      <section class="stat-card"><span class="stat-icon" aria-hidden="true">03</span><p class="stat-label">Scenarios</p><p class="big-num">${answered.length}<span> / ${SCENARIOS.length}</span></p><p class="hint">${right} answered correctly</p></section>
      <section class="stat-card"><span class="stat-icon" aria-hidden="true">04</span><p class="stat-label">Final quiz</p><p class="big-num">${post === null ? "—" : `${post}<span> / ${postTotal}</span>`}</p><p class="hint">${post === null ? "Take it after practice" : "Your course result"}</p></section>
    </div>
    ${pre !== null && post !== null ? comparable
      ? `<section class="dashboard-panel comparison-panel"><div><p class="eyebrow">Your growth</p><h2>Before and after</h2><p>You scored ${pre} / ${PRETEST_QUIZ.length} before learning and ${post} / ${POSTTEST_QUIZ.length} after: <b>${post - pre >= 0 ? "+" : ""}${post - pre} question${Math.abs(post - pre) === 1 ? "" : "s"} (${post - pre >= 0 ? "+" : ""}${pct(post, POSTTEST_QUIZ.length) - pct(pre, PRETEST_QUIZ.length)} percentage points).</b></p></div>
        <ul class="topic-results">${PRETEST_QUIZ.map((q, i) => {
          const before = data.pretest.answers[i] === q.answer, after = data.posttest.answers[i] === POSTTEST_QUIZ[i].answer;
          return `<li><span>${esc(q.conceptLabel)}</span><span class="topic-change ${after ? "topic-correct" : ""}">${before ? "✓" : "–"} <span aria-hidden="true">→</span> ${after ? "✓" : "–"}</span></li>`;
        }).join("")}</ul></section>`
      : `<section class="dashboard-panel"><p class="eyebrow">Your growth</p><h2>Before and after</h2><p>Both scores are saved, but they use different quiz versions, so a direct comparison would not be reliable. Use the current-version pre-test and post-test links to create a matched comparison; earlier scores are preserved.</p></section>` : ""}
    <section class="dashboard-panel review-panel"><div><p class="eyebrow">Keep building</p><h2>Worth reviewing</h2><p class="hint">Topics to revisit from your quizzes and practice.</p></div>${wrong.size ? `<ul>${[...wrong].map(c => `<li>${esc(c)}</li>`).join("")}</ul>` : `<p>${t || answered.length ? "Nothing flagged right now. Nice work." : "Topics you miss will show up here."}</p>`}</section>
  </section>`);
}

async function adminView() {
  if (!isAdmin) {
    view(`<section class="dashboard-page"><h1>Admin access required</h1><p class="lede">This account is not authorized to view learner records.</p><a class="btn" href="#/dashboard">Return to dashboard</a></section>`);
    return;
  }

  view(`<section class="dashboard-page"><p class="eyebrow">Restricted area</p><h1>Admin learner overview</h1><p class="lede">Read-only view of learner records and progress. These records can contain personal reflections; only access them for authorized course administration.</p><p id="admin-status" class="hint" role="status">Loading learner records…</p><div id="admin-records"></div></section>`);
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const records = snapshot.docs.map(s => ({ id: s.id, value: s.data() }));
    const list = $("#admin-records");
    if (!list) return;
    if (!records.length) {
      $("#admin-status").textContent = "No learner accounts have saved course data yet.";
      return;
    }
    $("#admin-status").textContent = `${records.length} learner record${records.length === 1 ? "" : "s"}`;
    list.innerHTML = records.map(({ id, value }) => {
      const lessonCount = LESSONS.filter(l => value.lessons?.[l.id]?.done).length;
      const scenarioCount = SCENARIOS.filter(s => value.scenarios?.[s.id]).length;
      const preTotal = value.pretest?.quizLength || 5, postTotal = value.posttest?.quizLength || 5;
      return `<details class="admin-record"><summary><span class="admin-learner">${esc(value.email || "Email not recorded")}<small>${esc(id)}</small></span><span>Pre-test <b>${value.pretest ? `${esc(value.pretest.score)} / ${preTotal}` : "—"}</b></span><span>Post-test <b>${value.posttest ? `${esc(value.posttest.score)} / ${postTotal}` : "—"}</b></span><span>Lessons <b>${lessonCount} / ${LESSONS.length}</b></span><span>Scenarios <b>${scenarioCount} / ${SCENARIOS.length}</b></span></summary><pre>${esc(JSON.stringify(value, null, 2))}</pre></details>`;
    }).join("");
  } catch (error) {
    console.error("Could not load admin learner records.", error);
    const status = $("#admin-status");
    if (status) {
      status.className = "fb bad";
      status.textContent = "Could not load learner records. Confirm this account has admin access and that the latest Firestore rules are published.";
    }
  }
}

function lessonIndex() {
  view(`<h1>Lessons</h1><p class="lede">Follow this path from cloud fundamentals through service models, deployment choices, and responsible cloud decisions. Each lesson ends with a quick understanding check.</p><ol class="list">${LESSONS.map(l =>
    `<li class="card row"><div><h2><a href="#/lesson/${l.id}">${esc(l.title)}</a></h2><p class="hint">About ${l.minutes} minutes</p></div><span class="tag ${data.lessons[l.id]?.done ? "done" : ""}">${data.lessons[l.id]?.done ? "Complete" : "Not started"}</span></li>`).join("")}</ol>`);
}

function lessonView(id) {
  const L = LESSONS.find(l => l.id === id); if (!L) return lessonIndex();
  const st = data.lessons[id] || {}, i = LESSONS.indexOf(L), nxt = LESSONS[i + 1];
  view(`<article class="lesson"><h1>${esc(L.title)}</h1><p class="hint">About ${L.minutes} minutes</p>${referencesHTML(L.sourceIds, "Lesson content is original instructional writing based on these references.")}${L.objectives?.length ? `<section class="card"><h2>By the end, you can</h2><ul>${L.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul></section>` : ""}${L.body.map(b => b.stack
    ? `<div class="explorer"><div role="tablist" aria-label="Service model">${["IaaS", "PaaS", "SaaS"].map((m, k) => `<button role="tab" class="seg" data-m="${m}" aria-selected="${k === 0}">${m}</button>`).join("")}</div><div id="stackview"></div><p id="stacknote"></p></div>`
    : `<h2>${esc(b.h)}</h2><p>${esc(b.p)}</p>`).join("")}
    <section class="card check"><h2>Check your understanding</h2><div id="chk"></div></section>
    <div class="row"><a href="#/lesson">All lessons</a>${nxt ? `<a class="btn" href="#/lesson/${nxt.id}">Next lesson</a>` : `<a class="btn" href="#/scenarios">Go to scenarios</a>`}</div></article>`);
  const draw = m => { $("#stackview").innerHTML = stackHTML(m); $("#stacknote").textContent = STACK.notes[m]; document.querySelectorAll(".seg").forEach(b => b.setAttribute("aria-selected", b.dataset.m === m)); };
  if ($(".seg")) { draw("IaaS"); document.querySelectorAll(".seg").forEach(b => b.onclick = () => draw(b.dataset.m)); }
  mcq($("#chk"), id, L.check, st.check, (c, ok) => save({ lessons: { [id]: { done: ok, check: { choice: c, correct: ok } } } }));
}

function scenariosView() {
  view(`<h1>Scenario practice</h1><p class="lede">Read the situation, pick the best fit, and say why. Feedback appears right away.</p>${referencesHTML(["nist", "aws-models", "shared-responsibility", "google-cloud"], "Scenarios are original practice situations written for this course. The references support the cloud concepts used to build the questions; scenario wording is not copied from these sources.")}${SCENARIOS.map((s, i) =>
    `<section class="card"><h2>Scenario ${i + 1}</h2><div id="${s.id}"></div></section>`).join("")}<a class="btn" href="#/posttest">Continue to the post-test</a>`);
  SCENARIOS.forEach(s => mcq($("#" + s.id), s.id, s, data.scenarios[s.id], (c, ok, r) => save({ scenarios: { [s.id]: { choice: c, correct: ok, reasoning: r } } }), { reason: true }));
}

function sourceLinksHTML() {
  return sourceLinksHTMLFor(COURSE_SOURCES);
}

function referencesHTML(sourceIds, note) {
  const sources = COURSE_SOURCES.filter(source => sourceIds.includes(source.id));
  return `<aside class="content-references" aria-label="References"><h2>References</h2>${note ? `<p>${esc(note)}</p>` : ""}<ul class="source-list">${sourceLinksHTMLFor(sources)}</ul></aside>`;
}

function sourceLinksHTMLFor(sources) {
  return sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a> <span class="hint">— ${esc(source.organization)}</span><small>${esc(source.use)}</small></li>`).join("");
}

function landscapeView() {
  view(`<article class="landscape-page">
    <p class="eyebrow">A map of cloud computing</p>
    <h1>Cloud providers, products, and models</h1>
    <p class="lede">Cloud computing is an ecosystem—not one company or one kind of product. This guide maps service models to illustrative vendors and products, then separates those from deployment models.</p>
    <aside class="landscape-note"><b>How to read this map:</b> examples are illustrative, not an exhaustive vendor list, endorsement, or market-share ranking. One company may offer products in several categories. Service models describe what the provider manages; deployment models describe how cloud environments are arranged.</aside>
    <section aria-labelledby="service-map-title">
      <div class="landscape-heading"><p class="eyebrow">Service models</p><h2 id="service-map-title">From more customer control to more provider management</h2></div>
      <div class="service-spectrum" aria-hidden="true"><span>Customer manages more</span><span class="spectrum-line"></span><span>Provider manages more</span></div>
      <div class="provider-grid">${CLOUD_LANDSCAPE.map((group, i) => `<section class="provider-card">
        <span class="provider-step">0${i + 1}</span><p class="eyebrow">${i === 0 ? "Infrastructure" : i === 1 ? "Application platform" : "Finished software"}</p>
        <h3>${esc(group.title)}</h3><p>${esc(group.description)}</p>
        <ul>${group.companies.map(c => `<li><span><b>${esc(c.name)}</b><small>${esc(c.example)}</small></span><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${esc(c.name)} product information">↗</a></li>`).join("")}</ul>
      </section>`).join("")}</div>
    </section>
    <section class="deployment-section" aria-labelledby="deployment-map-title">
      <div class="landscape-heading"><p class="eyebrow">Deployment models</p><h2 id="deployment-map-title">Where and for whom cloud environments are arranged</h2></div>
      <div class="deployment-grid">
        <article class="deployment-card"><h3>Public cloud</h3><p>A provider offers services on infrastructure used by many customers, with their resources logically separated.</p></article>
        <article class="deployment-card"><h3>Private cloud</h3><p>A cloud environment is dedicated to one organization. It can be on the organization's premises or hosted elsewhere.</p></article>
        <article class="deployment-card"><h3>Hybrid cloud</h3><p>Connected private and public environments work together. Identity, network, and data integration need planning.</p></article>
        <article class="deployment-card"><h3>Multi-cloud</h3><p>An organization uses services from multiple cloud providers. It can overlap with hybrid cloud, but does not require a private cloud.</p></article>
      </div>
    </section>
    <section class="source-panel">
      <p class="eyebrow">References and question design</p><h2>Where the course content comes from</h2>
      <p>${esc(QUESTION_METHOD)}</p>
      <ul class="source-list">${sourceLinksHTML()}</ul>
      <p class="hint">Vendor product pages illustrate examples; they are not used to rank vendors. Cloud products and market positions change, so this page avoids presenting a live market-share ranking.</p>
    </section>
  </article>`);
}

function testView(kind, refresh = false) {
  const post = kind === "posttest", t = refresh ? null : data[kind], title = post ? "Post-test" : "Pre-test", quiz = quizFor(kind);
  if (t) {
    const oldVersion = !currentQuiz(t), previousTotal = t.quizLength || 5;
    return view(`<h1>${title} result</h1><p class="big-num">${t.score} / ${oldVersion ? previousTotal : quiz.length}</p>
      ${post && data.pretest ? `<p class="lede">Your pre-test score was ${data.pretest.score} / ${data.pretest.quizLength || 5}.</p>` : ""}
      ${oldVersion
        ? `<p class="lede">This result was recorded with an earlier version of the course, so its question-by-question explanations are no longer available. The saved score is preserved.</p><a class="btn" href="#/${kind}/current">Take the current ${title.toLowerCase()} (keep this earlier score)</a>`
        : `<p class="lede">${post ? "Here is your feedback for each question." : "This is your starting point. Feedback is shown now, after the starting score has been recorded."}</p>
          ${quiz.map((q, i) => {
            const correct = t.answers[i] === q.answer, picked = t.answers[i];
            return `<section class="card"><h2>${i + 1}. ${esc(q.q)}</h2><p class="fb ${correct ? "ok" : "bad"}"><b>${correct ? "Correct." : "Not quite."}</b> ${picked === null || picked === undefined ? "No answer selected. " : correct ? `Answer: ${esc(q.options[q.answer])}. ` : `Your answer: ${esc(q.options[picked])}. ${esc(q.miss || "")} Correct answer: ${esc(q.options[q.answer])}. `}<b>Why:</b> ${esc(q.why)}</p></section>`;
          }).join("")}`}
      <a class="btn" href="${post ? "#/reflection" : "#/lesson"}">${post ? "Write your reflection" : "Start the lessons"}</a>`);
  }
  view(`<h1>${title}</h1><p class="lede">${post ? "This matched quiz covers the same topics as the pre-test with different questions. Submit all answers to see explanations; this keeps feedback from influencing your remaining answers." : "Eight quick questions show what you know before the lessons. Guessing is fine. Submit all answers to see explanations, so feedback does not affect your starting-point score."}</p>
    <details class="source-note"><summary>How these questions were written and sourced</summary><p>${esc(QUESTION_METHOD)}</p><ul class="source-list">${sourceLinksHTML()}</ul></details>
    <form id="test">${quiz.map((q, i) => `<fieldset class="card"><legend>${i + 1}. ${esc(q.q)}</legend>${q.options.map((o, k) =>
      `<label class="opt"><input type="radio" name="q${i}" value="${k}"><span>${esc(o)}</span></label>`).join("")}</fieldset>`).join("")}
      <div class="fb bad" id="err" hidden></div><button class="btn">Submit ${title.toLowerCase()}</button></form>`);
  $("#test").addEventListener("submit", async e => {
    e.preventDefault();
    const answers = quiz.map((_, i) => { const r = e.target.querySelector(`input[name="q${i}"]:checked`); return r ? +r.value : null; });
    if (answers.includes(null)) { const er = $("#err"); er.hidden = false; er.textContent = "Answer every question before submitting."; return; }
    const sc = answers.filter((a, i) => a === quiz[i].answer).length;
    const patch = { [kind]: { score: sc, answers, quizVersion: QUIZ_VERSION, quizLength: quiz.length, at: Date.now() } };
    const previous = data[kind], historyKey = `${kind}History`;
    if (previous && !currentQuiz(previous)) patch[historyKey] = [...(data[historyKey] || []), previous];
    await save(patch);
    testView(kind);
  });
}

function reflectionView() {
  const r = data.reflection || {};
  const sel = (n, label, v) => `<label>${label}<select name="${n}"><option value="">Choose</option>${[1, 2, 3, 4, 5].map(k => `<option ${v == k ? "selected" : ""}>${k}</option>`).join("")}</select></label>`;
  view(`<h1>Reflection</h1><p class="lede">${esc(REFLECTION_PROMPTS.ratings)} Think about your pre-test, lessons, scenarios, and post-test.</p>
    <form id="ref" class="card"><label>${esc(REFLECTION_PROMPTS.learned)}<textarea name="learned" rows="4">${esc(r.learned)}</textarea></label>
    <label>${esc(REFLECTION_PROMPTS.confusing)}<textarea name="confusing" rows="4">${esc(r.confusing)}</textarea></label>
    <div class="grid">${sel("clarity", "Clarity of explanations", r.clarity)}${sel("feedback", "Usefulness of feedback", r.feedback)}${sel("navigation", "Ease of navigation", r.navigation)}${sel("dashboard", "Usefulness of dashboard", r.dashboard)}</div>
    <button class="btn">Save reflection</button><div class="fb ok" id="done" hidden>Reflection saved. Thank you.</div></form>`);
  $("#ref").addEventListener("submit", async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    await save({ reflection: { ...f, at: Date.now() } });
    $("#done").hidden = false;
  });
}

/* ---------- router ---------- */
function route() {
  header();
  if (!user) return authView(location.hash === "#/signup" ? "signup" : "signin");
  const [, p, id] = (location.hash || "#/dashboard").split("/");
  ({ dashboard: dashboardView, admin: adminView, landscape: landscapeView, pretest: () => testView("pretest", id === "current"), posttest: () => testView("posttest", id === "current"), scenarios: scenariosView, reflection: reflectionView,
    lesson: () => id ? lessonView(id) : lessonIndex() }[p] || dashboardView)();
}

if (!configured) { route(); }
else {
  app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app);
  onAuthStateChanged(auth, async u => {
    user = u;
    isAdmin = false;
    data = blank();
    if (u) {
      try { await load(); }
      catch (error) {
        console.error("Could not load account data.", error);
        isAdmin = false;
        toast("Could not load your saved progress. Check your connection and Firestore rules.");
      }
      if (["", "#/", "#/signin", "#/signup"].includes(location.hash)) location.hash = "#/dashboard";
    }
    route();
  });
  window.addEventListener("hashchange", route);
}
