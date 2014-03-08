module.exports = {
    'org.mpris.MediaPlayer2': {
        methods: {
            Raise: [],
            Quit: []
        },
        signals: {
            Seeked: ['x']
        },
        properties: {
            CanQuit: 'b',
            Fullscreen: 'b',
            CanSetFullscreen: 'b',
            CanRaise: 'b',
            HasTrackList: 'b',
            Identity: 's'
        }
    },
    'org.mpris.MediaPlayer2.Player': {
        methods: {
            Next: [],
            Previous: [],
            Pause: [],
            PlayPause: [],
            Stop: [],
            Play: [],
            Seek: ['x'],
            SetPosition: ['o', 'x'],
            OpenUri: ['s']
        },
        signals: {
            Seeked: ['x']
        },
        properties: {
            PlaybackStatus: 's',
            LoopStatus: 's',
            Rate: 'd',
            Shuffle: 'b',
            Metadata: 'a{sv}',
            Volume: 'd',
            Position: 'x',
            MinimumRate: 'd',
            MaximumRate: 'd',
            CanGoNext: 'b',
            CanGoPrevious: 'b',
            CanPlay: 'b',
            CanPause: 'b',
            CanSeek: 'b',
            CanControl: 'b'
        }
    },
    'org.freedesktop.DBus.Properties': {
        signals: {
            PropertiesChanged: ["s", "a{sv}", "as"]
        }
    }

}