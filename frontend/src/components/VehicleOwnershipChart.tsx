import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Paper, Typography } from '@mui/material';

interface VehicleData {
  year: number;
  car_ownership: number;
  growth: number;
}

const MARGIN = { top: 80, right: 70, bottom: 50, left: 100 };

const VehicleOwnershipChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<VehicleData[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the new CSV file path
        const response = await fetch('/car_ownership_cleaned.csv');
        const csvText = await response.text();
        
        // Parse CSV with semicolon delimiter
        const rawData = d3.csvParse(csvText, (d: any) => ({
          year: +d.year,
          car_ownership: +d.car_ownership,
          growth: parseFloat(d.growth.replace('%', ''))
        })) as VehicleData[];
        
        console.log('Raw CSV data:', rawData);
        setData(rawData);
      } catch (error) {
        console.error('Error loading vehicle ownership data:', error);
        // Fallback data if CSV loading fails
        const fallbackData: VehicleData[] = [
          { year: 2020, car_ownership: 5121323, growth: 1.80 },
          { year: 2021, car_ownership: 5157172, growth: 0.70 },
          { year: 2022, car_ownership: 5268134, growth: 2.15 },
          { year: 2023, car_ownership: 5384177, growth: 2.20 },
          { year: 2024, car_ownership: 5514720, growth: 2.42 }
        ];
        setData(fallbackData);
      }
    };

    loadData();
  }, []);

  // Render chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !tooltipRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const container = d3.select(containerRef.current);
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const fmtComma = d3.format(",");
    const fmtPct = d3.format(".2f");

    // Dimensions
    const outerW = container.node()?.clientWidth || 900;
    const outerH = 520;
    const width = outerW - MARGIN.left - MARGIN.right;
    const height = outerH - MARGIN.top - MARGIN.bottom;

    svg.attr("width", outerW).attr("height", outerH);
    const g = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Scales
    const x = d3.scaleBand().domain(data.map(d => String(d.year))).range([0, width]).padding(0.2);
    const yLeft = d3.scaleLinear().domain([0, d3.max(data, d => d.car_ownership) || 0]).nice().range([height, 0]);
    const yRight = d3.scaleLinear().domain([0, d3.max(data, d => d.growth) || 0]).nice().range([height, 0]);

    // Axes
    g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(yLeft).tickFormat(d3.format(",")))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -75)
        .attr("dy", "0.71em")
        .attr("fill", "#111")
        .attr("text-anchor", "middle")
        .text("Number of Cars");

    g.append("g").attr("transform", `translate(${width},0)`)
      .call(d3.axisRight(yRight).ticks(5).tickFormat(d => fmtPct(d) + "%"))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", 65)
        .attr("dy", "0.71em")
        .attr("fill", "#111")
        .attr("text-anchor", "middle")
        .text("Increase Rate (%)");

    // Bars
    g.selectAll(".bar").data(data).enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(String(d.year)) || 0)
      .attr("y", d => yLeft(d.car_ownership))
      .attr("width", x.bandwidth())
      .attr("height", d => height - yLeft(d.car_ownership))
      .attr("fill", "#87CEFA")
      .on("mousemove", (event: any, d: VehicleData) => {
        const [mx, my] = d3.pointer(event, container.node());
        tooltip
          .style("left", `${mx}px`)
          .style("top", `${my - 10}px`)
          .style("opacity", 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.year}</div>
            <div style="font-size: 16px; font-weight: 700; color: #3b82f6;">${fmtComma(d.car_ownership)}</div>
            <div style="font-size: 11px; opacity: 0.8;">cars registered</div>
            <div style="font-size: 12px; color: #ef4444; margin-top: 4px;">Growth: ${fmtPct(d.growth)}%</div>
          `);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // Line + dots
    const line = d3.line<VehicleData>().x(d => (x(String(d.year)) || 0) + x.bandwidth()/2).y(d => yRight(d.growth));
    g.append("path").datum(data).attr("fill", "none").attr("stroke", "red").attr("stroke-width", 2).attr("d", line);
    
    g.selectAll(".dot").data(data).enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("fill", "red")
      .attr("cx", d => (x(String(d.year)) || 0) + x.bandwidth()/2)
      .attr("cy", d => yRight(d.growth))
      .on("mousemove", (event: any, d: VehicleData) => {
        const [mx, my] = d3.pointer(event, container.node());
        tooltip
          .style("left", `${mx}px`)
          .style("top", `${my - 10}px`)
          .style("opacity", 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.year}</div>
            <div style="font-size: 16px; font-weight: 700; color: #ef4444;">${fmtPct(d.growth)}%</div>
            <div style="font-size: 11px; opacity: 0.8;">growth rate</div>
            <div style="font-size: 12px; color: #3b82f6; margin-top: 4px;">Cars: ${fmtComma(d.car_ownership)}</div>
          `);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${outerW/2}, 30)`);

    // item 1: bars
    const lg1 = legend.append("g");
    lg1.append("rect").attr("width", 14).attr("height", 14).attr("fill", "#87CEFA").attr("y", -10);
    lg1.append("text").attr("x", 20).attr("y", 2).text("Number of Cars");

    // measure and place item 2 after item 1 width + gap
    const gap = 28;
    const lg1Width = lg1.node()?.getBBox().width || 0;
    const lg2 = legend.append("g").attr("transform", `translate(${lg1Width + gap},0)`);
    lg2.append("line").attr("x1", 0).attr("x2", 20).attr("y1", -3).attr("y2", -3).attr("stroke", "red").attr("stroke-width", 2);
    lg2.append("circle").attr("cx", 10).attr("cy", -3).attr("r", 4).attr("fill", "red");
    lg2.append("text").attr("x", 28).attr("y", 2).text("Increase Rate (%)");

    // center the whole legend group by shifting half of its width
    const legendWidth = legend.node()?.getBBox().width || 0;
    legend.attr("transform", `translate(${outerW/2 - legendWidth/2}, 30)`);

    // Handle resize
    const handleResize = () => {
      // Re-render chart on resize
      if (svgRef.current && containerRef.current) {
        d3.select(svgRef.current).selectAll("*").remove();
        // Re-trigger the effect
        setTimeout(() => {
          if (data.length > 0) {
            // Force re-render
            setData([...data]);
          }
        }, 100);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

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
            Vehicle Ownership in Victoria (2020–2024)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive data visualization with real-time insights
          </Typography>
        </Box>
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
