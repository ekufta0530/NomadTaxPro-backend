// Complete day when date is passed
async function calculateDaysCompleted(stay) {
  if (stay.dateFrom && stay.dateTo) {
    const currentDate = new Date();
    if (currentDate >= stay.dateFrom && currentDate <= stay.dateTo) {
      const difference = currentDate.getTime() - stay.dateFrom.getTime();
      const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
      return daysPassed;
    } else if (currentDate > stay.dateTo) {
      const difference = stay.dateTo.getTime() - stay.dateFrom.getTime();
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
