<template>
  <div class="radioarg" :style="cssProps">
    <div v-for="elem in radioarg.masvalue" :key="elem.id" @change="some()">
      <input type="radio" :value="elem.value" v-model="radioarg.value" :id="elem.id" class="custom-radio" :checked="elem.isSelected"/>
      <label :for="elem.id">{{ elem.title}}</label> 
    </div>
  </div>
</template>

<script>

import { PostWriteArg } from "@/actions/SonicaActions";

export default {  
  name: "app",
  props: ['params','name', 'ip'], 
  data() {
    return {
      radioarg: {
        masvalue: null,
        Name: null,
        value: null,
        Namesub: null,
      },
      inSubscreen: null,
    };
  },
  methods: {
    async some(){
      console.log(this.radioarg.masvalue)
      if (this.params.setOnCheck) {
        PostWriteArg(this.$parent.$parent.windowpath, this.radioarg.Name, `${this.radioarg.value}`, ()=>{
          
        })
      }
    },
    
  },
  created(){
    this.inSubscreen = this.$parent.$parent.windowname != this.$parent.$parent.windowpath.split('\\').join('')
    this.radioarg.Name = this.name
    this.radioarg.masvalue = this.params.state
    // this.radioarg.value = this.radioarg.masvalue.find((t) => t.isSelected == true).value
    if (this.$parent.$parent.subscreenname){ 
      this.radioarg.Namesub = this.radioarg.Name + '/' + this.$parent.$parent.subscreenname
    } else {
      this.radioarg.Namesub = this.radioarg.Name
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const ress = {'namewidget': this.radioarg.Namesub, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem = this.$store.getters.elemByName(ress)?.properties
        if (changedelem) {
          if (this.radioarg.masvalue.findIndex(elem => elem.isSelected == true) != -1) this.radioarg.masvalue[this.radioarg.masvalue.findIndex(elem => elem.isSelected == true)].isSelected = false
          this.radioarg.masvalue[changedelem.state.findIndex(elem => elem.isSelected == true)].isSelected = true
          this.radioarg.value = this.radioarg.masvalue[changedelem.state.findIndex(elem => elem.isSelected == true)].value
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
    'radioarg.value'(){
      const res = {'namewidget': this.radioarg.Name, 'namewindow': this.inSubscreen ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname , 'value': this.radioarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
    }
  },
};
</script>

<style scoped>
.radioarg {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  background-color: var(--background);
  border: solid 0px var(--borderBrush);
  align-items: center;
  font-size: 12px;
}

</style>
