class User
{
  constructor(joined = 0, played = 0, is_banned = 0, banned = 0)
  {
    this.is_banned = is_banned;
    this.joined = joined;
    this.played = played;
    this.banned = banned;
  }
}

module.exports = User;