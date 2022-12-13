export const encript = {
    methods: {
        encript(values) {
            const Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
            var bitsCount = 8 * values.length;
            var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount % 5 == 0 ? 0 : 1));
            for (let i = 0; i < ans.length; i++) {
                var bitNum = i * 5;
                var byteNum = Math.trunc(bitNum / 8);
                var byteOffset = bitNum % 8;
                var symbol = values[byteNum] >> byteOffset;
                if (byteOffset > 3 && byteNum < (values.length - 1)) {
                    var symbolOffset = 8 - byteOffset;
                    symbol |= values[byteNum + 1] << symbolOffset;
                }
                symbol &= 0b11111;
                ans[i] = Alphabet[symbol];
            }
            return ans.join("")
        },
    }
}
