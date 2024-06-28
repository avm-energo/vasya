<template>
  <!-- <div class="txtarg">
    <span class="txtarg_star" v-show="txtarg.value != txtarg.Notification && txtarg.ShowNotification">*</span>
    <input :style="[ txtarg.ShowNotification ? txtarg.value == txtarg.Notification ? { 'margin-left': '9.5px' } : '' : { 'margin-left': '9.5px' },]"
      class="txtarg_value" v-model="txtarg.value" @blur="submitForm(txtarg)" @keyup.enter="$event.target.blur()" id="txtarg" :disabled="txtarg.disabled"/>
  </div> -->
  <div class="txtarg" :style="cssProps">
    <div class="txtarg_star" v-show="txtarg.value != txtarg.prevvalue" :style="{backgroundColor: !showTooltip && !validate ? 'red' : ''}">*</div>
    <input class="txtarg_value" v-model="txtarg.value" @blur="[some(), showTooltip = false]" @keyup.enter="$event.target.blur()" :style="[cssProps, {backgroundColor: !showTooltip && !validate ? 'red' : ''}]" @focus="showTooltip = true"/>
    <div v-if="showTooltip && (this.params.lowRange || this.params.hiRange) && !validate" class="txtarg_check">
      <p v-if="txtarg.value < this.params.lowRange"> Введенное значение {{ value }} <br> меньше нижней границы {{ this.params.lowRange }} </p>
      <p v-else-if="txtarg.value > this.params.hiRange"> Введенное значение {{ value }} <br> больше верхней границы {{ this.params.hiRange }} </p>
    </div>
  </div>
</template>

<script>

import  Axios  from "axios";

export default {
  name: "app",
  props:['params','name', 'ip', 'type'],
  data() {
    return {
      showTooltip: false,
      validate: true,
      value: null,
      txtarg: {
        Name: null,
        Namesub: null,
        value: null,
        disabled: false,
        prevvalue: null,
      },
    };
  },
  methods:{
    async some(){
      // console.log(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.namewindow))}/widget/${this.encript((new TextEncoder()).encode(this.txtarg.Name))}/query/write-arg`)
      if (this.params.trigger != `ButtonApply` && this.validate) {
        const article =`${this.txtarg.value}`;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await Axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.txtarg.Name))}/query/write-arg`, article, { headers }).
        then(response =>{
          console.log(response)
          this.txtarg.prevvalue = this.txtarg.value
        })
        
      } else {
        // const res = {'namewidget': this.txtarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.txtarg.value}
        // this.$store.dispatch('addcommandwidgetmass', res)
        this.txtarg.prevvalue = this.txtarg.value
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
    this.txtarg.value = this.params.value
    this.txtarg.prevvalue = this.txtarg.value
    this.txtarg.Name = this.name
    if (this.params.trigger == `ButtonApply`) {
      const res = {'namewidget': this.txtarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.txtarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
    }
    // const res = {'namewidget': this.txtarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.txtarg.value}
    // this.$store.dispatch('addcommandwidgetmass', res)
    // if( this.type.startsWith("tiles") || (this.$parent.typewindow == 'head' ) || this.name.startsWith("Number") || this.name.startsWith("Flag")) {
      if (this.$parent.$parent.subscreenname){ 
        this.txtarg.Namesub = this.txtarg.Name + '/' + this.$parent.$parent.subscreenname
      } else {
        this.txtarg.Namesub = this.txtarg.Name
      }
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      const ress = {'namewidget': this.txtarg.Namesub, 'namewindow': this.$parent.$parent.windowname}
      setTimeout(() => {
        setInterval(() => {
          let changedelem = this.$store.getters.elemByName(ress)?.properties
          if (changedelem) {
            if (changedelem.value){
              this.txtarg.value = changedelem.value
              this.txtarg.prevvalue = this.txtarg.value
            } 
          }
        },1000)
      // }, 1000 - Math.abs(500 - currentDateMilliseconds));
      }, 1000 - currentDateMilliseconds);
    // }
  },
  watch: {
    'txtarg.value'(newValue){
      if (parseFloat(newValue).toLocaleString('ru-RU').replace(/\s/g, '').length > 10 ){
        this.value = parseFloat(newValue).toExponential()
      } else {
        this.value = newValue
      }
      if (/^\d+$/.test(newValue) && this.params.lowRange)
        this.validate = newValue >= this.params.lowRange && newValue <= this.params.hiRange
      else {
        this.validate = true
      }
      const res = {'namewidget': this.txtarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.txtarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
    }
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": (this.params.width / 1) * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--margin": [ this.txtarg.value == this.txtarg.prevvalue ? this.params.margin.split(" : ")[0] * this.$parent.$parent.multiplier + "px" : ''],
        "--widthstar": [ this.txtarg.value != this.txtarg.prevvalue ? this.params.margin.split(" : ")[0] * this.$parent.$parent.multiplier + "px" : ''],
        "--background": "#" + this.params.background,
        "--borderBrush": this.validate ?  "#" + this.params.borderBrush : 'red',
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
        "--fontcolor": "#" + this.params.foreground,
        "--hAlignment": this.params.hAlignment ? this.params.hAlignment : '',
        "--validateWidth" : 200 * this.$parent.$parent.multiplier + "px",
        "--validateHeight" : 32 * this.$parent.$parent.multiplier + "px",
        "--validateFont": 12 * this.$parent.$parent.multiplier + "px",
      };
    }
  },
};
</script>

<style scoped>
.txtarg {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  display: flex;
  background-color: var(--background);
  border: solid 1px var(--borderBrush);
}
.txtarg_value {
  box-sizing: border-box;
  background-color: var(--background);
  border: none;
  border-radius: none;
  width: 100%;
  height: 100%;
  padding-left: var(--margin);
  font-size: var(--fontsize);
  color: var(--fontcolor);
  text-align: var(--hAlignment);
}
.txtarg_value:focus {
  outline: none;
}
.txtarg_star{
  flex: 0 0 auto;
  margin: 0;
  width: var(--widthstar);
  font-size: var(--fontsize);
}
.txtarg_check{
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: var(--validateFont);
  background-color: red;
  height: var(--validateHeight);
  left: var(--width);
  top: -1px;
  min-width: var(--validateWidth);
  width: max-content;
}
.txtarg_check p {
  text-align: left;
  padding: 5px 5px 5px 5px;
  user-select: none;
  width: fit-content;
}
.txtarg_check:hover{
  filter: opacity(25%)
}
</style>
