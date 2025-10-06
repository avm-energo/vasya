import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'


vi.mock('axios', () => ({
    default: { post: vi.fn().mockResolvedValue({ data: {} }) }
}))
vi.mock('@/mixins/encript.js', () => ({
    encript: vi.fn(() => 'ENC')
}))


import axios from 'axios'
import Tooltiper from '@/components/Neightbours/Tooltiper.vue'

const makeParams = (over = {}) => ({
    name: 'WidgetName',
    type: 'some/type',
    properties: {
        x: 10, y: 20, z: 3,
        width: 100, height: 40,
        scale: 1,
        foreground: 'FFFFFF',
        background: '112233',
        borderBrush: 'transparent',
        windowBorderBrush: false,
        neightbourState: '00FF00',
        leftIcon: 'None',
        text: 'Button Text',
        angle: 0,
        fontSize: 12,
        path: '/node/path',
        title: null,
        screenPercentage: 75,
        isButtonEnabled: true,
        sFlashBehaviour: 1,
        isAcknowledged: true,
        stateChangingBehaviour: 0,
        ...over.properties
    },
    ...over
})

const makeParent = (props) => ({
    template: `
    <div>
      <Tooltiper
        :params="params"
        :windowWidth="windowWidth"
        :subscreensize="subscreensize"
        :tooltiperFromHeader="tooltiperFromHeader"
        :ip="ip"
        :name="name"
      />
    </div>
  `,
    components: { Tooltiper },
    data() {
        return {
            multiplier: props.multiplier ?? 2,
            windowname: props.windowname ?? 'MainWindow',
            windowpath: props.windowpath ?? '/root/path',
            subscreenname: props.subscreenname ?? '',
            params: props.params,
            windowWidth: 1920,
            subscreensize: 1,
            tooltiperFromHeader: props.tooltiperFromHeader ?? false,
            ip: props.ip ?? '127.0.0.1:8080',
            name: props.name ?? 'TooltiperWidget'
        }
    }
})

const mountWithParent = (opts = {}) => {
    const parent = mount(makeParent({
        params: opts.params ?? makeParams(),
        multiplier: opts.multiplier ?? 2,
        windowname: opts.windowname ?? 'MainWindow',
        windowpath: opts.windowpath ?? '/root/path',
        tooltiperFromHeader: opts.tooltiperFromHeader ?? false,
        ip: opts.ip ?? '127.0.0.1:8080',
        name: opts.name ?? 'TooltiperWidget'
    }), {
        global: {
            mocks: {
                $store: {
                    dispatch: opts.dispatch ?? vi.fn(),
                    getters: {
                        elemByName: vi.fn(() => undefined)
                    },
                    state: {
                        tickmas: 0
                    }
                }
            }
        }
    })
    return parent
}

const getTooltiper = (parent) => parent.findComponent(Tooltiper)

describe('Neighbours: Tooltiper.vue', () => {
    let useFakeTimersSpy

    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.runOnlyPendingTimers()
        vi.useRealTimers()
    })

    it('1. Рендеринг текста, когда leftIcon === "None"', () => {
        const parent = mountWithParent({
            params: makeParams({
                properties: { leftIcon: 'None', text: 'Hello World' }
            })
        })
        const root = parent.get('.button')
        expect(root.text()).toContain('Hello World')
        // Иконок быть не должно
        expect(root.find('.button_icon').exists()).toBe(false)
    })

    it('2. Рендеринг секции иконки, когда leftIcon === "Info"', () => {
        const parent = mountWithParent({
            params: makeParams({
                properties: { leftIcon: 'Info' }
            })
        })
        const root = parent.get('.button')
        const iconWrap = root.find('.button_icon')
        expect(iconWrap.exists()).toBe(true)
        // внутри есть svg
        expect(iconWrap.find('svg').exists()).toBe(true)
    })

    it('3. Вычисление CSS-переменных с учётом $parent.multiplier и scale', () => {
        const parent = mountWithParent({
            multiplier: 3,
            params: makeParams({
                properties: {
                    x: 5, y: 7, z: 9,
                    width: 80, height: 30,
                    scale: 1.5,
                    background: 'A1B2C3',
                    neightbourState: 'Yellow'
                }
            })
        })
        const root = parent.get('.button')
        const style = root.attributes('style') || ''

        // --x = x * m px
        expect(style).toContain('--x: 15px;') // 5 * 3
        // --y = y * m px
        expect(style).toContain('--y: 21px;') // 7 * 3
        // --z = 그대로
        expect(style).toContain('--z: 9;')

        // --width/--height = value * m * scale
        // width: 80 * 3 * 1.5 = 360px
        // height: 30 * 3 * 1.5 = 135px
        expect(style).toContain('--width: 360px;')
        expect(style).toContain('--height: 135px;')

        // фон: при Yellow — '--backgroundColor: Yellow'
        expect(style).toContain('--backgroundColor: Yellow;')
        // проверим что проставились flashing-цвета
        expect(style).toContain('--backgroundFlashingColorFirst: #A1B2C3;')
    })

    it('4. Клик вызывает some(): dispatch addElems', async () => {
        const dispatch = vi.fn()
        const parent = mountWithParent({
            tooltiperFromHeader: false,
            params: makeParams({
                properties: {
                    leftIcon: 'None',
                    text: 'Open',
                    title: null
                }
            }),
            dispatch
        })

        const root = parent.get('.button')
        await root.trigger('click')

        expect(dispatch).toHaveBeenCalledWith('addElems', getTooltiper(parent).props('params'))
    })

    it('5. Клик вызывает some(): dispatch changeMainWindow', async () => {
        const dispatch = vi.fn()
        const parent = mountWithParent({
            tooltiperFromHeader: true,
            params: makeParams({
                properties: { leftIcon: 'None', text: 'Главный экран' }
            }),
            dispatch
        })

        const root = parent.get('.button')
        await root.trigger('click')

        expect(dispatch).toHaveBeenCalledWith('changeMainWindow', getTooltiper(parent).props('params'))

    })

    it('6. UpdateFlahingState включает/выключает мигание и задаёт цвета', async () => {
        const parent = mountWithParent({
            params: makeParams({
                properties: {
                    neightbourState: 'Red',
                    isButtonEnabled: true,
                    sFlashBehaviour: 2, // мигание разрешено
                    isAcknowledged: false,
                    stateChangingBehaviour: 0
                }
            })
        })
        const wrapper = getTooltiper(parent)
        wrapper.vm.UpdateFlahingState(true, 'Red', 2, false, 0)
        await wrapper.vm.$nextTick()

        // Должен появиться класс flash
        const root = parent.get('.button')
        expect(root.classes()).toContain('flash')

        // Во вторую переменную уходит цвет мигания
        const style = root.attributes('style') || ''
        expect(style).toContain('--backgroundFlashingColorSecond: Red;')

        // Снимем мигание
        wrapper.vm.UpdateFlahingState(false, 'Red', 2, false, 0)
        await wrapper.vm.$nextTick()
        expect(parent.get('.button').classes()).not.toContain('flash')
    })

    it('7. watch params: обновляет value и flashingColor (нечисловой/шестнадцатиричный код)', async () => {
        const parent = mountWithParent({
            params: makeParams({
                properties: {
                    text: 'Init',
                    neightbourState: 'FF0000' // содержит цифры => будет '#FF0000'
                }
            })
        })
        const w = getTooltiper(parent)

        // Меняем props.params реактивно
        const p = w.props('params')
        p.properties.text = 'Updated'
        p.properties.neightbourState = 'Blue'
        await w.vm.$nextTick()

        expect(w.vm.button.value).toBe('Updated')
        expect(w.vm.flashingColor).toBe('Blue')
    })
})
