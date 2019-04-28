






function xmlParse(str) {
	if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
		var doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.loadXML(str);
		return doc;
	}

	if (typeof DOMParser != 'undefined') {
		return (new DOMParser()).parseFromString(str, 'text/xml');
	}

	return createElement('div', null);
}

var infoWindow = new google.maps.InfoWindow();
var customIcons = {
	"airports": {
		icon: 'img/mapmarkers/airports.png'
	},
	"business": {
		icon: 'img/mapmarkers/business.png'
	},
	"stations": {
		icon: 'img/mapmarkers/stations.png'
	},
	"cafe": {
		icon: 'img/mapmarkers/cafe.png'
	},
	"medicine": {
		icon: 'img/mapmarkers/medicine.png'
	},
	"parks": {
		icon: 'img/mapmarkers/parks.png'
	},
	"other": {
		icon: 'img/mapmarkers/other.png'
	},
	"markets": {
		icon: 'img/mapmarkers/markets.png'
	},
	"planning": {
		icon: 'img/mapmarkers/planning.png'
	},
	"centre": {
		icon: 'img/mapmarkers/centre.png'
	},
	"streets": {
		icon: 'img/mapmarkers/streets.png'
	},
	"university": {
		icon: 'img/mapmarkers/university.png'
	}
};

var markerGroups = {
		"airports": [],
		"business": [],
		"stations": [],
		"cafe": [],
		"medicine": [],
		"parks": [],
		"other": [],
		"markets": [],
		"planning": [],
		"centre": [],
		"streets": [],
		"university": []
};

function load() {
	var map = new google.maps.Map(document.getElementById("map"), {
		center: new google.maps.LatLng(41.3017329, 69.2101797),
		zoom: 12,
		mapTypeId: 'roadmap'
	});

	map.set('styles');

	$.ajax({
		type: "POST",
		url: "searchmap-data.html",
		data: {},
		success: function(data){
			//var xml = data.responseXML;
			data = JSON.parse(data);
			// var markers = $(data).find("marker");
			//console.log(data);
			for (var i = 0; i < data.length; i++) {
				dataItem = data[i];
			 	var address = '';
				var point = new google.maps.LatLng( dataItem.lat, dataItem.lng);

				
				var content = "<b>" + dataItem.title + "</b> <br/>" + address;
				// var icon = customIcons[type] || {};
				var marker = createMarker(point, dataItem.title, address, dataItem.type, map, dataItem.type+"T"+(i+1));
				bindInfoWindow(marker, map, infoWindow, content);
			}
		},
		//contentType: "Content-Type:application/json;",
		statusCode: {
			//404: function(){alert( "page not found" );}
		},
		complete: function(){} 
	});


}

function createMarker(point, name, address, type, map, subType) {
	var icon = customIcons[type] || {};
	var marker = new google.maps.Marker({
		map: map,
		position: point,
		icon: icon.icon,
		// shadow: icon.shadow,
		type: type
	});

	if (!markerGroups[type]) markerGroups[type] = [];

	//if (!markerGroups[type][subType]) markerGroups[type][subType] = [];
	markerGroups[type].push(marker);
	marker["typeid"] = subType;
	//console.log(marker); 

	$("[data-type-container='"+type+"']")
	.find(".tab-body")
	.append("<li data-type='"+type+"' data-locality='"+ subType +"'>"+name+"</li>");

	var html = "<b>" + name + "</b> <br/>" + address;
	bindInfoWindow(marker, map, infoWindow, html);
	return marker;
}

function toggleGroup(type) {

	var typelinks = $(".typelink:not([data-type-link='typeall'])");

	if( type == "typeall" ){
		typelinks.map(function(i, el){
			var type = $(el).attr("data-type-link");
			//console.log(markerGroups[type]);
			try{
				for (var i = 0; i < markerGroups[type].length; i++) {
					var marker = markerGroups[type][i];
					if( $("[data-type-link='typeall']").hasClass("is-selected") )
						marker.setVisible(true);
					else
						marker.setVisible(false);
				}
			}catch(e){
				console.log(e);
			}
		})
		return;
	}

		typelinks.map(function(i, el){
			var type = $(el).attr("data-type-link");
			//console.log(markerGroups[type]);
			for (var i = 0; i < markerGroups[type].length; i++) {
				var marker = markerGroups[type][i];
				marker.setVisible(false);
				if( $(el).hasClass("is-selected") )
					marker.setVisible(true);
				else
					marker.setVisible(false);
			}

		})


	// for (var i = 0; i < markerGroups[type].length; i++) {
	// 	var marker = markerGroups[type][i];
	// 	if (!marker.getVisible()) {
	// 		marker.setVisible(true);
	// 	} else {
	// 		marker.setVisible(false);
	// 	}
	// }

}

function bindInfoWindow(marker, map, infoWindow, html) {
	//console.log(html);
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});
}




function doNothing() {}
google.maps.event.addDomListener(window, 'load', load);






$(".typelink").on("click", function(){
	var type = $(this).attr("data-type-link");

	if( !($(this).hasClass("is-selected")) )
		$(".typelink").removeClass("is-selected");

	$(this).toggleClass("is-selected");
	console.log(this);
	toggleGroup(type);
})
$(".searchmap .panel .tab-body").on("click", "li", function(){
	
	var typeParent = $(this).attr("data-type");
	var typeSub = $(this).attr("data-locality");
	var marker = markerGroups[typeParent];
	$(markerGroups[typeParent]).map(function(i, el){
		console.log(i,el);
		if(el.typeid == typeSub)
			google.maps.event.trigger(el, "click");
	})
	console.log(markerGroups[typeParent]);
//	infoWindow.open(map, markerGroups["business"].businessT2[0]);

})
