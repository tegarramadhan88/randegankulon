//Menambahkan Peta kedalam Web
var map = L.map("map", {
  minZoom: 9,
  maxZoom: 22,
  zoomControl: false,
}).setView([-6.65338, 108.23626], 15);

//Menambahkan skala ke dalam peta
L.control.scale("metric").addTo(map);

//Menampilkan koordinat
L.control.mouseCoordinate({ gpsLong: false, gps: true }).addTo(map);

//Menampilkan Zoom Level
L.control.zoomLabel().addTo(map);

//Menambahkan Zoom Bar
var zoom_bar = new L.Control.ZoomBar({ position: "topleft" }).addTo(map);

//Menambahkan Measure Tools
L.control
  .measure({
    position: "topleft",
    primaryLengthUnit: "meters",
    secondaryLengthUnit: "kilometers",
    primaryAreaUnit: "sqmeters",
    secondaryAreaUnit: "hectares",
  })
  .addTo(map);

//Menambahkan leaflet locate control
/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control
  .locate({
    position: "topleft",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: false,
    markerStyle: {
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8,
    },
    circleStyle: {
      weight: 0,
      fillColor: "white",
      clickable: false,
    },
    icon: "fa fa-location-arrow",
    metric: false,
    strings: {
      title: "My location",
      popup: "You are within {distance} {unit} from this point",
      outsideMapBoundsMsg: "You seem located outside the boundaries of the map",
    },
    locateOptions: {
      maxZoom: 18,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    },
  })
  .addTo(map);

//Menambahkan Geocoder
L.Control.geocoder({position :"topleft"}).addTo(map);

//Menambahkan batas peta
var southWest = L.latLng(-8.349, 104.759),
  northEast = L.latLng(-6.094, 114.928),
  mybounds = L.latLngBounds(southWest, northEast);

//menambahkan basemap mapbox satelite
var mapboxLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVnYXJyYW1hZGhhbiIsImEiOiJja2ZyZnJydXkwMnltMnFtbnR1eGszN3BuIn0.N1fpMhn2i5vKyBEqe6c0ag",
  {
    attribution:
      'Map data &copy; Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    bounds: mybounds,
    id: "mapbox/satellite-streets-v11",
    style: "mapbox://styles/tegarramadhan/ckfr7t8tf0wvt1ammek6fzfmy",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoidGVnYXJyYW1hZGhhbiIsImEiOiJja2ZyZnJydXkwMnltMnFtbnR1eGszN3BuIn0.N1fpMhn2i5vKyBEqe6c0ag",
  }
).addTo(map);

//menambahkan foto udara
var raster = new L.LayerGroup(); 

var mytile =L.tileLayer('assets/citra/{z}/{x}/{y}.png', { 
        maxZoom: 22, 
        tms: false, 
      }).addTo(raster); 

// Menambahkan basemap google road
var GoogleMaps = new L.TileLayer(
  "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    opacity: 1.0,
    attribution: '<a href="https://maps.google.com/">Google Maps</a>',
    maxZoom: 20,
  }
);

//menambahkan layer WFS Geojson Sungai
var styleSungai = {
  color: "#006eff",
  weight: 1,
  opacity: 1,
};

var sungai_url =
  "assets/data/sungai_utama.geojson";

map.createPane("sungai");
map.getPane("sungai").style.zIndex = 401;
var sungaiLayer = L.geoJson(null, {
  onEachFeature: function (f, l) {
    l.bindPopup(f.properties.NAMA);
  },
  style: styleSungai,
  pane: "sungai",
});
$.getJSON(sungai_url, function (data) {
  sungaiLayer.addData(data);
  sungaiLayer.addTo(map);
});

//menambahkan layer WFS Geojson 25 DAS
var styleDesa = {
  fillColor: "#efe4be",
  color: "#ff7f7f",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.4,
};

var randegankulon_url =
  "assets/data/randegankulon.geojson";

map.createPane("randegankulon");
map.getPane("randegankulon").style.zIndex = 400;
var randegankulonLayer = L.geoJson(null, {
  onEachFeature: function (f, l) {
    var popupContent1 =
      '<table>\
                      <tr>\
                          <th scope="row">Daerah Aliran Sungai</th>\
                          <td> : <td>\
                          <td>' +
      f.properties.NAMA_DAS +
      '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Wilayah Sungai</th>\
                          <td> : <td>\
                          <td>' +
      f.properties.WS +
      "</td>\
                      </tr>\
                  </table>";

    l.bindPopup(popupContent1, { maxWidth: 400 }).openPopup();
  },
  style: styleDesa,
  pane: "randegankulon",
});
$.getJSON(randegankulon_url, function (data) {
  randegankulonLayer.addData(data);
  randegankulonLayer.addTo(map);
});

//Menambahkan basemap layer
var baseLayers = {
    'Foto Udara': raster,
    'Imagery': mapboxLayer,
    'Google Maps': GoogleMaps,
};

//menambahakn legenda
L.control
  .groupedLayers(baseLayers, { collapsed: true })
  .addTo(map);

const legend = L.control.Legend({ 
            position: "topright",
            title: 'Legenda',
            collapsed: true, 
            symbolWidth: 24, 
            opacity: 1, 
            column: 1, 
            legends: [{ 
                label: "Sungai", 
                type: "image", 
                url: "../assets/legend/sungai.png",
                layers: sungaiLayer 
            },{ 
                label: "Potensi Desa", 
                type: "image", 
                url: "../assets/legend/das.png",
                layers: randegankulonLayer
            }] 
        }) 
        .addTo(map);

//menambahkan tombol fullscreen
map.addControl(new L.Control.Fullscreen({position: "topright"}));
