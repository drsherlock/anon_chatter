$(document).ready(function () {

	var pusher = new Pusher('2ee263535b67d5cdf084', {
		cluster: 'ap2',
		encrypted: false
	});

	let channel = pusher.subscribe('public-chat');
	var socketId = null;
	pusher.connection.bind('connected', function() {
		socketId = pusher.connection.socket_id;
	});

	channel.bind('message-added', onMessageAdded);
	channel.bind('member-joined', onMemberJoined);
	channel.bind('member-left', onMemberLeft);

	$('#btn-chat').click(function () {
		const message = $("#message").val();
		$("#message").val("");
		//send message
		$.post("/message", { message, socketId });
	});

	function onMessageAdded(data) {
		let template = $("#new-message").html();
		template = template.replace("<%body%>", data.message);
		$(".chat").append(template);
		spawnNotification("You have got a new message", "Anon-Chatter");
	}

	function onMemberJoined(data) {
		let template = $("#new-message").html();
		template = template.replace("<%body%>", data.displayName+" just joined!");
		$(".chat").append(template);
		spawnNotification("You have got a mate", "Anon-Chatter");
	}

	function onMemberLeft(data) {
		let template = $("#new-message").html();
		template = template.replace("<%body%>", data.displayName+" just left!");
		$(".chat").append(template);
		spawnNotification("You have got a deserter", "Anon-Chatter");
	}

	function spawnNotification(body, title) {
		var options = {
			body: body,
		};
		var n = new Notification(title, options);
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var uid = user.uid;
			var phoneNumber = user.phoneNumber;
			var providerData = user.providerData;
			user.getIdToken().then(function (accessToken) {});
			
			$.post("/member-joined", { displayName, socketId });
		} else {
			// User is signed out.
			window.location.replace("/");
		}
	}, function (error) {
		console.log(error);
	});

	var signOutButton = document.getElementById("sign-out-btn");
	signOutButton.addEventListener("click", function () {
		var displayName = firebase.auth().currentUser.displayName;
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
			$.post("/member-left", { displayName, socketId });
		}).catch(function (error) {
			// An error happened.
		});
	});

});
