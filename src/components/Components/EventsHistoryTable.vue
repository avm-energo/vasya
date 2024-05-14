<script>
import moment from "moment/moment";

export default {
  name: "EventsHistoryTable",
  props: {
    history: {
      type: Array,
      required: true,
    },
    historymasVisible: {
      type: Number,
      required: true,
    }
  },
  data () {
    return {
      isSorted: false,
      currentSort: "",
      currentSortDir: "",
    }
  },
  computed: {

  },
  methods: {
    DateTime(obj) {
      return moment(obj).format("YYYY-MM-DD HH:mm:ss");
    },
  }

}
</script>

<template>
  <table id="history_window_body_table" cellpadding="5">
    <tr>
      <td class="history_window_body_table_columns" @click="this.$emit('sort','message')">Message</td>
      <td class="history_window_body_table_columns"  @click="this.$emit('sort','type')">Type</td>
      <td class="history_window_body_table_columns"  @click="this.$emit('sort','time')">Time</td>
<!--      <td class="history_window_body_table_columns">Message</td>-->
<!--      <td class="history_window_body_table_columns">Type</td>-->
<!--      <td class="history_window_body_table_columns">Time</td>-->
    </tr>
    <tr v-for="obj in history.slice(0, historymasVisible)" :key="obj.id">
      <td>{{ obj.message }}</td>
      <td>{{ obj.type }}</td>
      <td>{{ DateTime(obj.time) }}</td>
    </tr>
  </table>
</template>

<style scoped>

#history_window_body_table {
  text-align: left;
  margin: 0 auto;
  color: white;
  font-size: 14px;
}

.history_window_body_table_columns {
  color: white;
  text-align: center;
  user-select: none;
  cursor: pointer;
}

.history_window_body_table_columns:hover {
  background: #373737;
}

</style>