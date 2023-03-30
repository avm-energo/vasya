<template>
  <div class="Apply" :style="cssProps" @click="some()">
    <p class="Apply_text">{{this.params.text}}</p>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "app",
  props:['params', 'name', 'ip'],
  data() {
    return {};
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": (this.params.width / 1) * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    }
  },
  methods:{
    async some(){
      console.log(this.params)
      let res = this.$store.getters.commandwidgets(this.$parent.$parent.windowname)
      let json_obj
      if (res){
        var items = {};
        res.forEach(element => {
          items[element.namewidget] = element.value.toString();
        });
        const jsonString = JSON.stringify(Object.assign({}, items)) 
        json_obj = JSON.parse(jsonString);
      } else{
        json_obj = null
      }
      if (this.params.writeParams) {
        if (json_obj != null) {
          const headers = {'Content-Type': 'application/json'};
          // console.log(this.$parent.$parent.namewindow.split('\\').join('\\') )
          await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/apply-form`, json_obj, { headers })
          this.$store.dispatch('clearcommandwidgets', this.$parent.$parent.windowname)
        }
      } 
      const headers = {'Content-Type': 'application/json'};
      json_obj = {}
      await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/apply-command`, json_obj, { headers }).
      then(response =>{
        console.log(response)
      })
    },
    encript(values) {
      const Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
      var bitsCount = 8 * values.length;
      var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount % 5 == 0 ? 0 : 1));
      for (let i = 0; i < ans.length; i++) {
          var bitNum = i * 5;
          var byteNum = Math.trunc(bitNum / 8);
          var byteOffset = bitNum % 8;
          var symbol = values[byteNum] >> byteOffset;
          if (byteOffset > 3 && byteNum < (values.length - 1)) {
              var symbolOffset = 8 - byteOffset;
              symbol |= values[byteNum + 1] << symbolOffset;
          }
          symbol &= 0b11111;
          ans[i] = Alphabet[symbol];
      }
      return ans.join("")
    },
  },
  created(){
    // console.log(this.ip)
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
.Apply_text{
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
