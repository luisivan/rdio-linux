var util = require('util')

var dbus = require('dbus-native'),
    bus = dbus.sessionBus()

var ifaces = require('./ifaces.js')

var RdioDbus = function(win, rdio) {
    this.win = win
    this.rdio = rdio

    bus.requestName('org.mpris.MediaPlayer2.rdio', 0)

    this.bus = bus

    this.PlaybackStatus = "Paused"

    this.setup()
}

RdioDbus.prototype.setup = function() {

    var impl = {}

    var win = this.win,
        rdio = this.rdio

    impl['org.mpris.MediaPlayer2'] = {
        CanQuit: true,
        Fullscreen: false,
        CanSetFullscreen: false,
        CanRaise: true,
        HasTrackList: false,
        Identity: 'Rdio',
        Raise: function() {
            win.focus()
        },
        Quit: function() {
            win.close(true)
        },
        Seeked: function(x) {
            alert(x)
        }
    },
    window.shiat = impl['org.mpris.MediaPlayer2.Player'] = {
        Next: function() {
            rdio.player.next()
        },
        Previous: function() {
            rdio.player.previous()
        },
        Pause: function() {
            alert('pause')
            rdio.player.pause()
        },
        PlayPause: function() {
            rdio.player.playPause()
        },
        Stop: function() {
            rdio.player.setCurrentPosition(0)
            rdio.player.pause()
        },
        Play: function() {
            alert('play')
            rdio.player.play()
        },
        Seek: function(x) {
            console.log(x)
            rdio.player.seek(x)
        },
        SetPosition: function(o, x) {
            console.log(o)
            console.log(x)
        },
        OpenUri: null,

        PlaybackStatus: this.PlaybackStatus,
        LoopStatus: 's',
        Rate: '5',
        Shuffle: false,
        Metadata: [
            /*'mpris:trackid': '/org/mpris/MediaPlayer2/0992',
            'mpris:length': 10000,*/
            { type: 's', name: 'xesam:title', value: 'Liar liar'}/*,
            'xesam:artist': 'Avicii',
            'xesam:album': 'True'*/
            //'mpris:artUrl': 'http://www.accuradio.com/static/images/covers256//covers/a-f/avicii_true.jpg'
        ],
        Volume: rdio.player.volume(),
        Position: rdio.player.position()*1000000,
        MinimumRate: 1,
        MaximumRate: 1,
        CanGoNext: true,
        CanGoPrevious: true,
        CanPlay: true,
        CanPause: true,
        CanSeek: true,
        CanControl: true
    }
    window.propdbus = impl['org.freedesktop.DBus.Properties'] = {
        PropertiesChanged: function(s, asv, as) {
            alert(s)
        }
    }

    for (var i in ifaces) {
        impl[i].name = i
        ifaces[i].name = i
        bus.exportInterface(impl[i], '/org/mpris/MediaPlayer2', ifaces[i])
    }
}

module.exports = RdioDbus