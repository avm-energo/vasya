export const widgetsignup = {
  methods: {
    widgetsignup(a,b){
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      const res = {'nametile': this.widgetname, 'namewindow': windowname}
      setTimeout(() => {
        setInterval(() => {
          let changedelem= this.$store.getters.elemByName(res)?.properties
          if (changedelem) {
            if (changedelem.text) this.tiles.value = changedelem.text
            if (changedelem.background) this.tiles.BackgroundColor = changedelem.background
            if (changedelem.foreground) this.tiles.ForegroundColor = changedelem.foreground
          }
        },1000)
      // }, 1000 - Math.abs(500 - currentDateMilliseconds));
      }, 1000 - currentDateMilliseconds);
    }
  }
}
