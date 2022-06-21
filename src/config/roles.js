const allRoles = {
  admin: ['createPlayer', 'deletePlayer', 'deleteTournament', 'manageTeam', 'manageTournament', 'getUsers', 'manageUsers'],
  club: ['manageTeam', 'manageTournament'],
  user: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
