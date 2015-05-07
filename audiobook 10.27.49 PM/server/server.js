//Allow/Deny methods
Books.allow({
	insert:function(){return true;},
	download:function(){return true;},
	remove:function(){return true;},
	update:function(){return true;},
});

//Publish methods
Meteor.publish('Books',function(){
     return Books.find();
});

// For development purposes, delete when in production
Meteor.methods({
	removeAll:function() {
		Books.remove({});
	}
});