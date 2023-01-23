const express = require('express')
const indexController = require('../controllers/indexController')
const reportarConsulta = require("../middlewares/middleware")
const app = express()

app.get('/joyas',reportarConsulta, indexController.show)
app.get('/joya/:id',reportarConsulta, indexController.showjoya)
app.get('/joyas/filtros',reportarConsulta, indexController.filter)
app.get('*',reportarConsulta, indexController.error404NotFound)

module.exports = app