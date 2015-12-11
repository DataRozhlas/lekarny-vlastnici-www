var map;

var colors = {"nezávislá": "#d9d9d9", "Agel": "#80b1d3", "BENU": "#b3de69", "Devětsil JST": "#dd3497", "Plzeňská lékárna": "#fdb462", "Dr.Max": "#fb8072"};

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
    return "<b>Původní název:</b> " + n07;
  } else if (n99 != null) {
    return "<b>Původní název:</b> " + n99;
  } else {
    return "Lékárna v minulosti změnila vlastníka, název neznáme.";
  }
};

var drawLegend = function(retezec) {
  $(".legend").empty()
    var w = 200;
    var h = 225;
    var svg = d3.select('.legend')
          .append("svg")
          .attr("width", w)
          .attr("height", h);

  if (retezec == "any") {
    var nazvy = [];
    for (var nazev in colors) {
        nazvy.push(nazev);
    }

    d3.select("#tooltip")
      .style("height", "215px")

     svg.selectAll("circle")
         .data(nazvy)
         .enter()
         .append("circle")
          .attr("cx", 8)
          .attr("cy", function(d, i) {
            return (i * 20) + 15;
          })
          .attr("r", 6)
          .style("fill", function(d, i) {
            return colors[d];
          })

    svg.selectAll("text")
         .data(nazvy)
         .enter()
         .append("text")
         .text(function (d) {
          return d;
         })
          .attr("x", 25)
          .attr("y", function(d, i) {
            return (i * 20) + 19;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "black");
    //lekarny
  } else {

     d3.select("#tooltip")
      .style("height", "140px")

    var cols = ["#d7191c", "#2c7bb6"]
    var dataset = ["Změnila majitele", "Původní majitel"]
    
    svg.selectAll("circle")
         .data(dataset)
         .enter()
         .append("circle")
          .attr("cx", 8)
          .attr("cy", function(d, i) {
            return (i * 20) + 15;
          })
          .attr("r", 6)
          .style("fill", function(d, i) {
            return cols[i];
          })

    svg.selectAll("text")
         .data(dataset)
         .enter()
         .append("text")
         .text(function (d) {
          return d;
         })
          .attr("x", 25)
          .attr("y", function(d, i) {
            return (i * 20) + 19;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "black");
  };
};

var drawMap = function(retezec) {
	$("#map").empty()
	map = new mapboxgl.Map({
	  container: 'map',
	  center: [15.32601339, 49.7500033],
	  zoom: 6.5,
	  style: style(retezec)
	});

	map.dragRotate.disable();
	//map.addControl(new mapboxgl.Navigation());

	map.on('mousemove', function(e) {
	    map.featuresAt(e.point, {radius: 5}, function(err, features) {
	        if (err) throw err;
	        $(".info").empty()
          if (features[0]) {
            $(".info").append("<b>" + features[0].properties.nazev_2015 + "<br>Adresa: </b>" + features[0].properties.adresa + "<br>" + timeBack(features[0].properties.zmena, features[0].properties.nazev_2007, features[0].properties.nazev_1999))
          } else {
            $(".info").append("Najetím myši vyberte lékárnu.");
          };
	    });
	});
};

drawMap("any");
drawLegend("any");

$(".selector").change(function(evt) {
    drawMap(evt.target.value)
    drawLegend(evt.target.value)
});
