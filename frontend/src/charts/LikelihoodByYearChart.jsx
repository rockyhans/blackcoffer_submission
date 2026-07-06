import { Line } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { likelihoodByYear } from "../utils/aggregations";

export default function LikelihoodByYearChart({ data, loading, error }) {
  const rows = likelihoodByYear(data);

  return (
    <ChartCard
      title="Average Likelihood by Year"
      subtitle="Based on end year"
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <Line
        data={{
          labels: rows.map((r) => r.year),
          datasets: [
            {
              label: "Avg Likelihood",
              data: rows.map((r) => r.avg),
              borderColor: "#4f46e5",
              backgroundColor: "rgba(99,102,241,0.15)",
              fill: true,
              tension: 0.35,
              pointRadius: 3,
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