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
        copy: {
            bin: {
                expand: true,
                cwd: 'build/releases/Rdio/linux'+process.arch.replace('x', '')+'/Rdio/',
                src: ['libffmpegsumo.so', 'nw.pak', 'Rdio'],
                dest: process.env['HOME'] + '/.local/share/Rdio/',
                flatten: true,
            },
            icon: {
                src: 'Rdio.png',
                dest: process.env['HOME'] + '/.local/share/icons/',
            },
            desktop: {
                src: 'Rdio.desktop',
                dest: process.env['HOME'] + '/.local/share/applications/',
            }
        },
        chmod: {
            options: {
                mode: '755'
            },
            bin: {
                src: process.env['HOME'] + '/.local/share/Rdio/Rdio'
            }
        }
    })

    grunt.loadNpmTasks('grunt-node-webkit-builder')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-chmod')
    grunt.task.registerTask('default', ['nodewebkit', 'copy', 'chmod'])
}