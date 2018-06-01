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
            satisfaction:[['Generación', 'Satisfechas', 'Insatisfechas']],
            score:[['Generación', 'Coaches', 'Jedis']],
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
    
    /** Gets the special summarized data needed for the ui */
    getCohortSummary: function(officeName, cohortName) {
        var office = this.sourceData[officeName];
        var cohort = office[cohortName];

        var summary = {
            name: cohortName,
            activity: [['Sprint','Activas', 'Inactivas']],
            satisfaction:[['Sprint', 'Satisfechas', 'Insatisfechas']],
            score:[['Sprint', 'Coaches', 'Jedis']],
            success:[['Sprint', 'Total', 'Tech', 'HSE']],
        };
        
        for (var i=1;i<=4;i++) {
            summary.success.push(["Sprint "+i, 0, 0, 0]);   
        }
        cohort.students.map( (student) => {
            var success = this.getSprintsSuccess(student);
            for (var i=0; i<success.length;i++) {
                if(success[i].total){summary.success[i+1][1]++};
                if(success[i].tech) {summary.success[i+1][2]++};
                if(success[i].hse)  {summary.success[i+1][3]++};
            }
        });

        cohort.ratings.map( (rating) => {
            var sprintName = "Sprint " + rating.sprint;
            summary.activity.push([
                sprintName,
                cohort.students.filter( student => student.active).length,
                cohort.students.filter( student => !student.active).length
            ]);
            summary.satisfaction.push([
                sprintName,
                rating.student.cumple + rating.student.supera,
                rating.student['no-cumple']
            ]);
            summary.score.push([sprintName, rating.teacher, rating.jedi]);
        });        
        return summary;
    },
    getSprintsSuccess: function(student) {
        var sprints = [];
        student.sprints.map(function(sprint) {
            var success = {
                total: false,
                tech: false,
                hse: false,
            }
            success.total = ((sprint.score.tech + sprint.score.hse) > (3000*0.7)) && student.active;
            success.tech  = (sprint.score.tech > (1800*0.7)) && student.active;
            success.hse   = (sprint.score.tech > (1200*0.7)) && student.active;
            
            sprints.push(success);
        });
        return sprints;
    },
}