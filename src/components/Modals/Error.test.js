import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import Error from '@/components/Modals/Error.vue'

describe('Modals: Error.vue', () => {
    let store

    beforeEach(() => {
        store = {
            dispatch: vi.fn()
        }
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    const mountComp = (props = { error: 'Oops!', id: 42 }) =>
        mount(Error, {
            props,
            global: {
                mocks: { $store: store },
                // Заглушаем Vuetify-иконки
                stubs: { 'v-icon': { template: '<i />' } }
            }
        })

    it('1. Рендеринг текста ошибки', () => {
        const wrapper = mountComp({ error: 'Network error', id: 1 })
        expect(wrapper.text()).toContain('Network error')
    })

    it('2. По клику на кнопку вызывает удаление, если не наведено (hover=false)', async () => {
        const wrapper = mountComp({ error: 'E', id: 7 })
        await wrapper.find('button').trigger('click')
        await nextTick()

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith('DeleteError_action', 7)
    })

    it('3. Не удаляет при клике, если курсор наведён; удаляет после mouseout', async () => {
        const wrapper = mountComp({ error: 'E', id: 8 })

        await wrapper.find('.container').trigger('mouseover')
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(store.dispatch).not.toHaveBeenCalled()

        await wrapper.find('.container').trigger('mouseout')
        await nextTick()
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith('DeleteError_action', 8)
    })

    it('4. Автоматически удаляет через 3 секунды, если не наведено', async () => {
        vi.useFakeTimers()
        const wrapper = mountComp({ error: 'E', id: 9 })

        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith('DeleteError_action', 9)
    })

    it('5. Не удаляет через 3 секунды, если наведено; удаляет после mouseout', async () => {
        vi.useFakeTimers()
        const wrapper = mountComp({ error: 'E', id: 10 })

        await wrapper.find('.container').trigger('mouseover')

        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(store.dispatch).not.toHaveBeenCalled()

        await wrapper.find('.container').trigger('mouseout')
        await nextTick()
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith('DeleteError_action', 10)
    })

    it('6. Не делает повторных удалений при повторных mouseout, если уже удалено', async () => {
        const wrapper = mountComp({ error: 'E', id: 11 })

        await wrapper.find('button').trigger('click') // active=false, hover=false
        await nextTick()
        expect(store.dispatch).toHaveBeenCalledTimes(1)

        await wrapper.find('.container').trigger('mouseout')
        await nextTick()
        expect(store.dispatch).toHaveBeenCalledTimes(1)
    })
})
