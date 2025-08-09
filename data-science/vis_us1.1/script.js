const MARGIN = { top: 48, right: 24, bottom: 64, left: 90 };

const container = d3.select("#chart");
const svg = container.append("svg");
const g = svg.append("g");
const gx = g.append("g").attr("class", "x-axis");
const gy = g.append("g").attr("class", "y-axis");
const gContent = g.append("g").attr("class", "content");
const gTitle = g.append("text").attr("class", "title").attr("x", 0).attr("y", -14);
const xLabel = g.append("text").attr("class", "axis-label");
const yLabel = g.append("text").attr("class", "axis-label");
const tooltip = d3.select("#tooltip");

const fmt = d3.format(",");
const fmtPct = d3.format(".1f");

function size() {
  const width = container.node().clientWidth || 800;
  const height = 460;
  svg.attr("width", width).attr("height", height);
  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  g.attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
  return { innerW, innerH, width, height };
}

function getScales(data, innerW, innerH, kind) {
  const years = [...new Set(data.map(d => d.year))].sort((a,b) => a - b);

  const xBand = d3.scaleBand().domain(years).range([0, innerW]).padding(0.2);
  const xPoint = d3.scalePoint().domain(years).range([0, innerW]).padding(0.5);

  const maxY = d3.max(data, d => d.value) || 0;
  const y = d3.scaleLinear()
    .domain([0, maxY]).nice()
    .range([innerH, 0]);

  const yGrowth = d3.scaleLinear()
    .domain([d3.min(data, d => d.growth ?? 0) ?? 0, d3.max(data, d => d.growth ?? 0) ?? 0]).nice()
    .range([innerH, 0]);

  return { xBand, xPoint, y, yGrowth };
}

function titleText(group, viz) {
  const vizName = viz === "bar" ? "Number car ownerships" : "Vehicle growth trend (% change vs prev year)";
  return `Victoria — ${vizName} — ${group}`;
}

// compute % growth vs previous year, per year array sorted asc
function computeGrowth(rows) {
  const sorted = [...rows].sort((a,b) => a.year - b.year);
  for (let i = 0; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (!prev) { curr.growth = null; continue; }
    curr.growth = prev.value === 0 ? null : ((curr.value - prev.value) / prev.value) * 100;
  }
  return sorted;
}

function filterData(raw, group) {
  const rows = group === "All types"
    ? raw.filter(d => d.vehicle_group === "All types")
    : raw.filter(d => d.vehicle_group === group);

  const byYear = d3.rollups(
    rows,
    v => d3.sum(v, d => d.value),
    d => d.year
  ).map(([year, value]) => ({ year, value }));

  byYear.sort((a,b) => a.year - b.year);
  return computeGrowth(byYear); // add .growth
}

function renderAxes(scales, innerH, viz) {
  gx.attr("transform", `translate(0,${innerH})`)
    .call(d3.axisBottom(scales.xBand).tickFormat(d3.format("d")));

  if (viz === "bar") {
    gy.call(d3.axisLeft(scales.y).ticks(6).tickFormat(fmt));
  } else {
    gy.call(d3.axisLeft(scales.yGrowth).ticks(6).tickFormat(d => `${fmtPct(d)}%`));
  }
}

function renderBars(data, scales, innerH) {
  const bars = gContent.selectAll("rect.bar").data(data, d => d.year);

  bars.exit()
    .transition().duration(200)
    .attr("y", innerH)
    .attr("height", 0)
    .remove();

  bars.transition().duration(400)
    .attr("x", d => scales.xBand(d.year))
    .attr("width", scales.xBand.bandwidth())
    .attr("y", d => scales.y(d.value))
    .attr("height", d => innerH - scales.y(d.value));

  const enter = bars.enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => scales.xBand(d.year))
    .attr("width", scales.xBand.bandwidth())
    .attr("y", innerH)
    .attr("height", 0)
    .on("mousemove", (event, d) => showTip(event, `${d.year}<br><b>${fmt(d.value)}</b> vehicles`))
    .on("mouseleave", hideTip);

  enter.transition().duration(400)
    .attr("y", d => scales.y(d.value))
    .attr("height", d => innerH - scales.y(d.value));
}

function renderLine(data, scales) {
  const line = d3.line()
    .x(d => scales.xPoint(d.year))
    .y(d => scales.yGrowth(d.growth));

  const path = gContent.selectAll("path.line").data([data]);
  path.enter().append("path")
      .attr("class", "line")
    .merge(path)
      .attr("d", line);
  path.exit().remove();

  const pts = gContent.selectAll("circle.pt").data(data, d => d.year);
  pts.exit().remove();

  pts.enter().append("circle")
      .attr("class", "pt")
      .attr("r", 4)
      .on("mousemove", (event, d) => showTip(event, `${d.year}<br><b>${fmtPct(d.growth)}%</b>`))
      .on("mouseleave", hideTip)
    .merge(pts)
      .attr("cx", d => scales.xPoint(d.year))
      .attr("cy", d => scales.yGrowth(d.growth));
}

function renderChart(raw, group, viz) {
  const { innerW, innerH } = size();
  gContent.selectAll("*").remove();

  const data = filterData(raw, group);
  const baseScales = getScales(data, innerW, innerH, viz);

  // axes + labels titles
  gTitle.text(titleText(group, viz));
  xLabel
    .attr("x", innerW / 2)
    .attr("y", innerH + 44)
    .attr("text-anchor", "middle")
    .text("Year");
  yLabel
    .attr("transform", `rotate(-90)`)
    .attr("x", -innerH / 2)
    .attr("y", -MARGIN.left + 16)
    .attr("text-anchor", "middle")
    .text(viz === "bar" ? "Number of Vehicles" : "% Growth");

  if (viz === "bar") {
    renderAxes(baseScales, innerH, "bar");
    renderBars(data, baseScales, innerH);
  } else {
    // filter out 2021 and null growth BEFORE building the scales
    const growthData = data.filter(d => d.growth != null && d.year >= 2022);

    // build scales from the filtered domain so the x‑axis only has 2022–2024
    const growthScales = getScales(growthData, innerW, innerH, "line");

    // axes: x uses point scale for line; y uses growth scale inside renderAxes if you use it
    gx.attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(growthScales.xPoint).tickFormat(d3.format("d")));
    gy.call(d3.axisLeft(growthScales.yGrowth).ticks(6).tickFormat(d => `${fmtPct(d)}%`));

    renderLine(growthData, growthScales);
  }
}

function showTip(event, html) {
  const [mx, my] = d3.pointer(event, container.node());
  tooltip
    .style("left", `${mx}px`)
    .style("top", `${my - 10}px`)
    .style("opacity", 1)
    .html(html);
}

function hideTip() {
  tooltip.style("opacity", 0);
}

function attachHandlers(data) {
  const vizSel = d3.select("#vizType");
  const grpSel = d3.select("#vehicleGroup");

  function redraw() {
    renderChart(
      data,
      grpSel.node().value,
      vizSel.node().value
    );
  }

  vizSel.on("change", redraw);
  grpSel.on("change", redraw);
  d3.select(window).on("resize", redraw);

  redraw();
}

d3.csv("vehicle_ownership.csv", d3.autoType).then(raw => {
  raw.forEach(d => {
    d.year = +d.year;
    d.value = +d.value;
  });

  const groups = Array.from(new Set(raw.map(d => d.vehicle_group))).sort();
  const sel = d3.select("#vehicleGroup");
  groups.forEach(g => sel.append("option").attr("value", g).text(g));

  d3.select("#vizType").property("value", "bar");
  d3.select("#vehicleGroup").property("value", groups.includes("All types") ? "All types" : groups[0]);

  attachHandlers(raw);
});
