
import { createStore } from "vuex";
import ip from '../assets/ip.json'
import moment from "moment";

export default createStore({
  state: {
    head: null,
    main: null,
    // mainstate: null,
    // buttonstate: [],
    footer: null,
    elems: [],
    tickmas: [],
    tick: null,
    isLoading: true,
    ip: null,
    mainheight: null,
    updatedmainheight: null,
    historymas: [],
    mainmultiplier: true,
  },
  getters: {
    isLoading: (state) => state.isLoading,
    main: (state) => state.main,
    mainstate: (state) => state.mainstate,
    mainheight: (state) => state.mainheight,
    updatedmainheight: (state) => state.updatedmainheight,
    head: (state) => state.head,
    footer: (state) => state.footer,
    elems: (state) => state.elems,
    elemByName: (state) => (res) =>
      state.tickmas[state.tickmas.findIndex((s)=> s.name === res.namewindow)]?.mas.find((t) => t.name === res.namewidget),
    historymas: (state) => state.historymas,
    mainmultiplier: (state) => state.mainmultiplier,
  },
  mutations: {
    async fetchElems(state) {
      state.mainheight = window.innerHeight
      state.ip = (ip.ip)

      let response = await fetch(
        `http://${state.ip}/api/nodes/main/current`,{
          method: "GET",
          mode: "cors",
        }
      );
      const data = JSON.parse(await response.text());
      state.tick = data.tick;
      state.main = (data);

      let response2 = await fetch(
        `http://${state.ip}/api/nodes/header/current`
      );
      setTimeout(() => { state.isLoading = false }, 200);
      const data2 = JSON.parse(await response2.text());
      state.head = data2;

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
        `http://${state.ip}/api/nodes/footer/current`
      );
      setTimeout(() => { state.isLoading = false }, 200);
      const data3 = JSON.parse(await response3.text());
      state.footer = data3;

      this.dispatch("updateElems", ">:\\" + data.name);
      this.dispatch("updateElems", ">:\\" + data2.name);

      var mas = JSON.parse(sessionStorage.getItem("localArray"))
      if (mas) {
        mas.forEach((element,index) =>{
          console.log(index)
          setTimeout(() => {
            this.dispatch('addElemsfromStorage', JSON.parse(element))
          }, 50*index);
        })
      }
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
      state.tickmas.push(con)
      var zyx = setTimeout(() => {
        // console.log("я запустил:" + name)
        var xyz = setInterval(async () => {
          state.tickmas[ticknumber].mas = []
          let response = await fetch(
            `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(name))}/delta/0/${
              state.tickmas[ticknumber].tick
            }`
          );
          // console.log("number= " + ticknumber + " tick=" + state.tickmas[ticknumber])
          const data = JSON.parse(await response.text());
          
          state.tickmas[ticknumber].tick = data.tick
          data.widgets.forEach((element) => {
            if (element.name.startsWith("Sub")) {
              element.properties.screen.widgets.forEach((elements) => {
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
        }, 1000);
        state.tickmas[ticknumber].interval = xyz
        
      }, 1000 - Math.abs(500 - currentDateMilliseconds));
      state.tickmas[ticknumber].timeout = zyx
    },

    async addElems(state, data) {

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
        `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`
      );
      if (response.ok){
        console.log(`http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`)
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
        alert("Ошибка HTTP: " + response.status)
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
        `http://${state.ip}/api/nodes/${encript((new TextEncoder()).encode(data.name))}/current`
      );
      const res = JSON.parse(await response.text());
        res.title = data.title
        res.screenPercentage = data.screenPercentage
        res.typename = data.name
        state.elems.push(res);
        this.dispatch("updateElems", data.name);
    },

    closewindow(state, name) {
      
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
      const res = JSON.parse(await response.text());
      state.historymas = res
    },

    innactivereset(state){
      state.elems = []
      sessionStorage.clear()
    },

    // changemain(state, name){
    //   console.log(state.buttonstate.find((t) => t.path === name))
    //   this.mainstate = state.buttonstate.find((t) => t.path === name).name
    //   console.log(this.mainstate)
    // }

  },
  actions: {
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
    // changemain({ commit }, elems) {
    //   commit("changemain", elems);
    // },
  },
  modules: {},
});
