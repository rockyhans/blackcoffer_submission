import { useFilters } from "../../context/FilterContext";
import { useFilterOptions } from "../../hooks/useFilterOptions";
import Spinner from "../common/Spinner";
import { X, SlidersHorizontal } from "lucide-react";
import dashboardLogo from "../../assets/dashboard-logo.png";

const FIELD_LABELS = {
  end_year: "End Year",
  start_year: "Start Year",
  topic: "Topic",
  sector: "Sector",
  region: "Region",
  pestle: "PEST",
  source: "Source",
  country: "Country",
  city: "City",
};

const FIELD_ORDER = [
  "end_year",
  "start_year",
  "topic",
  "sector",
  "region",
  "pestle",
  "source",
  "country",
  "city",
];

export default function Sidebar({ open, onClose }) {
  const { filters, setFilter, resetFilters } = useFilters();
  const { options, loading, error } = useFilterOptions();

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const handleReset = () => {
    resetFilters();
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30
          flex h-screen w-72 flex-col
          bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 w-full">
            <img
              src={dashboardLogo}
              alt="Dashboard Logo"
              className="w-full h-[61.7px] object-contain"
            />
          </div>

          {/* {activeFilters > 0 && (
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-semibold text-white">
                {activeFilters}
              </span>
            )} */}

          <button
            onClick={onClose}
            className="rounded-md p-3 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]"> 
          {loading && (
            <div className="flex justify-center py-10">
              <Spinner size="sm" />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="space-y-2">
              {FIELD_ORDER.map((field) => {
                const values = options[field] || [];

                return (
                  <div key={field}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {FIELD_LABELS[field]}
                    </label>

                    <select
                      value={filters[field] || ""}
                      onChange={(e) =>
                        setFilter(field, e.target.value)
                      }
                      className="
                        w-full rounded-lg
                        border border-gray-300
                        bg-white
                        px-3 py-2.5
                        text-sm text-gray-700
                        shadow-sm
                        transition
                        focus:border-brand-500
                        focus:outline-none
                        focus:ring-2
                        focus:ring-brand-200
                      "
                    >
                      <option value="">All</option>

                      {values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-2 shrink-0 bg-white">
          <button
            onClick={handleReset}
            className="
              w-full
              rounded-lg
              bg-brand-500
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-brand-600
            "
          >
            Reset Filters
          </button>
        </div>
      </aside>
    </>
  );
}