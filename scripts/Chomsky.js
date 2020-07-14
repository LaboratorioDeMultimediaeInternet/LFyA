function FN_Chomsky(gramatica){
  let listaNT = new Array();
  let countY = 1;
  let countX = 1;
  let prod;
  gramatica.L.forEach(element => {
    gramatica.P[element].forEach(produccion => {
      prod = produccion.match(/[a-z]|#|([A-Z](\"|[0-9]+)?)/g);
      if(prod.length != 1){
        for (let i = 0; i < prod.length; i++){
          if(prod[i].search(/[a-z]/) == 0)
            if (insert(listaNT, prod[i])){
              insert(gramatica.L, 'Y' + countY);
              gramatica.auxT.addT('Y' + countY, prod[i]);
              gramatica.P['Y' + countY++] = new Array(prod[i]);
            }
          prod[i] = prod[i].replace(/[a-z]/, 'Y' + (gramatica.T.indexOf(prod[i]) + 1));
        }
        while(prod.length > 2){
          let aux = prod.splice(prod.length-2, 2);
          let i;
          let elem;
          for (let element of gramatica.L){
            i = gramatica.P[element].indexOf(aux.join(''));
            elem = element;
            if(i != -1){
              prod.push(element);
              break;
            }
          }
          if(i == -1){
            insert(gramatica.L, 'X' + countX);
            gramatica.P['X' + countX] = new Array(aux.join('')); // Validar si no existe
            prod.push('X' + countX++);
          }
        }
      }
    let n = gramatica.P[element].indexOf(produccion);
    gramatica.P[element][n] = prod.join('');
    });
  });
  gramatica.initGram(gramatica.S, gramatica.P, gramatica.L);
  return gramatica;
}