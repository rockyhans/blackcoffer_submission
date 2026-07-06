import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { avgIntensityBySector } from "../utils/aggregations";

export default function IntensityBySectorChart({ data, loading, error }) {
  const rows = avgIntensityBySector(data);

  // console.log("IntensityBySectorChart render", rows);

  return (
    <ChartCard
      title="Average Intensity by Sector"
      subtitle="Top 10 sectors"
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <Bar
        data={{
          labels: rows.map((r) => r.sector),
          datasets: [
            {
              label: "Avg Intensity",
              data: rows.map((r) => r.avg),
              backgroundColor: "#6366f1",
              borderRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </ChartCard>
  );
}