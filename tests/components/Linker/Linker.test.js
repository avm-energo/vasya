import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Linker from '@/components/Linker/Linker.vue'


// Mock для дочерних компонентов
const stubs = {
    LinkerMenu: {
        name: 'LinkerMenu',
        props: ['tree', 'padding', 'selectedItems'],
        template: '<div class="stub-linker-menu"></div>'
    },
    LinkerList: {
        name: 'LinkerList',
        props: ['atoms', 'namePath', 'isDescription', 'relativePath', 'hideSpecial', 'searchQuery', 'selectedItems', 'length', 'windowOffset'],
        template: '<div class="stub-linker-list"></div>'
    },
    Tooltip: {
        name: 'Tooltip',
        template: '<div class="stub-tooltip"></div>'
    }
}

// Мокаем Vuex store с геттерами
const mockStore = {
    getters: {
        atoms: [{ id: 1, name: 'H2O' }],
        tree: [{ id: '>', children: [] }]
    }
}

const globalMountOptions = {
    global: {
        mocks: {
            $store: mockStore,
            $router: {
                push: vi.fn(),
                replace: vi.fn(),
            },
            $route: { path: '/' },
        },
        stubs,
    },
}

// Проверка на отображение и правильный рендеринг
describe('Linker.vue', () => {
    describe('1. Проверка рендеринга', () => {
        it('1.1. Рендерится без ошибок и содержит основные элементы', () => {
            const wrapper = mount(Linker, globalMountOptions)
            expect(wrapper.exists()).toBe(true)

            // Проверяем основные html элементы
            expect(wrapper.find('.linker').exists()).toBe(true)
            expect(wrapper.find('.navbar').exists()).toBe(true)

            // Проверяем наличие чекбоксов
            expect(wrapper.find('input#namePath').exists()).toBe(true)
            expect(wrapper.find('input#isDescription').exists()).toBe(true)
            expect(wrapper.find('input#relativePath').exists()).toBe(true)
            expect(wrapper.find('input#hideSpecial').exists()).toBe(true)

            // Проверяем дочерние компоненты
            // expect(wrapper.findComponent({ name: 'LinkerMenu' }).exists()).toBe(true)
            // expect(wrapper.findComponent({ name: 'LinkerList' }).exists()).toBe(true)
            // expect(wrapper.findComponent({ name: 'Tooltip' }).exists()).toBe(true)
        })

        it('1.2. Корректно реагирует на изменение data и props', async () => {
            const wrapper = mount(Linker, globalMountOptions)

            // Проверим изменение data через v-model чекбоксов
            const checkbox = wrapper.find('input#namePath')
            await checkbox.setChecked()
            expect(wrapper.vm.namePath).toBe(true)

            // Проверим, что при изменении namePath отключается relativePath
            await wrapper.setData({ namePath: true, relativePath: true })
            await wrapper.vm.$nextTick()
            expect(wrapper.find('input#relativePath').element.disabled).toBe(true)
        })
    })

// Проверка Data & Computed
    describe('2. data() & Computed св-ва', () => {
        it('2.1 Инициализирует data() правильно', () => {
            const wrapper = mount(Linker, globalMountOptions)
            expect(wrapper.vm.namePath).toBe(false)
            expect(wrapper.vm.isDescription).toBe(false)
            expect(wrapper.vm.relativePath).toBe(false)
            expect(wrapper.vm.hideSpecial).toBe(false)
            expect(wrapper.vm.length).toBe(0)
            expect(wrapper.vm.searchQuery).toBe('')
            expect(wrapper.vm.selectedItems).toBe('>')
            expect(wrapper.vm.windowOffset).toBe(60)
        })

        it('2.2 computed свойства возвращают значения из store', () => {
            const wrapper = mount(Linker, globalMountOptions)
            expect(wrapper.vm.atoms).toEqual(mockStore.getters.atoms)
            expect(wrapper.vm.tree).toEqual(mockStore.getters.tree)
        })
    })

// Проверка методов и функций
    describe('3. Methods', () => {

        let wrapper

        beforeEach(() => {
            wrapper = mount(Linker, globalMountOptions)
        })

        it('3.1 linkerClose эмитит событие close', () => {
            wrapper.vm.linkerClose()
            expect(wrapper.emitted()).toHaveProperty('close')
        })

        it('3.2 UpdateNumberOfAtoms обновляет length', () => {
            wrapper.vm.UpdateNumberOfAtoms(15)
            expect(wrapper.vm.length).toBe(15)
        })

        it('3.3 reloadPage вызывает location.reload', () => {
            const reloadMock = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
            wrapper.vm.reloadPage()
            expect(reloadMock).toHaveBeenCalled()
            reloadMock.mockRestore()
        })

        it('3.4 selectItems изменяет selectedItems на основе события', () => {
            // Создаём структуру элементов для имитации
            const fakeTarget = {
                className: 'list-item',
                parentNode: {
                    id: 'node1',
                    parentNode: { id: '>', parentNode: null }
                }
            }
            const event = { target: fakeTarget }
            wrapper.vm.selectItems(event)
            expect(wrapper.vm.selectedItems).toContain('node1')
        })

        // it('3.5 sidebarResize корректно добавляет и удаляет обработчики', () => {
        //     const mouseMoveHandler = vi.fn()
        //     document.addEventListener = vi.fn((event, cb) => {
        //         if(event === 'mousemove') {
        //             mouseMoveHandler.mockImplementation(cb)
        //         }
        //     })
        //     document.removeEventListener = vi.fn()
        //
        //     const e = {
        //         target: {
        //             style: { backgroundColor: '' }
        //         }
        //     }
        //
        //     wrapper.vm.sidebarResize(e)
        //
        //     // Симулируем событие mousemove
        //     mouseMoveHandler({ pageX: 100 })
        //
        //     expect(e.target.style.backgroundColor).toBe('#2667c5')
        //
        //     // Симулируем mouseup
        //     document.onmouseup()
        //     expect(e.target.style.backgroundColor).toBe('#555558')
        // })
    })

// Проверка Жизненного цикла Компонента
    describe('4. Проверка хуков ЖЦ', () => {
        // it('created() вызывает fetchLinkerTree, fetchLinkerTable и запускает интервал', () => {
        //     const fetchTreeMock = vi.spyOn(require('@/actions/LinkerActions.js'), 'fetchLinkerTree').mockResolvedValue()
        //     const fetchTableMock = vi.spyOn(require('@/actions/LinkerActions.js'), 'fetchLinkerTable').mockResolvedValue()
        //     const fetchAtomsMock = vi.spyOn(require('@/actions/LinkerActions.js'), 'fetchLinkerAtoms').mockResolvedValue()
        //
        //     const wrapper = mount(Linker, globalMountOptions)
        //
        //     expect(fetchTreeMock).toHaveBeenCalled()
        //     expect(fetchTableMock).toHaveBeenCalled()
        //     expect(wrapper.vm.atomsInterval).not.toBeNull()
        //
        //     clearInterval(wrapper.vm.atomsInterval)
        //
        //     fetchTreeMock.mockRestore()
        //     fetchTableMock.mockRestore()
        //     fetchAtomsMock.mockRestore()
        // })

        it('4.1 beforeUnmount очищает интервал', () => {
            const wrapper = mount(Linker, globalMountOptions)
            wrapper.vm.atomsInterval = setInterval(() => {}, 1000)
            const clearSpy = vi.spyOn(window, 'clearInterval')

            wrapper.unmount()
            expect(clearSpy).toHaveBeenCalledWith(wrapper.vm.atomsInterval)

            clearSpy.mockRestore()
        })

        // it('updated() обновляет windowOffset из localStorage и очищает интервал при atoms === undefined', async () => {
        //     const wrapper = mount(Linker, globalMountOptions)
        //     localStorage.setItem('navigation', 'true')
        //     await wrapper.vm.$nextTick()
        //     expect(wrapper.vm.windowOffset).toBe(240)
        //
        //     wrapper.vm.atoms = undefined
        //     wrapper.vm.atomsInterval = setInterval(() => {}, 1000)
        //     const clearSpy = vi.spyOn(window, 'clearInterval')
        //     await wrapper.vm.$forceUpdate()
        //     expect(clearSpy).toHaveBeenCalled()
        //     clearSpy.mockRestore()
        // })
    })

// Проверка вызова событий
    describe('5. Проверка Emits', () => {
        it('корректно эмитит событие close', () => {
            const wrapper = mount(Linker, globalMountOptions)
            wrapper.vm.linkerClose()
            expect(wrapper.emitted('close')).toBeTruthy()
        })
    })

// Проверка на взаимодействие с дочерними компонентами
    describe('6. взаимодействие с дочерними компонентами', () => {
        it('LinkerMenu получает правильные props', () => {
            const wrapper = mount(Linker, globalMountOptions)
            const menu = wrapper.findComponent({ name: 'LinkerMenu' })
            expect(menu.props('padding')).toBe(5)
            expect(menu.props('tree')).toEqual(wrapper.vm.tree)
            expect(menu.props('selectedItems')).toBe(wrapper.vm.selectedItems)
        })

        it('LinkerList получает правильные props', () => {
            const wrapper = mount(Linker, globalMountOptions)
            const list = wrapper.findComponent({ name: 'LinkerList' })
            expect(list.props('atoms')).toBe(wrapper.vm.atoms)
            expect(list.props('namePath')).toBe(wrapper.vm.namePath)
            expect(list.props('isDescription')).toBe(wrapper.vm.isDescription)
            expect(list.props('relativePath')).toBe(wrapper.vm.relativePath)
            expect(list.props('hideSpecial')).toBe(wrapper.vm.hideSpecial)
            expect(list.props('searchQuery')).toBe(wrapper.vm.searchQuery)
            expect(list.props('selectedItems')).toBe(wrapper.vm.selectedItems)
            expect(list.props('length')).toBe(wrapper.vm.length)
            expect(list.props('windowOffset')).toBe(wrapper.vm.windowOffset)
        })
    })
});
