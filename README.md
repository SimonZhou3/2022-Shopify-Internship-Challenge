# Shopify Internship Fall 2022 Production Engineer Challenge


This is my submission for the 2022 Production Engineer internship coding challenge.

The technology used and will be required to be installed to build the code:

- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)

After Node.js has been installed, follow these steps:
1. On your terminal, run ` git clone https://github.com/SimonZhou3/2022-shopify-intern-challenge.git`
2. You will need to run 2 different terminal processes to initialize the client-side (React) and server-side (Express)
3. We would need to inject the [open weather API key](https://openweathermap.org/) onto the project for it to fully run. navigate to `cd shopifyapp/server` and create a file `.env` where the contents are:
> OPEN_WEATHER_API_KEY= ***************
4. on the same directory `shopifyapp/server` run `npm install` to install all dependencies
5. To start Express, run `npm start` on the current directory
6. On the second terminal, navigate to `cd shopifyapp/client`and install all the dependencies by running `npm install`
7. To start React (for client-side), run `npm start` on the current directory
8. If React did not automatically open the web application, then on any browser, navigate to: `localhost:3000`

### For Replit:
1. Go to the replit link!
2. I have already inserted the API KEY on the replit however, if this is not the case, then on the side tab of replit, navigate to the secrets tab and add the key:
 > Key: OPEN_WEATHER_API_KEY
 > Value:***************
3. On the bottom right of replit, go to the shell tab and navigate to the server file by entering `cd server`
4. Install the dependencies by entering `npm install`
5. To run the backend, enter `npm start`
6. Navigate to the console tab , enter  `cd client` to navigate to the client code.
7. Install the dependencies by entering `npm install`
8. To run the frontend, enter `npm start`
9. At this time, a virtual browser will pop up. If the browser does not automatically redirect you to the frontend, then maunally access to `localhost:3000`

## Usage

- This is a web application that features an in-memory database that allows users to view inventory items.
- Users can create inventory items
- Users can update specific inventory items
- Users can delete specific inventory items
- Users can export the inventory item into a .csv file
