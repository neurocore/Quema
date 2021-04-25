class User
{
    constructor(ban_endtime = 0, joined_cnt = 0, played_cnt = 0, banned_cnt = 0)
    {
        this.ban_endtime = ban_endtime;
        this.joined_cnt = joined_cnt;
        this.played_cnt = played_cnt;
        this.banned_cnt = banned_cnt;
    }

    is_banned()
    {
        return this.ban_endtime > Date.now();
    }

    ban_for(minutes)
    {
        this.ban_endtime = Date.now() + minutes * 60 * 1000;
        this.banned_cnt++;
    }

    ban_permanent()
    {
        this.ban_endtime = 8640000000000000;
        this.banned_cnt++;
    }

    unban()
    {
        this.ban_endtime = Date.now();
    }
}

module.exports = User;
