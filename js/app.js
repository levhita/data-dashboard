var section = 'stats';

window.onload = function(){
       
    var officesSelect = id('offices-select');
    var cohortsSelect = id('cohorts-select');
    
    officesSelect.addEventListener('change', function() {
        fillOptions( Laboratoria.getCohortNames(this.value), cohortsSelect );
        fillOfficeSummary( Laboratoria.getOfficeSummary(this.value) );
    });
    
    cohortsSelect.addEventListener('change', function() {
        fillCohortSummary( Laboratoria.getCohortSummary(officesSelect.value, this.value) );
        fillStudents( Laboratoria.getStudents(id('offices-select').value, id('cohorts-select').value) );
    });
    
    fillOptions(Laboratoria.getOfficeNames(), officesSelect); 
    
    id('students-button').addEventListener('click',function() {
        section = 'students';
        id('stats').style="display:none";
        id('students').style="display:block";
        id('stats-button').classList.remove("active");
        id('students-button').classList.add("active");
        
        fillStudents( Laboratoria.getStudents(id('offices-select').value, id('cohorts-select').value) );
    });

    id('stats-button').addEventListener('click',function() {
        section = 'stats';
        id('students').style="display:none";
        id('stats').style="display:block";
        id('stats-button').classList.add("active");
        id('students-button').classList.remove("active");
        
        fillOfficeSummary( Laboratoria.getOfficeSummary(id('offices-select').value) );
        fillCohortSummary( Laboratoria.getCohortSummary(id('offices-select').value, id('cohorts-select').value) );
    });
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
    if(section!=='stats') return ;
    id('office-title').textContent = office.name;
    createBarGraph(id('office-activity'), office.activity);
    createBarGraph(id('office-satisfaction'), office.satisfaction);
    createBarGraph(id('office-score'), office.score);
}

function fillCohortSummary(cohort) {
    if(section!=='stats') return ;
    id('cohort-title').textContent = cohort.name;
    createPieGraph(id('cohort-activity'), cohort.activity);
    createBarGraph(id('cohort-satisfaction'), cohort.satisfaction);
    createBarGraph(id('cohort-success'), cohort.success);
    createPieGraph(id('cohort-success-total'), cohort.totalSuccess);
    createBarGraph(id('cohort-score'), cohort.score);
}

function fillStudents(students) {
    if(section!=='students') return ;
    id('students-title').textContent = students.title;
    var container = id('students-container');
    container.innerHTML='';
    
    var template = id('student-template').innerHTML;
    
    students.students.forEach(function(student){
        var newElement = fillTemplate(template, student.data, 'div', 'card')
        container.appendChild(newElement);
        if (student.sprints.length>1) {
            createBarGraph(newElement.getElementsByClassName('sprints')[0], student.sprints);
        }
    });
}