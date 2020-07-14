class Gramatica{
  /**
   * Clase Gramatica:
   * Encapsula los atributos de una gramatica "S, NT, T, P"
   */

  constructor(){
    this.S; // Simbolo Inicial
    this.P; // Producciones
    this.NT = new Array(); // No Terminales
    this.T = new Array(); // Terminales 
    this.L; // JavaScript ordena las Producciones por orden alfabetico, por lo que es necesaria una lista de con el orden corrcto de los NT que producen
    this.auxT = new auxTerminal();
    }

  initGram(S,P,L){ // Inicializamos la gramatica
      this.L = L
      this.S = S;
      this.P = P;
      this.L.forEach(element => {
          // Para cada NT contenido en L
          insert(this.NT, element); // Insertamos el simbolo en NT
          this.P[element].forEach(produccion => {
              // Para cada Produccion de dicho NT (element)
              let prod = produccion.match(/[a-z]|#|([A-Z](\"|[0-9]+)?)/g);
              for(var i = 0; i < prod.length; i++){
                  // Para cada simbolo de las producciones
                  if(this.isT(prod[i])) 
                      insert(this.T, prod[i]); // Si el símbolo es terminal se guarda en 'T'
                  else
                      insert(this.NT, prod[i]); // Si el simbolo es no terminal se guarda en 'NT'
              }
          });
      });
  }

  toString(){
      /**
       * Metodo para mostrar la gramatica
       */
      var gramatica = "S: " + this.S + "\nT: " + this.T + "\nNT: " + this.NT + "\nP:";
      this.L.forEach(element =>{
          if(element.length == 1)
              gramatica += "\n\t" + element + " := " + this.P[element];
          else
              gramatica += "\n\t" + element + ":= " + this.P[element];
      });
      return gramatica; // Regresa un String
  }
  
  isNT(symbol){ // Si el simbolo es mayuscula, es NT
    return symbol == symbol.match(/#|([A-Z](\"|[0-9]+)?)/g);
  }

  isT(symbol){ // si el simbolo es minuscula es T
    return symbol == symbol.match(/[a-z]+|#/g);
  }
}

class Producciones{

  /**
   * 
   * @param {Simbolo No Terminal que lo Produce} NT 
   * @param {Cadena con la prudccion} produccion 
   */

  addNT(NT, produccion){
      if(this[NT]) 
          insert(this[NT], produccion); // Si existe el atributo correspondiente al NT se inserta en su lista de producciones
      else
          this[NT] = new Array(produccion); // Si no existe, se crea el atributo y se le asigna una lista y a ella la producción
  }
}

function insert(list, S){ // Función para no insertar elementos duplicados en una lista
  if(list.indexOf(S) == -1){
      list.push(S);
      return true;
  }
  return false;
}

function addNT(gramatica, NT, produccion){
    if(gramatica.P[NT]) 
        insert(this[NT], produccion); // Si existe el atributo correspondiente al NT se inserta en su lista de producciones
    else
        gramatica.P[NT] = new Array(produccion); // Si no existe, se crea el atributo y se le asigna una lista y a ella la producción
}

class auxTerminal{
    addT(Y, T){
        if(!this[Y])
            this[Y] = T;
    }

    getT(Y){
        return this[Y];
    }
}