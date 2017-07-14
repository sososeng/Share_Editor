/* public/script.js */

window.onload = function() {
  var editor = ace.edit("pad");
  editor.setTheme("ace/theme/merbivore_soft");
  editor.getSession().setMode("ace/mode/javascript");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBJMZXYdTZUXmqnsoJgKB_HPaQGOnNi-FI",
    authDomain: "shareeditor-669e9.firebaseapp.com",
    databaseURL: "https://shareeditor-669e9.firebaseio.com",
    projectId: "shareeditor-669e9",
    storageBucket: "shareeditor-669e9.appspot.com",
    messagingSenderId: "1049897916848"
  };
  firebase.initializeApp(config);
  // Write the entries in the database
  var db = firebase.database();
  var uid = Math.random().toString();

  // We know what's the editor id
var editorId = "johnny+emma+article";

// Get the reference to the editor values
var editorValues = db.ref("editor_values");

// Get the entire editor object
editorValues.child(editorId).once("value", function (snapshot) {
    console.log(snapshot);
    /* {
        "content": "Hello world. This is how we started this very article. :D",
        "lang": "markdown",
        "queue": {...}
    } */
});

// Get the value of the `content` field only:
editorValues.child(editorId).child("content").once("value", function (snapshot) {
   console.log(snapshot);
   // "Hello world. This is how we started this very article. :D"
});

editorValues.child(editorId).update({
    content: "hello world"
});


// Get the reference to the editor id
var currentEditorValue = editorValues.child(editorId);

// Get the `queue` child (which looks like an array where we push update events)
var queueRef = currentEditorValue.child("queue");

// This boolean is going to be true only when the value is being set programmatically
// We don't want to end with an infinite cycle since ACE editor triggers the
// `change` event on programmatic changes (which, in fact, is a good thing)
var applyingDeltas = false;

// Listen for the `change` event
editor.on("change", function(e) {

    // In case the change is emitted by us, don't do anything
    // (see below, this boolean becomes `true` when we receive data from Firebase)
    if (applyingDeltas) {
        return;
    }

    // Set the content in the editor object
    // This is being used for new users, not for already-joined users.
    currentEditorValue.update({
        content: editor.getValue()
    });

    // Generate an id for the event in this format:
    //  <timestamp>:<random>
    // We use a random thingy just in case somebody is saving something EXACTLY
    // in the same moment
    queueRef.child(Date.now().toString() + ":" + Math.random().toString().slice(2)).set({
        // Store the data we get from ACE editor
        event: e,
        // Store the pseudo-user id
        by: uid
    }).catch(function(e) {
        // In case of errors, we want to see them in the console
        console.error(e)
    });
});
var queueRef = currentEditorValue.child("queue");
var openPageTimestamp = Date.now();
var doc = editor.getSession().getDocument();
// Listen for updates in the queue
queueRef.on("child_added", function (ref) {

    // Get the timestamp
    var timestamp = ref.key.split(":")[0];

    // Do not apply changes from the past
    if (openPageTimestamp > timestamp) {
        return;
    }

    // Get the snapshot value
    var value = ref.val();

    // In case it's me who changed the value, I am
    // not interested to see twice what I'm writing.
    // So, if the update is made by me, it doesn't
    // make sense to apply the update
    if (value.by === uid) { return; }

    // We're going to apply the changes by somebody else in our editor
    //  1. We turn applyingDeltas on
    applyingDeltas = true;
    //  2. Update the editor value with the event data
    doc.applyDeltas([value.event]);
    //  3. Turn off the applyingDeltas
    applyingDeltas = false;
});


};
