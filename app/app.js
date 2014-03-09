var gui = require('nw.gui')

var RdioDbus = require('./app/dbus.js')

var win = gui.Window.get()
win.on('loaded', init)
win.on('close', win.hide)

var rdio = {}
window.bus = new RdioDbus(win)

function init() {
    var iframe = document.getElementsByTagName('iframe')[0]
    iframe.onload = function() {
        var rdio = iframe.contentWindow.R
        bus.rdio = rdio
        window.rdio = rdio
        bus.updateMetadata()
        rdio.player.on('change:playState', function() {
            bus.updateState()
        })
        rdio.player.on('change:playingTrack', function() {
            bus.updateMetadata()
        })
        rdio.player.on('change:position', function(obj, x) {
            //console.warn(x)
            //playerIface.emit('Seeked', x*1000000)
        })
        
    }

}
/*
adBlockerDetected: Array[1]
change:autoPlay: Array[1]
change:isMaster: Array[1]
change:masterPlayerId: Array[1]
change:playState: Array[2]
change:playingAd: Array[2]
change:playingSource: Array[63]
change:playingTrack: Array[3]
change:position: Array[2]
change:repeat: Array[1]
change:showTimeLeft: Array[1]
change:shuffle: Array[1]
change:sourcePosition: Array[63]
change:station: Array[1]
change:volume: Array[1]
loaded: Array[1]
loading: Array[1]
loading:error: Array[1]*/