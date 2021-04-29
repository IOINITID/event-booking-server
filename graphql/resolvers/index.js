const authReslover = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");

const rootResolver = {
  ...authReslover,
  ...eventsResolver,
  ...bookingResolver,
};

module.exports = rootResolver;
