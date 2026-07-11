// correct solution
// /**
//  * @param {string} s
//  * @param {number[]} shifts
//  * @return {string}
//  */
// var shiftingLetters = function(s, shifts) {
//     const result = s.split('');
//     let total = 0;
//     for (let i = s.length - 1; i >= 0; i--) {
//         total = (total + shifts[i]) % 26;
//         const shifted = (s.charCodeAt(i) - 97 + total) % 26;
//         result[i] = String.fromCharCode(97 + shifted);
//     }
//     return result.join('');
// };

// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
/**
 * @param {string} s
 * @param {number[]} shifts
 * @return {string}
 */
var shiftingLetters = function(s, shifts) {
    const result = s.split('');
    for (let i = s.length - 1; i >= 0; i--) {
        const shifted = (s.charCodeAt(i) - 97 + shifts[i]) % 26;
        result[i] = String.fromCharCode(97 + shifted);
    }
    return result.join('');
};