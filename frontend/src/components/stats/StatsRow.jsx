import { useStats } from "../../hooks/useStats";
import Spinner from "../common/Spinner";
import ErrorState from "../common/ErrorState";

const CARD_CONFIG = [
  { key: "totalDocuments", label: "Total Records" },
  { key: "totalCountries", label: "Countries" },
  { key: "totalTopics", label: "Topics" },
  { key: "totalRegions", label: "Regions" },
  { key: "totalSectors", label: "Sectors" },
];

export default function StatsRow() {
  const { stats, loading, error } = useStats();

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CARD_CONFIG.map(({ key, label }) => (
        <div
          key={key}
          className="
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:shadow-md
          "
        >
          <div className="w-full bg-orange-400 p-2 text-start">
            <p className="text-lg font-semibold uppercase tracking-wide text-white">
              {label}
            </p>
          </div>

          <div className="flex items-center justify-start p-2">
            <h2 className="text-4xl font-bold text-gray-800">
              {stats[key] ?? "—"}
            </h2>
          </div>

        </div>
      ))}
    </div>
  );
}