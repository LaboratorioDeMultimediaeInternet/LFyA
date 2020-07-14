function FN_Greibach(gramatica){
  let prod;
  console.log(gramatica);
  gramatica.L.slice().reverse().forEach(element => {
    gramatica.P[element].forEach(produccion => {
      prod = produccion.match(/[a-z]|#|([A-Z](\"|[0-9]+)?)/g);
      if(prod.length != 1){
        if(prod[0].search(/Y[0-9]+/) == 0){
          gramatica.P[element][gramatica.P[element].indexOf(produccion)] = 
            gramatica.auxT.getT(prod[0]) + prod[1];
        }
      }
    });
  });
  let repetir;
  do{
    repetir = false;
    gramatica.L.slice().reverse().forEach(element => {
      gramatica.P[element].forEach(produccion => {
        prod = produccion.match(/[a-z]|#|([A-Z](\"|[0-9]+)?)/g);
        if(prod.length != 1){
          if(prod[0].search(/[A-Z](\"|[0-9]+)?/) == 0){
            gramatica.P[prod[0]].forEach(nprod => {
              insert(gramatica.P[element], nprod + produccion.slice(1))
            });
            gramatica.P[element].shift();
            repetir = true;
          }
        }
      });
    });
  }while(repetir)
  //gramatica = SimbolosInaccesibles(gramatica);
  console.log('FNG\n' + gramatica);
  return gramatica;
}