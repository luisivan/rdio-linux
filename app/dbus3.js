var DBus = require('ndbus')

var bus = DBus()

var RdioDbus = function(win, rdio) {

bus.service("org.mpris.MediaPlayer2.rdio", function(err, service) {
	console.warn(service)
  	service.node("/", function(err, node) {
  		console.warn(node)
		node.iface("org.mpris.MediaPlayer2", {
		  	method: {
				Raise: {},
				Quit: {}
		  	},
		  	signal: {
				// signals
		  	},
		  	attrib: {
				CanQuit: 'b',
				CanRaise: 'b',
				Identity: 's'
		  	},
		  	$: {
				// annotations
		  	}
		}, function(err, iface) {
			console.warn(err)
			console.warn(iface)
		  	/*iface.SomeMethod(function(arg0, arg1, ..., argN, result) {

		  	})*/
			iface.Raise(function(result) {
				win.focus()
				result()
			})
			iface.Quit(function(result) {
				win.close()
				result()
			})

			iface.CanQuit = true
			iface.CanRaise = true
			iface.Identity = 'ARDIO'
		})
		/*node.iface("org.awesome.Interface", {

		}, {

		}, function(err, iface){

		})*/
	})
})

}

module.exports = RdioDbus