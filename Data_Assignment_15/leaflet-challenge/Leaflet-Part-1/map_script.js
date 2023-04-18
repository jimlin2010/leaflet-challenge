var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log("data: ", data.features);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    const MAX_RADIUS = 200000;
    function determineRadius(magnitude) {
        return MAX_RADIUS * magnitude / 10;
    }
    function determineColor(depth) {
        if (depth <= 10) {
            return "#8FF732"
        } else if (depth <= 30) {
            return "#D4F534"
        } else if (depth <= 50) {
            return "#F8D835"
        } else if (depth <= 70) {
            return "#FFB039"
        } else if (depth <= 90) {
            return "#FF9A5A"
        } else {
            return "#FF545E"
        }
    }
    
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

//   var earthquakes = L.geoJSON(circleFeature);

//   var earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

  // create a layer group to collect the circles
  var circleLayer = L.layerGroup();

  // create and add circles to the layer group
  earthquakeData.forEach(function(element, index){
    const lat = element.geometry.coordinates[1];
    const lng = element.geometry.coordinates[0];
    const dept = element.geometry.coordinates[2];
    const mag = element.properties.mag;
    const color = determineColor(dept);
    const radius = determineRadius(mag);
    var circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius,
    });
    circle.bindPopup(`LAT: ${lat}, LNG: ${lng}, DEPT: ${dept}, MAG: ${mag}`);
    circleLayer.addLayer(circle);
    // console.log("test: ", lat, lng, dept)
  });

//   circleLayer.addLayer(circle);
//   circleLayer.addLayer(circle1);
  createMap(circleLayer);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var earthquakesMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(earthquakesMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<div style="background: #FF0000"></div> Red<br>';
        return div;
    }
    legend.addTo(earthquakesMap);
  
  }

