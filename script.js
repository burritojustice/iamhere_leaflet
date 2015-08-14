var map = L.map('map').setView([51.505, -0.09], 15);
var layer = Tangram.leafletLayer({ scene: 'scene.yaml' });
layer.addTo(map);
var hash = new L.Hash(map);
var marker = L.marker([51.505, -0.09], {
    draggable: false
}).addTo(map);
var lat;
var lng;
map.on('dragend', updateLatLng);
map.on('dragstart', grayText)
//updateLatLng();
map.on('move', recenter);

function recenter(){
  marker.setLatLng(map.getCenter());
  grayText();
}

function updateLatLng(){
    var m = marker.getLatLng();
    m = m.wrap();
    lat = m.lat.toFixed(6);
    lng = m.lng.toFixed(6);
    $('#latlng').text(lat + ', ' + lng);
    findPlace('neighbourhood', '#neighborhood');
    findPlace('region', '#region');
    findPlace('locality', '#locality');
}
var geojson;
var placeID;
function findPlace(placeType, elementID){
  var place;
  //placeID;
  $.getJSON('https://54.148.56.3/?latitude='+lat+'&longitude='+lng+'&placetype='+placeType, function(data){
    geojson = data;
    if (geojson.features.length==1){
      place = geojson.features[0].properties['wof:name'];
    }
    else{
      var placearray = [];
      for(var i = 0; i < geojson.features.length; i++){
        placearray.push(geojson.features[i].properties['wof:name']);
        place = " " + placearray[0] + " or " + placearray[1];
      }
    }

    placeID = geojson.features[0].id;
    var gazeteerLink = 'https://52.27.138.134/id/'+placeID;

    var wofPath = geojson.features[0].properties['wof:path'];
    //drawPolygon(wofPath);
    $(elementID).text(place);
    $(elementID).css('color', 'white');
    $(elementID).wrap('<a href=' + gazeteerLink +'/>');
  })
}

function grayText(elementID){
  $('#neighborhood').css('color', '#939393');
  $('#region').css('color', '#939393');
  $('#locality').css('color', '#939393');
}

/*
var polygon;
function drawPolygon(wofPath){
  $.getJSON('https://52.27.138.134/data/'+wofPath, function(data){
    polygon = data;
    L.geoJson(polygon).addTo(map);
  });

}
*/

document.getElementById('locate').addEventListener('click', function test(){
    map.locate({setView: true, maxZoom: 15});
    map.on('locationfound',updateLatLng);
});
