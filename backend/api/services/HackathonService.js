/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

const Sequelize = require('sequelize');
const Post = require('../models/Post');
const Teammate = require('../models/Teammate');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');
const Like = require('../models/Like');
const Hackathon = require('../models/Hackathon');

async function allPosts({ id }) {
  const posts = await Post.findAll({ where: { hackathonId: id }, include: [Teammate] });
  return posts.map((post) => post.get({ plain: true }));
}

async function postByUser({ id }, currentUserId) {
  const posts = await allPosts({ id });
  let post = posts.find((p) =>
    p.teammates
      .find((teammate) => teammate.userId === currentUserId));
  const PostService = require('./PostService');
  post = await PostService.get({ id: post.id, userId: currentUserId });
  return post;
}

async function getAllDetails({ name, page }, currentUserId) {
  const hackathon = await Hackathon.findOne({ where: { name } });
  const PostService = require('./PostService');
  const xxx = await PostService.getAll({
    hackathonId: hackathon.id, page,
  }, currentUserId);
  const postByCurrentUser = await postByUser({ id: hackathon.id }, currentUserId);
  const result = {
    ...hackathon.get({ plain: true }),
    posts: xxx,
    postByCurrentUser,
  };
  return result;
}

module.exports = {
  getAllDetails,
  allPosts,
  postByUser,
};
