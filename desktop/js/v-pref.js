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
      <div class="modal-body">
        body


        fdasf





        fdsaf
        fdasf
        adsf
        <div style="min-height: 800px"></div>


        afdssdf

        fdsa
        fdas


        fdsafas
      </div>
      <div class="modal-footer">
        <div class="grow"></div>
        <button class="btn form-btn">Cancel</button>
      </div>
    </div>
  </div>
  `
}