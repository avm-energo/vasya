<template>
  <tooltip></tooltip>
  <div class="linker">
    <div class="navbar">
      <div class="navbar-item">
        <input type="checkbox" name="namePath"
               v-model="namePath"
               id="namePath"
               class="checkbox"
        />
        <label for="namePath">Name/Path</label>
      </div>
      <!--      -->
      <div class="navbar-item">
        <input type="checkbox" name="isDescription"
               v-model="isDescription"
               id="isDescription"
               class="checkbox"
        />
        <label for="isDescription">Show Description</label>
      </div>
      <!--      -->
      <div class="navbar-item">
        <input type="checkbox" name="relativePath" v-if="!namePath"
               v-model="relativePath"
               id="relativePath"
               class="checkbox"
        />
        <input type="checkbox" name="relativePath" v-else disabled
               id="relativePath"
               class="checkbox"
        />
        <label for="relativePath">Relative Path</label>
      </div>
      <!--      -->
      <div class="navbar-item">
        <input type="checkbox" name="hideSpecial"
               v-model="hideSpecial"
               id="hideSpecial"
               class="checkbox"
        />
        <label for="hideSpecial">Hide special atoms</label>
      </div>
      <div class="navbar-item">
        <span class="selected">(Selected {{ this.length }})</span>
        <input
            v-model.lazy="searchQuery"
            type="text"
            class="search"
            placeholder="Search..."
        />
      </div>
      <div @click="linkerClose" class="navbar-close">×</div>

    </div>
    <div class="content">
      <div class="sidebar" @click="selectItems" :style="{maxWidth: `calc((100% - ${windowOffset}px) / 5)`}">
        <!--        <template v-if="defer(2)">-->
        <linker-menu
            :padding=5
            :tree="tree"
            :selected-items="selectedItems"
        />
        <!--        </template>-->
      </div>
      <div class="resizer" @mousedown="sidebarResize"></div>
      <!--      <template v-if="defer(3)">-->
      <linker-list
          v-if="atoms !== undefined"
          :atoms="atoms"
          :name-path="namePath"
          :is-description="isDescription"
          :relative-path="relativePath"
          :hide-special="hideSpecial"
          :search-query="searchQuery"
          :selected-items="selectedItems"
          :length="length"
          :windowOffset="windowOffset"
          @update="UpdateNumberOfAtoms"
      />
      <div v-else>
        <p>Ошибка со стороны сервера</p>
        <button @click="reloadPage">Обновить</button>
      </div>
      <!--      </template>-->
    </div>
  </div>
</template>

<script>

import LinkerMenu from "@/components/Linker/LinkerMenu/LinkerMenu";
import LinkerList from "@/components/Linker/LinkerList/LinkerList";
import Tooltip from "@/components/Linker/Tooltip/Tooltip";
import {fetchLinkerAtoms, fetchLinkerTable, fetchLinkerTree} from "../../actions/LinkerActions";
// import axios from 'axios';


export default {
  name: 'Linker',
  components: {
    LinkerMenu,
    LinkerList,
    Tooltip,
  },
  emits: ['close'],
  data() {
    return {
      // Checkbox conditions
      namePath: false,
      isDescription: false,
      relativePath: false,
      hideSpecial: false,
      // Current number of ConditionsTable
      length: 0,
      // Query from Search textbox
      searchQuery: "",
      // Path from LinkerTree
      selectedItems: ">",
      atomsInterval: null,
      windowOffset: 60,
    }
  },
  methods: {
    reloadPage() {
      location.reload(); // Обновление страницы
    },
    linkerClose() {
      this.$emit('close');
    },
    UpdateNumberOfAtoms(len) {
      this.length = len;
    },
    selectItems(e) {
      console.log(e.target)
      if (e.target.className === "list-item" || e.target.className === "list-item-text") {

        let node = e.target.parentNode;
        let arr = [];
        while (node.id.localeCompare(">") !== 0) {
          arr.push(node.id);
          arr.push(":\\");
          node = node.parentNode;
        }
        arr.push(">");
        this.selectedItems = arr.reverse().join('');
      }
    },
    sidebarResize(e) {
      const sidebar = document.getElementsByClassName("sidebar")[0];
      e.target.style.backgroundColor = "#2667c5";
      let windowOffset = this.windowOffset;

      function onMouseMove(e) {
        sidebar.style.width = e.pageX - windowOffset + "px";
      }

      document.addEventListener('mousemove', onMouseMove);

      document.onmouseup = function () {
        e.target.style.backgroundColor = "#555558";
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
      }
    },
  },
  created() {
    fetchLinkerTree();
    fetchLinkerTable();
    this.atomsInterval = setInterval(() => {
      fetchLinkerAtoms();
    }, 1000);

  },
  updated() {
    this.windowOffset = localStorage.getItem("navigation") === "true" ? 240 : 60;
    console.log(this.atoms, "Updated")
    if (this.atoms === undefined) {
      console.log('Received undefined from the server, stopping interval.');
      clearInterval(this.atomsInterval);
      this.atomsInterval = null;
    }
  },
  beforeUnmount() {
    clearInterval(this.atomsInterval);
  },
  computed: {
    atoms() {
      return this.$store.getters.atoms;
    },
    tree() {
      return this.$store.getters.tree;
    },
  },
}
</script>

<style scoped>

.linker {
  background: #212121;
  color: #ffffff;
  text-align: left;
}

.navbar {
  height: 50px;
  width: calc(100vw - 60px);
}
.navbar-item {
  display: inline-block;
  padding: 10px;
  font-size: 14px;
}

.navbar-close {
  display: inline-block;
  float: right;
  font-size: 20px;
  padding: 5px 20px;
  cursor: pointer;
}

.navbar-close:hover {
  background: #e81123;
}

.selected {
  padding: 0 10px;
}
.content {
  position: relative;
  display: flex;
  height: calc(95vh - 50px);
  /*width: 100%;*/
}
.sidebar {
  position: relative;
  min-width: 200px;
  background: #181818;
  overflow-y: auto;
  user-select: none;
}

.resizer {
  background: #555558;
  position: relative;
  width: 3px;
  cursor: ew-resize;
  user-select: none;
}

/*INPUT*/
.search {
  background: #181818;
  outline: none;
  border: 1px solid #555558;
  padding: 5px;
  width: 200px;
  color: #a5a5a5;
}

/*/////CHECKBOX////*/
.checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.checkbox+label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}
.checkbox+label::before {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  /*border-radius: 0.25em;*/
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}
.checkbox:checked+label::before {
  /*border-color: #0b76ef;*/
  /*background-color: #0b76ef;*/
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}
/*/////////////////////*/
.navbar-item > input[type="checkbox"] {
  margin-right: 5px;
}

</style>