const fs = require("fs");

module.exports = {
  props: ["hljsTheme", "font"],
  data: function () {
    return {
      editorFont: {
        family: "Arial",
        weight: "400",
        size: "12px"
      },
      displayFont: {
        family: "Arial",
        weight: "400",
        size: "12px"
      },
      codeBlockTheme: "default"
    }
  },
  computed: {
    fontFamilies: function () {
      return Object.keys(this.font.all);
    },
    editorFontShowcase: function () {
      return {
        "font-family": this.editorFont.family,
        "font-weight": this.editorFont.weight,
        "font-size": this.editorFont.size
      }
    },
    displayFontShowcase: function () {
      return {
        "font-family": this.displayFont.family,
        "font-weight": this.displayFont.weight,
        "font-size": this.displayFont.size
      }
    },
    codeBlockExample: function () {
      return "./snippets/code-block-example.html?hljsTheme=" + this.codeBlockTheme;
    }
  },
  mounted: function () {
    console.log(this.objData);
  },
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
    },
    fontWeights: function (family) {
      if (this.font.all[family]) {
        return this.font.all[family].map(el => el.weight);
      } else {
        return [];
      }
    },
  },
  template: `
  <div class="modal">
    <div class="modal-overlay" @click="toggle"></div>
    <div class="modal-container">
      <div class="modal-title">
        <div class="grow">Preference</div>
        <div class="mdi mdi-24px mdi-close c-hand" @click="toggle"></div>
      </div>
      <div class="modal-body v-box p-1">
        <div class="text-gray mb-1">Editor font</div>
        <div class="h-box">
          <label class="form-select-wrapper grow mr-1">
            <select class="form-select grow" v-model="editorFont.family">
              <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
          <label class="form-select-wrapper mr-1">
            <select class="form-select" v-model="editorFont.weight">
              <option v-for="w in fontWeights(editorFont.family)" :value="w">{{ w }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
          <label class="form-select-wrapper">
            <select class="form-select" v-model="editorFont.size">
              <option v-for="n in [10, 12, 14, 15, 16, 17, 18]" :value="n+'px'">{{ n + 'px' }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
        </div>
        <div class="b-1 bd-gray b-solid br-1 mt-1 p-2" :style="editorFontShowcase">
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
        <div class="text-gray mb-1 mt-2">Base font for display</div>
        <div class="h-box">
          <label class="form-select-wrapper grow mr-1">
            <select class="form-select grow" v-model="displayFont.family">
              <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
          <label class="form-select-wrapper mr-1">
            <select class="form-select" v-model="displayFont.weight">
              <option v-for="w in fontWeights(displayFont.family)" :value="w">{{ w }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
          <label class="form-select-wrapper">
            <select class="form-select" v-model="displayFont.size">
              <option v-for="n in [10, 12, 14, 15, 16, 17, 18]" :value="n+'px'">{{ n + 'px' }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
        </div>
        <div class="b-1 bd-gray b-solid br-1 mt-1 p-2" :style="displayFontShowcase">
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
        <div class="text-gray mb-1 mt-2">Code block highlight theme</div>
        <div class="h-box">
          <label class="form-select-wrapper grow">
            <select class="form-select grow" v-model="codeBlockTheme">
              <option v-for="t in hljsTheme.all">{{ t }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
        </div>
        <object :data="codeBlockExample" type="text/html" height="220px"></object>
        <div class="text-gray mb-1 mt-2">Custom CSS</div>
        <textarea class="form-textarea no-resize br-1 p-1"></textarea>
      </div>
      <div class="modal-footer">
        <div class="grow"></div>
        <div class="button-group">
        <button class="btn form-btn">Save</button>
        <button class="btn form-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `
}