(function (extension) {
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }
}(function (showdown) {
  showdown.extension("timeline", {
    type: "lang",
    filter: function (text, converter) {
      let rgx = /^- \[tl\](?: |\n)*\[((?:[\s\S]*?)(?:[^\\]))\](?: |\n)*\[((?:[\s\S]*?)(?:[^\\]))\](?: |\n)*\[((?:[\s\S]*?)(?:[^\\]))\](?: |\n)*\[((?:[\s\S]*?)(?:[^\\]))\]/gm;
      return text.replace(rgx, (match, p1, p2, p3, p4) => {
        return '<blockquote class="timeline">'
        + '<div class="title">'
        + '<div class="head">' + converter.makeHtml(p1) + '</div>'
        + '<div class="content">' + converter.makeHtml(p2) + '</div>'
        + '</div>'
        + '<div class="body">'
        + '<div class="head">' + converter.makeHtml(p3) + '</div>'
        + '<div class="content">' + converter.makeHtml(p4) + '</div>'
        + '</div>'
        + '</blockquote>';
      })
    }
  });
}));