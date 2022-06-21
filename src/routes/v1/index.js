const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const tournamentRoute = require('./tournament.route');
const teamRoute = require('./team.route');
const playerRoute = require('./player.route');
const imageUploadRoute = require('./imageUpload.route');
const teamPlayersRoute = require('./teamPlayers.route');
const tournamentTeamsRoute = require('./tournamentTeams.route');
const clubRoute = require('./club.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/clubUsers',
    route: clubRoute,
  },
  {
    path: '/tournament',
    route: tournamentRoute,
  },
  {
    path: '/team',
    route: teamRoute,
  },
  {
    path: '/player',
    route: playerRoute,
  },
  {
    path: '/imageUpload',
    route: imageUploadRoute,
  },
  {
    path: '/teamPlayers',
    route: teamPlayersRoute,
  },
  {
    path: '/tournamentTeams',
    route: tournamentTeamsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
