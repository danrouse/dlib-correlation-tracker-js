# dlib-correlation-tracker-js

Track moving objects in videos in Javascript using [dlib's correlation tracker](http://dlib.net/python/index.html#dlib.correlation_tracker). These bindings compile the module using [emscripten](http://emscripten.org/), providing the raw interface as well as a utility class to simplify working with an [HTML `<video>` element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement).

## Usage

```bash
$ npm install --save dlib-correlation-tracker-js
```

To use the DOM interface, create a new `VideoCorrelationTracker` with an `HTMLVideoElement` and the position of the object to track. A new prediction can be generated based on the video's current frame at any time by referring to `tracker.prediction`. The tracker can be fine-tuned by updating it with a user-specified rect using `tracker.update(rect)`.

```js
import { VideoCorrelationTracker } from 'dlib-correlation-tracker';

// begin by passing a video and a bounding box of what you want to track
const tracker = new VideoCorrelationTracker(document.querySelector('video'), { x, y, width, height });

// update the tracker with a specified rect when the video updates
tracker.update({ x, y, width, height });

// get the tracker's prediction for the current video frame
const { x, y, width, height } = tracker.prediction;

// if the video dimensions change, memory must be manually re-allocated
function onVideoDimensionsChange(video) {
  VideoCorrelationTracker.reserveMemory(video);
}

// memory must also be manually freed when done!
function onUnload() {
  VideoCorrelationTracker.freeMemory();
}
```
