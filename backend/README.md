# Backend Documentation – MERN Dashboard Assignment

## Tech Stack

* **Node.js** – JavaScript Runtime
* **Express.js** – Backend Framework
* **MongoDB** – NoSQL Database
* **Mongoose** – ODM (Object Data Modeling)
* **dotenv** – Environment Variable Management
* **cors** – Cross-Origin Resource Sharing
* **nodemon** – Development Server

---

# Project Structure

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

# Backend Flow

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

# 1. Database Connection

**File**

```text
src/config/db.js
```

### Purpose

* Connects Node.js with MongoDB.
* Uses the MongoDB connection string from `.env`.
* Initializes the database before the server starts.

---

# 2. Data Model

**File**

```text
src/models/Data.js
```

### Purpose

Defines the MongoDB schema using Mongoose.

The schema exactly matches the fields in `jsondata.json`.

Fields:

```text
end_year
intensity
sector
topic
insight
url
region
start_year
impact
added
published
country
relevance
pestle
source
title
likelihood
city
```

### Why?

Mongoose validates the document structure before storing it in MongoDB.

---

# 3. Seed Script

**File**

```text
seed.js
```

### Purpose

Imports the provided JSON dataset into MongoDB.

### Steps

1. Connect to MongoDB.
2. Read `jsondata.json`.
3. Remove old records.
4. Insert new records.
5. Close database connection.

### Why?

The dataset is static, so reseeding ensures no duplicate records are created during development.

---

# 4. Express Server

**File**

```text
server.js
```

### Responsibilities

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

# 5. Constants

**File**

```text
src/constants/filterFields.js
```

### Purpose

Stores every field that is allowed to be used as a filter.

Example:

```text
end_year
start_year
topic
sector
region
country
city
pestle
source
likelihood
relevance
impact
intensity
```

### Why?

Instead of repeating the same array in multiple files, the application imports it wherever required.

Benefits:

* Single Source of Truth
* Easy Maintenance
* Cleaner Code

---

# 6. Utility

**File**

```text
src/utils/buildFilter.js
```

### Purpose

Builds the MongoDB query object dynamically.

Responsibilities:

* Reads query parameters.
* Allows only valid filter fields.
* Ignores empty values.
* Converts numeric values into numbers.

Example Request

```http
GET /api/data?country=India&end_year=2025
```

Generated MongoDB Filter

```javascript
{
    country: "India",
    end_year: 2025
}
```

### Why?

Keeps filtering logic separate from the controller.

The controller should only handle requests and responses.

---

# 7. Controller

**File**

```text
src/controllers/data.controller.js
```

Contains three controller functions.

---

## getAllData()

### Endpoint

```http
GET /api/data
```

### Responsibilities

* Build MongoDB filter.
* Search records.
* Pagination.
* Sorting.
* Field Selection.
* Text Search.
* Return JSON response.

---

### Features

#### Dynamic Filtering

Supports

```text
country
city
sector
topic
region
pestle
source
end_year
start_year
likelihood
impact
relevance
intensity
```

Example

```http
GET /api/data?country=India&topic=oil
```

MongoDB Query

```javascript
{
    country: "India",
    topic: "oil"
}
```

---

#### Pagination

Supports

```http
?page=1&limit=20
```

Purpose

Instead of sending all records, only a subset is returned.

Benefits

* Faster response
* Better frontend performance
* Reduced network usage

---

#### Sorting

Supports

Ascending

```http
?sort=country
```

Descending

```http
?sort=-country
```

---

#### Field Selection

Supports

```http
?fields=country,topic,intensity
```

Instead of returning the complete document,

Only

```text
country
topic
intensity
```

are returned.

Benefits

* Smaller response
* Better frontend performance

---

#### Search

Supports

```http
?search=oil
```

Searches inside

* title
* topic
* insight

using a case-insensitive regular expression.

---

## getFilters()

### Endpoint

```http
GET /api/data/filters
```

### Purpose

Returns every unique value available for each filter.

Uses

```javascript
Data.distinct()
```

Example Response

```json
{
    "country":[...],
    "topic":[...],
    "sector":[...]
}
```

### Improvements

* Removes empty values.
* Removes null values.
* Sorts values alphabetically or numerically.

### Why?

Allows frontend dropdowns to be generated dynamically.

No hardcoded options are required.

---

## getStats()

### Endpoint

```http
GET /api/data/stats
```

### Purpose

Returns summary statistics.

Example

```json
{
    "totalDocuments":1000,
    "totalCountries":55,
    "totalTopics":32,
    "totalRegions":8,
    "totalSectors":15
}
```

Useful for dashboard summary cards.

---

# 8. Routes

**File**

```text
src/routes/data.routes.js
```

Purpose

Maps HTTP requests to controller functions.

Routes

```text
GET /api/data
```

Returns dashboard data.

---

```text
GET /api/data/filters
```

Returns all filter values.

---

```text
GET /api/data/stats
```

Returns dashboard statistics.

---

# 9. Health Endpoint

### Endpoint

```http
GET /health
```

Response

```json
{
    "success": true,
    "message": "Server is running"
}
```

Purpose

Checks whether the backend server is running correctly.

---

# 10. 404 Handler

If an unknown route is requested

Example

```http
GET /api/xyz
```

Response

```json
{
    "success":false,
    "message":"Route not found"
}
```

---

# Request Lifecycle

Example Request

```http
GET /api/data?country=India&page=1&limit=20
```

Execution Flow

```text
Request
    │
    ▼
server.js
    │
    ▼
data.routes.js
    │
    ▼
getAllData()
    │
    ▼
buildFilter()
    │
    ▼
MongoDB Query
    │
    ▼
Mongoose
    │
    ▼
JSON Response
```

---

# API Endpoints

## Health

```http
GET /health
```

---

## Dashboard Data

```http
GET /api/data
```

Supports Query Parameters

```text
page
limit
sort
fields
search
country
city
sector
topic
region
source
pestle
end_year
start_year
impact
likelihood
relevance
intensity
```

Example

```http
GET /api/data?country=India&topic=oil&page=1&limit=20&sort=-relevance
```

---

## Filter Values

```http
GET /api/data/filters
```

Returns unique values for all filter fields.

---

## Dashboard Statistics

```http
GET /api/data/stats
```

Returns summary information for the dataset.

---

# Improvements Implemented

* MongoDB integration using Mongoose.
* Dynamic filtering using query parameters.
* Centralized filter field management.
* Reusable filter builder utility.
* Automatic type conversion for numeric fields.
* Pagination support.
* Sorting support.
* Field selection support.
* Search functionality.
* Dynamic filter endpoint.
* Dashboard statistics endpoint.
* Health check endpoint.
* 404 route handling.
* Environment variable management.
* Modular folder structure.
* Separation of concerns using Config, Model, Controller, Route, Constants, and Utility layers.

---

# Backend Architecture Summary

```text
Client
   │
   ▼
Express Server
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Utilities
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
   │
   ▼
Response
```

This architecture follows a modular Express.js structure where each layer has a single responsibility, making the backend easier to maintain, extend, and test.
