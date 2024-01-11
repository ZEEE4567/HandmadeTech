import {IUser, User} from "../models/users";
import config from "../../config";
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';





export const create = async (user: IUser): Promise<any> => {
    try {
        const hashPassword = await createPassword(user);
        let newUserWithPassword = {
            ...user,
            password: hashPassword,
        };

        let newUser =  new User(newUserWithPassword);
        return await save(newUser);
    } catch (err) {
        console.error(err);
        console.log(err)
        throw new Error("Not saved the user");
    }
};

export const createToken = (user: IUser): { auth: boolean; token: string }=> {
    let token = jwt.sign({id: user._id, name: user.name, role: user.role.scopes}, config.secret, {
        expiresIn: config.expiresPassword,
    });

    return {auth: true, token};
};

export const verifyToken = (user: IUser, token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            return resolve(decoded);
        });
    });
};

function save(model: IUser): Promise<{ message: string; user: IUser }> {
    return new Promise(async function (resolve, reject) {
        try {
            // Check if the user already exists
            const existingUser = await findUserByEmail(model.email);
            if (existingUser) {
                console.log('User already exists');
                reject('User already exists');
                return;
            }

            // Save the new user
            model.save(function (err) {
                if (err) {
                    reject('There is a problem with registering the user');
                    return;
                }

                resolve({
                    message: 'User Created',
                    user: model,
                });
            });
        } catch (err) {
            reject('An error occurred while checking if the user exists');
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


export const findAll = async (): Promise<any> => {

    try {
        const users = await User.find({}, {});
        const totalUsers = await User.count();

        return {
            data: users,
            total: totalUsers,
        };
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching users");
    }
};

export const findUserByEmail = (email: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        User.findOne({ email }, function (err: any, user: any) {
            if (err) reject(err);

            resolve(user);
        });
    });
}

export const update = async (userId: string, body: any): Promise<any> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        await user.save();

        return { message: "User updated", user };
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

export const findUserById = (userId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        User.findById(userId, function (err: any, user: any) {
            if (err) reject(err);

            resolve(user);
        });
    });
};

//TODO: Check the authorize function (includes undefined)
export const authorize = (scopes: string[]): (request: any, response: any, next: any) => Promise<void> => {
    return async (request, response, next) => {
        try {
            const { roleUser } = request;
            const hasAuthorization = scopes.some(scope => roleUser.includes(scope));

            console.log(scopes);

            if (roleUser && hasAuthorization) {
                next();
            } else {
                response.status(403).json({ message: "Forbidden" });
            }
        } catch (err) {
            console.error(err);
            console.log('Scopes', scopes)
            response.status(500).json({ message: "Internal Server Error" });
        }
    };
};






