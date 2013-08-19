// Class for Piano
function Piano() {}

Piano.prototype.connect = function() {
	socket = new WebSocket("ws://demo.coderfaire.com:8080/");
	setTimeout(function() {
		if (socket.readyState == 3 || socket.readyState == 2) {
			console.log('WebSocket connection failed.');
			$('.red').addClass('blink');
		}

		if (socket.readyState == 1) {
			console.log('WebSocket connection open!');
			$('.purple').addClass('blink');
		}
	}, 1000)
};

Piano.prototype.receive = function(data) {
	console.log("Received: " + data);
	console.log($.parseJSON(data));
	obj = $.parseJSON(data);
	console.log(obj.toggle);
	console.log(obj.key);

	switch(obj.key) {
	case 65:
		if (obj.toggle == false) {
			if ($('.purple').hasClass('on')) {
				$('.purple').removeClass('on');
			}
		} else {
			if (!$('.purple').hasClass('on')) {
				$('.purple').addClass('on');
			}
		}
		break;
	case 83:
		if (obj.toggle == false) {
			if ($('.dark-blue').hasClass('on')) {
				$('.dark-blue').removeClass('on');
			}
		} else {
			if (!$('.dark-blue').hasClass('on')) {
				$('.dark-blue').addClass('on');
			}
		}
		break;
	case 68:
		if (obj.toggle == false) {
			if ($('.lt-blue').hasClass('on')) {
				$('.lt-blue').removeClass('on');
			}
		} else {
			if (!$('.lt-blue').hasClass('on')) {
				$('.lt-blue').addClass('on');
			}
		}
		break;
	case 70:
		if (obj.toggle == false) {
			if ($('.green').hasClass('on')) {
				$('.green').removeClass('on');
			}
		} else {
			if (!$('.green').hasClass('on')) {
				$('.green').addClass('on');
			}
		}
		break;
	case 71:
		if (obj.toggle == false) {
			if ($('.yellow').hasClass('on')) {
				$('.yellow').removeClass('on');
			}
		} else {
			if (!$('.yellow').hasClass('on')) {
				$('.yellow').addClass('on');
			}
		}
		break;
	case 72:
		if (obj.toggle == false) {
			if ($('.orange').hasClass('on')) {
				$('.orange').removeClass('on');
			}
		} else {
			if (!$('.orange').hasClass('on')) {
				$('.orange').addClass('on');
			}
		}
		break;
	case 74:
		if (obj.toggle == false) {
			if ($('.red').hasClass('on')) {
				$('.red').removeClass('on');
			}
		} else {
			if (!$('.red').hasClass('on')) {
				$('.red').addClass('on');
			}
		}
		break;
	default:
		break;
	}
};

Piano.prototype.send = function(object) {
	socket.send(JSON.stringify(object));
}

$(document).ready(function() {
	var tmp;
	$('body').css({'margin-top': window.innerHeight * 0.25});
	$('.light').css({height: window.innerHeight/2});
	$('.lights').css({opacity: 1});

	Piano = new Piano();
	Piano.connect();

	socket.onmessage = function(event) {
		Piano.receive(event.data);
	}

	$(document).keydown(function(event) {
		$('.purple').removeClass('blink');
		switch(event.which) {
		case 65:
			$('.purple').addClass('on');
			Piano.send({"toggle":true,"key":65});
			break;
		case 83:
			$('.dark-blue').addClass('on');
			Piano.send({"toggle":true,"key":83});
			break;
		case 68:
			$('.lt-blue').addClass('on');
			Piano.send({"toggle":true,"key":68});
			break;
		case 70:
			$('.green').addClass('on');
			Piano.send({"toggle":true,"key":70});
			break;
		case 71:
			$('.yellow').addClass('on');
			Piano.send({"toggle":true,"key":71});
			break;
		case 72:
			$('.orange').addClass('on');
			Piano.send({"toggle":true,"key":72});
			break;
		case 74:
			$('.red').addClass('on');
			Piano.send({"toggle":true,"key":74});
			break;
		default:
			break;
		}
		
	})

	$(document).keyup(function(event) {
		switch(event.which) {
		case 65:
			$('.purple').removeClass('on');
			Piano.send({"toggle":false,"key":65});
			break;
		case 83:
			$('.dark-blue').removeClass('on');
			Piano.send({"toggle":false,"key":83});
			break;
		case 68:
			$('.lt-blue').removeClass('on');
			Piano.send({"toggle":false,"key":68});
			break;
		case 70:
			$('.green').removeClass('on');
			Piano.send({"toggle":false,"key":70});
			break;
		case 71:
			$('.yellow').removeClass('on');
			Piano.send({"toggle":false,"key":71});
			break;
		case 72:
			$('.orange').removeClass('on');
			Piano.send({"toggle":false,"key":72});
			break;
		case 74:
			$('.red').removeClass('on');
			Piano.send({"toggle":false,"key":74});
			break;
		default:
			break;
		}
	})
})