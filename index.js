function isFunction (functionToCheck) {
	return (
		functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
	)
}

// timeout 30 sec
function call (methodName, data, cb) {
	if (!isFunction(cb)) cb = function () {}
	return new Promise(function (rs, rj) {
		var msg_chan = new MessageChannel()
		var replied = false
		msg_chan.port1.onmessage = function (event) {
			if (replied) return
			if (event.data.error) {
				cb(event.data.error)
				rj(event.data.error)
				return
			}
			cb(undefined, event.data)
			rs(event.data)
		}
		navigator.serviceWorker.controller.postMessage(
			{ name: methodName, data: data },
			[msg_chan.port2]
		)
		setTimeout(function () {
			if (replied) return
			cb(new Error('timeout'))
			rj(new Error('timeout'))
		}, 30000)
	})
}

module.exports = {
	call: call,
}
