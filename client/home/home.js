
$(window).resize(function(){
	$('.landing, .fake').css('height', $(window).height() + 'px');
});

$(window).scroll(function () { 
   $('.landing').css({
      'top' : -($(this).scrollTop()/5)+"px"
   }); 
});
$(function(){
	var hideArrow = 300;
	var shrinkHeader = 100;
	$(window).scroll(function() {
		var scroll = getCurrentScroll();
		if ( scroll >= shrinkHeader ) {
			$('.header').addClass('shrink');
		}else {
			$('.header').removeClass('shrink');
		}
		if ( scroll >= hideArrow ) {
			$('.leftArrow, .rightArrow').hide(250);
		}else {
			$('.leftArrow, .rightArrow').show(250);
		}
	});
	function getCurrentScroll() {
		return window.pageYOffset;
	}

});

Template.home.helpers({
	height: function(){
		return $(window).height() + 'px';
	},
	width: function(){
		return $(window).width() + 'px';
	},
	carouselWidth: function(){
		console.log($(window).width() * 3 + 'px');
		return $(window).width() * 3 + 'px';
	}
})

Template.home.events({
	'click .leftArrow': function(){
		var width = $(window).width()+20;
		var marginLeft = parseInt($('.carousel ul').css('margin-left'));
		if(marginLeft < 0){
			$('.carousel ul').css('margin-left', (marginLeft + width) + 'px');
		}
	},
	'click .rightArrow': function(){
		var width = $(window).width()+20;
		var marginLeft = parseInt($('.carousel ul').css('margin-left'));
		if(marginLeft > -(width*2)){
			$('.carousel ul').css('margin-left', (marginLeft - width) + 'px');
		}
	}
})
// Template.home.rendered = function(){
//     Deps.autorun(function(){
//         Meteor.subscribe("posts", Meteor.userId());
//         Meteor.subscribe("likes");
//     })
// }

// Template.home.posts = function(){
//     return Posts.find({parent: null}, {sort: {date: 'desc'}});
// }

// Template.home.events({
//     'keyup .posttext': function(evt, tmpl){
//         if(evt.which === 13){
//             var posttext = tmpl.find('.posttext').value;
//             var options = {text: posttext, parent: null};
//             Meteor.call('addPost', options)
//             $('.posttext').val('').select().focus();
//         }
//     }
// })