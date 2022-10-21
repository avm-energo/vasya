<template>
  <div class="boolarg1">
    <input
      class="boolarg1.value"
      type="checkbox"
      v-model="boolarg1.value"
      @change="submitForm(boolarg1)"
      :disabled="boolarg1.disabled"
    />
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      boolarg1: {
        Name: "boolarg1",
        value: null,
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
.boolarg1 {
  position: absolute;
  left: 600px;
}
</style>
