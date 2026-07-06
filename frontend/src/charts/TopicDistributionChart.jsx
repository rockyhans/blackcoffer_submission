import { Doughnut } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { topicDistribution } from "../utils/aggregations";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#94a3b8"];

export default function TopicDistributionChart({ data, loading, error }) {
  const rows = topicDistribution(data);

  return (
    <ChartCard
      title="Topic Distribution"
      subtitle="Top 7 topics + others"
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <Doughnut
        data={{
          labels: rows.map((r) => r.topic),
          datasets: [
            {
              data: rows.map((r) => r.count),
              backgroundColor: COLORS,
              borderWidth: 0,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } },
        }}
      />
    </ChartCard>
  );
}