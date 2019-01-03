#include <emscripten/bind.h>
#include "dlib/dlib/image_processing.h"

using namespace emscripten;
using namespace dlib;

void array2d_set(
  array2d<double> & arr,
  const unsigned & y,
  const unsigned & x,
  const double & value
) {
  arr[y][x] = value;
}

void start_track(
  correlation_tracker & correlation_tracker,
  const array2d<double> & img,
  const drectangle & bounding_box
) {
  return correlation_tracker.start_track(img, bounding_box);
}

drectangle update(
  correlation_tracker &correlation_tracker,
  const array2d<double> & img
) {
  correlation_tracker.update(img);
  return correlation_tracker.get_position();
}

EMSCRIPTEN_BINDINGS(my_module) {
  class_<array2d<double>>("Array2D")
    .constructor<>()
    .constructor<long, long>()
    .function("setSize", &array2d<double>::set_size)
    .function("set", &array2d_set)
    .property("width", &array2d<double>::nc)
    .property("height", &array2d<double>::nr)
    ;

  class_<drectangle>("Rectangle")
    .constructor<double, double, double, double>()
    .property("left", select_const(&drectangle::left))
    .property("top", select_const(&drectangle::top))
    .property("right", select_const(&drectangle::right))
    .property("bottom", select_const(&drectangle::bottom))
    .property("width", &drectangle::width)
    .property("height", &drectangle::height)
    ;

  class_<correlation_tracker>("CorrelationTracker")
    .constructor<>()
    .constructor<unsigned long>()
    .constructor<unsigned long, unsigned long>()
    .constructor<unsigned long, unsigned long, unsigned long>()
    .constructor<unsigned long, unsigned long, unsigned long, double>()
    .constructor<unsigned long, unsigned long, unsigned long, double, double>()
    .constructor<unsigned long, unsigned long, unsigned long, double, double, double>()
    .constructor<unsigned long, unsigned long, unsigned long, double, double, double, double>()
    .constructor<unsigned long, unsigned long, unsigned long, double, double, double, double, double>()
    .function("startTrack", &start_track)
    .function("update", &update)
    .function("getPosition", &correlation_tracker::get_position)
    ;
}
