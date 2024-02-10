const { Pool } = require("pg")
const format = require("pg-format")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true,
})

const prepararHATEOAS = (inventario) => {
    try {
        const stockTotal = inventario.reduce(
            (total, joya) => total + joya.stock,
            0
        )
        const totalJoyas = inventario.length

        const results = inventario.slice(0, 6).map((m) => ({
            nombre: m.nombre,
            href: `/joyas/inventario/${m.id}`,
        }))

        return { totalJoyas, stockTotal, results }
    } catch (error) {
        console.error("Error en prepararHATEOAS:", error.message)
        throw error
    }
};

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    try {
        const [detalle1, detalle2] = order_by.split("_")
        const offset = (page - 1) * limits
        const formattedQuery = format(
            "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
            detalle1,
            detalle2,
            limits,
            offset
        )

        const { rows: inventario } = await pool.query(formattedQuery)
        return inventario
    } catch (error) {
        console.error("Error en obtenerJoyas:", error.message)
        throw error
    }
}

const obtenerJoyasPorFiltros = async ({
    precio_max,
    precio_min,
    categoria,
    metal,
}) => {
    try {
        const filtros = []
        const values = []

        const agregarFiltro = (columna, operador, valor) => {
            if (valor !== undefined) {
                values.push(valor)
                filtros.push(`${columna} ${operador} $${values.length}`)
            }
        }

        agregarFiltro("precio", "<=", precio_max)
        agregarFiltro("precio", ">=", precio_min)
        agregarFiltro("categoria", "=", categoria)
        agregarFiltro("metal", "=", metal)

        let consulta = "SELECT * FROM inventario"

        if (filtros.length > 0) {
            consulta += ` WHERE ${filtros.join(" AND ")}`
        }

        const { rows: inventario } = await pool.query(consulta, values)
        return inventario
    } catch (error) {
        console.error("Error en obtenerJoyasPorFiltros:", error.message)
        throw error
    }
};

const obtenerJoyasId = async (id) => {
    try {
        const consulta = "SELECT * FROM inventario WHERE id = $1"
        const { rows } = await pool.query(consulta, [id])

        if (rows.length === 0) {
            return { error: "Joya no encontrada" }
        }

        const joya = rows[0]
        return joya
    } catch (error) {
        console.error("Error al obtener joya por ID:", error)
        throw error
    }
};

module.exports = {
    obtenerJoyas,
    obtenerJoyasPorFiltros,
    prepararHATEOAS,
    obtenerJoyasId,
}
