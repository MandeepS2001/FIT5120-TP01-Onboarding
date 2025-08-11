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
        
        console.log('Raw CSV data:', rawData);
        
        // Convert year and value to numbers
        const processedData = rawData.map(d => ({
          ...d,
          year: +d.year,
          value: +d.value
        }));
        
        console.log('Processed data:', processedData);
        setData(processedData);
        
        // Extract unique vehicle groups
        const uniqueGroups = Array.from(new Set(processedData.map(d => d.vehicle_group))).sort();
        console.log('Vehicle groups:', uniqueGroups);
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
      // Add grid lines
      const gridLines = gContent.selectAll("line.grid").data(viz === "bar" ? scales.y.ticks(6) : scales.yGrowth.ticks(6));
      gridLines.exit().remove();
      gridLines.enter().append("line")
        .attr("class", "grid")
        .merge(gridLines as any)
        .attr("x1", 0)
        .attr("x2", scales.xBand ? scales.xBand.range()[1] : scales.xPoint.range()[1])
        .attr("y1", (d: any) => viz === "bar" ? scales.y(d) : scales.yGrowth(d))
        .attr("y2", (d: any) => viz === "bar" ? scales.y(d) : scales.yGrowth(d));

      // Render axes with enhanced styling
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
      console.log('Rendering bars with data:', data);
      console.log('Scales:', scales);
      console.log('Inner height:', innerH);
      
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
        .attr("height", (d: ChartData) => innerH - scales.y(d.value))
        .attr("fill", "#3b82f6")
        .attr("stroke", "#1e40af");

      const enter = bars.enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "#3b82f6")
        .attr("stroke", "#1e40af")
        .attr("stroke-width", 1)
        .attr("rx", 4)
        .attr("ry", 4)
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
            .html(`
              <div style="font-weight: 600; margin-bottom: 4px;">${d.year}</div>
              <div style="font-size: 16px; font-weight: 700; color: #3b82f6;">${fmt(d.value)}</div>
              <div style="font-size: 11px; opacity: 0.8;">vehicles registered</div>
            `);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      enter.transition().duration(800)
        .delay((d: ChartData, i: number) => i * 100)
        .ease(d3.easeBounceOut)
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
        .attr("stroke", "url(#lineGradient)")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .merge(path as any)
        .attr("d", line);
      path.exit().remove();

      const pts = gContent.selectAll("circle.pt").data(data, (d: any) => String(d.year));
      pts.exit().remove();

      pts.enter().append("circle")
        .attr("class", "pt")
        .attr("fill", "#3b82f6")
        .attr("stroke", "#1e40af")
        .attr("stroke-width", 2)
        .attr("r", 6)
        .on("mousemove", (event: any, d: ChartData) => {
          const [mx, my] = d3.pointer(event, container.node());
          tooltip
            .style("left", `${mx}px`)
            .style("top", `${my - 10}px`)
            .style("opacity", 1)
            .html(`
              <div style="font-weight: 600; margin-bottom: 4px;">${d.year}</div>
              <div style="font-size: 16px; font-weight: 700; color: #8b5cf6;">${fmtPct(d.growth || 0)}%</div>
              <div style="font-size: 11px; opacity: 0.8;">growth rate</div>
            `);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .merge(pts as any)
        .attr("cx", (d: ChartData) => scales.xPoint(String(d.year)))
        .attr("cy", (d: ChartData) => scales.yGrowth(d.growth || 0))
        .attr("fill", "#3b82f6")
        .attr("stroke", "#1e40af")
        .attr("stroke-width", 2)
        .attr("r", 6);
    };

    // Main render function
    const renderChart = () => {
      const { innerW, innerH } = size();
      gContent.selectAll("*").remove();

      const chartData = filterData(data, vehicleGroup);
      console.log('Chart data for rendering:', chartData);
      console.log('Vehicle group:', vehicleGroup);
      console.log('Visualization type:', vizType);
      
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
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        mb: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          📊
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Vehicle Ownership in Victoria (2021–2024)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive data visualization with real-time insights
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel sx={{ fontWeight: 500 }}>Visualization Type</InputLabel>
          <Select
            value={vizType}
            label="Visualization Type"
            onChange={(e) => setVizType(e.target.value as 'bar' | 'line')}
            sx={{
              '& .MuiSelect-select': {
                fontWeight: 500,
              },
            }}
          >
            <MenuItem value="bar">📊 Bar Chart - Vehicle Counts</MenuItem>
            <MenuItem value="line">📈 Line Chart - Growth Trends</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel sx={{ fontWeight: 500 }}>Vehicle Category</InputLabel>
          <Select
            value={vehicleGroup}
            label="Vehicle Category"
            onChange={(e) => setVehicleGroup(e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                fontWeight: 500,
              },
            }}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group === 'All types' ? '🚗 All Vehicle Types' : 
                 group === 'Passenger vehicles' ? '🚙 Passenger Vehicles' :
                 group === 'Commercial vehicles' ? '🚛 Commercial Vehicles' :
                 group === 'Motorcycles' ? '🏍️ Motorcycles' : group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box 
        ref={containerRef} 
        sx={{ 
          position: 'relative',
          background: 'white',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '& svg': {
            width: '100%',
            height: '500px'
          },
          '& .bar': {
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
            }
          },
          '& .line': {
            filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2))',
          },
          '& .pt': {
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))',
            }
          },
          '& .x-axis text, .y-axis text': {
            fontSize: '13px',
            fontWeight: 500,
            fill: '#64748b',
          },
          '& .x-axis line, .y-axis line': {
            stroke: '#e2e8f0',
            strokeWidth: 1,
          },
          '& .x-axis .domain, .y-axis .domain': {
            stroke: '#cbd5e1',
            strokeWidth: 2,
          },
          '& .title': {
            fontWeight: 700,
            fontSize: '16px',
            fill: '#1e293b',
            textAnchor: 'middle',
          },
          '& .axis-label': {
            fontSize: '14px',
            fontWeight: 600,
            fill: '#475569',
            textAnchor: 'middle',
          },
          '& .grid line': {
            stroke: '#f1f5f9',
            strokeWidth: 1,
            strokeDasharray: '3,3',
          }
        }}
      >
        <svg ref={svgRef}>
          {/* Gradients for enhanced visual appeal */}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="1"/>
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="50%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
        <Box
          ref={tooltipRef}
          sx={{
            position: 'absolute',
            pointerEvents: 'none',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: 1.3,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            opacity: 0,
            transition: 'opacity .15s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        />
      </Box>
    </Paper>
  );
};

export default VehicleOwnershipChart;
