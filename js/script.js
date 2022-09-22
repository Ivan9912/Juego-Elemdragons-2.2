const map = document.querySelector(`#mapa`);

let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 800;

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20;
};



mapa.width = anchoDelMapa;
mapa.height = anchoDelMapa * 0.45;


class Dragons {
    constructor(name, image, element, health, atk, def, debFire, debWater, debEarth, id, x=map.width*0.02, y=map.height*0.50) {
        this.name = name
        this.image = image
        this.element = element 
        this.health = health
        this.atk = atk
        this.def = def
        this.debFire = debFire
        this.debWater = debWater
        this.debEarth = debEarth
        this.id = id
        this.x = x
        this.y = y
        this.alto = map.width/6
        this.ancho = map.width/6
        this.mapfoto = new Image()
        this.mapfoto.src = image
        this.velocidadX = 0
        this.velocidadY = 0
    }
    drawObjectDragons() {
        lienzo.drawImage (this.mapfoto, this.x, this.y, this.ancho, this.alto);
    }//dragonSeleccionadoPlayer[0]
}

const dragonsList = [];

dragonsList.push(new Dragons(`Dragón N°1`, `https://i.imgur.com/GDYqWIE.png`, `Agua`, 1010, 65, 16, 35, -15, `Indistinto`, `mascota-1`));
dragonsList.push(new Dragons(`Dragón N°2`, `https://i.imgur.com/2pcscRc.png`, `Fuego`, 1020, 70, 15, -15, `Indistinto`, 35, `mascota-2`));
dragonsList.push(new Dragons(`Dragón N°3`, `https://i.imgur.com/vokks6I.png`, `Tierra`, 1030, 75, 14, `Indistinto`, 35, -15, `mascota-3`));
dragonsList.push(new Dragons(`Dragón N°4`, `https://i.imgur.com/lzIglf5.png`, `Viento (Agua)`, 1040, 80, 13, 35 - 15, -15, 35, `mascota-4`));
dragonsList.push(new Dragons(`Dragón N°5`, `https://i.imgur.com/5PH2mR0.png`, `Lodo (Tierra)`, 1050, 85, 12, 35, 35 - 15, -15, `mascota-5`));
dragonsList.push(new Dragons(`Dragón N°6`, `https://i.imgur.com/nSXxdj8.png`, `Lava (Fuego)`, 1060, 90, 11, -15, 35, 35 - 15, `mascota-6`));

const selects = document.querySelector (`#selectOptions`);
selects.innerHTML = `<option value="selectDragon">-Select-</option>`;

for (let i = 0; i < dragonsList.length; i++) {
    const options = dragonsList[i].name;
    selects.innerHTML += `<option value="selectDragon${i+1}" class="opciones" id="option-${i+1}">${options}</option>`;
};

const secioness = document.querySelector (`#section`);
secioness.addEventListener (`click`, holita);


const dragonsDescriptions = [];

dragonsList.forEach ((dragon) => {
    let maxAttack = parseInt (dragon.atk * 1.65);
    dragonsDescriptions.push (`
    ${dragon.name} 
    Su elemento es de ${dragon.element} 
    Su vida es de ${dragon.health}
    Su ataque es de: ${dragon.atk} - ${maxAttack}
    Su defensa es de: ${dragon.def}
    Su debilidad por Elemento de Fuego: ${dragon.debFire}
    Su debilidad por Elemento de Agua: ${dragon.debWater}
    Su debilidad por Elemento de Tierra: ${dragon.debEarth}`);
});

let contador = 1;
function holita () {
    if (contador % 2 == 0) {
        if (selects.value == `selectDragon1`) {
            alert(dragonsDescriptions[0]);
        }else if (selects.value == `selectDragon2`) {
            alert(dragonsDescriptions[1]);
        }else if (selects.value == `selectDragon3`) {
            alert(dragonsDescriptions[2]);
        }else if (selects.value == `selectDragon4`) {
            alert(dragonsDescriptions[3]);
        }else if (selects.value == `selectDragon5`) {
            alert(dragonsDescriptions[4]);
        }else if (selects.value == `selectDragon6`) {
            alert(dragonsDescriptions[5]);
        };
    };
    contador++;
};

const verMapa = document.querySelector(`#ver-mapa`);

const nose = document.querySelector(`#nose`);
const btnNose2 = document.querySelector(`#btn-move`);
const body = document.querySelector(`#body`)
const moverUp = document.querySelector(`#moveUp`);
const moverLeft = document.querySelector(`#moveLeft`);
const moverDown = document.querySelector(`#moveDown`);
const moverRight = document.querySelector(`#moveRight`);

const playerNumers = document.querySelector(`#numero-jugador`);

btnNose2.addEventListener(`click`, cambiarColorFondoBody);

moverUp.addEventListener(`mousedown`, moveUp);
moverUp.addEventListener(`mouseup`, detenerMovimentoY);
moverLeft.addEventListener(`mousedown`, moveLeft);
moverLeft.addEventListener(`mouseup`, detenerMovimentoX);
moverDown.addEventListener(`mousedown`, moveDown);
moverDown.addEventListener(`mouseup`, detenerMovimentoY);
moverRight.addEventListener(`mousedown`, moveRight);
moverRight.addEventListener(`mouseup`, detenerMovimentoX);

let imagenFondoCanvas = new Image ();
imagenFondoCanvas.src = `https://i.imgur.com/mCwQIbV.jpg`;
imagenFondoCanvas.setAttribute (`style`, `box-shadow: 5px -6px 291px -54px rgba(255,247,247,0.75) inset;
-webkit-box-shadow: 5px -6px 291px -54px rgba(255,247,247,0.75) inset;
-moz-box-shadow: 5px -6px 291px -54px rgba(255,247,247,0.75) inset;`);

let lienzo = map.getContext(`2d`);

let index = 0;
let intervalo;

let playerId = null;

window.addEventListener (`keydown`, teclaPresionada);
window.addEventListener (`keyup`, detenerMovimentoX);
window.addEventListener (`keyup`, detenerMovimentoY);
window.addEventListener (`load`, unirseAlJuego);

//----------
//BACKEND

function unirseAlJuego () {
    fetch(`http://localhost:8080/unirse`).then(function (res) {
            //console.log(res);
        if (res.ok) {
            res.text().then(function (respuesta) {
                //console.log(respuesta);
                playerId = respuesta;
                identificadorDeJugador(playerId);
            });
        };
    });
};

function identificadorDeJugador (playerNumber) {
    playerNumers.innerHTML = playerNumber;
};

function selectDragonPlayerBackEnd (nameDragonPlayer) {
    fetch (`http://localhost:8080/dragons/${playerId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            dragon1: nameDragonPlayer
        })
    });
    
};

function actualizarCoordenadasDesdePintarCanvas (x, y) {
     fetch (`http://localhost:8080/dragons/${playerId}/position`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            x, // como es igual la variable en index.js solo se coloca "x" porque aca es "ejeX = req.body.x"...
            y
        })
     }).then (function(res){
        if (res.ok) {
            res.json().then(function ({enemigos}){
                //console.log(enemigos); 
                
                listaEnemigos = enemigos.map(function (unEnemigoALaVez) {
                    let dragonEnemySelect = null;
                    const dragonName = unEnemigoALaVez.dragon || ``;
                    dragonEnemySelect = dragonName;

                    // unEnemigoALaVez.x = map.width * 0.82;   //ESTAS 2 VARIAS SI LAS QUITO, LOS PJS SE INTERMONEN EN LA MISMA COORDENADA. PERO AL COLOCAR ESTO NO SE ACTUALIZAR...
                    // unEnemigoALaVez.y = map.height*0.50;

                    ejeXSecondPlayer = unEnemigoALaVez.x;
                    ejeYSecondPlayer = unEnemigoALaVez.y; 
                    //consola(unEnemigoALaVez)

                    // enemyDragonSelect(dragonEnemySelect);
                    //valorDragonSecond.push(dragonName)
                    // console.log(dragonName);
                    return dragonEnemySelect
                });
                enemyDragonSelect(listaEnemigos[0])
                //console.log(enemigos[1].dragon.name);
                //valorDragonSecond.push( enemigos[1].dragon.name);
                //console.log(valorDragonSecond[0])
            }) //"enemigos" es la misma variable de res.send 
        };
    });
};

let listaEnemigos = [];


let ejeXSecondPlayer = map.width * 0.82;
let ejeYSecondPlayer = map.height*0.50;

function enemyDragonSelect (secondDragon) {
    let selectDEnemy = secondDragon.name;
    //console.log(dragonEnemySelect);
    if (selectDEnemy === `Dragón N°1`) {
        // alert(`nose`)
        selectOfPc (0);
    }else if (selectDEnemy === `Dragón N°2`) {
        selectOfPc (1);
    }else if (selectDEnemy === `Dragón N°3`) {
        selectOfPc (2);
    }else if (selectDEnemy === `Dragón N°4`) {
        selectOfPc (3);
    }else if (selectDEnemy === `Dragón N°5`) {
        selectOfPc (4);
    }else if (selectDEnemy === `Dragón N°6`) {
        selectOfPc (5);
    };
    // if (selectDEnemy !== ``) {
    //     alert (`funcionará?`)
    // }
}
// const valorDragonSecond = []; 

//---------------------

// const selectSecondDragon = [];

const slt = document.querySelector (`#select`);
const rdm = document.querySelector (`#random`);
slt.addEventListener (`click`, seleccionar);
rdm.addEventListener (`click`, SeleccionRandom);


function random (minimo, maximo) {
    return Math.floor (Math.random() * (maximo - minimo + 1) + minimo);
};

function SeleccionRandom () {
    let aleatorio1 = random (1, 6);

    if (aleatorio1 == 1) {
        selectOfPlayer (0);
    }else if (aleatorio1 == 2) {
        selectOfPlayer (1);
    }else if (aleatorio1 == 3) {
        selectOfPlayer (2);
    }else if (aleatorio1 == 4) {
        selectOfPlayer (3);
    }else if (aleatorio1 == 5) {
        selectOfPlayer (4);
    }else if (aleatorio1 == 6) {
        selectOfPlayer (5);
    }
    contador++;
};

let numberSelect = 0;
let dragonSeleccionadoPlayer = [];

dragonsList[1].mapfoto.setAttribute(`style`, `width: 150px; height: 150px;`);
nose.appendChild(dragonsList[1].mapfoto);

function cambiarColorFondoBody() {
    if (index % 2 == 0) {
        alert(`
                Hola soy un boton con estilo de prueba ;)...
                Te apago la luz.`);
        body.setAttribute(`style`, `background: black`);
        map.setAttribute(`style`, `box-shadow: -2px -74px 125px 69px rgba(94,57,57,0.75) inset;
                -webkit-box-shadow: -2px -74px 125px 69px rgba(94,57,57,0.75) inset;
                -moz-box-shadow: -2px -74px 125px 69px rgba(94,57,57,0.75) inset;`);
    } else {
        body.setAttribute(`style`, `background-color: cornflowerblue;`);
    };
    index++;
};

function teclaPresionada (event) {
    //console.log(event.key)
    switch (event.key) {
        case `ArrowUp` :
            moveUp ();
            break;
        case `w`: 
            moveUp ();
            break;
        case (`ArrowLeft`):
            moveLeft();
            break;
        case (`a`):
            moveLeft ();
            break;
        case `ArrowDown`:
            moveDown ();
        break;
        case `s`: 
            moveDown ();
            break;
        case `ArrowRight`:
            moveRight ();
            break;
        case `d`: 
            moveRight ();
            break;
        case `p`:
            consola();
            break;
    }
    // if (contador >= 2) {
    //     if (event.key == `t`) {
    //         alert (`jojo trampa`);
    //         selectPc();
    //     };
    // };
};
function consola(uno, dos) {
    console.log(uno);
    console.log(dos);
}

let porMolesto = 0;

function seleccionar () {
    if (selects.value == `selectDragon1`) {
        selectOfPlayer (0);
    }else if (selects.value == `selectDragon2`) {
        selectOfPlayer (1);
    }else if (selects.value == `selectDragon3`) {
        selectOfPlayer (2);
    }else if (selects.value == `selectDragon4`) {
        selectOfPlayer (3);
    }else if (selects.value == `selectDragon5`) {
        selectOfPlayer (4);
    }else if (selects.value == `selectDragon6`) {
        selectOfPlayer (5);
    } else if ((selects.value == `selectDragon`) && (porMolesto == 0))
        alert (`Selecciona a un dragón. Por favor.`);
        porMolesto++
    if (porMolesto == 10) {
        alert (`Te desabilito el botón para que no andes molestando ja! 
                            Reinicia la página.`)
        slt.disabled=true;
        slt.style.visibility=`hidden`;
    };
};

function selectOfPlayer (numberDragonSelect) {
    dragonSeleccionadoPlayer.unshift(dragonsList[numberDragonSelect]);
    selectDragonPlayerBackEnd(dragonsList[numberDragonSelect].name);
    
    slt.disabled=true;
    rdm.disabled=true;
    slt.style.visibility=`hidden`;
    rdm.style.visibility=`hidden`;
    //enemyDragonSelect(random (1, 6));
    //selectPc ();
    // habilitadorDelOtroPlayer++;
    // console.log(habilitadorDelOtroPlayer);
    
    // if (habilitadorDelOtroPlayer == 2) {
    //     selectPc(selectSecondDragon[0]);
    // };
    intervalo = setInterval(pintarCanvas, 50);
};

let habilitadorDelOtroPlayer = 0;



// function selectPc (SecondDragon) {
//     //let aleatorio = random (1, 6);
//     //console.log(SecondDragon);
//     //console.log (aleatorio)
//     if (SecondDragon == 1) {
//         selectOfPc (0);
//     }else if (SecondDragon == 2) {
//         selectOfPc (1);
//     }else if (SecondDragon == 3) {
//         selectOfPc (2);
//     }else if (SecondDragon == 4) {
//         selectOfPc (3);
//     }else if (SecondDragon == 5) {
//         selectOfPc (4);
//     }else if (SecondDragon == 6) {
//         selectOfPc (5);
//     };
    
// };

let dragonSeleccionadoPc = [];
function selectOfPc (numberDragonSelect) {
   
    dragonSeleccionadoPc.push(dragonsList[numberDragonSelect]);
    dragonSeleccionadoPc[0].x = ejeXSecondPlayer;
    dragonSeleccionadoPc[0].y = ejeYSecondPlayer;
    
    // dragonSeleccionadoPlayer[0].drawObjectDragons();
    
    
    
};

function pintarCanvas () {
    dragonSeleccionadoPlayer[0].x = dragonSeleccionadoPlayer[0].x + dragonSeleccionadoPlayer[0].velocidadX;
    dragonSeleccionadoPlayer[0].y = dragonSeleccionadoPlayer[0].y + dragonSeleccionadoPlayer[0].velocidadY;
    // dragonSeleccionadoPc[0].x = ejeXSecondPlayer;
    // dragonSeleccionadoPc[0].y = ejeYSecondPlayer;
    lienzo.clearRect(0, 0, map.width, map.height);
    lienzo.drawImage (imagenFondoCanvas, 0, 0, map.width, map.height);
    if ((dragonSeleccionadoPlayer[0].velocidadX !== 0) || (dragonSeleccionadoPlayer[0].velocidadY !== 0)) {
        revisarColisiones(dragonSeleccionadoPc[0]);
        detenerEnBordesDelMapa();
        };
    // dragonSeleccionadoPlayer[0].drawObjectDragons();
    actualizarCoordenadasDesdePintarCanvas(dragonSeleccionadoPlayer[0].x, dragonSeleccionadoPlayer[0].y);
    //dragonSeleccionadoPc[0].drawObjectDragons();
    dragonSeleccionadoPlayer[0].drawObjectDragons();
    dragonSeleccionadoPc[0].drawObjectDragons();
    //listaEnemigos.drawObjectDragons();
    
    
    
    
};

function detenerEnBordesDelMapa() {
    // Verificar si las mascotas ya llegaron al borde del mapa
  
    const arribaMapa = map.height * 0.015;
    const abajoMapa = map.height * 0.51;
    const derechaMapa = map.width * 0.99;
    const izquierdaMapa = map.width * 0.015;
  
    const arribaJugador = dragonSeleccionadoPlayer[0].y;
    const derechaJugador = dragonSeleccionadoPlayer[0].x + dragonSeleccionadoPlayer[0].ancho;
    const izquierdaJugador = dragonSeleccionadoPlayer[0].x;
  
    if (arribaJugador < arribaMapa) {
      dragonSeleccionadoPlayer[0].y = arribaMapa;
    };
  
    if (arribaJugador > abajoMapa) {
      dragonSeleccionadoPlayer[0].y = abajoMapa;
    };
  
    if (derechaJugador > derechaMapa) {
      dragonSeleccionadoPlayer[0].x = derechaMapa - dragonSeleccionadoPlayer[0].ancho;
    };
  
    if (izquierdaJugador < izquierdaMapa) {
      dragonSeleccionadoPlayer[0].x = izquierdaMapa;
    };
    // console.log(abajoJugador, mascotaJugador.y);
};

function moveUp() {
    // const gravedad = () => dragonSeleccionadoPlayer[v]locidadY = 5;
    // if (dragonSeleccionadoPlayer.y > 70) {
    //     dragonSeleccionadoPlayer.velocidadY = - 5;
    // }else {
    //     setInterval (gravedad, 30)
    // }
    dragonSeleccionadoPlayer[0].velocidadY = - 5;
};

function moveLeft() {
    dragonSeleccionadoPlayer[0].velocidadX = - 5;
};

function moveDown() {
     dragonSeleccionadoPlayer[0].velocidadY = 5;
};

function moveRight() {
    dragonSeleccionadoPlayer[0].velocidadX = 5;
};


function detenerMovimentoY() {
    //  const gravedad = () => {
    //     if ((dragonSeleccionadoPlayer[0].y >= 70) && (dragonSeleccionadoPlayer[0].y < 181)) {
    //         dragonSeleccionadoPlayer[0].velocidadY = 5
    //     }else if (dragonSeleccionadoPlayer[0].y >= 181) { 
    //         dragonSeleccionadoPlayer[0].velocidadY = 0;
    //     }
    // }
    // setInterval (gravedad, 30)
    dragonSeleccionadoPlayer[0].velocidadY = 0;
};

function detenerMovimentoX() {
    dragonSeleccionadoPlayer[0].velocidadX = 0;
};


function revisarColisiones(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaDragon = dragonSeleccionadoPlayer[0].y;
    const abajoDragon = dragonSeleccionadoPlayer[0].y + dragonSeleccionadoPlayer[0].alto;
    const derechaDragon = dragonSeleccionadoPlayer[0].x + dragonSeleccionadoPlayer[0].ancho;
    const izquierdaDragon = dragonSeleccionadoPlayer[0].x;

    if ((abajoDragon < arribaEnemigo) || (arribaDragon > abajoEnemigo) || (derechaDragon < izquierdaEnemigo) || (izquierdaDragon > derechaEnemigo) ) {
        return
    }
    detenerMovimentoX();
    detenerMovimentoY();
    //clearInterval (intervalo);
    alert (`holaaa colisionó con ${dragonSeleccionadoPc[0].name}`);
};


