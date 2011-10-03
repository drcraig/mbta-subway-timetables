var populate_table = function ($table, data) {
    var platformKeys = []
    $.map($table.find('th.PlatformKey'), function(e) { platformKeys.push(e.id);});

    // Get the trip ids for the starting station
    var tripsFromStart = []
    data.map( function(element) {
        if( element.PlatformKey === platformKeys[0] ) {
            tripsFromStart.push(element.Trip)
        }
    });
    
    if ( tripsFromStart.length === 0) {
        $table.after("<em>No times reported</em>");
    } else {
        // Get the info for each desired station for each trip that comes through the starting station
        var trips = {}
        data.map( function(element) {
           if( platformKeys.indexOf(element.PlatformKey) >= 0 && tripsFromStart.indexOf(element.Trip) >= 0){
               if( trips[element.Trip] === undefined) {
                   trips[element.Trip] = {}
               }
               trips[element.Trip][element.PlatformKey] = element;
           }
        });

        // Create a row in the table for each train
        for( var i in trips) {
            var trip = trips[i]
            var $row = $("<tr></tr>");
            console.log(i);
            for( j in platformKeys ) {
                var platformKey = platformKeys[j];
                var station = trip[platformKey];
                console.log(station);
                console.log(station.Time);
                var time = Date.parse(station.Time);
                console.log(time);
                var $cell = $("<td>"+time.toString("h:mm tt")+"</td>");
                $cell.append('<br />')
                $cell.append('<abbr class="timeago" title="'+time.toISOString()+'">'+station.TimeRemaining+'<abbr>');
                $row.append($cell);
            }
            $table.append($row);
        }
        $.timeago.settings.allowFuture = true;
        $("abbr.timeago").timeago();
    }
}
