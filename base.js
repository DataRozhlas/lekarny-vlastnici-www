var map;

var colors = {"nezávislá": "#999999", "Agel": "#80b1d3", "BENU": "#b3de69", "Devětsil JST": "#bebada", "Plzeňská lékárna": "#fdb462", "Dr.Max": "#fb8072"};

var style = function (retezec) {

  var stls = [{
      "id": "back",
      "interactive": true,
      "type": "raster",
      "source": "back"
     }];

  if (retezec == "any") {
    for (var retezec in colors) {
      stls.push({
      "id": retezec,
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["==", "znacka_2015", retezec],
        ],
      "paint": {
        "circle-color": colors[retezec],
        "circle-radius": 4,
        "circle-opacity": 0.8
    }
    });
    }
  } else {
     stls.push({
      "id": retezec + "_zmen",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["==", "znacka_2015", retezec],
        ["==", "zmena", "n"]
        ],
      "paint": {
        "circle-color": "#2c7bb6",
        "circle-radius": 4,
        "circle-opacity": 0.8
    }
    })
     stls.push({
      "id": retezec,
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["==", "znacka_2015", retezec],
        ["==", "zmena", "y"]
        ],
      "paint": {
        "circle-color": "#d7191c",
        "circle-radius": 4,
        "circle-opacity": 0.8
    }
    })
  };

  stls.push( {
      "id": "mistopis",
      "interactive": true,
      "type": "raster",
      "source": "mistopis"
     });

  var style = {}
  style.version = 8;
  style.sources = {}
  style.sources.lekarny = {
      "type": "vector",
      "tiles": [location.origin+location.pathname+"./tiles/{z}/{x}/{y}.pbf"],
      "maxzoom": 13

    };
    style.sources.back = {
      "type": "raster",
      "tiles": ["https://samizdat.cz/tiles/ton_b1/{z}/{x}/{y}.png"],
      "tileSize": 256
   };
   style.sources.mistopis = {
      "type": "raster",
      "tiles": ["https://samizdat.cz/tiles/ton_l1/{z}/{x}/{y}.png"],
      "tileSize": 256
   };
    style.layers = stls;
    return style
};

var timeBack = function(zmena, n07, n99) {
  if (zmena == "n") {
    return "";
  } else if (n07 != null) {
    return "Původní název " + n07;
  } else if (n99 != null) {
    return "Původní název " + n99;
  } else {
    return "Lékárna v minulosti změnila vlastníka, název neznáme.";
  }
};


var drawMap = function(retezec) {
	$("#map").empty()
	$("#chart").empty()
	map = new mapboxgl.Map({
	  container: 'map',
	  center: [14.46562, 50.05981],
	  zoom: 6,
	  style: style(retezec)
	});

	map.dragRotate.disable();
	//map.addControl(new mapboxgl.Navigation());

	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {radius: 5}, function(err, features) {
	        if (err) throw err;
	        $(".info").empty()
          if (features[0]) {
            $(".info").append("<b>" + features[0].properties.nazev_2015 + "</b><br>Adresa: <b>" + features[0].properties.adresa + "</b><br>" + timeBack(features[0].properties.zmena, features[0].properties.nazev_2007, features[0].properties.nazev_1999))
          }
	    });
	});
};

drawMap("any");

$(".selector").change(function(evt) {
    drawMap(evt.target.value)
});
