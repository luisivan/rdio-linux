var DBus = require('dbus')
window.DBus = DBus

var dbus = new DBus()
window.dbus = dbus

var service = dbus.registerService('session', 'org.mpris.MediaPlayer2.rdio')
var obj = service.createObject('/org/mpris/MediaPlayer2')
window.obj = obj

var bools = function(val) {
    return {
        type: DBus.Define(Boolean),
        getter: function(callback) {
            callback(val)
        }
    }
}

var RdioDbus = function(win, rdio) {

    var iface1 = obj.createInterface('org.mpris.MediaPlayer2')
    window.iface1 = iface1

    iface1.addProperty('CanQuit', bools(true))
    iface1.addProperty('CanRaise', bools(true))
    iface1.addProperty('HasTrackList', bools(false))
    iface1.addProperty('SupportedUriSchemes', {
        type: DBus.Define(Array),
        getter: function(cb) {
            cb([])
        }
    })
    iface1.addProperty('SupportedMimeTypes', {
        type: DBus.Define(Array),
        getter: function(cb) {
            cb([])
        }
    })
    iface1.addProperty('Identity', {
        type: DBus.Define(String),
        getter: function(cb) {
            cb('RdioZZs')
        }
    })

    iface1.addMethod('Raise', {}, function() {
        win.focus()
    })
    iface1.addMethod('Quit', {}, function() {
        win.close(true)
    })
    iface1.addSignal('Seeked', {
        types: [
            DBus.Define(Number)
        ]
    })

    var iface2 = obj.createInterface('org.mpris.MediaPlayer2.Player')
    window.iface2 = iface2

    iface2.addProperty('PlaybackStatus', {
        type: DBus.Define(String),
        getter: function(cb) {
            console.log('uggg')
            cb('Playing')
        }
    })
    iface2.addProperty('Metadata', {
        type: DBus.Define(Object),
        getter: function(cb) {
            console.log('funyyy')
            console.log(cb)
            cb({
                'mpris:trackid': obj.path + "/1",
                'mpris:length': 10000,
                'mpris:artUrl': 'http://www.accuradio.com/static/images/covers256//covers/a-f/avicii_true.jpg',
                'xesam:title': 'Liar liar',
                'xesam:artist': 'Avicii',
                'xesam:album': 'True'
            })
        }
    })
    iface2.addProperty('Position', {
        type: DBus.Define(Number),
        getter: function(cb) {
            console.log(rdio.player.position())
            cb(rdio.player.position()*1000000)
        },
        setter: function(val, complete) {
            console.log(val)
            complete()
        }
    })
    iface2.addProperty('CanGoNext', bools(true))
    iface2.addProperty('CanGoPrevious', bools(true))
    iface2.addProperty('CanPlay', bools(true))
    iface2.addProperty('CanPause', bools(true))
    iface2.addProperty('CanSeek', bools(true))
    iface2.addProperty('CanControl', bools(true))

    iface2.addMethod('Next', {}, function() {
        rdio.player.next()
    })
    iface2.addMethod('Previous', {}, function() {
        rdio.player.previous()
    })
    iface2.addMethod('Pause', {}, function() {
        rdio.player.pause()
    })
    iface2.addMethod('PlayPause', {}, function() {
        rdio.player.playPause()
    })
    iface2.addMethod('Stop', {}, function() {
        rdio.player.setCurrentPosition(0)
        rdio.player.pause()
    })
    iface2.addMethod('Play', {}, function() {
        rdio.player.play()
    })
    iface2.addMethod('Seek', { in: [ DBus.Define(Number) ] }, function(x, callback) {
        console.log(x)
        rdio.player.seek(x)
    })
    iface2.addMethod('SetPosition', { in: [ DBus.Define(String), DBus.Define(Number) ] }, function(o, x, callback) {
        console.log(o)
    })

    iface1.update()
    iface2.update()
}

module.exports = RdioDbus