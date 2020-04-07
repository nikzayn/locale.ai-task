const migartion = [`CREATE TABLE IF NOT EXISTS ride_info (
    id INT,
    user_id INT,
    vehicle_model_id INT,
    package_id INT,
    travel_type_id INT,
    from_area_id INT,
    to_area_id INT,
    from_city_id INT,
    to_city_id INT,
    from_date TIMESTAMP,
    to_date TIMESTAMP,
    online_booking INT,
    mobile_site_booking INT,
    booking_created TIMESTAMP,
    from_lat FLOAT(30),
    from_long FLOAT(30),
    to_lat FLOAT(30),
    to_long FLOAT(30),
    car_cancellation INT
  )`
]

module.exports = migartion;