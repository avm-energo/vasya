import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import * as Auth from '@/actions/AuthorizationActions.js'
import LoginPage from '@/pages/Authorization/Authorization.vue'

const storeMock = { dispatch: vi.fn() }
const routerPush = vi.fn()
const routerMock = { push: routerPush }

const ButtonStub = {
    name: 'ButtonComponent',
    props: ['label', 'icon', 'iconStyle', 'marginL'],
    emits: ['onClick'],
    template: `<button data-test="btn" @click="$emit('onClick')"><slot />{{label}}</button>`
}

const IconAdmStub = {
    name: 'IconAdm',
    props: ['nameSvg', 'widthSvg', 'heightSvg', 'colorSvg', 'marginSvg'],
    emits: ['clickOnSvg'],
    template: `<span :data-icon="nameSvg" @click="$emit('clickOnSvg')"></span>`
}

const mountLogin = () =>
    mount(LoginPage, {
        global: {
            stubs: { ButtonComponent: ButtonStub, IconAdm: IconAdmStub },
            mocks: { $store: storeMock, $router: routerMock }
        },
        attachTo: document.body
    })

beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    storeMock.dispatch.mockClear()
    routerPush.mockClear()
})

const findLoginInput = (w) => w.get('input[placeholder="Login"]')
const findPassInput  = (w) => w.get('input[placeholder="Password"]')
const findError      = (w) => w.find('.Error')
const findMainBtn    = (w) => w.findAll('[data-test="btn"]')[0] // "Войти"
const findGuestBtn   = (w) => w.findAll('[data-test="btn"]')[1] // "Войти как Гость"

describe('Pages: Authorization.vue', () => {
    it('1. Проверка рендеринга', () => {
        const w = mountLogin()
        expect(findLoginInput(w).exists()).toBe(true)
        expect(findPassInput(w).exists()).toBe(true)
        expect(findLoginInput(w).attributes('placeholder')).toBe('Login')
        expect(findPassInput(w).attributes('placeholder')).toBe('Password')
        expect(findError(w).exists()).toBe(false)
    })

    it('2. Проверка биндинга ввода с trim()', async () => {
        const w = mountLogin()
        await findLoginInput(w).setValue('  user  ')
        await findPassInput(w).setValue('  pass  ')
        expect(w.vm.auth_login).toBe('user')
        expect(w.vm.auth_pass).toBe('pass')
    })

    it('3. Проверка переключения видимости пароля', async () => {
        const w = mountLogin()
        expect(findPassInput(w).attributes('type')).toBe('password')
        await w.get('[data-icon="eyeslashlog"]').trigger('click')
        await w.vm.$nextTick()
        expect(findPassInput(w).attributes('type')).toBe('text')
        await w.get('[data-icon="eyelog"]').trigger('click')
        await w.vm.$nextTick()
        expect(findPassInput(w).attributes('type')).toBe('password')
    })

    it('4. Проверка полей Authorization(): пустые поля → ошибка', async () => {
        const w = mountLogin()
        // шпион ставим, но он не должен вызываться
        const loginSpy = vi.spyOn(Auth, 'login')
        await findMainBtn(w).trigger('click')
        expect(loginSpy).not.toHaveBeenCalled()
        expect(findError(w).exists()).toBe(true)
        expect(w.get('.error_text').text()).toBe('Заполните все поля!')
    })

    it('5. Проверка полей Authorization(): успех → router.push("/sonica")', async () => {
        const w = mountLogin()
        await findLoginInput(w).setValue('user')
        await findPassInput(w).setValue('pass')

        vi.spyOn(Auth, 'login').mockImplementation((_u, _p, cb) => {
            cb({ successful: true })
        })

        await findMainBtn(w).trigger('click')

        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', true)
        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', false)
        expect(routerPush).toHaveBeenCalledWith('/sonica')
        expect(findError(w).exists()).toBe(false)
    })

    it('6. Проверка полей Authorization(): код ошибки "2" → "Неверный пароль"', async () => {
        const w = mountLogin()
        await findLoginInput(w).setValue('user')
        await findPassInput(w).setValue('wrong')

        vi.spyOn(Auth, 'login').mockImplementation((_u, _p, cb) => {
            cb({ successful: false, message: '2' })
        })

        await findMainBtn(w).trigger('click')

        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', true)
        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', false)
        expect(findError(w).exists()).toBe(true)
        expect(w.get('.error_text').text()).toBe('Неверный пароль')
        expect(routerPush).not.toHaveBeenCalled()
    })

    it('7. Проверка полей Authorization(): неизвестная ошибка → показывает message как есть', async () => {
        const w = mountLogin()
        await findLoginInput(w).setValue('user')
        await findPassInput(w).setValue('pass')

        vi.spyOn(Auth, 'login').mockImplementation((_u, _p, cb) => {
            cb({ successful: false, message: 'Something happened' })
        })

        await findMainBtn(w).trigger('click')
        expect(w.get('.error_text').text()).toBe('Something happened')
    })

    it('8. Проверка GuestAuthorization(): успех → router.push("/sonica")', async () => {
        const w = mountLogin()

        vi.spyOn(Auth, 'login').mockImplementation((u, p, cb) => {
            expect(u).toBe('Guest')
            expect(p).toBe('Guest')
            cb({ successful: true })
        })

        await findGuestBtn(w).trigger('click')

        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', true)
        expect(storeMock.dispatch).toHaveBeenCalledWith('setIsLoading_action', false)
        expect(routerPush).toHaveBeenCalledWith('/sonica')
        expect(findError(w).exists()).toBe(false)
    })

    it('GuestAuthorization(): ошибка "1" → человекочитаемый текст', async () => {
        const w = mountLogin()

        vi.spyOn(Auth, 'login').mockImplementation((_u, _p, cb) => {
            cb({ successful: false, message: '1' })
        })

        await findGuestBtn(w).trigger('click')

        expect(findError(w).exists()).toBe(true)
        expect(w.get('.error_text').text()).toBe('Пользователя с таким именем не существует')
        expect(routerPush).not.toHaveBeenCalled()
    })
})
