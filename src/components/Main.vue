<template>
  <div id="main" v-if="!isLoading">
    <div class="wrapper" v-if="changeUser">
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
    </div>
    <div class="Login"><p @click="[outSide($event), openButtons()]" ref="headerrightuser">{{ userName }}</p></div>
    <div v-if="showButtons" class="userButtons" ref="userButtons">
      <ButtonComponent class="button_logout" :reverseOrder="true" @click.stop="[logoutFromUser(), closeButtons()]" :navigationButton="true"
      icon="logout" :iconStyle="{ color: 'white', width: '25', height: '25' }" /> 
      <ButtonComponent class="button_logout" :reverseOrder="true" @click.stop="[changeUser = true, closeButtons()]" :navigationButton="true"
      icon="user" :iconStyle="{ color: '#267dff', width: '25', height: '25' }" />
    </div>
    <sonica-head v-if="head!=null" :myJson="head" typewindow="head" />
    <sonica-footer v-if="footer!=null" :myJson="footer" />
    <sonica-main v-if="mainJson!=null" :myJson="mainJson" typewindow="main" />
    <sonica-window
      v-for="elem in elems"
      :key="elem.name"
      :myJson="elem"
      :namewindow="elem.typename"
      typewindow="modalwindow"
    />
    <div v-if="linkerShow" class="sonica-linker">
      <sonica-linker @close="linkerClose" />
    </div>
    <!-- develop -->
  </div>
  
</template>

<script>
import SonicaWindow from "./Components/Window.vue";
import SonicaFooter from "./Components/Footer.vue";
import SonicaHead from './Components/Head.vue'
import SonicaMain from './Components/Main.vue'
import SonicaLinker from './Linker/Linker.vue'
import { login, logout } from "../actions/AuthorizationActions";
import { PutLogout, PutAdminActive } from "../actions/SonicaActions";
import { mapGetters } from "vuex";
import ButtonComponent from '../components/Button.vue'



export default {
  name: "Main",
  data() {
    return {
      info: null,
      mas: [],
      tick: null,
      height: null,
      multiplier: null,
      linkerShow: false,
      worker: new Worker('sw.js'),
      showButtons: false,
      authLogin: null,
      authPass: null,
      changeUser: false,
      mainJson: null,
    };
  },

  components: { SonicaWindow, SonicaFooter, SonicaHead, SonicaMain, SonicaLinker, ButtonComponent },

  methods: {
    linkerClose() {
      this.linkerShow = false;
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
    openButtons(){
      this.showButtons = !this.showButtons
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
  },
  created() {
    this.$store.watch(
      (state)=> state.userName,
      (newValue, oldValue)=>{
        // console.log('Значение переменной изменилось:', newValue);
        if (newValue != 'Guest') this.authLogin = newValue
        // this.userName = newValue
      })
    this.height = window.innerHeight
    this.worker.addEventListener('message', (e) => {
      if (this.$store.getters.GetUserName != 'Guest') {
        PutAdminActive((state, data) =>{
          // console.log(data )
          if (state && data === 'Logout') {
            PutLogout(()=>{
              this.$store.dispatch('AddNotification_action', { text: `Выход с пользователя!`, type: 'Error', time: 5000 })
              login('Guest', 'Guest', (e) =>{})
            })
          }
        })
      }
    });
    this.worker.postMessage({ interval: 10000 });
  },
  watch: {
    '$store.getters.main': function() {
      this.mainJson = this.$store.getters.main
    }
  },
  mounted(){
    this.mainJson = this.$store.getters.main
    this.linkerRedirect = function (e) {
      if (e.code === 'KeyL' && e.ctrlKey) {
        e.preventDefault();
        this.linkerShow = true;
      }
    };
    // this.$store.dispatch("updateElems", '>:\\Logic')
    document.addEventListener('keydown', this.linkerRedirect.bind(this))
  },
  computed: {
    // atoms() {
    //   return this.$store.getters.atoms;
    // },
    // tree() {
    //   return this.$store.getters.tree;
    // },
    elems() {
      return this.$store.getters.elems;
    },
    head() {
      return this.$store.getters.head;
    },
    footer() {
      return this.$store.getters.footer;
    },
    // main() {
      
    // },
    isLoading() {
      return this.$store.getters.isLoading;
    },
    ...mapGetters(['GetUserName']),
    userName(){
      return this.GetUserName
    },
    //   cssProps(){
    //     return {
    //       '--width': [this.myJson.properties.canvas.width>this.myJson.properties.canvas.height ? Math.round(this.myJson.properties.canvas.width/(1920/this.width)) + 'px' : Math.round(this.width/(this.myJson.properties.canvas.height/this.myJson.properties.canvas.width)) + 'px'],
    //       '--height': [this.myJson.properties.canvas.height>this.myJson.properties.canvas.width ? Math.round(this.myJson.properties.canvas.height/(1080/this.height)) + 'px' : Math.round(this.height/(this.myJson.properties.canvas.width/this.myJson.properties.canvas.height)) + 'px'],
    //       '--left': (this.width - Math.round(this.myJson.properties.canvas.width/(1920/this.width)))/2 + 'px',
    //       '--backgroundArea': '#' + this.myJson.properties.canvas.backgroundArea
    //     }
    //   },
  },

  beforeCreate() {
    this.$store.dispatch("fetchElems");
    // this.$store.dispatch("fetchTree");
    // setInterval(() => this.$store.dispatch("fetchAtoms"), 1000);
  },
  unmounted(){
    this.worker.postMessage({ stop: true });
  }
};
</script>

<style>
body {
  -webkit-user: none;
}
#main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: v-bind('height');
}

.sonica-linker {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  overflow-y: hidden;
}
.Login{
  cursor: pointer;
  z-index: 1;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: var(--fontsize);
  user-select: none;
  color: white;
}
.Login:hover{
  color: rgb(0, 60, 255);
}
.userButtons{
  z-index: 2;
  border-radius: 10px;
  position: absolute;
  background-color: #574747;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 35px;
  width: 110px;
  top: 25px; 
  right: 25px;
}
.button_logout {
  height: 100%;
  width: 100%;
  /* bottom: 20px; */
  /* padding: 4px 15px 4px 20px; */
  text-decoration: none;
  font-size: 30px;
  border: none !important;
  outline: none;
  cursor: pointer;
}
.wrapper {
  z-index: 3;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
}
.modal_container {
  border: solid 1px #0452c8;
  position: relative;
  /* min-width: 1100px; */
  /* width: 90%; */
  padding: 3px 10px 2px 10px;
  background: #212121;
  /* min-width: fit-content; */
}
.close {
  z-index: 1;
  position: absolute;
  right: 0px;
  top: 5px;
  width: 25px;
  height: 25px;
  opacity: 0.3;
}
.close:hover {
  opacity: 1;
}
.close:before, .close:after {
  position: absolute;
  left: 7px;
  content: ' ';
  height: 26px;
  width: 2px;
  background-color: rgb(252, 3, 3);
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
.changeuser{
  width: 270px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 14px;
}
.changeuser_header p {
  font-size: 20px;
}
.changeuser_input{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 60%;
}
.changeuser_button{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around ;

}
.changeuser_buttons_button button{
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
  border: solid 1px #373737;
  background-color: transparent;
  color: #0364f5;
}
.changeuser_buttons_button button:hover{
  background-color: #0452c8;
  color: white;
}
.changeuser_buttons_button button:active{
  background-color: #0445a6;
  color: black;
}
input[type="text"] , input[type="password"], input[type="number"]{
  border: solid 1px white;
  background-color: #181818;
  color: white;
  /* border: none; */
  font-size: 14px;
  width: 100%;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
}
</style>
