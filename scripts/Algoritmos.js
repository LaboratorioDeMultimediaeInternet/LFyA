function SimbolosMuertos(gramatica) {
  gramatica1 = new Gramatica(); // Definimos la nueva Gramatica
  gramatica1.L = new Array();
  var prod = new Producciones(); // Objeto tipo Producciones
  var P = JSON.parse(JSON.stringify(gramatica.P)); // Copiamos las producciones de la gramatica recibida, esto para no alterar la gramatica
  gramatica.L.forEach((element) => {
    //Para cada NT que tiene producciones
    P[element].forEach((produccion) => {
      // Para cada produccion de un NT
      if (gramatica.isT(produccion)) {
        // Si la produccion esta compuesta solo de Terminales
        insert(gramatica1.L, element); // Actualizamos L
        insert(gramatica1.NT, element); // Actualizamos NT
        prod.addNT(element, produccion); // Añadimos al objeto prod, tanto el NT, como la producción
        P[element][P[element].indexOf(produccion)] = null; // Hacemos la produccion null, para no volverla a revisar
      }
    });
  });
  do {
    // Lo mismo que el paso anterior, pero comparando que una produccion contenga (NT U T)*
    var modificacion = false;
    gramatica.L.forEach((element) => {
      P[element].forEach((produccion) => {
        if (produccion != null) {
          var derivable = true;
          for (var i = 0; i < produccion.length; i++) {
            var c = produccion.charAt(i);
            if (gramatica.isNT(c) && gramatica1.NT.indexOf(c) == -1)
              // Si el simbolo NT aun no esta en la lista de NT
              derivable = false;
          }
          if (derivable) {
            // Si la producción es valida
            insert(gramatica1.L, element);
            insert(gramatica1.NT, element);
            prod.addNT(element, produccion);
            P[element][P[element].indexOf(produccion)] = null;
            modificacion = true; // Activamos la bandera para volver a revisar la gramatica
          }
        }
      });
    });
    // Mientras haya cambios en las listas de NT
  } while (modificacion);
  gramatica1.initGram(gramatica.S, prod, gramatica1.L); // Generamos la lista final de 'NT' y 'T'
  return gramatica1;
}

function SimbolosInaccesibles(gramatica) {
  var gramatica1 = new Gramatica();
  gramatica1.S = gramatica.S; // Nueva instancia de Gramatica
  gramatica1.L = new Array(); // Nuevo orden de los NT ->
  var queue = new Array(gramatica.S); // Cola de No Terminales que producen
  gramatica1.L.push(gramatica.S); // El primer simbolo en la Lista L es el inicial
  insert(gramatica1.NT, gramatica.S);
  var prod = new Producciones(); // Instacia de Producciones
  while (queue.length != 0) {
    // Mientras la cola no este vacía
    var SNT = queue.shift(); // Desencolamos
    gramatica.P[SNT].forEach((produccion) => {
      // Para cada producción
      prod.addNT(SNT, produccion); // Agregamos la producción
      for (var i = 0; i < produccion.length; i++) {
        // Para cada simbolo de la producción
        var c = produccion.charAt(i);
        if (gramatica.isT(c))
          // si se indentifica un terminal
          insert(gramatica1.T, c);
        else {
          // Si se identifica un No Terminal
          if (insert(gramatica1.NT, c)) {
            // El NT se añade a la cola, para despues colocar sus producciones
            insert(gramatica1.L, c);
            queue.push(c);
          }
        }
      }
    });
  }
  gramatica1.initGram(gramatica1.S, prod, gramatica1.L);
  //gramatica1.P = prod; // Guardamos las producciones en el objeto Gramatica
  return gramatica1;
}

function eliminarSoloUnVacio(gramatica, NT) {
  gramatica.L.splice(gramatica.L.indexOf(NT), 1);
  gramatica.L.forEach((element) => {
    gramatica.P[element].forEach((produccion) => {
      if (produccion === NT) {
        //gramatica.P[element].splice(gramatica.P[element].indexOf(produccion), 1);
        insert(gramatica.P[element], "#");
      } else if (!gramatica.isT(produccion)) {
        if (produccion.indexOf(NT) != -1) {
          var cadena = eliminarSimboloVacio(produccion, produccion.indexOf(NT));
          //gramatica.P[element][gramatica.P[element].indexOf(produccion)].slice(produccion.indexOf(NT) + 1, 1);
          insert(gramatica.P[element], cadena);
          //gramatica.P[element][gramatica.P[element].indexOf(produccion)] =
          //gramatica.P[element][gramatica.P[element].indexOf(produccion)].slice(produccion.indexOf(NT) - 1, 1);
        }
      }
    });
  });
}

function ProduccionesVacias(gramatica) {
  gramatica1 = new Gramatica();
  gramatica1.S = gramatica.S;
  gramatica1.L = new Array();
  var prod = new Producciones();
  var listaV = new Array();
  var simboloInicialParticipa = false;
  var repetir = true;
  while (repetir) {
    repetir = false;
    gramatica.L.forEach((element) => {
      // Obtenemos la lista de #
      gramatica.P[element].forEach((produccion) => {
        if (produccion === "#") {
          if (gramatica.P[element].length == 1) {
            repetir = true;
            eliminarSoloUnVacio(gramatica, element);
          } else insert(listaV, element);
        }
        if (produccion.includes(gramatica.S)) simboloInicialParticipa = true;
      });
    });
  }
  gramatica.L.forEach((element) => {
    gramatica.P[element].forEach((produccion) => {
      if (produccion !== "#") prod.addNT(element, produccion);
    });
  });
  // Sí el simbolo produce # y ademas participa en otra produccion
  var repetir = false;
  if (listaV) repetir = true;
  while (repetir) {
    repetir = false;
    gramatica.L.forEach((element) => {
      //Dinamico
      insert(gramatica1.L, element);
      for (var j = 0; j != prod[element].length; j++) {
        produccion = prod[element][j];
        prod.addNT(element, produccion);
        if (!gramatica.isT(produccion)) {
          // no tiene caso revisar T+
          for (var i = 0; i < produccion.length; i++) {
            var c = produccion.charAt(i);
            if (gramatica.isNT(c) && listaV.indexOf(c) != -1) {
              nuevaProduccion = eliminarSimboloVacio(produccion, i);
              if (nuevaProduccion != "#") prod.addNT(element, nuevaProduccion);
              else {
                if (insert(listaV, element)) repetir = true;
              }
            }
          }
        }
      }
    });
  }
  if (simboloInicialParticipa && listaV.indexOf(gramatica.S) != -1) {
    gramatica1.S = gramatica.S + "'";
    prod.addNT(gramatica1.S, gramatica.S);
    prod.addNT(gramatica1.S, "#");
    gramatica1.L.push(gramatica1.S);
  } else if (listaV.indexOf(gramatica.S) != -1) {
    prod[gramatica.S].unshift("#");
  }
  gramatica1.initGram(gramatica1.S, prod, gramatica1.L);
  return gramatica1;
}

function eliminarSimboloVacio(produccion, i) {
  if (produccion.length == 1) return "#";
  if (i == produccion.length - 1) return produccion.slice(0, i);
  if (i == 0) return produccion.slice(1, produccion.length);
  return produccion.slice(0, i) + produccion.slice(i + 1, produccion.length);
}

function DuplicarGramatica(gramatica) {
  var gramatica1 = new Gramatica();
  gramatica1.S = gramatica.S + "";
  gramatica1.L = new Array();
  gramatica.L.forEach((element) => {
    gramatica1.L.push(element);
  });
  gramatica1.P = JSON.parse(JSON.stringify(gramatica.P));
  gramatica1.initGram(gramatica1.S, gramatica1.P, gramatica1.L);
  return gramatica1;
}

function SimbolosUnitarios(gramatica) {
  var gramatica1 = new Gramatica();
  gramatica1.S = gramatica.S;
  gramatica1.L = new Array();
  var prod = new Producciones();
  var P = JSON.parse(JSON.stringify(gramatica.P));
  var repetir = false;
  gramatica.L.forEach((element) => {
    gramatica1.L.push(element);
    P[element].forEach((produccion) => {
      if (produccion !== element) prod.addNT(element, produccion);
      if (gramatica.isNT(produccion) && produccion.length == 1) repetir = true;
    });
  });
  while (repetir) {
    repetir = false;
    gramatica1.L.forEach((element) => {
      prod[element].forEach((produccion) => {
        if (!gramatica1.isT(produccion) && produccion.length == 1) {
          if (prod[produccion]) {
            prod[produccion].forEach((nProd) => {
              prod.addNT(element, nProd);
            });
          }
          prod[element].splice(prod[element].indexOf(produccion), 1);
          repetir = true;
        }
      });
    });
  }
  gramatica1.initGram(gramatica1.S, prod, gramatica1.L);
  return gramatica1;
}

const gramatica = new Array();

function main() {
  /*
        Función Principal, es la que el botón Inicial manda a llamar
    */
  gramatica[0] = new Gramatica();
  /*
    Gramaticas de prueba:
        Se inicializa con el metodo 'initGram'
        - Primer argumento: Símbolo Inicial
        - Segundo argumento: Objeto con las producciones, cada NT -> (TNT)* es un atributo
        - Tercer argumento: Lista de los NT que producen, debe estar en el mismo orden descrito en el argumento dos  
    */

  simbolosNT = new Array();
  listaProducciones = document.getElementById("producciones").value;
  if (listaProducciones.length == 0) {
    alert("Lista de producciones Invalida");
    return;
  }
  var LNT = listaProducciones.split("\n");
  LNT.forEach((regla) => {
    simbolosNT.push(regla[1]);
  });

  listaProducciones = JSON.parse("{" + listaProducciones + "}");
  document.getElementById("res-propia").style.display = "block";
  resultados = document.getElementById("resultados");

  gramatica[0].initGram(simbolosNT[0], listaProducciones, simbolosNT);
  resultados.innerHTML = "Gramática Inicial:\n" + gramatica[0] + "\n";
  gramatica[1] = SimbolosMuertos(DuplicarGramatica(gramatica[0])); // Se guarda en gramatica[1] el resultado de simbolos Muertos
  resultados.innerHTML +=
    "Eliminación de Símbolos Muertos:\n" + gramatica[1] + "\n";
  gramatica[2] = SimbolosInaccesibles(DuplicarGramatica(gramatica[1])); // Se guarda en gramatica[2] el resultado de simbolos Muertos
  resultados.innerHTML +=
    "Eliminación de Símbolos Inaccesibles:\n" + gramatica[2] + "\n";
  gramatica[3] = ProduccionesVacias(DuplicarGramatica(gramatica[2]));
  resultados.innerHTML +=
    "Eliminación de Símbolos Vacíos:\n" + gramatica[3] + "\n";
  gramatica[4] = SimbolosUnitarios(DuplicarGramatica(gramatica[3]));
  resultados.innerHTML +=
    "Eliminación de Símbolos Unitarios:\n" + gramatica[4] + "\n";
  gramatica[5] = SimbolosMuertos(DuplicarGramatica(gramatica[4]));
  resultados.innerHTML +=
    "Eliminación de Símbolos Muertos:\n" + gramatica[5] + "\n";
  gramatica[6] = SimbolosInaccesibles(DuplicarGramatica(gramatica[5]));
  resultados.innerHTML +=
    "Eliminación de Símbolos Inaccesibles:\n" + gramatica[6] + "\n";
  document.getElementById("btn-limpiar").style.display = "block";
}

function limpiar() {
  document.getElementById("res-limpiar").style.display = "block";
  resultados = document.getElementById("resultadosRCG");
  gramatica[7] = EliminarRecursividad(gramatica[6]);
  resultados.innerHTML +=
    "Eliminación de Recursividad:\n" + gramatica[7] + "\n";
  gramatica[8] = FN_Chomsky(gramatica[7]);
  resultados.innerHTML += "FNC:\n" + gramatica[8] + "\n";
  gramatica[9] = FN_Greibach(gramatica[8]);
  resultados.innerHTML += "FNG:\n" + gramatica[9] + "\n";
}
