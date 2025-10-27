import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import store from '../store/index'
import route from '../router/index'
import { login, auth, logout } from './AuthorizationActions'


const mockFetch = vi.fn()
global.fetch = mockFetch

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
    removeItem: key => { delete store[key] },
    getAll: () => ({ ...store })   // вспомогательная функция
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
})

vi.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve())
vi.spyOn(route, 'push').mockImplementation(() => Promise.resolve())

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('api/table/auth', () => {
  const fakeHost = 'example.com'
  const fakeToken = 'test_token'
  const fakeUser = 'test_user'
  const fakeCreatorId = -1
  const fakeUserId = 1
  const fakeProjectId = 0

  it('status 200', async () => {
    const mockData = {
      access_token: fakeToken,
      client: {
        id: fakeUserId,
        name: "Guest",
        passwordHash: "",
        permissions: "",
        createDateTimeUTC: "0001-01-01T00:00:00",
        lifeTimeUTC: "9999-12-31T23:59:59.9999999",
        reasonToChangePassword: 0,
        dateTimeBlockedToUTC: "2023-11-26T08:44:42.7756161",
        creatorId: fakeCreatorId,
        projectId: fakeProjectId,
        autenticationTries: 0,
        isNeedToChangePassword: false
      },
    }

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: fakeHost })
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(mockData)
      })
    const callback = vi.fn()

    await login(fakeUser, 'password123', callback)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenNthCalledWith(1, 'defaults.json')
    expect(mockFetch).toHaveBeenNthCalledWith(2,
      `http://${fakeHost}/api/table/auth`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Login: fakeUser, Password: 'password123' })
      })
    )
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', true)
    expect(store.dispatch).toHaveBeenCalledWith('setUserName_action', fakeUser)
    expect(store.dispatch).toHaveBeenCalledWith('setUserId_action', fakeUserId)
    expect(store.dispatch).toHaveBeenCalledWith('setProjectId_action', fakeProjectId)

    expect(localStorage.getItem('token')).toBe(`Bearer ${fakeToken}`)
    expect(localStorage.getItem('userName')).toBe(fakeUser)
    expect(localStorage.getItem('creatorId')).toBe(String(fakeCreatorId))
    expect(localStorage.getItem('userId')).toBe(String(fakeUserId))
    expect(localStorage.getItem('projectId')).toBe(String(fakeProjectId))

    expect(callback).toHaveBeenCalledWith({ successful: true })
  })

  it('status 401', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: fakeHost })
      })
      .mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({
          StatusCode: 401,
          loginError: 1,
        })
      })

    const callback = vi.fn()
    await login('test_user', 'wrong_password', callback)

    expect(callback).toHaveBeenCalledWith({
      successful: false,
      message: "1"
    })
    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('status 500', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: fakeHost })
      })
      .mockResolvedValueOnce({
        status: 500,
        json: () => Promise.resolve({
          StatusCode: 500,
          loginError: 2,
        }),
      })

    const callback = vi.fn()

    await login('wrong_user', 'wrong_password', callback)

    expect(callback).toHaveBeenCalledWith({
      successful: false,
      message: "2"
    })
    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('network error', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network down')) 

    const callback = vi.fn()
    await login('test_user', 'test_password', callback)

    expect(callback).toHaveBeenCalledWith({
      successful: false,
      message: 'ConnectionError'
    })
    expect(store.dispatch).not.toHaveBeenCalled()
    expect(localStorage.getAll()).toEqual({})
  })
})

describe('auth()', () => {
  it('redirects to /authorization if token is missing', async () => {
    await auth()

    expect(route.push).toHaveBeenCalledWith('/authorization')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('status 200', async () => {
    localStorage.setItem('token', 'Bearer abc123')
    localStorage.setItem('userName', 'alice')
    localStorage.setItem('userId', '42')
    localStorage.setItem('projectId', '1001')

    mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: 'example.com' })
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ status: 200 })
      });

    await auth()

    var formdata = new FormData();
    formdata.append("token", localStorage.getItem('token').split(' ')[1]);

    expect(mockFetch).toHaveBeenNthCalledWith(2,
      `http://example.com/api/table/check`,
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer abc123' },
        body: formdata
      })
    )

    expect(store.dispatch).toHaveBeenCalledTimes(4)
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', true)
    expect(store.dispatch).toHaveBeenCalledWith(
      'setUserName_action',
      localStorage.getItem('userName')
    )
    expect(store.dispatch).toHaveBeenCalledWith(
      'setUserId_action',
      localStorage.getItem('userId')
    )
    expect(store.dispatch).toHaveBeenCalledWith(
      'setProjectId_action',
      localStorage.getItem('projectId')
    )
    expect(route.push).not.toHaveBeenCalled()
  })

  it('status 200 with Logout', async () => {
    localStorage.setItem('token', 'Bearer bad-token')
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ status: 'Logout' })
    });

    await auth()

    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(route.push).toHaveBeenCalledWith('/authorization')
  })

  it('status 404', async () => {
    localStorage.setItem('token', 'Bearer old-token')
    mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: 'example.com' })
      })
    .mockResolvedValueOnce({
      status: 404,
      json: () => Promise.resolve({ type:"https://tools.ietf.org/html/rfc7231#section-6.5.4",title:"Not Found",status:404,traceId:"00-951fbe25893f98b0c53b1608b5ce8628-aaf8897199c0e4ab-00" })
    });

    await auth()

    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(route.push).toHaveBeenCalledWith('/authorization')
  })

  it('status 500', async () => {
    localStorage.setItem('token', 'Bearer old-token')
    mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: 'example.com' })
      })
    .mockResolvedValueOnce({
      status: 500,
      json: () => Promise.resolve({ StatusCode:500,"Sender":table/check,ErrorMessages:"[Exception of type \u0027System.Exception\u0027 was thrown.]"})
    });

    await auth()

    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(route.push).toHaveBeenCalledWith('/authorization')
  })

  it('network error', async () => {
    localStorage.setItem('token', 'Bearer abc123')
    mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ ip: 'example.com' })
      })
      .mockRejectedValueOnce(new Error('Network error'));

    await auth()

    expect(localStorage.getAll()).toEqual({})
    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(route.push).toHaveBeenCalledWith('/authorization')
  })
})

describe('logout()', () => {
  const callback = vi.fn()

  it('status 200', async () => {
    localStorage.setItem('token', 'Bearer abcdef')
    localStorage.setItem('userId', '123')
    localStorage.setItem('userName', 'Alice')
    localStorage.setItem('creatorId', 'x')

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),  
    })
    await logout(callback)

    expect(Object.keys(localStorage)).toHaveLength(5)

    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(store.dispatch).toHaveBeenCalledWith('setUserName_action', null)

    expect(route.push).toHaveBeenCalledWith('/authorization')
    expect(callback).toHaveBeenCalledWith({ successful: true })
  })

  it('fails logout when fetch throws', async () => {
    localStorage.setItem('token', 'Bearer abcdef')
    localStorage.setItem('userId', '123')
    localStorage.setItem('userName', 'Alice')

    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await logout(callback)

    expect(Object.keys(localStorage)).toHaveLength(5)

    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(store.dispatch).toHaveBeenCalledWith('setUserName_action', null)

    expect(route.push).toHaveBeenCalledWith('/authorization')
    expect(callback).toHaveBeenCalledWith({ successful: false })
  })

  
  it('fails logout when token is missing', async () => {
    localStorage.setItem('userId', '123')

    mockFetch.mockResolvedValueOnce({ ok: true })

    await logout(callback)

    expect(Object.keys(localStorage)).toHaveLength(5)

    expect(store.dispatch).toHaveBeenCalledWith('setIsAuth_action', false)
    expect(store.dispatch).toHaveBeenCalledWith('setUserName_action', null)

    expect(route.push).toHaveBeenCalledWith('/authorization')
    expect(callback).toHaveBeenCalledWith({ successful: false })
  })
})