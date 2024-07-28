import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mobile: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
});

const daySchema = new mongoose.Schema({
  date: { type: String, required: true },
  bookings: [bookingSchema],
});

const Booking = mongoose.model("Booking", daySchema);

export default Booking;
