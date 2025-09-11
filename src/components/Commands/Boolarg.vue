<template>
  <div class="boolarg" :style="cssProps">
    <input class="boolarg.value" type="checkbox" v-model="boolarg.value" @change="some"/>
  </div>
</template>

<script>

import axios from 'axios';
import {encript} from "@/mixins/encript.js";

export default {
  name: "app",
  props:['params', 'name', 'ip'],
  data() {
    return {
      boolarg: {
        Namesub: null,
        Name: null,
        value: null,
      },
      inSubscreen: null,
    };
  },
  methods: {
    async some(){
      // console.log(this.boolarg.value)
      if (this.params.trigger == "ChangeOnEnd") {
        const article =`
          ${this.boolarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        };
        await axios.post(`http://${this.ip}/api/nodes/${encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${encript((new TextEncoder()).encode(this.boolarg.Name))}/query/write-arg`, article, { headers })
      }
    },
    
  },
  created(){
    this.inSubscreen = this.$parent.$parent.windowname != this.$parent.$parent.windowpath.split('\\').join('')
    this.boolarg.Name = this.name
    this.boolarg.value = this.params.value
    if (this.$parent.$parent.subscreenname){ 
      this.boolarg.Namesub = this.boolarg.Name + '/' + this.$parent.$parent.subscreenname
    } else {
      this.boolarg.Namesub = this.boolarg.Name
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const ress = {'namewidget': this.boolarg.Namesub, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem = this.$store.getters.elemByName(ress)?.properties
        if (changedelem) {
          this.boolarg.value = changedelem.value
        }
      },1000)
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
    'boolarg.value'(){
      const res = {'namewidget': this.boolarg.Name, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname , 'value': this.boolarg.value.toString()}
      this.$store.dispatch('addcommandwidgetmass', res)
    }
  },
};
</script>

<style scoped>
.boolarg {
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
}
</style>
