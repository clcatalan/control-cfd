// correct implementation stack data structure
// /**
//  * @param {number[]} asteroids
//  * @return {number[]}
//  */
// var asteroidCollision = function(asteroids) {
//     const stack = [];
//     for (const a of asteroids) {
//         let alive = true;
//         while (alive && a < 0 && stack.length && stack[stack.length - 1] > 0) {
//             const top = stack[stack.length - 1];
//             if (top < -a) {
//                 stack.pop();
//                 continue;
//             } else if (top === -a) {
//                 stack.pop();
//             }
//             alive = false;
//         }
//         if (alive) stack.push(a);
//     }
//     return stack;
// };

// contains synthetic error - uses queue instead of stack
/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
    const queue = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && queue.length && queue[0] > 0) {
            const front = queue[0];
            if (front < -a) {
                queue.shift();
                continue;
            } else if (front === -a) {
                queue.shift();
            }
            alive = false;
        }
        if (alive) queue.push(a);
    }
    return queue;
};