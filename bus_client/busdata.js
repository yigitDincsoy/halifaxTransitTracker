let routesAddedToList = false;
let arr_markers = [];
let arr_routemarkers = [];
let arr_additions = [];
let busdata = {};
let limitedObject = {};
let icon_dynamic;
let selectedBusId;


function geoJSONCreator(lat, long, icon, rot) { //convert the initial JSON data to GeoJSON format
    return geoObj = {
        "type": "Feature",
        "properties": {
            "icon": icon,
            "rotation": rot
        },
        "geometry": {
            "type": "Point",
            "coordinates": [long, lat]
        }
        
    }
}


function deletePrevious() { //Deletes all previous data


    for (let i = 0; i < arr_markers.length; i++) {
        map.removeLayer(arr_markers[i]);
    }

    for (let i = 0; i < arr_routemarkers.length; i++) {
        map.removeLayer(arr_routemarkers[i]);
    }

}

function createMarkers(busDataToCreate) { //Adds a marker on the map for each bus
    
    for (let i = 0; i < busDataToCreate.length; i++) {
        const currentX = Number(busDataToCreate[i].vehicle.position.latitude);
        const currentY = Number(busDataToCreate[i].vehicle.position.longitude);
       
        let rotation = 0;
            if (busDataToCreate[i].vehicle.position.bearing != undefined) {
                rotation = busDataToCreate[i].vehicle.position.bearing ;
            }

        let specificDirection = `Main Route` 
            if (busDataToCreate[i].vehicle.trip.directionId == 1) {
                specificDirection = `Secondary Route`
            }

        dynamicIcon(selectedBusId)

        //method 1: use the legacy way to create the bus icons
        arr_markers[i] = L.marker([currentX, currentY], {icon: icon_rotatingbus, rotationAngle: rotation}).addTo(map); 
    
        
      
    }


}

function busRender() { //Get JSON data & call other functions
    //Get the required JSON Data from NSCC API
    fetch('http://backend.yigitdincsoy.com/')
    .then(function(response){
        return response.json();
    })
    .then(function(json){

        //Delete any leftover markers before starting
        deletePrevious();

        //Create a `limited object` that only includes the route ids
        limitedObject = json.entity.map(x =>({routeId: x.vehicle.trip.routeId}));
       
        const myData_id = document.getElementById("busoptions");
        const myData_value = myData_id.value;
        selectedBusId = myData_value;
        selectedBusData = json.entity.filter(x=>x.vehicle.trip.routeId === myData_value);
       
        createMarkers(selectedBusData);
        
        if (!routesAddedToList) {
        listRoutes(); }
    })

    setTimeout(busRender,2000);
}

function listRoutes() { //Dynamicially populates the selection list of buses
    routesAddedToList = true;
    const whatToAddArray = [];

    for (let i = 0; i < limitedObject.length; i++) {
        if (whatToAddArray.includes(limitedObject[i][`routeId`]) === false) 
        {
            whatToAddArray.push(limitedObject[i][`routeId`]);
        }
    }

    whatToAddArray.sort();
    
    for (let i = 0; i < whatToAddArray.length; i++) {
        const selectBox = document.getElementById('busoptions');
        const option = document.createElement('option');   
        let whatToAdd = whatToAddArray[i];
        option.value = whatToAdd;
        option.innerHTML = whatToAdd;
        selectBox.appendChild(option);  
    }




}

function dynamicIcon(busNo) { //Dynamicially creates images for buses
    const c = document.getElementById("myCanvas");
    let ctx2 = c.getContext("2d");
    ctx2.beginPath();
    ctx2.fillStyle = 'rgba(225,225,225,0.84)';
    ctx2.fillRect(0,0, 128, 128);
    ctx2.lineWidth = "1";
    ctx2.rect(0, 0, 64, 64);
    ctx2.textAlign = "center";
    ctx2.fillStyle = "black";
    ctx2.font = "24px Calibri";
    ctx2.fillText(busNo, 32, 35);
    ctx2.font = "16px Calibri";
    ctx2.fillStyle = "black";
    ctx2.fillText("BUS", 32, 50)
    ctx2.fillStyle = "green";
    ctx2.fillText("█", 32, 70)
    ctx2.fillStyle = "red";
    ctx2.stroke();
    const canvas2 = document.getElementById('myCanvas');
    const img2 = canvas2.toDataURL('image/png');
   
    icon_dynamic = L.icon({
        iconUrl: img2,
        iconSize: [60, 60],
        iconAnchor: [14, 40],
    
    });

    ctx2.reset();


}

busRender();

//


/*

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: myFunction
}).addTo(map);
*/