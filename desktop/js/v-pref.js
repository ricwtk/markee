module.exports = {
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
    }
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
          <select class="form-select grow mr-1"><option>font family</option></select>
          <select class="form-select mr-1"><option>font weight</option></select>
          <select class="form-select"><option>font size</option></select>
        </div>
        <div class="text-gray mb-1 mt-2">Base font for display</div>
        <div class="h-box">
          <select class="form-select grow mr-1"><option>font family</option></select>
          <select class="form-select"><option>font size</option></select>
        </div>
        <div class="text-gray mb-1 mt-2">Code block highlight theme</div>
        <div class="h-box">
          <select class="form-select grow"><option>hljs themes</option></select>
        </div>
        <div class="text-gray mb-1 mt-2">Custom CSS</div>
        <textarea class="form-textarea no-resize"></textarea>
      </div>
      <div class="modal-footer">
        <div class="grow"></div>
        <button class="btn form-btn">Cancel</button>
      </div>
    </div>
  </div>
  `
}