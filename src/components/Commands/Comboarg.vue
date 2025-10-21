<template>
  <div class="comboarg" :style="cssProps">
    <select class="comboarg_value" v-model="comboarg.value" @change="some()">
      <option v-for="elem in comboarg.masvalue" :key="elem.id" :value="elem.val">
        {{ elem.title }}
      </option>
    </select>
  </div>
</template>

<script>

import { PostWriteArg } from "@/actions/SonicaActions";

export default {
  name: "app",
  props:['params', 'name' ,'ip'],
  data() {
    return {
      comboarg: {
        Name: null,
        Namesub: null,
        masvalue: null,
        value: null,
      },
      inSubscreen: null,
    };
  },
  methods:{
    async some(){
      if (this.params.trigger == "ChangeOnEnd") {
        PostWriteArg(this.$parent.$parent.windowpath, this.comboarg.Name, `${this.comboarg.value}`, ()=>{

        })
      }
    },
  },
  created(){
    this.inSubscreen = this.$parent.$parent.windowname != this.$parent.$parent.windowpath.split('\\').join('')
    this.comboarg.value = this.params.value
    this.comboarg.masvalue = this.params.cases
    this.comboarg.Name = this.name
    if (this.$parent.$parent.subscreenname){ 
      this.comboarg.Namesub = this.comboarg.Name + '/' + this.$parent.$parent.subscreenname
    } else {
      this.comboarg.Namesub = this.comboarg.Name
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const ress = {'namewidget': this.comboarg.Namesub, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem = this.$store.getters.elemByName(ress)?.properties
        if (changedelem) {
          if (typeof(changedelem.value)!= "indefined") this.comboarg.value = changedelem.value
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
      };
    }
  },
  watch: {
    'comboarg.value'(){
      const res = {'namewidget': this.comboarg.Name, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname , 'value': this.comboarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
    }
  },
};
</script>

<style scoped>
.comboarg {
  box-sizing: content-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  background-color: var(--background);
  border: solid 1px var(--borderBrush);
}
.comboarg_value {
  background-color: #252525FF;
  color: white;
  border: none;
  width: 100%;
  height: 100%;
  text-align-last:center;
}
.comboarg_value:focus {
  outline: none;
}
</style>
