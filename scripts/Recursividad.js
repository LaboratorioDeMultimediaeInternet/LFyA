function EliminarRecursividad(gramatica){
  var L = gramatica.L;
  for (let i = 0; i < gramatica.L.length; i++){
    let rec = false;
    for(let j = 0; j < i; j++){
      for(let k = 0; k < gramatica.P[L[i]].length; k++){
        element = gramatica.P[L[i]][k]
        if(element[0] === L[j]){
          let R = element[0];
          gramatica.P[R].forEach(prod =>{
            insert(gramatica.P[L[i]], prod + element.slice(1))
          });
          gramatica.P[L[i]].splice(k, 1);
          k = -1;
        }
      }
    }
    for(let k = 0; k < gramatica.P[L[i]].length; k++){
      element = gramatica.P[L[i]][k];
      if(element[0] === L[i])
        rec = true
    }
    if(rec){
      let aux1 = new Array();
      let aux2 = new Array();
      for(let k = 0; k < gramatica.P[L[i]].length; k++){
        element = gramatica.P[L[i]][k]
        if(element[0] !== L[i])
            insert(aux1, element);
        else
          insert(aux2, element.slice(1));
      }

      for(let k = 0; k < gramatica.P[L[i]].length; k++){
        element = gramatica.P[L[i]][k]
        if(element[0] !== L[i])
          insert(aux1, element + L[i] + '"');
        else
          insert(aux2, element.slice(1) + L[i] + '"');
      }
      gramatica.P[L[i]] = aux1;
      gramatica.P[L[i] + '"'] = aux2;
      insert(gramatica.L, L[i] + '"');
      //gramatica.L.splice(i + 1, 0, L[i] + '"');
    }
  }
  gramatica.NT = gramatica.L;
  console.log('Recursividad\n' + gramatica);
}