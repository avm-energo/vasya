<template>
  <div class="ipadressarg">
    <span
      class="ipadressarg1_star"
      v-show="
        ipadressarg.value != ipadressarg.Notification &&
        ipadressarg.ShowNotification
      "
      >*</span
    >
    <input
      class="ipadressarg1_value"
      :style="[
        ipadressarg.ShowNotification
          ? ipadressarg.value == ipadressarg.Notification
            ? { 'margin-left': '9.5px' }
            : ''
          : { 'margin-left': '9.5px' },
      ]"
      v-model="ipadressarg.value"
      type="text"
      placeholder="255.255.255.255"
      @input="ipchange()"
      @change="ipchange()"
      @blur="[ipadressarg.isValid ? submitForm(ipadressarg) : '']"
      @keyup.enter="[ipadressarg.isValid ? $event.target.blur() : '']"
      :disabled="ipadressarg.disabled"
    />
    <div class="ipadressarg1_error" v-if="!ipadressarg.isValid">
      Ip is Invalid
    </div>
  </div>
</template>

<script>
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      ipadressarg: {
        Name: "ipadressarg",
        value: null,
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        isValid: true,
        regex:
          /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/,
        ShowNotification: true,
        Notification: null,
        disabled: false,
      },
    };
  },
  methods: {
    ipchange() {
      this.ipadressarg.isValid = this.ipadressarg.regex.test(
        this.ipadressarg.value
      );
    },
  },
  mixins: [submitform],
};
</script>

<style scoped>
.ipadressarg {
  position: absolute;
  left: 200px;
  display: flex;
  align-items: center;
  border: solid 1px black;
  width: 120px;
  height: 30px;
}
.ipadressarg1_star {
  width: 10px;
}
.ipadressarg1_value {
  height: 80%;
  width: 90%;
  border: none;
  border-radius: none;
}
.ipadressarg1_value:focus {
  outline: none;
}
.ipadressarg1_error {
  position: absolute;
  top: 40px;
}
</style>
