import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Scatter,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell
} from 'recharts';
import { Point, LineEquation } from '../types';

interface CartesianPlaneProps {
  pointA: Point;
  pointB: Point;
  pointP: Point;
  lineEquation: LineEquation;
}

const CartesianPlane: React.FC<CartesianPlaneProps> = ({
  pointA,
  pointB,
  pointP,
  lineEquation
}) => {
  const domain = [-10, 10];

  // Calculate points for the line drawing (start and end of view)
  const lineData = useMemo(() => {
    if (lineEquation.isVertical) {
      // Vertical line at x = pointA.x
      return [
        { x: pointA.x, y: domain[0] },
        { x: pointA.x, y: domain[1] }
      ];
    }
    const y1 = lineEquation.m * domain[0] + lineEquation.q;
    const y2 = lineEquation.m * domain[1] + lineEquation.q;
    return [
      { x: domain[0], y: y1 },
      { x: domain[1], y: y2 }
    ];
  }, [lineEquation, pointA.x]);

  // Prepare Scatter Data
  const scatterPoints = [
    { x: pointA.x, y: pointA.y, type: 'A', label: 'A' },
    { x: pointB.x, y: pointB.y, type: 'B', label: 'B' },
    { x: pointP.x, y: pointP.y, type: 'P', label: 'P' },
  ];

  // Add Intercept I if visible within reasonable bounds and not vertical
  if (!lineEquation.isVertical) {
      scatterPoints.push({ x: 0, y: lineEquation.q, type: 'I', label: 'I' });
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'A': return '#10b981'; // success
      case 'B': return '#f59e0b'; // warning
      case 'P': return '#3b82f6'; // primary
      case 'I': return '#8b5cf6'; // accent
      default: return '#000';
    }
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // If it's the line
      if (!data.type) return null;

      return (
        <div className="bg-white/90 backdrop-blur shadow-lg p-2 rounded border border-slate-200 text-xs font-mono">
          <p className="font-bold" style={{ color: getColor(data.type) }}>
            Point {data.label}
          </p>
          <p>x: {data.x.toFixed(2)}</p>
          <p>y: {data.y.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 text-xs text-slate-500 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Point A
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Point B
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Point P (Mobile)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span> Intercept (0, q)
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          {/* Axes Reference Lines */}
          <ReferenceLine x={0} stroke="#64748b" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />

          <XAxis 
            type="number" 
            dataKey="x" 
            domain={domain} 
            allowDataOverflow={false} 
            tickCount={11}
            stroke="#94a3b8"
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={domain} 
            allowDataOverflow={false} 
            tickCount={11}
            stroke="#94a3b8"
            tick={{ fontSize: 10 }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />

          {/* The Equation Line */}
          <Line
            data={lineData}
            type="linear"
            dataKey="y"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />

          {/* Points Scatter */}
          <Scatter data={scatterPoints} fill="#8884d8">
            {scatterPoints.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CartesianPlane;
