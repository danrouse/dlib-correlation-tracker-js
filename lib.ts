declare class CorrelationTracker {
  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number);
  startTrack(img: Array2D, bbox: _Rectangle): void;
  predict(img: Array2D): _Rectangle;
  update(img: Array2D, guess: _Rectangle): _Rectangle;
  getPosition(): _Rectangle;
}
declare class _Rectangle {
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
  set(y: number, x: number, value: number[]): void;
  width: Readonly<number>;
  height: Readonly<number>;
}
declare interface dlib {
  CorrelationTracker: typeof CorrelationTracker;
  Array2D: typeof Array2D;
  Rectangle: typeof _Rectangle;
  readImageData(pointer: number, width: number, height: number): Array2D;

  HEAP8: Int8Array;
  _malloc(size: number): number;
  _free(pointer: number): void;
}

const lib: dlib = require('./dist/binding')();

let videoKeyInHeap: string | undefined;
let cachedArray: Array2D | undefined;
let canvas: HTMLCanvasElement | undefined;

const videoKey = (video: HTMLVideoElement, pointer: number) => pointer + video.src + video.currentTime;

function videoToArray2D(video: HTMLVideoElement, pointer: number): Array2D {
  const key = videoKey(video, pointer);
  if (key === videoKeyInHeap && cachedArray) return cachedArray;
  if (!canvas) canvas = document.createElement('canvas');
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(video, 0, 0);CorrelationTracker
  const pixels = ctx.getImageData(0, 0, width, height).data;
  lib.HEAP8.set(pixels, pointer);
  videoKeyInHeap = key;
  cachedArray = lib.readImageData(pointer, width, height);
  return cachedArray;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class VideoCorrelationTracker {
  video: HTMLVideoElement;
  rect: Rectangle;
  tracker: CorrelationTracker;

  private static ptr: number | undefined;

  static freeMemory() {
    if (this.ptr) {
      lib._free(this.ptr);
      this.ptr = undefined;
    }
  }

  static reserveMemory(video: HTMLVideoElement) {
    if (this.ptr) this.freeMemory();
    this.ptr = lib._malloc(video.videoWidth * video.videoHeight * 4);
  }

  private get videoArray2D() {
    if (!VideoCorrelationTracker.ptr) VideoCorrelationTracker.reserveMemory(this.video);
    return videoToArray2D(this.video, VideoCorrelationTracker.ptr as number);
  }

  get prediction(): Rectangle {
    const rect = this.tracker.predict(this.videoArray2D);
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  constructor(video: HTMLVideoElement, rect: Rectangle) {
    this.video = video;
    this.rect = rect;
    if (!VideoCorrelationTracker.ptr) VideoCorrelationTracker.reserveMemory(video);
    this.tracker = new lib.CorrelationTracker();
    const _rect = new lib.Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
    this.tracker.startTrack(this.videoArray2D, _rect);
  }

  update(rect: Rectangle) {
    const _rect = new lib.Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height)
    this.tracker.update(this.videoArray2D, _rect);
  }
}

export { lib };
