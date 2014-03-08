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

var RdioDbus = function(win) {

    var iface1 = obj.createInterface('org.mpris.MediaPlayer2')
    window.iface1 = iface1

    var _this = this

    iface1.addProperty('CanQuit', bools(true))
    iface1.addProperty('CanRaise', bools(true))
    iface1.addProperty('HasTrackList', bools(false))
    iface1.addProperty('Identity', {
        type: DBus.Define(String),
        getter: function(cb) {
            cb('Rdio')
        }
    })

    iface1.addMethod('Raise', {}, function() {
        win.focus()
    })
    iface1.addMethod('Quit', {}, function() {
        win.close(true)
    })

    var iface2 = obj.createInterface('org.mpris.MediaPlayer2.Player')
    window.iface2 = iface2

    iface2.addProperty('PlaybackStatus', {
        type: DBus.Define(String),
        getter: function(cb) {
            if (!_this.rdio) {
                cb({})
                return
            }
            if(_this.rdio.player.isPlaying())
                cb('Playing')
            else
                cb('Paused')
            console.log('PlaybackStatus')
        }
    })
    iface2.addProperty('Metadata', {
        type: DBus.Define(Object),
        getter: function(cb) {
            console.log('funyyy')
            var track = {}
            if (!_this.rdio) {
                track = {
                    key: '1',
                    duration: 120,
                    icon: 'http://www.accuradio.com/static/images/covers256//covers/a-f/avicii_true.jpg',
                    name: 'BUu',
                    artist: 'Avicii',
                    album: 'dadad'
                }
            } else {
                track = _this.rdio.player.playingTrack().attributes
                //window.atrack = atrack
            }
            
            cb({
                'mpris:trackid': '/org/mpris/MediaPlayer2/' + track.key,
                'mpris:length': track.duration,
                'mpris:artUrl': track.icon,
                'xesam:title': track.name,
                'xesam:artist': track.artist,
                'xesam:album': track.album
            })
        }
    })
    iface2.addProperty('Position', {
        type: DBus.Define(Number),
        getter: function(cb) {
            //console.log(rdio.player.position())
            //cb(rdio.player.position()*1000000)
            cb(3000)
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
        _this.rdio.player.next()
    })
    iface2.addMethod('Previous', {}, function() {
        _this.rdio.player.previous()
    })
    iface2.addMethod('Pause', {}, function() {
        _this.rdio.player.pause()
    })
    iface2.addMethod('PlayPause', {}, function() {
        _this.rdio.player.playPause()
    })
    iface2.addMethod('Stop', {}, function() {
        _this.rdio.player.setCurrentPosition(0)
        _this.rdio.player.pause()
    })
    iface2.addMethod('Play', {}, function() {
        _this.rdio.player.play()
    })
    iface2.addMethod('Seek', { in: [ DBus.Define(Number) ] }, function(x, callback) {
        console.log(x)
        _this.rdio.player.seek(x)
    })
    iface2.addMethod('SetPosition', { in: [ DBus.Define(String), DBus.Define(Number) ] }, function(o, x, callback) {
        console.log(o)
        _this.rdio.player.seek(x)
    })

    iface1.update()
    iface2.update()
}

module.exports = RdioDbus