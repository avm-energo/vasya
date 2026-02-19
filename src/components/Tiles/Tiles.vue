<template>
  <div class="tiles" :class="[ this.name.startsWith('Tiles/Number') ? tiles.Flashing ? 'flash' : '' : '', ]" :style="cssProps" v-show="tiles.Visible" >
    <p :style="cssProps" :id="this.name" v-show="tiles.value!='text'">{{tiles.value}}</p>
  </div>
</template>
<script>
export default {
  name: 'Tile',
  props: {
    params:{}, 
    name:{}, 
    subscreensize:{},
    screenPercentage:{},
    windowWidth:{},
    windowHeight:{},
    type:{}
  },
  data() {
    return {
      tiles: {
        Name: '',
        value: '',
        ForegroundColor: '',
        BackgroundColor: '',
        Flashing: false,
        AlarmInfo: '',
        Visible: true,
        Enabled: true,
        tooltip: '',
      },
      intervalId: null,
    };
  },
  created(){
    // this.name == 'Tooltiper#3' ? console.log(this.params) : ''
    // console.log(this.name + this.params.text)
    this.updateIndo()
    if (this.$parent.subscreenname){ 
      this.tiles.Name += '/' + this.$parent.subscreenname
    }
    // костыль на пробелы
    // if (this.params.text.startsWith('        ')) {
    //   this.tiles.value = this.params.text.replace(/ /g, '\u00A0')
    // } else {
    //   this.tiles.value = this.params.text
    // }
    // this.tiles.tooltip = "подсказка!"
    if( this.type.startsWith("tiles") || (this.$parent.typewindow == 'head' ) || this.name.startsWith("Number") || this.name.startsWith("Flag")) {
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      const res = {'namewidget': this.tiles.Name, 'namewindow': this.$parent.windowname}
      setTimeout(() => {
        this.intervalId = setInterval(() => {
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
  },
  methods:{
    updateIndo(){
      // if (this.params.text == 'X') {
      //   console.log(this.params)
      //   console.log(this.$parent.multiplier)
      // }
      this.tiles.Name = this.name
      let size = this.params.text.search(/\S|$/)
      let newline = this.params.text.search(/\r|\n/)
      let text = ""
      for (var i = 0; i < size; i++) {text = text + `\u2002`}
      this.tiles.value = text + this.params.text.slice(size)
      if (newline > 0 ) {
        this.tiles.value = (this.params.text.slice(0 , newline) + '' + this.params.text.slice(newline))
      }
      this.tiles.ForegroundColor = this.params.foreground,
      this.tiles.BackgroundColor = this.params.background,
      this.tiles.Flashing = false,
      this.tiles.AlarmInfo = "Good",
      this.tiles.Visible = this.params.visible,
      this.tiles.Enabled = true
    }
  },
  computed: {
    cssProps() {
      return {
        "--x": this.params.x * this.$parent.multiplier + "px",
        "--y": [this.params.text == 'X' ? this.params.y - 5 : this.params.y] * this.$parent.multiplier + "px",
        // "--y": this.params.y  * this.$parent.multiplier + (this.params.height - this.params.height)/2*this.$parent.multiplier + "px",
        // при 1 X вылезает поверх всех окон
        // "--z": [this.params.text == 'X' ? 0 : ''],
        "--width": this.params.width  * this.$parent.multiplier * this.params.scale + "px",
        "--height": this.params.height  * this.$parent.multiplier * this.params.scale + "px",
        "--backgroundColor": "#" + [ this.tiles.BackgroundColor == "Blue" ? "#373737" : this.tiles.BackgroundColor, ],
        "--color": "#" + this.tiles.ForegroundColor,
        "--borderThickness": this.params.borderThickness  * this.$parent.multiplier + "px",
        "--borderBrush": "#" + this.params.borderBrush,
        "--scale": this.params.scale,
        "--align": this.params.hAlignment,
        "--valign": [(this.params.vAlignment == 'Stretch' || this.params.vAlignment == 'Top') ? [(this.params.angle == 270 ||  this.params.angle ==-90) ? 'auto' : ''] : 'auto'],
        "--fontSize": [this.params.fontSize == 0 ? 13  : this.params.fontSize ]  * this.$parent.multiplier * this.params.scale + "px",
        "--margin": [(this.params.vAlignment == 'Stretch' || this.params.vAlignment == 'Top') ? '' : this.params.margin.split(" : ")[0] + "px"],
        "--borderRadius": this.params.borderRadius * this.$parent.multiplier + "px",
        "--vertical-rl": [(this.params.angle == 270 ||  this.params.angle == -90) ? 'sideways-lr' : 'horizontal-tb']
      };
    },
  },
  watch: {
    'tiles.value'(newValue){
      if (parseFloat(newValue)) {
        this.tiles.value = newValue.replace(',','.')
      }
    },
    params(newVal){
      this.updateIndo()
    }
  },
  unmounted(){
    clearInterval(this.intervalId)
  }
};
</script>
<style scoped>
.tiles {
  z-index: var(--z);
  box-sizing: border-box;
  user-select: none;
  -ms-user: none;
  display: flex;
  /* transform: scale(var(--scale)); */
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--width);
  height: var(--height);
  background-color: var(--backgroundColor);
  color: var(--color);
  border-radius: var(--borderRadius);
  border-color: var(--borderBrush);
  border-width: var(--borderThickness);
  border-Radius: var(--borderRadius);
  border-style: solid;
}
p {
  writing-mode: var(--vertical-rl);
  margin: var(--valign);
  margin-left: var(--margin);
  width: 100%; 
  text-align: var(--align);
  font-size: var(--fontSize);
  white-space:pre
}

@keyframes glowing {
  from {
    background-color: var(--backgroundColor);
  }
  50% {
    background-color: var(--backgroundColor);
    filter: brightness(50%);
  }
  to {
    background-color: var(--backgroundColor);
  }
}
.flash {
  animation: glowing 2000ms infinite;
}
</style>
