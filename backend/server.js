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
const migration = require('./src/models/migration');
const insertValues = require('./src/services/insertValues');
const getSectors = require('./src/services/getSectors');

//Port
const port = 8080;

//Variables value
dotenv.config();
let dbConn;
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//Postgres Connection
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


//Create Table method
function creatTable() {
    for (var i = 0; i < migration.length; i++) {
        console.log('Running migrations', i)
        dbConn.query(migration[i], (err, res) => {
            // console.log(err, res)
        });
    }
}

//DB Setup
function dbSetup() {
    sqlConnection();
    creatTable();
}

dbSetup();

function getRides(sector, res) {
    let query = {
        text: `SELECT * FROM ride_info 
        WHERE
            (  from_lat >= $1 AND 
               from_lat <= $2 AND 
               from_long >= $3 AND 
               from_long <= $4 AND 
               from_lat IS NOT NULL AND
            from_long IS NOT NULL AND
            to_lat IS NOT NULL AND
            to_long IS NOT NULL
            )
            OR
            (   to_lat >= $1 AND 
                to_lat <= $2 AND 
                to_long >= $3 AND 
                to_long <= $4 AND
                from_lat IS NOT NULL AND
            from_long IS NOT NULL AND
            to_lat IS NOT NULL AND
            to_long IS NOT NULL
            )
        LIMIT 100`,
        values: [sector.from_lat, sector.to_lat, sector.from_long, sector.to_long]
    }


    dbConn.query(query, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.send([]);
            return
        }
        res.send(result.rows);
    })
}


/*******************API Ecosystem*******************/

//Welcome Page
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the LocaleAPI' });
});


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
app.get('/sectors', (req, res) => {
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
            console.log(err.stack);
            return;
        }
        getSectors(result, res);
    })
});




app.post('/rides', (req, res) => {
    getRides(req.body, res);
});


//Server started
app.listen(port, () => {
    console.log(`Server started on ${port}`)
});

