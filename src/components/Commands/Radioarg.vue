<template>
  <div class="radioarg">
    <div
      v-for="elem in radioarg.masvalue"
      :key="elem.id"
      @change="submitForm(radioarg)"
    >
      <input
        type="radio"
        :value="elem.item"
        v-model="radioarg.value"
        :disabled="radioarg.disabled"
      />
      <label style="border: solid 1px black">{{ elem.item }}</label>
    </div>
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      radioarg: {
        Name: "radioarg",
        masvalue: [
          {
            item: "item1",
            val: "1",
          },
          {
            item: "item2",
            val: "2",
          },
          {
            item: "item3",
            val: "3",
          },
          {
            item: "item4",
            val: "4",
          },
        ],
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
.radioarg {
  position: absolute;
  left: 500px;
}
</style>
