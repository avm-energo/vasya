<template>
  <div id="Horizontal" class="border" :style="cssProps">
    <div id="Horizontal_top" class="border">

      <div id="Horizontal_top_tag" class="border"> {{ this.params.tag }}</div>
      <div v-if="!this.params.tag">{{ Math.trunc(this.value) }}</div>
      <div id="Horizontal_top_text" class="border"> {{ this.params.tag ? Math.trunc(this.value) : ''}} </div>
    </div>
    <div id="Horizontal_Middle_progresslinear" class="border">
      <k-progress :percent="value" :line-height="14" :show-text="false" style="width:106%"></k-progress>
    </div>
    <div id="Horizontal_bottom" class="border">
      <div id="Horizontal_bottom_min" class="border">0</div>
      <div id="Horizontal_bottom_max" class="border">{{this.params.upLimit}}</div>
    </div>
  </div>
</template>

<script>

import KProgress from 'k-progress-v3'

export default {
  name: 'Horizontal',
  props: ["params" , "name"],
  data () {
    return {
      Name: this.name,
      value: null,
    }
  },
  components:{
    KProgress
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.multiplier + "px",
        // "--background": "#" + this.params.background,
        // "--borderBrush": "#" + this.params.borderBrush,
        // "--foreground": "#" + this.params.foreground,
        // "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    }
  },
  created(){
    this.value = this.params.currentValue
    console.log(this.params)
    const res = {'namewidget': this.Name, 'namewindow': this.$parent.windowname}
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties
        if (changedelem) {
          console.log(changedelem)
          if (changedelem.currentValue){
            this.value = changedelem.currentValue
          }
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
  }
}
</script>

<style scoped>
.border{
  /* box-sizing: border-box;
  border: solid 1px white; */
}
#Horizontal{
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
  #Horizontal_top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 70%;
  }
    #Horizontal_Middle_progresslinear{
      align-items: center;
    }
  #Horizontal_bottom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>