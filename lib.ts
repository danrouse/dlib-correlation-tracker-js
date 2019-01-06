export declare class CorrelationTracker {
  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number);
  startTrack(img: Array2D, bbox: Rectangle): void;
  predict(img: Array2D): Rectangle;
  update(img: Array2D, guess: Rectangle): Rectangle;
  getPosition(): Rectangle;
}
export declare class Rectangle {
  constructor(l: number, t: number, r: number, b: number);
  left: Readonly<number>;
  right: Readonly<number>;
  top: Readonly<number>;
  bottom: Readonly<number>;
  width: Readonly<number>;
  height: Readonly<number>;
}
export declare class Array2D {
  constructor();
  constructor(h: number, w: number);
  setSize(h: number, w: number): void;
  set(y: number, x: number, value: number[]): void;
  width: Readonly<number>;
  height: Readonly<number>;
}
export interface dlib {
  CorrelationTracker: typeof CorrelationTracker;
  Array2D: typeof Array2D;
  Rectangle: typeof Rectangle;
  readImageData(pointer: number, width: number, height: number): Array2D;

  HEAP8: Int8Array;
  _malloc(size: number): number;
  _free(pointer: number): void;
  then(callback: Function): void;
}
