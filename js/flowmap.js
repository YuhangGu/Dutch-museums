
//storing the frequency of in-outgoing flights
var frequency_hourly_d = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
var frequency_hourly_a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

$(document).ready(function(){

    // define the base map
    var map_width = $("#flow-map").width();
    var map_height = 700;

    //for the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXRjYWVybyIsImEiOiJjaWxuZmtlOHQwMDA2dnNseWMybHhvMXh0In0.DObc4iUf1_86LxJGF0RHog';
    var map = new mapboxgl.Map({
        container: 'flow-map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [5.6495976, 52.3533156],
        zoom: 6.5
    });
    map.setMinZoom(5);
    map.setMaxZoom(15);

    var popup = new mapboxgl.Popup({
        closeOnClick: false,
        closeButton: false
    });

    var maplayer_list = [];
    var maplayerid_last = null;

    //for the calendar
    var svg_calendar = d3.select("#calendar").append("svg");
    var arrayMonth = new Array(30);
    var divTooltip_calendar = d3.select("body").append("div")
        .attr("class", "toolTip");

    //for the barchart
    var svg_barChart = d3.select("#barchart").append("svg")
        .attr('width', 800).attr('height', 200);
    var matixDaliy = new Array(24);
    var dateSelected = 0;

    //for the pie
    var svg_pie_gender = d3.select("#piechart_gender").append("svg").attr('width', 300).attr('height', 200);;

    var svg_pie_style = d3.select("#piechart_style").append("svg").attr('width', 300).attr('height', 200);;

    //----------processing-----------
    //createCalendar(drawCalendar);
    //drawOneDay();


    // not used now

    function filterBy(year, mag, index) {
        // Clear the popup if displayed.
        popup.remove();

        var filters = [
            "all",
            ["==", "year", year],
            [">=", "seats_1", 0],
            ["<", "seats_1", mag[0]]
        ];
        map.setFilter('flight-' + index, filters);
        yearLabel.textContent = year;
    }

    map.on('load', function () {


        d3.json('data/musuem_list.geojson', function (err, data) {

            console.log("data", data);

            map.addSource("musuems", {
                "type": "geojson",
                "data": data
            });

            map.addLayer({
                "id": "musuem",
                "type": "circle",
                "source": "musuems",
                "paint": {
                    "circle-radius": 4,
                    "circle-color": "#B42222"
                },
                //"filter": ["==", "$type", "Point"],
            });

        });


    });


    //------------functions-----------
    function createCalendar(callback) {

        for (var i = 0; i < 30; i++) {
            arrayMonth[i] = 0;
        }

        d3.json('data/biketrips.json', function (err, data) {
            //console.log(data);
            data.forEach(function (d) {

                var index = d[0] - 1;
                arrayMonth[index] += d[2];
            });

        });

        setTimeout(callback, 10);

    }

    function createDaliyBar(callback, callback1, date) {

        // the date starts with 0
        dateSelected = date;
        d3.json('data/biketrips.json', function (err, data) {

            data.forEach(function (d, i) {
                if (d[0] == date) {
                    //console.log("i", d[1], d[2]);
                    var index = d[1];
                    matixDaliy[index] = d;
                }

            });

        });

        setTimeout(callback, 20);
        setTimeout(callback1, 20);
    }

    function drawBarChart() {

        var width = 300;
        var height = 200;
        var padding = { top: 20 , right: 20, bottom: 20, left: 20 };

        svg_barChart.selectAll('g').remove();

        //console.log("matixDaliy", matixDaliy);
        svg_barChart.attr("transform", "translate(" + 60 + "," + 0 + ")")

        var g = svg_barChart.append('g').attr('class', "barchart")
            .attr("transform", "translate(" + padding.left + "," + padding.bottom + ")");

        var arrtemp = [];

        matixDaliy.forEach(function (d) {
            arrtemp.push(d[2]);
        });

        var maxday = d3.max(arrtemp);
        //console.log('max',maxday);

        if(maxday > max_tatal){

            max_tatal = maxday;
            console.log("max_tatal",max_tatal);
        }

        var scale_daliy = d3.scaleLinear().domain([0, max_tatal]).range([height - padding.bottom - padding.top, 0]);

        matixDaliy.forEach(function (d, i) {
            //console.log ("d", d[2]);
            g.append("rect")
                .style("fill", "#81D8D0")
                .style("opacity", 0.8)
                .attr('width', 10)
                .attr('height', function () {
                    return height - padding.top -padding.bottom - scale_daliy(d[2]);
                })
                .attr('x', (i-1) * 11 + padding.left )
                .attr('y', function () {
                    return scale_daliy(d[2] - padding.top -padding.bottom)
                })
                .on("mouseover", function () {
                    switchonMapLayer( i );
                })
                .on("mouseout", function (d) {
                    //switchoffMapLayer(i);
                });
        });

        var xAixsList = ["0","1","2","3","4","5","6","7", "8","9","10","11",
            "12","13","14","15","16","17","18","19","20","21","22","23"];

        var scale_axis_x = d3.scaleBand().domain(xAixsList).range([0, 275]).padding(20);
        var axis_x = d3.axisBottom(scale_axis_x);

        svg_barChart.append('g')
            .attr("class", "axis")
            .attr("width", width)
            .attr("height", 0)
            .attr("transform", "rotate( 90)")
            .attr("transform", "translate(" + (padding.left - 2)+"," +  (height - padding.top) + ")")
            .call(axis_x);


        var scale_axis_y = d3.scaleLinear().domain([0, max_tatal]).range([ height - padding.bottom - padding.top, 0]);
        var axis_y = d3.axisLeft(scale_axis_y).ticks(10);
        svg_barChart.append('g')
            .attr("class", "axis")
            .attr("width", 0)
            .attr("height", height)
            .attr("transform", "translate(" + padding.left +"," + padding.top + ")")
            .call(axis_y);

    }

    function drawPieChart() {

        svg_pie_gender.selectAll('g').remove();
        svg_pie_style.selectAll('g').remove();
        //console.log(matixDaliy);

        var arrayGender = [0, 0, 0];
        var arrayStyle = [0, 0, 0];

        matixDaliy.forEach(function (d) {
            arrayGender[0] = d[3] + arrayGender[0];
            arrayGender[1] = d[4] + arrayGender[1];
            arrayGender[2] = d[5] + arrayGender[2];
            arrayStyle[0] = d[6] + arrayStyle[0];
            arrayStyle[1] = d[7] + arrayStyle[1];
            arrayStyle[2] = d[8] + arrayStyle[2];
        });

        //Width and height
        var w = 200;
        var h = 200;

        var outerRadius = 60;
        var innerRadius = 30; // 0 => a pie

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.pie();

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var g1 = svg_pie_gender.append('g')
            .attr("transform", "translate(" + 50 + "," + 50 + ")");

        var arcs = g1.selectAll("g.arc")
            .data(pie(arrayGender))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        arcs.append("path")
            .attr("fill", function (d, i) {
                //console.log("d,i",i);
                return color(i);
            })
            .attr("d", arc);


        arcs.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr("font-size",12 )
            .text(function (d,i) {

                if(i ==0 ){
                    return "male";
                    //+ d.value;
                }
                if(i == 1 ){
                    return "female";
                    //+ d.value;
                }
                if(i == 2 ){
                    return "not known" ;
                    //+ d.value;
                }

            });


        var g2 = svg_pie_style.append('g')
            .attr("transform", "translate(" + 0 + "," + 50 + ")");

        var arcs2 = g2.selectAll("g.arc")
            .data(pie(arrayStyle))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        arcs2.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc);


        arcs2.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .text(function (d,i) {
                //return d.value;
                if(i ==0 ){
                    return "local";
                    //+ d.value;
                }
                if(i == 1 ){
                    return "short term";
                    //+ d.value;
                }
                if(i == 2 ){
                    return " " ;
                    //+ d.value;
                }
            });


    }

    function drawCalendar() {

        var g = svg_calendar.append('g').attr('class', 'calendar');
        var max = d3.max(arrayMonth);

        //console.log("arrayMonth",arrayMonth);

        var color_calender = d3.scaleLinear().domain([0, max]).range(["white", "steelblue"]);

        //console.log(arrayMonth);

        arrayMonth.forEach(function (d, i) {
            //console.log( d , i);
            g.append('rect')
                .attr('width', 30)
                .attr('height', 20)
                .attr('x', function () {
                    //console.log("i", i)
                    return 30 + 31 * ((i + 3) % 7);
                })
                .attr('y', function () {
                    return parseInt((i + 3) / 7) * 21;
                })
                .attr('fill', function () {
                    return color_calender(d);
                })
                .on("mousemove", function () {
                    divTooltip_calendar.style("left", d3.event.pageX + 10 + "px");
                    divTooltip_calendar.style("top", d3.event.pageY - 25 + "px");
                    divTooltip_calendar.style("display", "inline-block");
                    var elements = document.querySelectorAll(':hover');
                    //console.log("d",d);
                    divTooltip_calendar.html("September " + "the " + (i + 1).toString() + " th" + "<br>"
                        + "trips number: " + d.toString());

                })
                .on("mouseover", function () {
                    drawOneDay(i+1);
                })
                .on("mouseout", function (d) {
                    divTooltip_calendar.style("display", "none");
                });


        });

    }

    function drawOneDay(date) {
        createDaliyBar(drawBarChart, drawPieChart, date);
    }

    function switchonMapLayer( i ){
        var layer_choosen = "idLayer" + i;

        if(maplayerid_last == null)
        {
            maplayer_list.forEach(function(d){
                map.setLayoutProperty(d, 'visibility', 'none');
            });

            maplayerid_last = layer_choosen;

        }
        else{
            map.setLayoutProperty(maplayerid_last, 'visibility', 'none');
            maplayerid_last = layer_choosen;
        }

        //console.log("layer_choosen",layer_choosen);
        map.setLayoutProperty(layer_choosen, 'visibility', 'visible');

    }

    function switchoffMapLayer(i){
        var layer_choosen = "idLayer" + i;
        map.setLayoutProperty(layer_choosen, 'visibility', 'none');
    }

    //end

    var projection = d3.geo.azimuthalEquidistant()
        .scale(150)
        .translate([map_width / 2, map_height / 2])
        .clipAngle(180 - 1e-3)
        .precision(.1);

    //Define path generator
    var path = d3.geo.path().projection(projection);

    var svg = d3.select("#flow-map").append("svg")
        .attr("id","svg_flow")
        .attr("width", map_width)
        .attr("height", map_height)
        .attr("transform", "rotate(0,180,180)")
        .attr("transform", "translate(" + (-30)+"," + 50 + ")");

    var g_basemap = svg.append("g")
        .attr("class","basemap");

    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);


    var g_arcflows = svg.append("g").attr("id","group_flow");

    //-----------working processing--------

    drawBaseMap();
    drawAirLines();

    //-------------------------definition-------------------------

    function drawAirLines(  ) {

        d3.json("../data/arrivalflows.json", function (flights) {

            var bezierLine = d3.svg.line()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; })
                .interpolate("basis");

            g_arcflows.selectAll("arc")
                .data(flights.features)
                .enter()
                .append('path')
                .attr("d", function(d){
                    var b;
                    if(d.properties.origin == "KEF") {b = -1;}
                    else if(d.properties.destination == "KEF") {b = 1;}
                    var p0 = projection(d.geometry.coordinates[0]), p2 = projection(d.geometry.coordinates[1]);
                    var p1 = interplayPoint( p0,p2,b );
                    return bezierLine([p0,p1, p2])
                })
                .attr("id", function(d){
                    //console.log("flow_id_" + d.properties.hour);
                    //return "flow_id_" + d.properties.hour;

                    if(d.properties.origin == "KEF") {
                        return "flow_depature_id_" + d.properties.hour;
                    }
                    else if(d.properties.destination == "KEF") {
                        return "flow_arrival_id_" + d.properties.hour;
                    }


                })
                .attr("class", function(d){
                    if(d.properties.origin == "KEF") {return "flow_depature";}
                    else if(d.properties.destination == "KEF") {return "flow_arrival";}
                });

            /*
            g_flows.selectAll("line")
                .data(flights.features)
                .enter()
                .append("line")
                .attr("x1", function(d) { return projection(d.geometry.coordinates[0])[0];  })
                .attr("y1", function(d) { return projection(d.geometry.coordinates[0])[1];  })
                .attr("x2", function(d) { return projection(d.geometry.coordinates[1])[0];  })
                .attr("y2", function(d) { return projection(d.geometry.coordinates[1])[1];  })
                .attr("class", function(d){
                    if(d.properties.origin == "KEF")
                    {
                        return "flow_depature";
                    }
                    else if(d.properties.destination == "KEF")
                    {
                        return "flow_arrival";
                    }
                });
                */

            //read the data to create frequency array
            flights.features.forEach( function(d){

                // depature is KEF
                if(d.properties.origin == "KEF"){
                    var index = parseInt(d.properties.hour, 10);
                    frequency_hourly_d[index]++;
                }
                else if(d.properties.destination == "KEF")
                {
                    var index = parseInt(d.properties.hour, 10);
                    frequency_hourly_a[index]++;
                }


            });

            //console.log("frequency_hourly_d ",frequency_hourly_d);
            //console.log("frequency_hourly_a ",frequency_hourly_a);
            drawBarChart();
            drawChordChart();

        });

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", map_width)
            .attr("height", map_height)
            .call(zoom);
    }

    function drawBaseMap() {

        d3.json("../data/world-110m.json", function (error, world) {
            g_basemap.append("path", ".circle")
                .datum(topojson.object(world, world.objects.land))
                .attr("class", "basemap")
                .attr("d", path);
        });

    }


    function zoomed() {
        g_basemap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        g_basemap.select(".basemap").style("stroke-width", .5 / d3.event.scale + "px");
        //g_flows.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        //g_flows.select(".flow").style("stroke-width", .5 / d3.event.scale + "px");
        g_arcflows.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        g_arcflows.select(".flow").style("stroke-width", .5 / d3.event.scale + "px");

    }

    d3.select(self.frameElement).style("height", height + "px");

});


//_____________definitions_____________

function drawBarChart(){

    var map_width = $("#bar-chart-iceland").width();
    var map_height = 300;

    var svg = d3.select("#bar-chart-iceland").append("svg")
        .attr("id", "barchart")
        .attr("width", map_width)
        .attr("height", map_height);

    var margin = {top: 30, right: 30, bottom: 10, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var g_depature = svg.append("g").attr("transform", "translate(" + map_width/2+ "," + margin.top + ")");
    var g_arrival = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var g_labels = svg.append("g").attr("transform", "translate(" + 0 + "," + margin.top + ")");
    var g_legend = svg.append("g").attr("transform", "translate(" + 0 + "," + margin.top + ")");

    width = width/2;

    // top -- down graphic
    var y = d3.scaleBand().domain(frequency_hourly_d.map(function(d,i){return i;})).range([0, height])
        .paddingInner(0.3);
    var max_d = d3.max(frequency_hourly_d);
    var max_a = d3.max(frequency_hourly_a);
    var x = d3.scaleLinear().domain([0, d3.max([max_a,max_d])]).range([0, width]);

    //drawing bar chart for depature
    var color_last;

    var bar_depature = g_depature.selectAll(".bar")
        .data(frequency_hourly_d)
        .enter().append("rect")
        .attr("class","bar_depature")
        .attr("y", function(d,i){
            return y(i);
        })
        .attr("width", function(d,i){
            return x(d);
        })
        .attr("height", y.bandwidth())
        .attr("transform", function(d){
            var k = margin.right/3;
            return "translate(" + k  + "," + 0 + ")"
        })
        .on("mouseover", function (d,i) {

            color_last = d3.select(this).style("fill");
            //console.log("color",color_last);
            d3.select(this).style("fill", "#ffff00");

            var x = d3.select(this).attr("x");
            var width_x = d3.select(this).attr("width") ;
            var y = d3.select(this).attr("y");
            var width_y = d3.select(this).attr("height");

            g_depature.append("text")
                .attr("class", "label_temp")
                .attr("x", x)
                .attr("y", y)
                .attr("transform", "translate(" + width_x + "," + width_y + ")")
                .text(d);

        })
        .on("mouseout", function (d,i) {
            d3.select(this).style("fill", color_last);
            g_depature.selectAll(".label_temp").remove();
        });

    //drawing bar chart for arrival
    var bar_arrival = g_arrival.selectAll(".bar")
        .data(frequency_hourly_a)
        .enter().append("rect")
        .attr("class","bar_arrival")
        .attr("y", function(d,i){
            return y(i);
        })
        .attr("width", function(d,i){
            return x(d);
        })
        .attr("height", y.bandwidth())
        .attr("transform", function(d){
            var k = width - x(d) -margin.right/3;
            return "translate(" + k  + "," + 0 + ")"
        })
        .on("mouseover", function (d,i) {

            color_last = d3.select(this).style("fill");
            //console.log("color",color_last);
            d3.select(this).style("fill", "#ffff00");

            var x = d3.select(this).attr("x");
            var width_x = d3.select(this).attr("width") ;
            var y = d3.select(this).attr("y");
            var width_y = d3.select(this).attr("height");


            //console.log("x,y", x, y);
            g_arrival.append("text")
                .attr("class", "label_temp")
                .attr("y", y)
                .attr("transform", "translate(" + (width - width_x )+ "," + width_y + ")")
                .text(d);


        })
        .on("mouseout", function (d,i) {
            d3.select(this).style("fill", color_last);
            g_arrival.selectAll(".label_temp").remove();
        });


    var aixe_labels = g_labels.selectAll(".label")
        .data(frequency_hourly_a).enter().append("text")
        .attr("class","label")
        .attr("x", map_width/2)
        .attr("y",function(d,i){
            return y(i) + y.bandwidth()/2;
        })
        .text( function(d, i){
            return i ;
        })
        .attr("height",y.bandwidth())
        .on("mouseover", function (d,i) {
            color_last = d3.select(this).style("fill");
            d3.select(this).style("fill", "#ffff00");

        })
        .on("mouseout", function (d,i) {
            d3.select(this).style("fill", color_last);

        })
        .on("click", function(d, i){
            var idnum = d3.select(this).text();

            var g = d3.select("#flow-map").select("#svg_flow").select("#group_flow");

            // flow_depature_id_
            //var gg = $("#group_flow");
            //console.log( g , "\n",gg);
            g.selectAll(".flow_depature").attr("class", "flow_depature_gone");
            g.selectAll(".flow_arrival").attr("class", "flow_arrival_gone");

            g.selectAll( "#flow_depature_id_" + idnum).attr("class","flow_depature" );
            g.selectAll( "#flow_arrival_id_" + idnum).attr("class","flow_arrival" );
           // g_arcflows.select("#" + string).attr();

        });

    g_legend.append("text")
        .attr("class","label_legend")
        .attr("x", map_width/4*3)
        .attr("y", -margin.bottom)
        .attr("fill",  " #46b39d")
        .text("depature");
    g_legend.append("text")
        .attr("class","label_legend")
        .attr("x", map_width/4)
        .attr("y", -margin.bottom)
        .attr("fill",  " #c3a130")
        .text("arrival");
    g_legend.append("text")
        .attr("class","label_legend")
        .attr("x", map_width/2)
        .attr("y", -margin.bottom)
        .attr("fill",  " #8a8c8d")
        .text("time");

}

function drawChordChart(){
    var map_width = $("#chord-chart-iceland").width();
    var map_height = 300;

    var svg = d3.select("#chord-chart-iceland").append("svg")
        .attr("id", "text_test")
        .attr("width", map_width)
        .attr("height", map_height);

    var margin = {top: 30, right: 30, bottom: 10, left: 30},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

}

function interplayPoint(p1, p2 , b){

    var x1 = p1[0], y1 = p1[1],
        x2 = p2[0], y2 = p2[1];

    var x3 = x1*3/4 + x2/4, y3 = y1*3/4 + y2/4;
    var k = (y2-y1)/(x2-x1);
    var l_raw = (y2-y1)*(y2-y1) + (x2-x1)* (x2-x1);
    var l = Math.sqrt(l_raw)/4;
    // x4 = x3 +/- ()
    // y4 = y3 +/- ()
    var x4 = x3 - b*k*l/Math.sqrt(1+k*k);

    var y4 = y3 + b*l/Math.sqrt(1+k*k);
    var p = [x4,y4];
    return p;

}




