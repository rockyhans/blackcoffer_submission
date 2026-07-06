import { Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { recordsByCountry } from "../utils/aggregations";

export default function RecordsByCountryChart({ data, loading, error }) {
  const rows = recordsByCountry(data);

  return (
    <ChartCard
      title="Records by Country"
      subtitle="Top 10 countries"
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
    >
      <Bar
        data={{
          labels: rows.map((r) => r.country),
          datasets: [
            {
              label: "Records",
              data: rows.map((r) => r.count),
              backgroundColor: "#10b981",
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