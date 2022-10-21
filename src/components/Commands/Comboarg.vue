<template>
  <div class="comboarg">
    <select
      class="comboarg1_value"
      v-model="comboarg.value"
      @change="submitForm(comboarg)"
      :disabled="comboarg.disabled"
    >
      <option v-for="elem in comboarg.masvalue" :key="elem.id">
        {{ elem.item }}
      </option>
    </select>
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      comboarg: {
        Name: "comboarg",
        selected: "",
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
.comboarg {
  position: absolute;
  left: 350px;
  display: flex;
  align-items: center;
  border: solid 1px black;
  width: 120px;
  height: 30px;
}
.comboarg1_value {
  border: none;
  width: 100%;
  text-align: center;
}
.comboarg1_value:focus {
  outline: none;
}
</style>
