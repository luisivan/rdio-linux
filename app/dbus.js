var DBus = require('dbus'),
    download = require('download')

var dbus = new DBus()

var service = dbus.registerService('session', 'org.mpris.MediaPlayer2.rdio')
var obj = service.createObject('/org/mpris/MediaPlayer2')

var bools = function(val) {
    return {
        type: DBus.Define(Boolean),
        getter: function(callback) {
            callback(val)
        }
    }
}

var RdioDbus = function(win) {

    var _this = this

    this.updateMetadata = function() {
        var track = _this.rdio.player.playingTrack().attributes

        download({ url: track.icon, name: track.key + '.jpg' }, '/tmp')

        track = {
            'mpris:trackid': '/com/rdio/MediaPlayer2/' + track.key,
            'mpris:length': track.duration*1000000,
            'xesam:title': track.name,
            'xesam:artist': track.artist,
            'xesam:album': track.album,
            'mpris:artUrl': 'file:///tmp/' + track.key + '.jpg'
        }
        propertiesChanged({'Metadata': track})
        return track
    }

    this.updateState = function() {
        var state = (_this.rdio.player.isPlaying()) ? 'Playing' : 'Paused'
        propertiesChanged({'PlaybackStatus': state})
        return state
    }

    var propertiesChanged = function(data) {
        propIface.emit('PropertiesChanged', playerIface.name, data, [])
    }

    var propIface = obj.createInterface('org.freedesktop.DBus.Properties')

    propIface.addSignal('PropertiesChanged', {
        types: [
            DBus.Define(String),
            DBus.Define(Object),
            {type: 'as'}
        ]
    })

    // propIface.on('PropertiesChanged', function(name, changedProps, ignoreProps) { })

    var appIface = obj.createInterface('org.mpris.MediaPlayer2')
    window.appIface = appIface

    appIface.addProperty('CanQuit', bools(true))
    appIface.addProperty('CanRaise', bools(true))
    appIface.addProperty('HasTrackList', bools(false))
    appIface.addProperty('Identity', {
        type: DBus.Define(String),
        getter: function(cb) {
            cb('Rdio')
        }
    })

    appIface.addMethod('Raise', {}, function() {
        win.focus()
    })
    appIface.addMethod('Quit', {}, function() {
        win.close(true)
    })

    var playerIface = obj.createInterface('org.mpris.MediaPlayer2.Player')
    window.playerIface = playerIface

    playerIface.addProperty('PlaybackStatus', {
        type: DBus.Define(String),
        getter: function(cb) {
            if (!_this.rdio) return cb('Paused')

            var state = (_this.rdio.player.isPlaying()) ? 'Playing' : 'Paused'
            cb(state)
        }
    })
    playerIface.addProperty('Metadata', {
        type: DBus.Define(Object),
        getter: function(cb) {
            var track = {}
            if (_this.rdio)
                track = _this.updateMetadata()
                
            cb(track)
        }
    })
    playerIface.addProperty('Position', {
        type: DBus.Define(Number),
        getter: function(cb) {
            if (!_this.rdio) return cb(0)

            cb(_this.rdio.player.position()*1000000)
        }
    })
    var rate = {
        type: {type: 'd'},
        getter: function(cb) {
            cb(1)
        }
    }
    playerIface.addProperty('Rate', rate)
    playerIface.addProperty('MinimumRate', rate)
    playerIface.addProperty('MaximumRate', rate)
    playerIface.addProperty('CanGoNext', bools(true))
    playerIface.addProperty('CanGoPrevious', bools(true))
    playerIface.addProperty('CanPlay', bools(true))
    playerIface.addProperty('CanPause', bools(true))
    playerIface.addProperty('CanSeek', bools(true))
    playerIface.addProperty('CanControl', bools(true))

    playerIface.addMethod('Next', {}, function() {
        _this.rdio.player.next()
        _this.updateMetadata()
        propertiesChanged({'PlaybackStatus': 'Playing'})
    })
    playerIface.addMethod('Previous', {}, function() {
        _this.rdio.player.previous()
        _this.updateMetadata()
        propertiesChanged({'PlaybackStatus': 'Playing'})
    })
    playerIface.addMethod('Pause', {}, function() {
        _this.rdio.player.pause()
        propertiesChanged({'PlaybackStatus': 'Paused'})
    })
    playerIface.addMethod('PlayPause', {}, function() {
        _this.rdio.player.playPause()
        _this.updateState()
    })
    playerIface.addMethod('Stop', {}, function() {
        _this.rdio.player.setCurrentPosition(0)
        _this.rdio.player.pause()
        _this.updateMetadata()
        propertiesChanged({'PlaybackStatus': 'Paused'})
    })
    playerIface.addMethod('Play', {}, function() {
        _this.rdio.player.play()
        propertiesChanged({'PlaybackStatus': 'Playing'})
    })
    playerIface.addMethod('SetPosition', { in: [ DBus.Define(String), DBus.Define(Number) ] }, function(o, x, cb) {
        //_this.rdio.player.seek(parseInt(x/1000000))
        //playerIface.emit('Seeked', 100000)
        //playerIface.emit('Seeked', _this.rdio.player.position()*1000000)
    })

    playerIface.addSignal('Seeked', {
        types: [
            DBus.Define(Number)
        ]
    })

    playerIface.on('Seeked', function(x) {
        console.warn('seeked')
        console.warn(x)
    })

    propIface.update()
    appIface.update()
    playerIface.update()

}

module.exports = RdioDbus