import express from "express";
import { getAllBookings,addBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/all", getAllBookings);
router.post("/add", addBooking);

export default router;