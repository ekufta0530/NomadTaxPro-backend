import asyncHandler from "express-async-handler";
import { FavoriteCountry, StayCountry } from "../models/countryModel.js";
import { updateDaysCompletedForAllStays } from "../utils/schedular.js";

/*-------------------------------------------Favorite Country--------------------------------------------------*/
// Add country as favorite
export const addFavoriteCountry = asyncHandler(async (req, res) => {
  const { countryId, userId } = req.body;
  const favoriteCountry = await FavoriteCountry.findOne({ userId });
  if (favoriteCountry) {
    favoriteCountry.favoriteCountryIds.push(countryId);
    const addedFavorite = await favoriteCountry.save();
    if (addedFavorite) {
      res.status(201).json({ message: "Country added as favorite" });
    } else {
      res.status(400);
      throw new Error("Country could not be added as favorite");
    }
  } else {
    const newFavoriteCountry = new FavoriteCountry({
      userId,
      favoriteCountryIds: [countryId],
    });
    const addedFavorite = await newFavoriteCountry.save();
    if (!addedFavorite) {
      res.status(400);
      throw new Error("Country could not be added as favorite");
    }
    res.status(201).json({ message: "Country added as favorite" });
  }
});

// Remove country from favorite
export const removeFavoriteCountry = asyncHandler(async (req, res) => {
  const { countryId, userId } = req.body;
  const favoriteCountry = await FavoriteCountry.findOne({ userId });
  if (favoriteCountry) {
    favoriteCountry.favoriteCountryIds =
      favoriteCountry.favoriteCountryIds.filter((id) => id !== countryId);
    const removedFavorite = await favoriteCountry.save();
    if (removedFavorite) {
      res.status(201).json({ message: "Country removed from favorite!" });
    } else {
      res.status(400);
      throw new Error("Country could not be removed from favorite!");
    }
  } else {
    res.status(400);
    throw new Error(
      "We could not find your favorite countries with this user!"
    );
  }
});

//   Get favorite country ids
export const getFavoriteCountries = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const favoriteCountry = await FavoriteCountry.findOne({ userId });
  if (favoriteCountry) {
    res
      .status(200)
      .json({ favoriteCountryIds: favoriteCountry.favoriteCountryIds });
  } else {
    res.status(400);
    throw new Error(
      "We could not find your favorite countries with this user!"
    );
  }
});

/*-----------------------------------------------Stays--------------------------------------------------------*/

export const addUpdateStay = asyncHandler(async (req, res) => {
  const { countryId, dateFrom, dateTo, userId } = req.body;
  const stayCountry = await StayCountry.findOne({ userId });

  if (stayCountry) {
    const stayIndex = stayCountry.stays.findIndex(
      (stay) => stay.countryId === countryId
    );
    if (stayIndex !== -1) {
      stayCountry.stays[stayIndex].dateFrom = dateFrom;
      stayCountry.stays[stayIndex].dateTo = dateTo;
      const updatedStay = await stayCountry.save();
      if (updatedStay) {
        await updateDaysCompletedForAllStays(stayCountry);
        res.status(201).json({ message: "Stay updated!" });
      } else {
        res.status(400);
        throw new Error("Stay could not be updated!");
      }
      return;
    } else {
      // Add new stay
      stayCountry.stays.push({ countryId, dateFrom, dateTo });
      const addedStay = await stayCountry.save();
      if (!addedStay) {
        res.status(400);
        throw new Error("Stay could not be added!");
      }
      await updateDaysCompletedForAllStays(stayCountry);
      res.status(201).json({ message: "Stay added!" });
      return;
    }
  } else {
    const addedStay = await StayCountry.create({
      userId,
      stays: [{ countryId, dateFrom, dateTo }],
    });
    if (!addedStay) {
      res.status(400);
      throw new Error("Stay could not be added!");
    }
    await updateDaysCompletedForAllStays(addedStay);
    res.status(201).json({ message: "Stay added!" });
  }
});

export const getStays = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const stays = await StayCountry.findOne({ userId });
  if (stays) {
    res.status(200).json({ data: stays.stays });
  } else {
    res.status(400);
    throw new Error("We could not find your stays!");
  }
});
