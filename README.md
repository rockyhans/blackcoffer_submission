# Blackcoffer Visualization Dashboard — Submission Documentation

## Submission Details

| Item | Link |
|---|---|
| GitHub Repository | [blackcoffer_submission](https://github.com/rockyhans/blackcoffer_submission) |
| Live Frontend (Deployed) | [View Frontend](https://blackcoffer-submission-6fyaia3ty.vercel.app/) |
| Live Backend / API (Deployed) | [View Backend](https://blackcoffer-submission.onrender.com/) |

**Submitted by:** Danish Rizwan
**Stack Used:** MERN (MongoDB, Express.js, React + Vite, Node.js)

---

## Assignment Objective

Build a data visualization dashboard using the provided `jsondata.json` dataset, with:

* Data stored in MongoDB
* A Node.js/Express API serving filtered, paginated data
* A React dashboard with interactive charts and filters covering Intensity, Likelihood, Relevance, Year, Country, Topics, Region, and City

---

## Overall Architecture

```text
                ┌─────────────────────┐
                │   jsondata.json      │
                └──────────┬──────────┘
                           │  seed.js
                           ▼
                ┌─────────────────────┐
                │      MongoDB         │
                └──────────┬──────────┘
                           │  Mongoose
                           ▼
                ┌─────────────────────┐
                │  Express Backend     │
                │  (Routes/Controllers)│
                └──────────┬──────────┘
                           │  REST API (JSON)
                           ▼
                ┌─────────────────────┐
                │   React Frontend     │
                │ (Vite + Chart.js)    │
                └─────────────────────┘
```

---

# PART 1 — Backend Documentation

## Tech Stack

* **Node.js** – JavaScript Runtime
* **Express.js** – Backend Framework
* **MongoDB** – NoSQL Database
* **Mongoose** – ODM (Object Data Modeling)
* **dotenv** – Environment Variable Management
* **cors** – Cross-Origin Resource Sharing
* **nodemon** – Development Server

---

## Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── constants/
│   │   └── filterFields.js
│   │
│   ├── controllers/
│   │   └── data.controller.js
│   │
│   ├── models/
│   │   └── Data.js
│   │
│   ├── routes/
│   │   └── data.routes.js
│   │
│   └── utils/
│       └── buildFilter.js
│
├── jsondata.json
├── seed.js
├── server.js
├── .env
├── package.json
└── .gitignore
```

---

## Backend Flow

```text
Frontend
    │
    ▼
HTTP Request
    │
    ▼
server.js
    │
    ▼
Routes
    │
    ▼
Controller
    │
    ▼
Utility (buildFilter)
    │
    ▼
Mongoose Model
    │
    ▼
MongoDB
    │
    ▼
JSON Response
```

---

## 1. Database Connection

**File:** `src/config/db.js`

* Connects Node.js with MongoDB.
* Uses the MongoDB connection string from `.env`.
* Initializes the database before the server starts.

---

## 2. Data Model

**File:** `src/models/Data.js`

Defines the MongoDB schema using Mongoose, matching every field in `jsondata.json`:

```text
end_year, intensity, sector, topic, insight, url, region, start_year,
impact, added, published, country, relevance, pestle, source, title,
likelihood, city
```

Mongoose validates the document structure before storing it in MongoDB.

---

## 3. Seed Script

**File:** `seed.js`

**Steps:**
1. Connect to MongoDB.
2. Read `jsondata.json`.
3. Remove old records.
4. Insert new records.
5. Close database connection.

Reseeding ensures no duplicate records are created during development.

---

## 4. Express Server

**File:** `server.js`

**Responsibilities:**
* Loads environment variables.
* Connects to MongoDB.
* Initializes Express.
* Enables CORS.
* Parses JSON request bodies.
* Registers application routes.
* Exposes the Health API.
* Handles unknown routes.
* Starts the server.

---

## 5. Constants

**File:** `src/constants/filterFields.js`

Stores every field allowed to be used as a filter (`end_year, start_year, topic, sector, region, country, city, pestle, source, likelihood, relevance, impact, intensity`) as a single source of truth, imported wherever needed instead of repeated arrays.

---

## 6. Utility — buildFilter

**File:** `src/utils/buildFilter.js`

Builds the MongoDB query object dynamically:
* Reads query parameters.
* Allows only valid filter fields.
* Ignores empty values.
* Converts numeric values into numbers.

**Example**

```http
GET /api/data?country=India&end_year=2025
```

```javascript
{ country: "India", end_year: 2025 }
```

Keeps filtering logic separate from the controller.

---

## 7. Controller

**File:** `src/controllers/data.controller.js`

### getAllData() — `GET /api/data`
Dynamic filtering, pagination (`page`, `limit`), sorting (`sort`, `-sort`), field selection (`fields`), and case-insensitive search (`search`) across `title`, `topic`, `insight`.

### getFilters() — `GET /api/data/filters`
Returns every unique value per filter field via `Data.distinct()`, with empty/null values removed and values sorted — powers dynamic frontend dropdowns.

### getStats() — `GET /api/data/stats`
Returns summary counts (`totalDocuments`, `totalCountries`, `totalTopics`, `totalRegions`, `totalSectors`) for dashboard summary cards.

---

## 8. Routes

**File:** `src/routes/data.routes.js`

```text
GET /api/data           → dashboard data
GET /api/data/filters    → all filter values
GET /api/data/stats      → dashboard statistics
```

---

## 9. Health Endpoint

```http
GET /health
```
```json
{ "success": true, "message": "Server is running" }
```

---

## 10. 404 Handler

```http
GET /api/xyz
```
```json
{ "success": false, "message": "Route not found" }
```

---

## Backend API Reference

```http
GET /api/data?country=India&topic=oil&page=1&limit=20&sort=-relevance
GET /api/data/filters
GET /api/data/stats
GET /health
```

---

## Backend Improvements Implemented

* MongoDB integration using Mongoose.
* Dynamic filtering using query parameters.
* Centralized filter field management.
* Reusable filter builder utility.
* Automatic type conversion for numeric fields.
* Pagination, sorting, field selection, and search support.
* Dynamic filter and statistics endpoints.
* Health check and 404 route handling.
* Modular folder structure with clear separation of concerns.

---

# PART 2 — Frontend Documentation

## Tech Stack

* **React (Vite)** – UI Library / Build Tool
* **Tailwind CSS** – Utility-first Styling
* **Chart.js + react-chartjs-2** – Data Visualization
* **Axios** – HTTP Client
* **React Context + useReducer** – Global Filter State Management
* **lucide-react** – Icon Library

---

## Project Structure

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

## Frontend Flow

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

## 1. API Layer

**File:** `src/api/axios.js`

Single pre-configured Axios instance reading the backend base URL from `.env` (`VITE_API_BASE_URL`), used by every hook instead of raw `fetch`.

---

## 2. Global Filter State

**File:** `src/context/FilterContext.jsx`

Single source of truth for every filter, search term, sort order, and pagination value, managed via `useReducer` (not scattered `useState`) so that changing any filter reliably resets pagination to page 1.

**State Shape:**
```text
country, city, sector, topic, region, pestle, source,
end_year, start_year, search, page, limit, sort
```

**Actions:** `SET_FILTER`, `SET_SEARCH`, `SET_SORT`, `SET_PAGE`, `RESET`

**Exposed Hook:** `useFilters() → { filters, setFilter, setSearch, setSort, setPage, resetFilters }`

---

## 3. Custom Hooks

**Folder:** `src/hooks/`

| Hook | Endpoint | Purpose |
|---|---|---|
| `useDebounce` | — | Delays search input updates by 400ms |
| `useFilterOptions` | `GET /api/data/filters` | Populates dropdowns dynamically |
| `useStats` | `GET /api/data/stats` | Powers summary stat cards |
| `useChartData` | `GET /api/data?limit=1000` | Fetches full filtered dataset shared by all 6 charts |
| `useTableData` | `GET /api/data?page=&limit=10` | Fetches paginated records for the table |

Each hook owns its own `loading`/`error`/`data` state and cleans up on unmount to avoid race conditions.

---

## 4. Utilities

**Folder:** `src/utils/`

* `buildParams.js` — strips empty/null filter values before sending query params.
* `aggregations.js` — client-side grouping/averaging functions per chart: `avgIntensityBySector`, `likelihoodByYear`, `topicDistribution`, `avgRelevanceByRegion`, `recordsByCountry`, `intensityLikelihoodPoints`.

Client-side aggregation keeps the backend generic (filter/paginate only) while each chart computes exactly the shape it needs.

---

## 5. Common Components

**Folder:** `src/components/common/`

`Spinner.jsx`, `ErrorState.jsx`, `EmptyState.jsx` — a consistent loading → error → empty → content pattern reused across Stats, Charts, and Table.

---

## 6. Layout Components

**Folder:** `src/components/layout/`

* `Sidebar.jsx` — dynamic filter dropdowns (End Year, Start Year, Topic, Sector, Region, PEST, Source, Country, City) + Reset button, collapses to an off-canvas drawer on mobile.
* `Topbar.jsx` — debounced global search + mobile menu toggle.
* `DashboardLayout.jsx` — combines Sidebar + Topbar + main content into a responsive shell.

---

## 7. Stats Row

**File:** `src/components/stats/StatsRow.jsx`

Displays 5 summary cards (Total Records, Countries, Topics, Regions, Sectors) sourced from `useStats()`.

---

## 8. Charts

**Folder:** `src/components/charts/`

All charts share `ChartCard.jsx` for consistent loading/error/empty handling.

| Component | Chart Type | Insight |
|---|---|---|
| IntensityBySectorChart | Bar | Average intensity per sector (top 10) |
| LikelihoodByYearChart | Line | Average likelihood trend across years |
| TopicDistributionChart | Doughnut | Share of records per topic (top 7 + Other) |
| RelevanceByRegionChart | Horizontal Bar | Average relevance per region |
| RecordsByCountryChart | Bar | Record volume per country (top 10) |
| IntensityLikelihoodScatter | Scatter/Bubble | Intensity vs Likelihood, bubble size = relevance |

---

## 9. Data Table

**File:** `src/components/table/DataTable.jsx`

Paginated, sortable table of raw records (Title, Sector, Topic, Country, Region, Intensity, Likelihood, Relevance), synced with global filter state via `useTableData`.

---

## 10. App Composition

**File:** `src/App.jsx`

Wraps the dashboard in `FilterProvider`, calls `useChartData(filters)` once and shares the result across all 6 charts (avoiding duplicate requests), and renders `StatsRow`, the chart grid, and `DataTable`.

---

## 11. Entry Point

**File:** `src/main.jsx`

Registers all required Chart.js elements/scales once (`chartSetup.js`) and mounts `<App />` inside `StrictMode`.

---

## Frontend State Management Summary

```text
Global State   → FilterContext (useReducer): filters, search, sort, page
Server State   → Custom hooks: useChartData, useTableData, useFilterOptions, useStats
Local UI State → useState: Sidebar open/close, Topbar search input value
```

---

## Frontend Improvements Implemented

* Centralized Axios instance with environment-based configuration.
* Global filter state via Context + `useReducer` (single source of truth, automatic pagination reset).
* Debounced search to reduce redundant API calls.
* Dynamic filter dropdowns populated from the backend — zero hardcoded options.
* Shared chart dataset fetch reused across 6 visualizations instead of duplicated requests.
* Separate paginated fetch for the records table, decoupled from chart data.
* Consistent loading / error / empty UI pattern across every data-driven component.
* Client-side aggregation layer decoupled from rendering.
* Sortable, paginated data table synced with global filter state.
* Fully responsive layout (collapsible sidebar drawer on mobile).
* Modular component structure: common, layout, stats, charts, table.

---

# End-to-End Architecture Summary

```text
jsondata.json
   │  (seed.js)
   ▼
MongoDB
   │  (Mongoose)
   ▼
Express Backend (Routes → Controllers → buildFilter → Model)
   │  (REST JSON API)
   ▼
Axios Instance (frontend)
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
Chart.js Rendered Dashboard
```

Each layer — database, API, state, data-fetching, aggregation, and presentation — has a single, well-defined responsibility, making the project maintainable and easy to extend with new filters, endpoints, or chart types.

---

## How to Run Locally

**Backend**
```bash
cd backend
npm install
npm run dev   # starts on the port defined in .env
```

**Frontend**
```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

Ensure `VITE_API_BASE_URL` in the frontend `.env` matches the backend's running URL, and that CORS is enabled on the backend for the frontend's origin.
