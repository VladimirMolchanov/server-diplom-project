const express = require("express");
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const config = require('config')
const chalk = require('chalk')
const cors = require('cors')
const intiDatabase = require('./startUp/initDatabase')
const routes = require('./routes')
const path = require("path");

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(fileUpload());
const corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions))
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/api', routes)
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client')));

    const indexPath = path.join(__dirname, 'client', 'index.html')

    app.get('*', (req, res) =>{
        res.sendFile(indexPath)
    })
}

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
