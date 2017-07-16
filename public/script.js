/* public/script.js */

window.onload = function() {

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
  }

  var editor = ace.edit("pad");
  editor.setTheme("ace/theme/merbivore_soft");
  editor.getSession().setMode("ace/mode/javascript");

  var config = {
    apiKey: "AIzaSyBJMZXYdTZUXmqnsoJgKB_HPaQGOnNi-FI",
    authDomain: "shareeditor-669e9.firebaseapp.com",
    databaseURL: "https://shareeditor-669e9.firebaseio.com",
    projectId: "shareeditor-669e9",
    storageBucket: "shareeditor-669e9.appspot.com",
    messagingSenderId: "1049897916848"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var uid = Math.random().toString();


var editorId = Url.queryString("id") || "_";

var editorValues = db.ref("editor_values");

var currentEditorValue = editorValues.child(editorId);


editorValues.child(editorId).child("content").once("value", function (snapshot) {
   console.log(snapshot.val());
   editor.setValue(snapshot.val());
   var queueRef = currentEditorValue.child("queue");

   var applyingDeltas = false;

   editor.on("change", function(e) {

       if (applyingDeltas) {
           return;
       }


       currentEditorValue.update({
           content: editor.getValue()
       });


       queueRef.child(Date.now().toString() + ":" + Math.random().toString().slice(2)).set({
           event: e,
           by: uid
       }).catch(function(e) {
           console.error(e)
       });
   });
   var queueRef = currentEditorValue.child("queue");
   var openPageTimestamp = Date.now();
   var doc = editor.getSession().getDocument();

   queueRef.on("child_added", function (ref) {


       var timestamp = ref.key.split(":")[0];


       if (openPageTimestamp > timestamp) {
           return;
       }


       var value = ref.val();
       if (value.by === uid) { return; }

       // We're going to apply the changes by somebody else in our editor
       //  1. We turn applyingDeltas on
       applyingDeltas = true;
       //  2. Update the editor value with the event data
       doc.applyDeltas([value.event]);
       //  3. Turn off the applyingDeltas
       applyingDeltas = false;
   });
});







};
