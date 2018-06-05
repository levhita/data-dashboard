google.charts.load('current', {'packages':['bar', 'corechart']});

function id(id) {
    return document.getElementById(id);
}

function createBarGraph(element, rawData) {
    var dataTable = google.visualization.arrayToDataTable(rawData);
    new google.charts.Bar(element).draw(dataTable, {bars:"vertical"});
}

function createPieGraph(element, rawData) {
    var dataTable = google.visualization.arrayToDataTable(rawData);
    new google.visualization.PieChart(element).draw(dataTable, {is3D: true});
}

function fillTemplate(template, data, elementType, className) {
    Object.keys(data).map(function(index){
        template = template.replace("{{"+index+"}}", data[index]);
    });
    var newElement = document.createElement(elementType);
    newElement.className=className;
    newElement.innerHTML = template;

    return newElement;
}