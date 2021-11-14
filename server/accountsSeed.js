export function seedAccounts() {
  // Init Roles
  ['admin', 'captain', 'viewer'].forEach(function (role) {
    Roles.createRole(role, {unlessExists: true});
  });

  // Init Accounts
  let rawAccounts = process.env.USER_ACCOUNTS;
  if (rawAccounts) {
    let accounts = rawAccounts.split(',')
      .map(a => {
        if (!a)
          return;

        let parts = a.trim().split(' ').map(x => x.trim());
        if (parts.length !== 3)
          return;

        return ({
          username: parts[0],
          password: parts[1],
          role: parts[2]
        })
      })
      .filter(x => x);

      accounts.forEach(account => {
        if (!Accounts.findUserByUsername(account.username)) {
          Accounts.createUser(account);
      
          let user = Accounts.findUserByUsername(account.username);
          if (user) {
            Roles.addUsersToRoles(user._id, account.role, Roles.GLOBAL_GROUP);
          }
        }
      });
  }
}