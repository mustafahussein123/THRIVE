// src/models/Rental.js
import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  zpid: String,
  id: String,
  providerListingId: String,
  imgSrc: String,
  detailUrl: String,
  address: String,
  addressStreet: String,
  addressCity: String,
  addressState: String,
  addressZipcode: String,
  units: [
    {
      price: String,
      beds: String,
      roomForRent: Boolean
    }
  ],
  latLong: {
    latitude: Number,
    longitude: Number
  },
  // You can add any additional fields as needed
}, { collection: 'zillow_rentals' }); // Ensure this matches your MongoDB collection name

const Rental = mongoose.model('Rental', rentalSchema);

export default Rental;
