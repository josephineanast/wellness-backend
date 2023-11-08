const express = require("express");
const router = express.Router();
const eventController = require("./controller.js");
const eventAuthorization = require("../../middlewares/eventmiddleware.js");

router.post("/create", eventAuthorization, eventController.createEvent);

router.get("/:eventId", eventAuthorization, eventController.getEvent);

router.get("/my-events", eventAuthorization, eventController.getMyEvents);

router.put(
  "/:eventId/approve",
  eventAuthorization,
  eventController.approveEvent
);
router.put("/:eventId/reject", eventAuthorization, eventController.rejectEvent);

module.exports = router;
