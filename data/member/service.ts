import {Model} from 'mongoose';

interface Member {
    // Define the properties of a member
}

interface Pagination {
    limit: number;
    skip: number;
}

interface MemberService {
    create(member: Member): Promise<any>;

    findAll(pagination: Pagination): Promise<any>;

    findMemberByTaxNumber(taxNumber: string): Promise<any>;

    findById(id: string): Promise<any>;

    update(id: string, member: Member): Promise<any>;

    removeById(id: string): Promise<any>;
}

function MemberService(MemberModel: Model<any>): MemberService {
    let service: MemberService = {
        create,
        findAll,
        findMemberByTaxNumber,
        findById,
        update,
        removeById,
    };

    function create(member: Member): Promise<any> {
        let newUser = MemberModel(member);
        return save(newUser);
    }

    function save(model: any): Promise<any> {
        return new Promise(function (resolve, reject) {
            // do a thing, possibly async, then…
            model.save(function (err: any) {
                console.log(err);
                if (err) reject('There is a problem with register');

                resolve({
                    message: 'Member Created',
                    member: model,
                });
            });
        });
    }

    function findAll(pagination: Pagination): Promise<any> {
        const {limit, skip} = pagination;

        return new Promise(function (resolve, reject) {
            MemberModel.find({}, {}, {skip, limit}, function (err: any, members: any) {
                if (err) reject(err);

                resolve(members);
            });
        }).then(async (members: any) => {
            const totalPlayers = await MemberModel.count();

            return Promise.resolve({
                members: members,
                pagination: {
                    pageSize: limit,
                    page: Math.floor(skip / limit),
                    hasMore: skip + limit < totalPlayers,
                    total: totalPlayers,
                },
            });
        });
    }

    function findMemberByTaxNumber(taxNumber: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            MemberModel.findOne({tax: taxNumber}, function (err: any, member: any) {
                if (err) reject(err);

                if (!member) {
                    reject('Member not found');
                }
                resolve(member);
            });
        });
    }

    function findById(id: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            MemberModel.findOne({_id: id}, function (err: any, member: any) {
                if (err) reject(err);

                if (!member) {
                    reject('Member not found');
                }
                resolve(member);
            });
        });
    }

    function update(id: string, member: Member): Promise<any> {
        return new Promise(function (resolve, reject) {
            MemberModel.findByIdAndUpdate(id, member, function (err: any, memberUpdated: any) {
                if (err) console.log(err);
                resolve(memberUpdated);
            });
        });
    }

    function removeById(id: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            MemberModel.findByIdAndRemove(id, function (err: any) {
                if (err)
                    reject({
                        message: 'Does not possible remove',
                    });

                resolve();
            });
        });
    }

    return service;
}

export default MemberService;
