var gui = require('nw.gui'),
    fs = require('fs'),
    RdioDbus = require('./app/dbus.js')

var win = gui.Window.get()
win.on('loaded', init)
win.on('close', win.hide)

var bus = new RdioDbus(win)

function init() {

    var iframe = document.getElementsByTagName('iframe')[0]

    function injectCSS() {
        var css = document.createElement("style")
        css.type = "text/css"
        fs.readFile('app/rdio.css', function(err, data) {
            css.appendChild(document.createTextNode(data))
            iframe.contentDocument.getElementsByTagName("head")[0].appendChild(css)
        })
    }

    iframe.onload = function() {

        iframe.contentWindow.onkeyup = function(e) {
            if (e.which == 122)
                win.toggleFullscreen()
        }

        injectCSS()

        bus.rdio = iframe.contentWindow.R
        bus.updateMetadata()
        bus.rdio.player.on('change:playState', function() {
            bus.updateState()
        })
        bus.rdio.player.on('change:playingTrack', function() {
            bus.updateMetadata()
        })
        bus.rdio.player.on('change:position', function(obj, x) {
            //playerIface.emit('Seeked', x*1000000)
        })
    }
    
}