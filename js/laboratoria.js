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

            var cohortSummary = Laboratoria.getCohortSummary(officeName,cohortName);
            
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
            success:[['Sprint', 'Exitosas', 'Baja']],
        };
        
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
        /*cohort.ratings.map( (rating) => {
            var sprint = "Sprint "+ rating.sprint;
            var satisfied = rating.student.cumple + rating.student.supera;
            var unsatisfied = rating['no-cumple'];
            summary.satisfaction.push([sprint, satisfied, unsatisfied]);
        });*/
        
        //cohort
        
        return summary;
    }
}