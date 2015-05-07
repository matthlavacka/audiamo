fileStore = new FS.Store.GridFS("fileStore");

Books = new FS.Collection("Books", {
	stores: [fileStore],
	filter: {
		maxSize: 1045000, // in bytes
		allow: {
			//contentTypes: ['image/*'],
			//extensions: ['png','jpg','gif']
		},
		onInvalid: function () {
			if(Meteor.isClient) {
				alert("Upload files up to 10 Megabytes. Try again, please.");
			} else {
				console.warn("Upload files up to 10 Megabytes. Try again, please.");
			}
		}
	}
});

if(Meteor.isClient){
    Meteor.subscribe('Books');
};