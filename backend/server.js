//Modules
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const csv = require('csv-parser')
const dotenv = require('dotenv');
const { Pool } = require('pg')

//API setup
const upload = multer({ dest: 'uploads' });
const app = express();

//Imported Files
const migration = require('./db/migration');
const dummyData = require('./dummyData');
const sectorWise = require('./sectorWise');
const insertValues = require('./test');

//Port
const port = 8080;

dotenv.config();

let dbConn;

function sqlConnection() {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    });
    dbConn = pool;
}

function creatTable() {
    for (var i = 0; i < migration.length; i++) {
        console.log('Running migrations', i)
        dbConn.query(migration[i], (err, res) => {
            console.log(err, res)
        });
    }
}

function dbSetup() {
    sqlConnection();
    creatTable();
}

dbSetup();




app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//Welcome Page
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the LocaleAPI' });
});


app.get('/parse', (req, res) => {
    res.send({ data: dummyData })
})


//Csv Upload Endpoint
app.post('/upload', upload.single('file'), function (req, res, next) {
    res.send("Csv uploaded");
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            insertValues(results, dbConn);
        });
});



//Seclected Sectors results
app.get('/selectedSectors', (req, res) => {
    //will get the datat from postgres
    let coordsResults;
    dbConn.query(`SELECT MIN(from_lat) as min_from_lat, 
                         MAX(from_lat) as max_from_lat, 
                         MIN(to_lat) as min_to_lat, 
                         MAX(to_lat) as max_to_lat, 
                         MIN(from_long) as min_from_long,
                         MAX(from_long) as max_from_long,
                         MIN(to_long) as min_to_long,
                         MAX(to_long) as max_to_long 
                        FROM ride_info`, (err, result) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(result);
        }

        const xMin = result.rows[0].min_from_lat < result.rows[0].min_to_lat ?
            result.rows[0].min_from_lat :
            result.rows[0].min_to_lat;

        const xMax = result.rows[0].max_from_lat > result.rows[0].max_to_lat ?
            result.rows[0].max_from_lat :
            result.rows[0].max_to_lat;

        const yMin = result.rows[0].min_from_long < result.rows[0].min_to_long ?
            result.rows[0].min_from_long :
            result.rows[0].min_to_long;

        const yMax = result.rows[0].max_from_long > result.rows[0].max_to_long ?
            result.rows[0].max_from_long :
            result.rows[0].max_to_long;


        const divisions = 3;
        const lat = (xMax - xMin) / divisions;
        const long = (yMax - yMin) / divisions;
        const sectors = {};
        let count = 0;
        for (let i = 0; i < divisions; i++) {
            for (let j = 0; j < divisions; j++) {
                sectors['sector ' + count] = {
                    from_lat: xMin + (i *),
                    from_long: "77.55332",
                    to_lat: "12.97143",
                    to_long: "77.63914"
                }

                count++;
            }
        }

        //1. 
    })

    // for (let i = 0; i < coordsResults.length; i++) {
    //     console.log(i);
    // }
});








//Server started
app.listen(port, () => {
    console.log(`Server started on ${port}`)
});