// vitest.setup.js
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Пример мока для Vue Router
config.global.mocks = {
    $t: msg => msg, // если используется i18n
    $router: {
        push: vi.fn(),
        replace: vi.fn()
    },
    $route: {
        path: '/'
    }
}

global.fetch = vi.fn(() =>
    Promise.resolve({
        text: () => Promise.resolve(JSON.stringify({ ip: 'localhost:8080' })),
        json: () => Promise.resolve({ ip: 'localhost:8080' }),
    })
);
