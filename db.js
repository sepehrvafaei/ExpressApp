const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'sepehr',
});
module.exports = pool;