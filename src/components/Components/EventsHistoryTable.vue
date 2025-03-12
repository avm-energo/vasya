<script>
import moment from "moment/moment";

export default {
  name: "EventsHistoryTable",
  props: {
    history: {
      type: Array,
      required: true,
    },
    eventsfilter: {
      type: String,
      required: String,
    }
  },
  data () {
    return {
      isSorted: false,
      currentSort: "",
      currentSortDir: "",
      eventTypeName:['Leave','Come','Acknowledgament'],
      historyList: {
        currentSort: "time",
        currentSortDir: "desc",
      },
      historymasVisible:50,
    }
  },
  computed: {
    filteredHistoryList() {
      if (this.historyList.currentSort === "" && this.historyList.currentSortDir === "") {
        return this.history;
      }
      const sortArr = this.history
        .sort((a, b) => {
          let modifier = 1;
          if (this.historyList.currentSortDir === "desc") modifier = -1;
          if (a[this.historyList.currentSort] < b[this.historyList.currentSort]) return -1 * modifier;
          if (a[this.historyList.currentSort] > b[this.historyList.currentSort]) return 1 * modifier;
          return 0;
        })
        .filter((user) => {
          return user.message
            .toLowerCase()
            .includes(this.eventsfilter.toLowerCase());
        });
      console.log("Данные отсортированы")
      return sortArr;
    },
  },
  methods: {
    DateTime(obj) {
      return moment(obj).format("YYYY-MM-DD HH:mm:ss");
    },
    sortHistory(s) {
      // await this.sortArrayAsync(this.historymas, this.currentSortDir, this.currentSort);
      console.log("Начало сортировки")
      // this.isLoading = true;
      if (s === this.historyList.currentSort) {
        this.historyList.currentSortDir = this.historyList.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.historyList.currentSort = s;
      this.historymasVisible = 50;
    },
    async updatedata() {
      console.log('Данные запрошены');
      this.historyList.currentSortDir = "";
      this.historyList.currentSort = "";
      this.historymasVisible = 50;
      this.isLoading = true;
      const data = [];
      data.push(this.endtime);
      data.push(this.starttime);
      await this.$store.dispatch("gethistorytime", data);
      console.log(this.starttime, " - Начало");
      console.log(this.endtime, " - Конец");
    },
  }

}
</script>

<template>
  <table id="history_window_body_table" cellpadding="5">
    <tr>
      <td class="history_window_body_table_columns" style="min-width: 400px;" @click="sortHistory('message')">Message</td>
      <td class="history_window_body_table_columns"  @click="sortHistory('type')">Type</td>
      <td class="history_window_body_table_columns"  @click="sortHistory('time')">Time</td>
<!--      <td class="history_window_body_table_columns">Message</td>-->
<!--      <td class="history_window_body_table_columns">Type</td>-->
<!--      <td class="history_window_body_table_columns">Time</td>-->
    </tr>
    <tr v-for="obj in filteredHistoryList.slice(0, historymasVisible)" :key="obj.id">
      <td>{{ obj.message }}</td>
      <td style="width: 120px;">{{ eventTypeName[obj.type] }}</td>
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