export interface Point {
  x: number;
  y: number;
}

export interface LineEquation {
  m: number;
  q: number;
  isVertical: boolean;
  xIntercept?: number; // Used if vertical
}

export interface ViewportState {
  min: number;
  max: number;
}
