import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { avgRelevanceByRegion } from "../utils/aggregations";

export default function RelevanceByRegionChart({ data, loading, error }) {
  const rows = avgRelevanceByRegion(data);

  return (
    <ChartCard
      title="Average Relevance by Region"
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <Bar
        data={{
          labels: rows.map((r) => r.region),
          datasets: [
            {
              label: "Avg Relevance",
              data: rows.map((r) => r.avg),
              backgroundColor: "#ec4899",
              borderRadius: 6,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } },
        }}
      />
    </ChartCard>
  );
}