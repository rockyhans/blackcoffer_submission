import { createContext, useContext, useReducer, useMemo } from "react";

const FilterContext = createContext(null);

const initialState = {
  country: "",
  city: "",
  sector: "",
  topic: "",
  region: "",
  pestle: "",
  source: "",
  end_year: "",
  start_year: "",
  search: "",
  page: 1,
  limit: 10,
  sort: "-relevance",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FILTER":
      // any real filter change should reset pagination back to page 1
      return { ...state, [action.key]: action.value, page: 1 };
    case "SET_SEARCH":
      return { ...state, search: action.value, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.value, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.value };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      filters: state,
      setFilter: (key, value) => dispatch({ type: "SET_FILTER", key, value }),
      setSearch: (value) => dispatch({ type: "SET_SEARCH", value }),
      setSort: (value) => dispatch({ type: "SET_SORT", value }),
      setPage: (value) => dispatch({ type: "SET_PAGE", value }),
      resetFilters: () => dispatch({ type: "RESET" }),
    }),
    [state]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FilterProvider");
  return ctx;
}