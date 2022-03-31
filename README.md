AWS Lambda + API Gateway Functions
============

These API functions are designed for usage in AWS Lambda with API Gateway.

To run the Typescript functions in Lambda, they first have to be compiled into JS.
This can be accomplished for example with tsc using the command:

```
npx tsc --outDir ./build
```

## Setup
Clone this repo to your computer and run `npm install` to install all the dependencies.

---

## Usage
After you clone this repo to your desktop, go to its root directory and run `npm install` to install its dependencies.

Note that opening the html file locally (from localhost) doesn't work as the GET requests get blocked by CORS.
You can either upload the file to a remote server or use an extension such as [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) if you are using Virtual Studio.

To be able to properly use the functions, you also need an AWS account and a MongoDB server you can use.

---

## Features
- Fetch data from a MongoDB either by getting all the data, setting a limit of documents to fetch or by searching for a unique ID.
- Ability to save JSON data that matches the model into the database.

## To-do
- Get the unit testing of getEquipments to work properly
- Add integration testing
- Prettify and improve the html page
