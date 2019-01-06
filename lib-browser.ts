import { dlib, Array2D, CorrelationTracker } from './lib';

const binding = require('./dist/binding-browser');
let lib: dlib;

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
  ctx.drawImage(video, 0, 0);
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
  tracker: CorrelationTracker | undefined;

  private static ptr: number | undefined;

  static freeMemory() {
    if (!lib) return;
    if (this.ptr) {
      lib._free(this.ptr);
      this.ptr = undefined;
    }
  }

  static reserveMemory(video: HTMLVideoElement) {
    if (this.ptr) this.freeMemory();
    const makePtr = () => this.ptr = lib._malloc(video.videoWidth * video.videoHeight * 4);
    if (!lib) {
      lib = binding();
      lib.then(makePtr);
    } else {
      makePtr();
    }
  }

  private get videoArray2D() {
    if (!VideoCorrelationTracker.ptr) VideoCorrelationTracker.reserveMemory(this.video);
    return videoToArray2D(this.video, VideoCorrelationTracker.ptr as number);
  }

  get prediction(): Rectangle {
    if (!this.tracker) return { x: 0, y: 0, width: 0, height: 0 };
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
    const loadWithLib = () => {
      if (!VideoCorrelationTracker.ptr) VideoCorrelationTracker.reserveMemory(video);
      const _rect = new lib.Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
      this.tracker = new lib.CorrelationTracker();
      this.tracker.startTrack(this.videoArray2D, _rect);
    }
    if (!lib) {
      lib = binding();
      lib.then(loadWithLib);
    } else {
      loadWithLib();
    }
  }

  update(rect: Rectangle) {
    if (!this.tracker) return;
    const _rect = new lib.Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height)
    this.tracker.update(this.videoArray2D, _rect);
  }
}
