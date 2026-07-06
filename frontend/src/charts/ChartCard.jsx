import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

export default function ChartCard({ title, subtitle, loading, error, isEmpty, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col min-h-[320px]">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex-1 relative">
        {loading && <Spinner />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && isEmpty && <EmptyState />}
        {!loading && !error && !isEmpty && children}
      </div>
    </div>
  );
}