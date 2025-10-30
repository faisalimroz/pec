import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

type WaterRow = {
  date: string;            // "YYYY-MM-DD" from API
  eightAM: number;
  twelvePM: number;
  twoPM: number;
  sixPM: number;
  maximumWaterLevel: number;
};

type Mode = "monthly" | "maximum";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function WaterLevelMiniChartFetcher({
  height = 480,
}: {
  height?: number;
}) {
  const [data, setData] = useState<WaterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("monthly");

  // Filters
  const [month, setMonth] = useState<string | null>(null); // e.g., "March"
  const [year, setYear] = useState<number | ''>('');
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate]   = useState<Date | null>(null);

  // Format dd-mm-yyyy for API when using date range
  const toDDMMYYYY = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth()+1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Build POST body
      const body: any = {};
      if (location.trim()) body.location = location.trim();

      // Prefer month/year if month is chosen; else use date range (if provided)
      if (month) {
        body.month = month;                 // e.g., "March"
        if (year !== '') body.year = Number(year);
      } else if (startDate || endDate) {
        if (startDate) body.startDate = toDDMMYYYY(startDate);
        if (endDate)   body.endDate   = toDDMMYYYY(endDate);
      }

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

  // initial load (no filters)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Filters */}
      <form
        className="flex flex-wrap items-end gap-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        {/* Location */}
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">Location</label>
          <InputText
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Mawa"
          />
        </span>

        {/* Month (name) */}
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">Month</label>
          <Dropdown
            value={month}
            onChange={(e) => setMonth(e.value)}
            options={MONTHS}
            placeholder="Select month"
            className="min-w-[12rem]"
            showClear
          />
        </span>

        {/* Year (optional) */}
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">Year</label>
          <InputText
            value={year}
            onChange={(e) => {
              const v = e.target.value.trim();
              setYear(v === "" ? "" : Number(v));
            }}
            placeholder="e.g., 2025"
          />
        </span>

        {/* OR Date Range (overrides month if both are set? we’ll prefer month; otherwise uses range) */}
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">Start Date</label>
          <Calendar
            value={startDate as any}
            onChange={(e) => setStartDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            showIcon
          />
        </span>
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">End Date</label>
          <Calendar
            value={endDate as any}
            onChange={(e) => setEndDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            showIcon
          />
        </span>

        {/* Mode toggle */}
        <span className="flex flex-col gap-1">
          <label className="text-xs font-medium">Mode</label>
          <Dropdown
            value={mode}
            onChange={(e) => setMode(e.value)}
            options={[
              { label: "Monthly (8/12/2/6 PM)", value: "monthly" },
              { label: "Maximum", value: "maximum" },
            ]}
            className="min-w-[14rem]"
          />
        </span>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Apply"}
        </Button>
      </form>

      {/* Chart */}
      <div style={{ height }}>
        <Chart type="line" data={chartData} options={options} />
      </div>
    </div>
  );
}
