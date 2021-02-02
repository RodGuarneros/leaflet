// // Store our API endpoint inside queryUrl
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Defining the sector in the map
let map = L.map('map').setView([37.974239753256256, -120.24794341192406], 4);

// Defining the basic layer from mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(map);

// Creating a function to transform the variable magnitude in radius attribute, so as to be visible (monotonal transfomation)
function circleSize(magnitud) {
    return +magnitud*25000;
  }

// A function to select color based on magnitude variable as input (mag)
function selectColor(impact){
        //conditional for colors applied to each feature          
            let color = "";    

            if(impact >= 5){
                color = 'darkred'
            }else if(impact >= 4){
                color = 'red'
            }else if(impact >= 3){
                color = '#FFA500'
            }else if(impact >= 2){
                color = 'lightyellow'
            }else if(impact >= 1){
                color = 'yellow'
            }else{
                color = 'green'
            }
            return color
        }
        // Creating the legend at the bottomright 
        let legend = L.control({position: 'bottomright'});
        // function of the legend 
        legend.onAdd = function (map){
            let div = L.DomUtil.create('div', 'info legend');
        //preparing the header of the legend
            labels = ['<strong>Richter<br>Magnitude<hr></stron>'],
        // Defining the categories based on the Color ranges
            beans = ['0-1','1-2','2-3','3-4','4-5','5+'];
        // values to guarantee the right colors
            color_beans = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];
        // HTML setting colors
            for (var i = 0; i < beans.length; i++) {
                    div.innerHTML += 
                    labels.push(
                        '<i class="circle" style="background:' + selectColor(color_beans[i]) + '"></i> ' +
                    (beans[i] ? beans[i] : '+'));
                 
                }
            // Creating a div so as to add the legend 
            div.innerHTML = labels.join('<br>');
            return div;
        };
        // adding the legend to the map
        legend.addTo(map);

// Perform a GET request to the query URL
// Gathering the dataset
d3.json(queryUrl)
    .then(data =>{
        console.log(data)
        data.features.forEach(d =>{
        
            // gathering manitude of earthquaques and transform in integer
            let magnitude = +d.properties.mag

            L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]],{
                fillOpacity: 0.7,
                color: "black",
                weight: 0.4,
                fillColor: selectColor(magnitude),
                radius: circleSize(magnitude)
            })  
            .bindPopup(`<h3>${d.properties.place}</h3> <hr> <h3>Points: ${d.properties.mag}</h3> <hr><p>${Date(d.properties.time)}</p>`)
            .addTo(map)
        })
});
