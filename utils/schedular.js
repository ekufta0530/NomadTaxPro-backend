async function calculateDaysCompleted(stay) {
  if (stay.dateFrom && stay.dateTo) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dateFrom = new Date(stay.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);
    const dateTo = new Date(stay.dateTo);
    dateTo.setHours(0, 0, 0, 0);
    if (currentDate >= dateFrom && currentDate <= dateTo) {
      const difference = currentDate - dateFrom;
      const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
      return daysPassed;
    } else if (currentDate > dateTo) {
      const difference = dateTo - dateFrom;
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      return totalDays;
    } else {
      return 0;
    }
  }
  return 0;
}

// Update daysCompleted for all stays
export async function updateDaysCompletedForAllStays(stayCountry) {
  stayCountry.stays.forEach(async (stay) => {
    stay.daysCompleted = await calculateDaysCompleted(stay);
  });
  await stayCountry.save();
}
