function init() {
  var recognition = new webkitSpeechRecognition();

  // use a pre-defined grammar
  //var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
  //var speechRecognitionList = new webkitSpeechGrammarList();
  //speechRecognitionList.addFromString(grammar, 1);
  //recognition.grammars = speechRecognitionList;

  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  document.body.onclick = function() {
    recognition.start();
    console.log("Ready to receive a command.");
  };

  // This also seems to work, even without an initial event.
  // recognition.start();

  recognition.onresult = function(event) {
    console.log(e);
    // var color = event.results[0][0].transcript;
  };

  recognition.onend = function() {
    console.log("ended");
  };

  recognition.onerror = function(err) {
    console.log("error", err);
  };
}
export default {
  init,
};
