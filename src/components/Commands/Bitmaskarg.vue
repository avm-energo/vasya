<template>
  <div>
    <div class="bitmaskarg" @click="bitmaskarg.window = !bitmaskarg.window">
      <span class="bitmaskarg1_star" v-show=" bitmaskarg.value != bitmaskarg.Notification && bitmaskarg.ShowNotification ">*</span>
      <span class="bitmaskarg1_value">0x{{ bitmaskargvalue }}</span>
    </div>
    <div class="bitmaskarg1_table" v-show="bitmaskarg.window" v-click-outside="onClickOutside">
      <table style="background-color: gray; color: white">
        <tr>
          <td colspan="3">Bit field</td>
        </tr>
        <tr>
          <td>Position</td>
          <td>Description</td>
          <td>Value</td>
        </tr>
        <tr v-for="elem in bitmaskarg.masvalue" :key="elem.id">
          <td>{{ elem.position }}</td>
          <td>{{ elem.description }}</td>
          <td>
            <input type="checkbox" v-model="elem.value" @change="[elem.value ? (bitmaskarg.value += Math.pow(2, elem.position)) : (bitmaskarg.value -= Math.pow(2, elem.position)),], submitForm(bitmaskarg)" :disabled="bitmaskarg.disabled" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import vClickOutside from "v-click-outside";
import { submitform } from "../../mixins/submitform";

export default {
  name: "app",
  data() {
    return {
      bitmaskarg: {
        Name: "bitmaskarg",
        value: 0,
        masvalue: [
          {
            position: 0,
            description: "000",
            value: false,
          },
          {
            position: 1,
            description: "111",
            value: false,
          },
          {
            position: 2,
            description: "222",
            value: false,
          },
          {
            position: 3,
            description: "333",
            value: false,
          },
          {
            position: 4,
            description: "444",
            value: false,
          },
          {
            position: 10,
            description: "10",
            value: false,
          },
        ],
        window: false,
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        windowlist: false,
        ShowNotification: true,
        Notification: 0,
        disabled: false,
      },
    };
  },
  methods: {
    onClickOutside(event) {
      if (!(event.target._prevClass == "bitmaskarg1_value")) {
        this.bitmaskarg.window = false;
      }
    },
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  computed: {
    bitmaskargvalue() {
      return this.bitmaskarg.value.toString(16).toUpperCase();
    },
  },
  mixins: [submitform],
};
</script>

<style scoped>
.bitmaskarg {
  top: 2px;
  user-select: none;
  position: absolute;
  left: 700px;
  display: flex;
  align-items: center;
  border: solid 1px black;
  width: 60px;
  height: 30px;
}
.bitmaskarg:hover {
  background-color: blue;
}
.bitmaskarg:active {
  background-color: rgb(13, 168, 240);
}
.bitmaskarg1_star {
  position: absolute;
  width: 10px;
}
.bitmaskarg1_value {
  border: none;
  width: 100%;
  text-align: center;
}
.bitmaskarg1_table {
  position: absolute;
  left: 700px;
  top: 34px;
}
</style>
