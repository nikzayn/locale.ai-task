function insertValues(arr, dbConn) {

    let noOfCols = 19;
    const batchSize = 1;
    let noOfRuns = Math.floor(arr.length / batchSize);
    let remainder = arr.length % batchSize;
    if (remainder > 0) {
        noOfRuns += 1;
    }

    for (let i = 0; i < noOfRuns; i++) {
        let query = {
            text: `INSERT INTO ride_info (
                id, 
                user_id, 
                vehicle_model_id, 
                package_id, 
                travel_type_id, 
                from_area_id, 
                to_area_id, 
                from_city_id, 
                to_city_id, 
                from_date, 
                to_date, 
                online_booking, 
                mobile_site_booking, 
                booking_created, 
                from_lat, 
                from_long, 
                to_lat, 
                to_long, 
                Car_Cancellation) 
                VALUES `,
            values: []
        }

        const initialK = batchSize * i;
        let lastNum = ''
        for (let k = initialK; k < initialK + batchSize && k < arr.length; k++) {
            if (k != initialK) {
                query.text += ', '
            }
            query.text += '( '
            for (let j = 1; j <= noOfCols; j++) {
                if (j != 1) {
                    query.text += ', '
                }
                query.text += ('$' + ((k - initialK) * noOfCols + j));
                lastNum = ('$' + ((k - initialK) * noOfCols + j))
            }
            query.text += ' )';
            query.values.push(
                isNaN(arr[k].id) ? null : +arr[k].id,
                isNaN(arr[k].user_id) ? null : +arr[k].user_id,
                isNaN(arr[k].vehicle_model_id) ? null : +arr[k].vehicle_model_id,
                isNaN(arr[k].package_id) ? null : +arr[k].package_id,
                isNaN(arr[k].travel_type_id) ? null : +arr[k].travel_type_id,
                isNaN(arr[k].from_area_id) ? null : +arr[k].from_area_id,
                isNaN(arr[k].to_area_id) ? null : +arr[k].to_area_id,
                isNaN(arr[k].from_city_id) ? null : +arr[k].from_city_id,
                isNaN(arr[k].to_city_id) ? null : +arr[k].to_city_id,
                arr[k].from_date === 'NULL' ? null : new Date(arr[k].from_date),
                arr[k].to_date === 'NULL' ? null : new Date(arr[k].to_date),
                isNaN(arr[k].online_booking) ? null : +arr[k].online_booking,
                isNaN(arr[k].mobile_site_booking) ? null : +arr[k].mobile_site_booking,
                arr[k].booking_created === 'NULL' ? null : new Date(arr[k].booking_created),
                isNaN(arr[k].from_lat) ? null : +arr[k].from_lat,
                isNaN(arr[k].from_long) ? null : +arr[k].from_long,
                isNaN(arr[k].to_lat) ? null : +arr[k].to_lat,
                isNaN(arr[k].to_long) ? null : +arr[k].to_long,
                isNaN(arr[k].Car_Cancellation) ? null : +arr[k].Car_Cancellation
            )
        }

        dbConn.query(query, (err, res) => {
            if (err) {
                console.log(query.values.slice(0, 19), i, lastNum, query.values.length, err.stack)
            } else {
                console.log(i, arr.length, res)
            }
        })
    }
}

module.exports = insertValues;