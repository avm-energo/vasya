<template>
    <div class="tree-container">
        <ul class="tree-view">
            <li class="tree-item">
                <div class="tree-item-label" :style="{ paddingLeft: '10px' }"
                    :class="{ 'selected': selectedId === 'all' }" @click="selectAll">
                    <span class="toggle-icon-placeholder"></span>
                    <span class="tree-item-text">
                        All
                    </span>
                </div>
            </li>
            <TreeItem v-for="item in processedTreeData" :key="item.id" :node="item" :depth="0" :selected-id="selectedId"
                @item-selected="handleItemSelected" />
        </ul>
    </div>
</template>

<script>
import TreeItem from './TreeItem.vue'
import { ref, computed } from 'vue'

export default {
    name: 'TreeView',
    components: {
        TreeItem
    },
    props: {
        treeData: {
            type: Object,
            required: true
        },
    },
    setup(props, {emit}) {
        const selectedId = ref('all')
        // Преобразование данных в древовидную структуру
        const processedTreeData = computed(() => {
            if (props.treeData.data?.category?.childModels) {
                const categories = props.treeData.data.category.childModels
                return categories.map((category, index) => ({
                    id: `category-${index}`,
                    name: category.title || 'Unnamed Category',
                    children: category.eventMessages.map((subCategory, index) => ({
                        id: `${category.title}-${index}`,
                        name: subCategory.message || 'Unnamed Subcategory',
                    }))
                }))
            } else {
                return []
            }
        })
        const selectAll = () => {
            selectedId.value = 'all'
            emit('change-name', 'All')
        }
        const handleItemSelected = (obj) => {
            selectedId.value = obj[0]
            emit('change-name', obj[1])

        }
        return {
            selectedId,
            processedTreeData,
            selectAll,
            handleItemSelected
        }
    },
}
</script>

<style scoped>
.tree-container {
    width: 100%;
    height: 100%;
    background-color: #212121;
    overflow: hidden;
}

.tree-view {
    border-top: solid 2px #313131;
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-family: Arial, sans-serif;
    color: white;
    user-select: none;
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    background-color: inherit;
}

.tree-view::-webkit-scrollbar {
    width: 12px;
}

.tree-view::-webkit-scrollbar-track {
    background: #212121;
}

.tree-view::-webkit-scrollbar-thumb {
    background-color: #414141;
    /* border-radius: 6px; */
    /* border: 1px solid #212121; */
}

.tree-view::-webkit-scrollbar-thumb:hover {
    background-color: #515151;
}

.tree-view::-webkit-scrollbar-button:single-button {
    background-color: #212121;
    display: block;
    height: 16px;
    width: 16px;
    background-position: center;
    background-repeat: no-repeat;
}

.tree-view::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23888' d='M5 0l5 6H0z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23555' d='M5 0l5 6H0z'/%3E%3C/svg%3E");
}

/* Стрелка вниз (встроенный SVG) */
.tree-view::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23888' d='M5 6l5-6H0z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-button:single-button:vertical:increment:hover {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%23555' d='M5 6l5-6H0z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-button:single-button:horizontal:decrement {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23888' d='M0 5l6-5v10z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-button:single-button:horizontal:decrement:hover {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23555' d='M0 5l6-5v10z'/%3E%3C/svg%3E");
}

/* Стрелка вниз (встроенный SVG) */
.tree-view::-webkit-scrollbar-button:single-button:horizontal:increment {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23888' d='M6 5L0 10V0z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-button:single-button:horizontal:increment:hover {
    background-size: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath fill='%23555' d='M6 5L0 10V0z'/%3E%3C/svg%3E");
}

.tree-view::-webkit-scrollbar-corner {
    background-color: transparent;
    /* Цвет фона */
    /* border: 1px solid #ccc;   Рамка (опционально) */
    /* border-radius: 2px;       Скругление углов (опционально) */
}

.tree-item-label {
    padding: 8px 10px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    min-width: fit-content;
    box-sizing: border-box;
}

.toggle-icon-placeholder {
    display: inline-block;
    width: 16px;
    margin-right: 8px;
    flex-shrink: 0;
}

.tree-item-text {
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
    color: white;
}

.tree-item-label:hover {
    background-color: #16466D;
}

.tree-item-label.selected {
    background-color: #2667C5;
    font-weight: 500;
}
</style>