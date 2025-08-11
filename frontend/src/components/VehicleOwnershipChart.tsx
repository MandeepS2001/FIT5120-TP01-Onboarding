import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface VehicleData {
  year: number;
  vehicle_type: string;
  value: number;
  vehicle_group: string;
}

interface ChartData {
  year: number;
  value: number;
  growth?: number | null;
}

const MARGIN = { top: 48, right: 24, bottom: 64, left: 90 };

const VehicleOwnershipChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [vizType, setVizType] = useState<'bar' | 'line'>('bar');
  const [vehicleGroup, setVehicleGroup] = useState<string>('All types');
  const [data, setData] = useState<VehicleData[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/vehicle_ownership.csv');
        const csvText = await response.text();
        const rawData = d3.csvParse(csvText, d3.autoType) as VehicleData[];
        
        // Convert year and value to numbers
        const processedData = rawData.map(d => ({
          ...d,
          year: +d.year,
          value: +d.value
        }));
        
        setData(processedData);
        
        // Extract unique vehicle groups
        const uniqueGroups = Array.from(new Set(processedData.map(d => d.vehicle_group))).sort();
        setGroups(uniqueGroups);
        
        // Set default vehicle group
        if (uniqueGroups.includes('All types')) {
          setVehicleGroup('All types');
        } else if (uniqueGroups.length > 0) {
          setVehicleGroup(uniqueGroups[0]);
        }
      } catch (error) {
        console.error('Error loading vehicle ownership data:', error);
      }
    };

    loadData();
  }, []);

  // Compute growth percentage
  const computeGrowth = (rows: ChartData[]): ChartData[] => {
    const sorted = [...rows].sort((a, b) => a.year - b.year);
    for (let i = 0; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (!prev) { 
        curr.growth = null; 
        continue; 
      }
      curr.growth = prev.value === 0 ? null : ((curr.value - prev.value) / prev.value) * 100;
    }
    return sorted;
  };

  // Filter data by vehicle group
  const filterData = (raw: VehicleData[], group: string): ChartData[] => {
    const rows = group === "All types"
      ? raw.filter(d => d.vehicle_group === "All types")
      : raw.filter(d => d.vehicle_group === group);

    const byYear = d3.rollups(
      rows,
      v => d3.sum(v, d => d.value),
      d => d.year
    ).map(([year, value]) => ({ year, value }));

    byYear.sort((a, b) => a.year - b.year);
    return computeGrowth(byYear);
  };

  // Render chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !tooltipRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const container = d3.select(containerRef.current);
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // Setup chart elements
    const g = svg.append("g");
    const gx = g.append("g").attr("class", "x-axis");
    const gy = g.append("g").attr("class", "y-axis");
    const gContent = g.append("g").attr("class", "content");
    const gTitle = g.append("text").attr("class", "title").attr("x", 0).attr("y", -14);
    const xLabel = g.append("text").attr("class", "axis-label");
    const yLabel = g.append("text").attr("class", "axis-label");

    const fmt = d3.format(",");
    const fmtPct = d3.format(".1f");

    // Size function
    const size = () => {
      const width = container.node()?.clientWidth || 800;
      const height = 460;
      svg.attr("width", width).attr("height", height);
      const innerW = width - MARGIN.left - MARGIN.right;
      const innerH = height - MARGIN.top - MARGIN.bottom;
      g.attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
      return { innerW, innerH, width, height };
    };

    // Get scales
    const getScales = (data: ChartData[], innerW: number, innerH: number, kind: string) => {
      const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b).map(String);

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
    };

    // Title text
    const titleText = (group: string, viz: string) => {
      const vizName = viz === "bar" ? "Number car ownerships" : "Vehicle growth trend (% change vs prev year)";
      return `Victoria — ${vizName} — ${group}`;
    };

    // Render axes
    const renderAxes = (scales: any, innerH: number, viz: string) => {
      gx.attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(scales.xBand).tickFormat((d: any) => d3.format("d")(d)));

      if (viz === "bar") {
        gy.call(d3.axisLeft(scales.y).ticks(6).tickFormat((d: any) => fmt(d)));
      } else {
        gy.call(d3.axisLeft(scales.yGrowth).ticks(6).tickFormat((d: any) => `${fmtPct(d)}%`));
      }
    };

    // Render bars
    const renderBars = (data: ChartData[], scales: any, innerH: number) => {
      const bars = gContent.selectAll("rect.bar").data(data, (d: any) => String(d.year));

      bars.exit()
        .transition().duration(200)
        .attr("y", innerH)
        .attr("height", 0)
        .remove();

      bars.transition().duration(400)
        .attr("x", (d: ChartData) => scales.xBand(String(d.year)))
        .attr("width", scales.xBand.bandwidth())
        .attr("y", (d: ChartData) => scales.y(d.value))
        .attr("height", (d: ChartData) => innerH - scales.y(d.value));

      const enter = bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d: ChartData) => scales.xBand(String(d.year)))
        .attr("width", scales.xBand.bandwidth())
        .attr("y", innerH)
        .attr("height", 0)
        .on("mousemove", (event: any, d: ChartData) => {
          const [mx, my] = d3.pointer(event, container.node());
          tooltip
            .style("left", `${mx}px`)
            .style("top", `${my - 10}px`)
            .style("opacity", 1)
            .html(`${d.year}<br><b>${fmt(d.value)}</b> vehicles`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      enter.transition().duration(400)
        .attr("y", (d: ChartData) => scales.y(d.value))
        .attr("height", (d: ChartData) => innerH - scales.y(d.value));
    };

    // Render line
    const renderLine = (data: ChartData[], scales: any) => {
      const line = d3.line<ChartData>()
        .x(d => scales.xPoint(String(d.year)))
        .y(d => scales.yGrowth(d.growth || 0));

      const path = gContent.selectAll("path.line").data([data]);
      path.enter().append("path")
        .attr("class", "line")
        .merge(path as any)
        .attr("d", line);
      path.exit().remove();

      const pts = gContent.selectAll("circle.pt").data(data, (d: any) => String(d.year));
      pts.exit().remove();

      pts.enter().append("circle")
        .attr("class", "pt")
        .attr("r", 4)
        .on("mousemove", (event: any, d: ChartData) => {
          const [mx, my] = d3.pointer(event, container.node());
          tooltip
            .style("left", `${mx}px`)
            .style("top", `${my - 10}px`)
            .style("opacity", 1)
            .html(`${d.year}<br><b>${fmtPct(d.growth || 0)}%</b>`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .merge(pts as any)
        .attr("cx", (d: ChartData) => scales.xPoint(String(d.year)))
        .attr("cy", (d: ChartData) => scales.yGrowth(d.growth || 0));
    };

    // Main render function
    const renderChart = () => {
      const { innerW, innerH } = size();
      gContent.selectAll("*").remove();

      const chartData = filterData(data, vehicleGroup);
      const baseScales = getScales(chartData, innerW, innerH, vizType);

      // Axes + labels titles
      gTitle.text(titleText(vehicleGroup, vizType));
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
        .text(vizType === "bar" ? "Number of Vehicles" : "% Growth");

      if (vizType === "bar") {
        renderAxes(baseScales, innerH, "bar");
        renderBars(chartData, baseScales, innerH);
      } else {
        // Filter out 2021 and null growth BEFORE building the scales
        const growthData = chartData.filter(d => d.growth != null && d.year >= 2022);

        // Build scales from the filtered domain so the x‑axis only has 2022–2024
        const growthScales = getScales(growthData, innerW, innerH, "line");

        // Axes: x uses point scale for line; y uses growth scale
        gx.attr("transform", `translate(0,${innerH})`)
          .call(d3.axisBottom(growthScales.xPoint).tickFormat((d: any) => d3.format("d")(d)));
        gy.call(d3.axisLeft(growthScales.yGrowth).ticks(6).tickFormat((d: any) => `${fmtPct(d)}%`));

        renderLine(growthData, growthScales);
      }
    };

    renderChart();

    // Handle resize
    const handleResize = () => renderChart();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, vizType, vehicleGroup, filterData]);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Ownership in Victoria (2021–2024)
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Visualization</InputLabel>
          <Select
            value={vizType}
            label="Visualization"
            onChange={(e) => setVizType(e.target.value as 'bar' | 'line')}
          >
            <MenuItem value="bar">Number car ownerships</MenuItem>
            <MenuItem value="line">Vehicle growth trend</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Vehicle Group</InputLabel>
          <Select
            value={vehicleGroup}
            label="Vehicle Group"
            onChange={(e) => setVehicleGroup(e.target.value)}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>{group}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box 
        ref={containerRef} 
        sx={{ 
          position: 'relative',
          '& svg': {
            width: '100%',
            height: '460px'
          },
          '& .bar': {
            fill: '#1976d2'
          },
          '& .line': {
            stroke: '#1976d2',
            fill: 'none',
            strokeWidth: 2
          },
          '& .pt': {
            fill: '#1976d2'
          },
          '& .x-axis text, .y-axis text': {
            fontSize: '12px'
          },
          '& .title': {
            fontWeight: 600,
            fontSize: '14px'
          },
          '& .axis-label': {
            fontSize: '12px',
            fill: '#333'
          }
        }}
      >
        <svg ref={svgRef}></svg>
        <Box
          ref={tooltipRef}
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: 1.3,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            opacity: 0,
            transition: 'opacity .15s ease'
          }}
        />
      </Box>
    </Paper>
  );
};

export default VehicleOwnershipChart;
