<template>
  <Loader v-if="$store.getters.IsLoading" />
  <transition-group name="list-errors" class="errors_list" tag="div">
    <Error v-for="error in $store.getters.GetError" :key="error.id" :error="error.text" :id="error.id" />
  </transition-group>
  <transition-group name="list-warnings" class="warnings_list" tag="div">
    <Warning v-for="warning in $store.getters.GetWarning" :key="warning.name" :text="warning.name" :state="warning.state" :id="warning.name"></Warning>
  </transition-group>
  <transition-group name="list-notification" class="notification_list" tag="div">
    <Notification v-for="notification in $store.getters.GetNotification" :key="notification.id"
      :time="notification.time" :type="notification.type" :text="notification.text" :id="notification.id" />
  </transition-group>
  <div class="App_navigation">
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>

import Warning from "./components/Modals/Warning.vue"
import Loader from "./components/Loader.vue";
import Error from "./components/Modals/Error.vue";
import Notification from "./components/Modals/Notification.vue";
import { auth, login, logout } from "./actions/AuthorizationActions";
import { mapGetters } from "vuex";
import { 
  PutLogout,
  GetLogOutTime,
} from "./actions/SonicaActions";


export default {
  components: { Loader, Error, Notification, Warning},
  data(){
    return{
      innactiveTimer: 0,
      innactiveStatus: false,
      // interval: null,
      worker: new Worker('sw.js'),
      asyncReady: false,
    }
  },
  async beforeCreate() {
    let config = await fetch('defaults.json');
    const data = await config.json(); 
    this.$store.dispatch('SetDefaultIp_action', data)
     .then(() => {
        this.asyncReady = true;
    });
    // this.$store.dispatch("fetchTree");
    // setInterval(() => this.$store.dispatch("fetchAtoms"), 1000);
  },
  created() {
    this.worker.postMessage({ interval: 1000 });
    auth();
    // this.$store.state.afkTimer = 60 * 5
    this.uploadData()

  },
  computed:{
    ...mapGetters([
      'GetAfkTimer','GetUserName'
    ]),
    timer(){
      return this.GetAfkTimer
    },
    name(){
      return this.GetUserName
    }
  },
  mounted() {
     if (this.asyncReady) {
      this.SetTimerLogout();
    } else {
      this.$watch('asyncReady', (v) => {
        if (v) this.SetTimerLogout();
      });
    }
  },
  methods:{
    SetTimerLogout(){
      document.addEventListener('mousemove', this.resetTimer);
      GetLogOutTime((state,time)=>{
        if (state) this.$store.state.afkTimer = time
      })
    },
    uploadData(){
      
    },
    resetTimer(){
      this.innactiveTimer = 0
      this.innactiveStatus = false
    },
    LogoutToGuest(){
      PutLogout(()=>{
        this.$store.dispatch('innactivereset')
        this.$store.dispatch('AddNotification_action', { text: `Время вашей сессии истекло!`, type: 'Error', time: 5000 })
        login('Guest', 'Guest', (e) =>{
          // console.log(this.$store.state.tickmas)
          for (let i = 3; i <= this.$store.state.tickmas.length; i++) {
            clearInterval(this.$store.state.tickmas[i].interval)
            this.$store.state.tickmas.splice(i,1);
          }
        })
      })
    },
  },
  watch:{
    timer:{
      handler(newStatus, oldStatus) {
        // console.log(newStatus + '-' + oldStatus)
        if (newStatus != null && newStatus != oldStatus){
          // if (this.interval) clearInterval(this.interval)
          this.worker.addEventListener('message', (e) => {
            if (!this.innactiveStatus && this.name != 'Guest' && localStorage.getItem('userName')) {
              this.innactiveTimer++
              // console.log(this.innactiveTimer)
              if (this.innactiveTimer >= newStatus){
                // console.log(this.innactiveTimer)
                this.innactiveStatus = true
                this.LogoutToGuest()
              }
            }
          });
        }
      }, immediate: true
    },
   '$store.state.userName': function(newValue, oldValue){
    if(newValue!= null) {
      this.$store.dispatch('fetchElems')
    }
   } 
  }
};
</script>


<style>
.button_lang_b{
  color: white;
  background-color: #313131;
  border-radius: 5px;
  position: absolute;
  width: 50px;
  height: 25px;
  bottom: 10px;
  right: 20px;
  z-index: 10;
}
:root {
  /* --color-backround: red; */
}

.App_navigation {
  background-color: rgb(24,24,24) ;
  display: flex;
  width: 100%;
  flex-direction: column;
}
.main{
  height: 100%;
  display: flex;
  width: 100%;
}

.header {
  display: flex;
  width: 100%;
}

#app {
  /* background: var(--color-backround); */
  /* min-height: 100vh; */
  /* height: 100%; */
  overflow: hidden;
  text-align: center;
  font-family: Consolas;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.errors_list {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 4;
}

.notification_list {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, -30px);
  bottom: 0;
  width: 45%;
  z-index: 4;
}

.warnings_list {
  margin-top: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 1%);
  top: 0;
  width: 45%;
  z-index: 4;
}
.list-warnings-enter,
.list-warnings-leave-to{
  opacity: 0;
  transform: translateY(-70px);
}
.list-warnings-enter-active {
  transition: all .3s ease;
}

.list-warnings-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.list-notification-enter,
.list-notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-notification-leave-active {
  /* position: absolute; */
}

.list-errors-enter-active {
  transition: all .3s ease;
}

.list-errors-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.list-errors-enter,
.list-errors-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>


<!-- <template>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Consolas;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style> -->
