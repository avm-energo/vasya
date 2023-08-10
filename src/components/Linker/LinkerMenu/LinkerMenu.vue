<template>
  <ul v-memo="tree" v-for="subTree of tree.blocks" :id="subTree.tag" :class="[{closed : subTree.tag !== '>' }, 'list']">
    <li :class="['list-item']" :style="{ paddingLeft: padding + 'px' }">
      <span @click="sidebarToggle" v-if="subTree.blocks.length !== 0" :class="[{first: subTree.tag === '>'},'list-item-btn']">▶</span>
      <span class="list-item-color" :style="{background: menuColors[subTree.state]}"></span>
      <span class="list-item-text">{{ subTree.tag }}</span>
    </li>
    <linker-menu :selectedItems="selectedItems" :padding="this.padding + 20" :tree="subTree"/>
  </ul>
</template>


<script>
export default {
  name: "LinkerMenu",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    padding: {
      type: Number,
      required: true,
    },
    selectedItems: {
      required: true,
    }
  },
  data() {
    return {
      flag: false,
      menuColors: {
        0: "#6dec58",
        1: "#555555",
        2: "#257cf9",
        3: "#ffe560",
        4: "#ff5045",
        5: "#9a30c7",
      },
    }
  },
  mounted() {
    if (this.tree.tag === '>') {
      document.getElementsByClassName('list-item-btn')[0].click();
    }
  },
  methods: {
    sidebarToggle(e) {
      if (e.target.textContent.localeCompare("▼") === 0) {
        e.target.innerHTML = "▶";
        e.target.style.fontSize = '14px';
        e.target.style.marginTop = '2px';
      } else if (e.target.textContent.localeCompare("▶") === 0) {
        e.target.innerHTML = "▼";
        e.target.style.fontSize = '17px';
        e.target.style.marginTop = '0';
      }
      let nodes = e.target.parentNode.parentNode.children;
      let first = true;
      for (const node of nodes) {
        if (first) first = false
        else node.classList.toggle("closed")
      }
    },
  },
}
</script>

<style scoped>

.list {
  list-style: none;
  font-size: 14px;
  padding: 0;
  margin: 0;
}

.closed {
  display: none;
}

.list-item {
  position: relative;
  height: 25px;
  padding-top: 8px;
  padding-bottom: 4px;
  cursor: pointer;
  padding-right: 10px;

}

.list-item:hover {
  background: #124268;
}

.list-item-btn {
  position: absolute;
  margin-top: 2px;
  /*font-size: 15px;*/
}

.list-item-btn:hover {
  color: #257cf9;
}

.list-item-btn:active {
  color: #2667c5;
}

.selected {
  background: #2667c5;
}

.list-item-color {
  position: absolute;
  height: 20px;
  margin-left: 20px;
  width: 2px;
}

.list-item-text {
  margin-left: 35px;
  font-size: 15px;
}
</style>