<template>
  <div id="footer">
    <div id="footer_title" @click="clickfooter" :class="[!tablestate ? !upHere ? footerflashing ? 'flash' : 'footer_title_back' : 'footer_title_back' : 'footer_title_back', ]" @mouseover="upHere = true" @mouseleave="upHere = false" :style="cssProps">
      {{ footertitle }}
    </div>
    <div v-show="tablestate">
      <div id="footer_table">
        <table id="table_footer" cellpadding="5">
          <thead>
            <tr>
              <td class="table_footer_columns" @click="sortEvent('comeTime')">Come</td>
              <td class="table_footer_columns" @click="sortEvent('leaveTime')">Leave</td> 
              <td class="table_footer_columns" @click="sortEvent('ackTime')">Acknowledged</td>
              <td class="table_footer_columns" @click="sortEvent('text')">Event</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="obj in filteredEventsList" :key="obj.id" :class="[
              obj.statusEventSignaling === 5 ?
                obj.warnType === 4 ? 'flashred' :
                obj.warnType === 2 ? 'flashyellow' :
                obj.warnType === 1 ? 'flashgray' : '' :
                obj.statusEventSignaling === 1 || obj.statusEventSignaling === 7 ?
                  obj.warnType === 4 ? 'backgroundred' :
                  obj.warnType === 2 ? 'backgroundyellow' :
                  obj.warnType === 1 ? 'backgroundgray' : '' :
                  obj.statusEventSignaling === 4 || obj.statusEventSignaling === 8 ?
                    obj.warnType === 4 ? 'textred' :
                    obj.warnType === 2 ? 'textyellow' :
                    obj.warnType === 1 ? 'textgray' : '' : ''
                    // obj.warnType === 1 ? 'textgray' : '' : ''
                ]" 
                @dblclick="obj.needAck ? some(obj.id) : ''">
              <td style="text-align: center; padding: 0 7px 0 7px;">{{ DateTime(obj.comeTime) }}</td>
              <td style="text-align: center; padding: 0 7px 0 7px;">{{ obj.leaveTime != 0 ? DateTime(obj.leaveTime) : ''}}</td>
              <td style="text-align: center; padding: 0 7px 0 7px;">{{ obj.ackTime ? DateTime(obj.ackTime) : ''}}</td>
              <td style="text-align: center; padding: 0 7px 0 7px;">{{ obj.text }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="footer_footer">
        <button id="footer_footer_button" @click="clickhistory">
          History...
        </button>
        <button id="footer_footer_button" @click="Acknowledgedall">
          Acknowledged all
        </button>
      </div>
    </div>
  </div>
  <div id="history_background" v-show="historystate" @click.self="clickhistory" :style="cssPropsHistory">
    <div id="history_window">
      <div id="box_loading" v-show="isLoading" >
        <div id="box_loading_center">
          <div id="box_loading_top">
            <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#232323" /><g><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#000000"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(45 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(90 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(135 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#bebebe" transform="rotate(180 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#979797" transform="rotate(225 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#6e6e6e" transform="rotate(270 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#3c3c3c" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g><g><circle fill="#000000" cx="63.66" cy="63.16" r="12"/><animate attributeName="opacity" dur="720ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/></g></svg>
            <div style="color: white;">Загрузка...</div>
          </div>
        </div>
      </div>
      <div id="head">
        <div style="margin: 8px 0 0 8px">EVENTS HISTORY</div>
        <div id="closewindow" @click="clickhistory">x</div>
      </div>
      <div style="display: flex; flex-direction: row; height: calc(100% - 30px);" ref="container" :class="[isResizing ? 'no-selection' : '']">
        <div id="history_window_leftList" :style="{ width: leftWidth + 'px' }">
          <div style="width: calc(100% - 2px); margin-left: 2px; height: 100%;">
            <TreeView :treeData="myJson" @change-name="changeNameFromList"/>
          </div>
        </div>

        <span @mousedown.prevent="startResize" class="resize-handle" :style="{backgroundColor: isResizing ? 'blue' : '#313131'}"></span>

        <div id="history_window_rightList" style="height: 100%;" :style="{ width: rightWidth + 'px' }">
          <div id="history_window_head">
            <div id="history_window_head_datefilter">
              <div id="history_window_head_datefilter_date">
                <p style="font-size: 13px;">&#160;&#160;From:&#160;&#160;</p>
                <div style="width: 40%"><datepicker v-model="starttime" :clearable="false" :style="cssPropsHistory" class="dattepicker" :dark="true"/></div>
                <p style="font-size: 13px;">&#160;&#160;To:&#160;&#160;</p>
                <div style="width: 40%"><datepicker v-model="endtime" :clearable="false" :style="cssPropsHistory" class="dattepicker" :dark="true"/></div>
                <a class="icons__item" @click="updatedata()">
                  <svg
                    width="35"
                    height="35"
                    viewBox="0 0 22 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 18.5549C0 18.1752 0.307804 17.8674 0.6875 17.8674H21.3125C21.6922 17.8674 22 18.1752 22 18.5549C22 18.9346 21.6922 19.2424 21.3125 19.2424H0.6875C0.307804 19.2424 0 18.9346 0 18.5549ZM9.97148 1.37158C9.97148 0.993401 10.2781 0.686829 10.6562 0.686829C11.0344 0.686829 11.341 0.993402 11.341 1.37158V12.3954C11.341 13.1166 12.2105 13.4803 12.724 12.9739L14.4471 11.2746C14.7111 11.0143 15.1351 11.0138 15.3997 11.2735C15.6704 11.5392 15.6709 11.9752 15.4008 12.2416L11.2267 16.3582C10.9098 16.6707 10.4005 16.6701 10.0843 16.3569L5.91017 12.2217C5.64079 11.9548 5.64203 11.5191 5.91292 11.2538C6.17811 10.994 6.60267 10.9952 6.86638 11.2565L8.58718 12.9611C9.10012 13.4692 9.97148 13.1058 9.97148 12.3838V1.37158Z"
                    />
                  </svg>
                </a>
              </div>
              <div id="history_window_head_datefilter_filter">
                <input type="text" placeholder="Filter" v-model="eventsfilter" style="height:38px; font-size:18px; padding-top: 10px; padding-bottom: 10px; overflow: hidden;"/>
              </div>
            </div>
          </div>
          <div class="history_window_body_typeButtons">
            <button :class="{buttonChoosen: filterButtons.alarm}" @click="filterButtons.alarm = !filterButtons.alarm">ALARM</button>
            <button :class="{buttonChoosen: filterButtons.warning}" @click="filterButtons.warning = !filterButtons.warning">WARNING</button>
            <button :class="{buttonChoosen: filterButtons.normal}" @click="filterButtons.normal = !filterButtons.normal">NORMAL</button>
            <button :class="{buttonChoosen: filterButtons.come}" @click="filterButtons.come = !filterButtons.come">COME</button>
            <button :class="{buttonChoosen: filterButtons.leave}" @click="filterButtons.leave = !filterButtons.leave">LEAVE</button>
            <button :class="{buttonChoosen: filterButtons.acknowledged}" @click="filterButtons.acknowledged = !filterButtons.acknowledged">ACKNOWLEDGED</button>
          </div>
          <div id="history_window_body" @scroll="historyWindowScroll" :style="{ overflowY: isLoading ? 'hidden' : 'auto', paddingRight: isLoading && historymas.length>60 ? '12px' : '' }">
          <EventsHistoryTable :history="historymas" :eventsfilter="eventsfilter" :historymasVisible="historymasVisible" :filterButtons="filterButtons" :nameFromList="nameFromList"/>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import moment from "moment";
import EventsHistoryTable from "./EventsHistoryTable.vue";
import { PostAcknowledge } from "../../actions/SonicaActions"
import TreeView from './TreeView.vue'


export default {
  name: "foooter",
  data() {
    return {
      events: [],
      eventsfilter: "",
      eventsstatus: "",
      starttime: null,
      endtime: null,
      footertitle: null,
      footercolor: null,
      footerflashing: null,
      data: null,
      tablestate: false,
      historystate: false,
      upHere: false,
      eventList: {
        currentSort: "comeTime",
        currentSortDir: "asc",
      },
      tick:null,
      isLoading: false,
      sortedArray: null,
      historymasVisible: 110,
      filterButtons:{
        alarm: false,
        warning: false,
        normal: false,
        come: false,
        leave: false,
        Acknowledged: false,
      },
      leftWidth: 300,
      handleWidth: 10,
      containerWidth: 0,
      startX: 0,
      isResizing: false,
      selectedId: 'All',
      nameFromList: 'All',
    };
  },
  props: {
    myJson: {},
  },
  components: {
    moment,
    Datepicker,
    EventsHistoryTable,
    TreeView
  },
  created() {
    this.$store.dispatch("changemainheight", 24);
    this.data = this.myJson.data;
    this.footertitle = this.myJson.data["footer-title"];
    this.footercolor = this.myJson.data['footer-state'];
    this.footerflashing = this.myJson.data['footer-flashing']
    this.tick = this.myJson.tick;
    if (this.data.events) this.events = (this.data.events.$id  == undefined ? this.data.events : this.data.events.$values)
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      var interval = setInterval(async () => {
        let response = await fetch(
          `http://${this.myJson.ip}/api/nodes/footer/delta/0/${
            this.tick ? this.tick : -1
          }`, { headers: { Authorization: `${localStorage.getItem('token')}` }, }
        );
        let obj = JSON.parse(await response.text())
        this.tick = obj.tick
        if (obj.data!=null){
          console.log(obj)
          // if (obj.data["footer-title"]!=null) {this.footertitle = obj.data["footer-title"]}
          if (obj.data["footer-title"]){
            // console.log('yest')
            this.footertitle = obj.data["footer-title"]
          } else {
            // console.log('net')
          }
          this.footercolor = obj.data['footer-state']
          this.footerflashing = obj.data['footer-flashing']
          if (obj.data.events){
            (obj.data.events.$id  == undefined ? obj.data.events : obj.data.events.$values).forEach(elem =>{  
              if (!this.events){
                this.events = []
                this.events.push(elem)
              }
              let eventid = this.events.findIndex((s) => s.id === elem.id)
              let event = this.events[eventid]
              if (event === undefined) {
                elem.needAck = true
                this.events.push(elem)
              } else {
                // console.log('было: ' + event.statusEventSignaling + 'стало: ' + elem.statusEventSignaling)
                if (elem.comeTime != event.comeTime || elem.leaveTime != "0" || elem.statusEventSignaling != event.statusEventSignaling){
                  elem.comeTime ? this.events[eventid].comeTime = elem.comeTime : null
                  elem.leaveTime ? this.events[eventid].leaveTime = elem.leaveTime : null
                  elem.statusEventSignaling != event.statusEventSignaling ? this.events[eventid].ackTime = null : ''
                  this.events[eventid].statusEventSignaling = elem.statusEventSignaling
                  elem.ackTime ? this.events[eventid].ackTime = elem.ackTime : null
                  this.events[eventid].needAck = true
                  // this.events[eventid].leaveTime = null
                  // console.log(elem)
                }
              }
              if (elem.visible == false) {
                this.events.splice(eventid, 1)
              }
            })
          }
        }
        this.data 
      }, 1000);
      this.$store.state.tickmas.push({name: 'footer', interval: interval})
    }, 1000 - Math.abs(500 - currentDateMilliseconds));

  },
  updated() {
    // Этот метод вызывается после перерендера компонента
    // this.isLoading = false;
    // console.log('Компонент Footer был перерендерен');
  },
  computed: {
    rightWidth() {
      return this.containerWidth - this.leftWidth - this.handleWidth;
    },
    multiplier(){
      return this.$parent.multiplier
    },

    // visibleFilteredHistoryMas() {
    //   return this.filteredHistoryList.slice(0, this.historymasVisible);
    //   // return this.historymas.slice(0, this.historymasVisible);
    // },
    filteredEventsList() {
      if (this.events) {
      return this.events
        .sort((a, b) => {
          let modifier = 1;
          if (this.eventList.currentSortDir === "desc") modifier = -1;
          if (a[this.eventList.currentSort] < b[this.eventList.currentSort]) return -1 * modifier;
          if (a[this.eventList.currentSort] > b[this.eventList.currentSort]) return 1 * modifier;
          return 0;
        })
      } else {
        return []
      }
    },
    historymas() {
      // console.log('Данные получены');
      // console.log(this.$store.getters.historymas)
      // console.log(this.$store.getters.historymas.length, " - Текущее число событий");
      return this.$store.getters.historymas;
    },
    cssProps() {
      return {
        "--backgroundColor": this.footercolor
      }
    },
    cssPropsHistory(){
      return{
        "--fontsize": 18 * this.multiplier + 'px'
      }
    },
    processedTreeData() {
      try {
        return this.myJson.data.category.childModels[0].eventMessages || []
      } catch (e) {
        console.error('Error parsing event messages:', e)
        return []
      }
    },
  },
  watch: {
    historymas(newValue) {
      this.updateContainerWidth()
      this.isLoading = false;
      this.$store.dispatch('AddNotification_action', { text: 'Events uploaded ' + newValue.length, type: 'Success', time: 10000 })
    },
    selectedId(newValue){
      console.log(newValue)
    }
    // events:{
    //   deep: true,
    //   handler(newValue) {
    //     newValue.forEach((el)=>{
    //       console.log(el)
  
    //     })
    //   }
    // }
  },
  mounted() {
    window.addEventListener('resize', this.updateContainerWidth);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateContainerWidth);
  },
  methods: {
    changeNameFromList(data){
      this.nameFromList= data
    },
    async updatedata() {
      console.log('Данные запрошены');
      // this.historymasVisible = 50;
      this.isLoading = true;
      const data = [];
      data.push(this.endtime);
      data.push(this.starttime);
      await this.$store.dispatch("gethistorytime", data);
      // console.log(this.starttime, " - Начало");
      // console.log(this.endtime, " - Конец");
      this.isLoading = !this.isLoading;
    },
    // sortArrayAsync(array, currentSortDir, currentSort) {
    //   console.log(array, " - Array in Worker")
    //   // Создаем Promise и возвращаем результат отсортированного массива
    //   return new Promise((resolve, reject) => {
    //     const worker = new SortWorker();
    //     worker.onmessage = event => {
    //       this.sortedArray = event.data; // Сохраняем отсортированный массив
    //       resolve(); // Разрешаем промис после получения отсортированных данных
    //     };
    //     worker.postMessage(array, currentSortDir, currentSort);
    //   });
    // },
    historyWindowScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight + 50 >= e.target.scrollHeight) {
        if (this.historymasVisible <= this.historymas.length) {
          this.historymasVisible += 100;
        }
      }

    },
    some(id){
      if (localStorage.getItem('userName') == 'Guest') {
        this.$store.dispatch('AddNotification_action', { text: 'Гость не может квитировать события!', type: 'Warning', time: 5000 })
      } else {
        PostAcknowledge( id,(state)=>{
        if (state) {
          let obj = this.events[this.events.findIndex((s)=> s.id === id)]
          // if (!obj.acknowtime) obj.acknowtime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          obj.needAck = false
          obj.ackTime = this.DateTime(Date.now())
          obj.statusEventSignaling += 3
        } else {

        }
      })
      }
    },
    Acknowledgedall(){
      if (localStorage.getItem('userName') == 'Guest') {
        this.$store.dispatch('AddNotification_action', { text: 'Гость не может квитировать события!', type: 'Warning', time: 5000 })
      } else {
        if (this.events){
          this.events.forEach(elem => {
            if (!elem.ackTime ) this.some(elem.id)
          })
        }
      }
    },

    sortEvent(s) {
      // await this.sortArrayAsync(this.historymas, this.currentSortDir, this.currentSort);
      console.log("Начало сортировки")
      // this.isLoading = true;
      if (s === this.eventList.currentSort) {
        this.eventList.currentSortDir = this.eventList.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.eventList.currentSort = s;
      this.historymasVisible = 100;
    },
    clickfooter() {
      this.tablestate = !this.tablestate;
      // if (this.tablestate){
      //   this.$store.dispatch("changemainheight", 170)
      // } else {
      //   this.$store.dispatch("changemainheight", -170)
      // }
      
    },
    clickhistory() {
      setTimeout(()=>{
        this.updateContainerWidth() 
      },10)
      this.tablestate = false
      this.historymasVisible = 100;
      this.historystate = !this.historystate;
      this.isLoading = true
      if (this.historystate) {
        this.endtime = moment(new Date());
        this.starttime = moment(Date.now() - 86400000 * 1);
        const data = [];
        data.push(this.endtime);
        data.push(this.starttime);
        this.$store.dispatch("gethistorytime", data);
      }
    },
    DateTime(obj) {
      return moment(obj).format("YYYY-MM-DD HH:mm:ss");
    },
    updateContainerWidth() {
      this.containerWidth = this.$refs.container.offsetWidth + 10;
      // console.log(this.containerWidth)

    },
    startResize(e) {
      this.isResizing = true;
      this.startX = e.clientX || e.touches[0].clientX;
      
      document.addEventListener('mousemove', this.handleResize);
      document.addEventListener('touchmove', this.handleResize, { passive: false });
      document.addEventListener('mouseup', this.stopResize);
      document.addEventListener('touchend', this.stopResize);
    },
    handleResize(e){
      if (!this.isResizing) return;
      e.preventDefault();
      
      const clientX = e.clientX || e.touches[0].clientX;
      const newLeftWidth = this.leftWidth + (clientX - this.startX);
      
      const minWidth = 100;
      const maxWidth = this.containerWidth - this.handleWidth - 250;
      
      this.leftWidth = Math.max(minWidth, Math.min(maxWidth, newLeftWidth));
      this.startX = clientX;
    },

    stopResize(){
      this.isResizing = false;
      document.removeEventListener('mousemove', this.handleResize);
      document.removeEventListener('touchmove', this.handleResize);
      document.removeEventListener('mouseup', this.stopResize);
      document.removeEventListener('touchend', this.stopResize);
    },
  },
};
</script>

<style>
.no-selection {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.dattepicker{
  user-select: none !important;
  min-width: 130px;
}
#footer {
  z-index: 200;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
#table_footer {
  user-select: none;
  text-align: left;
  font-weight: bold;
  border-spacing: 0px;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 0 auto;
  border: 0px;
  font-size: 16px;
}

tbody{
  overflow: auto;
}
.table_footer_columns{
  color: white;
  text-align: center;
  cursor: pointer;
  min-width: 150px
}

.table_footer_columns:hover {
  background: #373737;
}
#footer_title {
  font-size: 16px;
  user-select: none;
  color: white;
  height: 24px;
  background-color: #252525ff
}
#footer_title_back{
  background-color: #252525ff
}
#footer_footer {
  font-size: 16px;
  user-select: none;
  color: white;
  height: 24;
  background-color: #252525ff;
}
#footer_footer_button {
  color: white;
  height: 100%;
  background-color: rgb(61, 61, 61);
  border: 0px;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
#footer_title:hover {
  filter: brightness(150%);
}
#footer_table {
  color: white;
  height: 200px;
  overflow-y: auto;
  text-align: center;
  background-color: rgb(27, 27, 27);
}

@keyframes glowing {
  from {
    background-color: var(--backgroundColor);
    color: black;
  }
  50% {
    background-color: #252525ff;
    color: white;
  }
  to {
    background-color: var(--backgroundColor);
    color: black;
  }
}
.flash {
  animation: glowing 2s step-start 0s infinite;
}
    @keyframes glowingred {
      50% {
        background-color: red;
        color: white;
      }
    }
    .flashred {
      color: red;
      animation: glowingred 2s step-start 0s infinite;
    }
    @keyframes glowingyellow {
      50% {
        background-color: yellow;
        color: black;
      }
    }
    .flashyellow {
      color: yellow;
      animation: glowingyellow 2s step-start 0s infinite;
    }
    @keyframes glowinggray {
      50% {
        background-color: gray;
        color: white;
      }
    }
    .flashgray {
      animation: glowinggray 2s step-start 0s infinite;
    }
    .backgroundred{
      background-color: red;
      color: white;
    }
    .backgroundyellow{
      background-color: yellow;
      color: black
    }
    .backgroundgray{
      background-color: gray;
      color: black;
    }
    .textred{
      color: red;
    }
    .textyellow{
      color: yellow;
    }
    .textgray{
      color: white;
    }
    




#closewindow {
  user-select: none;
  color: blue;
  font-size: 25px;
  width: 25px;
  text-align: center;
  height: 100%;
  margin-right: 5px;
}
#head {
  color: white;
  padding: 2px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  background-color: #212121;
}
#history_background {
  z-index: 2;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  font-size: var(--fontsize);
}
#history_window {
  border: solid 1px blue;
  background-color: #101010ff;
  width: 90%;
  height: 80%;
  position: relative;

}
#history_window_head_datefilter {
  display: flex;
  justify-content: space-between;
  overflow: hidden; 
  background-color: #212121;
}
#history_window_head_datefilter_date {
  color: white;
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  z-index: 1;
  container-type: inline-size;
  min-width: 300px;
}
#history_window_head_datefilter_date p{
  transition: width 0.5s ease;
  width: 50px;
  }
@container (max-width: 400px) {
  #history_window_head_datefilter_date p{
    width: 0px;
    transition: width 0.5s ease;
  }
}
#datepicker{
  font-size: var(--fontsize);
}
#history_window_head_datefilter_filter {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: 250px;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 10px;
}
#history_window_body {
  width: 100%;
  height: 91.9%; /* высота списка  */
  overflow-y: auto;
  position: relative;
}
#history_window_body::-webkit-scrollbar {
  width: 12px;               /* ширина scrollbar */
}
#history_window_body::-webkit-scrollbar-track {
  background: #212121;        /* цвет дорожки */
}
#history_window_body::-webkit-scrollbar-thumb {
  background-color: #414141;    /* цвет плашки */
}
#history_window_body::-webkit-scrollbar-thumb:hover {
  background-color: #515151;    /* цвет плашки */
}
#history_window_body::-webkit-scrollbar-button:single-button {
  background-color: #212121;
  display: block;
  height: 20px;
  width: 16px;
  background-position: center;
  background-repeat: no-repeat;
}
#history_window_body::-webkit-scrollbar-button:single-button:vertical:decrement {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23888' d='M5 0l5 6H0z'/%3E%3C/svg%3E");
}

#history_window_body::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23555' d='M5 0l5 6H0z'/%3E%3C/svg%3E");
}

/* Стрелка вниз (встроенный SVG) */
#history_window_body::-webkit-scrollbar-button:single-button:vertical:increment {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23888' d='M5 6l5-6H0z'/%3E%3C/svg%3E");
}

#history_window_body::-webkit-scrollbar-button:single-button:vertical:increment:hover {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23555' d='M5 6l5-6H0z'/%3E%3C/svg%3E");
}
#history_window_body::-webkit-scrollbar-button:single-button:horizontal:decrement {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23888' d='M0 5l6-5v10z'/%3E%3C/svg%3E");
}

#history_window_body::-webkit-scrollbar-button:single-button:horizontal:decrement:hover {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23555' d='M0 5l6-5v10z'/%3E%3C/svg%3E");
}

/* Стрелка вниз (встроенный SVG) */
#history_window_body::-webkit-scrollbar-button:single-button:horizontal:increment {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23888' d='M6 5L0 10V0z'/%3E%3C/svg%3E");
}

#history_window_body::-webkit-scrollbar-button:single-button:horizontal:increment:hover {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23555' d='M6 5L0 10V0z'/%3E%3C/svg%3E");
}

#history_window_body::-webkit-scrollbar-corner {
  background-color: #212121; /* Цвет фона */
  /* border: 1px solid #ccc;   Рамка (опционально) */
  /* border-radius: 2px;       Скругление углов (опционально) */
}

.nonScrollable {
  overflow-y: hidden;
}

.icons__item {
  margin-left: 10px;
  margin-right: 10px;
  width: 41px;
  height: 41px;
  fill: white;
  padding-left: 3px;
  padding-right: 3px;
}
.icons__item:hover {
  background-color: #267dff;
}
.icons__item:active {
  background-color: #68a5ff;
}
#history_window_body_table {
  text-align: left;
  margin: 0 auto;
  color: white;
  font-size: var(--fontsize);
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

#box_loading {
  background: rgba(35, 35, 35, 0.8);
  position: absolute;
  /* border: solid 1px green; */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /* left: var(--x); */
  /* top: var(--y); */
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
}


.dp__theme_dark {
   --dp-background-color: #212121;
   --dp-text-color: #ffffff;
   --dp-hover-color: #484848;
   --dp-hover-text-color: #ffffff;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: #005cb2;
   --dp-primary-text-color: #ffffff;
   --dp-secondary-color: #a9a9a9;
   --dp-border-color: #2d2d2d;
   --dp-menu-border-color: #2d2d2d;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #737373;
   --dp-scroll-bar-background: #212121;
   --dp-scroll-bar-color: #484848;
   --dp-success-color: #00701a;
   --dp-success-color-disabled: #428f59;
   --dp-icon-color: #959595;
   --dp-danger-color: #e53935;
   --dp-highlight-color: rgba(0, 92, 178, 0.2);
}

.history_window_body_typeButtons{
  background-color: #212121;
}
.history_window_body_typeButtons button{
  width: calc(100% / 6);
  background-color: transparent;
  color: white;
  border: solid 1px transparent;
  padding-top: 8px;
  padding-bottom: 8px;
  /* min-width: 150px; */
  overflow: hidden;
}
.history_window_body_typeButtons button:hover{
  background-color: #16466C;
}
.history_window_body_typeButtons button:active{
  background-color: #0767B3;
}
.buttonChoosen{
  border-color: #0767B3 !important;
}
.resize-handle {
  width: 3px;
  height: 100%;
  cursor: ew-resize;
}
.history_window_leftList{
}
.history_window_rightList{
}
</style>
