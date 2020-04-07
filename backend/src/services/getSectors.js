
//Get Sectors of particular ride
function getSectors(result, res) {
    let yMin = result.rows[0].min_from_lat < result.rows[0].min_to_lat ?
        result.rows[0].min_from_lat :
        result.rows[0].min_to_lat;

    let yMax = result.rows[0].max_from_lat > result.rows[0].max_to_lat ?
        result.rows[0].max_from_lat :
        result.rows[0].max_to_lat;

    let xMin = result.rows[0].min_from_long < result.rows[0].min_to_long ?
        result.rows[0].min_from_long :
        result.rows[0].min_to_long;

    let xMax = result.rows[0].max_from_long > result.rows[0].max_to_long ?
        result.rows[0].max_from_long :
        result.rows[0].max_to_long;
    yMin -= 1;
    yMax += 1;
    xMin -= 1;
    xMax += 1;

    const divisions = 3;
    const lat = (xMax - xMin) / divisions;
    const long = (yMax - yMin) / divisions;
    const sectors = {};
    let count = 0;
    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            sectors['sector ' + count] = {
                from_lat: yMin + (j * lat),
                from_long: xMin + (i * long),
                to_lat: yMax + (j * lat),
                to_long: xMax + (i * long)
            }

            count++;
        }
    }
    res.send(sectors);
}

module.exports = getSectors;