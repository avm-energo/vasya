<template>
  <button class="Apply" :style="cssProps" @click="some()" :disabled="!isEnabled">
    <p class="Apply_text">{{this.params.text}}</p>
  </button>
</template>

<script>

import axios from 'axios';
import {encript} from "@/mixins/encript.js";

export default {
  name: "app",
  props:['params', 'name', 'ip'],
  data() {
    return {
      pathName: null,
      isEnabled: false,
    };
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": (this.params.width / 1) * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier * [this.params.scale || 1] + "px",
      };
    }
  },
  methods:{
    async some(){
      let pathName = this.$store.getters.commandwidgets(this.$parent.$parent[this.pathName])
      let json_obj
      if (pathName){
        var items = {};
        // console.log(this.pathName)
        pathName.forEach(element => {
          items[element.namewidget] = element.value ? element.value.toString() : '';
        });
        const jsonString = JSON.stringify(Object.assign({}, items)) 
        json_obj = JSON.parse(jsonString);
      } else{
        json_obj = null
      }
      // const startTime = performance.now()
      let text = null
      if (json_obj && this.params.writeParams) {
        // console.log(json_obj)
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        };
        await axios.post(`http://${this.ip}/api/nodes/${encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${encript((new TextEncoder()).encode(this.name))}/query/apply-form`, json_obj, { headers })
        .then((result)=>{
          // console.log(result)
        })
        this.$store.dispatch('clearcommandwidgets', this.$parent.$parent.windowpath ? this.$parent.$parent.windowpath: this.$parent.$parent.windowname)
      } 
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        };
      json_obj = {}
      if (this.params.awaitTime) this.isEnabled = false
      await axios.post(`http://${this.ip}/api/nodes/${encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${encript((new TextEncoder()).encode(this.name))}/query/apply-command`, json_obj, { headers }).
      then(response =>{
        // console.log(response)
        if (response.status == 200) {
          response.data != '' ? text = response.data.resultData.description : text = null
        } else if (response.status == 204) {
          text = null
        } else if (response.status == 400) {
          text = response.data.errorDetails
        } else {
          text = 'Истекло время ожидания команды'
        }
        this.isEnabled = true
        // console.log(json_obj)
        if (response.data.resultData.type) {
          this.$store.dispatch('AddNotification_action', { text: text, type: 'Warning', time: 5000 })
        } else {
          this.$store.dispatch('AddNotification_action', { text: text, type: 'Success', time: 5000 })
        }
      })
      // const endTime = performance.now()
      // if ((endTime - startTime) < this.params.awaitTime) {
      // } else {
        // if (text) this.$store.dispatch('AddNotification_action', { text: text, type: 'Warning', time: 5000 })
      // }
    },
  },
  created(){
    // this.isEnabled = this.params.isEnabled
    this.isEnabled = true
    if (this.$store.getters.commandwidgets(this.$parent.$parent.windowpath)) {
      this.pathName = 'windowpath'
    } else {
      this.pathName = 'windowname'
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const ress = {'namewidget': this.name, 'namewindow': this.$parent.$parent.windowname != this.$parent.$parent.windowpath.split('\\').join('') ? this.$parent.$parent.windowpath : this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem = this.$store.getters.elemByName(ress)?.properties
        // console.log(changedelem)
        if (changedelem) {
          this.isEnabled = changedelem.isEnabled
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
    // }
  }
};
</script>

<style scoped>
.Apply {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  border: solid 1px;
  border-color: var(--borderBrush);
  background-color: var(--background);
  position: absolute;
  width: var(--width);
  height: var(--height);
  display: flex;
  align-items: center;
  justify-content: center
}
.Apply[disabled]{
   pointer-events: none;
}
.Apply[disabled] .Apply_text{
   filter: brightness(50%);
}
.Apply_text{
  color: var(--foreground);
  user-select: none;
  -ms-user: none;
  font-size: var(--fontsize);
}

.Apply:hover{
  border-color:white;
  background-color: rgb(16,64,102);
}
.Apply:active{
  border-color:white;
  background-color: rgb(5,101,177);
}
</style>
