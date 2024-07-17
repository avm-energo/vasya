<template>
  <div class="container" v-show="this.state"> 
    <!-- <v-icon icon="circle-exclamation" :style="{ color: 'white', width: '20px' }" /> -->
    <span> Отсутствует подключение к {{ text }}</span>
    <span> Некоторые функции недоступны</span>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    state: Boolean,
  },
  data() {
    return {
      
    }
  },
};
</script>


<style scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  background: rgb(194, 11, 11);
  color: white;
  padding: 10px 20px;
  margin-top: 2px;
}

.container span{
  width: 100%;
  text-align: center;
}

button {
  border: none;
  outline: none;
  background: transparent;
  position: absolute;
  right: 0;
  top: 3px;
}
</style>