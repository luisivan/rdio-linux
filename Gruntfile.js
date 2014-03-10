module.exports = function (grunt) {
    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: 'build',
                zip: true,
                mac: false,
                win: false,
                linux32: true,
                linux64: true
            },
            src: ['package.json', 'index.html', 'icon.png', 'app/*', 'node_modules/dbus/**']
        },
    })

    grunt.loadNpmTasks('grunt-node-webkit-builder')
    grunt.task.registerTask('default', ['nodewebkit'])
}