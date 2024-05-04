import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { prepareData } from '../utils/getData';

const FullGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [minDegree, setMinDegree] = useState(2);
    const [maxDegree, setMaxDegree] = useState(4);
    const [inputMinDegree, setInputMinDegree] = useState(2);
    const [inputMaxDegree, setInputMaxDegree] = useState(4);

    useEffect(() => {
      const { companies, links } = prepareData(minDegree, maxDegree);
      if (svgRef.current) {
        renderGraph(companies, links);
      }
    }, []);

    const updateGraph = () => {
      const { companies, links } = prepareData(inputMinDegree, inputMaxDegree);
      setMinDegree(inputMinDegree);
      setMaxDegree(inputMaxDegree);
      if (svgRef.current) {
        renderGraph(companies, links);
      }
    };

    const renderGraph = (companies: any[], links: any[]) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      const width = window.innerWidth;
      const height = 800;

      const zoom = d3.zoom().on('zoom', (event: any) => { g.attr('transform', event.transform); });
      svg.call(zoom);
      const g = svg.append('g');

      const simulation = d3.forceSimulation(companies)
        .force('link', d3.forceLink(links).id((d: { name: any; }) => d.name).distance(50))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = g.append('g').attr('stroke', '#999').selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-opacity', 0.6)
        .on('click', (_: any, d: { source: { name: any; }; target: { name: any; }; representative: any; }) => {
            alert(`Link between ${d.source.name} and ${d.target.name}, by ${d.representative}`);
        });

      const node = g.append('g').attr('stroke', '#fff').attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(companies)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'blue')
        .on('click', (_: any, d: { name: any; }) => {
          alert(`Company: ${d.name}`);
        });

      simulation.on('tick', () => {
        link.attr('x1', (d: { source: { x: any; }; }) => d.source.x)
          .attr('y1', (d: { source: { y: any; }; }) => d.source.y)
          .attr('x2', (d: { target: { x: any; }; }) => d.target.x)
          .attr('y2', (d: { target: { y: any; }; }) => d.target.y);
        node.attr('cx', (d: { x: any; }) => d.x)
          .attr('cy', (d: { y: any; }) => d.y);
    });
    };

    return (
      <>
        <div style={{ marginTop: '50px', marginBottom: '20px' }}>
          <label>
            Min Degree:
            <input type="number" value={inputMinDegree} onChange={e => setInputMinDegree(Number(e.target.value))} />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Max Degree:
            <input type="number" value={inputMaxDegree} onChange={e => setInputMaxDegree(Number(e.target.value))} />
          </label>
          <button onClick={updateGraph} style={{ marginLeft: '10px' }}>Save</button>
        </div>
        <svg ref={svgRef} style={{ width: '100vw', height: '800px', backgroundColor: '#222' }} />
      </>
  );
};

export default FullGraph;
