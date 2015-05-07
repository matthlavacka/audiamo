Session.setDefault('counter', "384");
Session.setDefault('value', "Kevin Kelly. What Technology Wants. First Chapter. My Question. For most of my life I owned very little. I dropped out of college and for almost a decade wandered remote parts of Asia in cheap sneakers and worn jeans, with lots of time and no money. The cities I knew best were steeped in medieval richness; the lands I passed through were governed by ancient agricultural traditions.");
Session.setDefault('language', 'en');

Template.speak.helpers({
  counter: function () {
    return Session.get('counter');
  },
  value: function() {
    return Session.get('value');
  },
  characters:function() {
    return Session.get('characters');
  },
  support:function() {
    return Session.get('support');
  },
  loadVoices:function() {
    // Fetch the available voices
    var voices = speechSynthesis.getVoices();
  }
});

Template.summarize.helpers({
	userBook:function() {
		return Books.find();
	}
});

Template.collection.helpers({
  showInput:function() {
    return Books.find();
  }
});

window.speechSynthesis.onvoiceschanged = function(e) {
  loadVoices();
};

Meteor.startup(function () {
  if ('speechSynthesis' in window) {
  Session.set('support',true);
  } else {
  Session.set('support',false);
  };
  loadVoices();
});