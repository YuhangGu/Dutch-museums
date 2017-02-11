/**
 * Created by Aero on 23/09/2016.
 */
//console.log("This will encode the cooridinate\n");

var fs = require('fs');
var fsairlines = require('fs');
var fswirting = require('fs');
var museums;

fs.readFile('data/museums.json', 'utf8', function (err, museumsdata) {
    //console.log(museumsdata);


    if (err) throw err;
    museums = JSON.parse(museumsdata);

    var index = 0;

    var musuem_list = [];



    museums.forEach(function(d,i){


        //var lat, log;

        var stringlink = d.locationlinkhref;

        var index_strat = stringlink.indexOf("%40");
        var index_coma = stringlink.indexOf(",");
        var index_end = stringlink.indexOf("&hl");

        var lat_lenth = index_coma - index_strat - 3;
        var log_lenth = index_end - index_coma-1;


        var lat_string = stringlink.substr(index_strat+3, lat_lenth);
        var log_string = stringlink.substr(index_coma+1, log_lenth);

        var website = d.linkshref;


        if(stringlink != "")
        {
            console.log(lat_string,log_string, index++);


            var item = {
                "type" : "Feature",
                "properties" : {
                    "name" : d.title,
                    "website" : website
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [ log_string,lat_string]
                }

            };

            musuem_list.push(item);
        }



    });


    var output = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": 1
        },
        "features": musuem_list
    }


    fswirting.writeFile('data/musuem_list.geojson', JSON.stringify(output, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved\n");
        }
    });


    /*

    var airpot_dict = {};

    airpots.forEach( function(d){
        var code = "NULL"
        code = d.code;
        var position = {
            "name" : d.airport_name,
            "country" : d.country,
            "geometry" : [d.longitude,d.latitude],
        };
        airpot_dict[code] = position;
    });


    var idencode = 0;



    var flights = JSON.parse(flightlinedata);

    var flowlist = [];

    flights.forEach(function (d){
        var origin = d.origin;
        var destination = d.dest;
        var seats_1, seats_2;

        if(d.seats_1)
        {
            seats_1  = parseInt(d.seats_1);
        }
        else
        {
            seats_1 = 0;
        }

        if(d.seats_2)
        {
            seats_2  = parseInt(d.seats_2);
        }
        else
        {
            seats_2 = 0;
        }

        var hub;

        if(d.hub == null)
        {
            console.log("hahaha there is no hub");
            console.log(" hub,seats_2,deptime_2,arrtime_2, elapsedtime_2\n",d.hub,seats_2,d.deptime_2,d.arrtime_2, d.elapsedtime_2);
            var flow = {
                "type" : "Feature",
                "properties" : {
                    "id" : idencode++,
                    "year" : d.year,
                    "origin" : origin,
                    "destination" : destination,
                    "origin_city" :airpot_dict[origin].name,
                    "destination_city" :airpot_dict[destination].name,
                    "origin_country" :airpot_dict[origin].country,
                    "destination_country" :airpot_dict[destination].country,
                    "seats_1" : seats_1,
                    "deptime_1" : d.deptime_1,
                    "arrtime_1" : d.arrtime_1,
                    "elapsedtime_1" : d.elapsedtime_1,
                    "hub" : null,
                    "seats_2" : null,
                    "deptime_2" : null,
                    "arrtime_2" : null,
                    "elapsedtime_2" : null
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [parseInt(airpot_dict[origin].geometry[0]),parseInt(airpot_dict[origin].geometry[1])],
                        [parseInt(airpot_dict[destination].geometry[0]),parseInt(airpot_dict[destination].geometry[1])],
                    ]
                }

            };
        }
        else
        {
            console.log("look! hubs");
            console.log(" hub,seats_2,deptime_2,arrtime_2, elapsedtime_2\n",d.hub,seats_2,d.deptime_2,d.arrtime_2, d.elapsedtime_2);
            var flow = {
                "type" : "Feature",
                "properties" : {
                    "id" : idencode++,
                    "year" : d.year,
                    "origin" : origin,
                    "destination" : destination,
                    "origin_city" :airpot_dict[origin].name,
                    "destination_city" :airpot_dict[destination].name,
                    "origin_country" :airpot_dict[origin].country,
                    "destination_country" :airpot_dict[destination].country,
                    "seats_1" : seats_1,
                    "deptime_1" : d.deptime_1,
                    "arrtime_1" : d.arrtime_1,
                    "elapsedtime_1" : d.elapsedtime_1,
                    "hub" : d.hub,
                    "hub_city" : airpot_dict[d.hub].name,
                    "seats_2" : seats_2,
                    "deptime_2" : d.deptime_2,
                    "arrtime_2" : d.arrtime_2,
                    "elapsedtime_2" : d.elapsedtime_2
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [parseInt(airpot_dict[origin].geometry[0]),parseInt(airpot_dict[origin].geometry[1])],
                        [parseInt(airpot_dict[d.hub].geometry[0]),parseInt(airpot_dict[d.hub].geometry[1])],
                        [parseInt(airpot_dict[destination].geometry[0]),parseInt(airpot_dict[destination].geometry[1])],
                    ]
                }

            };
        }

        flowlist.push(flow);

        if(idencode == 100)
        {
            //console.log(flowlist);
            console.log(flow.geometry.coordinates);
        }

    });

    //console.log("this airports are", airpot_dict);

    var allflows = {
        "type": "FeatureCollection",
        "metadata": {
            "generated": 1
        },
        "features": flowlist
    }

    //console.log("allflows",allflows);

    */


    /*
    fsairlines.readFile('data/flightdata.json', 'utf8', function(err, flightlinedata){
        //console.log(flightlinedata);

        var flights = JSON.parse(flightlinedata);

        var flowlist = [];

        flights.forEach(function (d){
            var origin = d.origin;
            var destination = d.dest;
            var seats_1, seats_2;

            if(d.seats_1)
            {
                seats_1  = parseInt(d.seats_1);
            }
            else
            {
                seats_1 = 0;
            }

            if(d.seats_2)
            {
                seats_2  = parseInt(d.seats_2);
            }
            else
            {
                seats_2 = 0;
            }

            var hub;

            if(d.hub == null)
            {
                console.log("hahaha there is no hub");
                console.log(" hub,seats_2,deptime_2,arrtime_2, elapsedtime_2\n",d.hub,seats_2,d.deptime_2,d.arrtime_2, d.elapsedtime_2);
                var flow = {
                    "type" : "Feature",
                    "properties" : {
                        "id" : idencode++,
                        "year" : d.year,
                        "origin" : origin,
                        "destination" : destination,
                        "origin_city" :airpot_dict[origin].name,
                        "destination_city" :airpot_dict[destination].name,
                        "origin_country" :airpot_dict[origin].country,
                        "destination_country" :airpot_dict[destination].country,
                        "seats_1" : seats_1,
                        "deptime_1" : d.deptime_1,
                        "arrtime_1" : d.arrtime_1,
                        "elapsedtime_1" : d.elapsedtime_1,
                        "hub" : null,
                        "seats_2" : null,
                        "deptime_2" : null,
                        "arrtime_2" : null,
                        "elapsedtime_2" : null
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [parseInt(airpot_dict[origin].geometry[0]),parseInt(airpot_dict[origin].geometry[1])],
                            [parseInt(airpot_dict[destination].geometry[0]),parseInt(airpot_dict[destination].geometry[1])],
                        ]
                    }

                };
            }
            else
            {
                console.log("look! hubs");
                console.log(" hub,seats_2,deptime_2,arrtime_2, elapsedtime_2\n",d.hub,seats_2,d.deptime_2,d.arrtime_2, d.elapsedtime_2);
                var flow = {
                    "type" : "Feature",
                    "properties" : {
                        "id" : idencode++,
                        "year" : d.year,
                        "origin" : origin,
                        "destination" : destination,
                        "origin_city" :airpot_dict[origin].name,
                        "destination_city" :airpot_dict[destination].name,
                        "origin_country" :airpot_dict[origin].country,
                        "destination_country" :airpot_dict[destination].country,
                        "seats_1" : seats_1,
                        "deptime_1" : d.deptime_1,
                        "arrtime_1" : d.arrtime_1,
                        "elapsedtime_1" : d.elapsedtime_1,
                        "hub" : d.hub,
                        "hub_city" : airpot_dict[d.hub].name,
                        "seats_2" : seats_2,
                        "deptime_2" : d.deptime_2,
                        "arrtime_2" : d.arrtime_2,
                        "elapsedtime_2" : d.elapsedtime_2
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [parseInt(airpot_dict[origin].geometry[0]),parseInt(airpot_dict[origin].geometry[1])],
                            [parseInt(airpot_dict[d.hub].geometry[0]),parseInt(airpot_dict[d.hub].geometry[1])],
                            [parseInt(airpot_dict[destination].geometry[0]),parseInt(airpot_dict[destination].geometry[1])],
                        ]
                    }

                };
            }

            flowlist.push(flow);

            if(idencode == 100)
            {
                //console.log(flowlist);
                console.log(flow.geometry.coordinates);
            }

        });

        //console.log("this airports are", airpot_dict);

        var allflows = {
            "type": "FeatureCollection",
            "metadata": {
                "generated": 1
            },
            "features": flowlist
        }

        //console.log("allflows",allflows);


        fswirting.writeFile('data/timeandflow.json', JSON.stringify(allflows, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved\n");
            }
        });

    });

    */


});


