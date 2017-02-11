/**
 * Created by Aero on 23/09/2016.
 */
//console.log("This will encode the cooridinate\n");

var fs = require('fs');
var fsairlines = require('fs');
var fswirting = require('fs');
var airpots;

fs.readFile('data/bikestations.json', 'utf8', function (err, airportdata) {
    //console.log(airportdata);
    if (err) throw err;
    airpots = JSON.parse(airportdata);
    var airpot_dict = {};

    var stations = [];

    airpots.forEach( function(d){
       // console.log(d);
        var station = {
            "type": "Feature",
            "geometry": { "type": "Point",
                "coordinates": [d[2], d[1]]
            },
            "properties":{
                "id" : d[0].toString()
            }
        }
        stations.push(station)
    });


    var stationslist = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": 1
        },
        "features": stations
    }

    //console.log("allflows",allflows);


    fswirting.writeFile('data/stationgeojson.json', JSON.stringify(stationslist, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved\n");
        }
    });

});


