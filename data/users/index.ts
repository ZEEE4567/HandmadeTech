import { Users } from './users';
import { UsersService } from '../controllers/userController';

const service = UsersService(Users);

export default service;