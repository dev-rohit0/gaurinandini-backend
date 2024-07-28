import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectToDB } from './db/db.js';
import Booking from './models/Booking.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allTimeSlots = generateTimeSlots();
app.use(express.json());
app.use(cors({
  origin:'https://gaurinandini-backend.onrender.com'
}
  
))
// Connect to MongoDB
connectToDB();

app.post('/book-appointment', async (req, res) => {
  const { name, description, mobile, date, timeSlot } = req.body;

  try {
    let dayBooking = await Booking.findOne({ date });

    if (!dayBooking) {
      dayBooking = new Booking({
        date,
        bookings: [{ name, description, mobile, date, timeSlot }]
      });
    } else {
      dayBooking.bookings.push({ name, description, mobile, date, timeSlot });
    }

    await dayBooking.save();
    res.status(200).send('Booking saved successfully');
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).send({ message: 'Error saving booking', error });
  }
});


app.get('/appointment/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const booking = await Booking.findOne({ date });

    if (!booking) {
      return res.status(404).send('No bookings found for this date');
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).send('Error retrieving bookings');
  }
});

app.get('/available-slots/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const booking = await Booking.findOne({ date });

    let bookedSlots = [];
    if (booking) {
      bookedSlots = booking.bookings.map(b => b.timeSlot);
    }

    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).send('Error retrieving available slots');
  }
});


function generateTimeSlots() {
  const slots = [];
  const startHour = 8;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    const slot1 = `${hour.toString().padStart(2, "0")}:00AM-${hour
      .toString()
      .padStart(2, "0")}:30AM`;
    const slot2 = `${hour.toString().padStart(2, "0")}:30AM-${(hour + 1)
      .toString()
      .padStart(2, "0")}:00AM`;
    slots.push(slot1, slot2);
  }
  return slots;
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
