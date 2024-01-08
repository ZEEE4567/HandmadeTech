const Members = require('./member.js');
const MembersService = require('./service');

const service = MembersService(Members);

module.exports = service;