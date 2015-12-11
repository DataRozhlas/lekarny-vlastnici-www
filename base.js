var map;

var style = function (retezec) {

  var style = {}
  style.version = 8;
  style.sources = {}
  style.sources.lekarny = {
      "type": "vector",
      "tiles": [location.origin+location.pathname+"./tiles/{z}/{x}/{y}.pbf"],
      "maxzoom": 13

    };
    style.layers = [
    {
      "id": "nezavisle",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "visibility": (retezec == "nezavisle" || retezec == "any" ? "visible": "none"),
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["!in", "znacka_2015", "Agel", "BENU", "Devětsil JST", "Dr.Max", "Plzeňská lékárna"],
        ],
      "paint": {
        "circle-color": "#999999",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "agel",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "visibility": (retezec == "Agel" || retezec == "any" ? "visible": "none"),
      "filter": [
        "all",
        ["==", "znacka_2015", "Agel"],
        ],
      "paint": {
        "circle-color": "#80b1d3",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "benu",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "visibility": (retezec == "BENU" || retezec == "any" ? "visible": "none"),
      "filter": [
        "all",
        ["==", "znacka_2015", "BENU"],
        ],
      "paint": {
        "circle-color": "#b3de69",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "devetsil",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["==", "znacka_2015", "Devětsil JST"],
        ],
    	"visibility": (retezec == "Devětsil JST" || retezec == "any" ? "visible": "none"),
      "paint": {
        "circle-color": "#bebada",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "plzenska",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "visibility": (retezec == "Plzeňská lékárna" || retezec == "any" ? "visible": "none"),
      "filter": [
        "all",
        ["==", "znacka_2015", "Plzeňská lékárna"],
        ],
      "paint": {
        "circle-color": "#fdb462",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "drmax",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "source-layer": "lekarny",
      "visibility": (retezec == "Dr.Max" || retezec == "any" ? "visible": "none"),
      "filter": [
        "all",
        ["==", "znacka_2015", "Dr.Max"],
        ],
      "paint": {
        "circle-color": "#fb8072",
        "circle-radius": 4,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    }
    ];
    style.layers =  style.layers.filter(function (s){
      return s.visibility !== "none"
    });
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
	  zoom: 7,
	  style: style(retezec)
	});

	map.dragRotate.disable();
	//map.addControl(new mapboxgl.Navigation());

	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {radius: 5}, function(err, features) {
	        if (err) throw err;
	        $(".info").empty()
	        $(".info").append("<b>" + features[0].properties.nazev_2015 + "</b><br>Adresa: <b>" + features[0].properties.adresa + "</b><br>" + timeBack(features[0].properties.zmena, features[0].properties.nazev_2007, features[0].properties.nazev_1999))
	    });
	});
};

drawMap("any");

$(".selector").change(function(evt) {
    drawMap(evt.target.value)
});
