<template>
  <div class="sliderarg1" :style="[ sliderarg1.Orientation == 'Vertical' ? { transform: 'rotate(-90deg)' } : '', ]">
    <div :style="[ sliderarg1.Orientation == 'Vertical' ? { transform: 'rotate(90deg)' } : '', ]">
      {{ sliderarg1.min }}
    </div>
    <div>
      <div
        :style="[
          sliderarg1.Orientation == 'Vertical'
            ? { transform: 'rotate(90deg)' }
            : '',
        ]"
      >
        {{ sliderarg1.value }}
      </div>
      <custom-slider
        :hideLabel="true"
        :min="sliderarg1.min"
        :max="sliderarg1.max"
        :step="sliderarg1.step"
        raising
        v-model="sliderarg1.value"
        @change="submitForm(sliderarg1)"
        :disabled="sliderarg1.disabled"
      />
    </div>
    <div
      :style="[
        sliderarg1.Orientation == 'Vertical'
          ? { transform: 'rotate(90deg)' }
          : '',
      ]"
    >
      {{ sliderarg1.max }}
    </div>
  </div>
</template>

<script>
import CustomSlider from "vue-custom-range-slider";
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      sliderarg1: {
        Name: "sliderarg1",
        value: "50",
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        Orientation: "Verticall",
        min: "0",
        max: "300",
        step: "33",
        disabled: false,
      },
    };
  },
  components: { CustomSlider },
  mixins: [submitform],
};
</script>

<style scoped>
@import "vue-custom-range-slider/dist/vue-custom-range-slider.scss";
.sliderarg1 {
  transform: scale(1, 1);
  left: 320px;
  top: 150px;
  position: absolute;
  display: flex;
  align-items: end;
}
</style>
