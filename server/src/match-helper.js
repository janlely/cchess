class MatchHelper{
    constructor(redis){
        this.redis = redis
        this.redisMatchQueueKey = 'CCHESS_MATCH_QUEUE';
        this.matchRange = 100;
    }
    async push(userId, score, time) {
        console.log(userId)
        console.log(score)
        console.log(time)
        await this.redis.zadd([this.redisMatchQueueKey, score, userId]);
    }
    async pop(userId, score) {
        let minScore = score - this.matchRange;
        let maxScore = score + this.matchRange;
        let matcher = await this.redis.zrangebyscoreAsync([this.redisMatchQueueKey, minScore, maxScore, 'WITHSCORES','LIMIT', 0, 2])
        console.log(matcher)
        let enemyId = '';
        let enemyScore = 0;
        if(matcher.length == 2){
            if(matcher[0] == userId) {
                return null;
            }
            enemyId = matcher[0];
            enemyScore = matcher[1];
        }else if(matcher.length == 4){
            if(matcher[0] == userId) {
                enemyId = matcher[2];
                enemyScore = matcher[3];
            }else {
                enemyId = matcher[0];
                enemyScore = matcher[1];
            }
        }
        let i = await this.redis.zremAsync([this.redisMatchQueueKey, userId]);
        if(i != 1){
            this.redis.zadd([this.redisMatchQueueKey, score, userId]);
            return null;
        }
        let j = await this.redis.zremAsync([this.redisMatchQueueKey, enemyId]);
        if(j != 1){
            this.redis.zadd([this.redisMatchQueueKey, score, userId, enemyScore, enemyId]);
            return null;
        }
        return [userId, enemyId].map(num => parseInt(num, 10));
    }
}

export default MatchHelper;
