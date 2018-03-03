$(document).ready(function () {

    Notification.requestPermission().then(function (result) {
		console.log(result);
	});

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            window.location.replace("/chat");
        } else {
            // User is signed out.
        }
    }, function (error) {
        console.log(error);
    });

});