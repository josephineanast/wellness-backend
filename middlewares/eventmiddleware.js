const User = require("../app/user/model.js");
const Event = require("../app/event/model.js");

async function eventAuthorization(req, res, next) {
  const userRole = req.user && req.user.role;
  const eventId = req.params.eventId;

  if (eventId) {
    Event.findById(eventId)
      .then((event) => {
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }

        if (
          (userRole === "company" && event.company._id.equals(req.user._id)) ||
          (userRole === "vendor" && event.vendor._id.equals(req.user._id))
        ) {
          req.event = event;
          return next();
        } else {
          return res.status(403).json({ error: "Unauthorized" });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    if (req.method === "POST" && req.path === "/create") {
      if (userRole === "company" || userRole === "vendor") {
        return next();
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } else if (
      (req.method === "GET" && req.path === "/my-events") ||
      (req.method === "GET" && req.path === "/api/events/my-events")
    ) {
      if (userRole === "company" || userRole === "vendor") {
        return next();
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  }
}

module.exports = eventAuthorization;
