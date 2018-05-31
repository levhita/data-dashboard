var Laboratoria = {
    data: data,
    getOfficeNames: function() {
        return Object.keys(data);
    },
    getCohortNames: function(office) {
        return Object.keys( data[office] );
    },
    /** Gets and extends office data **/
    getOfficeData:function(office){
        var officeData = {
            cohorts: data[office],
            name: office,
            summary: {},
        }
        return officeData;
    },
    /** Gets and extends cohort data **/
    getCohortData:function(office, cohort){
        var cohortData = data[office][cohort];
        cohortData.name = cohort;
        
        var summary = {};
        summary.activeStudentsNumber   = cohortData.students.filter( (student) => student.active).length;
        summary.inactiveStudents       = cohortData.students.filter( (student)=> !student.active);
        summary.inactiveStudentsNumber = summary.inactiveStudents.length;
        
        cohortData.summary = summary;
        return cohortData;
    }
}