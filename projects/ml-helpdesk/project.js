const flowTrigger = document.querySelector("[data-flow-trigger]");
const flowStatus = document.querySelector("[data-flow-status]");
const flowNodes = [...document.querySelectorAll("[data-flow-stage]")];
const flowLinks = [...document.querySelectorAll("[data-flow-link]")];
const reducedFlowMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const flowMessages = [
    "問い合わせ文をWeb画面で受け付けます。",
    "Pythonアプリが認証と入力内容を確認します。",
    "3つのモデルが予測し、問い合わせ履歴を保存します。",
    "予測結果をNotionの問い合わせ台帳へ登録します。",
    "MiddleまたはHighの場合、Slackで担当部署へ通知します。",
];
let flowTimers = [];

function clearFlowTimers() {
    flowTimers.forEach((timer) => window.clearTimeout(timer));
    flowTimers = [];
}

function resetFlow() {
    clearFlowTimers();
    flowNodes.forEach((node) => node.classList.remove("is-flow-active", "is-flow-complete"));
    flowLinks.forEach((link) => link.classList.remove("is-flow-active", "is-flow-complete"));
}

function showFlowStage(stage) {
    flowNodes.forEach((node) => {
        const nodeStage = Number(node.dataset.flowStage);
        node.classList.toggle("is-flow-active", nodeStage === stage);
        node.classList.toggle("is-flow-complete", nodeStage < stage);
    });

    flowLinks.forEach((link) => {
        const linkStage = Number(link.dataset.flowLink);
        link.classList.toggle("is-flow-active", linkStage === stage);
        link.classList.toggle("is-flow-complete", linkStage < stage);
    });

    flowStatus.textContent = flowMessages[stage];
}

function completeFlow() {
    flowNodes.forEach((node) => {
        node.classList.remove("is-flow-active");
        node.classList.add("is-flow-complete");
    });
    flowLinks.forEach((link) => {
        link.classList.remove("is-flow-active");
        link.classList.add("is-flow-complete");
    });
    flowStatus.textContent = "処理が完了しました。予測履歴を残し、必要な問い合わせを担当部署へ通知します。";
    flowTrigger.disabled = false;
    flowTrigger.textContent = "もう一度再生";
}

function playFlow() {
    resetFlow();
    flowTrigger.disabled = true;
    flowTrigger.textContent = "処理中";

    if (reducedFlowMotion.matches) {
        completeFlow();
        flowStatus.textContent = "アニメーション軽減設定に合わせ、処理完了状態を表示しました。";
        return;
    }

    flowMessages.forEach((_, stage) => {
        const timer = window.setTimeout(() => showFlowStage(stage), stage * 700);
        flowTimers.push(timer);
    });

    flowTimers.push(window.setTimeout(completeFlow, flowMessages.length * 700));
}

if (flowTrigger && flowStatus && flowNodes.length > 0) {
    flowTrigger.addEventListener("click", playFlow);
}

const comparisonButtons = [...document.querySelectorAll("[data-comparison-mode]")];
const comparisonSummary = document.querySelector("[data-comparison-summary]");
const comparisonTable = document.querySelector(".comparison-table");
const comparisonCopy = {
    before: "改善前は、問い合わせの判断・記録・通知を担当者が手作業で行います。",
    after: "改善後は、機械学習と外部連携で定型処理を自動化し、判断が必要な部分を人が確認します。",
};

function updateComparison(mode) {
    const hiddenMode = mode === "before" ? "after" : "before";

    comparisonButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.comparisonMode === mode));
    });

    document.querySelectorAll(`.comparison-${mode}`).forEach((element) => {
        element.hidden = false;
    });
    document.querySelectorAll(`.comparison-${hiddenMode}`).forEach((element) => {
        element.hidden = true;
    });

    comparisonTable.dataset.mode = mode;
    comparisonSummary.textContent = comparisonCopy[mode];
}

if (comparisonButtons.length > 0 && comparisonSummary && comparisonTable) {
    comparisonButtons.forEach((button) => {
        button.addEventListener("click", () => updateComparison(button.dataset.comparisonMode));
    });
    updateComparison("before");
}

document.documentElement.classList.add("project-interactions-ready");
