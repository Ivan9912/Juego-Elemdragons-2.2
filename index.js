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
};

class Dragon {
    constructor(name) {
        this.name = name
    }
}

app.get(`/unirse`, (req, res) => {
    const id = `${Math.random()}`;

    const jugador = new Player(id);
    players.push(jugador);

   
    res.send(id);
})

app.post (`/dragons/:playerIds`, (req, res) => {
    const playerId = req.params.playerIds || ``;
    const nameDragon = req.body.dragon1 || ``;
    const creatDragon = new Dragon(nameDragon);
    const playerIndice = players.findIndex(playerIndex => playerId === playerIndex.id);

    if (playerIndice >= 0) {
        players[playerIndice].asignarDragon(creatDragon);
    }
    console.log(players);
    res.end();
});

app.listen(8080, () => {console.log(`Servidor funcionando`);});