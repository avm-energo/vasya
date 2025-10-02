import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '@/components/Scales/ProgressBar.vue'

describe('Scales -> ProgressBar.vue', () => {
    const defaultProps = {
        headerText: 'Temperature',
        currentValue: 50,
        minValue: 0,
        maxValue: 100,
        mark: '°C',
        barHeight: 16,
        textSize: 14,
        labelSize: 14,
        limits: [
            { type: 'low-alarm', value: 10, side: 'left' },
            { type: 'low-warning', value: 20, side: 'left' },
            { type: 'high-warning', value: 80, side: 'right' },
            { type: 'high-alarm', value: 90, side: 'right' }
        ],
        position: { x: 10, y: 20 },
        dimensions: { width: 200, height: 16 },
        colors: {
            normal: '#00FF00',
            warning: '#FFC107',
            alarm: '#F44336',
            background: '#353535',
            text: '#FFFFFF',
            label: '#AAAAAA'
        }
    }

    const mountComponent = (props = {}) => {
        return mount(ProgressBar, {
            props: { ...defaultProps, ...props }
        })
    }

    it('1. renders headerText and currentValue correctly', () => {
        const wrapper = mountComponent()
        expect(wrapper.text()).toContain(defaultProps.headerText)
        expect(wrapper.text()).toContain(`${defaultProps.currentValue} ${defaultProps.mark}`)
    })

    it('2. computes progress correctly', () => {
        const wrapper = mountComponent()
        // (currentValue - minValue) / (maxValue - minValue) * 100
        expect(wrapper.vm.progress).toBeCloseTo(50)
    })

    it('3. progress is capped between 0 and 100', () => {
        const wrapperLow = mountComponent({ currentValue: -10 })
        expect(wrapperLow.vm.progress).toBe(0)

        const wrapperHigh = mountComponent({ currentValue: 150 })
        expect(wrapperHigh.vm.progress).toBe(100)
    })

    it('4. calculatePosition works correctly for left and right', () => {
        const wrapper = mountComponent()
        expect(wrapper.vm.calculatePosition(50, 'left')).toBeCloseTo(50)
        expect(wrapper.vm.calculatePosition(50, 'right')).toBeCloseTo(50)
    })

    it('5. validLimits returns only correct limits', () => {
        const wrapper = mountComponent({
            limits: [
                { type: 'low-alarm', value: 10, side: 'left' },
                { type: 'invalid-type', value: 999, side: 'left' },
                { type: 'high-alarm', value: 90, side: 'right' }
            ]
        })
        expect(wrapper.vm.validLimits.length).toBe(2)
        expect(wrapper.vm.validLimits.map(l => l.type)).toContain('low-alarm')
        expect(wrapper.vm.validLimits.map(l => l.type)).toContain('high-alarm')
    })

    it('6. sortedLeftLimits and sortedRightLimits sort correctly', () => {
        const wrapper = mountComponent()
        expect(wrapper.vm.sortedLeftLimits[0].value).toBeGreaterThanOrEqual(wrapper.vm.sortedLeftLimits[1].value)
        expect(wrapper.vm.sortedRightLimits[0].value).toBeLessThanOrEqual(wrapper.vm.sortedRightLimits[1].value)
    })

    it('7. progressColor returns normal color (limits logic commented out)', () => {
        const wrapper = mountComponent()
        expect(wrapper.vm.progressColor).toBe(defaultProps.colors.normal)
    })

    it('8. parseSize returns px string for numbers and auto for null', () => {
        const wrapper = mountComponent()
        expect(wrapper.vm.parseSize(100)).toBe('100px')
        expect(wrapper.vm.parseSize('50%')).toBe('50%')
        expect(wrapper.vm.parseSize(null)).toBe('auto')
    })
})
