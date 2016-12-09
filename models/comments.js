let marked = require('marked');
let Comment = require('../lib/mongo').Comment;
Comment.plugin('contentToHtml',{
  afterFind: function(comments){
    return comments.map(function(comment){
      comment.content = marked(comment.content);
      return comment;
    });
  }
});
module.exports = {
  //创建一个留言
  create: function create(comment) {
    return comment.create(comment).exec();
  },

  //通过用户id和留言id 删除一个留言
  delCommentById: function delCommentById(commentId,author){
    return comment.remove({author:author,_id:commentId}).exec();
  }

  //通过文章id获取该文章下所有留言，按留言创建时间升序
  getComments: function getComments(postId){
    return Comment
            .find({postId: postId})
            .populate({path:'author',model:'User'})
            .sort({_id: 1})
            .addCreatedAt()
            .contentToHtml()
            .exec();
  },

  //通过文章id获取该文章下留言数
  getCommentsCount:function getComnetsCount(postId) {
    return Comment.count({postId:postId}).exec();
  }
}
