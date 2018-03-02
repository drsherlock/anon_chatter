$(document).ready(function () {

	Notification.requestPermission().then(function (result) {
		console.log(result);
	});

	var pusher = new Pusher('2ee263535b67d5cdf084', {
		cluster: 'ap2',
		encrypted: false
	});

	let channel = pusher.subscribe('public-chat');
	channel.bind('message-added', onMessageAdded);

	$('#btn-chat').click(function () {
		const message = $("#message").val();
		$("#message").val("");
		//send message
		$.post("/message", { message });
	});

	function onMessageAdded(data) {
		let template = $("#new-message").html();
		template = template.replace("{{body}}", data.message);
		$(".chat").append(template);
		spawnNotification("You have got new message", "Chatter");
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
			user.getIdToken().then(function (accessToken) {
				console.log("Innnn");
			});
		} else {
			console.log("Outttt");
			window.location.replace("/");
			// User is signed out.
		}
	}, function (error) {
		console.log(error);
	});

	var signOutButton = document.getElementById("sign-out-btn");
	signOutButton.addEventListener("click", function () {
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
		}).catch(function (error) {
			// An error happened.
		});
	});
});
