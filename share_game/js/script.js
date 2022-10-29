const map = document.querySelector(`#mapa`);

let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 800;

anchoDelMapa > anchoMaximoDelMapa ? anchoDelMapa = anchoMaximoDelMapa - 20 : null

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
    }
};

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
secioness.addEventListener (`click`, ControladorDeEventoSelect);

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
function ControladorDeEventoSelect () {
    if (contador % 2 == 0) {
        let value = selects.value[12]
        alert(dragonsDescriptions[value-1])
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
moverUp.addEventListener(`touchstart`, moveUp);
moverUp.addEventListener(`mouseup`, detenerMovimentoY);
moverUp.addEventListener(`touchend`, detenerMovimentoY);

moverLeft.addEventListener(`mousedown`, moveLeft);
moverLeft.addEventListener(`touchstart`, moveLeft);
moverLeft.addEventListener(`mouseup`, detenerMovimentoX);
moverLeft.addEventListener(`touchend`, detenerMovimentoX);

moverDown.addEventListener(`mousedown`, moveDown);
moverDown.addEventListener(`touchstart`, moveDown);
moverDown.addEventListener(`mouseup`, detenerMovimentoY);
moverDown.addEventListener(`touchend`, detenerMovimentoY);

moverRight.addEventListener(`mousedown`, moveRight);
moverRight.addEventListener(`touchstart`, moveRight);
moverRight.addEventListener(`mouseup`, detenerMovimentoX);
moverRight.addEventListener(`touchend`, detenerMovimentoX);

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
    fetch(`http://192.168.:8080/unirse`).then(function (res) {
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
    fetch (`http://192.168.:8080/dragons/${playerId}`, {
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
     fetch (`http://192.168.:8080/dragons/${playerId}/position`, {
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
                
                listaEnemigos = enemigos.map(function (unEnemigoALaVez) {
                    let dragonEnemySelect = null;
                    const dragonName = unEnemigoALaVez.dragon || ``;
                    dragonEnemySelect = dragonName;

                    ejeXSecondPlayer = unEnemigoALaVez.x;
                    ejeYSecondPlayer = unEnemigoALaVez.y; 

                    return dragonEnemySelect
                });
                enemyDragonSelect(listaEnemigos[0])
               
            }) //"enemigos" es la misma variable de res.send 
        };
    });
};

let listaEnemigos = [];


let ejeXSecondPlayer = map.width * 0.82;
let ejeYSecondPlayer = map.height*0.50;

function enemyDragonSelect (secondDragon) {
    let selectDEnemy = secondDragon.name;
    let value = selectDEnemy[9]
    selectOfPc (value-1);
};

//---------------------


const slt = document.querySelector (`#select`);
const rdm = document.querySelector (`#random`);
slt.addEventListener (`click`, seleccionar);
rdm.addEventListener (`click`, SeleccionRandom);

function random (minimo, maximo) {
    return Math.floor (Math.random() * (maximo - minimo + 1) + minimo);
};

function SeleccionRandom () {
    let aleatorio1 = random (0, 5);
    selectOfPlayer (aleatorio1)
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
};

function consola(uno, dos) {
    console.log(uno);
    console.log(dos);
};

let porMolesto = 0;

function seleccionar () {
    const OPTIONS = {
        'selectDragon1': () => selectOfPlayer (0),
        'selectDragon2': () => selectOfPlayer (1),
        'selectDragon3': () => selectOfPlayer (2),
        'selectDragon4': () => selectOfPlayer (3),
        'selectDragon5': () => selectOfPlayer (4),
        'selectDragon6': () => selectOfPlayer (5)
    };
    OPTIONS[selects.value] ? OPTIONS[selects.value](): undefined;
    
    if ((selects.value == `selectDragon`) && (porMolesto == 0))
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

    if (playerId == 2) {
        dragonSeleccionadoPlayer[0].x = map.width * 0.82;
        ejeXSecondPlayer = map.width * 0.02;
    };
    
    slt.disabled=true;
    rdm.disabled=true;
    slt.style.visibility=`hidden`;
    rdm.style.visibility=`hidden`;
   
    intervalo = setInterval(pintarCanvas, 50);
};

let habilitadorDelOtroPlayer = 0;
let dragonSeleccionadoPc = [];

function selectOfPc (numberDragonSelect) {
   
    dragonSeleccionadoPc.push(dragonsList[numberDragonSelect]);
    dragonSeleccionadoPc[0].x = ejeXSecondPlayer;
    dragonSeleccionadoPc[0].y = ejeYSecondPlayer;
    
};

function pintarCanvas () {
    dragonSeleccionadoPlayer[0].x = dragonSeleccionadoPlayer[0].x + dragonSeleccionadoPlayer[0].velocidadX;
    dragonSeleccionadoPlayer[0].y = dragonSeleccionadoPlayer[0].y + dragonSeleccionadoPlayer[0].velocidadY;
 
    lienzo.clearRect(0, 0, map.width, map.height);
    lienzo.drawImage (imagenFondoCanvas, 0, 0, map.width, map.height);
    if ((dragonSeleccionadoPlayer[0].velocidadX !== 0) || (dragonSeleccionadoPlayer[0].velocidadY !== 0)) {
        revisarColisiones(dragonSeleccionadoPc[0]);
        detenerEnBordesDelMapa();
        };
    actualizarCoordenadasDesdePintarCanvas(dragonSeleccionadoPlayer[0].x, dragonSeleccionadoPlayer[0].y);
    
    dragonSeleccionadoPlayer[0].drawObjectDragons();
    dragonSeleccionadoPc[0].drawObjectDragons();
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
};

function moveUp() {
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
    alert (`holaaa colisionó con ${dragonSeleccionadoPc[0].name}`);
}