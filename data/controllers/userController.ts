import { User } from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface User {
    name: string;
    password: string;
    role: {
        scopes: string[];
    };
}

interface Token {
    auth: boolean;
    token: string;
}

interface UserService {
    create(user: User): Promise<any>;
    createToken(user: User): Token;
    verifyToken(token: string): Promise<any>;
    findUser(params: { name: string; password: string; isQrCode: boolean }): Promise<any>;
    findAll(pagination: { limit: number; skip: number }): Promise<any>;
    findUserById(id: string): Promise<any>;
    authorize(scopes: string[]): (request: any, response: any, next: any) => void;
    update(id: string, user: User): Promise<any>;
}

function UserService(UserModel: User): UserService {
    let service: UserService = {
        create,
        createToken,
        verifyToken,
        findUser,
        findAll,
        findUserById,
        authorize,
        update,
    };

    function create(user: User): Promise<any> {
        return createPassword(user).then((hashPassword: string, err: any) => {
            if (err) {
                return Promise.reject("Not saved the user");
            }

            let newUserWithPassword = {
                ...user,
                password: hashPassword,
            };

            let newUser = User(newUserWithPassword);
            return save(newUser);
        });
    }

    function createToken(user: User): Token {
        let token = jwt.sign({ id: user._id, name: user.name, role: user.role.scopes }, config.secret, {
            expiresIn: config.expiresPassword,
        });

        return { auth: true, token };
    }

    function verifyToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                return resolve(decoded);
            });
        });
    }

    function save(model: any): Promise<any> {
        return new Promise(function (resolve, reject) {
            // do a thing, possibly async, then…
            model.save(function (err: any) {
                if (err) reject(err);

                resolve({
                    message: 'User saved',
                    user: model,
                });
            });
        });
    }

    function update(id: string, user: User): Promise<any> {
        console.log('user', user);
        return new Promise(function (resolve, reject) {
            console.log('user', user);
            UserModel.findByIdAndUpdate(id, user, function (err: any, userUpdated: any) {
                if (err) reject('Dont updated User');
                resolve(userUpdated);
            });
        });
    }

    function findUserById(id: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            UserModel.findById(id, function (err: any, user: any) {
                if (err) reject(err);

                resolve(user);
            });
        });
    }

    function findUser({ name, password, isQrCode }: { name: string; password: string; isQrCode: boolean }): Promise<any> {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ name }, function (err: any, user: any) {
                if (err) reject(err);
                //object of all users

                if (!user) {
                    reject("This data is wrong");
                }
                resolve(user);
            });
        }).then((user) => {
            if (isQrCode) {
                return user.password === password ? Promise.resolve(user) : Promise.reject('User not valid');
            }

            return comparePassword(password, user.password).then((match) => {
                if (!match) return Promise.reject("User not valid");
                return Promise.resolve(user);
            });
        });
    }

    function findAll(pagination: { limit: number; skip: number }): Promise<any> {
        const { limit, skip } = pagination;

        return new Promise(function (resolve, reject) {
            UserModel.find({}, {}, { skip, limit }, function (err: any, users: any) {
                if (err) reject(err);

                resolve(users);
            });
        }).then(async (users) => {
            const totalPlayers = await UserModel.count();

            return Promise.resolve({
                data: users,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip / limit),
                    hasMore: skip + limit < totalPlayers,
                    total: totalPlayers,
                },
            });
        });
    }

    function createPassword(user: User): Promise<string> {
        return bcrypt.hash(user.password, config.saltRounds);
    }

    function comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    function authorize(scopes: string[]): (request: any, response: any, next: any) => void {
        return (request, response, next) => {
            const { roleUser } = request; //Este request só tem o roleUser porque o adicionamos no ficheiro players
            // console.log("roleUser:", roleUser);
            // console.log("scopes:", scopes);
            const hasAutorization = scopes.some(scope => roleUser.includes(scope));

            if (roleUser && hasAutorization) {
                next();
            } else {
                response.status(403).json({ message: "Forbidden" }); //acesso negado
            }
        };
    }

    return service;
}

export default UserService;