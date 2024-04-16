// async function calculateDaysCompleted(stay, periodStartDate) {
//   if (stay.dateFrom && stay.dateTo) {
//     const currentDate = new Date();
//     const startPeriodDate = new Date(periodStartDate);
//     const dateFrom = new Date(stay.dateFrom);
//     const dateTo = new Date(stay.dateTo);

//     // Ensure dates are compared without time (set hours to 0)
//     currentDate.setHours(0, 0, 0, 0);
//     startPeriodDate.setHours(0, 0, 0, 0);
//     dateFrom.setHours(0, 0, 0, 0);
//     dateTo.setHours(0, 0, 0, 0);

//     // Calculate days completed within the stay period and after the start period date
//     if (currentDate >= startPeriodDate && currentDate >= dateFrom && currentDate <= dateTo) {
//       const startDate = new Date(Math.max(dateFrom, startPeriodDate));
//       const endDate = currentDate;
//       const difference = endDate - startDate;
//       const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
//       return daysPassed;
//     } else {
//       return 0;
//     }
//   }
//   return 0;
// }


async function calculateDaysCompleted(stay, periodStartDate) {
  if (stay.dateFrom && stay.dateTo) {
    const startPeriodDate = new Date(periodStartDate);
    const dateFrom = new Date(stay.dateFrom);
    const dateTo = new Date(stay.dateTo);
    const todayDate = new Date();

    // Ensure dates are compared without time (set hours to 0)
    startPeriodDate.setHours(0, 0, 0, 0);
    dateFrom.setHours(0, 0, 0, 0);
    dateTo.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    // Calculate the number of days completed within the stay period and after the start period date
    if (dateTo >= startPeriodDate)  {
      const startDate = new Date(Math.max(dateFrom, startPeriodDate));
      const endDate = new Date(Math.min(todayDate, dateTo));
      const difference = endDate - startDate;
      const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24)); 
      return daysPassed;
    } else {
      return 0;
    }
  }
  return 0;
}


// async function calculateDaysCompleted(stay,periodStartDate) {
//   if (stay.dateFrom && stay.dateTo) {
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);
//     const dateFrom = new Date(stay.dateFrom);
//     dateFrom.setHours(0, 0, 0, 0);
//     const dateTo = new Date(stay.dateTo);
//     dateTo.setHours(0, 0, 0, 0);
//     if (currentDate >= dateFrom && currentDate <= dateTo) {
//       const difference = currentDate - dateFrom;
//       const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));
//       return daysPassed;
//     } else if (currentDate > dateTo) {
//       const difference = dateTo - dateFrom;
//       const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
//       return totalDays;
//     } else {
//       return 0;
//     }
//   }
//   return 0;
// }

// // Update daysCompleted for all stays
// export async function updateDaysCompletedForAllStays(
//   stayCountry,
//   periodStartDate
// ) {

//     const staysAfterPeriodStartDate = stayCountry.stays.filter(
//       (stay) =>
//         stay.dateFrom.setHours(0, 0, 0, 0) >=
//           periodStartDate.setHours(0, 0, 0, 0) 
//     );

//     const staysBeforePeriodStartDate = stayCountry.stays.filter(
//       (stay) =>
//         stay.dateFrom.setHours(0, 0, 0, 0) <
//           periodStartDate.setHours(0, 0, 0, 0) 
//     );

//     if (staysAfterPeriodStartDate) {
//       staysAfterPeriodStartDate.forEach(async (stay) => {
//         stay.daysCompleted = await calculateDaysCompleted(stay);
//       });
//       await stayCountry.save();
//     }
//     if (staysBeforePeriodStartDate) {
//       staysBeforePeriodStartDate.forEach(async (stay) => {
//         stay.daysCompleted = 0;
//       });
//       await stayCountry.save();
//     }
  
// }

// Update daysCompleted for all stays
export async function updateDaysCompletedForAllStays(stayCountry,periodStartDate) {
  stayCountry.stays.forEach(async (stay) => {
    stay.daysCompleted = await calculateDaysCompleted(stay,periodStartDate);
  });
  await stayCountry.save();
}