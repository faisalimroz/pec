import { useMemo } from "react";
import { Chart } from "primereact/chart";

type YearRow = {
  month: string;             // "January", "February", ...
  minLevel: number;          // e.g., 4.6
  maxLevel: number;          // e.g., 5.0
};

// --- Sample data (12 months). Replace with your API data when ready.
const YEARLY: YearRow[] = [
  { month: "January",   minLevel: 4.65, maxLevel: 4.95 },
  { month: "February",  minLevel: 4.68, maxLevel: 4.98 },
  { month: "March",     minLevel: 4.72, maxLevel: 5.02 },
  { month: "April",     minLevel: 4.76, maxLevel: 5.05 },
  { month: "May",       minLevel: 4.70, maxLevel: 4.97 },
  { month: "June",      minLevel: 4.55, maxLevel: 4.80 },
  { month: "July",      minLevel: 4.40, maxLevel: 4.60 },
  { month: "August",    minLevel: 4.45, maxLevel: 4.75 },
  { month: "September", minLevel: 4.30, maxLevel: 4.70 },
  { month: "October",   minLevel: 4.50, maxLevel: 4.85 },
  { month: "November",  minLevel: 4.65, maxLevel: 4.95 },
  { month: "December",  minLevel: 4.72, maxLevel: 4.98 },
];

export default function YearlyWaterLevelChart({
  data = YEARLY,
  dangerLevel = 6.20,       // red flat line
  height = 320,
}: {
  data?: YearRow[];
  dangerLevel?: number;
  height?: number;
}) {
  const labels = useMemo(() => data.map(d => d.month), [data]);

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Minimum Level",
        data: data.map(d => d.minLevel),
        borderColor: "#f59e0b",           // orange
        backgroundColor: "rgba(245,158,11,0.15)",
        fill: false,
        tension: 0.35,
        pointRadius: 2,
      },
      {
        label: "Maximum Level",
        data: data.map(d => d.maxLevel),
        borderColor: "#3b82f6",           // blue
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: false,
        tension: 0.35,
        pointRadius: 2,
      },
      {
        label: "Danger Level",
        data: new Array(data.length).fill(dangerLevel),
        borderColor: "#ef4444",           // red
        backgroundColor: "rgba(239,68,68,0.10)",
        border: [6, 4],               // dashed line (optional)
        fill: false,
        tension: 0,                       // perfectly flat
        pointRadius: 0,
      },
    ],
  }), [data, labels, dangerLevel]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: "Maximum Water Level Report (Yearly)",
        font: { size: 14 },
        padding: { top: 6, bottom: 6 },
      },
      tooltip: { intersect: false, mode: "index" as const },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 45 }, // slanted month labels
      },
      y: {
        beginAtZero: false,
        min: 4.0,
        max: 5.0,
        ticks: { stepSize: 0.2 },
        title: { display: true, text: "Water Level (m PWD)" },
      },
    },
    elements: { line: { borderWidth: 2 } },
  }), []);

  return (
    <div className="p-4 border rounded bg-white">
      <div style={{ height }}>
        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
}
