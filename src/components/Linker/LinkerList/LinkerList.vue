<template>
  <div class="tableview" @scroll="tableScroll">
    <table v-if="conditionsTable.length" class="table">
      <thead>
      <tr @mousedown="sorting">
        <th :id=elem :ref=elem :style="{width: `${columnsWidth[elem]}px`}" v-for="elem in Object.keys(conditionsTable[0])">
          {{ elem[0].toUpperCase() + elem.slice(1) }}
          <span class="sorting-arrows arrow-up">↑</span>
          <span class="sorting-arrows arrow-down">↓</span>
          <span @mousedown="resizeColumn" class="resize-handle"></span>
        </th>
      </tr>
      </thead>
      <tbody>
      <linker-list-item v-memo v-for="elem in conditionsTable.slice(0, visibleAtoms)"
                        :elem="elem"
                        :atom="this.atoms.find(el => el.id === elem.id)"
                        :key="elem.id"
                        :columnsResize=columnsResize

      />
      </tbody>
    </table>
    <div v-else>Элементы подгружаются</div>
  </div>
</template>

<script>

import LinkerListItem from "@/components/Linker/LinkerList/LinkerListItem/LinkerListItem";

export default {
  name: "DebugTable",
  components: {LinkerListItem},
  data() {
    return {
      selectedSort: "",
      flag: 0,
      visibleAtoms: 100,
      columnsWidth: {
        id: 56,
        path: 270,
        name: 270,
        description: 270,
        value: 320,
        quality: 90,
        time: 170,
        type: 90,
        mode: 100,
      },
      columnsResize: {
        id: false,
        path: false,
        name: false,
        description: false,
        value: false,
        quality: false,
        time: false,
        type: false,
        mode: false,
      },
    }
  },
  props: {
    atoms: {
      required: true,
    },
    namePath: {
      type: Boolean,
      required: true,
    },
    isDescription: {
      type: Boolean,
      required: true,
    },
    relativePath: {
      type: Boolean,
      required: true,
    },
    hideSpecial: {
      type: Boolean,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
    selectedItems: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    }
  },
  methods: {
    sorting(e) {
      if (e.target.tagName !== "SPAN") {
        if (this.selectedSort.localeCompare(e.target.id) === 0) {
          if (this.flag >= 1) {
            this.flag = 0;
            e.target.getElementsByClassName("arrow-down")[0].style.display = "inline";
            e.target.getElementsByClassName("arrow-up")[0].style.display = "none";
          } else {
            this.flag++;
            e.target.getElementsByClassName("arrow-up")[0].style.display = "inline";
            e.target.getElementsByClassName("arrow-down")[0].style.display = "none";
          }
        } else {
          this.flag = 0;
          e.target.getElementsByClassName("arrow-down")[0].style.display = "inline";
          e.target.getElementsByClassName("arrow-up")[0].style.display = "none";
          let prev = document.getElementById(this.selectedSort)
          if (prev !== null) {
            prev.getElementsByClassName("arrow-down")[0].style.display = "none";
            prev.getElementsByClassName("arrow-up")[0].style.display = "none";
          }
        }
        this.selectedSort = e.target.id;
      }
    },
    resizeColumn(e) {
      let target = e.target.parentNode;
      let oldWidth = target.offsetWidth;
      let oldClientX = e.clientX;

      const onMouseMove = (e) => {
        let offset = e.clientX - oldClientX - 1;
        target.style.width = oldWidth + offset + "px";
        // console.log(oldWidth + offset)
        this.columnsWidth[target.id] = oldWidth + offset;
      }


      onMouseMove(e);

      this.columnsResize[target.id] = true;
      console.log(this.columnsResize[target.id])

      // const cells = document.getElementsByClassName(target.id);
      // console.log(cells)
      //
      // Array.from(cells).forEach(item => {
      //   item.style.maxWidth = "0"
      // })


      if (target.id !== "mode")
        document.addEventListener('mousemove', onMouseMove);

      document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
      }
    },
    tableScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight + 100 >= e.target.scrollHeight) {
        if (this.visibleAtoms <= this.conditionsTable.length) {
          this.visibleAtoms += 100;
          console.log("Докрутил")
          // this.columnsWidth.path = this.$refs.path[0].offsetWidth;

        }

        // this.columnsWidth.name = this.$refs.name[0].offsetWidth;
        // this.columnsWidth.description = this.$refs.description[0].offsetWidth;
      }
    },
  },
  updated() {
    if(this.conditionsTable.length > 0) {
      if (this.$refs.path)
        this.columnsWidth.path = this.$refs.path[0].offsetWidth - 1;
      if (this.$refs.name)
        this.columnsWidth.name = this.$refs.name[0].offsetWidth - 1;
      if (this.$refs.description)
        this.columnsWidth.description = this.$refs.description[0].offsetWidth - 1;
    }
  },
  watch: {
    length(newValue) {
      this.visibleAtoms = 100;
    },
  },
  computed: {
    sortedTable() {
      return [...this.atoms].sort((m1, m2) => {
        if (this.flag === 0) {
          return m1[this.selectedSort] > m2[this.selectedSort] ? 1 : m1[this.selectedSort] === m2[this.selectedSort] ? 0 : -1;
        } else if (this.flag === 1) {
          return m1[this.selectedSort] > m2[this.selectedSort] ? -1 : m1[this.selectedSort] === m2[this.selectedSort] ? 0 : 1;
        }
      })
    },
    selectedTable() {
      return this.sortedTable.filter(item => item.path.includes(this.selectedItems));
    },
    searchedTable() {
      // return this.sortedTable;
      return this.selectedTable.filter(item => item.path.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    conditionsTable() {

      // hideSpecialNumbers
      let arr = this.searchedTable.filter((item) => {
        if (this.hideSpecial) {
          if (item.type.localeCompare('IBlock') === 0 || item.type.localeCompare('BlockState') === 0)
            return false;
        }
        return true;
      })
      arr = arr.map(({qualityBlock, ...keepAttrs}) => keepAttrs);

      arr = arr.map(item => {
        const time = new Date(item.time)
        return {
          ...item,
          time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()},${time.getMilliseconds()} ${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`,
        }
      });

      // Name, Path и description
      if (!this.isDescription) {
        arr = arr.map(({description, ...keepAttrs}) => keepAttrs)
      }
      if (this.namePath) {
        arr = arr.map(item => {
          return {
            id: item.id,
            name: item.path.split(":\\").pop(),
            ...item,
          }
        });
        arr = arr.map(({path, ...keepAttrs}) => keepAttrs);
      } else {
        arr = arr.map(({name, ...keepAttrs}) => keepAttrs)
        if (this.relativePath) {
          let regExp = new RegExp(this.selectedItems.replaceAll(/\\/ig, '\\\\') + ':\\\\');
          arr = arr.map(item => {
            return {
              ...item,
              path: item.path.replace(regExp, ''),
            }
          });
        }
      }
      this.$emit('update', arr.length);
      return arr;
    },
  },
}
</script>
<style scoped>

.tableview {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-left: 10px;
}

table {
  /*width: 100%;*/
  border-right: 1px solid #555558;
  border-bottom: 1px solid #555558;
  border-collapse: separate;
  border-spacing: 0;
  user-select: none;
  font-size: 14px;

}

thead {
  position: sticky;
  top: 0;
  background: #212121;
  z-index: 90;
}

th {
  padding: 10px 0;
  text-align: center;
  border-left: 1px solid #555558;
  overflow: visible;
  position: relative;
  top: 0;
  border-top: 1px solid #555558;
  border-bottom: 1px solid #555558;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

th:hover {
  background: #454545;
}

th#id {
  min-width: 55px;
  max-width: 280px;
}
th#path {
  /*min-width: 75px;*/
  max-width: 650px;
}
th#name {
  /*min-width: 75px;*/
  max-width: 650px;
}
th#description {
  /*min-width: 55px;*/
  max-width: 650px;
}
th#value {
  min-width: 70px;
  max-width: 400px;
}
th#quality {
  min-width: 90px;
  max-width: 300px;
}
th#time {
  min-width: 150px;
  max-width: 180px;
}
th#type {
  min-width: 70px;
  max-width: 90px;
}


.table tbody tr:hover {
  background: #2667c5;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: -4px;
  z-index: 99;
  bottom: 0;
  width: 7px;
  cursor: ew-resize;
}

.sorting-arrows {
  color: #7f7f7f;
  font-size: 14px;
  display: none;
}
</style>