// Creating map object
////var map = L.map("map", {
////  center: [40.7128, -74.0059],
////  zoom: 11
////});

// Adding tile layer
////L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
////  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
////  maxZoom: 18,
////  id: "mapbox.streets",
////  accessToken: API_KEY
////}).addTo(map);

////var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
////"35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";

// Grabbing our GeoJSON data..
///d3.json(link, function(data) {
//// Creating a GeoJSON layer with the retrieved data

// URL LINKS
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson

var equakeMapLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var masterMapUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(equakeMapLink, function(data) {
  setMapFeatures(data.features);
});

function setMapFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<b>" + feature.properties.title + "</b><hr>" +
      "<h2>Geographic Location:</h2>" +
      "<h3>" + feature.properties.place +
      "</h3><hr><p><b>Date and Time of Occurence</b></p>" +  
      "<p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p><h2>Magnitude: " + feature.properties.mag + "</h2></p>");
  }

  var equakeInformation = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  //MAKE THE MAP
  createMap(equakeInformation);
  
}

function createMap(equakeInformation) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token={accessToken}",
    {
      accessToken: API_KEY,
      maxZoom: 18
    }
    );
  var baseMaps = {
    "Street Map": streetmap
  };


  var overlayMaps = {
    Earthquakes: equakeInformation
  };

  var myMap = L.map("map", {
    center: [
      40.08, -97.68
    ],
    zoom: 4.5,
    layers: [streetmap, equakeInformation]
  });

/// https://leafletjs.com/examples/choropleth/
// function getColor(d) {
//   return d > 1000 ? '#800026' :
//          d > 500  ? '#BD0026' :
//          d > 200  ? '#E31A1C' :
//          d > 100  ? '#FC4E2A' :
//          d > 50   ? '#FD8D3C' :
//          d > 20   ? '#FEB24C' :
//          d > 10   ? '#FED976' :
//                     '#FFEDA0';
// }
  function getColor(d) {
      return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(255,225,225)' :
            d < 3  ? 'rgb(255,195,195)' :
            d < 4  ? 'rgb(255,165,165)' :
            d < 5  ? 'rgb(255,135,135)' :
            d < 6  ? 'rgb(255,105,105)' :
            d < 7  ? 'rgb(255,75,75)' :
            d < 8  ? 'rgb(255,45,45)' :
            d < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
  }

// LEGEND INFO ---->
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='<b>Earthquake Magnitude</b><hr><ul>'
  
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<li><i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&nbsp; to &nbsp;' + grades[i + 1] + '</li>' : ' and Greater</ul><br><hr><br><br><br><br>');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}
