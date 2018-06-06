var Laboratoria = {
    sourceData: data,
    
    /** Gets a simple array with the office names */
    getOfficeNames: function() {
        return Object.keys(data);
    },
    
    /** Gets a simple array with the cohort names for the given office */
    getCohortNames: function(office) {
        return Object.keys( data[office] );
    },
    
    /** Gets the special summarized data needed for the ui */
    getOfficeSummary: function(officeName) {
        var office = this.sourceData[officeName];
        
        var summary = {
            name: officeName,
            activity: [['Generación','Activas', 'Inactivas']],
            satisfaction: [['Generación', 'Sí', 'No']],
            score: [['Generación', 'Coaches', 'Jedis']],
        }
        
        Object.keys(office).map( function(cohortName) {
            var cohort = office[cohortName];
            
            var active = cohort.students.filter( student => student.active).length;
            var inactive = cohort.students.filter( student => !student.active).length;
            summary.activity.push([cohortName, active, inactive]);
            
            var satisfied = 0;
            var unsatisfied = 0;
            var sprints = 0;
            var coaches = 0;
            var jedis = 0;
            
            cohort.ratings.map( (rating) => {
                satisfied += rating.student.cumple + rating.student.supera;
                unsatisfied += rating.student['no-cumple'];
                coaches += rating.teacher;
                jedis += rating.jedi;
                sprints++;
            });
            
            summary.satisfaction.push([cohortName, satisfied/sprints, unsatisfied/sprints]);
            summary.score.push([cohortName, coaches/sprints, jedis/sprints]);
        });
        
        return summary;
    },
    
    /** Students ready to be drawn in the ui */
    getStudents: function(officeName, cohortName) {
        var office = this.sourceData[officeName];
        var cohort = office[cohortName];
        students = [];
            
        cohort.students.map((student) =>{
            if(Object.keys(student).length<=0) return;
            
            var sprintData = [['Sprints', 'Total', 'Tech', 'HSE']];
            
            var sprints = student.sprints.length;
            var total = 0;
            var tech  = 0
            var hse   = 0;
            
            student.sprints.map(function(sprint){
                sprintData.push([
                    'Sprint '+ sprint.number,
                    sprint.score.tech+sprint.score.hse,
                    sprint.score.tech,
                    sprint.score.hse,
                ]);
                total += sprint.score.tech+sprint.score.hse;
                tech  += sprint.score.tech;
                hse   += sprint.score.hse;
            });
                        
            var newStudent = {
                data: {
                    name: student.name,
                    photo: student.photo,
                    active: student.active?'success':'fail',
                    total: (total > (3000*sprints*0.7))?'success':'fail',
                    tech: (tech > (1800*sprints*0.7))?'success':'fail',
                    hse: (hse > (1200*sprints*0.7))?'success':'fail',
                },
                sprints: sprintData,
                
            }
            students.push(newStudent);
        });
        return {
            title: officeName+"/"+cohortName,
            students: students
        };
    },
    
    /** Gets the special summarized data needed for the ui */
    getCohortSummary: function(officeName, cohortName) {
        var office = this.sourceData[officeName];
        var cohort = office[cohortName];
        
        var summary = {
            name: cohortName,
            activity: [['Estatus', 'Cantidad']],
            satisfaction:[['Sprints', 'Sí', 'No']],
            score:[['Sprints', 'Coaches', 'Jedis']],
            success:[['Sprints', 'Total', 'Tech', 'HSE']],
            totalSuccess: [['Estatus', 'Cantidad']],
        };
        
        for (var i=1;i<=4;i++) {
            summary.success.push(["Sprint "+i, 0, 0, 0]);   
        }
        summary.activity.push(['Activas', cohort.students.filter( student => student.active).length ] );
        summary.activity.push(['Inactivas', cohort.students.filter( student => !student.active).length ] );
        
        var successful = 0;
        cohort.students.forEach( (student) => {
            if(Object.keys(student).length<=0) return;
            
            var success = this.getSprintsSuccess(student);
            for (var i=0;i<success.length;i++) {
                if(success[i].total){summary.success[i+1][1]++};
                if(success[i].tech) {summary.success[i+1][2]++};
                if(success[i].hse)  {summary.success[i+1][3]++};
            }
            if ( this.getStudentSuccess(student) ) {successful++};
        });
        summary.totalSuccess.push(['Sí', successful]);
        summary.totalSuccess.push(['No',  cohort.students.length-successful]);
        
        cohort.ratings.map( (rating) => {
            var sprintName = "Sprint " + rating.sprint;
            
            summary.satisfaction.push([
                sprintName,
                rating.student.cumple + rating.student.supera,
                rating.student['no-cumple']
            ]);
            summary.score.push([sprintName, rating.teacher, rating.jedi]);
        });        
        return summary;
    },
    /** Get the success status for a student **/
    getSprintsSuccess: function(student) {
        
        return student.sprints.map(function(sprint) {
            var success = {
                total: false,
                tech: false,
                hse: false,
            }
            success.total = ((sprint.score.tech + sprint.score.hse) > (3000*0.7)) && student.active;
            success.tech  = (sprint.score.tech > (1800*0.7)) && student.active;
            success.hse   = (sprint.score.tech > (1200*0.7)) && student.active;
            
            return success;
        });
    },
    
    /** Get the success status for a student **/
    getStudentSuccess: function(student) {
        if (!student.active) { return false; }
        
        var total = 0;
        student.sprints.forEach(function(sprint) {
            total  += sprint.score.tech + sprint.score.hse;
        });
        
        return (total > (3000*0.7*student.sprints.length)); 
    },
}