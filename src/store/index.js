
import { createStore } from "vuex";
// import ip from '../assets/ip.json'
import moment from "moment";
// import { log4js } from "log4js";

export default createStore({
  state: {
    isLoading: false,
    isAuth: false,
    role: null,
    userName: null,
    userId: null,
    projectId: null,
    userPermissions: null,
    notification:[],
    error: [],
    warning:[{name: 'adminja', state: false}],

    head: null,
    main: null,
    // mainstate: null,
    // buttonstate: [],
    footer: null,
    elems: [],
    atoms: [],
    tree: {blocks: []},
    tickmas: [],
    commandwidgetmass: [],
    tick: null,
    ip: null,
    mainheight: null,
    updatedmainheight: null,
    historymas: [],
    mainmultiplier: true,
    afkTimer: null,
  },
  getters: {
    ip: (state) => state.ip,
    IsLoading: (state) => state.isLoading,
    GetAfkTimer(state) {return state.afkTimer},
    GetUserName (state) {return state.userName},
    GetNotification(state) { return state.notification },
    GetError(state) { return state.error },
    GetWarning(state) {return state.warning},
    main: (state) => state.main,
    mainstate: (state) => state.mainstate,
    mainheight: (state) => state.mainheight,
    updatedmainheight: (state) => state.updatedmainheight,
    head: (state) => state.head,
    footer: (state) => state.footer,
    elems: (state) => state.elems,
    atoms: (state) => state.atoms,
    tree: (state) => state.tree,
    elemByName: (state) => (res) =>
      state.tickmas[state.tickmas.findIndex((s)=> s.name === res.namewindow)]?.mas.find((t) => t.name === res.namewidget),
    historymas: (state) => state.historymas,
    mainmultiplier: (state) => state.mainmultiplier,
    commandwidgets: (state) => (res) =>
      state.commandwidgetmass.find((s)=> s.namewindow === res)?.widgets,
  },
  mutations:{
    AddNotification(state, payload) {
      state.notification.push({
        id: state.notification.length ? state.notification.reverse()[0].id + 1 : 0,
        text: payload.text,
        type: payload.type,
        time: payload.time
      });
    },
    DeleteNotification(state, payload) { //payload = id
      state.notification = state.notification.filter(element => element.id !== payload)
    },
    AddError(state, payload) {
      if (state.error.findIndex(el => el.text == payload) < 0) {
        state.error.push({
          text: payload, id: state.error.length ? state.error.reverse()[0].id + 1 : 0
        });
      }
    },
    SetIsLoading(state, payload) {
      state.isLoading = payload;
    },
    SetIsAuth(state, payload) {
      state.isAuth = payload;
    },
    SetRole(state, payload) {
      state.role = payload;
    },
    SetUserName(state, payload) {
      state.userName = payload;
    },
    SetUserId(state, payload) {
      state.userId = payload;
    },
    SetProjectId(state, payload) {
      state.projectId = payload;
    },
    SetUserPermissions(state, payload){
      state.userPermissions = payload
    },
    SetWarning(state, payload){
      state.warning[state.warning.findIndex(elem => elem.name == payload.name)].state = payload.state
      // console.log(state.warning[state.warning.findIndex(elem => elem.name == payload.name)])
    },
    async fetchAtoms(state) {
      let config = await fetch('defaults.json')
      const a = JSON.parse(await config.text())
      state.ip = a.ip
      let response = await fetch(
          `http://${state.ip}/api/linker/atoms/info`,{
            method: "GET",
            mode: "cors",
          }
      );
      const atoms = JSON.parse(await response.text());
      state.atoms = atoms;
    },

    async fetchTree(state) {
      let config = await fetch('defaults.json')
      const a = JSON.parse(await config.text())
      state.ip = a.ip
      let response = await fetch(
          `http://${state.ip}/api/linker/tree`,{
            method: "GET",
            mode: "cors",
          }
      );
      const tree = JSON.parse(await response.text());
      state.tree.blocks = tree;
    },

    async fetchElems(state) {
      
      state.mainheight = window.innerHeight
      
      let config = await fetch('defaults.json')
      const a = JSON.parse(await config.text())
      state.ip = a.ip
      document.title = a.Caption
      console.log(state.ip)
      console.log("версия: " + a.version)
      // var log4js = require("log4js");
      // var loggerr = log4js.getLogger();
      // loggerr.level = "debug";
      // loggerr.debug("Some debug messages");
      let response = await fetch(
        `http://${state.ip}/api/nodes/main/current`,{
          method: "GET",
          mode: "cors",
          headers: { Authorization: `${localStorage.getItem('token')}` },
        }
      );
      const data = JSON.parse(await response.text());
      state.tick = data.tick;
      state.main = (data);
      this.dispatch("updateElems", data.path);

      let response2 = await fetch(
        `http://${state.ip}/api/nodes/header/current`,{
          headers: { Authorization: `${localStorage.getItem('token')}` },
        }
      );
      setTimeout(() => { state.isLoading = false }, 200);
      const data2 = JSON.parse(await response2.text());
      if (data2.widgets==[] || data2.status=="404") {
        state.head = null 
      } else {
        state.head = data2;
        this.dispatch("updateElems", data2.path);
      }

      // data2.widgets.forEach(async (elem) =>{
      //   if (elem.type.startsWith('neightbours/Navigator')){
      //     let response = await fetch(
      //       `http://${state.ip}/api/nodes/${btoa(elem.properties.path)}/current`
      //     );
      //     const data = JSON.parse(await response.text());
      //     this.dispatch("updateElems", ">:\\" + data.name);
      //     state.main.push(data)
      //     state.buttonstate.push({'name': data.name, 'path': elem.properties.path.split('\\').join('')})
      //     state.mainstate = data.name
      //   }
      // })

      let response3 = await fetch(
        `http://${state.ip}/api/nodes/footer/current`,{
          headers: { Authorization: `${localStorage.getItem('token')}` },
        }
      );
      setTimeout(() => { state.isLoading = false }, 200);
      const data3 = JSON.parse(await response3.text());
      if (data3.status=='404') {
        state.data3 = null 
      } else {
        state.footer = data3;
        data3.ip = state.ip
      }

      var mas = JSON.parse(sessionStorage.getItem("localArray"))
      if (mas) {
        mas.forEach((element,index) =>{
          console.log(index)
          setTimeout(() => {
            this.dispatch('addElemsfromStorage', JSON.parse(element))
          }, 50*index);
        })
      }

      // setInterval(() => {console.log(state.tickmas)},1000)
    },

    async updateElems(state, name) {

      function encript(values) {
        const  Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
        var bitsCount = 8 * values.length;
        var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount%5==0?0:1));
        for (let i = 0; i < ans.length; i++) {
            var bitNum = i * 5;
            var byteNum = Math.trunc(bitNum / 8);
            var byteOffset = bitNum % 8;  
            var symbol = values[byteNum] >> byteOffset;
            if (byteOffset > 3 && byteNum<(values.length-1))
            {
                var symbolOffset = 8 - byteOffset;
                symbol |= values[byteNum+1]<<symbolOffset;
            }
            symbol &= 0b11111; // cut a tail
            ans[i] = Alphabet[symbol];
        }
        return ans.join("")
      }
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      let ticknumber = state.tickmas.length
      let con = {'tick': state.tick, 'name': name.split('\\').join(''), 'mas': [1]}
      // console.log(name)
      state.tickmas.push(con)
      let response = await fetch(
        `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(name))}/delta/0/${
          state.tickmas[ticknumber].tick
        }`,{
          headers: { Authorization: `${localStorage.getItem('token')}` },
        }
      );
      if (response.status == 200) {
        var zyx = setTimeout(() => {
          // console.log("я запустил:" + name)
          var xyz = setInterval(async () => {
            state.tickmas[ticknumber].mas = []
            try {
              console.log(state.tickmas[ticknumber].tick)
              let response = await fetch(
                `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(name))}/delta/0/${
                  state.tickmas[ticknumber].tick ? state.tickmas[ticknumber].tick : -1
                }`,{
                  headers: { Authorization: `${localStorage.getItem('token')}` },
                }
              );
              // console.log(state.tickmas[ticknumber].mas)
              // console.log(`http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(name))}/delta/0/${
              //   state.tickmas[ticknumber].tick
              // }`)
              const s = await response.text()
              // console.log(s)
              const data = JSON.parse(s);
              state.tickmas[ticknumber].tick = data.tick
              ;(data.widgets.$id  == undefined ? data.widgets : data.widgets.$values).forEach(element => {
                if (element.name.startsWith("Sub") || element.name.startsWith("Ren")) {
                  // element.properties.screen.widgets.forEach((elements) => {
                    (element.properties.screen.widgets.$id  == undefined ? element.properties.screen.widgets : element.properties.screen.widgets.$values).forEach(elements => {
                      elements.name += '/' + element.name
                      state.tickmas[ticknumber].mas.push(elements)
                  });
                } else {
                  state.tickmas[ticknumber].mas.push(element)
                }
              });
              // console.log(" time:" + new Date().getHours() + ":"+ new Date().getMinutes() + ":"+ new Date().getSeconds() + ":" + asdasda.getMilliseconds() + ' name = ' + name + " tick:" + state.tickmas[ticknumber].tick) 
              // console.log(data)
              // console.log(state.tickmas[ticknumber])
              state.warning[state.warning.findIndex(elem => elem.name == 'adminja')].state = false
            }
            catch {
              state.warning[state.warning.findIndex(elem => elem.name == 'adminja')].state = true
            }
          }, 1000);
          state.tickmas[ticknumber].interval = xyz
          
        }, 1000 - Math.abs(500 - currentDateMilliseconds));
        state.tickmas[ticknumber].timeout = zyx
      } else if (response.status == 404) {
        console.log('ошибка подключения к ' + name)
      } else {
        console.log(response)
      }
    },

    async addElems(state, data) {
      if (state.tickmas.find(res => res.name == data.name.split('\\').join(''))) 
      {
        this.dispatch("closewindow", state.tickmas[state.tickmas.length-1].name);
      } else {
        function encript(values) {
          const  Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
          var bitsCount = 8 * values.length;
          var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount%5==0?0:1));
          for (let i = 0; i < ans.length; i++) {
              var bitNum = i * 5;
              var byteNum = Math.trunc(bitNum / 8);
              var byteOffset = bitNum % 8;  
              var symbol = values[byteNum] >> byteOffset;
              if (byteOffset > 3 && byteNum<(values.length-1))
              {
                  var symbolOffset = 8 - byteOffset;
                  symbol |= values[byteNum+1]<<symbolOffset;
              }
              symbol &= 0b11111; // cut a tail
              ans[i] = Alphabet[symbol];
          }
          return ans.join("")
        }

        let response = await fetch(
          `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`,{
            headers: { Authorization: `${localStorage.getItem('token')}` },
          }
        );
        if (response.ok){
          // console.log(`http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`)
          const res = JSON.parse(await response.text());
          res.title = data.title
          res.screenPercentage = data.screenPercentage
          res.typename = data.name
          state.elems.push(res);
          this.dispatch("updateElems", data.name);
          var localArray = sessionStorage.getItem('localArray')
          if (localArray) {
            var localArray = JSON.parse(sessionStorage.getItem("localArray"))
            localArray.push(JSON.stringify({name: data.name, title: data.title, screenPercentage: data.screenPercentage}))
            sessionStorage.setItem('localArray', JSON.stringify(localArray))
          } else {
            var localArray = [JSON.stringify({name: data.name, title: data.title, screenPercentage: data.screenPercentage})]
            sessionStorage.setItem('localArray', JSON.stringify(localArray))
          }
          
        } else {
          state.notification.push({
            id: state.notification.length ? state.notification.reverse()[0].id + 1 : 0,
            text:'Ваш уровень доступа недостаточен для выполнения данной операции',
            type: 'Warning',
            time: 5000
          });
        }
      }
    },

    async addElemsfromStorage(state, data){
      function encript(values) {
        const  Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
        var bitsCount = 8 * values.length;
        var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount%5==0?0:1));
        for (let i = 0; i < ans.length; i++) {
            var bitNum = i * 5;
            var byteNum = Math.trunc(bitNum / 8);
            var byteOffset = bitNum % 8;  
            var symbol = values[byteNum] >> byteOffset;
            if (byteOffset > 3 && byteNum<(values.length-1))
            {
                var symbolOffset = 8 - byteOffset;
                symbol |= values[byteNum+1]<<symbolOffset;
            }
            symbol &= 0b11111; // cut a tail
            ans[i] = Alphabet[symbol];
        }
        return ans.join("")
      }
      let response = await fetch(
        `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`, {
          headers: { Authorization: `${localStorage.getItem('token')}` },
        }
      );
      const res = JSON.parse(await response.text());
        res.title = data.title
        res.screenPercentage = data.screenPercentage
        res.typename = data.name
        state.elems.push(res);
        this.dispatch("updateElems", data.name);
    },

    closewindow(state, name) {
      state.commandwidgetmass.splice(state.commandwidgetmass.findIndex((t) => t.namewindow === name), 1)
      const index = state.tickmas.findIndex((t) => t.name === name)
      state.elems.pop();
      clearInterval(state.tickmas[index].interval);
      clearTimeout(state.tickmas[index].timeout)
      state.tickmas.splice(index,1)
      var localArray = JSON.parse(sessionStorage.getItem("localArray"))
      localArray.pop()
      sessionStorage.setItem('localArray', JSON.stringify(localArray))
    },

    changemainheight(state, h){
      state.mainheight = state.mainheight - h
    },
    updatemainheight(state, h){
      state.updatedmainheight = h
    },
    mainmultiplier(state, h){
      state.mainmultiplier = h
    },
    async gethistorytime(state, data){
      let response = await fetch(
        `http://${state.ip}/api/nodes/history/${moment(data[1]).format("YYYY-MM-DDTHH:mm:ss")}/${moment(data[0]).format("YYYY-MM-DDTHH:mm:ss")}`
      );
      console.log(`http://${state.ip}/api/nodes/history/${moment(data[1]).format("YYYY-MM-DDTHH:mm:ss")}/${moment(data[0]).format("YYYY-MM-DDTHH:mm:ss")}`)
      const res = JSON.parse(await response.text());
      state.historymas = res
    },

    innactivereset(state){
      state.elems = []
      sessionStorage.clear()
    },

    addcommandwidgetmass(state, params){
      if (state.commandwidgetmass.find((t) => t.namewindow === params.namewindow)) {
        // дописать логик
        console.log('da')
      } else {
        state.commandwidgetmass.push({'namewindow': params.namewindow, 'widgets': []})
      }
      let indexmas = state.commandwidgetmass.findIndex((t) => t.namewindow === params.namewindow)
      if (state.commandwidgetmass[indexmas].widgets.find((t)=> t.namewidget === params.namewidget)){
       let indexwidget = state.commandwidgetmass[indexmas].widgets.findIndex((t)=> t.namewidget === params.namewidget)
       state.commandwidgetmass[indexmas].widgets[indexwidget].value = params.value
      } else {
      state.commandwidgetmass[indexmas].widgets.push({'namewidget' : params.namewidget, 'value' : params.value})
      }
      // console.log(state.commandwidgetmass)
    },

    clearcommandwidgets(state, name){
      console.log(state.commandwidgetmass.findIndex((t) => t.namewindow === name))
      state.commandwidgetmass.splice(state.commandwidgetmass.findIndex((t) => t.namewindow === name), 1)
      console.log(state.commandwidgetmass)
    }

    // changemain(state, name){
    //   console.log(state.buttonstate.find((t) => t.path === name))
    //   this.mainstate = state.buttonstate.find((t) => t.path === name).name
    //   console.log(this.mainstate)
    // }

  },
  actions: {
    fetchAtoms({ commit }, elems) {
      commit("fetchAtoms", elems);
    },
    fetchTree({ commit }, elems) {
      commit("fetchTree", elems);
    },
    fetchElems({ commit }, elems) {
      commit("fetchElems", elems);
    },
    updateElems({ commit }, elems) {
      commit("updateElems", elems);
    },
    addElems({ commit }, elems) {
      commit("addElems", elems);
    },
    addElemsfromStorage({ commit }, elems) {
      commit("addElemsfromStorage", elems);
    },
    closewindow({ commit }, elems) {
      commit("closewindow", elems);
    },
    changemainheight({ commit }, elems) {
      commit("changemainheight", elems);
    },
    updatemainheight({ commit }, elems) {
      commit("updatemainheight", elems);
    },
    innactivereset({ commit }, elems) {
      commit("innactivereset", elems);
    },
    gethistorytime({ commit }, elems) {
      commit("gethistorytime", elems);
    },
    mainmultiplier({ commit }, elems) {
      commit("mainmultiplier", elems);
    },
    addcommandwidgetmass({ commit }, elems) {
      commit("addcommandwidgetmass", elems);
    },
    clearcommandwidgets({ commit }, elems) {
      commit("clearcommandwidgets", elems);
    },
    setIsLoading_action({ commit }, payload) { commit('SetIsLoading', payload) },
    setIsAuth_action({ commit }, payload) { commit('SetIsAuth', payload) },
    setRole_action({ commit }, payload) { commit('SetRole', payload) },
    setUserName_action({ commit }, payload) { commit('SetUserName', payload) },
    setUserId_action({ commit }, payload) { commit('SetUserId', payload) },
    setProjectId_action({ commit }, payload) { commit('SetProjectId', payload) },
    setUserPermissions_action({ commit }, payload) { commit('SetUserPermissions', payload) },
    AddNotification_action({ commit }, payload) { commit('AddNotification', payload) },
    AddError_action({ commit }, payload) { commit('AddError', payload) },
    DeleteNotification_action({ commit }, payload) { commit('DeleteNotification', payload) },
    SetWarning_action({ commit }, payload) { commit('SetWarning', payload) },

    // changemain({ commit }, elems) {
    //   commit("changemain", elems);
    // },
  },
  modules: {},
});
