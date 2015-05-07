Template.speak.events({
  'keyup #inputfield': function (event) {
    // increment the counter based on the input length
    var characters = event.target.value.length;
    var count = characters;
    Session.set('value', event.target.value);
    Session.set('counter', count);
    Session.set('character_number', characters);
  },
  'click #listen':function(event) {
    $('#listen').addClass('hidden');
    $('#stop').removeClass('hidden');
    var language = Session.get('language').toString();
    var count = Session.get('counter');
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = Session.get('value').replace(/\n/g,'').toString();
    utterance.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Alex'; })[0];
    speechUtteranceChunker(utterance, {
      chunkLength: 120
    }, function () {
      $('#stop').addClass('hidden');
      $('#listen').removeClass('hidden');
    });
    
  },
  'click #stop':function(event, utterance) {
    speechSynthesis.cancel();
    $('#listen').removeClass('hidden');
    utterance.onend = function(event) {
      $('#listen').removeClass('hidden');
      $('#stop').addClass('hidden');
    };
  },
  'change #language':function(event) {
    var selected = event.target.value;
    console.log(selected);
    Session.set('language', selected.toString());
  },
  'click #pause':function(event) {
    $('#pause').addClass('hidden');
    $('#resume').removeClass('hidden');
    speechSynthesis.pause();
  },
  'click #resume':function(event) {
    $('#pause').removeClass('hidden');
    $('#resume').addClass('hidden');
    speechSynthesis.resume();
  }
});

Template.cover.events({
  'click #main-cta':function(event) {
    event.preventDefault();
    $('#btn-cta').addClass('hidden');
    $('#form-title').removeClass('hidden');
  },
  'click #btn-title':function(event) {
    event.preventDefault();
    if (booktitle.value != '') {
    $('#form-title').addClass('hidden');
    $('#form-email').removeClass('hidden');
    } else {
      alert("You need to enter book title");
    }
  },
  'click #btn-email':function(event) {
    event.preventDefault();
    if (email.value != '') {
    $('#form-email').addClass('hidden');
    $('#form-file').removeClass('hidden');
    } else {
      alert("You need to enter your email address");
    }
  },
  'change #exampleInput':function(event, template){
    var email = template.find('#email').value;
    var title = template.find('#booktitle').value;
    if (email != '' && title != '') {
      var file = $('#exampleInput').get(0).files[0] //Some jQuery to get the value.
          
          fsFile = new FS.File(file);
          //FS.File metadata.
          fsFile.metadata = {
            title:title,
            email:email
           } 
      Books.insert(fsFile,function(err,result){
          if(!err){
             console.log(result._id) //you should get an id here since the full object take more less 10 sec to upload
             Router.go('summarize', {_id:result._id});
           }
      })
    } else {
      alert("Insert book title and email address, please.")
    }
  }  
});

Template.mission.events({
  'click #btn-scroll':function(event) {
    event.preventDefault();
    $('#btn-cta').addClass('hidden');
    $('#form-title').removeClass('hidden');
    window.scrollTo(0,115);
  }
});

var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var chunkLength = settings && settings.chunkLength || 160;
    var pattRegex = new RegExp('^.{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[\.\!\?\,]{1}|^.{1,' + chunkLength + '}$|^.{1,' + chunkLength + '} ');
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    var chunkArr = txt.match(pattRegex);

    if (chunkArr[0] !== undefined && chunkArr[0].length > 2) {
        var chunk = chunkArr[0];
        var newUtt = new SpeechSynthesisUtterance(chunk);
        for (x in utt) {
            if (utt.hasOwnProperty(x) && x !== 'text') {
                newUtt[x] = utt[x];
            }
        }
        newUtt.onend = function () {
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        }
        console.log(newUtt); //IMPORTANT!! Do not remove
        setTimeout(function () {
            speechSynthesis.speak(newUtt);
        }, 0);
    } else {
        if (callback !== undefined) {
            callback();
        }
    }
};







