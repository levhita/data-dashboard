window.onload = function(){
       
    var officesSelect = id('offices-select');
    var cohortsSelect = id('cohorts-select');
    
    officesSelect.addEventListener('change', function() {
        fillOptions( Laboratoria.getCohortNames(this.value), cohortsSelect );
        fillOfficeSummary( Laboratoria.getOfficeSummary(this.value) );
    });
    
    cohortsSelect.addEventListener('change', function() {
        fillCohortSummary( Laboratoria.getCohortSummary(officesSelect.value, this.value) );
    });
    
    fillOptions(Laboratoria.getOfficeNames(), officesSelect);  
}

function fillOptions(options, element){
    /** Empty the select before putting new elements **/
    while (element.options.length > 0) element.remove(0);
    
    /** Walk each value to create the options */
    options.map( function(option){
        var newOption = document.createElement('option');
        newOption.value = option;
        newOption.textContent = option;
        element.appendChild(newOption);
    });
    
    /** New options means a mandatory change trigger **/
    element.dispatchEvent(new Event('change'));
}

function fillOfficeSummary(office) {
    id('office-title').textContent = office.name;
    createBarGraph(id('office-activity'), office.activity);
    createBarGraph(id('office-satisfaction'), office.satisfaction);
    createBarGraph(id('office-score'), office.score);
}

function fillCohortSummary(cohort) {
    id('cohort-title').textContent = cohort.name;
    createBarGraph(id('cohort-activity'), cohort.activity);
    createBarGraph(id('cohort-satisfaction'), cohort.satisfaction);
    createBarGraph(id('cohort-success'), cohort.success);
    createBarGraph(id('cohort-score'), cohort.score);
}