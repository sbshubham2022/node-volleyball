const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

const queryUsers = async (filter, options, search) => {
  let where = { name: new RegExp(search, 'gi') };
  const { limit = 10, page = 1 } = options;
  const Users = await User.find(where)
    .limit(limit)
    .skip((page - 1) * limit);
  const totalUsers = await User.find(where).countDocuments();
  const data = {
    limit: limit,
    page: page,
    totalPages: Math.ceil(totalUsers / limit),
    totalResult: totalUsers,
    result: Users,
  };
  return data;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUser = async (filter) => {
  return User.findOne(filter);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
const deleteUser = async (filter) => {
  const user = await getUser(filter);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Particular User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUser,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  deleteUser,
};
