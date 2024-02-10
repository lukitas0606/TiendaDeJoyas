const reportarConsulta = async (req, _, next) => {
    const queryString = req.query
    const url = req.url
    if (Object.keys(queryString).length === 0) {
        console.log("no se hizo ninguna consulta")
    } else {
        console.log(
            `Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con la siguiente consulta:`,
            queryString
        )
    }
    next()
}

const reportarParametros = async (req, _, next) => {
    const parametros = req.params
    const url = req.url
    console.log(
        `
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con los parámetros:
    `,
        parametros
    )
    next()
}

module.exports = { reportarConsulta, reportarParametros }
