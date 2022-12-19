<template>
  <div class="passwordarg">
    <input
      v-model="passwordarg.value"
      type="password"
      @blur="some(passwordarg)"
      @keyup.enter="$event.target.blur()"
      :disabled="passwordarg.disabled"
    /><br />
  </div>
</template>

<script>

export default {
  name: "app",
  data() {
    return {
      passwordarg: {
        Name: "passwordarg",
        value: "",
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        disabled: false,
      },
    };
  },
  methods:{
    some(){
      console.log('asd')
    }
  }
};
</script>

<style scoped>
.passwordarg {
  position: absolute;
}
</style>
