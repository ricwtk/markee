(function (extension) {
  if (typeof showdown !== 'undefined' && hljs !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown, hljs);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown', 'hljs'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'), require('highlightjs'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown and/or highlight.js libraries');
  }
}(function (showdown, hljs) {
  var langList = hljs.listLanguages().map(l => {
    let lObj = hljs.getLanguage(l);
    if (lObj.aliases) return [l, ...lObj.aliases];
    else return [l];
  }).reduce((a,i) => [...a, ...i], []);
  // adapt from https://github.com/unional/showdown-highlightjs-extension/
  function htmlunencode(text) {
    return (
      text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    );
  }
  // use new showdown's regexp engine to conditionally parse codeblocks
  const left = '<pre><code\\b[^>]*>'
  const right = '</code></pre>'
  const flags = 'g'

  function replacement(_wholeMatch, match, left, right) {
    let lang;
    lang = left.match(/language-(.*)\b/);
    if (lang && langList.includes(lang[1])) {
      // unescape match to prevent double escaping
      return left + hljs.highlight(lang[1], htmlunencode(match)).value + right;
    }  else {
      return left + match + right;
    }
  };

  const cdleft = "<code\\b[^>]*>";
  const cdright = "</code>";
  const cdflags = "g";

  function cdreplacement(_wholeMatch, match, left, right) {
    if (left.includes("class")) {
      left = left.replace("class=\"", "class=\"hljs ");
    } else {
      left = left.slice(0,-1) + " class=\"hljs\">";
    }
    return left + match + right;
  }

  showdown.extension("highlightjs", function () {
    return [{
      type: "output",
      filter: function (text, converter) {
        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
      }
    }, {
      type: "output",
      filter: function (text, converter) {
        return showdown.helper.replaceRecursiveRegExp(text, cdreplacement, cdleft, cdright, cdflags);
      }
    }]
  });
}));