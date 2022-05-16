import {getInventoryItemColumns} from "./InventoryItemInterface";

//create a GET request to retrieve all data
export async function fetchItemsFromDatabase() {
    return fetch('/items').then((request) => {
        if (request.status !== 200) {
            throw Error("Unable to fetch data from database");
        }
        return request.json()
    }).then((jsonResponse) => {
        return jsonResponse;
    });
}

//pass down a created inventory item to saveDataToDatabase
export async function addInventoryItemToDatabase(name, count, location) {
    const newInventoryItem = {
        name: name,
        location: location,
        count: count,
    }
    await saveDataToDatabase(newInventoryItem);
}

//create a POST request to pass to server-side to process and add to database
export async function saveDataToDatabase(data) {
    await fetch('/item/add',
        {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
}

//create a PUT request to server-side to process data
export async function editDataFromDatabase(inventoryItem, newProductName, newCount, newLocation) {
    const updatedQuery = {
        ...inventoryItem,
        newProductName: newProductName,
        newCount: newCount,
        newLocation: newLocation,
    };

    fetch('/item/edit/' + new URLSearchParams({
        itemId: inventoryItem._id
    }),
        {
            body: JSON.stringify(updatedQuery),
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
}

//create a DELETE request to server-side to remove data in database
export async function deleteDataFromDatabase(inventoryItem) {
    await fetch('item/delete/' + new URLSearchParams({
        itemId: inventoryItem._id
    }), {
        body: JSON.stringify(inventoryItem),
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

//exports all inventory items into CSV format
export async function exportDataToCsv() {
    let exportedData = getInventoryItemColumns();
    return (fetchItemsFromDatabase()).then((dataArray) => {
        let csvFormat = '';
        let columnLine = '';
        // create line for columns
        for (const columnFields of getInventoryItemColumns()) {
            columnLine += columnFields + ',';
        }
        csvFormat += columnLine + "\r\n";
        // create line for every row in the database
        for (let i = 0; i < dataArray.length; i++) {
            let line = '';
            for (const index in dataArray[i]) {
                if (exportedData.includes(index)) {
                    if (line !== '') {
                        line += ','
                    }
                    line += dataArray[i][index];
                }
            }
            csvFormat += line + "\r\n";
        }
        //creating a DOM element with 'a' attribute to download blob data to CSV
        let csvMetaData = new Blob([csvFormat], {type: 'text/csv'});
        let url = window.URL.createObjectURL(csvMetaData);
        let a = document.createElement('a');
        a.download = "Shopify Item Inventory";
        a.setAttribute('href', url);
        a.click();
    })
}


