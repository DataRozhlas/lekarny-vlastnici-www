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
        "circle-radius": 3,
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
      "visibility": (retezec == "Benu" || retezec == "any" ? "visible": "none"),
      "filter": [
        "all",
        ["==", "znacka_2015", "Benu"],
        ],
      "paint": {
        "circle-color": "#b3de69",
        "circle-radius": 3,
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
      "paint": {
      	"visibility": (retezec == "Devětsil JST" || retezec == "any" ? "visible": "none"),
        "circle-color": "#bebada",
        "circle-radius": 3,
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
        "circle-radius": 3,
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
        "circle-radius": 3,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    },
    {
      "id": "nezavisle",
      "interactive": true,
      "type": "circle",
      "source": "lekarny",
      "visibility": (retezec == "nezavisle" || retezec == "any" ? "visible": "none"),
      "source-layer": "lekarny",
      "filter": [
        "all",
        ["==", "znacka_2015", ""],
        ],
      "paint": {
        "circle-color": "#999999",
        "circle-radius": 3,
        //"fill-outline-color": "#d9d9d9",
        "circle-opacity": 0.8
    }
    }
    ];
    console.log(style)
    return style;
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

	console.log(style(retezec))

	map.dragRotate.disable();
	//map.addControl(new mapboxgl.Navigation());

	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {}, function(err, features) {
	        if (err) throw err;
	        $(".info").empty()
	        $("#chart").empty()
	        $(".info").append("Honitba " + features[0].properties['NAZEV'] + "<br>" + zverNazvy[zvire.replace('JKS_', '').replace('_STAV', '').replace('_pct', '')] + ": " + features[0].properties[zvire.substr(0, zvire.length - 4)])
	    });
	});
};

drawMap("Benu");

$(".selector").change(function(evt) {
    drawMap(evt.target.value)
});