import { FilterProvider, useFilters } from "./context/FilterContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import StatsRow from "./components/stats/StatsRow";
// import IntensityBySectorChart from "./components/charts/IntensityBySectorChart";
import LikelihoodByYearChart from "./charts/LikelihoodByYearChart";
import TopicDistributionChart from "./charts/TopicDistributionChart";
import RelevanceByRegionChart from "./charts/RelevanceByRegionChart";
import RecordsByCountryChart from "./charts/RecordsByCountryChart";
import IntensityLikelihoodScatter from "./charts/IntensityLikelihoodScatter";
import { useChartData } from "./hooks/useChartData";
import IntensityBySectorChart from "./charts/IntensityBySectorChart";
import DataTable from "./table/DataTable";

function Dashboard() {
  const { filters } = useFilters();
  const { data, loading, error } = useChartData(filters);

  // console.log("Dashboard render",data);

  return (
    <>
      <DashboardLayout>
        <StatsRow />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IntensityBySectorChart data={data} loading={loading} error={error} />
          <LikelihoodByYearChart data={data} loading={loading} error={error} />
          <TopicDistributionChart data={data} loading={loading} error={error} />
          <RelevanceByRegionChart data={data} loading={loading} error={error} />
          <RecordsByCountryChart data={data} loading={loading} error={error} />
          <IntensityLikelihoodScatter data={data} loading={loading} error={error} />
        </div>
      <DataTable />

      </DashboardLayout>

    </>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
}