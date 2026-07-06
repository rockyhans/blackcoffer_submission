import { FILTER_FIELDS } from "../constants/filterFields.js";

const NUMBER_FIELDS = [
  "end_year",
  "start_year",
  "intensity",
  "likelihood",
  "relevance",
  "impact",
];

const buildFilter = (query) => {
  const filter = {};

  FILTER_FIELDS.forEach((field) => {
    const value = query[field];

    if (value === undefined || value === null || value === "") return;

    if (NUMBER_FIELDS.includes(field)) {
      const numberValue = Number(value);

      if (!Number.isNaN(numberValue)) {
        filter[field] = numberValue;
      }
    } else {
      filter[field] = value.trim();
    }
  });

  return filter;
};

export default buildFilter;