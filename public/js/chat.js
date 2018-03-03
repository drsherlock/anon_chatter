$(document).ready(function () {

	var pusher = new Pusher('2ee263535b67d5cdf084', {
		cluster: 'ap2',
		encrypted: false
	});

	let channel = pusher.subscribe('public-chat');
	
	pusher.connection.bind('connected', function() {});

	channel.bind('message-added', onMessageAdded);
	channel.bind('member-joined', onMemberJoined);
	channel.bind('member-left', onMemberLeft);

	var sendMsgButton = document.getElementById("btn-chat");
	sendMsgButton.addEventListener("click", function () {
		const message = $("#message").val();
		if(message === "") {
			return;
		}
		$("#message").val("");

		//send message
		$.post("/message", { message, userDisplayName, userPhotoURL });
	});

	function onMessageAdded(data) {
		let template = $("#new-message").html();
		if(data.userDisplayName !== userDisplayName) {
			template = template.replace("<%chat-body%>", data.message).replace("<%source%>", data.userPhotoURL).replace("<%classes%>", "member-msg");

			spawnNotification("You have got a new message", "Anon-Chatter");
		}
		else if(data.userDisplayName === userDisplayName) {
			template = template.replace("<%chat-body%>", data.message).replace("<%source%>", data.userPhotoURL).replace("<%classes%>", "user-msg");
		}
		$(".chat").append(template);
	}

	function onMemberJoined(data) {
		console.log(data);
		if(data.userDisplayName !== userDisplayName) {
			let template = $("#new-message").html();
			template = template.replace("<%chat-body%>", data.userDisplayName+" just joined!").replace("<%source%>", data.userPhotoURL).replace("<%classes%>", "member-status");
			$(".chat").append(template);

			spawnNotification("You have got a mate", "Anon-Chatter");
		}
		else if(data.userDisplayName === userDisplayName) {

		}
		updateOnlineMembersPanel(data.onlineMembersArray);		
	}

	function onMemberLeft(data) {
		if(data.userDisplayName !== userDisplayName) {
			let template = $("#new-message").html();
			template = template.replace("<%chat-body%>", data.userDisplayName+" just left!").replace("<%source%>", data.userPhotoURL).replace("<%classes%>", "member-status");
			$(".chat").append(template);

			spawnNotification("You have got a deserter", "Anon-Chatter");
		}
		else if(data.userDisplayName === userDisplayName) {
			
		}
		updateOnlineMembersPanel(data.onlineMembersArray);
	}

	function spawnNotification(body, title) {
		var options = {
			body: body,
		};
		var n = new Notification(title, options);
	}

	function updateOnlineMembersPanel(onlineMembersArray) {
		let onlineMembersHTML = "";
		for(let i = 0; i < onlineMembersArray.length; i++) {
			onlineMembersHTML += "<li>"+onlineMembersArray[i]+"</li>";
		}
		$('#avail-members').html(onlineMembersHTML);
	}

	let userPhotoURL = "";
	let userDisplayName = "";
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

			userPhotoURL = photoURL;
			userDisplayName = displayName;

			$.post("/member-joined", { userDisplayName, userPhotoURL });
		} else {
			// User is signed out.
			window.location.replace("/");
		}
	}, function (error) {
		console.log(error);
	});

	var signOutButton = document.getElementById("sign-out-btn");
	signOutButton.addEventListener("click", function () {
		firebase.auth().signOut().then(function () {
			// Sign-out successful.
			$.post("/member-left", { userDisplayName, userPhotoURL });
		}).catch(function (error) {
			// An error happened.
		});
	});

});
