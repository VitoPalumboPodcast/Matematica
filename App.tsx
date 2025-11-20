import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import CartesianPlane from './components/CartesianPlane';
import { Point, LineEquation } from './types';

const App: React.FC = () => {
  // Initial State
  const [pointA, setPointA] = useState<Point>({ x: -2, y: 1 });
  const [pointB, setPointB] = useState<Point>({ x: 3, y: 3 });
  const [pointP_X, setPointP_X] = useState<number>(0);

  // Derived State: Calculate m and q based on A and B
  const calculateLine = (p1: Point, p2: Point): LineEquation => {
    if (p1.x === p2.x) {
      return { m: Infinity, q: NaN, isVertical: true, xIntercept: p1.x };
    }
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const q = p1.y - m * p1.x;
    return { m, q, isVertical: false };
  };

  const lineEquation = calculateLine(pointA, pointB);

  // Calculate P based on current X and Equation
  const calculatePointP = (): Point => {
    if (lineEquation.isVertical) {
      // If vertical, P is restricted to the vertical line. 
      // We use 'pointP_X' as the Y-control for visualization purposes in this edge case
      return { x: pointA.x, y: pointP_X };
    }
    return { x: pointP_X, y: lineEquation.m * pointP_X + lineEquation.q };
  };

  const pointP = calculatePointP();

  // Handlers
  const updatePointA = useCallback((newP: Point) => {
    setPointA(newP);
    // Ensure we don't have identical points (results in no line)
    if (newP.x === pointB.x && newP.y === pointB.y) {
      setPointB(prev => ({ ...prev, x: prev.x + 1 }));
    }
  }, [pointB]);

  const updatePointB = useCallback((newP: Point) => {
    setPointB(newP);
    if (newP.x === pointA.x && newP.y === pointA.y) {
       setPointA(prev => ({ ...prev, x: prev.x - 1 }));
    }
  }, [pointA]);

  // Reverse Logic: Updating m/q updates B (keeping A fixed)
  const updateEquation = useCallback((newM: number, newQ: number) => {
    // We keep Point A fixed, and move Point B to fit the new equation.
    // However, if we just move B, we might lose the "anchor" of A if A is no longer on the line.
    // Strategy: 
    // 1. Calculate new y for A based on new equation? -> Moves A.
    // 2. Rotate around centroid? Too complex.
    // 3. Standard approach in these tools: Keep X1, X2 fixed, update Y1, Y2.
    
    const newY1 = newM * pointA.x + newQ;
    const newY2 = newM * pointB.x + newQ;

    setPointA({ ...pointA, y: newY1 });
    setPointB({ ...pointB, y: newY2 });

  }, [pointA, pointB]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
      
      {/* Left Panel: Controls */}
      <section className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0">
        <ControlPanel 
          pointA={pointA}
          pointB={pointB}
          pointP={pointP}
          lineEquation={lineEquation}
          onUpdatePointA={updatePointA}
          onUpdatePointB={updatePointB}
          onUpdateEquation={updateEquation}
          onUpdatePointP={setPointP_X}
        />
      </section>

      {/* Right Panel: Visualization */}
      <main className="flex-1 h-[500px] md:h-auto min-h-[500px]">
        <CartesianPlane 
          pointA={pointA}
          pointB={pointB}
          pointP={pointP}
          lineEquation={lineEquation}
        />
      </main>

    </div>
  );
};

export default App;
