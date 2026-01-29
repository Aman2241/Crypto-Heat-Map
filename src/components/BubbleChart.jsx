import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ data }) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            if (wrapperRef.current) {
                const { clientWidth, clientHeight } = wrapperRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!data || data.length === 0 || !dimensions.width) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current);

        svg.selectAll("*").remove();

        // 1. Define Gradients (Glassmorphism Style)
        const defs = svg.append("defs");

        // Helper to create linear glass gradients
        const createGlassGradient = (id, colorStart, colorEnd) => {
            const grad = defs.append("linearGradient")
                .attr("id", id)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%");
            grad.append("stop").attr("offset", "0%").attr("stop-color", colorStart).attr("stop-opacity", 0.6);
            grad.append("stop").attr("offset", "100%").attr("stop-color", colorEnd).attr("stop-opacity", 0.3);
            return grad;
        };

        createGlassGradient("glass-green", "#34D399", "#059669"); // Emerald values
        createGlassGradient("glass-red", "#FB7185", "#E11D48");   // Rose values
        createGlassGradient("glass-gray", "#9CA3AF", "#4B5563");

        // Glow filter for hover
        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // 2. Prepare Data
        const minCap = d3.min(data, d => d.market_cap);
        const maxCap = d3.max(data, d => d.market_cap);

        // Bigger bubbles, more spacing
        const maxRadius = Math.min(width, height) * 0.18;
        const minRadius = 6;

        const radiusScale = d3.scaleSqrt()
            .domain([minCap, maxCap])
            .range([minRadius, maxRadius]);

        const nodes = data.map(d => ({
            ...d,
            r: radiusScale(d.market_cap),
            x: Math.random() * width,
            y: Math.random() * height
        }));

        const getFill = (d) => {
            const change = d.price_change_percentage_24h;
            if (change === null || change === undefined) return "url(#glass-gray)";
            return change >= 0 ? "url(#glass-green)" : "url(#glass-red)";
        };

        const getStroke = (d) => {
            const change = d.price_change_percentage_24h;
            if (change === null || change === undefined) return "#9CA3AF";
            return change >= 0 ? "#34D399" : "#FB7185";
        }

        // 3. Render
        const container = svg.append("g");

        const node = container.selectAll("g")
            .data(nodes)
            .join("g")
            .attr("cursor", "pointer")
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.1).restart(); // Lower alpha for smoother drag restart
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                })
            );

        // Glass Bubble
        node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d => getFill(d))
            .attr("stroke", d => getStroke(d))
            .attr("stroke-width", 1.5)
            .style("stroke-opacity", 0.6)
            .style("transition", "all 0.3s ease");

        // Shine/Reflection effect (top left arc)
        node.append("path")
            .attr("d", d => `M ${-d.r * 0.6} ${-d.r * 0.2} Q ${-d.r * 0.3} ${-d.r * 0.6} ${d.r * 0.2} ${-d.r * 0.6}`)
            .attr("stroke", "rgba(255,255,255,0.4)")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("stroke-linecap", "round");


        // Text Label - HIDDEN BY DEFAULT
        const texts = node.append("text")
            .text(d => d.symbol.toUpperCase())
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .style("fill", "white")
            .style("font-family", "Inter, sans-serif")
            .style("font-weight", "700")
            .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)")
            .style("pointer-events", "none")
            .style("font-size", d => Math.min(d.r / 1.5, 20) + "px")
            .style("opacity", 0) // Hidden initially
            .style("transition", "opacity 0.2s ease");

        // Interactions
        node.on("mouseover", function (event, d) {
            // Highlight Bubble
            const circle = d3.select(this).select("circle");
            circle
                .attr("stroke", "#fff")
                .attr("stroke-width", 3)
                .style("stroke-opacity", 1)
                .attr("filter", "url(#glow)"); // Add glow

            // Show Text
            d3.select(this).select("text").style("opacity", 1);

            // Tooltip
            tooltip.style("opacity", 1)
                .html(`
                        <div class="glass-tooltip">
                            <div class="font-bold text-xl mb-2 flex items-center justify-between">
                                <span>${d.name}</span>
                                <span class="text-xs opacity-70 bg-white/10 px-2 py-1 rounded">${d.symbol.toUpperCase()}</span>
                            </div>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <span class="opacity-60">Price</span>
                                <span class="text-right font-mono">$${d.current_price?.toLocaleString()}</span>
                                <span class="opacity-60">Market Cap</span>
                                <span class="text-right font-mono">$${(d.market_cap / 1e9).toFixed(2)}B</span>
                                <span class="opacity-60">24h Change</span>
                                <span class="text-right font-bold ${d.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                                    ${d.price_change_percentage_24h?.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                      `);
        })
            .on("mousemove", function (event) {
                const [x, y] = d3.pointer(event, wrapperRef.current);
                // Keep visually near cursor but constrained
                let left = x + 20;
                let top = y + 20;

                const tooltipWidth = 220;
                const tooltipHeight = 150;

                if (left + tooltipWidth > width) left = x - tooltipWidth - 20;
                if (top + tooltipHeight > height) top = y - tooltipHeight - 20;

                tooltip.style("left", left + "px").style("top", top + "px");
            })
            .on("mouseout", function (event, d) {
                // Reset Bubble
                const circle = d3.select(this).select("circle");
                circle
                    .attr("stroke", getStroke(d))
                    .attr("stroke-width", 1.5)
                    .style("stroke-opacity", 0.6)
                    .attr("filter", "none");

                // Hide Text
                d3.select(this).select("text").style("opacity", 0);

                tooltip.style("opacity", 0);
            });

        // 4. Force Simulation (Refined Physics)
        const simulation = d3.forceSimulation(nodes)
            .velocityDecay(0.6) // Higher decay = Slower, more fluid movement (like water)
            .force("charge", d3.forceManyBody().strength(1)) // Very weak repulsion for drift
            .force("collide", d3.forceCollide().radius(d => d.r + 4).strength(1).iterations(3)) // +4 padding
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.02))
            .force("x", d3.forceX(width / 2).strength(0.005))
            .force("y", d3.forceY(height / 2).strength(0.005))
            .on("tick", () => {
                nodes.forEach(d => {
                    const r = d.r;
                    // Bounding Box with elasticity
                    if (d.x - r < 0) { d.x = r; d.vx *= -0.8; }
                    if (d.x + r > width) { d.x = width - r; d.vx *= -0.8; }
                    if (d.y - r < 0) { d.y = r; d.vy *= -0.8; }
                    if (d.y + r > height) { d.y = height - r; d.vy *= -0.8; }
                });

                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });

        return () => {
            simulation.stop();
        };

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ width: '100%', height: '100vh', background: 'radial-gradient(circle at center, #1F2937 0%, #111827 100%)', overflow: 'hidden', position: 'relative' }}>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ display: 'block' }} />
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    zIndex: 50
                }}
            />
        </div>
    );
};

export default BubbleChart;
