import {getWeatherDescription} from "./OpenWeatherApi.js";
import express from 'express';
import Datastore from 'nedb';


// function to update all weather description for all items in the datatable
const updateWeatherDescriptionInDatabase = async () => {
    const locations = ["Vancouver","Toronto", "Ontario", "Ottawa", "California"];
    for (const city of locations) {
        getWeatherDescription(city).then( (weatherDescription) => {
            database.update({location: city}, {$set: {description: weatherDescription}}, { multi: true }, function(err, num) {
            });
        });
    }
}

// Returns all items sorted by date created
const getAllSortedData = () => {
    return database.getAllData().sort((a,b) => {
        return a.createdAt - b.createdAt;
    });
}

//initialize in-memory database
const database = new Datastore('inventoryItems.db');
database.loadDatabase();
database.persistence.setAutocompactionInterval(1);

// initialize web server at port 8000
const app = express();
const port = 8000;
app.use(express.json());

//GET request to retrieve all the data from database
app.get('/items', async (req, res) => {
   updateWeatherDescriptionInDatabase().then( () => {
       res.send(getAllSortedData());
   });
});

// POST request to add new inventory item to database
app.post('/item/add', async (req, res) => {
    let item = req.body;
    const now = new Date();
    const weatherDescription = await getWeatherDescription(item.location);
    item = {...item, description: weatherDescription, createdAt: now};
    database.insert(item);
});

//PUT request to edit an existing item in database
app.put('/item/edit/:itemId', async (req, res) => {
    const item = req.body;
    const weatherDescription = await getWeatherDescription(item.newLocation);
    database.update({_id: item._id}, {
        $set: {
            location: item.newLocation,
            count: item.newCount,
            description: weatherDescription,
            name: item.newProductName
        }
    }, {});
})

//DELETE request to remove an existing item from database
app.delete('/item/delete/:itemId', (req, res) => {
    const item = req.body;
    database.remove({_id: item._id}, {});
})

app.listen(port, () => console.log(`Running and Listening on port ${port}`));
