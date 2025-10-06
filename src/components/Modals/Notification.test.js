import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Notification from '@/components/Modals/Notification.vue'

describe('Modals: Notification.vue', () => {
    let dispatchMock

    beforeEach(() => {
        vi.useFakeTimers()
        dispatchMock = vi.fn()
    })

    afterEach(() => {
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    const mountCmp = (overrides = {}) => {
        const props = {
            text: 'Hello',
            id: 42,
            type: 'Success', // 'Error' | 'Warning'
            time: 3000,
            ...overrides.props,
        }

        return mount(Notification, {
            props,
            global: {
                mocks: {
                    $store: { dispatch: dispatchMock },
                },
                stubs: {
                    // чтобы не тянуть Vuetify: оставляем рендер тега с атрибутами
                    'v-icon': {
                        template: `<i data-test="v-icon" v-bind="$attrs"></i>`,
                    },
                },
            },
            ...overrides.mountOptions,
        })
    }

    it('1. Рендеринг текста уведомления', () => {
        const wrapper = mountCmp({ props: { text: 'Test message' } })
        expect(wrapper.text()).toContain('Test message')
    })

    it('2. Отображение Success при type="Success"', () => {
        const wrapper = mountCmp({ props: { type: 'Success' } })
        const icon = wrapper.find('[data-test="v-icon"][icon="circle-check"]')
        expect(icon.exists()).toBe(true)
    })

    it('3. Отображение Error при type="Error"', () => {
        const wrapper = mountCmp({ props: { type: 'Error' } })
        const icon = wrapper.find('[data-test="v-icon"][icon="circle-exclamation"]')
        expect(icon.exists()).toBe(true)
    })

    it('4. Отображение Warning при других значениях type', () => {
        const wrapper = mountCmp({ props: { type: 'Warning' } })
        const icon = wrapper.find('[data-test="v-icon"][icon="triangle-exclamation"]')
        expect(icon.exists()).toBe(true)
    })

    it('5. клик по контейнеру вызывает DeleteNotification_action', async () => {
        const wrapper = mountCmp()
        await wrapper.trigger('click')
        expect(dispatchMock).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledWith('DeleteNotification_action', 42)
    })

    it('6. клик по кнопке закрытия вызывает DeleteNotification_action один раз', async () => {
        const wrapper = mountCmp()
        const btn = wrapper.find('button')
        await btn.trigger('click') // .stop в шаблоне предотвратит всплытие
        expect(dispatchMock).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledWith('DeleteNotification_action', 42)
    })

    it('7. автозакрывается по таймеру (time > 0)', async () => {
        const wrapper = mountCmp({ props: { time: 1000 } })
        vi.runAllTimers()
        await wrapper.vm.$nextTick()
        expect(dispatchMock).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledWith('DeleteNotification_action', 42)
    })

    it('8. не автозакрывается при time = 0', async () => {
        const wrapper = mountCmp({ props: { time: 0 } })
        vi.runAllTimers()
        await wrapper.vm.$nextTick()
        expect(dispatchMock).not.toHaveBeenCalled()
    })

    it('9. если во время таймера есть hover, удаление откладывается до mouseout', async () => {
        const wrapper = mountCmp({ props: { time: 1000 } })
        await wrapper.trigger('mouseover')
        vi.runAllTimers()
        await wrapper.vm.$nextTick()
        expect(dispatchMock).not.toHaveBeenCalled()

        await wrapper.trigger('mouseout')
        await wrapper.vm.$nextTick()
        expect(dispatchMock).toHaveBeenCalledTimes(1)
    })
})
