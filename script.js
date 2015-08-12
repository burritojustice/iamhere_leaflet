var map = L.map('map').setView([51.505, -0.09], 17);
var layer = Tangram.leafletLayer({ scene: 'https://raw.githubusercontent.com/tangrams/simple-demo/gh-pages/scene.yaml' });
layer.addTo(map);

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

var geojson;

function updateLatLng(){
    var m = marker.getLatLng();
    var latParam = m.lat.toFixed(6);
    var lngParam = m.lng.toFixed(6);
    latlng.innerHTML = latParam + ', ' + lngParam;
    $.getJSON('https://54.148.56.3/?latitude='+latParam+'&longitude='+lngParam+'&placetype=neighbourhood', function(data){
      geojson = data;
      $('#stuff').text(geojson.features[0].properties['wof:name']);
    })
    //$('#stuff').text(geojson.features[0].properties['wof:name']);
}

document.getElementById('locate').addEventListener('click', function test(){
    map.locate({setView: true, maxZoom: 17});
    map.on('locationfound',updateLatLng);
});
