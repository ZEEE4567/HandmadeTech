import {IUser, User} from "../models/users";
import config from "../../config";
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import {scopes} from "../scopes/userScopes";
import {login} from "../controllers/userController";
import mongoose from "mongoose";

export const create = async (user: IUser): Promise<any> => {
    try {
        const hashPassword = await createPassword(user);
        let newUserWithPassword = {
            ...user,
            password: hashPassword,
        };

        let newUser = new User(newUserWithPassword);

        newUser.role = user.role || { scopes: [scopes.User] };

        return await save(newUser);
    } catch (err) {
        console.error(err);
        throw new Error("There was a problem registering the user.");
    }
};

export const createToken = (user: IUser): { auth: boolean; token: string }=> {
    let token = jwt.sign({id: user._id, name: user.name, role: user.role.scopes}, config.secret, {
        expiresIn: config.expiresPassword,
    });
    return {auth: true, token};
};

export const verifyToken = async (token: string): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else if (typeof decoded === 'object' && 'id' in decoded) {
                    return resolve(decoded.id);
                } else {
                    reject(new Error('Invalid token'));
                }
            });
        });
    } catch (err_1) {
        console.error(err_1);
        throw new Error('Error verifying token');
    }
};

function save(model: IUser): Promise<{ message: string; user: IUser }> {
    return new Promise(async function (resolve, reject) {
        try {
            const existingUser = await findUserByEmail(model.email);
            if (existingUser) {
                console.log('User already exists with this email');
                reject('User already exists');
                return;
            }

            model.save(function (err) {
                if (err) {
                    console.error(err);
                    reject('There is a problem with registering the user');
                    return;
                }

                resolve({
                    message: 'User Created',
                    user: model,
                });
            });
        } catch (err) {
            if (err instanceof mongoose.Error) {
                reject('Mongoose error occurred');
            } else {
                reject('An error occurred while checking if the user exists');
            }
        }
    });
}

function createPassword(user: IUser): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, config.saltRounds, function (err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
        throw new Error('Password or hash is null or undefined');
    }
    return bcrypt.compare(password, hash);
}

export const findAll = async (offset: number = 0, limit: number = 10, sort: string = 'username_asc', filter: string = ''): Promise<any> => {
    try {
        const [sortField, sortOrder] = sort.split('_');
        const sortObject = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        const filterObject = filter ? { username: { $regex: filter, $options: 'i' } } : {};

        const users = await User.find(filterObject).skip(offset).limit(limit).sort(sortObject as { [key: string]: any });

        const totalUsers = await User.countDocuments(filterObject);

        const page = Math.floor(offset / limit) + 1;

        const hasMore = offset + limit < totalUsers;

        return {
            data: users,
            pagination: {
                pageSize: limit,
                page: page,
                hasMore: hasMore,
                total: totalUsers,
            },
        };
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching users");
    }
};

export const findUserByEmail = async (email: string): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            User.findOne({email}, function (err: any, user: any) {
                if (err) reject(err);

                resolve(user);
            });
        });
    } catch (err_1) {
        console.error(err_1);
        throw new Error('Error finding user by email');
    }
}

export const findUserByUsername = async (username: string): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            User.findOne({username}, function (err: any, user: any) {
                if (err) reject(err);
                console.error('Invalid Credentials');
                resolve(user);
            });
        });
    } catch (err_1) {
        console.error(err_1);
        throw new Error('Error finding user by username');
    }
}


export const update = async (userId: string, body: any): Promise<any> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.role.name !== 'admin' || 'Admin') {
            delete body.role;
        }

        user.name = body.name;
        user.username = body.username;
        user.email = body.email;
        user.role = body.role;
        user.age = body.age;
        user.address = body.address;
        user.country = body.country;
        await user.save();

        return { message: "User updated", user };
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

export const findUserById = async (userId: string, sort: string = 'date_asc'): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            User.findById(userId, function (err: any, user: any) {
                if (err) {
                    console.error(err);
                    reject('Error finding user by ID');
                }
                resolve(user);
            });
        });
    } catch (err) {
        console.error(err);
        throw new Error('Error finding user by ID');
    }
};


export const deleteUserById = async (userId: string): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            User.findByIdAndDelete(userId, function (err: any, user: any) {
                if (err) {
                    console.error(err);
                    reject('Error deleting user by ID');
                }
                resolve(user);
            });
        });
    } catch (err_1) {
        console.error(err_1);
        throw new Error('Error deleting user by ID');
    }
};

export const authorize = (scopes: string[]) => {
    return async (req: any, res: any, next: any) => {
        try {
            const token = req.cookies.token?.token;
            const userId = await verifyToken(token);

            const user = await findUserById(userId);


            if (!user) {
                throw new Error('User not found');
            }

            if (!scopes.some(scope => user.role.scopes.includes(scope))) {
                throw new Error('User not authorized');
            }

            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'User not authorized' });
        }
    };
};




