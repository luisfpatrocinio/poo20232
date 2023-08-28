
//01.
function parImpar(numero: number): boolean {
    return numero % 2 == 0;
  }
  
  console.log(parImpar(2), '\n');
  
  //02.
  function primo(numero: number): boolean {
    for (let i = 2; i < numero; i++) {
      if(numero % i == 0) {
         return false;
      }
    }
    return numero !== 1;  
  }
  
  console.log(primo(24), '\n');
  
  //03.
  function saudacao(nome: string, pronome: string = "Sr"): string {
    return `${pronome}. ${nome}`; 
  }
  
  console.log(saudacao("Sávia", "Sra"), '\n');
  
  //04.
  function arrayParaString(array: number[]): string {
    let string = "";
  
    for ( let i = 0; i < array.length; i++ ) {
      string += String(array[i]);
      if ( i < array.length - 1 ) string += "-";
    }
  
    return string;
  }
  
  console.log(arrayParaString([1, 2, 3, 4, 5]), '\n');
  
  //05.
  function soma(x: number, y?: any): number {
    return x + y
  }
  
  console.log(soma(1, 2)); // soma os numeros
  console.log(soma(1, "2")); // concatena 
  console.log(soma(1), '\n'); // Não houve checagem do parâmetro opcional
  
  //6.
  function exibir(...parametros: string[]): void {
    let out: string = "";
  
    for ( let item of parametros ){
      out += `${item} `
    }
  
    console.log(out.trim());
  }
  
  exibir("a", "b");
  exibir("a", "b", "c");
  exibir("a", "b", "c", "d");
  
  //7.
  let ola = () => "Olá"
  
  console.log(ola(), '\n')
  
  //8.
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  
  let pares = array.filter((item) => item % 2 == 0);
  console.log(pares, '\n');
  
  //09.
  let arrayDobrado = array.map(x => x * 2)
  console.log(arrayDobrado, '\n');
  
  let somaArray = array.reduce((sum, x) => sum + x)
  console.log(somaArray, '\n'); 