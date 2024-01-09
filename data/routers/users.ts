import express, {Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Users from "../users";
import scopes from "../users/scopes";
import VerifyToken from "../../middleware/token";
import User from "../data/models/users";

const UsersRouter = (): express.Router => {
    let router = express.Router();

    router.use(cookieParser());
    router.use(VerifyToken);

    router.use(bodyParser.json({limit: "100mb"}));
    router.use(bodyParser.urlencoded({limit: "100mb", extended: true}));

    router
        .route("")
        .post(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                let body: any = req.body;
                let {role}: { role: string } = body;

                console.log("Create user");
                Users.create(body)
                    .then((user: any) => {
                        io.sockets.emit("admin_notification", {
                            message: "Add new user",
                            key: "User",
                        });
                        res.status(200);
                        res.send();
                        next();
                    })
                    .catch((err: any) => {
                        console.log("erro", err);
                        res.status(404);
                        next();
                    });
            }
        )
        .get(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("get all users");

                const pageLimit: number = req.query.limit
                    ? parseInt(req.query.limit as string)
                    : 5;
                const pageSkip: number = req.query.skip
                    ? pageLimit * parseInt(req.query.skip as string)
                    : 0;

                req.pagination = {
                    limit: pageLimit,
                    skip: pageSkip,
                };

                Users.findAll(req.pagination)
                    .then((users: any) => {
                        const response = {
                            auth: true,
                            ...users,
                        };
                        res.send(response);
                        next();
                    })
                    .catch((err: any) => {
                        console.log(err.message);
                        next();
                    });
            }
        );

    router
        .route("/:userId")
        .put(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("update a member by id");
                let userId: string = req.params.userId;
                let body: any = req.body;

                Users.update(userId, body)
                    .then((user: any) => {
                        res.status(200);
                        res.send(user);
                        next();
                    })
                    .catch((err: any) => {
                        res.status(404);
                        next();
                    });
            }
        );

    router
        .route("/:userId/member")
        .get(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                let userId: string = req.params.userId;

                Users.findUserById(userId).then((user: any) => {
                    Members.findUserById(user.memberId)
                        .then((member: any) => {
                            res.status(200).send(member);
                            next();
                        })
                        .catch((err: any) => {
                            res.status(404);
                            next();
                        });
                });
            }
        )
        .post(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                let body: any = req.body;
                let userId: string = req.params.userId;

                upload(req, next).then((path: any) =>
                    Members.create({
                        ...body,
                        photo: path,
                    })
                        .then((result: any) => {
                            console.log(result);
                            return Users.update(userId, {memberId: result.member._id});
                        })
                        .then((user: any) => {
                            console.log("Created!");
                            res.status(200);
                            res.send(user);
                            next();
                        })
                        .catch((err: any) => {
                            console.log("Member already exists!");
                            console.log(err);
                            err.status = err.status || 500;
                            res.status(401);
                            next();
                        })
                );

                //member update user.
            }
        );

    router
        .route("/member")
        .get(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("get all tickets");

                const pageLimit: number = req.query.limit
                    ? parseInt(req.query.limit as string)
                    : 5;
                const pageSkip: number = req.query.skip
                    ? pageLimit * parseInt(req.query.skip as string)
                    : 0;

                req.pagination = {
                    limit: pageLimit,
                    skip: pageSkip,
                };

                Members.findAll(req.pagination)
                    .then((members: any) => {
                        const response = {
                            auth: true,
                            members: members,
                        };
                        res.send(response);
                        next();
                    })
                    .catch((err: any) => {
                        console.log(err.message);
                        next();
                    });
            }
        );

    router
        .route("/member/:memberId")
        .put(
            Users.authorize([scopes.Admin]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("update a member by id");
                let memberId: string = req.params.memberId;
                let body: any = req.body;

                Members.update(memberId, body)
                    .then((member: any) => {
                        res.status(200);
                        res.send(member);
                        next();
                    })
                    .catch((err: any) => {
                        res.status(404);
                        next();
                    });
            }
        );

    router
        .route("/member/tax/:taxNumber")
        .get(
            Users.authorize([scopes.Admin, scopes.Member, scopes.NonMember]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("get the member by tax");

                let taxNumber: string = req.params.taxNumber;

                Members.findMemberByTaxNumber(taxNumber)
                    .then((member: any) => {
                        res.send(member);
                        next();
                    })
                    .catch((err: any) => {
                        console.log(err.message);
                        next();
                    });
            }
        );

    router
        .route("/perfil")
        .get(
            Users.authorize([scopes.Admin, scopes.Member]),
            function (req: Request, res: Response, next: NextFunction) {
                console.log("get the profile of user");
                // the id is obtained when the token has decoded
                let userId: string = req.id;
                Users.findUserById(userId)
                    .then((user: any) => {
                        res.status(200);
                        res.send({
                            data: user,
                        });
                        next();
                    })
                    .catch((err: any) => {
                        console.log("Perfil", err);
                        res.status(404);
                        next();
                    });
            }
        );

    return router;
};

export default UsersRouter;