let config = require('config-lite');
let Mongolass = require('mongolass');
let mongolass = new Mongolass();
let moment = require('moment');
let objectIdToTimestamp = require('objectid-to-timestamp');
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User',{
	name: {type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'string',enum:['m','f','x']},
	bio:{type:'string'}
});
exports.User.index({name:1},{unique:true}).exec();

//根据Id生成创建时间created_at
mongolass.plugin('addCreatedAt',{
	afterFind: function(results){
		results.forEach(function(item){
			item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		});
		return results;
	},
	afterFindOne:function(result){
		if (result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		}
		return result;
	}
})

exports.Post = mongolass.model('Post',{
	author: {type: Mongolass.Types.ObjectId},
	title: {type:'string'},
	content: {type: 'string'},
	pv:{type:'number'}
});
exports.Post.index({author:1,_id:-1}).exec(); //按创建时间降序查看用户的文章列表

//留言
export.Comment = mongolass.model('Comment',{
	author: {type: mongolass.Types.ObjectId},
	content: {type:'string'},
	postId: {type:Mongolass.Types.ObjectId}
});
exports.Post.index({postId: 1,_id: 1}).exec(); //通过文章id获取该文章下所有留言，按留言创建时间升序
exports.Post.index({author: 1,_id: 1}).exec(); //通过用户id和留言id删除一个留言
