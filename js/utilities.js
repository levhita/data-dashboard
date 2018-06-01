google.charts.load('current', {'packages':['bar']});

function id(id) {
    return document.getElementById(id);
}

function createBarGraph(element, rawData) {
    var dataTable = google.visualization.arrayToDataTable(rawData);
    new google.charts.Bar(element).draw(dataTable, {bars:"vertical"});
}