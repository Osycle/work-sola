






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
		icon: 'https://www.sola.uz/third.png'
	},
	"business": {
		icon: 'https://www.sola.uz/third.png'
	},
	"stations": {
		icon: 'https://www.sola.uz/third.png'
	},
	"cafe": {
		icon: 'https://www.sola.uz/third.png'
	},
	"медицина": {
		icon: 'https://www.sola.uz/third.png'
	},
	"Parks": {
		icon: 'https://www.sola.uz/third.png'
	},
	"прочие": {
		icon: 'https://www.sola.uz/third.png'
	},
	"Markets": {
		icon: 'https://www.sola.uz/third.png'
	},
	"planning": {
		icon: 'https://www.sola.uz/third.png'
	},
	"centre": {
		icon: 'https://www.sola.uz/third.png'
	},
	"улицы": {
		icon: 'https://www.sola.uz/third.png'
	},
	"University": {
		icon: 'https://www.sola.uz/third.png'
	}
};

var markerGroups = {
		"airports": [],
		"business": [],
		"stations": [],
		"cafe": [],
		"медицина": [],
		"Parks": [],
		"прочие": [],
		"Markets": [],
		"planning": [],
		"centre": [],
		"улицы": [],
		"University": []
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
			console.log(data);
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
	if (!markerGroups[type][subType]) markerGroups[type][subType] = [];
	markerGroups[type].push(subType);
	markerGroups[type][subType].push(marker);


	$("[data-type-container='"+type+"']")
	.find(".tab-body")
	.append("<li data-type-parent='"+type+"' data-type-sub='"+subType+"'>"+name+"</li>");

	var html = "<b>" + name + "</b> <br/>" + address;
	bindInfoWindow(marker, map, infoWindow, html);
	return marker;
}

function toggleGroup(type) {
	for (var i = 0; i < markerGroups[type].length; i++) {
		var marker = markerGroups[type][i];
		if (!marker.getVisible()) {
			marker.setVisible(true);
		} else {
			marker.setVisible(false);
		}
	}
}

function bindInfoWindow(marker, map, infoWindow, html) {
	console.log(html);
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});
}




function doNothing() {}
google.maps.event.addDomListener(window, 'load', load);






$(".typelink").on("click", function(){
	var type = $(this).attr("data-type");
	toggleGroup(type);
})
$(".panel .tab-body").on("click", "li", function(){
	
	var typeParent = $(this).attr("data-type-parent");
	var typeSub = $(this).attr("data-type-sub");
	var marker = markerGroups[typeParent][typeSub][0];
	console.log(marker);
//	infoWindow.open(map, markerGroups["business"].businessT2[0]);

	google.maps.event.trigger(marker, "click");
})
