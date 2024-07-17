<template>
  <button 
    @click="$emit('onClick'), abs()"
    :class="[{ Reverse: reverseOrder, Iconless: !icon, Textless: !label }, navigationButton ? 'd' : '']"
    :style="[{ backgroundColor: color },{filter: disabled ? 'brightness(35%)' : '' },{cursor: disabled ? 'default' : 'pointer'}]"
    :title="!disabled ? this.title : ''"
    :disabled="disabled" 
    @mouseenter="!disabled ? (navigationButton ? changecolor('#515151') : '') : ''"
    @mouseleave="navigationButton ? changecolor('transparent') : ''"
    @mousedown="navigationButton ? changecolor('#363fc2'): ''"
    @mouseup="navigationButton ? ButtonColorAction(): ''"
  >
    <!-- <v-icon :icon="icon" :style="iconStyle" /> -->
    <icon-adm v-if="icon" :nameSvg="icon" :widthSvg="iconStyle.width" :heightSvg="iconStyle.height" :colorSvg="iconStyle.color"/>
    <p :style="[{color: colortext, marginLeft: marginL, marginTop: marginU}]">{{ label }}</p>
    <!-- <p>{{ disabled }}</p> --> 
  </button>
</template>
<!-- #848484 -->
<script>

import IconAdm from '@/components/IconAdm.vue';

export default {
  data(){
    return{
      color: this.buttonBackground
    }
  },
  components:{
    IconAdm,
  },
  props: {
    disabled: {
      type:Boolean,
      default: false
    },
    icon: String,
    iconStyle: Object,
    label: String,
    buttonBackground: String,
    reverseOrder: Boolean,
    navigationButton: Boolean,
    title: String,
    colortext: String,
    marginU: String,
    marginL: String,
  },
  methods:{
    abs(){
      console.log()
    },
    changecolor(bool){
      this.color = bool
    },  
    ButtonColorAction(){
      setTimeout(()=>{
        if (this.disabled) this.changecolor('transparent')
      },1)
      if (!this.disabled) this.changecolor('#515151')
    }
  },
  created(){
  }
};
</script>

<style scoped>
button {
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  background: transparent;

  min-width: fit-content;
  border: 2px solid #414141;
  border-radius: 7px;

}
button:active {
  background-color: '#363fc2' !important;
}

button:hover{
  background-color: 'red' !important;
}
p {
  user-select: none;
  color: white;
}

.Reverse {
  flex-direction: row-reverse;
}

.Iconless, .Textless{
    justify-content: center;
}
</style>