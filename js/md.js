(function (extension, window) {
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown, window);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown', 'window'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'), window);
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }
}(function (showdown, window) {
  const mdconverter = new showdown.Converter({
    tasklists: true,
    noHeaderId: true,
    parseImgDimensions: true,
    ghCodeBlocks: true,
    emoji: true,
    strikethrough: true,
    underline: true,
    tables: true,
    ghMentions: true,
    extensions: ["timeline"]
  });

  // function .convertMarkdown for remarkjs-mod
  var element = document.createElement("div");
  mdconverter.convertMarkdown = function (content, links, inline) {
    element.innerHTML = convertMarkdown(content, links || {}, inline);
    element.innerHTML = element.innerHTML.replace(/<p>\s*<\/p>/g, '');
    return element.innerHTML.replace(/\n\r?$/, '');
  }

  function convertMarkdown (content, links, insideContentClass) {
    var i, tag, markdown = '', html, full;

    for (i = 0; i < content.length; ++i) {
      if (typeof content[i] === 'string') {
        markdown += content[i];
      }
      else {
        tag = content[i].block ? 'div' : 'span';
        markdown += '<' + tag + ' class="' + content[i].class + '">';
        markdown += convertMarkdown(content[i].content, links, !content[i].block);
        markdown += '</' + tag + '>';
      }
    }

    full = markdown + Object.keys(links).map(k => "\n[" + k + "]: " + links[k].href);
    html = mdconverter.makeHtml(full);

    if (insideContentClass) {
      element.innerHTML = html;
      if (element.children.length === 1 && element.children[0].tagName === 'P') {
        html = element.children[0].innerHTML;
      }
    }

    return html;
  }

  // markdown guides
  var showdownOpt = "| **Key** | **Value** |" + "\n" 
                  + "|--------:|:----------|" + "\n";
  const opt = mdconverter.getOptions();
  for (let key in opt) {
    showdownOpt += "| `" + key + "` | `" + opt[key] + "` |\n";
  }

  const mdguides = [{
    icon: "mdi-information",
    tooltip: "Info",
    guide: "The markdown parser is provided by [ShowdownJS](https://github.com/showdownjs/showdown), a Javascript Markdown to HTML converter. The full syntax can be found [here](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax)." +
      "The library specific options are as follow: \n\n" + showdownOpt
  }, {
    icon: "mdi-format-paragraph",
    tooltip: "Paragraph",
    guide: "**Result:** single newline\ndoes not produce new line in rendered output\n\n" +
      "**Code:**\n```\nsingle newline\ndoes not produce new line in rendered output\n```\n" +
      "---\n" +
      "**Result:** two newlines\n\nproduce new paragraph\n\n" +
      "**Code:**\n```\ntwo newlines\n\nproduce new paragraph\n```\n" +
      "---\n" +
      "**Result:** \n```\nsingle newline\nin code block produces new line in rendered output\n```\n\n" +
      "**Code:**\n\n    ```\n    single newline\n    in code block produces new line in rendered output\n    ```\n\n"
  }, {
    icon: "mdi-format-annotation-plus",
    tooltip: "Text format",
    guide: "**Result:** *italic*\n\n**Code:** `*italic*`\n\n" +
      "---\n\n" +
      "**Result:** **bold**\n\n**Code:** `**bold**`\n\n" +
      "---\n\n" +
      "**Result:** ***bold italic***\n\n**Code:** `***bold italic***`\n\n" +
      "---\n\n" +
      "**Result:** ~~strike through~~\n\n**Code:** `~~strike through~~`\n\n" +
      "---\n\n" +
      "**Result:** __underline__\n\n**Code:** `__underline__`\n\n"
  }, {
    icon: "mdi-format-header-pound",
    tooltip: "Headings",
    guide: "**Result:**\n# h1 \n\n**Code:**\n`# h1`\n\nor\n```\nh1\n===\n```\n" +
      "---\n" +
      "**Result:**\n## h2 \n\n**Code:**\n`## h2`\n\nor\n```\nh2\n---\n```\n" +
      "---\n" +
      "**Result:**\n### h3 \n\n**Code:**\n`### h3`\n\n" +
      "---\n" +
      "**Result:**\n#### h4 \n\n**Code:**\n`#### h4`\n\n" +
      "---\n" +
      "**Result:**\n##### h5 \n\n**Code:**\n`##### h5`\n\n" +
      "---\n" +
      "**Result:**\n###### h6 \n\n**Code:**\n`###### h6`\n\n" +
      "---\n" +
      "**Result:**\nnormal text \n\n**Code:**\n`normal text`"
  }, {
    icon: "mdi-format-list-checks",
    tooltip: "Tasklist",
    guide: "**Result:**\n" +
      "- [x] checked list item\n" +
      "- [] unchecked list item\n\n" +
      "**Code:**\n" +
      "```\n" +
      "- [x] checked list item\n" +
      "- [ ] unchecked list item\n" +
      "```"
  }, {
    icon: "mdi-format-list-numbers",
    tooltip: "Ordered list",
    guide: "**Result:**\n" +
      "1. item 1\n" +
      "2. item 2\n" +
      "3. item 3\n\n" +
      "**Code:**\n" +
      "```\n" +
      "1. item 1\n" +
      "2. item 2\n" +
      "3. item 3\n" +
      "```"
  }, {
    icon: "mdi-format-list-bulleted",
    tooltip: "Unordered list",
    guide: "**Result:**\n" +
      "* item 1 \n" +
      "* item 2 \n" +
      "* item 3 \n\n" +
      "**Code:**\n" +
      "```\n" +
      "* item 1 \n" +
      "* item 2 \n" +
      "* item 3 \n" +
      "```\n" +
      "or\n" +
      "```\n" +
      "+ item 1 \n" +
      "+ item 2 \n" +
      "+ item 3 \n" +
      "```\n" +
      "or\n" +
      "```\n" +
      "- item 1 \n" +
      "- item 2 \n" +
      "- item 3 \n" +
      "```"
  }, {
    icon: "mdi-format-list-bulleted-type",
    tooltip: "Nested list",
    guide: "Use 4 spaces to nest an inner list\n\n" +
      "**Result:**\n\n" +
      "+ outer 1\n" +
      "    - outer 1 inner 1\n" +
      "+ outer 2\n" +
      "    1. outer 2 inner 1\n" +
      "    2. outer 2 inner 2\n" +
      "        + outer 2 inner 2 deep 1\n\n" +
      "**Code:**\n" +
      "```\n" +
      "+ outer 1\n" +
      "    - outer 1 inner 1\n" +
      "+ outer 2\n" +
      "    1. outer 2 inner 1\n" +
      "    2. outer 2 inner 2\n" +
      "        + outer 2 inner 2 deep 1\n" +
      "```"
  }, {
    icon: "mdi-table",
    tooltip: "Table",
    guide: "**Result:**\n\n" +
      "| first column      | second column | third column   | fourth column |" + "\n" +
      "|-------------------|:--------------|:--------------:|--------------:|" + "\n" +
      "| default alignment | aligned left  | aligned center | aligned right |" + "\n" +
      "| column 1          | column 2      | column 3       | column 4      |" + "\n\n" +
      "**Code:**\n\n" +
      "```" + "\n" +
      "| first column      | second column | third column   | fourth column |" + "\n" +
      "|-------------------|:--------------|:--------------:|--------------:|" + "\n" +
      "| default alignment | aligned left  | aligned center | aligned right |" + "\n" +
      "| column 1          | column 2      | column 3       | column 4      |" + "\n" +
      "\n" + "```"
  }, {
    icon: "mdi-code-tags",
    tooltip: "Code",
    guide: "**Result:** `<inline code>` \n\n" +
      "**Code:**\n\n    `<inline code>`\n\n" +
      "---\n\n" +
      "**Result:**\n\n    <multiple lines code>\n    <line 2>\n\n" +
      "**Code:** Indent by 4 spaces\n\n        <multiple lines code>\n        <line 2>\n\n" +
      "---\n\n" +
      "**Result:**\n\n```\n<multiple lines code>\n<line 2>\n```\n\n" +
      "**Code:** nest with ````\n\n    ```\n    <multiple lines code>\n    <line 2>\n    ```\n\n"
  }, {
    icon: "mdi-format-quote-open",
    tooltip: "Quote",
    guide: "**Result:**\n > Each line of quotes are newline starts with > " + "\n\n" +
      "**Code:**\n\n```\n> Each line of quotes are newline starts with > \n```"
  }, {
    icon: "mdi-link",
    tooltip: "Link",
    guide: "**Result:** [name](http://link.lk) \n\n **Code:** `[name](http://link.lk)`" + "\n\n" +
      "---\n\n" +
      "**Result:** <http://link.lk> \n\n **Code:** `<http://link.lk>`" + "\n\n" +
      "---\n\n" +
      "**Result:** [link][1]\n\n **Code:** Reference style. The reference should be at the end of the document.\n\n```\n[link][1]\n[1]: http://link.lk\n```" +
      "---\n\n" +
      "**Result:** [link][]\n\n **Code:** Reference style. The reference should be at the end of the document.\n\n```\n[link][]\n[link]: http://link.lk\n```" +
      "\n[1]: http://link.lk\n[link]: http://link.lk"
  }, {
    icon: "mdi-image",
    tooltip: "Image",
    guide: "**Result:**\n\n![Alt-text](img/img-100.png)\n\n" +
      "**Code:**\n```\n![Alt-text](img/img-100.png)\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text](no-img/img.png)\n\n" +
      "**Code:**\n```\n![Alt-text](no-img/img.png)\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text](img/img.png =200x50)\n\n" +
      "**Code:**\n```\n![Alt-text](img/img.png =200x50)\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text](img/img.png =200x*)\n\n" +
      "**Code:**\n```\n![Alt-text](img/img.png =200x*)\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text](img/img.png =*x50)\n\n" +
      "**Code:**\n```\n![Alt-text](img/img.png =*x50)\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text](img/img.png =*x50 'Optional text')\n\n" +
      "**Code:**\n```\n![Alt-text](img/img.png =*x50 'Optional text')\n```" +
      "---\n\n" +
      "**Result:**\n\n![Alt-text][1]\n\n" +
      "**Code:** Reference style. The reference should be at the end of the document.\n\n" +
      "```\n![Alt-text][1]\n[1]: img/img.png =*x50 'Optional text'\n```\n\n" +
      "[1]: img/img.png =*x50 'Optional text'"
  }, {
    icon: "mdi-dots-horizontal",
    tooltip: "Separator",
    guide: "**Result:** \n\n---\n\n" +
      "**Code:** Three dashes (`---`), underscores (`___`), or asterisks (`***`) produce a separator"
  }, {
    icon: "mdi-language-html5",
    tooltip: "HTML tags",
    guide: "HTML tags are supported. To parse text inside an HTML tag with markdown, use the HTML attribute `markdown`, `markdown='1'`, or `data-markdown='1'`.\n\n" +
      "**Result**: <div markdown>~~strike through~~</div>\n\n" +
      "**Code**: `<div markdown>~~strike through~~</div>`\n\n"
  }, {
    icon: "mdi-emoticon",
    tooltip: "Emoji",
    guide: "Supported emoji:\n\n| Emoji | Code |\n|---:|:---|\n" + emojiList.map((el) => "| " + el + " | `" + el + "` |\n").join("") +
      "\n\nBased on [emojis in Showdown](https://github.com/showdownjs/showdown/wiki/emojis)"
  }, {
    icon: "mdi-at",
    tooltip: "Github mentions",
    guide: "**Result:** @ricwtk\n\n" +
      "**Code:** `@ricwtk`"
  }, {
    icon: "mdi-json",
    tooltip: "Escaping entities",
    guide: "Escape special characters with backslash `\\`. These characters are supported:\n\n" +
      "| Result | Code         | Name              |\n" +
      "|--------|--------------|-------------------|\n" +
      "|\\      |`\\\\`        |backslash          |\n" +
      "|\`      |<code>`</code>|backtick           |\n" +
      "|\*      |`\\*`         |asterisk           |\n" +
      "|\_      |`\\_`         |underscore         |\n" +
      "|\{\}    |`\\{\\}`      |curly brace        |\n" +
      "|\[\]    |`\\[\\]`      |square brackets    |\n" +
      "|\(\)    |`\\(\\)`      |parentheses        |\n" +
      "|\#      |`\\#`         |hash mark          |\n" +
      "|\+      |`\\+`         |plus sign          |\n" +
      "|\-      |`\\-`         |minus sign (hyphen)|\n" +
      "|\.      |`\\.`         |dot                |\n" +
      "|\!      |`\\!`         |exclamation mark   |\n"
  }, {
    icon: "mdi-chart-gantt",
    tooltip: "Timeline",
    guide: "**Result:** \n- [tl] [date] [time] [title] [description]\n\n" +
      "**Code:** \n\n`- [tl] [date] [time] [title] [description]`"
  }];

  if(typeof(window.mdconverter) === 'undefined'){
    window.mdconverter = mdconverter;
  }
  if(typeof(window.mdguides) === 'undefined'){
    window.mdguides = mdguides;
  }
}, window));