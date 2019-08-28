module.exports = {
    dialect: 'postgres',
    host: '192.168.99.101',
    username: 'postgres',
    password: 'admin',
    database: 'meetapp',
    define: {
        timeStamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
