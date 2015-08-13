var map = L.map('map').setView([51.505, -0.09], 17);
var layer = Tangram.leafletLayer({ scene: 'https://raw.githubusercontent.com/tangrams/simple-demo/gh-pages/scene.yaml' });
layer.addTo(map);
var hash = new L.Hash(map);
var latlng = document.getElementById('latlng');
// $('#latlng')

var marker = L.marker([51.505, -0.09], {
    draggable: false
}).addTo(map);

//map.locate({setView: true, maxZoom: 16});

//updateLatLng();

map.on('move', recenter);
function recenter(){
  marker.setLatLng(map.getCenter());
}

map.on('dragend', updateLatLng);
map.on('dragstart', function gray(){
  $('#place').css('color', '#939393');
})

var geojson;
var neighborhood;
var locality;

function updateLatLng(){
    var m = marker.getLatLng();
    var latParam = m.lat.toFixed(6);
    var lngParam = m.lng.toFixed(6);
    latlng.innerHTML = latParam + ', ' + lngParam;
    findNeighborhood(latParam, lngParam);
}

function findNeighborhood(lat, lng){
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=neighbourhood', function(data){
    geojson = data;

    if (geojson.features.length==1){
      neighborhood = geojson.features[0].properties['wof:name'];
    }
    else{
      neighborhood = [];
      for(var i = 0; i < geojson.features.length; i++){
        neighborhood.push(geojson.features[i].properties['wof:name']);
      }
    }
    $('#place').text(neighborhood);
    $('#place').css('color', 'white');
  })
}


document.getElementById('locate').addEventListener('click', function test(){
    map.locate({setView: true, maxZoom: 17});
    map.on('locationfound',updateLatLng);
});
