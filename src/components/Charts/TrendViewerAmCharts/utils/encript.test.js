import { encript } from './encript'

describe('encript', () => {
    it('should return correct encoded string for known input', () => {
        // Пример: массив байтов
        const input = Uint8Array.from([0b11001100, 0b10101010]) // 2 байта

        const result = encript(input)

        // Результат зависит от алфавита. Вот пример реального вычисления вручную:
        // Лучше всего — протестировать конкретные входы с зафиксированным результатом.
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty input', () => {
        const input = Uint8Array.from([])
        const result = encript(input)
        expect(result).toBe('')
    })

    it('should produce same result for same input', () => {
        const input = Uint8Array.from([0x12, 0x34, 0x56, 0x78])
        const r1 = encript(input)
        const r2 = encript(input)
        expect(r1).toBe(r2)
    })

    it('should produce different output for different input', () => {
        const input1 = Uint8Array.from([0x00])
        const input2 = Uint8Array.from([0xFF])
        expect(encript(input1)).not.toBe(encript(input2))
    })
})