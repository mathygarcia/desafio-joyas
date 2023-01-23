const { showJoyas, showJoya, filterJoyas, hateoas } = require('../services/joyasServices')
showJoyas, showJoya, filterJoyas, hateoas
const controller = {

    index: (req, res) => {
        res.status(200).
            send('para navegar ingresar en la url joyas')
    },

    show: async (req, res) => {
        try {
            const queryStrings = req.query
            const listado = await showJoyas(queryStrings)
            const HATEOS = await hateoas(listado)
            res.status(200).json(HATEOS)
        }
        catch (e) {
            res.status(500)
                .send(`Ups...${e.message} `)
        }
    },

    showjoya: async (req, res) => {
        try {
            const { id } = req.params
            const joya = await showJoya(id)
            res.status(200).json(joya)

        } catch (e) {
            res.status(500).send(e.message)
        }

    },

    filter: async (req, res) => {
        try {
            const queryStrings = req.query
            const filtrado = await filterJoyas(queryStrings)
            filtrado.length === 0 ? res.status(200)
                .json('lo que buscas no existe, intenta filtrando nuevamente') :
                res.status(200).json(filtrado)
        } catch (e) {
            res.status(500).send(e.message)
        }
    },

    error404NotFound: (req, res) => {
        res.status(404).send('Ruta inexistente')
    }
}

module.exports = controller