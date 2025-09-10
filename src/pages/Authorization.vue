
<template>
  <div class="container">
    <div class="header_logo">
      <img src="../assets/logo6.png" />
      <!-- <p>{{ $t('Sonica') }}</p> -->
      <p>Соника Клиент</p>
    </div>
    <div class="form">
      <label>
        <div>
          <icon-adm nameSvg="user" widthSvg="20px" heightSvg="20px" colorSvg="#aaa"/>
          <!-- <v-icon :style="{ color: '#aaa', width: '20px', height: '20px' }" icon="user" /> -->
        </div>
        <input type="text" placeholder="Login" :value="auth_login" @input="auth_login = $event.target.value.trim()" />
      </label>
      <label>
        <div style="height: 100%;">
          <!-- <v-icon :style="{ color: '#aaa', width: '20px', height: '20px' }" icon="lock" /> -->
          <icon-adm nameSvg="lock" widthSvg="20px" heightSvg="20px" colorSvg="#aaa"/>
        </div>
        <input :type="visible_pass" placeholder="Password" :value="auth_pass"
          @input="auth_pass = $event.target.value.trim()" />
          <!-- <icon-adm nameSvg="eyelog" widthSvg="20px" heightSvg="20px" colorSvg="#aaa" @click="visible_pass = 'password'"/> -->
        <!-- <v-icon icon="eye" :style="{ color: '#aaa', width: '20px', marginRight: '6px',  marginLeft: '6px'}" v-if="visible_pass === 'text'"
          @click="visible_pass = 'password'" /> -->
        <icon-adm nameSvg="eyelog" colorSvg="#aaa" widthSvg='21px' heightSvg="21px" marginSvg="12px 5.5px 9px 5.5px" v-if="visible_pass === 'text'"
          @clickOnSvg="visible_pass = 'password'" />
          <!-- <icon-adm nameSvg="eyeslashlog" widthSvg="20px" heightSvg="20px" colorSvg="#aaa"/> -->
        <!-- <v-icon icon="eye-slash" :style="{ color: '#aaa', width: '20px', marginRight: '5px', marginLeft: '5px'}"
          v-if="visible_pass === 'password'" @click="visible_pass = 'text'" /> -->
        <icon-adm nameSvg="eyeslashlog"  colorSvg="#aaa" widthSvg='22px' heightSvg="22px" marginSvg="10px 5px 10px 5px"
          v-if="visible_pass === 'password'" @clickOnSvg="visible_pass = 'text'" />
      </label>
      <div class="authorization_buttons">
        <ButtonComponent class="authorization_button_main" label="Войти" icon="logiot"
                         :iconStyle="{ color: 'white', width: '30px' }" @onClick="Authorization" marginL="5px"/>

        <ButtonComponent class="authorization_button_extra" label="Войти как Гость" icon="logiot"
                         :iconStyle="{ color: 'white', width: '30px' }" @onClick="GuestAuthorization" marginL="5px"/>
      </div>
      <div class="Error" v-if="!!error">
        <icon-adm nameSvg="triangleerror" widthSvg="20px" heightSvg="20px" colorSvg="rgb(163, 0, 0)"/>
        <!-- <v-icon :style="{ color: 'rgb(163, 0, 0)', width: '20px', height: '20px' }" icon="triangle-exclamation" /> -->
        <!-- <p class="error_text">{{ this.$t(error) }}</p> -->
        <p class="error_text">{{error}}</p>
      </div>
      <p class="header_logo"></p>
    </div>
  </div>
</template>
<script>
import { login } from "../actions/AuthorizationActions";
import ButtonComponent from "@/components/Button.vue";
import IconAdm from '@/components/IconAdm.vue';

export default {
  components: {
    ButtonComponent,
    IconAdm,
  },
  data() {
    return {
      error: "",
      auth_login: "",
      auth_pass: "",
      visible_pass: "password",
      swicthLang: '',
      errors: new Map().set('1', 'Пользователя с таким именем не существует').set('2', 'Неверный пароль').set('3', 'Пользователь уже авторизован').set('4', 'Учетная запись временно заблокирована, обратитесь к администратору').set('5', 'Срок действия учетной записи истек').set('16', 'Неизвестная ошибка').set('6', 'Старый проект')
    };
  },
  methods: {
    GuestAuthorization() {
      const guestLogin = 'Guest';
      const guestPassword = 'Guest';

      this.LoadingModalActive(true);
      login(guestLogin, guestPassword, (e) => {
        console.log(e)
        this.LoadingModalActive(false);
        if (e.successful) {
          /*переход на другую страницу */
          this.$router.push("/sonica");
        } else {
          this.errors.get(e.message) ? this.error = this.errors.get(e.message) : this.error = e.message
        }
      });
    },
    //
    Authorization() {
      if (!(!!this.auth_login && !!this.auth_pass)) {
        this.error = "Заполните все поля!";
        return;
      }
      this.LoadingModalActive(true);
      login(this.auth_login, this.auth_pass, (e) => {
        // console.log(e)
        this.LoadingModalActive(false);
        if (e.successful) {
          /*переход на другую страницу */
          this.$router.push("/sonica");
        } else {
          // console.log(e.message)
          // console.log(this.errors.get(e.message))
          this.errors.get(e.message) ? this.error = this.errors.get(e.message) : this.error = e.message
        }
      });
    },

    LoadingModalActive(value) {
      this.$store.dispatch("setIsLoading_action", value);
    },
  },
};
</script>


<style scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header_logo {
  display: flex;
  align-items: center;
  /* align-items: end; */
  color: white;
  font-weight: 700;
  margin: -60px 0 20px 0;
}

.header_logo img {
  width:50px;
}

.header_logo p {
  padding-left: 10px;
  font-size: 35px;
}

.form {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #212121;
  width: 30%;
  padding: 35px 25px 60px 25px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.Error {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
}

.error_text {
  white-space: nowrap;
  font-size: 14px;
  font-family: Gilroy;
  color: rgb(252, 93, 93);
  margin-left: 5px;
}

label {
  margin: 10px 0 10px 0;
  display: inline-block;
  border: solid rgb(65, 65, 65);
  border-collapse: separate;
  border-radius: 5px;
  background: #181818;
  overflow: hidden;
  width: 90%;
}

label {
  display: flex;
  align-items: center;
}

label div {
  padding: 5px 3%;
  background: #383838;
}

label p {
  font-size: 14px;
  font-weight: 400;
  color: black;
}

label input {
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
  height: 100%;
  color: white;
  background: #181818;
  padding: 5px 0 0 5px;
}

.authorization_buttons {
  display: flex;
}

button,
.authorization_button_main {
  display: flex;
  color: white;
  padding: 10px 20px;
  border: none;
  background: #307cb6;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin: 10px;
  width: auto;
}

.authorization_button_extra {
  display: flex;
  color: white;
  padding: 10px 20px;
  border: none;
  background: #181818;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin: 10px;
  width: auto;
}
</style>