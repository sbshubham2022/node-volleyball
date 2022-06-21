const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, clubService } = require('../services');

const createClub = catchAsync(async (req, res) => {
  req.body.role = 'club';
  const club = await clubService.createClub(req.body);
  res.status(httpStatus.CREATED).send(club);
});

const getClubs = catchAsync(async (req, res) => {
  req.body.role = 'club';
  const filter = pick(req.body, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await clubService.queryClubs(filter, options);
  res.send(result);
});

const getClub = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }
  const filter = { _id: req.params.userId, role: 'club' };
  const clubUser = await clubService.getClubById(filter);
  if (!clubUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club User not found');
  }
  res.send(clubUser);
});

const updateClub = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }
  const filter = { _id: req.params.userId, role: 'club' };
  const clubUser = await clubService.getClubById(filter);
  if (!clubUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club User not found');
  }
  const club = await clubService.updateClubById(filter, req.body);
  res.sendJSONResponse(200, true, 'Club updated successfully');
});

const deleteClub = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }
  const filter = { _id: req.params.userId, role: 'club' };
  const clubUser = await clubService.getClubById(filter);
  if (!clubUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Club User not found');
  }
  await clubService.deleteClubById(filter);
  res.sendJSONResponse(httpStatus.OK, true, 'Club user deleted successfully');
});

module.exports = {
  createClub,
  getClubs,
  getClub,
  updateClub,
  deleteClub,
};
