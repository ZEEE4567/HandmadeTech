const config: {
    db: string;
    secret: string;
    expiresPassword: number;
    saltRounds: number;
} = {
    db: 'mongodb+srv://jpsmoreira02:abril2002@cluster0.xxfkqrd.mongodb.net/Store',
    secret: 'supersecret',
    expiresPassword: 8640000, // expires in 24hours
    saltRounds: 10
};

export default config;