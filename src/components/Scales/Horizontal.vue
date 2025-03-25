<template>
  <!-- <div id="Horizontal" :style="cssProps">
    <div v-if="this.params.tag" style="display: flex; flex-direction: row; justify-content: space-between;">
      <p :style="cssProps" class="text">{{ this.params.tag }}</p>
      <p :style="cssProps" class="value">{{ this.valuepercent }} {{ this.params.format.split(' ')[1] }}</p>
    </div>
    <div v-else><p :style="cssProps" class="value">{{ Math.trunc(this.valuepercent) }}</p></div>
    <div id="Horizontal_Middle_progresslinear" >
      <div id="Horizontal_Middle_bar">
        <div v-if="this.params.lowAlarm" style="border-right: solid 4px red" :style="cssProps" class="lowAlarmb"><p class="Horizontal_Middle_bar_borders_top" style="text-align: right; left:6px">{{ this.params.tag ? '' : this.params.lowAlarm }}</p></div>
        <div :style="cssProps" class="centera"><p></p></div>
        <div v-if="this.params.highAlarm" style="border-left: solid 4px red;"  :style="cssProps" class="highAlarmb"><p class="Horizontal_Middle_bar_borders_top" style="text-align: left; right: 10px;">{{ this.params.tag ? '' : this.params.highAlarm }}</p></div>
      </div>
      <k-progress :percent="value" :line-height="16" :show-text="false" :style="cssProps" :color="colors()" :bg-color="'#353535'" class="progressbar"></k-progress>
      <div id="Horizontal_Middle_bar">
        <div :style="cssProps" class="lowAlarmb"><p class="Horizontal_Middle_bar_borders" style="text-align: left; font-size: 14px; padding-top: 16px;">{{this.params.downLimit}}</p></div>
        <div v-if="this.params.lowWarning" :style="cssProps" class="lowWarningb" style="border-right: solid 4px yellow;"><p class="Horizontal_Middle_bar_borders_bottom" style="text-align: right; left:10px">{{this.params.tag ? '' : this.params.lowWarning }}</p></div>
        <div :style="cssProps" class="centerb"><p></p></div>
        <div v-if="this.params.highWarning" :style="cssProps" class="highWarningb" style="border-left: solid 4px yellow;"><p class="Horizontal_Middle_bar_borders_bottom" style="text-align: left; right: 10px;">{{this.params.tag ? '' : this.params.highWarning}}</p></div>
        <div :style="cssProps" class="highAlarmb"><p class="Horizontal_Middle_bar_borders" style="text-align: right; font-size: 14px; padding-top: 16px;">{{this.params.upLimit}}</p></div>
      </div>
    </div>
  </div> -->
  <TemperatureProgressBar
  :headerText= "this.params.tag"
  :current-value="this.params.currentValue"
  :min-value="this.params.downLimit"
  :max-value="this.params.upLimit"
  :limits="[
    { type: 'low-alarm', value: this.params.lowAlarm, side: 'left' },
    { type: 'low-warning', value: this.params.lowWarning, side: 'left' },
    { type: 'high-warning', value: this.params.highWarning, side: 'right' },
    { type: 'high-alarm', value: this.params.highAlarm, side: 'right' }
  ]"
  :position="{ x: (this.params.x / 1) * this.$parent.multiplier, y: (this.params.y / 1) * this.$parent.multiplier }"
  :dimensions="{ width: this.params.width * this.$parent.multiplier * [this.params.scale ? this.params.scale : 1], height: (this.params.height / 1) * this.$parent.multiplier }"
  :bar-height="20"
  :limit-height="4"
  :text-size="14"
  :label-size="14"
  :colors="{
    normal: '#' + this.color,
    warning: '#FFC107',
    alarm: '#F44336',
    background: '#' + this.params.back,
    text: '#' + this.color,
    label: '#' + this.params.fore
  }"
  :mark="this.params.format.split(' ')[1]"
/>
</template>

<script>

import KProgress from 'k-progress-v3'
import TemperatureProgressBar from './TemperatureProgressBar.vue'

export default {
  name: 'Horizontal',
  props: ["params" , "name"],
  data () {
    return {
      range: 1,
      Name: this.name,
      value: null,
      valuepercent: null,
      color: this.params.scaleCurrentBrush,
      center: (this.params.upLimit - this.params.downLimit) - (this.params.lowAlarm ? (this.params.lowAlarm - this.params.downLimit) : 5) - (this.params.lowAlarm ? this.params.lowWarning ? this.params.lowWarning - this.params.lowAlarm : 0 : this.params.lowWarning ? this.params.lowWarning - 5 : 0) - (this.params.highWarning ? this.params.highAlarm ?  this.params.upLimit - (this.params.highWarning + this.params.upLimit - this.params.highAlarm): this.params.upLimit - this.params.highWarning - 5 : 0) - (this.params.highAlarm ? this.params.upLimit - this.params.highAlarm : 5)
    }
  },
  components:{
    KProgress,
    TemperatureProgressBar
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.multiplier * [this.params.scale ? this.params.scale : 1] + "px",
        "--widthbar": this.params.width * this.$parent.multiplier * [this.params.scale ? this.params.scale : 1] + 50 + "px",
        "--height": (this.params.height / 1) * this.$parent.multiplier + "px",
        "--valuecolor": '#' + this.color,
        "--lowAlarm": [this.params.lowAlarm ? (this.params.lowAlarm - this.params.downLimit) : 5] / this.range + '%',
        "--lowWarning": [this.params.lowAlarm ? this.params.lowWarning ? this.params.lowWarning - this.params.lowAlarm : 0 : this.params.lowWarning ? this.params.lowWarning - 5 : 0] / this.range + '%',
        "--center": this.center / this.range + '%',
        "--centera": (this.params.upLimit - this.params.lowAlarm - [this.params.highAlarm ? this.params.upLimit - this.params.highAlarm : 0]) / this.range + '%',
        "--highWarning": [this.params.highWarning ? this.params.highAlarm ?  this.params.upLimit - (this.params.highWarning + this.params.upLimit - this.params.highAlarm): this.params.upLimit - this.params.highWarning - 5 : 0] / this.range + '%',
        "--highAlarm": [this.params.highAlarm ? this.params.upLimit - this.params.highAlarm : 5] / this.range + '%',
        "--textColor": "#" + this.params.fore
      };
    }
  },
  created(){
    // console.log(this.params)
    this.range = (this.params.upLimit - this.params.downLimit < 100) ? (this.params.upLimit - this.params.downLimit)/100 : 1
    this.value = (this.params.currentValue-this.params.downLimit)/((this.params.upLimit-this.params.downLimit)/100)
    this.valuepercent = Math.round(this.params.currentValue)
    const res = {'namewidget': this.Name, 'namewindow': this.$parent.windowname}
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties
        if (changedelem) {
          if (changedelem.currentValue){
            this.valuepercent = Math.round(changedelem.currentValue)
            this.value = (changedelem.currentValue-this.params.downLimit)/((this.params.upLimit-this.params.downLimit)/100)
            cons
          }
          if (changedelem.scaleCurrentBrush){
            this.color = changedelem.scaleCurrentBrush
          }
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
  },
  methods:{
    colors(){
      return "#" + this.color
    }
  }
}
</script>

<style scoped>
.progressbar{
  width: var(--widthbar);
  margin-bottom: 0px;
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
    #Horizontal_Middle_bar{
      height: 20%;
      display: flex;
    }
    .Horizontal_Middle_bar_borders{
        position: relative;
        bottom: 15px;
      }
      .Horizontal_Middle_bar_borders_top{
        position: relative;
        font-size: 17px;
        position: relative;
        bottom:35px
      }
      .Horizontal_Middle_bar_borders_bottom{
        position: relative;
        font-size: 17px;
        position: relative;
        top:10px
      }
  #Horizontal_bottom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .lowAlarmb{
    width: var(--lowAlarm);
    color: var(--textColor)
  }
  .highAlarmb{
    width: var(--highAlarm);
    color: var(--textColor)
  }
  .lowWarningb{
    width: var(--lowWarning);
  }
  .highWarningb{
    width: var(--highWarning);
  }
  .centerb{
    width: var(--center);
  }
  .centera{
    width: var(--centera);
  }
  .value{
    color: var(--valuecolor);
    font-size: 120%
  }
  .text{ 
    color: var(--textColor)
  }
</style>