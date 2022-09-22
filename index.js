console.log(`Hola nodecitooos!!`);

const express = require (`express`);
const cors = require (`cors`);

const app = express();
app.use(cors());
app.use(express.json());

const players = [];

class Player {
    constructor(id) {
        this.id = id
    }
    asignarDragon (dragon) {
        this.dragon = dragon
    }
    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
    }
};

class Dragon {
    constructor(name) {
        this.name = name
    }
}

let jugadorNumero = 0;

app.get(`/unirse`, (req, res) => {
    jugadorNumero++;
    let id = `${jugadorNumero}`;
    const jugador = new Player(id);
    players.push(jugador);

    res.send(id);
});

app.post (`/dragons/:playerIds`, (req, res) => {
    const playerId = req.params.playerIds || ``;
    const nameDragon = req.body.dragon1 || ``;
    const creatDragon = new Dragon(nameDragon);
    const playerIndice = players.findIndex(playerIndex => playerId === playerIndex.id);

    if (playerIndice >= 0) {
        players[playerIndice].asignarDragon(creatDragon);
    }
    
    res.end();
});

app.post(`/dragons/:playerIds/position`, (req, res) => {
    const playerId = req.params.playerIds || ``;
    const ejeX = req.body.x || 0;
    const ejeY = req.body.y || 0;

    const playerIndice = players.findIndex(playerIndex => playerId === playerIndex.id);

    if (playerIndice >= 0) {
        players[playerIndice].actualizarPosicion(ejeX, ejeY);
    };


    const enemigos = players.filter(cadaJugador => playerId !== cadaJugador.id);

    console.log(players);
    res.send({
        enemigos
    });
});

app.listen(8080, () => {console.log(`Servidor funcionando`);});