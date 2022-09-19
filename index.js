console.log(`Hola nodecitooo!!`);

const express = require (`express`);

const app = express();

app.get(`/`, (req, res) => {
    res.send(`Miren este es mi primer servidor creado con node.js y express.js je!`)
})

app.listen(8081, () => {console.log(`Servidor funcionando`)});