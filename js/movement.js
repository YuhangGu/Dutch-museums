/**
 * Created by Aero on 15/02/2017.
 */
var dataWorldGeo;
var dataShipment;
var citynameIndexMap = [];


var lastSelectedCity = null;
var selectedCity = null;
var drawingallSwith = true;


var cargolistforcolorScale = [];

var mySlider = null;

var maxForScale = 0;

var checkboxStatue = -1;
var currentYear = -1;


function migrationVisStart(e){

    loadWorldGeoData(function(){
        loadShipment( function(){
            init();
        });

    } );
}


function init(){

    visualizeIn2D();

}

//-------------- run time -----------------
function updateVisualizations(selectedCity){

    var index = citynameIndexMap.indexOf(selectedCity);
    drawingallSwith = false;

    //var thiscityData = migrationmatrix[index];
    Vis.g_flows2D.selectAll("." + Vis.className2Dflows).remove();

    drawFlowsOn2DMap(index);
    //highlightChord(index);
    //draw3DFlows(index);
    //draw3DSankeyFlows(index);
    update();

}


function getMax() {

    dataShipment.yearlyListCount.forEach(function (d) {
        var max = d3.max(d);

        if(max > maxForScale){
            maxForScale = max;
        }

    });
}

function highlightChord(index){
    var paths = Vis.g_chord.select("#chordRibbonGourp").selectAll("path");
    paths.each(function(d){
        if( d3.select(this).attr("source") == index ||
            d3.select(this).attr("target") == index) {
            d3.select(this).attr("class", "chordHighlightRibbon");
        }
        else{
            d3.select(this).attr("class", "chordMuteRibbon");
        }

    });
}