var populate_table = function ($table, data) {
    var platformKeys = []
    $.map($table.find('th.PlatformKey'), function(e) { platformKeys.push(e.id);});

    // Get the trip ids for the starting station
    var tripIdsFromStart = []
    var tripsFromStart = []
    data.map( function(element) {
        if( element.PlatformKey === platformKeys[0] ) {
            tripIdsFromStart.push(element.Trip);
            tripsFromStart.push(element);
        }
    });

    // Sort those by the time they arrive at the starting station
    tripsFromStart.sort( function (a,b) {
        var da = Date.parse(a.Time);
        var db = Date.parse(b.Time);
        if ( da > db ) return 1;
        if ( da < db ) return -1;
        return 0;
    });
    
    if ( tripIdsFromStart.length === 0) {
        $table.after("<em>No times reported</em>");
    } else {
        // Get the info for each desired station for each trip that comes through the starting station
        var trips = {}
        data.map( function(element) {
           if( platformKeys.indexOf(element.PlatformKey) >= 0 && tripIdsFromStart.indexOf(element.Trip) >= 0){
               if( trips[element.Trip] === undefined) {
                   trips[element.Trip] = {}
               }
               trips[element.Trip][element.PlatformKey] = element;
           }
        });

        // Create a row in the table for each train
        $table.find('tr.arrival').remove();
        for( var i in tripsFromStart) {
            var trip = trips[tripsFromStart[i].Trip]
            var $row = $("<tr class='arrival'></tr>");
            for( j in platformKeys ) {
                var platformKey = platformKeys[j];
                var station = trip[platformKey];
                var time = Date.parse(station.Time);
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
