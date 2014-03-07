var util = require('util')

var dbus = require('dbus-native'),
    bus = dbus.sessionBus()

var ifaces = require('./ifaces.js')

var RdioDbus = function(win, rdio) {
    this.win = win
    this.rdio = rdio

    bus.requestName('org.mpris.MediaPlayer2.rdio', 0)

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
        }
    },
    impl['org.mpris.MediaPlayer2.Player'] = {
        Next: function() {
            rdio.player.next()
        },
        Previous: function() {
            rdio.player.previous()
        },
        Pause: function() {
            rdio.player.pause()
        },
        PlayPause: function() {
            rdio.player.playPause()
        },
        Stop: function() {
            rdio.player.stopListening()
        },
        Play: function() {
            rdio.player.play()
        },
        Seek: function(x) {
            rdio.player.seek(x)
        },
        SetPosition: function(o, x) {
            console.log(o)
            console.log(x)
        },
        OpenUri: null,

        PlaybackStatus: "Playing",
        LoopStatus: 's',
        Rate: '5',
        Shuffle: false,
        Metadata: {
            'mpris:trackid': '/org/mpris/MediaPlayer2/0992',
            'xesam:artist': 'Avicii'
        },
        Volume: rdio.player.volume(),
        Position: rdio.player.position(),
        MinimumRate: 1,
        MaximumRate: 1,
        CanGoNext: true,
        CanGoPrevious: true,
        CanPlay: true,
        CanPause: true,
        CanSeek: true,
        CanControl: true
    }

    for (var i in ifaces) {
        impl[i].name = i
        ifaces[i].name = i
        bus.exportInterface(impl[i], '/org/mpris/MediaPlayer2', ifaces[i])
    }
}

module.exports = RdioDbus