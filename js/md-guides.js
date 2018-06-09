(function (extension) {
  if (typeof mdconverter == "undefined") throw Error("Could not find mdconverter");
  if (typeof emojiList == "undefined") throw Error("Could not find emojiList");
  if (typeof hljs == "undefined") throw Error("Could not find hljs");

  let mod = extension();

  if (typeof exports == 'object' && typeof module !== 'undefined') module.exports = mod;
  else window.mdguides = mod;
}(function () {
  // markdown guides
  var showdownOpt = "| **Key** | **Value** |" + "\n" 
                  + "|--------:|:----------|" + "\n";
  const opt = mdconverter.getOptions();
  for (let key in opt) {
    showdownOpt += "| `" + key + "` | `" + opt[key] + "` |\n";
  }

  let hljsLang = hljs.listLanguages();
  hljsLang.sort();

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
      "**Code:** nest with ```\n\n    ```\n    <multiple lines code>\n    <line 2>\n    ```\n\n" +
      "---\n\n" +
      "**Result:**\n\n```html\n<div class=\"center\">\n  <span class=\"new\">abc</span>\n</div>\n```\n\n" +
      "**Code:** define language for syntax highlight\n\n    ```html\n    <div class=\"center\">\n      <span class=\"new\">abc</span>\n    </div>\n    ```\n\n" +
      "Syntax highlight is supported using the [highlightjs](https://highlightjs.org/) library\n" +
      "| Supported languages | Aliases |\n" +
      "|:--------------------|:--------|\n" +
      hljsLang.map(e => {
        let l = hljs.getLanguage(e);
        return "| `" + e + "` |" + (l.aliases ? l.aliases.map(a => "`" + a + "`").join(" ") : "") + " |"
      }).join("\n") +
      "\n\n"
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
  }, {
    icon: "mdi-file-powerpoint",
    tooltip: "Presentation",
    guide: "To render the text as slides, click <i class='mdi mdi-file-document-box'></i> at the bottom of the display panel. "
      + "To render it as document, click <i class='mdi mdi-file-powerpoint'></i>.\n\n"
      + "**Buttons** \n"
      + "| Button | Function |\n"
      + "|:------:|:---------|\n"
      + "| <i class='mdi mdi-triangle mdi-rotate-270'></i> | Go to previous slide            |\n"
      + "| <i class='mdi mdi-triangle mdi-rotate-90'></i>  | Go to next slide                |\n"
      + "| <i class='mdi mdi-presentation-play'></i>       | Fullscreen view                 |\n"
      + "| <i class='mdi mdi-checkbox-multiple-blank-outline'></i>   | Clone slides in separate window |\n"
      + "| <i class='mdi mdi-file-presentation-box'></i>   | Toggle presenter mode           |\n"
      + "| <i class='mdi mdi-image-off'></i>               | Toggle blackout |\n"
      + "| <i class='mdi mdi-file-powerpoint'></i>         | Render as document              |\n"
      + "\n"
      + "**Keyboard shortcuts** \n"
      + "| Shortcut | Function |\n"
      + "|:--------:|:---------|\n"
      + "| <kbd class='mdi mdi-triangle mdi-rotate-270'></kbd> / <kbd class='mdi mdi-triangle'></kbd> / <kbd>PgUp</kbd> / <kbd>k</kbd>               | Go to previous slide |\n"
      + "| <kbd class='mdi mdi-triangle mdi-rotate-90'></kbd> / <kbd class='mdi mdi-triangle mdi-rotate-180'></kbd> / <kbd>PgDn</kbd> / <kbd>j</kbd> | Go to next slide     |\n"
      + "| <kbd>Home</kbd> | Go to first slide |\n"
      + "| <kbd>End</kbd> | Go to last slide |\n"
      + "| Number (<kbd>1</kbd>, <kbd>2</kbd>...) + <kbd>Return</kbd> | Go to specific slide |\n"
      + "| <kbd>b</kbd> | Toggle blackout mode |\n"
      + "| <kbd>m</kbd> | Toggle mirrored mode |\n"
      + "| <kbd>f</kbd> | Toggle fullscreen mode |\n"
      + "| <kbd>c</kbd> | Clone slides in separate window |\n"
      + "| <kbd>p</kbd> | Toggle presenter mode |\n"
      + "| <kbd>t</kbd> | Restart presentation timer |\n"
      + "| <kbd>?</kbd> / <kbd>h</kbd> | Toggle help |\n"
      + "\n"
      + "**Remark**\n"
      + "The slideshow in the cloned window is attached to the main window. That means when the slides are changed in either of the windows, the other one will follow. This does not apply to modification of slide content. The slides need to be re-cloned if the contents are modified."
  }, {
    icon: "mdi-file-powerpoint-box",
    tooltip: "Slides syntax",
    guide: "The parser for slides are forked from [remarkjs](https://github.com/gnab/remark). "
      + "It is modified to use external Markdown converter to support the same Markdown syntax when the text is rendered as document."
      + "Slide specific syntax are explained in the following sections."
      + "\n\n---\n\n"
      + "##### Slide separators\n"
      + "A single line with three dashes `---` represents a slide separator. This will render as two slides: \n"
      + "```markdown\n# First slide\n---\n# Second slide\n```\n"
      + "To create a horizontal rule, normally you can use three dashes. But when render as slides, use more than three dashes `----` to create a horizontal rule.\n"
      + "\n\n---\n\n"
      + "##### Incremental slides\n"
      + "To increment content from one slide to another without copying the whole slide text, a line with two dashed `--` can be used. This code: \n"
      + "```markdown\n# Slide title\n- bullet 1\n--\n\n- bullet 2\n```\n"
      + "will expand to:\n"
      + "```\n# Slide title\n- bullet 1\n---\n# Slide title\n- bullet 1\n- bullet 2\n```\n"
      + "\n\n---\n\n"
      + "##### Slide notes\n"
      + "A line with three question marks `???` separates the slide content and the slide note.\n"
      + "```markdown\n# Slide title\nContent\n\n???\nnotes...\n```\n"
      + "\n\n---\n\n"
      + "##### Comments\n"
      + "Two types of comment are available:\n"
      + "```markdown\n<!--\nComments\n-->\n```\n"
      + "```markdown\n[//]: # (Comments)\n```\n"
      + "\n\n---\n\n"
      + "##### Slide properties\n"
      + "Slide properties are defined at the beginning of a slide. They include `name`, `class`, `background-image`, `count`, `template`, `layout`, and `exclude`.\n"
      + "\n"
      + "**name: string**\n\n"
      + "The name will be used as the HTML element id of the current slide.\n"
      + "\n"
      + "**class: string1, string2**\n\n"
      + "The classes specified will be added to the HTML element class of the current slide. "
      + "Built-in classes (`left`, `center`, `right`, `top`, `middle`, `bottom`) can be used to align the entire slide.\n"
      + "\n"
      + "**background-image: url(image.location)**\n\n"
      + "This property maps directly to the CSS `background-image` property of the current slide.\n"
      + "\n"
      + "**count: true**\n\n"
      + "This is a boolean property which takes either `true` or `false` as property value. It will include or exclude the slide in the slide count.\n"
      + "\n"
      + "**template: name-of-a-slide**\n\n"
      + "The content of the template slide (in this case, slide with the name `name-of-a-slide`) will be prepended to the current slide."
      + "`name` and `layout` are not inherited, `class` are merged.\n"
      + "\nTemplate slides may also contain a special `{{content}}` expression to explicitly position the content of derived slides, instead of having it implicitly appended.\n"
      + "\n"
      + "**layout: true**\n\n"
      + "`layout` property is a boolean property, which takes `true` or `false` as value. The `layout` property, when defined as `true`, makes the current slide a layout slide, which is omitted from the slideshow and serves as the default template used for all subsequent slides."
      + "When defined as `false`, it reverts to using no default template.\n"
      + "\n"
      + "**exclude: true**\n\n"
      + "The `exclude` property, when set to true, hides a slide.\n"
      + "\n\n---\n\n"
      + "##### Content classes\n"
      + "```markdown\n.footnote.red[.bold[a] b]\n```\n"
      + "will render as\n"
      + "```html\n<span class=\"footnote red\">\n  <span class=\"bold\">a</span> b\n</span>\n```\n"
      + "Built-in content classes include `left`, `center`, and `right` can be used to align text blocks. "
      + "Classes `larger` and `smaller` are also available to enlarge or shrink the font size\n"
      + "\nIf content is on a new line, it will be rendered as `div` instead of `span`.\n"
      + "```markdown\n.footnote.red[.bold[a]\nb\n]\n```\n"
      + "will render as\n"
      + "```html\n<div class=\"footnote red\">\n  <p>\n    <span class=\"bold\">a</span>\n    b\n  </p>\n</div>\n```\n"
      + "If a square bracket is needed in the content, you can use [HTML code](https://www.ascii.cl/htmlcodes.htm) (`&#91;` for `[`, `&#93;` for `]`).\n\n"
      + "```markdown\n.footnote.red[.bold[a] b &#91; &#93;]\n```\n will render as \n```html\n<span class=\"footnote red\">\n  <span class=\"bold\">a</span> b [ ]\n</span>\n```\n"
      + "\n\n---\n\n"
      + "##### Jump to slide\n"
      + "To create link to a specific slide with the slide number, use the following format:\n"
      + "```html\n<a href=\"javascript:window.postMessage('gotoSlide:1', '*')\">link to slide 1</a>\n```"
  }];

  return mdguides;
}))