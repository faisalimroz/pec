import { useMemo, useState } from "react";
import { Chart } from "primereact/chart";

type WaterRow = {
  date: string;          
  eightAM: number;
  twelvePM: number;
  twoPM: number;
  sixPM: number;
  maximumWaterLevel: number;
};


const SAMPLE: WaterRow[] = [
  { date: "2025-03-01", eightAM: 2.4, twelvePM: 2.9, twoPM: 3.1, sixPM: 2.6, maximumWaterLevel: 3.2 },
  { date: "2025-03-02", eightAM: 2.6, twelvePM: 3.0, twoPM: 3.2, sixPM: 2.7, maximumWaterLevel: 3.3 },
  { date: "2025-03-03", eightAM: 2.3, twelvePM: 2.8, twoPM: 3.0, sixPM: 2.5, maximumWaterLevel: 3.1 },
  { date: "2025-03-04", eightAM: 2.7, twelvePM: 3.1, twoPM: 3.4, sixPM: 2.9, maximumWaterLevel: 3.5 },
  { date: "2025-03-05", eightAM: 2.1, twelvePM: 2.5, twoPM: 2.8, sixPM: 2.3, maximumWaterLevel: 2.9 },
  { date: "2025-03-06", eightAM: 2.5, twelvePM: 2.9, twoPM: 3.1, sixPM: 2.6, maximumWaterLevel: 3.2 },
  { date: "2025-03-07", eightAM: 2.9, twelvePM: 3.3, twoPM: 3.6, sixPM: 3.0, maximumWaterLevel: 3.7 },
];

export default function WaterLevelMiniChart({
  data = SAMPLE,                          
  height = 480,
  
}: {
  data?: WaterRow[];
  height?: number;
}) {
  const [mode, setMode] = useState<"monthly" | "maximum">("monthly");

  const labels = useMemo(
    () => data.map((r) => new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    [data]
  );

  const chartData = useMemo(() => {
    if (mode === "monthly") {
      return {
        labels,
        datasets: [
          {
            label: "8 AM",
            data: data.map((r) => r.eightAM),
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(29,78,216,0.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 2,
          },
          {
            label: "12 PM",
            data: data.map((r) => r.twelvePM),
            borderColor: "#16a34a",
            backgroundColor: "rgba(22,163,74,0.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 2,
          },
          {
            label: "2 PM",
            data: data.map((r) => r.twoPM),
            borderColor: "#d97706",
            backgroundColor: "rgba(217,119,6,0.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 2,
          },
          {
            label: "6 PM",
            data: data.map((r) => r.sixPM),
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79,70,229,0.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 2,
          },
        ],
      };
    }

    // maximum mode
    return {
      labels,
      datasets: [
        {
          label: "Maximum Water Level",
          data: data.map((r) => r.maximumWaterLevel),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 2,
        },
      ],
    };
  }, [data, labels, mode]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" as const },
        tooltip: { intersect: false, mode: "index" as const },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Water Level (m PWD)" },
         
        },
      },
    }),
    []
  );

  return (
    <div className="p-4 border rounded-md bg-white ">
      

      <div style={{ height }}>
        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
}
