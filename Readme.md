# Locale.ai Task
- Goal is to create a application where a user can upload a csv data and get's the map visualization of ride


## Overview
- Design Thoughts
- System Requirements
- Usage Issue
- Usage
- Frontend Issues
- Backend Issues
- Edge Cases


### Design Thoughts
- To design a platform where a user can upload a csv file.
- The csv file is then parsed and then inserted into postgres db.
- After that, my strategy is to fetch the result from db like map rendering and visualization


### System Requirements
- Docker
- Docker Compose


### Usage Issue
First Install manually 
```
npm install
```
in directory ```frontend```, then follow below option

### Usage
```
sudo docker-compose up
```


### Frontend Issues
- UI/UX are not been maintained
- Code Structuring is not well mannered
- Not Mobile Friendly
- Having issues with (zoom-in) in Map


### Backend Issues
- We are inserting values one by one on postgres db
- Uploading takes time, so I should be using here a worker thread or a job
- Pagination is not maintained


### Edge Cases
- Data cleaing on null values of json result
- Filtered the latitude and longitude location points while on returning null values
- Created real time moving rides on map(-- you have to zoom it --)