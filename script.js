var map = L.map('map').setView([51.505, -0.09], 17);
var layer = Tangram.leafletLayer({ scene: 'scene.yaml' });
layer.addTo(map);
var hash = new L.Hash(map);
var marker = L.marker([51.505, -0.09], {
    draggable: false
}).addTo(map);

updateLatLng();

map.on('move', recenter);
function recenter(){
  marker.setLatLng(map.getCenter());
}

map.on('dragend', updateLatLng);
map.on('dragstart', function gray(){
  $('#place').css('color', '#939393');
  $('#display').hide();
})

var lat;
var lng;

function updateLatLng(){
    var m = marker.getLatLng();
    lat = m.lat.toFixed(6);
    lng = m.lng.toFixed(6);
    $('#latlng').text(lat + ', ' + lng);
    findNeighborhood();
}

function findNeighborhood(){
  var neighborhood;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=neighbourhood', function(data){
    var geojson = data;

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

document.getElementById('locality').addEventListener('click', function(){
  var locality;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=locality', function(data){
    var geojson = data;
    locality = geojson.features[0].properties['wof:name'];
    $('#display').text(locality);
    $('#display').show();
  })
});
