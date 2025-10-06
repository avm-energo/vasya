import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Subscreen from '@/components/Neightbours/Subscreen.vue'

const makeParent = (subProps) => ({
    template: `
    <div>
      <Subscreen :params="params" :namewindow="namewindow" />
    </div>
  `,
    components: { Subscreen },
    data() {
        return {
            multiplier: subProps.multiplier ?? 2,
            namewindow: subProps.namewindow ?? 'Main',
            params: subProps.params
        }
    }
})

const baseParams = ({
                        name = 'InnerScreen',
                        x = 10, y = 20, z = 5,
                        width = 200, height = 120,
                        path = '/inner/path',
                        screenW = 300, screenH = 400
                    } = {}) => ({
    name,
    properties: {
        x, y, z, width, height, path,
        screen: { canvas: { width: screenW, height: screenH } }
    }
})

describe('Neighbours: Subscreen.vue', () => {
    const mountWithParent = (opts = {}) => {
        const params = opts.params ?? baseParams()
        const multiplier = opts.multiplier ?? 2
        const namewindow = opts.namewindow ?? 'Main'

        return mount(makeParent({ params, multiplier, namewindow }), {
            global: {
                stubs: {
                    window: true
                }
            }
        })
    }

    const getSubscreenWrapper = (parentWrapper) =>
        parentWrapper.findComponent(Subscreen)

    it('1. вычисляет css-переменные с учётом $parent.multiplier', () => {
        const parent = mountWithParent({
            multiplier: 2,
            params: baseParams({ x: 10, y: 20, z: 7, width: 200, height: 120 })
        })
        const sub = parent.get('.Subscreen')
        const style = sub.attributes('style') || ''

        // --x = x*m + 5*m px = 10*2 + 5*2 = 30px
        expect(style).toContain('--x: 30px;')
        // --y = y*m px = 20*2 = 40px
        expect(style).toContain('--y: 40px;')
        // --z = как есть (без px)
        expect(style).toContain('--z: 7;')
        // --width = 200*2 = 400px
        expect(style).toContain('--width: 400px;')
        // --height = 120*2 = 240px
        expect(style).toContain('--height: 240px;')
    })

    it('2. инициализирует myJson и считает subscreensize по ширине (ветка else)', () => {

        const parent = mountWithParent({
            multiplier: 2,
            params: baseParams({ width: 200, height: 120, screenW: 300, screenH: 400 })
        })
        const sub = getSubscreenWrapper(parent)

        expect(sub.vm.myJson).toEqual(sub.props('params').properties.screen)

        expect(sub.vm.subscreensize).toBeCloseTo((200 / 300) * 2, 5)


        const winStub = sub.find('window-stub')
        expect(winStub.exists()).toBe(true)
        expect(winStub.attributes('typewindow')).toBe('subscreen')
        expect(winStub.attributes('boolback')).toBe('false')
        expect(winStub.attributes('namewindow')).toBe('Main') // из родителя
        expect(winStub.attributes('subscreenname')).toBe(sub.props('params').name)
        expect(winStub.attributes('path')).toBe(
            sub.props('params').properties.path
        )

        expect(winStub.attributes('myjson')).toBeTruthy()
        expect(winStub.attributes('subscreensize')).toBeTruthy()
    })

    it('3. считает subscreensize по высоте (ветка if, когда width > screen.canvas.width)', () => {

        const parent = mountWithParent({
            multiplier: 2,
            params: baseParams({ width: 500, height: 120, screenW: 300, screenH: 400 })
        })
        const sub = getSubscreenWrapper(parent)

        expect(sub.vm.subscreensize).toBeCloseTo((120 / 400) * 2, 5)
    })

    it('4. deep watch: при изменении params пересчитывает myJson и subscreensize', async () => {
        const parent = mountWithParent({
            multiplier: 3,
            params: baseParams({ width: 200, height: 120, screenW: 300, screenH: 400 })
        })
        const sub = getSubscreenWrapper(parent)

        expect(sub.vm.subscreensize).toBeCloseTo((200 / 300) * 3, 5)

        const newScreen = { canvas: { width: 250, height: 500 } }
        sub.props('params').properties.width = 600
        sub.props('params').properties.height = 150
        sub.props('params').properties.screen = newScreen
        await sub.vm.$nextTick()
        expect(sub.vm.subscreensize).toBeCloseTo((150 / 500) * 3, 5)
        expect(sub.vm.myJson).toEqual(newScreen)
    })

    it('5. корректно прокидывает namewindow из пропсов', () => {
        const parent = mountWithParent({
            namewindow: 'OuterName',
            params: baseParams()
        })
        const sub = getSubscreenWrapper(parent)
        const winStub = sub.find('window-stub')
        expect(winStub.exists()).toBe(true)
        expect(winStub.attributes('namewindow')).toBe('OuterName')
    })
})
