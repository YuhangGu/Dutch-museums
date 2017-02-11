/**
 * Created by Aero on 23/09/2016.
 */
//console.log("This will encode the cooridinate\n");

var fs = require('fs');
var fsstations = require('fs');
var fswirting = require('fs');
var biketrips;
var station_id_map = new Map();
var ingoinglist_byday = []
fs.readFile('data/ingoing_links.json', 'utf8', function (err, biketripsdata) {

    //console.log("station_id_map",station_id_map);

    if (err) throw err;

    fsstations.readFile('data/stations.json', 'utf8',function(err, stationsdata){

        var stations = JSON.parse(stationsdata);
        //console.log("stations", stations);

        stations.forEach(function(d){
            //console.log("stations", d);
            var arr = [d[2], d[1]];
            station_id_map[ d[0].toString()] = arr;
        });

        //console.log("station_id_map", station_id_map);


        // map the ID ==> coordinate
        biketrips = JSON.parse(biketripsdata);

        var ingoinglist_everyhour = [];
        biketrips.forEach( function(d){

            var ingoinglist_byhour = [];

            //console.log( d[1] , d.length);
           // var count_trips = d.length - 2;
            //console.log("station_id_map",station_id_map);

            for (var i = 2; i < d.length; i++){

                var startid =  d[i][0].toString();

                //console.log("the time", d[1], "the start", startid);
                var temp = d[i][1];
                //console.log(temp.keys());

                //console.log("startid",startid);

                for( var key in temp){
                    //console.log("keys", key);

                    if(key.toString() == null){
                        console.log("fuck");
                    }

                    var endid = key.toString();
                    var startpoint = station_id_map[startid];
                    //console.log("startpoint", startpoint);
                    var endpoint = station_id_map[endid];
                    var trip_item = [startpoint,endpoint ];

                    ingoinglist_byhour.push(trip_item);

                    //console.log("trip_item", trip_item[0]);

                }

            }



            var ingoing_byhour = {
                "type": "Feature",
                "geometry": { "type": "MultiLineString",
                    "coordinates": ingoinglist_byhour//keep the lines
                },
                "properties":{
                    "time" : d[1].toString() // the hour
                }
            }

            ingoinglist_byday.push(ingoing_byhour);

        });


        var ingoingdata_byday = {
            "type": "FeatureCollection",
            "metadata": {
                "generated": 1
            },
            "features": ingoinglist_byday
        }


        fswirting.writeFile('data/biketrips_ingoing.json', JSON.stringify(ingoingdata_byday, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved\n");
            }
        });

    });



});


