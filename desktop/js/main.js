const path = require("path");
const Vue = require(path.join(__dirname, "js", "vue.js"));
const Split = require("split.js");
const tt = require('electron-tooltip');
const showdown = require("showdown");
const mdconv = new showdown.Converter();

// split
var split;
function setSplit() {
  var split = Split([
    document.querySelector("#edit-panel"),
    document.querySelector("#display-panel")
  ], {
    sizes: [50,50],
    gutterSize: 10,
    gutter: (index, direction) => {
      const gutter = document.createElement('div');
      gutter.className = `gutter gutter-${direction} bg-gray-light`;
      gutter.dataset.tooltip = "Click and drag to change size";
      return gutter;
    }
  });
}

// electron-tooltip
tt({
  position: "bottom"
});

// vue
Vue.component("preference", require(path.join(__dirname, "js", "v-pref.js")));
new Vue({
  el: "#main",
  data: {
    docContent: ""
  },
  computed: {
    compiledDocContent: function () {
      return mdconv.makeHtml(this.docContent);
    }
  },
  mounted: function () {
    setSplit();
  },
  methods: {
    test: function () {
      console.log(this.$refs);
    }
  }
})