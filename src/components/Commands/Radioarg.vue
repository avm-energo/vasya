<template>
  <div class="radioarg" :style="cssProps">
    <div v-for="elem in radioarg.masvalue" :key="elem.id" @change="some()">
      <input type="radio" :value="elem.value" v-model="radioarg.value" :id="elem.id" class="custom-radio" :checked="elem.isSelected"/>
      <label :for="elem.id">{{ elem.title}}</label> 
    </div>
  </div>
</template>

<script>

import axios from 'axios';

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
    };
  },
  methods: {
    async some(){
      const res = {'namewidget': this.radioarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.radioarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
      console.log(this.radioarg.masvalue)
      if (this.params.setOnCheck) {
        const article =`
          ${this.radioarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.radioarg.Name))}/query/write-arg`, article, { headers })
      }
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
    console.log(this.params)
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
    const ress = {'namewidget': this.radioarg.Namesub, 'namewindow': this.$parent.$parent.windowname}
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
        "--width": this.params.width * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
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
