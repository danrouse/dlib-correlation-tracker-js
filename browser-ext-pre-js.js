Module["locateFile"] = function(path, scriptDir) {
  return chrome.extension.getURL(path);
}
