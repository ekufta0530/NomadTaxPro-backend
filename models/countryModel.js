import mongoose from "mongoose";

// Favorite countries
const favoriteCountrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  favoriteCountryIds: [{ type: Number }],
});

export const FavoriteCountry = mongoose.model(
  "FavoriteCountry",
  favoriteCountrySchema
);

// Stay countries
const stayCountrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stays: [
    {
      countryId: { type: Number, required: true },
      dateFrom: { type: Date, required: true },
      dateTo: { type: Date, required: true },
      daysCompleted: { type: Number, default: 0 },
    },
  ],
});

export const StayCountry = mongoose.model("StayCountry", stayCountrySchema);
