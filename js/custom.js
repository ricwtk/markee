var mdconverter = new showdown.Converter({
  smoothPreview: true,
  ghCodeBlocks: true,
  tables: true,
  tasklists: true,
  parseImgDimensions: true,
  emoji: true,
  ghMentions: true,
  strikethrough: true,
  underline: true
})

var showdownOpt = "| **Key** | **Value** |" + "\n"
  + "|-------:|:-------|" + "\n"
const opt = mdconverter.getOptions()
for (let key in opt) {
  showdownOpt += "| `" + key + "` | `" + opt[key] + "` |\n"
}


const guides = [
  {
    icon: "mdi-information",
    tooltip: "Info",
    guide: "The markdown parser is provided by [ShowdownJS](https://github.com/showdownjs/showdown), a Javascript Markdown to HTML converter. The full syntax can be found [here](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax)."
      + "The library specific options are as follow: \n\n" + showdownOpt
  },{
    icon: "mdi-format-paragraph",
    tooltip: "Paragraph",
    guide: "**Result:** single newline\ndoes not produce new line in rendered output\n\n"
      + "**Code:**\n```\nsingle newline\ndoes not produce new line in rendered output\n```\n"
      + "---\n"
      + "**Result:** two newlines\n\nproduce new paragraph\n\n"
      + "**Code:**\n```\ntwo newlines\n\nproduce new paragraph\n```\n"
      + "---\n"
      + "**Result:** \n```\nsingle newline\nin code block produces new line in rendered output\n```\n\n"
      + "**Code:**\n\n    ```\n    single newline\n    in code block produces new line in rendered output\n    ```\n\n"
  },{
    icon: "mdi-format-annotation-plus",
    tooltip: "Text format",
    guide: "**Result:** *italic*\n\n**Code:** `*italic*`\n\n" 
      + "---\n\n"
      + "**Result:** **bold**\n\n**Code:** `**bold**`\n\n" 
      + "---\n\n"
      + "**Result:** ***bold italic***\n\n**Code:** `***bold italic***`\n\n" 
      + "---\n\n"
      + "**Result:** ~~strike through~~\n\n**Code:** `~~strike through~~`\n\n" 
      + "---\n\n"
      + "**Result:** __underline__\n\n**Code:** `__underline__`\n\n" 
  },{
    icon: "mdi-format-header-pound",
    tooltip: "Headings",
    guide: "**Result:**\n# h1 \n\n**Code:**\n`# h1`\n\nor\n```\nh1\n===\n```\n"
      + "---\n"
      + "**Result:**\n## h2 \n\n**Code:**\n`## h2`\n\nor\n```\nh2\n---\n```\n"
      + "---\n"
      + "**Result:**\n### h3 \n\n**Code:**\n`### h3`\n\n"
      + "---\n"
      + "**Result:**\n#### h4 \n\n**Code:**\n`#### h4`\n\n"
      + "---\n"
      + "**Result:**\n##### h5 \n\n**Code:**\n`##### h5`\n\n"
      + "---\n"
      + "**Result:**\n###### h6 \n\n**Code:**\n`###### h6`\n\n"
      + "---\n"
      + "**Result:**\nnormal text \n\n**Code:**\n`normal text`"
  },{
    icon: "mdi-format-list-checks",
    tooltip: "Tasklist",
    guide: "**Result:**\n"
      + "- [x] checked list item\n"
      + "- [] unchecked list item\n\n"
      + "**Code:**\n"
      + "```\n"
      + "- [x] checked list item\n"
      + "- [ ] unchecked list item\n"
      + "```"
  },{
    icon: "mdi-format-list-numbers",
    tooltip: "Ordered list",
    guide: "**Result:**\n"
      + "1. item 1\n"
      + "2. item 2\n"
      + "3. item 3\n\n"
      + "**Code:**\n"
      + "```\n"
      + "1. item 1\n"
      + "2. item 2\n"
      + "3. item 3\n"
      + "```"
  },{
    icon: "mdi-format-list-bulleted",
    tooltip: "Unordered list",
    guide: "**Result:**\n"
      + "* item 1 \n"
      + "* item 2 \n"
      + "* item 3 \n\n"
      + "**Code:**\n"
      + "```\n"
      + "* item 1 \n"
      + "* item 2 \n"
      + "* item 3 \n"
      + "```\n"
      + "or\n"
      + "```\n"
      + "+ item 1 \n"
      + "+ item 2 \n"
      + "+ item 3 \n"
      + "```\n"
      + "or\n"
      + "```\n"
      + "- item 1 \n"
      + "- item 2 \n"
      + "- item 3 \n"
      + "```"
  },{
    icon: "mdi-format-list-bulleted-type",
    tooltip: "Nested list",
    guide: "Use 4 spaces to nest an inner list\n\n"
      + "**Result:**\n\n"
      + "+ outer 1\n"
      + "    - outer 1 inner 1\n"
      + "+ outer 2\n"
      + "    1. outer 2 inner 1\n"
      + "    2. outer 2 inner 2\n"
      + "        + outer 2 inner 2 deep 1\n\n"
      + "**Code:**\n"
      + "```\n"
      + "+ outer 1\n"
      + "    - outer 1 inner 1\n"
      + "+ outer 2\n"
      + "    1. outer 2 inner 1\n"
      + "    2. outer 2 inner 2\n"
      + "        + outer 2 inner 2 deep 1\n"
      + "```"
  },{
    icon: "mdi-table",
    tooltip: "Table",
    guide: "**Result:**\n\n"
      +    "| first column      | second column | third column   | fourth column |" + "\n"
      +    "|-------------------|:--------------|:--------------:|--------------:|" + "\n"
      +    "| default alignment | aligned left  | aligned center | aligned right |" + "\n"
      +    "| column 1          | column 2      | column 3       | column 4      |" + "\n\n"
      +    "**Code:**\n\n"
      +    "```" + "\n"
      +    "| first column      | second column | third column   | fourth column |" + "\n"
      +    "|-------------------|:--------------|:--------------:|--------------:|" + "\n"
      +    "| default alignment | aligned left  | aligned center | aligned right |" + "\n"
      +    "| column 1          | column 2      | column 3       | column 4      |" + "\n"
      +    "\n" + "```"
  },{
    icon: "mdi-code-tags",
    tooltip: "Code",
    guide: "**Result:** `<inline code>` \n\n" 
      + "**Code:**\n\n    `<inline code>`\n\n"
      + "---\n\n"
      + "**Result:**\n\n    <multiple lines code>\n    <line 2>\n\n"
      + "**Code:** Indent by 4 spaces\n\n        <multiple lines code>\n        <line 2>\n\n"
      + "---\n\n"
      + "**Result:**\n\n```\n<multiple lines code>\n<line 2>\n```\n\n"
      + "**Code:** nest with ````\n\n    ```\n    <multiple lines code>\n    <line 2>\n    ```\n\n"
  },{
    icon: "mdi-format-quote-open",
    tooltip: "Quote",
    guide: "**Result:**\n > Each line of quotes are newline starts with > " + "\n\n"
      + "**Code:**\n\n```\n> Each line of quotes are newline starts with > \n```"
  },{
    icon: "mdi-link",
    tooltip: "Link",
    guide: "**Result:** [name](http://link.lk) \n\n **Code:** `[name](http://link.lk)`" + "\n\n"
      + "---\n\n"
      + "**Result:** <http://link.lk> \n\n **Code:** `<http://link.lk>`" + "\n\n"
      + "---\n\n"
      + "**Result:** [link][1]\n\n **Code:** Reference style. The reference should be at the end of the document.\n\n```\n[link][1]\n[1]: http://link.lk\n```"
      + "---\n\n"
      + "**Result:** [link][]\n\n **Code:** Reference style. The reference should be at the end of the document.\n\n```\n[link][]\n[link]: http://link.lk\n```"
      + "\n[1]: http://link.lk\n[link]: http://link.lk"
  },{
    icon: "mdi-image",
    tooltip: "Image",
    guide: "**Result:**\n\n![Alt-text](img/img-100.png)\n\n"
      + "**Code:**\n```\n![Alt-text](img/img-100.png)\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text](no-img/img.png)\n\n"
      + "**Code:**\n```\n![Alt-text](no-img/img.png)\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text](img/img.png =200x50)\n\n"
      + "**Code:**\n```\n![Alt-text](img/img.png =200x50)\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text](img/img.png =200x*)\n\n"
      + "**Code:**\n```\n![Alt-text](img/img.png =200x*)\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text](img/img.png =*x50)\n\n"
      + "**Code:**\n```\n![Alt-text](img/img.png =*x50)\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text](img/img.png =*x50 'Optional text')\n\n"
      + "**Code:**\n```\n![Alt-text](img/img.png =*x50 'Optional text')\n```"
      + "---\n\n"
      + "**Result:**\n\n![Alt-text][1]\n\n"
      + "**Code:** Reference style. The reference should be at the end of the document.\n\n"
      + "```\n![Alt-text][1]\n[1]: img/img.png =*x50 'Optional text'\n```\n\n"
      + "[1]: img/img.png =*x50 'Optional text'"
  },{
    icon: "mdi-dots-horizontal",
    tooltip: "Separator",
    guide: "**Result:** \n\n---\n\n"
      + "**Code:** Three dashes (`---`), underscores (`___`), or asterisks (`***`) produce a separator"
  },{
    icon: "mdi-language-html5",
    tooltip: "HTML tags",
    guide: "HTML tags are supported. To parse text inside an HTML tag with markdown, use the HTML attribute `markdown`, `markdown='1'`, or `data-markdown='1'`.\n\n"
      + "**Result**: <div markdown>~~strike through~~</div>\n\n"
      + "**Code**: `<div markdown>~~strike through~~</div>`\n\n"
  },{
    icon: "mdi-emoticon",
    tooltip: "Emoji",
    guide: "Supported emoji:\n\n| Emoji | Code |\n|---:|:---|\n" + emojiList.map((el) => "| " + el + " | `" + el + "` |\n").join("")
      + "\n\nBased on [emojis in Showdown](https://github.com/showdownjs/showdown/wiki/emojis)"
  },{
    icon: "mdi-at",
    tooltip: "Github mentions",
    guide: "**Result:** @ricwtk\n\n"
      + "**Code:** `@ricwtk`"
  },{
    icon: "mdi-json",
    tooltip: "Escaping entities",
    guide: "Escape special characters with backslash `\\`. These characters are supported:\n\n"
      + "| Result | Code         | Name              |\n"
      + "|--------|--------------|-------------------|\n"
      + "|\\      |`\\\\`        |backslash          |\n"
      + "|\`      |<code>`</code>|backtick           |\n"
      + "|\*      |`\\*`         |asterisk           |\n"
      + "|\_      |`\\_`         |underscore         |\n"
      + "|\{\}    |`\\{\\}`      |curly brace        |\n"
      + "|\[\]    |`\\[\\]`      |square brackets    |\n"
      + "|\(\)    |`\\(\\)`      |parentheses        |\n"
      + "|\#      |`\\#`         |hash mark          |\n"
      + "|\+      |`\\+`         |plus sign          |\n"
      + "|\-      |`\\-`         |minus sign (hyphen)|\n"
      + "|\.      |`\\.`         |dot                |\n"
      + "|\!      |`\\!`         |exclamation mark   |\n"
  }
]

const initialText = 
`# This is a h1 heading

This is normal text.

Paragraphs are separated with two newlines.

1. This is an ordered list.
2. There are two items on this list.

- This is an unordered list.
- There are also two items on this list.

\`\`\`
This is a code block
with multiple lines
\`\`\`

Supported markdown syntax can be found on the guide bar.
`

new Vue({
  el: "#navbar",
  data: {
    guides: guides,
    nguideshown: 3,
    fileDot: {
      color: "#F44336" // red #8BC34A green
    }
  },
  methods: {
    clickUser: function () {
      document.querySelector("#modal-user").classList.toggle("active")
    },
    getN: function (str) {
      if (str == "") return 0
      return parseInt(str.match(/\d+/g))
    },
    updateNGuideShown: function () {
      let barStyle = window.getComputedStyle(this.$el.querySelector("#md-guide"))
      let totalXPadding = this.getN(barStyle.getPropertyValue("padding")) + this.getN(barStyle.getPropertyValue("padding-left")) + this.getN(barStyle.getPropertyValue("padding-right"))
      this.nguideshown = (this.getN(barStyle.getPropertyValue("width")) - totalXPadding - 24) / (24+8)
    },
    clickGuide: function (g) {
      modalGuide.title = g.tooltip
      modalGuide.rawContent = g.guide
      modalGuide.toggleModal()
    }
  },
  mounted: function () {
    Vue.nextTick(() => {
      window.addEventListener("resize", this.updateNGuideShown)
      this.updateNGuideShown()
    })
  }
})


var modalUser = new Vue({
  el: "#modal-user",
  methods: {
    closeModal: function () {
      this.$el.classList.toggle("active")
    }
  }
})

var modalGuide = new Vue({
  el: "#modal-guide",
  data: {
    title: "Guide title",
    rawContent: "",
    mdTheme: "default"
  },
  computed: {
    compiledContent: function () {
      return mdconverter.makeHtml(this.rawContent)
    }
  },
  methods: {
    toggleModal: function () {
      this.$el.classList.toggle("active")
    }
  }
})

var contentContainer = {
  props: ["contenteditable", "wrapperId", "hideSm", "content", "contentTheme"],
  data: function () {
    return {
      height: 80,
      heightd: 3,
      heightmin: 30,
      wrapperClass: {
        "column": true,
        "col-6": true,
        "col-sm-12": true,
        "hide-sm": this.hideSm
      }
    }
  },
  computed: {
    style: function () {
      return {
        height: this.height + "vh"
      }
    }
  },
  methods: {
    decreaseHeight: function () {
      this.height = Math.max(this.height - this.heightd, this.heightmin)
    },
    increaseHeight: function () {
      this.height += this.heightd
    },
    sendEditedContent: function (ev) {
      this.$emit("input", ev.target.value)
    },
    addTab: function (e) {
      e.preventDefault()
      this.$emit("addtab", this.$refs.textarea)
    },
    boldText: function (e) {
      e.preventDefault()
      this.$emit("boldtext", this.$refs.textarea)
    },
    italicText: function (e) {
      e.preventDefault()
      this.$emit("italictext", this.$refs.textarea)
    }
  },
  template: `
  <span :id="wrapperId" :class="wrapperClass">
    <div :class="['actual', 'col-12', 'relative', 'md-'+contentTheme]" :style="style">
      <textarea v-if="contenteditable" class="p-1" ref="textarea" 
        :value="content" 
        @input="sendEditedContent" 
        @keydown.tab="addTab"
        @keyup.ctrl.66.exact="boldText"
        @keydown.ctrl.66.exact="e => e.preventDefault()"
        @keyup.ctrl.73.exact="italicText"
        @keydown.ctrl.73.exact="e => e.preventDefault()">
      </textarea>
      <div v-else v-html="content" class="p-1">
      </div>
      <span class="controls absolute pr-2">
        <div class="height-minus mdi mdi-24px mdi-arrow-up-thick c-hand tooltip tooltip-left" data-tooltip="Decrease height" @click="decreaseHeight"></div>
        <div class="height-plus mdi mdi-24px mdi-arrow-down-thick c-hand tooltip tooltip-left" data-tooltip="Increase height" @click="increaseHeight"></div>
      </span>
    </div>
  </span>
  `
}

var content = new Vue({
  el: "#content",
  data: {
    rawDoc: initialText,
  },
  computed: {
    compiledDoc: function () {
      return mdconverter.makeHtml(this.rawDoc)
    }
  },
  components: {
    "content-container": contentContainer
  },
  methods: {
    switchTo: function (ev) {
      document.querySelectorAll("#content-tabs a").forEach((el) => {
        if (el == ev.target) el.classList.add("active")
        else el.classList.remove("active")
      })
      let allChildren = document.querySelector("#content #actual-content").children
      for (let i = 0; i < allChildren.length; i++) {
        if (allChildren[i].id == ev.target.dataset.target) allChildren[i].classList.remove("hide-sm")
        else allChildren[i].classList.add("hide-sm")
      }
    },
    updateRaw: function (raw) {
      this.rawDoc = raw
    },
    addTab: function (ta) {
      this.rawDoc = this.rawDoc.slice(0, ta.selectionStart+1) + "    " + this.rawDoc.slice(ta.selectionEnd)
      ta.selectionStart += 4;
      ta.selectionEnd += 4;
    },
    boldText: function (ta) {
      this.rawDoc = this.rawDoc.slice(0, ta.selectionStart) + "**" + this.rawDoc.slice(ta.selectionStart, ta.selectionEnd+1) + "**" + this.rawDoc.slice(ta.selectionEnd)
      ta.selectionStart += 2;
      ta.selectionEnd += 2;
    },
    italicText: function (ta) {
      this.rawDoc = this.rawDoc.slice(0, ta.selectionStart) + "*" + this.rawDoc.slice(ta.selectionStart, ta.selectionEnd+1) + "*" + this.rawDoc.slice(ta.selectionEnd)
      ta.selectionStart += 1;
      ta.selectionEnd += 1;
    }
  }
})

// Vue.nextTick(function () {
//   content.rawDoc = "# h1"
// })