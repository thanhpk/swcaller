// This function calls a function in service worker
// Service worker will receive the call by listening 'message' events
// @param will be pass to service worker and is used by service worker
// to determind which function is called and what is the parameter. @param
// should be serializable parameterThis
// parameter is opaque to the library.
// @cb is used to return output to caller. The first parameter is
// an error, if the calling successed, the first parameter will be set to
// 'undefined' and the second parameter is the response return by service
// worker.
// This function returns a promise which resolve the response received
// by the service worker
// The function will abort in 30s if the service worker doesn't not reply
// in time
function call (data, cb) {
	if (!isFunction(cb)) cb = function () {}
	return new Promise(function (rs, rj) {
		// True means we have returned output to the caller (regardless of
		// error or success) by calling cb and resolve the promise. False
		// means we haven't return output to the caller. Used to make sure
		// that we only call cb once.
		var replied = false

		// make sure service worker is available
		if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
			cb(new Error('service worker not available'))
			rj(new Error('service worker not available'))
			replied = true
			return
		}

		// a message channel used to receive event back from service worker
		var msg_chan = new MessageChannel()
		msg_chan.port1.onmessage = function (event) {
			if (replied) return
			cb(null, event.data)
			rs(event.data)
			replied = true
		}

		navigator.serviceWorker.controller.postMessage(data, [msg_chan.port2])

		// abort operation and return error if service worker doesn't return
		// in 30 sec
		setTimeout(function () {
			if (replied) return
			cb(new Error('timeout'))
			rj(new Error('timeout'))
			replied = true
		}, 30000)
	})
}

// This function tells whether an object is a callable function
// Return true means obj is a function, false means obj is not a function
function isFunction (obj) {
	return obj && {}.toString.call(obj) === '[object Function]'
}

module.exports = { call: call }
