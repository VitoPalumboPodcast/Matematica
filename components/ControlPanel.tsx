import React, { useState, useEffect } from 'react';
import { Point, LineEquation } from '../types';
import { Calculator, Move, TrendingUp, Play, Pause } from 'lucide-react';

interface ControlPanelProps {
  pointA: Point;
  pointB: Point;
  pointP: Point;
  lineEquation: LineEquation;
  onUpdatePointA: (p: Point) => void;
  onUpdatePointB: (p: Point) => void;
  onUpdateEquation: (m: number, q: number) => void;
  onUpdatePointP: (x: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  pointA,
  pointB,
  pointP,
  lineEquation,
  onUpdatePointA,
  onUpdatePointB,
  onUpdateEquation,
  onUpdatePointP
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation loop for Point P
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      let direction = 1;
      const animate = () => {
        const currentX = pointP.x;
        let nextX = currentX + 0.05 * direction;
        
        if (nextX > 10) {
          nextX = 10;
          direction = -1;
        } else if (nextX < -10) {
          nextX = -10;
          direction = 1;
        }

        onUpdatePointP(nextX);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, pointP.x, onUpdatePointP]);

  const handleNumberChange = (
    setter: (p: Point) => void,
    current: Point,
    field: 'x' | 'y',
    value: string
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;
    setter({ ...current, [field]: val });
  };

  const formatNumber = (num: number) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Retta Interattiva
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manipulate inputs, sliders, and variables to visualize linear equations.
        </p>
      </div>

      {/* 1. Points A & B Control */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">1</div>
          <h2 className="font-semibold text-slate-800">Coordinates</h2>
        </div>

        <div className="space-y-4">
          {/* Point A */}
          <div className="flex items-center gap-4 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">A</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">x:</span>
              <input 
                type="number" 
                value={pointA.x}
                onChange={(e) => handleNumberChange(onUpdatePointA, pointA, 'x', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none font-mono text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">y:</span>
              <input 
                type="number" 
                value={pointA.y}
                onChange={(e) => handleNumberChange(onUpdatePointA, pointA, 'y', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none font-mono text-center"
              />
            </div>
          </div>

          {/* Point B */}
          <div className="flex items-center gap-4 p-2 rounded-lg bg-amber-50/50 border border-amber-100">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">B</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">x:</span>
              <input 
                type="number" 
                value={pointB.x}
                onChange={(e) => handleNumberChange(onUpdatePointB, pointB, 'x', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none font-mono text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">y:</span>
              <input 
                type="number" 
                value={pointB.y}
                onChange={(e) => handleNumberChange(onUpdatePointB, pointB, 'y', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none font-mono text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Equation Control */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
         <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">2</div>
          <h2 className="font-semibold text-slate-800">Equation</h2>
          <span className="ml-auto text-xs font-mono text-red-500 bg-red-50 px-2 py-0.5 rounded">
            y = mx + q
          </span>
        </div>

        <div className="mb-6 flex justify-center">
           <div className="text-3xl font-serif font-bold text-slate-800 tracking-wide">
              <span className="text-slate-400 italic">y</span> = 
              <span className="text-red-600 mx-1">{formatNumber(lineEquation.m)}</span>
              <span className="text-slate-400 italic">x</span> + 
              <span className="text-red-600 mx-1">{formatNumber(lineEquation.q)}</span>
           </div>
        </div>

        <div className="space-y-5">
          <div>
             <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Slope (m)</span>
                <span className="font-mono text-slate-500">{formatNumber(lineEquation.m)}</span>
             </div>
             <input 
                type="range" 
                min="-5" max="5" step="0.1" 
                value={lineEquation.m}
                onChange={(e) => onUpdateEquation(parseFloat(e.target.value), lineEquation.q)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
          </div>
          <div>
             <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Intercept (q)</span>
                <span className="font-mono text-slate-500">{formatNumber(lineEquation.q)}</span>
             </div>
             <input 
                type="range" 
                min="-10" max="10" step="0.1" 
                value={lineEquation.q}
                onChange={(e) => onUpdateEquation(lineEquation.m, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
          </div>
        </div>
      </div>

      {/* 3. Moving Point P */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
         <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">3</div>
          <h2 className="font-semibold text-slate-800">Analysis</h2>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`ml-auto p-1.5 rounded-md transition-colors ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
            title={isPlaying ? "Pause Animation" : "Animate Point P"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4 text-center">
          <div className="text-xs uppercase tracking-wider text-blue-500 font-bold mb-1">Point P (x, y)</div>
          <div className="font-mono text-lg font-bold text-blue-700">
            ({formatNumber(pointP.x)}, {formatNumber(pointP.y)})
          </div>
        </div>

        <div>
           <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">Point X Position</span>
           </div>
           <input 
              type="range" 
              min="-10" max="10" step="0.1" 
              value={pointP.x}
              onChange={(e) => onUpdatePointP(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
           />
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;
