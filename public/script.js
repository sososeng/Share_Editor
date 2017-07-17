/* public/script.js */

window.onload = function() {




  var editor = ace.edit("pad");
  editor.$blockScrolling=Infinity;
  editor.setTheme("ace/theme/xcode");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setOptions({
    fontSize: "18px"
  });

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
  if(snapshot.val()){
   editor.setValue(snapshot.val());
 }
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

$("#select-language").change(function () {

    editor.getSession().setMode("ace/mode/" + this.value);


});
$("#select-font").change(function () {

      editor.setOptions({
        fontSize: this.value+"px"
      });

});

$("#download").click( function() {
  var text = editor.getSession().getValue();
  var filename = $("#filename").val();
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename);
  $("#filename").val('');
});

};
