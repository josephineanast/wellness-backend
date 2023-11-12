const express = require("express");
const router = express.Router();
const eventController = require("./controller.js");
const eventAuthorization = require("../../middlewares/eventmiddleware.js");
const { decodeToken } = require("../../middlewares/authmiddleware.js");

router.use(decodeToken());

router.post("/create", eventAuthorization, eventController.createEvent);
router.get("/my-events", eventAuthorization, eventController.getMyEvents);
router.get("/:eventId", eventAuthorization, eventController.getEvent);
router.put(
  "/:eventId/approve",
  eventAuthorization,
  eventController.approveEvent
);
router.put("/:eventId/reject", eventAuthorization, eventController.rejectEvent);

router.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = router;
