<template>
  <div class="backgroundmain" :style="cssProps">
      <div id="mainbody" :style="cssProps">
        <!-- <div class="wrapper" v-if="changeUser">
          <div class="modal_container">
            <a class="close" @click="[changeUser = false, authPass = '']"></a>
            <div class="changeuser">
              <div class="changeuser_header">
                <p>Профиль</p>
              </div>
              <div class="changeuser_input">
                <p>Логин:</p>
                <input @input="changeLogin" :value=authLogin type="text" autocomplete="one-time-code" />
                <p>Пароль:</p>
                <input @input="changePass" type="password" autocomplete="one-time-code" @keyup.enter="Authorization()"/>
              </div>
              <div class="changeuser_button">
                <div class="changeuser_buttons_button">
                  <button @click="Authorization()">Войти</button>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <svg v-show="this.lines.length" :height="this.myJson.canvas.height * this.multiplier" :width="this.myJson.canvas.width * this.multiplier" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0px; top: 0px;">
          <sline v-for="line in lines" :key="line.name" :params="line.properties" />
        </svg>
        <tiles v-for="elem  in tiless" :key="elem.name" :params="elem.properties" :name="elem.name" :screenPercentage="this.myJson.screenPercentage" :windowWidth="this.myJson.canvas.width" :windowHeight="this.myJson.canvas.height" :type="elem.type"/>
        <!-- <tooltiper v-for="elem in tooltipers" :key="elem.name" :params="elem" tooltiperFromHeader='true'/> -->
        <tooltiper v-for="elem in tooltipers" :key="elem.name" :params="elem" tooltiperFromHeader='true' :ip="this.ip"/>
        <helper v-for="elem in helper" :key="elem.name" :params="elem.properties"/>
        <!-- <div class="Login"  :style="cssProps"><p @click="[outSide($event), openButtons()]" ref="headerrightuser">{{ userName }}</p></div>
        <div v-if="showButtons" class="userButtons" ref="userButtons" :style="{height:35 * this.multiplier + 'px', width: 110 * this.multiplier + 'px', top: 25 * this.multiplier + 'px', right: 25 * this.multiplier + 'px'}">
          <ButtonComponent class="button_logout" :reverseOrder="true" @click.stop="[logoutFromUser(), closeButtons()]" :navigationButton="true"
          icon="logout" :iconStyle="{ color: 'white', width: 25 * this.multiplier + 'px', height: 25 * this.multiplier + 'px', }" /> 
          <ButtonComponent class="button_logout" :reverseOrder="true" @click.stop="[changeUser = true, closeButtons()]" :navigationButton="true"
          icon="user" :iconStyle="{ color: '#267dff', width: 25 * this.multiplier + 'px', height: 25 * this.multiplier + 'px', }" /> 
        </div> -->
        <!-- <button @click="bbb()">version</button> -->
      </div>
  </div>
</template>

<script>

import Tiles from "../Tiles/Tiles.vue";
import Sline from "../Primitives/Sline.vue";
import Tooltiper from "../Neightbours/Tooltiper.vue";
import Helper from '../Primitives/Helper.vue'
import { mapGetters } from "vuex";
import { logout, login } from "@/actions/AuthorizationActions";
import ButtonComponent from '../Button.vue'
import { 
  PutLogout
} from "@/actions/SonicaActions";

export default {
  name: "window",
  props: {
    myJson:{},
  },
  data() {
    return {
      authLogin: null,
      authPass: null,
      changeUser: false,
      multiplier: 1,
      multiplierwindow: 1,
      info: null,
      data: 0,
      lines: [],
      tiless: [],
      tooltipers: [],
      helper:[],
      width: 0,
      height: 0,
      windowname: null,
      showButtons:false,
    };
  },

  components: {
    Tiles,
    Sline,
    Tooltiper,
    Helper,
    ButtonComponent,
  },
  computed: {
    ip() {
      return this.$store.getters.ip;
    },
    cssProps() {
      return {
        "--margin": 'auto',
        "--width": this.myJson.canvas.width * this.multiplier  + "px",
        "--height": this.myJson.canvas.height * this.multiplier + "px",
        "--background": "#" + this.myJson.canvas.background,
        "--borderRadius": this.myJson.canvas.borderRadius + "px",
        "--borderThickness": this.myJson.canvas.borderThickness + "px",
        '--backgroundArea1': parseInt(this.myJson.canvas.backgroundArea.slice(0,2), 16),
        '--backgroundArea2': parseInt(this.myJson.canvas.backgroundArea.slice(2,4), 16),
        '--backgroundArea3': parseInt(this.myJson.canvas.backgroundArea.slice(4,6), 16),
        '--backgroundArea4': parseInt(this.myJson.canvas.backgroundArea.slice(6,8), 16)/(255-0.06) ,
        '--fontsize' :  15 * this.multiplier + 'px',
      };
    },
    ...mapGetters(['GetUserName']),
    userName(){
      return this.GetUserName
    },
    mainheight(){
      return this.$store.getters.mainheight
    },
  },  
  methods: {
    logoutFromUser(){
      this.$store.dispatch("setIsLoading_action", true);
      logout(()=>{
        this.$store.state.tickmas.forEach((el) => {
          clearInterval(el.interval)
        })
        this.$store.state.tickmas = []
        this.$store.dispatch("setIsLoading_action", false);
      });
    },
    reportWindowSize(){
      const multiplierwindow = ((window.innerWidth -2 )/ this.width)
      this.multiplier = this.multiplierwindow * multiplierwindow
      this.$store.dispatch("updatemainheight", this.myJson.canvas.height * this.multiplier )
    },
    openButtons(){
      this.showButtons = !this.showButtons
    },
    outSide(){
      document.addEventListener('mousedown', this.onClickOutside, {once: true})
    },
    onClickOutside(event) {
      const element = this.$refs.userButtons;
      if (element && !element.contains(event.target)) {
        const element1 = this.$refs.headerrightuser;
        if ((element1 && !element1.contains(event.target))) {
          // console.log('НА кнопке закрыл')
          this.closeButtons()
        }
      }
    },
    closeButtons(){
      this.showButtons = false
    },
    Authorization() {
      const self = this;
      PutLogout(()=>{
        function setGuest(){
          login('Guest', 'Guest', (e) =>{})
          self.changeUser = false
          self.authPass = ''
        }
        console.log(self.authLogin, self.authPass)
        if (!(!!self.authLogin && !!self.authPass)) {
          setGuest()
          return;
        }
        this.$store.dispatch("setIsLoading_action", true);
        login(self.authLogin, self.authPass, (e) => {
          if (e.successful) {
            this.changeUser = false
            self.authPass = ''
          } else {
            this.$store.dispatch('AddNotification_action', { text: e.message, type: 'Warning', time: 3000 })
            setGuest()
          }
          this.$store.dispatch("setIsLoading_action", false);
        });
      })
    },
    changeLogin(event){
      this.authLogin = event.target.value
    },
    changePass(event){
      this.authPass = event.target.value
    },
    // bbb(){
    //   console.log('ds')
    //   this.$router.push({name: 'Version'})
    // }
  },

  created() {
    this.$store.watch(
      (state)=> state.userName,
      (newValue, oldValue)=>{
        // console.log('Значение переменной изменилось:', newValue);
        if (newValue != 'Guest') this.authLogin = newValue
        // this.userName = newValue
      })
    this.width = window.innerWidth-2;
    this.height = window.innerHeight ;
    this.windowname = '>:Header'
    this.windowpath = this.myJson.path
    this.multiplierwindow = (this.width) / this.myJson.canvas.width
    window.addEventListener('resize', this.reportWindowSize)
    this.$store.dispatch("changemainheight", this.myJson.canvas.height * this.multiplierwindow)
    this.multiplier = this.multiplierwindow
    if (this.myJson.canvas.width * this.multiplierwindow > window.innerWidth) {
      this.multiplierwindow = window.innerWidth / (this.myJson.canvas.width + 50)
    }
    ;(this.myJson.widgets.$id == undefined ? this.myJson.widgets : this.myJson.widgets.$values).forEach(element => {
      let res = element;
      if (res.type.startsWith("primitives/Line")) {
        this.lines.push(res);
      }
      if (
        res.type.startsWith("tile") ||
        res.type.startsWith("primitives/Text") ||
        res.type.startsWith("Tiles")
      ) {
        this.tiless.push(res);
      }
      if (
        res.type.startsWith("tooltip") ||
        res.type.startsWith("neightbours/Tooltiper") ||
        res.type.startsWith("neightbours/Navigator")) 
      {
        this.tooltipers.push(res);  
      }
      if (res.type.startsWith("primitives/Helper")) {
        this.helper.push(res);
      }
    });
  },
};
</script>

<style scoped>
#mainbody {
  margin: var(--margin);
  position: relative;
  width: var(--width);
  height: var(--height);
  color: white;
  background-color: var(--background);
  /* background-color: #252525FF; */
  border: solid var(--borderThickness) white;
  /* border: solid var(--borderThickness) #252525ff; */
  border-radius: var(--borderRadius);
}
.backgroundmain{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  background: rgba(var(--backgroundArea1),var(--backgroundArea2),var(--backgroundArea3), var(--backgroundArea4));
  height: var(--backgroundheight);
  /* z-index: 1; */
}
</style>
