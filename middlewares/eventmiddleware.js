const Event = require("../app/event/model.js");

function eventAuthorization(req, res, next) {
  const userRole = req.user && req.user.role;
  const eventId = req.params.eventId;

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is missing" });
  }

  Event.findById(eventId)
    .populate("company vendor")
    .exec((err, event) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

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
    });
}

module.exports = eventAuthorization;
