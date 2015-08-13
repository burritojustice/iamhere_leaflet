var map = L.map('map').setView([51.505, -0.09], 17);
var layer = Tangram.leafletLayer({ scene: 'scene.yaml' });
layer.addTo(map);
var hash = new L.Hash(map);
var marker = L.marker([51.505, -0.09], {
    draggable: false
}).addTo(map);
map.on('dragend', updateLatLng);
map.on('dragstart', function gray(){
  $('#neighborhood').css('color', '#939393');
  $('#region').css('color', '#939393');
  $('#locality').css('color', '#939393');
})
updateLatLng();
map.on('move', recenter);

//recenter();
function recenter(){
  marker.setLatLng(map.getCenter());
  updateLatLng();
  $('#neighborhood').css('color', '#939393');
  $('#region').css('color', '#939393');
  $('#locality').css('color', '#939393');
}

var lat;
var lng;

function updateLatLng(){
    var m = marker.getLatLng();
    m = m.wrap();
    lat = m.lat.toFixed(6);
    lng = m.lng.toFixed(6);
    $('#latlng').text(lat + ', ' + lng);
    findNeighborhood();
    findLocality();
    findRegion();
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
    $('#neighborhood').text(neighborhood);
    $('#neighborhood').css('color', 'white');
  })
}

function findLocality(){
  var locality;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=locality', function(data){
    var geojson = data;
    locality = geojson.features[0].properties['wof:name'];
    $('#locality').text(locality);
    $('#locality').css('color', 'white');
  })
}

var geojson;
function findRegion(){
  var locality;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=region', function(data){
    geojson = data;
    region = geojson.features[0].properties['wof:name'];
    $('#region').text(region);
    $('#region').css('color', 'white');
  })
}

document.getElementById('locate').addEventListener('click', function test(){
    map.locate({setView: true, maxZoom: 17});
    map.on('locationfound',updateLatLng);
});

/*document.getElementById('locality').addEventListener('click', function(){
  var locality;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype=locality', function(data){
    var geojson = data;
    locality = geojson.features[0].properties['wof:name'];
    $('#display').text(locality);
    $('#display').show();
  })
});
*/
