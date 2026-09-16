const views = {
  overview: {
    title: "全链路运行健康",
    subtitle: "过去 24 小时 · 演示数据",
    chartTitle: "审核量与风险命中趋势",
    kpis: [["入口任务", "38,421", "+8.3%"], ["自动化率", "72.6%", "+2.1pp"], ["SLA 达成", "96.8%", "+1.8pp"], ["风险存续 P95", "18m", "-4m"]],
    chart: [[35, 9], [42, 13], [38, 11], [47, 15], [62, 18], [73, 23], [67, 20], [81, 27], [76, 24], [69, 19], [84, 30], [77, 22]],
    queues: [["金融专家审", "82%", 82], ["普通内容审", "47%", 47], ["资质复核", "31%", 31], ["申诉队列", "18%", 18]],
    guardrail: "自动化率上升时，漏放曝光、申诉翻案与群体差异必须保持在阈值内。",
    state: "全部通过 6 / 6"
  },
  quality: {
    title: "质量与纠错复盘",
    subtitle: "过去 7 天 · 分层抽检",
    chartTitle: "抽检错误与申诉翻案趋势",
    kpis: [["抽检准确率", "98.4%", "+0.6pp"], ["人审分歧率", "3.2%", "-0.8pp"], ["申诉翻案率", "1.7%", "-0.4pp"], ["证据完整度", "94.1%", "+3.5pp"]],
    chart: [[64, 29], [57, 26], [61, 24], [52, 21], [48, 19], [46, 18], [42, 15], [39, 14], [37, 13], [34, 11], [31, 10], [28, 9]],
    queues: [["证据缺失", "28 件", 28], ["政策理解差异", "17 件", 17], ["模型边界样本", "41 件", 41], ["内容版本错误", "9 件", 9]],
    guardrail: "不能只看总体准确率；必须按政策、行业、地域、内容形态与影响等级切片。",
    state: "需关注 1 / 6"
  },
  release: {
    title: "策略版本发布观察",
    subtitle: "policy_3.7 · 10% 灰度",
    chartTitle: "新旧策略决定差异趋势",
    kpis: [["灰度流量", "10.0%", "稳定"], ["决定变化率", "2.8%", "+0.7pp"], ["新增拦截", "641", "+12.4%"], ["安全通过消耗", "¥8.6m", "+1.9%"]],
    chart: [[23, 18], [27, 20], [31, 22], [37, 24], [42, 28], [49, 32], [53, 36], [57, 39], [62, 43], [65, 46], [69, 48], [72, 51]],
    queues: [["新旧结论一致", "97.2%", 97], ["新增拦截复核", "64%", 64], ["新增通过复核", "71%", 71], ["高价值客户样本", "46%", 46]],
    guardrail: "灰度期间同时观察漏放、误杀、申诉、收入、时延与群体差异；任一越界即回滚。",
    state: "观察中 5 / 6"
  }
};

const chart = document.querySelector("#chart");
const queueList = document.querySelector("#queue-list");

function renderView(name) {
  const view = views[name];
  document.querySelector("#view-title").textContent = view.title;
  document.querySelector("#view-subtitle").textContent = view.subtitle;
  document.querySelector("#chart-title").textContent = view.chartTitle;
  view.kpis.forEach((kpi, index) => {
    const number = index + 1;
    document.querySelector(`#kpi${number}-label`).textContent = kpi[0];
    document.querySelector(`#kpi${number}-value`).textContent = kpi[1];
    document.querySelector(`#kpi${number}-delta`).textContent = kpi[2];
  });
  chart.replaceChildren(...view.chart.map(([a, b]) => {
    const group = document.createElement("div");
    group.className = "bar-group";
    group.innerHTML = `<i class="bar a" style="--a:${a}%"></i><i class="bar b" style="--b:${b}%"></i>`;
    return group;
  }));
  queueList.replaceChildren(...view.queues.map(([label, value, width]) => {
    const row = document.createElement("div");
    row.className = "queue-row";
    row.innerHTML = `<div><span>${label}</span><small>${value}</small></div><div class="queue-track"><i style="--q:${width}%"></i></div>`;
    return row;
  }));
  document.querySelector("#guardrail-text").textContent = view.guardrail;
  document.querySelector("#guardrail-state").textContent = view.state;
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });
    renderView(tab.dataset.view);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
renderView("overview");
