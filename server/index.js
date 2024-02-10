const express = require("express")
const {
    obtenerJoyas,
    prepararHATEOAS,
    obtenerJoyasPorFiltros,
    obtenerJoyasId,
} = require("../utils/consultas.js")
const {
    reportarConsulta,
    reportarParametros,
} = require("../middlewares/middleware.js")
const app = express()

app.use(express.json())

app.get("/joyas", reportarConsulta, async (req, res) => {
    const data = await obtenerJoyas(req.query)
    const HATEOAS = prepararHATEOAS(data)
    res.json(HATEOAS)
})

app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
    const HATEOAS = await obtenerJoyasPorFiltros(req.query)
    res.status(200).json(HATEOAS)
})

app.get("/joyas/inventario/:id", reportarParametros, async (req, res) => {
    const joya = await obtenerJoyasId(req.params.id)
    res.json(joya)
})

app.get("*", (_, res) => {
    res.status(404).send("Esta ruta no existe")
});

app.listen(3000, () => console.log("Servidor encendido"))
