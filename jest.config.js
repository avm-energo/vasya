export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json', 'vue'],
    testMatch: ['**/*.test.[jt]s?(x)'],
}
