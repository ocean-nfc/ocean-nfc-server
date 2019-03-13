# Ocean NFC Server (Group 14)

## Running the server
### Required techonologies:
- Nodejs
- Npm

### Steps to run
1. npm install
2. npm run start

## API Documentation

|Method, URL|Parameters|Response|Example Request|Example Response|
|---|---|---|---|---|
| GET /get-client-id | ```{   cardId: string }``` 	| ```{error?: boolean;   message?: "CLIENT_NOT_FOUND" \| "AUTH_EXCEPTION";   userId: string; }``` 	| GET /get-client-id ?cardId=9fw341 	|  __Success:__<br />```{   error: false,   clientId: "1234" }```<br/><br/>__Failure:__<br /> ```{    error: true,   message: "CLIENT_NOT_FOUND", }```
| GET /get-log | ```{ startDate: UTC Timestamp = 24 hours ago; endDate: UTC Timestamp = now}``` | ```{requestsLog: Array<{ time: Date; parameters: any; ip: any; url: string; method: string; headers: any; }>}``` | GET /get-log?startDate=1552465072989&endDate=1552378771124 | ```{requestsLog: [], }```

## Group Members

### Matthew Evans - 16262949
### Jarrod Goschen - 17112631
### Johan Nel	- 16354029
### Given Rakgoale - 15135421
### Dewald van Hoven - 15030378