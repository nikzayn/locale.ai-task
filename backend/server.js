//Modules
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const csv = require('csv-parser')
const dotenv = require('dotenv');
const { Pool, Client } = require('pg')

//API setup
const upload = multer({ dest: 'uploads' });
const app = express();

//Imported Files
const migration = require('./db/migration');
const dummyData = require('./dummyData');
const sectorWise = require('./sectorWise');

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
        // console.log('Running migrations', i)
        dbConn.query(migration[i], (err, res) => {
            // console.log(err, res)
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
            insertValues(results);
        });
});

function insertValues(results) {
    let count = 0;
    while (count < results.length) {
        let query = {
            name: 'rideInfo',
            text: 'INSERT INTO ride_info (id, user_id, vehicle_model_id, package_id, travel_type_id, to_area_id, from_city_id, to_city_id, from_date, to_date, online_booking, mobile_site_booking, booking_created, from_lat, from_long, to_lat, to_long, Car_Cancellation) VALUES ',
            values: []
        }
        const inital = count;
        //Check if initial count is less than 5000 and also less than the results length
        for (let j = inital; j < inital + 5000 && j < results.length; j++) {
            query.text += (`\$${j}`);
            query.values.push(`
            ${results[j].id}, 
            ${results[j].user_id}, 
            ${results[j].vehicle_model_id},
            ${results[j].package_id},
            ${results[j].travel_type_id},
            ${results[j].from_area_id},
            ${results[j].to_area_id},
            ${results[j].from_city_id},
            ${results[j].to_city_id},
            ${results[j].from_date},
            ${results[j].to_date},
            ${results[j].online_booking},
            ${results[j].mobile_site_booking},
            ${results[j].booking_created},
            ${results[j].from_lat},
            ${results[j].from_long},
            ${results[j].to_lat},
            ${results[j].to_long},
            ${results[j].Car_Cancellation}`);
            count++;
        }


        console.log(query);
        // dbConn.query(query, (err, res) => {
        //     if (err) {
        //         console.log(err.stack)
        //     } else {
        //         console.log(res.rows[0])
        //     }
        // })
    }
}





//Seclected Sectors results
app.post('/selectedSectors', (req, res, next) => {
    //will get the datat from postgres
    res.send(sectorWise);
});








//Server started
app.listen(port, () => {
    console.log(`Server started on ${port}`)
});