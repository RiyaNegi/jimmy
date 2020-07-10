/* eslint-disable no-param-reassign */

const Sequelize = require('sequelize');
const Post = require('../models/Post');
const Teammate = require('../models/Teammate');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');
const Like = require('../models/Like');

async function getAll({
  search, hackathonId, page,
}, currentUserId) {
  const whereQuery = {
    published: true,
    title: { [Sequelize.Op.iLike]: `%${search || ''}%` },
  };
  if (hackathonId) {
    whereQuery.hackathonId = hackathonId;
  }
  const result = await Post.findAll({
    where: whereQuery,
    order: [
      ['createdAt', 'DESC'],
    ],
    include: [Comment, User, Tag, Like],
    limit: 20,
    offset: (parseInt(page, 10) - 1) || 0 * 20,
  }).map((i) => {
    const x = i.get({ plain: true });
    return {
      ...x,
      commentsCount: x.comments.length,
      comments: undefined,
      likesCount: x.likes.length,
      likedByCurrentUser: !!currentUserId && !!x.likes.find((like) => like.userId === currentUserId),
      likes: undefined,
    };
  });
  return result;
}

async function get({ id, userId }) {
  const teammate = await Teammate.findOne({ postId: id, userId });
  if (!teammate) {
    throw new Error(`Unauthorized access in GET post: id: ${id}, userId: ${userId}`);
  }
  const post = (await Post.findOne({
    where: { id },
    include: [
      {
        model: User,
        attributes: ['userName', 'imageUrl', 'firstName', 'lastName',
          'college', 'year', 'department', 'id'],
      },
      {
        model: Tag,
      },
      {
        model: Teammate,
        include: [User],
      },
      {
        model: Like,
      },
      {
        model: Comment,
        where: { parentId: null },
        required: false,
        include: [
          {
            model: User,
            attributes: ['userName', 'imageUrl', 'firstName', 'lastName', 'college',
              'year', 'department', 'id'],
          },
          {
            model: Comment,
            as: 'replyComments',
            include: {
              model: User,
              attributes: ['userName', 'imageUrl', 'firstName', 'lastName', 'college',
                'year', 'department', 'id'],
            },
          },
        ],
      },
    ],
  })).toJSON();
  post.likedByCurrentUser = !!userId && !!post.likes.find((like) => like.userId === userId);
  post.likesCount = post.likes.length;
  delete post.likes;
  return post;
}

async function createPostAndTeammates({
  title, published, description, tagId, teammateIds, userId, hackathonId,
}) {
  // Add self to team if not present
  if (!teammateIds) {
    teammateIds = [userId];
  } else if (!teammateIds.includes(userId)) {
    teammateIds.unshift(userId);
  }
  teammateIds = [...new Set(teammateIds)];

  // Check if alreadyRegisteredPost
  if (hackathonId) {
    const HackathonService = require('./HackathonService');
    const alreadyRegisteredPost = await HackathonService.postByUser({ id: hackathonId }, userId);
    if (alreadyRegisteredPost) {
      return null;
    }
  }

  let post = await Post.create({
    title,
    published,
    description,
    tagId,
    hackathonId,
    teammates: teammateIds.map((teammateId) => ({ userId: teammateId })),
    userId,
  }, { include: [Teammate] });
  post = post.get({ plain: true });
  return post;
}

async function update({
  id, title, published, description, tagId, userId,
}) {
  let post = await Post.findOne({ where: { id }, include: [Teammate] });
  if (post.get({ plain: true }).teammates.map((teammate) => teammate.userId).includes(userId) === false) {
    return null;
  }
  post = await post.update({
    title,
    published,
    description,
    tagId,
  }, {
    returning: true,
  });

  post = post.get({ plain: true });
  return post;
}

async function destroy({ id, userId }) {
  const post = await Post.findOne({ where: { id }, include: [Teammate] });
  if (post.get({ plain: true }).teammates.map((teammate) => teammate.userId).includes(userId) === false) {
    return null;
  }
  const result = await Post.destroy({ where: { id, userId } });
  return result;
}

module.exports = {
  createPostAndTeammates,
  update,
  get,
  getAll,
  destroy,
};
