console.log(`Hola nodecitooo!!`);

const express = require (`express`);

const app = express();

const players = [];

class Player {
    constructor(id) {
        this.id = id
    }
}

app.get(`/unirse`, (req, res) => {
    const id = `${Math.random()}`;

    const jugador = new Player(id);
    players.push(jugador)

    res.setHeader(`Access-Control-Allow-Origin`, `*`)
    res.send(`El jugador N° ${id} se loggeo.`)
})

app.listen(8080, () => {console.log(`Servidor funcionando`)});