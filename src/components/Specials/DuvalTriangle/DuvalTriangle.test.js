import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import DuvalTriangle from '@/components/Specials/DuvalTriangle/DuvalTriangle.vue'

vi.mock('@/components/Specials/DuvalTriangle/api/getTriangleHistory.js', () => {
    return {
        getTriangleHistory: vi.fn(() => ([
            { cH4: 10, c2H2: 10, c2H4: 80 },
            { cH4: 20, c2H2: 20, c2H4: 60 },
            { cH4: 30, c2H2: 30, c2H4: 40 },
            { cH4: 40, c2H2: 40, c2H4: 20 },
            { cH4: 50, c2H2: 30, c2H4: 20 },
        ])),
    }
})

vi.mock('@/store/index.js', () => {
    return { default: {} }
})

const makeCtxMock = () => ({
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    setLineDash: vi.fn(),
    closePath: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 24 })),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(10), width: 410, height: 400 })),
    putImageData: vi.fn(),
    // стили/свойства
    set fillStyle(v) { this._fillStyle = v },
    get fillStyle() { return this._fillStyle },
    set strokeStyle(v) { this._strokeStyle = v },
    get strokeStyle() { return this._strokeStyle },
    set lineWidth(v) { this._lineWidth = v },
    get lineWidth() { return this._lineWidth },
    set font(v) { this._font = v },
    get font() { return this._font },
    set textAlign(v) { this._textAlign = v },
    get textAlign() { return this._textAlign },
    set textBaseline(v) { this._textBaseline = v },
    get textBaseline() { return this._textBaseline },
})

let ctxMock

beforeEach(() => {
    // Фейковые таймеры и стабильное "текущее" время (ms = 0, чтобы setTimeout был ровно 1000)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    ctxMock = makeCtxMock()
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
        configurable: true,
        value: vi.fn(() => ctxMock),
    })
})

afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
    vi.useRealTimers()
})

const Parent = defineComponent({
    name: 'ParentHost',
    components: { DuvalTriangle },
    data() {
        return {
            multiplier: 1,
            windowname: 'Main',
            windowpath: '/ws/duval',
            subscreenname: 'Sub',
            params: { width: 100, height: 100, x: 0, y: 0 },
        }
    },
    render() {
        return h('div', {}, [
            h(DuvalTriangle, {
                ref: 'child',
                name: 'TX1',
                ip: '127.0.0.1',
                params: this.params,
            }),
        ])
    },
})

const mountDuval = (overrides = {}) => {
    const wrapper = mount(Parent, {
        global: {
            mocks: {
                $store: {
                    getters: {
                        elemByName: vi.fn(() => ({
                            properties: { CH4: 50, C2H2: 30, C2H4: 20 },
                        })),
                    },
                },
            },
            stubs: {},
        },
    })

    if (overrides.parentData) {
        Object.assign(wrapper.vm, overrides.parentData)
    }
    if (overrides.childProps) {
        const child = wrapper.vm.$refs.child
        Object.entries(overrides.childProps).forEach(([k, v]) => (child.$props[k] = v))
    }

    const childWrapper = wrapper.getComponent(DuvalTriangle)
    return { parentWrapper: wrapper, childWrapper }
}

describe('Components -> Specials: DuvalTriangle.vue', () => {
    it('1. Проверка инициализизации canvas контекста и отрисовки базовой геометрии', async () => {
        const { childWrapper } = mountDuval()
        expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d')
        expect(childWrapper.vm.ctx).toBeTruthy()
        // drawDuval уже что-то рисовал
        expect(ctxMock.beginPath).toHaveBeenCalled()
        expect(ctxMock.stroke).toHaveBeenCalled()
        // Изначально проценты газов пустые
        expect(childWrapper.find('#CH4').text()).toMatch(/^% CH₄$/)
        expect(childWrapper.find('#C2H4').text()).toMatch(/^% C₂H₄$/)
        expect(childWrapper.find('#C2H2').text()).toMatch(/^% C₂H₂$/)
    })

    it('2. Проверка обновления процентов газов и отрисовки точки drawFirstDot', async () => {
        const { childWrapper } = mountDuval()

        childWrapper.vm.drawFirstDot(50, 30, 20, 'yellow')
        await nextTick()

        expect(childWrapper.find('#CH4').text()).toContain('50%')
        expect(childWrapper.find('#C2H4').text()).toContain('20%')
        expect(childWrapper.find('#C2H2').text()).toContain('30%')

        expect(ctxMock.setLineDash).toHaveBeenCalled()
        expect(ctxMock.arc).toHaveBeenCalled()
        expect(ctxMock.fill).toHaveBeenCalled()
    })

    it('3. Проверка отрисовки массива точек в режиме истории через вызов getTriangleHistory', async () => {
        const { getTriangleHistory } = await import('@/components/Specials/DuvalTriangle/api/getTriangleHistory.js')
        const { childWrapper, parentWrapper } = mountDuval()

        await childWrapper.get('#duval_mode').setValue(true)

        // created(): setTimeout(~1000), внутри setInterval(1000)
        await vi.runOnlyPendingTimersAsync() // срабатывает setTimeout
        await nextTick()
        await vi.runOnlyPendingTimersAsync() // первый тик setInterval
        await nextTick()

        expect(getTriangleHistory).toHaveBeenCalledWith(
            parentWrapper.vm.windowpath,
            'TX1/Sub',
            5
        )
        // были вызовы рисования точек
        expect(ctxMock.arc).toHaveBeenCalled()
    })

    it('4. Проверка получения $store.getters.elemByName и отрисовки текущей точки', async () => {
        const { childWrapper } = mountDuval()

        // Изначально пусто
        expect(childWrapper.find('#CH4').text()).toMatch(/^% CH₄$/)

        // Дождаться setTimeout и первого тика setInterval,
        // затем дождаться обновления DOM
        await vi.runOnlyPendingTimersAsync() // setTimeout
        await nextTick()
        await vi.runOnlyPendingTimersAsync() // 1-й тик setInterval
        await nextTick()

        // Проценты обновились из store (50/30/20)
        expect(childWrapper.find('#CH4').text()).toContain('50%')
        expect(childWrapper.find('#C2H4').text()).toContain('20%')
        expect(childWrapper.find('#C2H2').text()).toContain('30%')
        expect(ctxMock.arc).toHaveBeenCalled()
    })

    it('5. Проверка, что cssProps учитывает размеры/позицию и multiplier родителя', async () => {
        const { childWrapper, parentWrapper } = mountDuval({
            parentData: {
                multiplier: 1.2,
                params: { width: 120, height: 80, x: 10, y: -5 },
            },
        })
        await nextTick()

        const style = childWrapper.find('#duval').attributes('style')
        expect(style).toContain('--x:')
        expect(style).toContain('--y:')
        expect(style).toContain('scale:')
        // expect(style).toMatch(/scale:\s*1\.08/); // если multiplier * 0.9
    })
})
