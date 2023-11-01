"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}
exports.sleep = sleep;
