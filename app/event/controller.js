const Event = require("./model.js");

const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    eventData.company = req.user._id;

    const event = new Event(eventData);
    await event.save();

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEvent = (req, res) => {
  const event = req.event;
  return res.json(event);
};

const getMyEvents = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  const query = {
    [userRole]: userId,
  };

  try {
    const events = await Event.find(query);
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveEvent = async (req, res) => {
  const event = req.event;
  event.status = "Approved";
  event.confirmedDate = new Date();
  await event.save();
  return res.json(event);
};

const rejectEvent = async (req, res) => {
  const event = req.event;
  const { remarks } = req.body;
  event.status = "Rejected";
  event.remarks = remarks;
  await event.save();
  return res.json(event);
};

module.exports = {
  createEvent,
  getEvent,
  getMyEvents,
  approveEvent,
  rejectEvent,
};
