export async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}