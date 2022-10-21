<template>
  <div class="passwordarg">
    <input
      v-model="passwordarg.value"
      type="password"
      @blur="submitForm(passwordarg)"
      @keyup.enter="$event.target.blur()"
      :disabled="passwordarg.disabled"
    /><br />
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

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
  mixins: [submitform],
};
</script>

<style scoped>
.passwordarg {
  position: absolute;
}
</style>
