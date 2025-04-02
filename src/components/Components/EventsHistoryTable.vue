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
    },
    historymasVisible: {
      type: Number,
      required: true,
    },
    filterButtons:{
      type: Object,
      required: true,
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
        })
        .filter((event) =>{
          const activeFilters = Object.keys(this.filterButtons).filter(
            key => this.filterButtons[key]
          );
          if (activeFilters.length === 0) return [];
          
            const stateConditions = [];
            const typeConditions = [];

            activeFilters.forEach(filter => {
              switch (filter) {
                case 'alarm': stateConditions.push(event.state === 4); break;
                case 'warning': stateConditions.push(event.state === 2); break;
                case 'normal': stateConditions.push(event.state === 1); break;
                case 'come': typeConditions.push(event.type === 1); break;
                case 'leave': typeConditions.push(event.type === 0); break;
                case 'acknowledged': typeConditions.push(event.type === 2); break;
              }
            });

            if (stateConditions.length > 0 && typeConditions.length > 0) {
              return (
                stateConditions.some(condition => condition) && 
                typeConditions.some(condition => condition)  
              );
            }
            else {
              return [...stateConditions, ...typeConditions].some(condition => condition);
            }
        })
      return sortArr;
    },
  },
  methods: {
    DateTime(obj) {
      return moment(obj).format("DD.MM.YYYY HH:mm:ss");
    },
    sortHistory(s) {
      // await this.sortArrayAsync(this.historymas, this.currentSortDir, this.currentSort);
      console.log("Начало сортировки")
      // this.isLoading = true;
      if (s === this.historyList.currentSort) {
        this.historyList.currentSortDir = this.historyList.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.historyList.currentSort = s;
      // this.historymasVisible = 50;
    },
  },
}
</script>

<template>
  <table id="history_window_body_table" cellpadding="5">
    <thead class="sticky-header">
      <tr>
        <td class="history_window_body_table_columns"></td>
        <td class="history_window_body_table_columns" style="width: 80%; overflow: hidden" @click="sortHistory('message')">Message</td>
        <td class="history_window_body_table_columns" style="width: 5%;" @click="sortHistory('type')">Type</td>
        <td class="history_window_body_table_columns" style="width: 15%;" @click="sortHistory('time')">Time</td>
  <!--      <td class="history_window_body_table_columns">Message</td>-->
  <!--      <td class="history_window_body_table_columns">Type</td>-->
  <!--      <td class="history_window_body_table_columns">Time</td>-->
      </tr>
    </thead>
    <tbody>
      <tr v-for="obj in filteredHistoryList.slice(0, historymasVisible)" :key="obj.id" class="hover">
        <td style="display: flex; justify-content: center; align-items: center; height: 17px; margin-left: 5px;"><div style="width: 10px; height: 10px; border-radius: 50%;" :style="{background: obj.state == 4 ? 'red' : obj.state == 1 ? 'white' : 'yellow'}"></div></td>
        <td style="padding-right: 25px; padding-left: 10px;">{{ obj.message }}</td>
        <td style="width: 120px; padding-right: 25px;">{{ eventTypeName[obj.type]}}</td>
        <td>{{ DateTime(obj.time) }}</td> 
      </tr>
    </tbody>
  </table>
</template>

<style scoped>

#history_window_body_table {
  text-align: left;
  margin: 0 auto;
  color: white;
  font-size: 14px;
  width: 100%;
  border-collapse:collapse;
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

.sticky-header {
  height: 20px;
  position: sticky;
  top: 0px;
  background: #212121;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}
.hover:hover{
  background-color: #373737;
}

</style>