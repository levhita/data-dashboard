window.onload = function(){
    var officesSelect = document.getElementById('offices-select');
    var cohortsSelect = document.getElementById('cohorts-select');
    
    officesSelect.addEventListener('change', function() {
        fillOptions( Laboratoria.getCohortNames(this.value), cohortsSelect );
        fillOfficeData( Laboratoria.getOfficeData(this.value) );
    });
    
    cohortsSelect.addEventListener('change', function() {
        fillCohortData( Laboratoria.getCohortData(officesSelect.value, this.value) );
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
};

function fillOfficeData(officeData) {
    var officeTitle = document.getElementById('office-title');
    officeTitle.textContent = officeData.name;
};

function fillCohortData(cohortData) {
    document.getElementById('cohort-title').textContent = cohortData.name;
    document.getElementById('cohort-active-students-number').textContent = cohortData.summary.activeStudentsNumber;
    document.getElementById('cohort-inactive-students-number').textContent = cohortData.summary.inactiveStudentsNumber;
}

console.log(data);