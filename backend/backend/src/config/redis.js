const {createClient}=require('redis');

const redisClient = createClient({
    username: 'default',
     password: process.env.REDIS_PASS,
    socket: {
        host: 'savory-ebullient-scale-73460.db.redis.io',
        port: 14844
    }
});
module.exports=redisClient;
