export function avgIntensityBySector(data, topN = 10) {
  const map = {};
  data.forEach((d) => {
    if (!d.sector) return;
    if (!map[d.sector]) map[d.sector] = { sum: 0, count: 0 };
    map[d.sector].sum += d.intensity || 0;
    map[d.sector].count += 1;
  });
  return Object.entries(map)
    .map(([sector, { sum, count }]) => ({ sector, avg: +(sum / count).toFixed(2) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, topN);
}

export function likelihoodByYear(data) {
  const map = {};
  data.forEach((d) => {
    const year = d.end_year || d.start_year;
    if (!year) return;
    if (!map[year]) map[year] = { sum: 0, count: 0 };
    map[year].sum += d.likelihood || 0;
    map[year].count += 1;
  });
  return Object.entries(map)
    .map(([year, { sum, count }]) => ({ year, avg: +(sum / count).toFixed(2) }))
    .sort((a, b) => String(a.year).localeCompare(String(b.year)));
}

export function topicDistribution(data, topN = 7) {
  const map = {};
  data.forEach((d) => {
    if (!d.topic) return;
    map[d.topic] = (map[d.topic] || 0) + 1;
  });
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN).map(([topic, count]) => ({ topic, count }));
  const restTotal = sorted.slice(topN).reduce((sum, [, c]) => sum + c, 0);
  if (restTotal > 0) top.push({ topic: "Other", count: restTotal });
  return top;
}

export function avgRelevanceByRegion(data) {
  const map = {};
  data.forEach((d) => {
    if (!d.region) return;
    if (!map[d.region]) map[d.region] = { sum: 0, count: 0 };
    map[d.region].sum += d.relevance || 0;
    map[d.region].count += 1;
  });
  return Object.entries(map)
    .map(([region, { sum, count }]) => ({ region, avg: +(sum / count).toFixed(2) }))
    .sort((a, b) => b.avg - a.avg);
}

export function recordsByCountry(data, topN = 10) {
  const map = {};
  data.forEach((d) => {
    if (!d.country) return;
    map[d.country] = (map[d.country] || 0) + 1;
  });
  return Object.entries(map)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export function intensityLikelihoodPoints(data) {
  return data
    .filter((d) => d.intensity != null && d.likelihood != null)
    .map((d) => ({
      x: d.intensity,
      y: d.likelihood,
      r: Math.max(4, (d.relevance || 1) * 2),
    }));
}