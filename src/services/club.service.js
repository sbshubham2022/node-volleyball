const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createClub = async (clubBody) => {
  if (await User.isEmailTaken(clubBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }
  return User.create(clubBody);
};
const queryClubs = async (filter, options, search) => {
  const role = filter.role;
  let where = { name: new RegExp(search, 'gi'), role };
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

const getClubById = async (filter) => {
  return User.findOne(filter);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateClubById = async (filter, updateBody) => {
  const user = await getClubById(filter);
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, filter.userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteClubById = async (filter) => {
  const club = await getClubById(filter);
  await club.remove();
  return club;
};

module.exports = {
  createClub,
  queryClubs,
  getClubById,
  getUserByEmail,
  updateClubById,
  deleteClubById,
};
