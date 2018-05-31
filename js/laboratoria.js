var Laboratoria = {
    data: data,
    
    /** Gets a simple array with the office names */
    getOfficeNames: function() {
        return Object.keys(data);
    },
    
    /** Gets a simple array with the cohort names for the given office */
    getCohortNames: function(office) {
        return Object.keys( data[office] );
    },
    
    /** Gets and extends office data **/
    getOfficeData: function(office) {
        var officeData = {
            cohorts: data[office],
            name: office,
        }
        var summary = {
            activeStudentsNumber: 0,
            inactiveStudentsNumber: 0
        }

        Object.keys(officeData.cohorts).map(function(cohort){
            var cohortData = Laboratoria.getCohortData(office, cohort);
            summary.activeStudentsNumber += cohortData.summary.activeStudentsNumber;
            summary.inactiveStudentsNumber += cohortData.summary.inactiveStudentsNumber;
        });

        officeData.summary = summary;
        return officeData;
    },
    
    /** Gets and extends cohort data **/
    getCohortData: function(office, cohort) {
        var cohortData = data[office][cohort];
        cohortData.name = cohort;
        
        var summary = {};
        summary.activeStudentsNumber   = cohortData.students.filter( (student) => student.active).length;
        summary.inactiveStudents       = cohortData.students.filter( (student) => !student.active);
        summary.inactiveStudentsNumber = summary.inactiveStudents.length;
        
        summary.successfulStudents     =  0;
        summary.successfulStudentsHSE  =  0;
        summary.successfulStudentsTech =  0;

        cohortData.students.map( (student) => {
            if (Object.keys(student).length<=0) return;
            
            var extendedStudent = Laboratoria.extendStudentData(student);
            if (extendedStudent.successful)     summary.successfulStudents++;
            if (extendedStudent.successfulTech) summary.successfulStudentsTech++;
            if (extendedStudent.successfulHSE)  summary.successfulStudentsHSE++;
        });

        cohortData.summary = summary;
        return cohortData;
    },
    

    extendStudentData: function(student) {
        student.points  = 0;
        student.tech    = 0;
        student.hse     = 0;
        
        student.sprints.map( function(sprint) {
           student.points += sprint.score.tech + sprint.score.hse;
           student.tech += sprint.score.tech;
           student.hse += sprint.score.hse;
        });

        student.successful     = (student.points > (student.sprints.length*3000*0.7)) && student.active;
        student.successfulTech = (student.tech   > (student.sprints.length*1800*0.7)) && student.active;
        student.successfulHSE  = (student.hse    > (student.sprints.length*1200*0.7)) && student.active;
        return student;
    },

    /** Gets and extends student data **/
    getStudentData: function(office, cohort, student) {
        var studentData = data[office][cohort][student];
        if (Object.keys(studentData).length<=0) return null;
        return Laboratoria.extendStudentData(student);
    },
}