let arrayCircle =[];
let arrayHeat=[];
let arrayAll=[];


var activeChapterName ="par1";


mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGVvc2VpayIsImEiOiJjajQxbzYyamYwZ3BoMnFwYW14OWJ4YzFzIn0.ftiqjSyzdVDOaclBCDp4Gg';

if (!mapboxgl.supported()) {
    alert('Il tuo browser non supporta Mapbox GL');
} else { var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/matteoseik/cjnsxmwc23cmb2slpa6lqrsse', //hosted style id
    center: [9.674504
, 45.695638], // starting position
    zoom: 13
});
}


map.on('load', function() {
  map.addSource('segnalazioni', {
    type: 'geojson',
    data: './json/segnalazioni.geojson'
  });
});




// On every scroll event, check which element is on screen
var side = document.getElementById("mySidenav");
side.onscroll = function() {

  // cambia il titolo del menu
      if (isElementOnScreenTitolo("primo")) {
        $("#ringTabDrop").text("Bergamo");
      }else if(isElementOnScreenTitolo("secondo")){
          $("#ringTabDrop").text("Geologia e clima");
      }else if(isElementOnScreenTitolo("terzo")){
          $("#ringTabDrop").text("Flora di Bergamo");
      }else if(isElementOnScreenTitolo("quarto")){
          $("#ringTabDrop").text("Forme Biologiche");
      }else if(isElementOnScreenTitolo("quinto")){
          $("#ringTabDrop").text("I Corotipi");
      }else if(isElementOnScreenTitolo("sesto")){
          $("#ringTabDrop").text("Specie Allergeniche");}

  // On every scroll event, check se il livello acceso corrisponde al capitolo acceso
  // altrimenti rimuove l'ultimo livello creato
  // Il problema è rimuovere due livelli insieme:


          var d = map.getStyle().layers;
          var c = d[d.length-1].id;
          var elimina1 = [d.length-2].id;
          var elimina2 = [d.length-3].id;
          var tipo =d[d.length-1].type;
          var e = activeChapterName + "h";
          var h = c - "h";
          var f = d[d.length-2].id;


          // if(c == e || c == activeChapterName && c.startsWith("liv")){
          //   map.removeLayer(elimina1);
          //   map.removeLayer(elimina2);
          // }

// function rimuoviLivelli(){
//   for(let a = 0; a < arrayLayer.length; a++){
//     map.removeLayer(arrayLayer[a]);
//   }
// }

for(let b = 0; b < arrayCircle.length; b++){
  if(arrayCircle[b] !== activeChapterName){
      map.removeLayer(arrayCircle[b]);
  }
}

for(let a = 0; a < arrayHeat.length; a++){
  if(arrayHeat[a] !== e && arrayHeat[a] !== "liv-bg"){
    map.removeLayer(arrayHeat[a]);
  }
}


  var chapterNames = Object.keys(chapters);
  for (var i = 0; i < chapterNames.length; i++) {
      var chapterName = chapterNames[i];
      if (isElementOnScreen(chapterName)) {
          setActiveChapter(chapterName);
          break;
      }
  }

};





function addPoligono(nome2, coordinate, colore2){
map.addLayer({
       'id': nome2,
       'type': 'fill',
       'source': {
           'type': 'geojson',
           'data': {
               'type': 'Feature',
               'geometry': {
                   'type': 'Polygon',
                   'coordinates': coordinate,
               }
           }
       },
       'layout': {},
       'paint': {
           'fill-color': colore2,
           // 'fill-color': "black",
           'fill-opacity': 0.6,
           // 'fill-outline-color': 'black',
           // 'fill-pattern': 'agricoltura'

       }
   });

}


//  INIZIO FUNZIONE ACCENDI LIVELLO 1
function addCerchio(filtro1, filtro2, colore, nome){
var capitoli = Object.keys(chapters);

    map.addLayer({
          'id': nome,
          'type': 'circle',
          'source': 'segnalazioni',
          'layout': {
              'visibility': 'visible',
          },
          'paint': {
              'circle-radius': {
                  'base': 2,
                  'stops': [[12, 2.3], [22, 180]]
              },
              'circle-stroke-color': 'white',
              'circle-stroke-width': 0.2,
              'circle-color': colore,

              'circle-opacity': {
                  default: 0,
                  stops: [
                    [14, 0],
                    [15, 1]
                  ]
                },



          },





      });

      map.setFilter( nome, ["==",filtro1, filtro2]);

//       map.setFilter( nome,
//         ["in", filter1, filter2, filter3]
// );


          // POPUP
              map.on('click', function(e) {
                var features = map.queryRenderedFeatures(e.point, {
                  layers: [nome] // replace this with the name of the layer
                });

                if (!features.length) {
                  return;
                }



                var feature = features[0];
                var popup = new mapboxgl.Popup({ offset: [0, -15] })
                  .setLngLat(feature.geometry.coordinates)
                  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'>' +
                            '<ul>' +
                            '<li> Nome: ' + feature.properties['nome-completo'] + ' </li>' +
                            '<li> Famiglia: ' + feature.properties['famiglia'] + ' </li>' +
                            '<li> Corotipo:  ' + feature.properties['corotipi'] + ' </li>' +
                            '<li> Forma biologica:  ' + feature.properties['forma-bio-semp'] + ' </li>' +
                            '<li> <a target="_blank" href="https://www.actaplantarum.org/galleria_flora/galleria1.php?lista=0&mode=1&cat=24&cid=73&aid='+feature.properties['link']+'">Actaplantarum</a></li></ul></div>')
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map);

                  // remove popup
                  let listaP = document.getElementsByClassName("mapboxgl-popup");
                  if(popup.isOpen() && listaP.length > 1){
                    for (var i = listaP.length - 1; i >= 1; --i) {
                      listaP[i].parentNode.removeChild(listaP[i]);
                      }
                    }
                 });


      // Change the cursor to a pointer when the mouse is over the places layer.
         map.on('mouseenter', nome, function () {
             map.getCanvas().style.cursor = 'pointer';
         });
         // Change it back to a pointer when it leaves.
         map.on('mouseleave', nome, function () {
             map.getCanvas().style.cursor = '';
         });

    // RIMUOVI LIVELLO PRECEDENTE
    // var a = map.getStyle().layers;
    // var b = a[a.length-2].id;
    //  map.removeLayer(b);

    // for(let b = 0; b < arrayCircle.length; b++){
    //   map.removeLayer(arrayCircle[b]);
    // }

    arrayCircle.push(nome);
};   //  FINE FUNZIONE ACCENDI LIVELLO 1




function addHeat(nome2, filtro1, filtro2,){
var capitoli2 = Object.keys(chapters);

    map.addLayer({
          'id': nome2,
          'type': 'heatmap',
          'source': 'segnalazioni',
          'layout': {
              'visibility': 'visible',
          },
              'paint':{

    'heatmap-intensity': {
      stops: [
        [10, 0.5],
        [14, 1]
      ]
    },

    "heatmap-weight":0.7,
    "heatmap-intensity":0.6,


    "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                  0.2, "rgb(103,169,207)",
                  0.3, "rgb(209,229,240)",
                  0.6, "yellow",
                  0.8, "orange",
                  1, "red"

            ],
    'heatmap-radius': {
      stops: [
        [11, 5],
        [15, 9]
      ]
    },
    'heatmap-opacity': {
      default: 1,
      stops: [
        [14, 1],
        [15, 0]
      ]
    },
  }

  });

  map.setFilter( nome2, ['==', filtro1, filtro2]);

// for(let a = 0; a < arrayHeat.length; a++){
//   map.removeLayer(arrayHeat[a]);
// }

  arrayHeat.push(nome2);

};   //  FINE HEATMAP



//  INIZIO FUNZIONE ACCENDI LIVELLO 1
function addPolline(filtro1, filtro2, filtro3, colore, nome){
var capitoli = Object.keys(chapters);

    map.addLayer({
          'id': nome,
          'type': 'circle',
          'source': 'segnalazioni',
          'layout': {
              'visibility': 'visible',
          },
          'paint': {
              'circle-radius': {
                  'base': 2,
                  'stops': [[12, 2.3], [22, 180]]
              },
              'circle-stroke-color': 'white',
              'circle-stroke-width': 0.2,
              'circle-color': colore
          },
      });

      map.setFilter( nome, [
    "all",
    ["==", "ALLERGENICA", "SI"],
    ["in",filtro1, filtro2, filtro3]
]);


          // POPUP
              map.on('click', function(e) {
                var features = map.queryRenderedFeatures(e.point, {
                  layers: [nome] // replace this with the name of the layer
                });

                if (!features.length) {
                  return;
                }

                var feature = features[0];
                var popup = new mapboxgl.Popup({ offset: [0, -15] })
                  .setLngLat(feature.geometry.coordinates)
                  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'>' +
                            '<ul>' +
                            '<li> Nome: ' + feature.properties['nome-completo'] + ' </li>' +
                            '<li> Famiglia: ' + feature.properties['famiglia'] + ' </li>' +
                            '<li> Corotipo:  ' + feature.properties['corotipi'] + ' </li>' +
                            '<li> Forma biologica:  ' + feature.properties['forma-bio-semp'] + ' </li>' +
                            '<li> <a target="_blank" href="https://www.actaplantarum.org/galleria_flora/galleria1.php?lista=0&mode=1&cat=24&cid=73&aid='+feature.properties['link']+'">Actaplantarum</a></li></ul></div>')
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map);

                  // remove popup
                  let listaP = document.getElementsByClassName("mapboxgl-popup");
                  if(popup.isOpen() && listaP.length > 1){
                    for (var i = listaP.length - 1; i >= 1; --i) {
                      listaP[i].parentNode.removeChild(listaP[i]);
                      }
                    }
                 });


      // Change the cursor to a pointer when the mouse is over the places layer.
         map.on('mouseenter', nome, function () {
             map.getCanvas().style.cursor = 'pointer';
         });
         // Change it back to a pointer when it leaves.
         map.on('mouseleave', nome, function () {
             map.getCanvas().style.cursor = '';
         });

    // RIMUOVI LIVELLO PRECEDENTE
    // var a = map.getStyle().layers;
    // var b = a[a.length-2].id;
    // var tipo = a[a.length-2].type;
    // map.removeLayer(b);
    //
    // }

    for(let c = 0; c < arrayAll.length; c++){
      map.removeLayer(arrayAll[c]);
    }
    arrayAll.push(nome);

};


//  LIVELLO LEGENDA
function addLegenda(filtro1, filtro2, colore, nome){
var capitoli = Object.keys(chapters);

    map.addLayer({
          'id': nome,
          'type': 'circle',
          'source': 'segnalazioni',
          'layout': {
              'visibility': 'visible',
          },
          'paint': {
              'circle-radius': {
                  'base': 2,
                  'stops': [[12, 2.5], [22, 200]]
              },
              'circle-stroke-color': 'white',
              'circle-stroke-width': 0.2,
              'circle-color': colore,
              'circle-opacity': 0.3
              // 'circle-blur': 0.2
          },
      });

      map.setFilter( nome, ['==', filtro1, filtro2]);


          // POPUP
              map.on('click', function(e) {
                var features = map.queryRenderedFeatures(e.point, {
                  layers: [nome] // replace this with the name of the layer
                });

                if (!features.length) {
                  return;
                }

                var feature = features[0];
                var popup = new mapboxgl.Popup({ offset: [0, -15] })
                  .setLngLat(feature.geometry.coordinates)
                  .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'>' +
                            '<ul>' +
                            '<li> Nome: ' + feature.properties['nome-completo'] + ' </li>' +
                            '<li> Famiglia: ' + feature.properties['famiglia'] + ' </li>' +
                            '<li> Corotipo:  ' + feature.properties['corotipi'] + ' </li>' +
                            '<li> Forma biologica:  ' + feature.properties['forma-bio-semp'] + ' </li>' +
                            '<li> <a target="_blank" href="https://www.actaplantarum.org/galleria_flora/galleria1.php?lista=0&mode=1&cat=24&cid=73&aid='+feature.properties['link']+'">Actaplantarum</a></li></ul></div>')
                  .setLngLat(feature.geometry.coordinates)
                  .addTo(map);

                  // remove popup
                  let listaP = document.getElementsByClassName("mapboxgl-popup");
                  if(popup.isOpen() && listaP.length > 1){
                    for (var i = listaP.length - 1; i >= 1; --i) {
                      listaP[i].parentNode.removeChild(listaP[i]);
                      }
                    }
                 });


      // Change the cursor to a pointer when the mouse is over the places layer.
         map.on('mouseenter', nome, function () {
             map.getCanvas().style.cursor = 'pointer';
         });
         // Change it back to a pointer when it leaves.
         map.on('mouseleave', nome, function () {
             map.getCanvas().style.cursor = '';
         });


};  // LIVELLO LEGENDA


//  ATTIVA FUNZIONI QUANDO ID ATTIVO



function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

      document.getElementById(chapterName).setAttribute('class', 'active');
      document.getElementById(activeChapterName).setAttribute('class', '');

      activeChapterName = chapterName;


  if(activeChapterName.startsWith("liv-bg")){
    addCerchio(chapters[chapterName].filtro1, chapters[chapterName].filtro2,chapters[chapterName].colore, chapters[chapterName].nome);
    addHeat(chapters[chapterName].nome2,chapters[chapterName].filtro1, chapters[chapterName].filtro2);
  };

  if(activeChapterName.startsWith("liv-cor")){
    addCerchio(chapters[chapterName].filtro1, chapters[chapterName].filtro2,chapters[chapterName].colore, chapters[chapterName].nome);
    addHeat(chapters[chapterName].nome2,chapters[chapterName].filtro1, chapters[chapterName].filtro2);

  };

  if(activeChapterName.startsWith("liv-bio")){
    addCerchio(chapters[chapterName].filtro1, chapters[chapterName].filtro2,chapters[chapterName].colore, chapters[chapterName].nome);
    addHeat(chapters[chapterName].nome2,chapters[chapterName].filtro1, chapters[chapterName].filtro2);

  };

  if(activeChapterName.startsWith("liv-geo")){
    addPoligono(chapters[chapterName].nome2,chapters[chapterName].coordinate, chapters[chapterName].colore2);
  };

  if(activeChapterName.startsWith("liv-pol")){
    addPolline(chapters[chapterName].filtro1, chapters[chapterName].filtro2, chapters[chapterName].filtro3, chapters[chapterName].colore, chapters[chapterName].nome);
  };

  if(activeChapterName.startsWith("liv-geo")== false){
    let l = map.getStyle().layers;
      for(i = 0; i< l.length; i++){
        if(l[i].id.startsWith("geo")){
          map.removeLayer(l[i].id);
          map.removeSource(l[i].id);
        }
      }
    }

  };


//  CHECK SE ELEMENT E' SU SCHERMO

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 100;
}

function isElementOnScreenTitolo(id) {
  var element2 = document.getElementById(id);
  var bounds2 = element2.getBoundingClientRect();
  return bounds2.top < 100 && bounds2.bottom > 100;
}



let lista = ['liv-bio2','liv-bio3','liv-bio4','liv-bio5','liv-bio6','liv-bio7','liv-bio8','liv-cor2','liv-cor3','liv-cor4','liv-cor5','liv-cor6','liv-cor7','liv-cor8'];
let color = ['#FF007F','#004FFF','#28965A','#FF9000','#99007F','#00D300','#FF1C1C','#FF007F','#004FFF','#28965A','#FF9000','#99007F','#00D300','#FF1C1C'];
//  LEGENDA
document.querySelector(".lista-legend").addEventListener("click", function(e){

if(e.target.classList.contains("spento")){

  e.target.classList.remove("spento");
  e.target.classList.add("active");
  addLegenda(chapters[lista[e.target.id]].filtro1, chapters[lista[e.target.id]].filtro2, color[e.target.id], chapters[lista[e.target.id]].nome);

} else if(e.target.classList.contains("active")){
  e.target.classList.remove("active");
  e.target.classList.add("spento");
  map.removeLayer(lista[e.target.id]);

}
});

//  aggiunta colori legenda

let listaLi= document.querySelectorAll(".col-li")
console.log(listaLi);
for(let i = 0; i < listaLi.length; i++){
let aa = listaLi[i];
let bb = color[i];
aa.style.backgroundColor = color[i];
}








// https://www.w3schools.com/howto/howto_js_autocomplete.asp

//  SEARCH
var filterInput = document.getElementById('filter-input');

filterInput.addEventListener('keyup', function(e) {
       var value = e.target.value.trim().toLowerCase();


       });
