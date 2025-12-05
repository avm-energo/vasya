
import { createStore } from "vuex";
// import ip from '../assets/ip.json'
import moment from "moment";
// import { getTime } from "date-fns";
import { 
  GetComponentsCurrent,
  GetComponentsDelta,
  GetHistoryTime,
 } from "@/actions/SonicaActions";
import {encript} from "@/mixins/encript.js";
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
    notifications:[],
    errors: [],
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
    prevMainWindow: null,
    version: null,
  },
  getters: {
    ip: (state) => state.ip,
    GetDefaultIp: (state) => state.ip,
    IsLoading: (state) => state.isLoading,
    GetAfkTimer: (state) => state.afkTimer,
    GetUserName: (state) => state.userName,
    GetNotification: (state) => state.notifications,
    GetError: (state) => state.errors,
    GetWarning: (state) => state.warning,
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
    GetDefaultIp: (state) => state.ip,
  },
  mutations:{
    AddNotification(state, payload) {
      state.notifications.push({
        id: new Date().getTime(),
        text: payload.text,
        type: payload.type,
        time: payload.time
      });
    },
    DeleteNotification(state, payload) { //payload = id
      state.notifications = state.notifications.filter(element => element.id !== payload)
    },
    DeleteError(state, payload) { //payload = id

      state.errors = state.errors.filter(element => element.id !== payload)
    },
    AddError(state, payload) {
      if (state.errors.findIndex(el => el.text == payload) < 0) {
        state.errors.push({
          text: payload, id: state.errors.length ? state.errors.reverse()[0].id + 1 : 0
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
    SetLinkerTable(state, payload) {
      state.atoms = payload;
    },
    SetLinkerTree(state, payload) {
      state.tree.blocks = payload;
    },
    SetDefaultIp(state,payload){
      state.ip = payload.ip
      state.version = payload.version
    },
    updateLinkerAtoms(state, payload) {

      if (payload === undefined)
        state.atoms = undefined;
      else {
        const payloadMap = new Map(payload.map(atom => [atom.id, atom]));

        state.atoms.forEach(atom => {
          const updatedAtom = payloadMap.get(atom.id);
          if (updatedAtom) {
            atom.value = updatedAtom.value;
            atom.quality = updatedAtom.quality;
            atom.time = updatedAtom.time;
          }
        });
      }
    },

    async fetchElems(state) {
      state.mainheight = window.innerHeight
      GetComponentsCurrent('main', (stateBool, data)=>{
        if (stateBool){
          state.tick = data.tick;
          state.main = data;
          this.dispatch("updateElems", data.path);
        }
      })

      // document.title = a.Caption
      console.log("Ninja ip: " + state.ip)
      console.log("версия: " + state.version)

      GetComponentsCurrent('header',(stateBool, data)=>{
        if (!stateBool || data.widgets==[]){ 
          // state.head = null 
        } else {
          state.head = data;
          this.dispatch("updateElems", data.path);
        }
      })
      setTimeout(() => { state.isLoading = false }, 200);

      GetComponentsCurrent('footer',(stateBool, data)=>{

        if (stateBool){ 
          state.footer = data;
        } else {
          // state.footer = null 
        }
      })
      setTimeout(() => { state.isLoading = false }, 200);
      // const data2 = JSON.parse(await response2.text());
      // if (data2.widgets==[] || data2.status=="404") {
      //   state.head = null 
      // } else {
      //   state.head = data2;
      //   this.dispatch("updateElems", data2.path);
      // }

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

      // let response3 = await fetch(
      //   `http://${state.ip}/api/nodes/footer/current`,{
      //     headers: { Authorization: `${localStorage.getItem('token')}` },
      //   }
      // );
      
      // const data3 = JSON.parse(await response3.text());
      // if (data3.status=='404') {
      //   state.data3 = null 
      // } else {
      //   state.footer = data3;
      //   data3.ip = state.ip
      //   console.log(data3)
      // }

      // Восстановление открытых вкладок после обновления страницы
      // var mas = JSON.parse(sessionStorage.getItem("localArray"))
      // if (mas) {
      //   mas.forEach((element,index) =>{
      //     // console.log(index)
      //     setTimeout(() => {
      //       this.dispatch('addElemsfromStorage', JSON.parse(element))
      //     }, 50*index);
      //   })
      // }

      // setInterval(() => {console.log(state.tickmas)},1000)
    },

    async updateElems(state, name) {
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
      let ticknumber = state.tickmas.length
      let con = {'tick': state.tick, 'name': name.split('\\').join(''), 'mas': [1]}
      state.tickmas.push(con)
      GetComponentsDelta(name, state.tickmas[ticknumber].tick, (stateResponse, data)=>{
        if (stateResponse) {
          var zyx = setTimeout(() => {
            var xyz = setInterval(async () => {
              ticknumber = state.tickmas.findIndex((el => el.name == name.split('\\').join('')))
              state.tickmas[ticknumber].mas = []
              try {
                // console.log(state.tickmas[ticknumber].tick)
                GetComponentsDelta(name, state.tickmas[ticknumber].tick, (stateResponse, data)=>{
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
                })
                state.warning[state.warning.findIndex(elem => elem.name == 'adminja')].state = false
              }
              catch {
                state.warning[state.warning.findIndex(elem => elem.name == 'adminja')].state = true
              }
            }, 1000);
            state.tickmas[ticknumber].interval = xyz
            
          }, 1000 - Math.abs(500 - currentDateMilliseconds));
          state.tickmas[ticknumber].timeout = zyx
        } else {
          console.log('ошибка подключения к ' + name)
        }
      })
    },

    async addElems(state, data) {
      // console.log(data.properties.path)
      if (state.tickmas.find(res => res.name == data.properties.path.split('\\').join(''))) 
      {
        this.dispatch("closewindow", state.tickmas[state.tickmas.length-1].name);
      } else {
        GetComponentsCurrent(data.properties.path, (stateResponse, dataResponse)=>{
          if (stateResponse) {
            dataResponse.infoFromTooltiper = data
            state.elems.push(dataResponse);
            this.dispatch("updateElems", data.properties.path);
          } else {
            state.notifications.push({
              id: state.notifications.length ? state.notifications.reverse()[0].id + 1 : 0,
              text:'Ваш уровень доступа недостаточен для выполнения данной операции',
              type: 'Warning',
              time: 5000
            });
          }
        })

        // let response = await fetch(
        //   `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.properties.path))}/current`,{
        //     headers: { Authorization: `${localStorage.getItem('token')}` },
        //   }
        // );
        // if (response.ok){
        //   // console.log(`http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`)
        //   const res = JSON.parse(await response.text());
        //   res.infoFromTooltiper = data
        //   console.log(res)
        //   state.elems.push(res);
        //   this.dispatch("updateElems", data.properties.path);
        //   // var localArray = sessionStorage.getItem('localArray')
        //   // if (localArray) {
        //   //   var localArray = JSON.parse(sessionStorage.getItem("localArray"))
        //   //   localArray.push(JSON.stringify({name: data.name, title: data.title, screenPercentage: data.screenPercentage}))
        //   //   sessionStorage.setItem('localArray', JSON.stringify(localArray))
        //   // } else {
        //   //   var localArray = [JSON.stringify({name: data.name, title: data.title, screenPercentage: data.screenPercentage})]
        //   //   sessionStorage.setItem('localArray', JSON.stringify(localArray))
        //   // }  
        // } else {
        //   state.notification.push({
        //     id: state.notification.length ? state.notification.reverse()[0].id + 1 : 0,
        //     text:'Ваш уровень доступа недостаточен для выполнения данной операции',
        //     type: 'Warning',
        //     time: 5000
        //   });
        // }
      }
    },

    async addElemsfromStorage(state, data){
      GetComponentsCurrent(data.name, (stateResponse, dataResponse)=>{
          dataResponse.title = data.title
          dataResponse.screenPercentage = data.screenPercentage
          dataResponse.typename = data.name
          state.elems.push(res);
          this.dispatch("updateElems", data.name);
        })
      // let response = await fetch(
      //   `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`, {
      //     headers: { Authorization: `${localStorage.getItem('token')}` },
      //   }
      // );
      //   const res = JSON.parse(await response.text());
      //   res.title = data.title
      //   res.screenPercentage = data.screenPercentage
      //   res.typename = data.name
      //   state.elems.push(res);
      //   this.dispatch("updateElems", data.name);
    },

    changemainheight(state, data){
      state.mainheight = state.mainheight - data
    },
    updatemainheight(state, data){
      state.updatedmainheight = data
    },
    mainmultiplier(state, data){
      state.mainmultiplier = data
    },
    async gethistorytime(state, data){
      GetHistoryTime(data,(stateResponse, data)=>{
        state.historymas = data
      })
      // let response = await fetch(
      //   `http://${state.ip}/api/nodes/history/${moment(data[1]).format("YYYY-MM-DDTHH:mm:ss")}/${moment(data[0]).format("YYYY-MM-DDTHH:mm:ss")}`,
      //     {headers: { Authorization: `${localStorage.getItem('token')}` },}
      // );
      // // console.log(`http://${state.ip}/api/nodes/history/${moment(data[1]).format("YYYY-MM-DDTHH:mm:ss")}/${moment(data[0]).format("YYYY-MM-DDTHH:mm:ss")}`)
      // const res = JSON.parse(await response.text());
      // // console.log(res)
      // state.historymas = res
    },

    innactivereset(state){
      state.elems = []
      sessionStorage.clear()
    },

    addcommandwidgetmass(state, params){
      if (state.commandwidgetmass.find((t) => t.namewindow === params.namewindow)) {
        // дописать логик
        // console.log('da')
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
      console.log(state.commandwidgetmass.find((t) => t.namewindow === name))
      if (state.commandwidgetmass.findIndex((t) => t.namewindow === name) >= 0) state.commandwidgetmass.splice(state.commandwidgetmass.findIndex((t) => t.namewindow === name), 1)
      console.log(state.commandwidgetmass)
    },

    closewindow(state, name) {
      state.commandwidgetmass.splice(state.commandwidgetmass.findIndex((t) => t.namewindow === name), 1)
      const index = state.tickmas.findIndex((t) => t.name === name)
      state.elems.pop();
      clearInterval(state.tickmas[index].interval);
      clearTimeout(state.tickmas[index].timeout)
      state.tickmas.splice(index,1)
      // var localArray = JSON.parse(sessionStorage.getItem("localArray"))
      // localArray.pop()
      // sessionStorage.setItem('localArray', JSON.stringify(localArray))
    },

    async changeMainWindow(state, data){
      console.log(state.tickmas)
      GetComponentsCurrent(data.properties.path, (stateResponse, dataResponse)=>{
        if (stateResponse) {
          if (state.prevMainWindow != data.properties.path) {
            this.dispatch("closewindow", state.tickmas.find((el)=> el.name == state.prevMainWindow.split('\\').join('')).name);
            // if (state.tickmas.find(res => res.name == data.properties.path.split('\\').join(''))) this.dispatch("closewindow", state.tickmas[state.tickmas.length-1].name); 
          }
          state.prevMainWindow = data.properties.path
          dataResponse.infoFromTooltiper = data
          state.main = dataResponse;
          this.dispatch("updateElems", data.properties.path);
        } else {
          state.notifications.push({
            id: state.notifications.length ? state.notifications.reverse()[0].id + 1 : 0,
            text:'Ваш уровень доступа недостаточен для выполнения данной операции',
            type: 'Warning',
            time: 5000
          });
        }
      })
    },
    changeDefaultMainWindowName(state, name){
      state.prevMainWindow = name
    },

  },
  actions: {
    changeDefaultMainWindowName({ commit }, elems) {
      commit("changeDefaultMainWindowName", elems);
    },
    changeMainWindow({ commit }, elems) {
      commit("changeMainWindow", elems);
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
    DeleteError_action({ commit }, payload) { commit('DeleteError', payload) },
    SetWarning_action({ commit }, payload) { commit('SetWarning', payload) },
    fetchLinkerTable_action({ commit }, payload) { commit("SetLinkerTable", payload); },
    fetchLinkerTree_action({ commit }, payload) { commit("SetLinkerTree", payload); },
    fetchLinkerAtoms_action({ commit }, payload) { commit('updateLinkerAtoms', payload); },
    SetDefaultIp_action({ commit }, payload) { commit("SetDefaultIp", payload); },
    // changemain({ commit }, elems) {
    //   commit("changemain", elems);
    // },
  },
  modules: {},
});
