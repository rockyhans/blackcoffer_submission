# Frontend Documentation – MERN Dashboard Assignment

## Tech Stack

* **React (Vite)** – UI Library / Build Tool
* **Tailwind CSS** – Utility-first Styling
* **Chart.js + react-chartjs-2** – Data Visualization
* **Axios** – HTTP Client
* **React Context + useReducer** – Global Filter State Management
* **lucide-react** – Icon Library

---

# Project Structure

```text
frontend/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── chartSetup.js
│   │
│   ├── context/
│   │   └── FilterContext.jsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useFilterOptions.js
│   │   ├── useStats.js
│   │   ├── useChartData.js
│   │   └── useTableData.js
│   │
│   ├── utils/
│   │   ├── buildParams.js
│   │   └── aggregations.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Spinner.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── stats/
│   │   │   └── StatsRow.jsx
│   │   │
│   │   ├── charts/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── IntensityBySectorChart.jsx
│   │   │   ├── LikelihoodByYearChart.jsx
│   │   │   ├── TopicDistributionChart.jsx
│   │   │   ├── RelevanceByRegionChart.jsx
│   │   │   ├── RecordsByCountryChart.jsx
│   │   │   └── IntensityLikelihoodScatter.jsx
│   │   │
│   │   └── table/
│   │       └── DataTable.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── .env
├── package.json
└── vite.config.js
```

---

# Frontend Flow

```text
Backend API
    │
    ▼
axios.js
    │
    ▼
Custom Hooks (useChartData / useTableData / useFilterOptions / useStats)
    │
    ▼
FilterContext (global state)
    │
    ▼
Components (Sidebar, Charts, DataTable, StatsRow)
    │
    ▼
Aggregation Utils (client-side grouping/math)
    │
    ▼
Chart.js Render
    │
    ▼
UI (Dashboard)
```

---

# 1. API Layer

**File**

```text
src/api/axios.js
```

### Purpose

* Creates a single, pre-configured Axios instance.
* Reads the backend base URL from `.env` (`VITE_API_BASE_URL`).
* Sets a request timeout.
* Used by every hook instead of raw `fetch`, so the base URL and config live in one place.

---

# 2. Global Filter State

**File**

```text
src/context/FilterContext.jsx
```

### Purpose

Single source of truth for every filter, search term, sort order, and pagination value used across the dashboard.

### Why `useReducer` instead of multiple `useState`?

* All filter fields are related — changing one should reliably reset pagination.
* A reducer keeps that rule (`page: 1` on filter change) in one place instead of repeating it in every `onChange` handler.
* Prevents state drift between components that read/write filters.

### State Shape

```text
country, city, sector, topic, region, pestle, source,
end_year, start_year, search, page, limit, sort
```

### Actions

```text
SET_FILTER   → updates one field, resets page to 1
SET_SEARCH   → updates search term, resets page to 1
SET_SORT     → updates sort field, resets page to 1
SET_PAGE     → updates page only
RESET        → restores initial state
```

### Exposed Hook

```text
useFilters() → { filters, setFilter, setSearch, setSort, setPage, resetFilters }
```

Any component that needs filters (Sidebar, Topbar, Charts, Table) consumes this hook directly — no prop drilling.

---

# 3. Custom Hooks

**Folder**

```text
src/hooks/
```

Each hook owns exactly one responsibility: fetch data, manage its own `loading`/`error`/`data` state, and clean up on unmount.

---

## useDebounce.js

### Purpose

Delays updating a value until the user stops typing (400ms).

### Used By

Topbar search input — prevents an API call on every keystroke.

---

## useFilterOptions.js

### Endpoint Used

```http
GET /api/data/filters
```

### Purpose

* Fetches all unique dropdown values once on mount.
* Powers every filter dropdown in the Sidebar dynamically — no hardcoded options.

### Returns

```text
{ options, loading, error }
```

---

## useStats.js

### Endpoint Used

```http
GET /api/data/stats
```

### Purpose

Fetches summary numbers once on mount for the top stats cards (total records, countries, topics, regions, sectors).

### Returns

```text
{ stats, loading, error }
```

---

## useChartData.js

### Endpoint Used

```http
GET /api/data?limit=1000&page=1&<active filters>
```

### Purpose

* Fetches the **entire filtered dataset** (not paginated) so charts can aggregate accurately client-side.
* Re-fetches automatically whenever any filter, region, sector, topic, country, city, pestle, source, year, or search value changes.
* Shared by all 6 charts — one fetch, six visualizations, instead of 6 separate network calls.

### Returns

```text
{ data, loading, error }
```

---

## useTableData.js

### Endpoint Used

```http
GET /api/data?page=<n>&limit=10&sort=<field>&<active filters>
```

### Purpose

* Powers the paginated Records table separately from the charts.
* Re-fetches when filters, sort, or page changes.

### Returns

```text
{ data, total, pages, loading, error }
```

---

# 4. Utilities

**Folder**

```text
src/utils/
```

---

## buildParams.js

### Purpose

Strips empty, null, or undefined filter values before sending them as query params, so the backend never receives junk like `country=""`.

---

## aggregations.js

### Purpose

Performs all client-side data shaping for charts, since the API returns raw filtered records and each chart needs a different grouping.

### Functions

```text
avgIntensityBySector()        → groups by sector, averages intensity
likelihoodByYear()            → groups by end/start year, averages likelihood
topicDistribution()           → counts by topic, top 7 + "Other"
avgRelevanceByRegion()        → groups by region, averages relevance
recordsByCountry()            → counts records per country, top 10
intensityLikelihoodPoints()   → maps records to {x, y, r} for scatter/bubble
```

### Why client-side aggregation?

Keeps the backend API generic (just filtering/pagination) while allowing the frontend to compute exactly the shape each chart needs, without adding chart-specific endpoints.

---

# 5. Common Components

**Folder**

```text
src/components/common/
```

Reusable UI states used consistently across every data-driven component (Stats, Charts, Table).

```text
Spinner.jsx     → loading indicator
ErrorState.jsx  → error message + retry button
EmptyState.jsx  → "no data" placeholder
```

### Why?

Every component that fetches data follows the same three-state pattern: loading → error → empty → content. Centralizing these avoids repeating the same JSX everywhere.

---

# 6. Layout Components

**Folder**

```text
src/components/layout/
```

---

## Sidebar.jsx

### Purpose

* Renders one dropdown per filterable field (End Year, Start Year, Topic, Sector, Region, PEST, Source, Country, City).
* Dropdown options are populated dynamically via `useFilterOptions()`.
* Includes a Reset Filters button (dispatches `RESET`).
* Collapses into an off-canvas drawer on mobile.

---

## Topbar.jsx

### Purpose

* Houses the debounced global search input (title / topic / insight).
* Includes the mobile menu toggle for the Sidebar.

---

## DashboardLayout.jsx

### Purpose

Combines Sidebar + Topbar + main content area into a single responsive shell. Manages the mobile sidebar open/close state.

---

# 7. Stats Row

**File**

```text
src/components/stats/StatsRow.jsx
```

### Data Source

`useStats()`

### Purpose

Displays 5 summary cards: Total Records, Countries, Topics, Regions, Sectors — mirrors the backend's `getStats()` response.

---

# 8. Charts

**Folder**

```text
src/components/charts/
```

All charts share a common wrapper, `ChartCard.jsx`, which handles loading/error/empty states identically, so each chart component only needs to worry about its own aggregation and rendering.

| Component | Chart Type | Insight |
|---|---|---|
| IntensityBySectorChart | Bar | Average intensity per sector (top 10) |
| LikelihoodByYearChart | Line | Average likelihood trend across years |
| TopicDistributionChart | Doughnut | Share of records per topic (top 7 + Other) |
| RelevanceByRegionChart | Horizontal Bar | Average relevance per region |
| RecordsByCountryChart | Bar | Record volume per country (top 10) |
| IntensityLikelihoodScatter | Scatter/Bubble | Intensity vs Likelihood, bubble size = relevance |

### Data Flow Per Chart

```text
useChartData(filters) → data[]
        │
        ▼
aggregation function (utils/aggregations.js)
        │
        ▼
Chart.js dataset
        │
        ▼
ChartCard (loading / error / empty / render)
```

---

# 9. Data Table

**File**

```text
src/components/table/DataTable.jsx
```

### Data Source

`useTableData(filters)`

### Responsibilities

* Renders paginated raw records (Title, Sector, Topic, Country, Region, Intensity, Likelihood, Relevance).
* Column headers are clickable to toggle ascending/descending sort (updates `filters.sort` via `setSort()`).
* Prev/Next pagination controls tied to `filters.page` / `setPage()`.
* Shows total record count and current page/total pages.

---

# 10. App Composition

**File**

```text
src/App.jsx
```

### Responsibilities

* Wraps the entire dashboard in `FilterProvider`.
* Calls `useChartData(filters)` **once** and passes the resulting `data`/`loading`/`error` down to all 6 chart components — avoids 6 duplicate network requests for the same filtered dataset.
* Renders `StatsRow`, the chart grid, and `DataTable` inside `DashboardLayout`.

---

# 11. Entry Point

**File**

```text
src/main.jsx
```

### Responsibilities

* Registers all required Chart.js elements/scales once via `chartSetup.js` (`CategoryScale`, `LinearScale`, `BarElement`, `LineElement`, `PointElement`, `ArcElement`, `Tooltip`, `Legend`).
* Mounts `<App />` to the DOM inside `StrictMode`.

---

# Request Lifecycle Example (Chart Data)

```http
GET /api/data?limit=1000&page=1&country=India&topic=oil
```

```text
Filter change (Sidebar)
    │
    ▼
FilterContext dispatch (SET_FILTER)
    │
    ▼
useChartData hook re-fires (dependency changed)
    │
    ▼
axios.js → GET /api/data
    │
    ▼
Backend (buildFilter → Mongoose → MongoDB)
    │
    ▼
JSON response → setData()
    │
    ▼
Aggregation utils reshape data per chart
    │
    ▼
Chart.js re-renders
```

---

# State Management Summary

```text
Global State   → FilterContext (useReducer): filters, search, sort, page
Server State   → Custom hooks: useChartData, useTableData, useFilterOptions, useStats
Local UI State → useState: Sidebar open/close, Topbar search input value
```

### Why this split?

* **Filters** need to be shared across Sidebar, Topbar, Charts, and Table → Context.
* **Fetched data** is owned by whichever hook fetches it → not lifted into global state, avoiding unnecessary re-renders of unrelated components.
* **Purely visual state** (drawer open, input value before debounce) stays local to the component that needs it.

---

# Improvements Implemented

* Centralized Axios instance with environment-based configuration.
* Global filter state via Context + `useReducer` (single source of truth, automatic pagination reset).
* Debounced search to reduce redundant API calls.
* Dynamic filter dropdowns populated from the backend (`/api/data/filters`) — zero hardcoded options.
* Shared chart dataset fetch (`useChartData`) reused across 6 visualizations instead of duplicated requests.
* Separate paginated fetch (`useTableData`) for the records table, decoupled from chart data.
* Consistent loading / error / empty UI pattern across every data-driven component.
* Client-side aggregation layer decoupled from rendering (`utils/aggregations.js`).
* Sortable, paginated data table synced with global filter state.
* Fully responsive layout (collapsible sidebar drawer on mobile).
* Modular component structure: common, layout, stats, charts, table.

---

# Frontend Architecture Summary

```text
Backend API
   │
   ▼
Axios Instance
   │
   ▼
Custom Hooks (data fetching + local loading/error state)
   │
   ▼
Global Filter Context (useReducer)
   │
   ▼
Layout (Sidebar / Topbar / DashboardLayout)
   │
   ▼
Feature Components (StatsRow / Charts / DataTable)
   │
   ▼
Aggregation Utilities
   │
   ▼
Chart.js Rendered UI
```

This architecture mirrors the backend's separation of concerns — each layer (API access, state, data-fetching, aggregation, presentation) has a single responsibility, keeping the dashboard maintainable and easy to extend with new filters or chart types.