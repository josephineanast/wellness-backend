const { AsyncAbility, AbilityBuilder } = require("@casl/ability");

function getToken(req) {
  let token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  return token && token.length ? token : null;
}

const policies = {
  company(user, { can }) {
    can("read", "Event", { companyId: user.companyId });
    can("create", "Event", { companyId: user.companyId });
  },

  vendor(user, { can }) {
    can("read", "Event", { vendorId: user.vendorId });
    can("update", "Event", { vendorId: user.vendorId });
  },

  admin(user, { can }) {
    can("manage", "all");
  },

  guest(user, { can }) {
    can("read", "LoginPage");
  },
};

const policyFor = async (user) => {
  const { can, cannot, rules } = new AbilityBuilder();

  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, { can, cannot });
  } else {
    cannot("manage", "all");
  }

  return new AsyncAbility(rules);
};

module.exports = {
  getToken,
  policyFor,
};
