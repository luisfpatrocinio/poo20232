function not_null_checks() {
    console.log(is_greater_than_100(1000))
    console.log(is_greater_than_100(10))



}

function is_greater_than_100(value: number) {
    if (value > 100) return true
    // Não tem um retorno específico para caso contrário, sendo portanto undifined
}
not_null_checks()