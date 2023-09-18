let hp = 100;
let hpMax = 100;

async function main() {
    clearTerminal();

    while (true) {
        showHP();
        await obterTexto();
        await flashScreen();

        let _damage = calculateDamage();
        takeDamage(_damage);

        if (!isAlive()) {
            console.log("Você morreu.")
            break;
        }
    }

    gameOver();
    gameEnd();
}

function showHP() {
    const fillChar = "█";
    const emptyChar = "░";
    const _w = 10;
    let hpString = "";
    for (let i = 0; i < _w; i++) {
        hpString += (hp / hpMax > i / 10) ? fillChar : emptyChar;
    }
    console.log(`HP: ${hp} ${hpString}`);
}

function gameOver() {
    console.log("Fim de jogo.");
}

function gameEnd() {
    process.exit();
}

function isAlive() {
    return (hp > 0);
}

function calculateDamage() {
    return Math.floor(Math.random() * 10) + 10;
}

function takeDamage(_damage) {
    console.log(`Você tomou ${_damage} de dano!`);
    hp -= _damage;
    hp = Math.max(hp, 0);
}

async function flashScreen() {
    clearTerminal();
    let _largura = obterLarguraTerminal();
    for (let i = 0; i < obterAlturaTerminal(); i++) {
        console.log(`${'█'.repeat(_largura)}`);
    }
    process.stdout.write("\x1b[A\r")
    await sleep(168);
    clearTerminal();
}

function sleep(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function obterLarguraTerminal() {
    return process.stdout.columns;
}

function obterAlturaTerminal() {
    return process.stdout.rows;
}

function clearTerminal() {
    console.clear();
}

function obterTexto() {
    return new Promise((resolve, reject) => {
        process.stdin.once('data', (data) => {
            resolve(String(data));
        });
    });
}


main();