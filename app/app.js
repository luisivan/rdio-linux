var gui = require('nw.gui')

var RdioDbus = require('./app/dbus.js')

var win = gui.Window.get()
win.on('loaded', init)
win.on('close', win.hide)

function init() {
    var iframe = document.getElementsByTagName('iframe')[0]
    iframe.onload = function() {
        var rdio = iframe.contentWindow.R
        window.rdio = rdio
        new RdioDbus(win, rdio)
    }
}