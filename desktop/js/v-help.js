module.exports = {
  props: ["mdguides", "mdconverter"],
  data: function () {
    return {
      selected: "doc",
      selectedDocSub: {}
    }
  },
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
    },
    switchTo: function (x) {
      this.selected = x;
      this.$refs[x].classList.add("selected");
      ["doc", "slide"].filter(el => el != x).forEach(el => this.$refs[el].classList.remove("selected"));
    },
    switchDocSubTo: function (x) {
      this.selectedDocSub = x;
      this.$refs.docSub.forEach(el => {
        if (el.dataset.tooltip == x.tooltip) {
          el.classList.add("selected");
        } else {
          el.classList.remove("selected");
        }
      })
    }
  },
  mounted: function () {
    this.selectedDocSub = this.mdguides[0];
  },
  template: `
  <div class="modal">
    <div class="modal-overlay" @click="toggle"></div>
    <div class="modal-container">
      <div class="modal-title">
        <div class="grow">Help</div>
        <div class="mdi mdi-24px mdi-close c-hand" @click="toggle"></div>
      </div>
      <div class="modal-body">
        <div class="h-box tab">
          <div class="grow h-center c-hand selected" ref="doc" @click="switchTo('doc')"><i class="mdi mdi-file-document-box"></i> Markdown document</div>
          <div class="grow h-center c-hand" ref="slide" @click="switchTo('slide')"><i class="mdi mdi-file-presentation-box"></i> Markdown slides</div>
        </div>
        <div v-show="selected=='doc'" class="h-box grow overflow-auto">
          <div class="v-box tab-vertical-left tab-sm overflow-auto">
            <div v-for="(g,i) in mdguides" 
              :class="[i == 0 ? 'selected' : '', 'c-hand']" 
              ref="docSub"
              @click="switchDocSubTo(g)"
              :data-tooltip="g.tooltip"
            ><span :class="['mdi', 'mdi-24px', g.icon]"></span></div>
          </div>
          <div class="grow ml-2 overflow-auto">
            <h2 class="h-box v-center text-primary-dark"><i :class="['mr-1', 'mdi', selectedDocSub.icon]"></i>{{ selectedDocSub.tooltip }}</h2>
            <div class="md-default" v-html="mdconverter.makeHtml(selectedDocSub.guide)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}