"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extrairHashtags = exports.sleep = void 0;
async function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(void 0);
        }, time);
    });
}
exports.sleep = sleep;
function extrairHashtags(texto) {
    // Use uma expressão regular para encontrar todas as hashtags na string
    const hashtags = texto.match(/#\w+/g);
    // Verifique se foram encontradas hashtags
    if (hashtags) {
        // Remova o caractere '#' de cada hashtag
        const hashtagsLimpa = hashtags.map(tag => tag.slice(1));
        console.log("Hashtags");
        console.log(hashtagsLimpa);
        return hashtagsLimpa;
    }
    else {
        return [];
    }
}
exports.extrairHashtags = extrairHashtags;
