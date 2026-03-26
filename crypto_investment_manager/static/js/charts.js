/**
 * charts.js – Professional Dashboard Charts
 * Fetches /api/chart-data and renders six Chart.js visualisations.
 */

const PALETTE = ["#f0b90b", "#627eea", "#f3ba2f", "#2775ca", "#26a17b", "#e84142"];
const GRID = "rgba(255,255,255,.06)";
const TICK = "#94a3b8";

const BASE_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: TICK, font: { family: "'Inter', sans-serif", size: 11, weight: 500 }, padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: { backgroundColor: "rgba(15,22,41,.95)", titleFont: { family: "'Inter', sans-serif" }, bodyFont: { family: "'Inter', sans-serif" }, borderColor: "rgba(255,255,255,.1)", borderWidth: 1, padding: 12, cornerRadius: 8 }
    },
    scales: {
        y: { ticks: { color: TICK, font: { size: 11 } }, grid: { color: GRID }, border: { display: false } },
        x: { ticks: { color: TICK, font: { size: 11 } }, grid: { color: GRID }, border: { display: false } }
    }
};

function noScale() {
    const o = JSON.parse(JSON.stringify(BASE_OPTS));
    delete o.scales;
    return o;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/chart-data")
        .then(r => r.json())
        .then(data => {
            renderRiskBar(data.risk);
            renderPie(data.pie);
            renderPerfComparison(data.performance);
            renderForecast(data.forecast);
            renderEtaLine(data.eta);
            renderReturnsBar(data.returns);
        })
        .catch(e => console.error("Chart data error:", e));
});

/* ── 1. Risk Assessment Bar ───────────────────────────────── */
function renderRiskBar(d) {
    const ctx = document.getElementById("riskBarChart");
    if (!ctx || !d || !d.labels.length) return;
    const cmap = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#10b981" };
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: d.labels,
            datasets: [{
                label: "Adjusted ETA %",
                data: d.etas,
                backgroundColor: d.levels.map(l => cmap[l] || "#6366f1"),
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: .6
            }]
        },
        options: BASE_OPTS
    });
}

/* ── 2. Allocation Doughnut ───────────────────────────────── */
function renderPie(d) {
    const ctx = document.getElementById("allocationPie");
    if (!ctx || !d || !d.labels.length) return;
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: d.labels,
            datasets: [{
                data: d.values,
                backgroundColor: PALETTE,
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: { ...noScale(), cutout: "68%", plugins: { ...noScale().plugins, legend: { position: "bottom", labels: { color: TICK, font: { size: 11 }, padding: 16, usePointStyle: true } } } }
    });
}

/* ── 3. Performance Comparison ────────────────────────────── */
function renderPerfComparison(d) {
    const ctx = document.getElementById("perfComparisonChart");
    if (!ctx || !d || !d.labels.length) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: d.labels,
            datasets: [
                { label: "Total Return", data: d.total_returns, backgroundColor: "#10b981", borderRadius: 6, barPercentage: .5 },
                { label: "Std Risk", data: d.std_risks, backgroundColor: "#ef4444", borderRadius: 6, barPercentage: .5 },
                { label: "Avg Return", data: d.avg_returns, backgroundColor: "#6366f1", borderRadius: 6, barPercentage: .5 }
            ]
        },
        options: BASE_OPTS
    });
}

/* ── 4. Price Forecast ────────────────────────────────────── */
function renderForecast(d) {
    const ctx = document.getElementById("forecastChart");
    if (!ctx || !d || !d.labels.length) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: d.labels,
            datasets: [
                { label: "Current Price", data: d.current_price, backgroundColor: "rgba(240,185,11,.7)", borderRadius: 6, barPercentage: .5 },
                { label: "Estimated Future", data: d.estimated_future_price, backgroundColor: "rgba(99,102,241,.7)", borderRadius: 6, barPercentage: .5 }
            ]
        },
        options: BASE_OPTS
    });
}

/* ── 5. ETA Trend Line ────────────────────────────────────── */
function renderEtaLine(d) {
    const ctx = document.getElementById("etaLineChart");
    if (!ctx || !d || !d.labels.length) return;
    new Chart(ctx, {
        type: "line",
        data: {
            labels: d.labels,
            datasets: [{
                label: "Adjusted ETA %",
                data: d.values,
                borderColor: "#f0b90b",
                backgroundColor: "rgba(240,185,11,.1)",
                fill: true,
                tension: .4,
                pointRadius: 5,
                pointBackgroundColor: "#f0b90b",
                pointBorderWidth: 0
            }]
        },
        options: BASE_OPTS
    });
}

/* ── 6. Returns Comparison ────────────────────────────────── */
function renderReturnsBar(d) {
    const ctx = document.getElementById("returnsBarChart");
    if (!ctx || !d || !d.labels.length) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: d.labels,
            datasets: [
                { label: "Weighted Return", data: d.returns, backgroundColor: "#10b981", borderRadius: 6, barPercentage: .5 },
                { label: "Weighted Risk", data: d.risks, backgroundColor: "#ef4444", borderRadius: 6, barPercentage: .5 }
            ]
        },
        options: BASE_OPTS
    });
}
