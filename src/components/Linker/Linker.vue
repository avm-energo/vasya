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
      </div>
      <div class="navbar-right">
        <input
            v-model.lazy="searchQuery"
            type="text"
            class="search"
            placeholder="Search..."
        />
        <div @click="linkerClose" class="navbar-close">×</div>
      </div>


    </div>
    <div class="content">
      <div class="sidebar" @click="selectItems">
<!--        <template v-if="defer(2)">-->
          <linker-menu
              :padding=5
              :selectedItems="selectedItems"
              :tree="tree"
          />
<!--        </template>-->
      </div>
      <div class="resizer" @mousedown="sidebarResize"></div>
<!--      <template v-if="defer(3)">-->
        <linker-list
            :atoms="atoms"
            :name-path="namePath"
            :is-description="isDescription"
            :relative-path="relativePath"
            :hide-special="hideSpecial"
            :search-query="searchQuery"
            :selected-items="selectedItems"
            :length="length"
            @update="UpdateNumberOfAtoms"
        />
<!--      </template>-->
    </div>
  </div>
</template>

<script>

import LinkerMenu from "@/components/Linker/LinkerMenu/LinkerMenu";
import LinkerList from "@/components/Linker/LinkerList/LinkerList";
import Tooltip from "@/components/Linker/Tooltip/Tooltip";
import axios from 'axios';


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
      selectedItems: null,
      selectedNode: null,
      atomsInterval: null,
    }
  },
  methods: {
    linkerClose() {
      this.$emit('close');
    },
    UpdateNumberOfAtoms(len) {
      this.length = len;
    },
    selectItems(e) {
      if (e.target.className === "list-item" || e.target.className === "list-item-text") {
        let node = null;
        if (e.target.className === "list-item") node = e.target;
        else if (e.target.className === "list-item-text") node = e.target.parentNode;
        node.style.background = "#2667c5";
        if (this.selectedNode === null) this.selectedNode = node;
        if (this.selectedNode !== node) this.selectedNode.style.background = null;
        this.selectedNode = node;
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
      function onMouseMove(e) {
        sidebar.style.width = e.pageX + "px";
      }

      document.addEventListener('mousemove', onMouseMove);

      document.onmouseup = function () {
        e.target.style.backgroundColor = "#555558";
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
      }
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchTree");
    // this.$store.dispatch("fetchAtoms")
    this.atomsInterval = setInterval(() => this.$store.dispatch("fetchAtoms"), 1000);
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
}
.navbar-item {
  display: inline-block;
  padding: 10px;
  font-size: 14px;
}

.navbar-right {
  float: right;
}

.navbar-close {
  display: inline-block;
  font-size: 20px;
  padding: 5px 20px;
  margin-left: 10px;
  cursor: pointer;
}

.navbar-close:hover {
  background: #e81123;
}

.selected {
  padding: 0 10px;
  /*margin-bottom: 10px;*/
  line-height: 0.9;
}
.content {
  display: flex;
  height: calc(100vh - 50px);
}
.sidebar {
  min-width: 200px;
  max-width: 400px;
  background: #181818;
  overflow-y: auto;
  user-select: none;
}

.resizer {
  background: #555558;
  position: relative;
  width: 3px;
  cursor: ew-resize;
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