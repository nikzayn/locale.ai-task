// query insert into table_info (id, name, age) values ($1, $2, $3), ($4, $5, $6)
// values : [1, 'asd', 21, 2, 'dfsd', 32]

const arr = [
    {
        id: 10,
        name: 'asd',
        age: 21
    },
    {
        id: 92,
        name: 'dfsd',
        age: 32
    }
]



function test() {
    for (let i = 0; i < arr.length; i++) {
        let query = {
            text: `INSERT INTO ride_info (id, name, age) VALUES)`,
            values: [`${(arr[i].id)}, ${(arr[i].name)}, ${(arr[i].age)}`]
        }
        console.log(query);
    }
}

test();