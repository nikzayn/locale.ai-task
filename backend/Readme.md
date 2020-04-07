# Backend Task
- Task is to create this API and save the data into PostgreSQL.

## Let's subdivide the problem:
- Features
- Assumptions
- Technologies

### Features
- Updating the data into the db
- Fetching the data values from db
- Initialize the docker setup

### Issues
- Node postgres have issues with multiple inserts.
- We have created a batch which insert data in db in a parameterized way
- Though, library does not support the batch size of multiple insert, so couldn't able to achieve the multiple task insertion 

### Technologies
- Express
- NodeJS
- csv-parser
- postgres(node-postgres)
- nodemon
- multer


