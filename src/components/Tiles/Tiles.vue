<template>
  <div class="tiles" :class="[ this.name.startsWith('Tiles/Number') ? tiles.Flashing ? 'flash' : '' : '', ]" :style="cssProps" :title="'Состояние элемента ' + tiles.tooltip" v-show="tiles.Visible" >
    <p :style="cssProps" :id="this.name" v-show="tiles.value!='text'">{{ tiles.value }}</p>
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
    };
  },
  created(){
    this.tiles.Name = this.name
    if (this.$parent.subscreenname){ 
      this.tiles.Name += '/' + this.$parent.subscreenname
    }
    this.tiles.value = this.params.text,
    this.tiles.ForegroundColor = this.params.foreground,
    this.tiles.BackgroundColor = this.params.background,
    this.tiles.Flashing = false,
    this.tiles.AlarmInfo = "Good",
    this.tiles.Visible = this.params.visible,
    this.tiles.Enabled = true,
    this.tiles.tooltip = "подсказка!"
    if( this.type.startsWith("tiles") || (this.$parent.typewindow == 'head' ) || this.name.startsWith("Number") || this.name.startsWith("Flag")) {
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      const res = {'namewidget': this.tiles.Name, 'namewindow': this.$parent.windowname}
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
  },
  computed: {
    cssProps() {
      return {
        "--x": this.params.x  * this.$parent.multiplier + "px",
        "--y": this.params.y  * this.$parent.multiplier + "px",
        "--z": this.params.z,
        "--width": this.params.width  * this.$parent.multiplier + "px",
        "--height": this.params.height  * this.$parent.multiplier + "px",
        "--backgroundColor": "#" + [ this.tiles.BackgroundColor == "Blue" ? "#373737" : this.tiles.BackgroundColor, ],
        "--color": "#" + this.tiles.ForegroundColor,
        "--borderThickness": this.params.borderThickness  * this.$parent.multiplier + "px",
        "--borderBrush": "#" + this.params.borderBrush,
        "--scale": this.params.scale,
        "--align": this.params.hAlignment,
        "--valign": [(this.params.vAlignment == 'Stretch' || this.params.vAlignment == 'Top') ? [(this.params.angle == 270 ||  this.params.angle ==-90) ? 'auto' : ''] : 'auto'],
        "--fontSize": [this.params.fontSize == 0 ? 14 / 1 : this.params.fontSize / 1]  * this.$parent.multiplier + "px",
        "--margin": [(this.params.vAlignment == 'Stretch' || this.params.vAlignment == 'Top') ? '' : this.params.margin.split(" : ")[0] + "px"],
        "--borderRadius": this.params.borderRadius * this.$parent.multiplier + "px",
        "--vertical-rl": [(this.params.angle == 270 ||  this.params.angle ==-90) ? 'vertical-rl' : 'horizontal-tb']
      };
    },
  },
};
</script>
<style scoped>
.tiles {
  box-sizing: border-box;
  user-select: none;
  -ms-user: none;
  display: flex;
  transform: scale(var(--scale));
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
