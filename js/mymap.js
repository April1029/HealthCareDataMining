// Global variables
var mapCenter = [36.372, 8.565];
var mapZoom = 1.89;

// --------------------------------------------------------
// 1. Initialize map
mapboxgl.accessToken = "pk.eyJ1IjoidGlraXh6eCIsImEiOiJjazF1eW5jcXUxNnRrM2xuc3YxMjRqZHljIn0.VD3JHxAeK7LePYX3_6WFPg"; // replace this value with your own access token from Mapbox Studio

// for more mapboxgl.Map options, see https://docs.mapbox.com/mapbox-gl-js/api/#map)
var map = new mapboxgl.Map({
    container: "map", // this is the ID of the div in index.html where the map should go
    center: mapCenter, // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: mapZoom, // set the default zoom programatically
    style: "mapbox://styles/tikixzx/ckhcv116z19hw19p3uqsem8ik", // replace this value with the style URL from Mapbox Studio
});

// --------------------------------------------------------
// 2. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/

var layers = [
    // an array of the layers you want to include in the layers control (layers to turn off and on)
    // [MapboxlayerName, layerDisplayName]
    //        ['nightclub', 'NIGHTCLUB'],             // 'Point_O':layers[0][0],'PizzaHut': layers[0][1]
    //        ['graffiti', 'GRAFFITI'],
    //        ['occupiedbuilding', 'OCCUPIED BUILDING'],
    //        ['shops', 'SHOP'],
    //        ['tourism attractions', 'TOURISM ATTRACTION'],
    //        ['dining', 'DINING PLACE'],
    //        ['park', 'PARK'],
    //        ['bridge', 'BRIDGE'],
    //        ['corner store', 'CORNER STORE'],
    //        ['water2', 'WATER'],
    // add additional live data layers here as needed
];

//DON'T CHANGE
//functions to perform when map loads
map.on("load", function () {
    for (i = 0; i < layers.length; i++) {
        // add a button for each layer
        $("#layers-control").append("<a href='#' class='button-default' style='font-size: 15px' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
    }

    // show/hide layers when button is clicked
    $("#layers-control>a").on("click", function (e) {
        var clickedLayer = e.target.id;

        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, "visibility"); // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
        console.log(visibility);

        if (visibility === "visible") {
            map.setLayoutProperty(clickedLayer, "visibility", "none"); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
            $(e.target).removeClass("active");
        } else {
            $(e.target).addClass("active");
            map.setLayoutProperty(clickedLayer, "visibility", "visible"); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
        }
    });
});

// --------------------------------------------------------
// 3. Scroll to zoom through sites
// See example at https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/

// A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
var chapters = {
    chapter01: {
        name: "US Scale",
        description:
            "After things are getting ready, the full process is related to many different institutions and stakeholders in several different fields. Personal samples and records are collected by local pharmacies, clinics and hospitals through medical activities. These personal information will be gathered by large medical stakeholders. Nowadays, many tech companies are collaborating with medical companies. These tech companies are developing health-related products that might bring convenience to public health service, while also having access to our personal data without permission in the meantime.",
        bearing: 0,
        center: [-82.968638, 36.224240],
        zoom: 4.03,
        pitch: 0,
    },



    chapter02: {
        name: "Data Gathering",
        description:
            "Our personal data are being collected by wearable devices, our medical records and prescriptions. These data are stored at separate servers or storage centers.",
        bearing: 0,
        center: [-77.013777, 39.089483],
        zoom: 9.41,
        pitch: 0,
        //            layersVis:['Point_D_Heatmap'],
        //            layersHide:['Point_O','Point_D'],
        speed: 0.3,
    },

    chapter03: {
        name: "Data storage",
        description:
            "The medical or health data are gathered and organized by medical companies and given to tech companies for further analysis and future use.",
        bearing: 0.0,
        center: [-89.346761, 38.841513],
        zoom: 8.29,
        pitch: 0.0,
        //            layersVis:['Point_O','Bar_O'],
        //            layersHide:['Point_D_Heatmap'],
        speed: 0.5,
    },
    chapter04: {
        name: "Data analysis",
        description: "Personal data from different sources are being analyzed together, which might become a personal health profile including people's health-related history and future estimate. These data can have influence on many aspects in our daily lives.",
        //imagepath: "img/McIntire Park.jpg",
        bearing: 0.0,
        center: [-120.976196, 37.198917],
        zoom: 8.44,
        pitch: 0.0,
        layersVis: ["Point_D"],
        layersHide: [],
        speed: 1,
    },

    // add additional chapters here as needed
};

console.log(chapters["chapter01"]["name"]);
console.log(Object.keys(chapters)[0]);

//Add the chapters to the #chapters div on the webpage
for (var key in chapters) {
    var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
    var chapterHTML = $(
        "<h3>" +
            "<br>" +
            chapters[key]["name"] +
            "<br><br>" +
            "</h3>" +
            "<p>" +
            chapters[key]["description"] +
            "</p>" +
            "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
    ).appendTo(newChapter);
}

$("#chapters").scroll(function (e) {
    var chapterNames = Object.keys(chapters);

    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        var chapterElem = $("#" + chapterName);

        if (chapterElem.length) {
            if (checkInView($("#chapters"), chapterElem, true)) {
                setActiveChapter(chapterName);
                $("#" + chapterName).addClass("active");
                break;
            } else {
                $("#" + chapterName).removeClass("active");
            }
        }
    }
});

var activeChapterName = "";

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    // Reset layers to visible
    for (i = 0; i < chapters[chapterName]["layersVis"].length; i++) {
        map.setLayoutProperty(chapters[chapterName]["layersVis"][i], "visibility", "visible");
    }
    for (i = 0; i < chapters[chapterName]["layersHide"].length; i++) {
        map.setLayoutProperty(chapters[chapterName]["layersHide"][i], "visibility", "none");
    }

    activeChapterName = chapterName;
}

function checkInView(container, elem, partial) {
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight;

    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();

    var isTotal = elemTop >= 0 && elemBottom <= contHeight;
    var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= container.height())) && partial;

    return isTotal || isPart;
}

map.on('load', function () {
map.addSource('places', {
'type': 'geojson',
'data': {
'type': 'FeatureCollection',
'features': [
{
'type': 'Feature',
'properties': {
'description':
'<strong>Data Flow Among Institutions</strong><div class="imageContainer">  <input type="checkbox" id="zoomcheck"><label for="zoomcheck"><img src="./img/map/Institution scale.jpg" style="width:210px; height:105px"> </label></div>',
'icon': 'theatre'
},
'geometry': {
'type': 'Point',
'coordinates': [- 99.0602406, 39.5015541]
}
},
{
'type': 'Feature',
'properties': {
'description':
'<strong>Health data gathering chain</strong><div class="imageContainer">  <input type="checkbox" id="zoomcheck"><label for="zoomcheck"><img src="./img/map/dc-02.jpg" style="width:210px"> </label></div>',
'icon': 'theatre'
},
'geometry': {
'type': 'Point',
'coordinates': [-90.3133820, 38.9844553]
}
},
{
'type': 'Feature',
'properties': {
'description':
'<strong>Medical data gathering chain</strong><div class="imageContainer"> <input type="checkbox" id="zoomcheck"><label for="zoomcheck"><img src="./img/map/st.louis-01.jpg" style="width:210px"> </label></div>',
'icon': 'theatre'
},
'geometry': {
'type': 'Point',
'coordinates': [-77.0269806, 38.881189]
}
},
{
'type': 'Feature',
'properties': {
'description':
'<strong>DNA identity data gathering chain</strong><div class="imageContainer"> <input type="checkbox" id="zoomcheck"><label for="zoomcheck"><img src="./img/map/california-03.jpg" style="width:210px"> </label></div>',
'icon': 'theatre'
},
'geometry': {
'type': 'Point',
'coordinates': [-122.0794107, 37.3919479]
}
},
]
}
});
// Add a layer showing the places.
map.addLayer({
'id': 'places',
'type': 'symbol',
'source': 'places',
'layout': {
'icon-image': '{icon}-15',
'icon-allow-overlap': true
}
});
 
// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'places', function (e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var description = e.features[0].properties.description;
 
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(description)
.addTo(map);
});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'places', function () {
map.getCanvas().style.cursor = 'pointer';
});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', function () {
map.getCanvas().style.cursor = '';
});
var all = document.getElementsByClassName('mapboxgl-popup-content');
for (var i = 0; i < all.length; i++) {
  //all[i].style.width = '100%';
  //all[i].style.max-width = '100vw';
}
var all = document.getElementsByClassName('mapboxgl-popup');
for (var i = 0; i < all.length; i++) {
  //all[i].style.max-width = '200px';
}
});
