Meteor.publish('posts', function(userId){
    return Posts.find();
})
Meteor.publish('likes', function(postId){
    return Likes.find({post:postId});
})
Meteor.methods({
    //{text: '', owner: '', date: '', parent: ''}
    'addPost': function(options){
        var post = {
           text: options.text,
           userId: Meteor.userId(),
           userName: Meteor.user().username,
           date: new Date(),
           parent: options.parent
        };
        console.log(post);
        Posts.insert(post);
    },
    'removePost': function(id){
        Posts.remove({_id:id});
    },
    'removeAllPosts': function(){
        Posts.remove();
    }
})