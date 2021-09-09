//Sistema de monitoreo de cultivo en CoopeCalifornia R.L.

// Mapa base
var map = L.map("mapid");

// Centro del mapa y nivel de acercamiento
var mapacoopevi = L.latLng([9.534628713007258, -84.352162100308789]);  
var zoomLevel = 13;

// Definición de la vista del mapa
map.setView(mapacoopevi, zoomLevel);

//Control de escala 
L.control.scale({position:'topleft',imperial:false}).addTo(map);

// Adición de las capas base
esri = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osm = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);


///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de control de Capas Base
var baseMaps = {
	"OpenStreetMap": osm,
	"ESRI World Imagery": esri
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de capas overlay
var overlayMaps = {
	
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fincas de CoopeVictoria
$.getJSON("lotes_coopecaliforniarl.geojson", function(geodata) {
	var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "black", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Asociado: " + feature.properties.ASOCIADO + "<br>" + "Área: " + feature.properties.AREA + " ha";
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_lotes_coopecaliforniarl, 'Áreas de Producción');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Mapa de Coropletas

// Paleta de colores capa NDVI en base a 100
function getColor(d) {
    return d > 90 ? '#2b83ba' :
           d > 80 ? '#74b6ad' :
           d > 70 ? '#b7e2a8' :
           d > 60 ? '#e7f5b7' :
           d > 50 ? '#cab985' :
		   d > 40 ? '#c9965c' :
		   d > 30 ? '#bd5c3b' :
		   d > 20 ? '#d7191c' :
                    '#FFEDA0';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Selección de Asociados segun interes 

var asociados_coope = L.layerGroup().addTo(map);

function colorFincas(d) { 
	return d == "TODOS" ? '#FFFF00' :
		d == "El Tigre" ? '#FF0000' : 
		d == "La Palma" ? '#00FF00' : 
		d == "Los Angeles" ? '#FFFF00' : 
		'#000000'; 
	};
	
	
function estilo_fincas (feature) {
	return{
		fillColor: colorFincas(feature.properties.FINCA),
	};
};

function myFunction() {
	$.getJSON("lotes_coopecaliforniarl.geojson", function(geodata){
		var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
			}
		});
	asociados_coope.addLayer(layer_geojson_lotes_coopecaliforniarl);
	control_layers.addOverlay(layer_geojson_lotes_coopecaliforniarl, 'Fincas');
	layer_geojson_lotes_coopecaliforniarl.remove();
	});
};



function estiloSelect() {
	var miSelect = document.getElementById("estilo").value;
	
	$.getJSON("lotes_coopecaliforniarl.geojson", function(geodata){
		var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
			filter: function(feature, layer) {								
				if(miSelect != "TODOS")		
				return (feature.properties.FINCA == miSelect );
				else
				return true;
			},	
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
				map.fitBounds(layer.getBounds());
			}
		});
 		asociados_coope.clearLayers();
		asociados_coope.addLayer(layer_geojson_lotes_coopecaliforniarl);
	});		
};
	


// Fincas de CoopeVictoria
$.getJSON("rendimientohistorico.geojson", function(geodata) {
	var layer_geojson_historial = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "black", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Zafra 2016-2017: " + feature.properties.PROD_16 +  " Ton/ha" + "<br>" + "Zafra 2017-2018: " + feature.properties.PROD_17 + " Ton/ha" +"<br>" + "Zafra 2018-2019: " + feature.properties.PROD_18 + " Ton/ha" +"<br>" + "Zafra 2019-2020: " + feature.properties.PROD_19+" Ton/ha" ;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_historial, 'Historial de Cosecha por Finca');
});







// Ubicacion del control de capas
control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topright', "autoZIndex": true, collapsed:true}).addTo(map);	





 

















