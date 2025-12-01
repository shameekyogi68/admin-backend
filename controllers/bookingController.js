
import Booking from "../models/bookingModel.js";

// Admin: Get all bookings


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ bookings }); // ✅ IMPORTANT
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


// Add Booking
export const addBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking" });
  }
};