export function buildParams(filters, overrides = {}) {
  const merged = { ...filters, ...overrides };
  const params = {};
  Object.entries(merged).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
}