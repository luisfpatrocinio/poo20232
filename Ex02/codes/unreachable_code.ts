function condition(value: number) {
    if (value > Infinity) {
        console.log("Esse valor não existe!") // Esse código nunca vai executar, mas a mensagem de erro não é mostrada
    }
}