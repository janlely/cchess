export const MysqlMapper = {
    getUserBattleInfo : `
        SELECT t1.name, IFNULL(t2.score, 0), IFNULL(t2.wins, 0), IFNULL(t2.draws, 0), IFNULL(t2.matches, 0)
        FROM t_user t1
        LEFT JION t_score t2
        ON t1.id = t2.user_id
        WHERE t1.id = {}
    `,
    getUserByNamePass : `
        SELECT name, id AS userId FROM t_user WHERE name = '{}' AND password = '{}'
    `
}
