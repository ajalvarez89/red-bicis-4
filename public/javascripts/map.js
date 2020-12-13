var mymap = L.map('mapid').setView([ 40.759279, -73.985226], 15);

    
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


$.ajax({
    dataType: "json",
    //url: "api/bicicletas",
    url: "bicis_map",
    success: function(result){
        console.log('******======= Se cargaron las bicicletas');
        console.log(result);
        result.bicicletas.forEach(function(bici){            
            L.marker(bici.ubicacion,{title: bici.code}).addTo(mymap).bindPopup("<b>Codigo: "+bici.code+"</b><br />"+"<b>Modelo: "+bici.modelo+"</b><br />"+"Color: "+bici.color+"<br />Ubicación: "+bici.ubicacion).openPopup();
        })
    }
});

