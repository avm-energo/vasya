<template>
    <li class="tree-item">
      <div 
        class="tree-item-label"
        :class="{ 
          'selected': isSelected,
          'selectable': isSelectable
        }"
        :style="{ paddingLeft: `${depth * 40 + 10}px` }"
        @click.stop="selectItem"
        @dblclick.stop="toggle"
      >
      <span 
        v-if="hasChildren" 
        class="toggle-icon"
        @click.stop="toggle"
        :class="{ 'is-open': isOpen }"
      >
        ▶
      </span>
        <span class="tree-item-text">
          {{ node.name }}
        </span>
      </div>
      <ul v-if="hasChildren && isOpen" class="tree-subitems">
        <TreeItem 
          v-for="child in node.children" 
          :key="child.id" 
          :node="child"
          :depth="depth + 1"
          :selected-id="selectedId"
          @item-selected="handleItemSelected"
        />
      </ul>
    </li>
  </template>
  
  <script>
  export default {
    name: 'TreeItem',
    props: {
      node: {
        type: Object,
        required: true
      },
      depth: {
        type: Number,
        default: 0
      },
      selectedId: {
        type: [Array,String],
        default: null
      }
    },
    data() {
      return {
        isOpen: false
      }
    },
    computed: {
      hasChildren() {
        return this.node.children && this.node.children.length > 0
      },
      isSelected() {
        return this.selectedId === this.node.id
      },
      isSelectable() {
        return !this.hasChildren
      }
    },
    methods: {
      toggle() {
        if (this.hasChildren) {
          this.isOpen = !this.isOpen
        }
      },
      selectItem() {
        // if (this.isSelectable) {
          this.$emit('item-selected', [this.node.id, this.node.name])
        // }
      },
      handleItemSelected(id) {
        this.$emit('item-selected', id)
      }
    },
    created(){
    }
  }
  </script>
  
  <style scoped>
  .tree-item {
    list-style-type: none;
    margin: 0;
    padding: 0;
    min-width: 100%;
  }
  
  .tree-item-label {
    padding: 8px 10px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    cursor: default;
    min-width: fit-content;
    box-sizing: border-box;
  }
  
  .tree-item-text {
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
  }
  
  .tree-item-label.selectable {
    cursor: pointer;
  }
  
  .tree-item-label:hover {
    background-color: #16466D;
  }
  
  .tree-item-label.selected {
    background-color: #2667C5;
    font-weight: 500;
  }
  
  .toggle-icon {
    display: inline-block;
    width: 16px;
    text-align: center;
    font-size: 12px;
    margin-right: 8px;
    color: #666;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.1s;
  }
  .toggle-icon.is-open {
    transform: rotate(90deg);
  }
  
  .toggle-icon:hover {
    color: #aaa;
  }
  
  .tree-subitems {
    margin: 0;
    padding: 0;
    min-width: 100%;
  }
  </style>