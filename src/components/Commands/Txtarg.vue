<template>
  <div class="txtarg">
    <span
      class="txtarg_star"
      v-show="txtarg.value != txtarg.Notification && txtarg.ShowNotification"
      >*</span
    >
    <input
      :style="[
        txtarg.ShowNotification
          ? txtarg.value == txtarg.Notification
            ? { 'margin-left': '9.5px' }
            : ''
          : { 'margin-left': '9.5px' },
      ]"
      class="txtarg_value"
      v-model="txtarg.value"
      @blur="submitForm(txtarg)"
      @keyup.enter="$event.target.blur()"
      id="txtarg"
      :disabled="txtarg.disabled"
    />
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      txtarg: {
        Name: "txtarg",
        value: null,
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        ShowNotification: true,
        Notification: null,
        disabled: false,
      },
    };
  },
  mixins: [submitform],
};
</script>

<style scoped>
.txtarg {
  position: absolute;
  top: 150px;
  display: flex;
  align-items: center;
  border: solid 1px black;
  width: 80px;
  height: 30px;
}
.txtarg_star {
  width: 10px;
}
.txtarg_value {
  height: 80%;
  width: 90%;
  border: none;
  border-radius: none;
}
.txtarg_value:focus {
  outline: none;
}
</style>
