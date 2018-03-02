firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        window.location.replace("/chat");
    } else {
        console.log("Outttt");
        // User is signed out.

    }
}, function (error) {
    console.log(error);
});