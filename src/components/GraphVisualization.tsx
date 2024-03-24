// GraphVisualization.tsx
import React from 'react';
import './GraphVisualization.css';
import graphData from '../data/points.json';

// Define the types for your JSON structure
type Neighbor = {
  id: string;
  weight: number;
};

type GraphPoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  neighbors: Neighbor[];
  subgraph: string;
};


const GraphVisualization: React.FC = () => {
  const getPointById = (id: string) => {
    return graphData.find((point: GraphPoint) => point.id === id);
  };

  const getStrokeWidth = (weight: number) => {
    return Math.max(1, weight);
  };

  const getColorForSubgraph = (subgraphId: string) => {
    const colors = ['red', 'green', 'blue']; // Add more colors for each subgraph
    return colors[parseInt(subgraphId, 10) % colors.length];
  };

  return (
    <svg width="1000" height="1000" className="graph-visualization">
      {graphData.map((point: GraphPoint) => (
        <React.Fragment key={point.id}>
          {/* Render lines for neighbors */}
          {point.neighbors.map((neighbor) => {
            const neighborPoint = getPointById(neighbor.id);
            if (!neighborPoint) return null;
            return (
              <line
                key={`${point.id}-${neighbor.id}`}
                x1={point.x * 100 + 50}
                y1={point.y * 100 + 50}
                x2={neighborPoint.x * 100 + 50}
                y2={neighborPoint.y * 100 + 50}
                stroke={getColorForSubgraph(point.subgraph)}
                strokeWidth={getStrokeWidth(neighbor.weight)}
              />
            );
          })}
          <circle
            cx={point.x * 100 + 50}
            cy={point.y * 100 + 50}
            r="15" 
            fill={getColorForSubgraph(point.subgraph)}
          />
          <text
            x={point.x * 100 + 50}
            y={point.y * 100 + 55}
            textAnchor="middle"
            fontSize="10"
            fill="white"
          >
            {point.name}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
};

export default GraphVisualization;
