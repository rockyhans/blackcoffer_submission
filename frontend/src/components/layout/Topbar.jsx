import { useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";
import { Search, Menu, BarChart3 } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const { setSearch } = useFilters();
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 400);

  useEffect(() => {
    setSearch(debounced);
  }, [debounced]);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-3">
      <button onClick={onMenuClick} className="lg:hidden bg-gray-50 p-2 rounded ">
        <Menu className="h-5 w-5 text-gray-500" />
      </button>

      <div className="relative ml-auto w-full max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search title, topic, insight..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
    </header>
  );
}