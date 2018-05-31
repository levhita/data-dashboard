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
}

function fillOfficeData(officeData) {
    document.getElementById('office-title').textContent = officeData.name;
    document.getElementById('office-active-students').textContent   = officeData.summary.activeStudentsNumber;
    document.getElementById('office-inactive-students').textContent = officeData.summary.inactiveStudentsNumber;
}

function fillCohortData(cohortData) {
    console.log(cohortData);
    
    var total_students = cohortData.students.length;
    var active= cohortData.summary.activeStudentsNumber;
    document.getElementById('cohort-title').textContent = cohortData.name;
    document.getElementById('cohort-active-students-number').textContent   =  cohortData.summary.activeStudentsNumber;
    document.getElementById('cohort-inactive-students-number').textContent = cohortData.summary.inactiveStudentsNumber;
    
    sucessfullStudents = cohortData.summary.successfulStudents + " ("+ Math.floor(cohortData.summary.successfulStudents/active*100) +"%)";
    document.getElementById('cohort-successful-students').textContent = sucessfullStudents;

    document.getElementById('cohort-successful-tech-students').textContent = cohortData.summary.successfulStudentsTech;
    document.getElementById('cohort-successful-hse-students').textContent =  cohortData.summary.successfulStudentsHSE;
}

console.log(data);