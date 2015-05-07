Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
    this.route('frontPage', {path: '/'} );
    this.route('collection', {path: '/kolekcia'});
});

Router.route('/book/:_id', {
	name: 'summarize',
	data: function() { return Books.findOne(this.params._id);
	}
});