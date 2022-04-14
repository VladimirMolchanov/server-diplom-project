const express = require("express");
const mongoose = require("mongoose");
const config = require('config')
const chalk = require('chalk')
const cors = require('cors')
const intiDatabase = require('./startUp/initDatabase')
const routes = require('./routes')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/api', routes)

const PORT = config.get('port') ?? 8080

async function start() {
    try {
        mongoose.connection.once('open', () => {
            intiDatabase()
        })
        await mongoose.connect(config.get('mongoUrl'))
        console.log(chalk.green(`MongoDB connected.`))
        app.listen(PORT, () => {
            console.log(chalk.green(`Server has been started on port ${PORT}...`))
        })
    } catch (e) {
        console.log(chalk.red(e.message))
        process.exit(1)
    }
}

start()
