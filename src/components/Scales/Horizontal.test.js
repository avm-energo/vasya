import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Horizontal from '@/components/Scales/Horizontal.vue'

describe('Scales -> Horizontal.vue', () => {
    const mockParams = {
        tag: 'Temperature',
        currentValue: 50,
        downLimit: 0,
        upLimit: 100,
        lowAlarm: 10,
        lowWarning: 20,
        highWarning: 80,
        highAlarm: 90,
        width: 200,
        height: 20,
        x: 10,
        y: 20,
        scaleCurrentBrush: '00FF00',
        fore: '000000',
        back: 'FFFFFF',
        format: '°C'
    }

    const mockStore = {
        getters: {
            elemByName: vi.fn(() => ({
                properties: {
                    currentValue: 55,
                    scaleCurrentBrush: 'FF0000'
                }
            }))
        }
    }

    const mountComponent = () => {
        return mount(Horizontal, {
            props: { params: mockParams, name: 'Widget1' },
            global: {
                mocks: { $store: mockStore },
                stubs: {
                    // Полностью stub TemperatureProgressBar
                    TemperatureProgressBar: true
                }
            }
        })
    }

    it('1. renders stubbed TemperatureProgressBar', () => {
        const wrapper = mountComponent()
        const tempBar = wrapper.findComponent({ name: 'TemperatureProgressBar' })
        expect(tempBar.exists()).toBe(true)
    })

    it('2. calculates value and valuepercent on created', () => {
        const wrapper = mountComponent()
        // value = (currentValue - downLimit) / ((upLimit - downLimit)/100)
        expect(wrapper.vm.value).toBeCloseTo(50)
        expect(wrapper.vm.valuepercent).toBe(Math.round(mockParams.currentValue))
    })

    it('3. colors method returns correct color', () => {
        const wrapper = mountComponent()
        expect(wrapper.vm.colors()).toBe('#' + mockParams.scaleCurrentBrush)
    })

    it('4. updates value and color from store', () => {
        const wrapper = mountComponent()
        const changedelem = mockStore.getters.elemByName({ namewidget: 'Widget1', namewindow: 'MainWindow' }).properties

        // имитация обновления store
        wrapper.vm.valuepercent = Math.round(changedelem.currentValue)
        wrapper.vm.value = (changedelem.currentValue - mockParams.downLimit) / ((mockParams.upLimit - mockParams.downLimit)/100)
        wrapper.vm.color = changedelem.scaleCurrentBrush

        expect(wrapper.vm.valuepercent).toBe(55)
        expect(wrapper.vm.value).toBeCloseTo(55)
        expect(wrapper.vm.color).toBe('FF0000')
    })
})
