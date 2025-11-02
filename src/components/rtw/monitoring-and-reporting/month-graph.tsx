import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";

type WaterRow = {
  date: string;            // "YYYY-MM-DD" from API
  eightAM: number;
  twelvePM: number;
  twoPM: number;
  sixPM: number;
  maximumWaterLevel: number;
};

type Mode = "monthly" | "maximum";

type FilterData = {
  location?: string;
  month?: string;

  startDate?: string; // DD-MM-YYYY format
  endDate?: string;   // DD-MM-YYYY format
};

export default function WaterLevelMiniChart({
  height = 480,
  filterData, // Accept filter data as prop
  mode = "monthly" // Accept mode as prop
}: {
  height?: number;
  filterData?: FilterData;
  mode?: Mode;
}) {
  const [data, setData] = useState<WaterRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters: FilterData = {}) => {
    try {
      setLoading(true);

      // Build POST body from filterData prop
      const body: any = {};
      
      if (filters.location) body.location = filters.location;
      if (filters.month) body.month = filters.month;
   
      if (filters.startDate) body.startDate = filters.startDate;
      if (filters.endDate) body.endDate = filters.endDate;

      console.log("Fetching chart data with filters:", body);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/monthly-water-level/chart`,
        body,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } }
      );

      const rows: WaterRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setData(rows);
    } catch (err) {
      console.error("Chart fetch error:", err);
      setData([]); // clear on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filterData changes
  useEffect(() => {
    if (filterData) {
      fetchData(filterData);
    }
  }, [filterData]);

  const labels = useMemo(
    () =>
      data.map((r) =>
        new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      ),
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
          beginAtZero: false,
          title: { display: true, text: "Water Level (m PWD)" },
        },
      },
    }),
    []
  );

  return (
    <div className="p-4 border rounded-md bg-white">
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <i className="pi pi-spin pi-spinner mr-2"></i>
          Loading chart data...
        </div>
      )}

      {/* Chart */}
      <div style={{ height }}>
        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
}