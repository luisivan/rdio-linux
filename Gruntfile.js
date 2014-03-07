module.exports = function (grunt) {
    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: 'build',
                zip: true,
                mac: false,
                win: false,
                linux32: false,
                linux64: true
            },
            src: ['package.json', 'app/*']
        },
    })

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.task.registerTask('default', ['nodewebkit']);
};
