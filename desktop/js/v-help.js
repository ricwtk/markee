module.exports = {
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
    },
    switchTo: function (x) {
      this.$refs[x].classList.add("selected");
      ["doc", "slide"].filter(el => el != x).forEach(el => this.$refs[el].classList.remove("selected"));
    }
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
      </div>
    </div>
  </div>
  `
}