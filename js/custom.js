var gd;
var signedInStatus = {
  google: false,
  onedrive: false,
  dropbox: false
}
var urlParams = (new URL(location)).searchParams;
var notiObj = {
  notifications: [],
  notify(msg, stat) {
    this.notifications.push({
      statusClass: stat ? "toast-" + stat : "",
      message: msg
    })
  }
}
var openedFile = {
  name: "Unsaved.md",
  id: "",
  paths: [],
  pathsInName: [],
  parents: [],
  raw: "",
  saved: ""
}
var fileExplorerOptions = {
  type: 0,
  TYPE: {
    CREATENEW: 0,
    OPENFILE: 1,
    SAVEAS: 2
  }
}

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
`;
openedFile.raw = initialText;

var modalLoading = new Vue({
  el: "#modal-loading",
  data: {
    activate: false,
    loadingText: "Loading more words",
    fontSizeStyle: {
      "font-size": "1000%"
    }
  },
  mounted: function () {
    window.addEventListener("resize", this.setFontSize);
    this.setFontSize();
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.setFontSize);
  },
  methods: {
    setFontSize: function () {
      let fs = parseInt(this.fontSizeStyle["font-size"].match(/\d+/g));
      let ww = window.innerWidth - 30;
      let tw = parseInt(window.getComputedStyle(this.$refs.loadingText).width.match(/\d+/g));
      this.fontSizeStyle["font-size"] = (ww / tw * fs) + "%";
    }
  }
})

new Vue({
  el: "#navbar",
  data: {
    guides: guides,
    nguideshown: 3,
    openedFile: openedFile,
    notiObj: notiObj,
    saving: false
  },
  computed: {
    fileDot: function () {
      return {
        color: this.openedFile.raw == this.openedFile.saved ? "#8BC34A" : "#F44336"
      }
    },
    fileSavedString: function () {
      return this.openedFile.raw == this.openedFile.saved ? "File saved" : "File unsaved";
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
    },
    createNewFile: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.CREATENEW;
      modalFileExplorer.toggleModal();
    },
    saveFile: function () {
      if (this.openedFile.id) {
        this.saving = true;
        gd.updateFileContent(this.openedFile.id, this.openedFile.raw).then((res) => {
          if (res.status == 200) {
            this.openedFile.saved = this.openedFile.raw;
          } else {
            notiObj.notify(res.body, "error");
          }
          this.saving = false;
        });
      } else {
        this.saveAs();
      }
    },
    saveAs: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.SAVEAS;
      modalFileExplorer.toggleModal();
    },
    openFile: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.OPENFILE;
      modalFileExplorer.toggleModal();
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
  data: {
    signedIn: signedInStatus
  },
  methods: {
    closeModal: function () {
      if (Object.values(signedInStatus).some(el => el))
        this.$el.classList.toggle("active")
    },
    signInGoogle: function () {
      gd.handleSignInClick();
    },
    signOut: function () {
      gd.handleSignOutClick();
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

var modalFileExplorer = new Vue({
  el: "#modal-file-explorer",
  data: {
    options: fileExplorerOptions,
    list: [],
    folder: {
      name: "Folder name",
      id: ""
    },
    nextPageToken: "",
    loadingNextPage: false,
    selectedFile: null,
    loadingList: false,
    loadingFolder: false
  },
  computed: {
    title: function () {
      switch (this.options.type) {
        case this.options.TYPE.CREATENEW:
          return "Create new file";
        case this.options.TYPE.OPENFILE:
          return "Open file";
        case this.options.TYPE.SAVEAS:
          return "Save as";
      }
    },
    actionTitle: function () {
      switch (this.options.type) {
        case this.options.TYPE.CREATENEW:
          return "Save here";
        case this.options.TYPE.OPENFILE:
          return "Open";
        case this.options.TYPE.SAVEAS:
          return "Save here";
      }
    }
  },
  mounted: function () {
    this.$refs.fileList.addEventListener("scroll", (ev) => {
      if (this.$refs.fileList.scrollTop >= (this.$refs.fileList.scrollHeight - this.$refs.fileList.offsetHeight)) {
        if (!this.loadingNextPage && this.nextPageToken !== "") {
          this.loadingNextPage = true;
          gd.getChildren(this.folder.id, this.nextPageToken)
            .then((res) => {
              this.list.push(...res.result.files);
              if (res.result.nextPageToken) {
                this.nextPageToken = res.result.nextPageToken;
              } else {
                this.nextPageToken = "";
              }
              this.loadingNextPage = false;
            })
        }
      }
    })
  },
  methods: {
    toggleModal: function () {
      this.$el.classList.toggle("active");
      if (this.$el.classList.contains("active")) {
        if (openedFile.parents.length > 0) {
          this.updateFileExplorer(openedFile.parents[0]);
        } else {
          this.updateFileExplorer("root");
        }
      }
    },
    updateFileExplorer: function (folderId) {
      this.$el.querySelectorAll(".file-tile.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      this.loadingFolder = true;
      gd.getFileMetadata(folderId)
        .then((res) => {
          this.folder = res.result;
          this.loadingFolder = false;
        });
      this.loadingList = true;
      gd.getChildren(folderId)
        .then((res) => {
          this.list = res.result.files;
          if (res.result.nextPageToken) {
            this.nextPageToken = res.result.nextPageToken;
          } else {
            this.nextPageToken = "";
          }
          this.loadingList = false;
        })
    },
    onClickFile: function (file, target) {
      this.$el.querySelectorAll(".file-tile.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      this.$refs[target][0].classList.add("selected");
      if (file.mimeType.includes("vnd.google-apps.folder")) {
        this.selectedFile = null;
        this.updateFileExplorer(file.id);
      } else {
        if (this.options.type == this.options.TYPE.OPENFILE) {
          this.selectedFile = file;
        } else {
          
        }
      }
    },
    goUpALevel: function () {
      this.updateFileExplorer(this.folder.parents[0]);
    },
    clickAction: function () {
      if (this.options.type == this.options.TYPE.CREATENEW) {
        if (this.$refs.fileNameToSave.textContent) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Creating file";
          modalLoading.activate = true;
          gd.createFile(this.folder.id, this.$refs.fileNameToSave.textContent, initialText)
            .then((res) => {
              if (res.status == 200) {
                modalLoading.loadingText = "Opening file";
                modalLoading.activate = true;
                gd.openFile(res.result.id);
              }
            });
        }
      } else if (this.options.type == this.options.TYPE.OPENFILE) {
        if (this.selectedFile) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Opening file";
          modalLoading.activate = true;
          gd.openFile(this.selectedFile.id);
        }
      } else if(this.options.type == this.options.TYPE.SAVEAS) {
        if (this.$refs.fileNameToSave.textContent) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Creating and saving file";
          modalLoading.activate = true;
          gd.createFile(this.folder.id, this.$refs.fileNameToSave.textContent, openedFile.raw)
            .then((res) => {
              if (res.status == 200) {
                modalLoading.loadingText = "Opening file";
                modalLoading.activate = true;
                gd.openFile(res.result.id);
              }
            });
        }
      }  
    }
  },
})

new Vue({
  el: "#file-info",
  data: {
    openedFile: openedFile
  }
})

var contentContainer = {
  props: ["contenteditable", "wrapperId", "hideSm", "content", "contentTheme", "maximisable"],
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
    },
    toggleMaximised: function () {
      this.$refs.maximisedDisplay.classList.toggle("active");
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
        <div v-if="maximisable" class="height-minus mdi mdi-24px mdi-fullscreen c-hand tooltip tooltip-left" data-tooltip="Display this only" @click="toggleMaximised"></div>
        <div class="height-minus mdi mdi-24px mdi-arrow-up-thick c-hand tooltip tooltip-left" data-tooltip="Decrease height" @click="decreaseHeight"></div>
        <div class="height-plus mdi mdi-24px mdi-arrow-down-thick c-hand tooltip tooltip-left" data-tooltip="Increase height" @click="increaseHeight"></div>
      </span>
      <div class="modal modal-lg" id="maximised-display" v-if="maximisable" ref="maximisedDisplay">
        <span class="modal-overlay"></span>
        <div class="modal-container py-2">
          <div class="c-hand mdi mdi-24px mdi-fullscreen-exit float-right tooltip tooltip-left" aria-label="Close" data-tooltip="Exit fullscreen" @click="toggleMaximised"></div>
          <div v-html="content"></div>
        </div>
      </div>
    </div>
  </span>
  `
}

var content = new Vue({
  el: "#content",
  data: {
    openedFile: openedFile,
  },
  computed: {
    compiledDoc: function () {
      return mdconverter.makeHtml(this.openedFile.raw)
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
      this.openedFile.raw = raw
    },
    addTab: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart+1) + "    " + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 4;
      ta.selectionEnd += 4;
    },
    boldText: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart) + "**" + this.openedFile.raw.slice(ta.selectionStart, ta.selectionEnd+1) + "**" + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 2;
      ta.selectionEnd += 2;
    },
    italicText: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart) + "*" + this.openedFile.raw.slice(ta.selectionStart, ta.selectionEnd+1) + "*" + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 1;
      ta.selectionEnd += 1;
    }
  }
})

// initiation
function initApis() {
  modalLoading.loadingText = "Loading API";
  modalLoading.activate = true;
  gd = new GDrive();
  gd.signedInFunction = () => {
    signedInStatus.google = true;
    // if no user is provided on url
    if (urlParams.get("user")) {
      // check if the signed in user is the same user
      if (gd.getUserId() == urlParams.get("user")) {
        // open file if action is open
        if (urlParams.get("action") == "open") {
          if (urlParams.get("file")) {
            modalLoading.loadingText = "Opening file";
            modalLoading.activate = true;
            gd.getFileMetadata(urlParams.get("file")).then((res) => {
              gd.getFileContent(res.result.id).then((res) => {
                openedFile.raw = res.body;
                openedFile.saved = res.body;
                modalLoading.activate = false;
              });
              openedFile.name = res.result.name;
              openedFile.id = res.result.id;
              openedFile.paths = [];
              openedFile.parents = res.result.parents;
  
              async function findParents(currentPath, currentPathInName, parents) {
                if (!parents) {
                  openedFile.paths.push(currentPath);
                  openedFile.pathsInName.push(currentPathInName);
                  // console.log(openedFile.paths, openedFile.pathsInName);
                } else {
                  for (let i = 0; i < parents.length; i++) {
                    gd.getFileMetadata(parents[i]).then((res) => {
                      findParents(currentPath.concat(res.result.id), currentPathInName.concat(res.result.name), res.result.parents);
                    })
                  }
                }
              }
              findParents([res.result.id], [res.result.name], res.result.parents);
            });  
          }
        } else {  // if action is create
          if (urlParams.get("folder")) {
            modalLoading.loadingText = "Creating file";
            modalLoading.activate = true;
            gd.createFile(urlParams.get("folder"), "Untitled.md", initialText)
              .then((res) => {
                if (res.status == 200) {
                  gd.openFile(res.result.id);
                  modalLoading.activate = false;
                }
              });
          }
        }
      } else {
        notiObj.notify(`The signed in user is not the same as the user who opened this page. You can solve this by
          (1) signing out and signing in as the user who opened this page, or
          (2) opening a file or creating a new file from this page as the signed in user.
        `, "error");
      }
    } else { // no user id on url, assuming not landing from google drive using create new or open with

    }
  }
  gd.signedOutFunction = () => {
    signedInStatus.google = false;
    modalLoading.activate = false;
  }
  gd.signedInAtInit = () => {
    document.querySelector("#modal-user").classList.remove("active");
  }
  gd.signedOutAtInit = () => {
    document.querySelector("#modal-user").classList.add("active");
  }
}

// open modal-user to prompt user to sign in
// document.querySelector("#modal-user").classList.add("active");
// console.log(urlParams.get("user"), urlParams.get("file"), urlParams.get("action"));