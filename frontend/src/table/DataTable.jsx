import EmptyState from "../components/common/EmptyState";
import {
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from "lucide-react";
import { useFilters } from "../context/FilterContext";
import { useTableData } from "../hooks/useTableData";
import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";

const COLUMNS = [
    { key: "title", label: "Title" },
    { key: "sector", label: "Sector" },
    { key: "topic", label: "Topic" },
    { key: "country", label: "Country" },
    { key: "region", label: "Region" },
    { key: "intensity", label: "Intensity" },
    { key: "likelihood", label: "Likelihood" },
    { key: "relevance", label: "Relevance" },
];

export default function DataTable() {
    const { filters, setSort, setPage } = useFilters();
    const { data, total, pages, loading, error } = useTableData(filters);

    // console.log("data", data);
    // console.log("filters.page", filters.page);

    const handleSort = (key) => {
        const isActive = filters.sort?.replace("-", "") === key;
        const isDesc = filters.sort?.startsWith("-");

        if (isActive && !isDesc) {
            setSort(`-${key}`);
        } else {
            setSort(key);
        }
    };

    const renderSortIcon = (key) => {
        const isActive = filters.sort?.replace("-", "") === key;

        // console.log("filters", filters);

        if (!isActive) {
            return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
        }

        return filters.sort?.startsWith("-") ? (
            <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
        ) : (
            <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
        );
    };


    return (
        <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-md">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Records
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Browse and explore available dataset records.
                    </p>
                </div>

                {!loading && !error && (
                    <span className="rounded-md border-2 border-sky-200 px-2 py-2 text-sm font-semibold text-sky-700">
                        {total} Records
                    </span>
                )}
            </div>

            {loading && <Spinner />}

            {!loading && error && (
                <ErrorState message={error} />
            )}

            {!loading && !error && data.length === 0 && (
                <EmptyState />
            )}

            {!loading && !error && data.length > 0 && (
                <>
                    <div className="overflow-auto">

                        <table className="min-w-full text-sm">

                            <thead className="sticky top-0 z-10 bg-orange-300">
                                <tr>
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col.key}
                                            onClick={() => handleSort(col.key)}
                                            className="
    cursor-pointer
    whitespace-nowrap
    px-5
    py-4
    text-left
    text-xs
    font-bold
    uppercase
    tracking-wider
    text-gray-600
    transition-colors
    duration-300
    ease-in-out
    hover:bg-orange-200
    hover:rounded-lg
  "
                                        >
                                            <div className="flex items-center gap-2">
                                                {col.label}
                                                {renderSortIcon(col.key)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((row, idx) => (
                                    <tr
                                        key={row._id || idx}
                                        className={`
                      border-b border-gray-100
                      ${idx % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50/40"
                                            }
                      transition-colors
                      hover:bg-orange-200
                    `}
                                    >
                                        <td
                                            className="max-w-sm px-5 py-4 font-medium text-gray-800"
                                            title={row.title}
                                        >
                                            <div className="truncate">
                                                {row.title || "—"}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {row.sector || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {row.topic || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {row.country || "—"}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {row.region || "—"}
                                        </td>

                                        <td className="px-5 py-4 text-center font-semibold">
                                            {row.intensity ?? "—"}
                                        </td>

                                        <td className="px-5 py-4 text-center font-semibold">
                                            {row.likelihood ?? "—"}
                                        </td>

                                        <td className="px-5 py-4 text-center font-semibold">
                                            {row.relevance ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50 px-6 py-4">

                        <p className="text-sm text-gray-500">
                            Page <span className="font-semibold">{filters.page}</span> of{" "}
                            <span className="font-semibold">{pages}</span>
                        </p>

                        <div className="flex items-center gap-3">

                            <button
                                disabled={filters.page <= 1}
                                onClick={() => setPage(filters.page - 1)}
                                className="
                  flex items-center gap-2
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:border-sky-300
                  hover:bg-sky-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            <button
                                disabled={filters.page >= pages}
                                onClick={() => setPage(filters.page + 1)}
                                className="
                  flex items-center gap-2
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:border-sky-300
                  hover:bg-sky-50
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>

                        </div>

                    </div>
                </>
            )}
        </div>
    );
}