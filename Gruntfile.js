module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'enviro.min.js': ['enviro.js']
                }
            }
        },
        watch: {
            files: ['*.js'],
            tasks: ['uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify']);

};
