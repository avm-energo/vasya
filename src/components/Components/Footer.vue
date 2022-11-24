<template>
  <div id="footer">
    <div id="footer_title" @click="clickfooter" :class="[!tablestate ? !upHere ? data['footer-flashing'] ? 'flash' : '' : '' : '', ]" @mouseover="upHere = true" @mouseleave="upHere = false">
      {{ footertitle }}
    </div>
    <div v-show="tablestate">
      <div id="footer_table">
        <table id="table_footer" cellpadding="5">
          <tr>
            <td class="table_footer_columns" @click="sort('comeTime')">Come</td>
            <td class="table_footer_columns" @click="sort('leaveTime')">Leave</td> 
            <td class="table_footer_columns" @click="sort('ackTime')">Acknowledged</td>
            <td class="table_footer_columns" @click="sort('text')">Event</td>
          </tr>
          <tr v-for="obj in filteredEventsList" :key="obj.id" :class="[
            obj.statusEventSignaling == 5 ?  
              obj.warnType == 4 ? 'flashred' : 
              obj.warnType == 2 ? 'flashyellow' :
              obj.warnType == 1 ? 'flashgray' : '' : 
              obj.statusEventSignaling == 1 || obj.statusEventSignaling == 7 ? 
                obj.warnType == 4 ? 'backgroundred' : 
                obj.warnType == 2 ? 'backgroundyellow' :
                obj.warnType == 1 ? 'backgroundgray' : '' : 
                obj.statusEventSignaling == 4 || obj.statusEventSignaling == 8 ? 
                  obj.warnType == 4 ? 'textred' : 
                  obj.warnType == 2 ? 'textyellow' :
                  obj.warnType == 1 ? 'textgray' : '' : ''
              ]" 
              @dblclick="obj.needAck ? some(obj.id) : ''">
            <td style="text-align: center;">{{ DateTime(obj.comeTime) }}</td>
            <td style="text-align: center;">{{ obj.leaveTime != 0 ? DateTime(obj.leaveTime) : ''}}</td>
            <td style="text-align: center;">{{ obj.ackTime ? DateTime(obj.ackTime) : ''}}</td>
            <td style="text-align: center;">{{ obj.text }}</td>
          </tr>
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
  <div id="history_background" v-show="historystate" @click.self="clickhistory">
    <div id="history_window">
      <div id="head">
        <div style="margin: 8px 0 0 8px">EVENTS HISTORY</div>
        <div id="closewindow" @click="clickhistory">x</div>
      </div>
      <div id="history_window_head">
        <div id="history_window_head_datefilter">
          <div id="history_window_head_datefilter_date">
            &#160;&#160;From:&#160;&#160;
            <div style="width: 40%"><datepicker v-model="starttime" /></div>
            &#160;&#160;To:&#160;&#160;
            <div style="width: 40%"><datepicker v-model="endtime" /></div>
            <a class="icons__item" @click="updatedata">
              <svg
                width="30"
                height="30"
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
            <p style="margin-right: 10px;">
              <input type="text" placeholder="Filter" v-model="eventsfilter" style="height:25px; font-size:18px"/>
            </p>
          </div>
        </div>
      </div>
      <div id="history_window_body">
        <table id="history_window_body_table" cellpadding="5">
          <tr>
            <td
              style="color: white; text-align: center; user-select: none"
              @click="sort('message')"
            >
              Message
            </td>
            <td
              style="color: white; text-align: center; user-select: none"
              @click="sort('type')"
            >
              Type
            </td>
            <td
              style="color: white; text-align: center; user-select: none"
              @click="sort('time')"
            >
              Time
            </td>
          </tr>
          <tr v-for="obj in filteredHistoryList" :key="obj.id">
            <td>{{ obj.message }}</td>
            <td>{{ obj.type }}</td>
            <td>{{ DateTime(obj.time) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import moment from "moment";

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
      data: null,
      tablestate: false,
      historystate: false,
      upHere: false,
      currentSort: "message",
      currentSortDir: "asc",
      tick:null
    };
  },
  props: {
    myJson: {},
  },
  components: {
    moment,
    Datepicker,
  },
  created() {
    this.$store.dispatch("changemainheight", 24);
    this.data = this.myJson.data;
    this.footertitle = this.myJson.data["footer-title"];
    this.tick = this.myJson.tick;
    this.events = this.data.events;

    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      setInterval(async () => {
        let response = await fetch(
          `http://${this.myJson.ip}/api/nodes/footer/delta/0/${
            this.tick
          }`
        );
        let obj = JSON.parse(await response.text())
        console.log(obj)
        this.tick = obj.tick
        if (obj.data!=null){
          console.log(obj)
          // if (obj.data["footer-title"]!=null) {this.footertitle = obj.data["footer-title"]}
          if (obj.data["footer-title"]){
            console.log('yest')
            this.footertitle = obj.data["footer-title"]
          } else {
            console.log('net')
          }
          if (obj.data.events){
            obj.data.events.forEach(elem =>{  
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
                console.log('было: ' + event.statusEventSignaling + 'стало: ' + elem.statusEventSignaling)
                if (elem.comeTime != event.comeTime || elem.leaveTime != "0" || elem.statusEventSignaling != event.statusEventSignaling){
                  elem.comeTime ? this.events[eventid].comeTime = elem.comeTime : null
                  elem.leaveTime ? this.events[eventid].leaveTime = elem.leaveTime : null
                  elem.statusEventSignaling != event.statusEventSignaling ? this.events[eventid].ackTime = null : ''
                  this.events[eventid].statusEventSignaling = elem.statusEventSignaling
                  elem.ackTime ? this.events[eventid].ackTime = elem.ackTime : null
                  this.events[eventid].needAck = true
                  // this.events[eventid].leaveTime = null
                  console.log(elem)
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
    }, 1000 - Math.abs(500 - currentDateMilliseconds));

  },
  computed: {
    filteredHistoryList() {
      return this.historymas
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        })
        .filter((user) => {
          return user.message
            .toLowerCase()
            .includes(this.eventsfilter.toLowerCase());
        });
    },
    filteredEventsList() {
      return this.events
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        })
    },
    historymas() {
      return this.$store.getters.historymas;
    },
  },
  methods: {
    some(id){
      let obj = this.events[this.events.findIndex((s)=> s.id === id)]
      // if (!obj.acknowtime) obj.acknowtime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      obj.needAck = false
      obj.statusEventSignaling += 3
      console.log(obj.statusEventSignaling)

      var url = "http://localhost:5201/api/nodes/footer/widget/6MXB7RKGFTT5RNKE/query/acknowledge";
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // console.log(xhr.status);
            // console.log(xhr.responseText);
        }};
      var data = `[${id}]`;
      xhr.send(data);
      console.log(this.events)
    },
    Acknowledgedall(){
      this.events.forEach(elem => {
        if (!elem.acknowtime) this.some(elem.id)
      })
    },

    sort(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    updatedata() {
      const data = [];
      data.push(this.endtime);
      data.push(this.starttime);
      this.$store.dispatch("gethistorytime", data);
      console.log(this.endtime)
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
      this.historystate = !this.historystate;
      if (this.historystate) {
        this.endtime = moment(new Date());
        this.starttime = moment(Date.now() - 86400000 * 366);
        const data = [];
        data.push(this.endtime);
        data.push(this.starttime);
        this.$store.dispatch("gethistorytime", data);
      }
    },
    DateTime(obj) {
      return moment(obj).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style>
#footer {
  z-index: 2;
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
  margin: 0 auto;
  border: 0px;
  font-size: 16px;
}
  .table_footer_columns{
    color: white;
    text-align: center;
    
  }
#footer_title {
  font-size: 16px;
  user-select: none;
  color: white;
  height: 24px;
  background-color: #252525ff;
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
  50% {
    background-color: red;
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
      animation: glowingred 1s step-start 0s infinite;
    }
    @keyframes glowingyellow {
      50% {
        background-color: orange;
        color: white;
      }
    }
    .flashyellow {
      color: yellow;
      animation: glowingyellow 1s step-start 0s infinite;
    }
    @keyframes glowinggray {
      50% {
        background-color: gray;
        color: white;
      }
    }
    .flashgray {
      animation: glowinggray 1s step-start 0s infinite;
    }
    .backgroundred{
      background-color: red;
    }
    .backgroundyellow{
      background-color: orange;
    }
    .backgroundgray{
      background-color: gray;
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
  font-size: 18;
}
#history_window {
  border: solid 1px blue;
  background-color: #101010ff;
  width: 60%;
  height: 80%;
}
#history_window_head_datefilter {
  display: flex;
  justify-content: space-between;
}
#history_window_head_datefilter_date {
  color: white;
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#history_window_head_datefilter_filter {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
#history_window_body {
  padding-top: 10px;
  width: 96%;
  height: 80%;
  overflow-y: auto;
  scrollbar-color: #d4aa70 #e4e4e4;
  scrollbar-width: thin;
}
.icons__item {
  margin-left: 10px;
  width: 38px;
  height: 38px;
  fill: white;
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
  font-size: 20px;
}
</style>
