export const MysqlMapper = {
    getUserBattleInfo : `
        SELECT t1.name, IFNULL(t2.score, 0) AS score, IFNULL(t2.wins, 0) AS wins, IFNULL(t2.draws, 0) AS draws, IFNULL(t2.matches, 0) AS matches
        FROM t_user t1
        LEFT JOIN t_score t2
        ON t1.id = t2.user_id
        WHERE t1.id = {}
    `,
    getUserByNamePass : `
        SELECT name, id AS userId FROM t_user WHERE name = '{}' AND password = '{}'
    `,
    addNewUser : `
        INSERT INTO t_user (name, password) VALUES ('{}', '{}')
        ON DUPLICATE KEY UPDATE password=VALUES(password), enable = 1
    `,
    checkUserExist : `
        SELECT name FROM t_user WHERE name = '{}' AND enable = 1
    `
}
