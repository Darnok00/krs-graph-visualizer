// GraphVisualization.tsx
import React from 'react';
import './GraphVisualization.css';
import graphData from '../data/points.json';

// Definiowanie typów dla struktury JSON
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
    const colors = ['red', 'green', 'blue'];
    return colors[parseInt(subgraphId, 10) % colors.length];
  };

  const gridSize = 100;

  return (
    <svg width={gridSize * 10} height={gridSize * 10} className="graph-visualization">
      {[...Array(10)].map((_, i) => (
        <React.Fragment key={i}>
          <line x1={0} y1={i * gridSize} x2={gridSize * 10} y2={i * gridSize} stroke="white" />
          <line x1={i * gridSize} y1={0} x2={i * gridSize} y2={gridSize * 10} stroke="white" />
        </React.Fragment>
      ))}

      {graphData.map((point: GraphPoint) => (
        point.neighbors.map((neighbor) => {
          const neighborPoint = getPointById(neighbor.id);
          if (!neighborPoint) return null;
          return (
            <line
              key={`${point.id}-${neighbor.id}`}
              x1={point.x * gridSize + gridSize / 2}
              y1={point.y * gridSize + gridSize / 2}
              x2={neighborPoint.x * gridSize + gridSize / 2}
              y2={neighborPoint.y * gridSize + gridSize / 2}
              stroke={getColorForSubgraph(point.subgraph)}
              strokeWidth={getStrokeWidth(neighbor.weight)}
            />
          );
        })
      ))}

      {/* Renderowanie punktów i tekstu */}
      {graphData.map((point: GraphPoint) => (
        <React.Fragment key={point.id}>
          <circle
            cx={point.x * gridSize + gridSize / 2}
            cy={point.y * gridSize + gridSize / 2}
            r="15"
            fill={getColorForSubgraph(point.subgraph)}
          />
          <text
            x={point.x * gridSize + gridSize / 2}
            y={point.y * gridSize + gridSize / 2}
            dy={-20} // Aby tekst był nad punktem
            textAnchor="middle"
            fontSize="10"
            fill="white"
            style={{ zIndex: 10 }} // Tekst nad liniami
          >
            {point.name}
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
};

export default GraphVisualization;
