$(document).ready(function(){

	Notification.requestPermission().then(function(result) {
		console.log(result);
	});

	var pusher = new Pusher('2ee263535b67d5cdf084', {
		cluster: 'ap2',
		encrypted: false
	});

	let channel = pusher.subscribe('public-chat');
	channel.bind('message-added', onMessageAdded);

	$('#btn-chat').click(function(){
		const message = $("#message").val();
		$("#message").val("");
		//send message
		$.post( "http://localhost:5000/message", { message } );
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
});
