
import { Scatter } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import { intensityLikelihoodPoints } from "../utils/aggregations";

export default function IntensityLikelihoodScatter({ data, loading, error }) {
  const points = intensityLikelihoodPoints(data);

  return (
    <ChartCard
      title="Intensity vs Likelihood"
      subtitle="Bubble size = relevance"
      loading={loading}
      error={error}
      isEmpty={points.length === 0}
    >
      <Scatter
        data={{
          datasets: [
            {
              label: "Records",
              data: points,
              backgroundColor: "rgba(99,102,241,0.5)",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Intensity" } },
            y: { title: { display: true, text: "Likelihood" } },
          },
        }}
      />
    </ChartCard>
  );
}