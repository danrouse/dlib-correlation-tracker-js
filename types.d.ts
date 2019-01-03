declare class CorrelationTracker {
  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number);
  startTrack(img: Array2D, bbox: Rectangle): void;
  update(img: Array2D): Rectangle;
  getPosition(): Rectangle;
}
declare class Rectangle {
  constructor(l: number, t: number, r: number, b: number);
  left: Readonly<number>;
  right: Readonly<number>;
  top: Readonly<number>;
  bottom: Readonly<number>;
  width: Readonly<number>;
  height: Readonly<number>;
}
declare class Array2D {
  constructor();
  constructor(h: number, w: number);
  setSize(h: number, w: number): void;
  set(y: number, x: number, value: number): void;
  width: Readonly<number>;
  height: Readonly<number>;
}
declare interface dlibCorrelationTrackerJs {
  CorrelationTracker: typeof CorrelationTracker;
  Array2D: typeof Array2D;
  Rectangle: typeof Rectangle;
}
export default function initModule(): dlibCorrelationTrackerJs;
