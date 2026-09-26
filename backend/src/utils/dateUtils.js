// Formats a Date object to YYYY-MM-DD
const formatDateString = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculates current streak and longest streak from completed date strings
const calculateStreaks = (completedDates = []) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort dates ascending
  const uniqueSortedDates = Array.from(new Set(completedDates)).sort();

  let maxStreak = 0;
  let currentRun = 0;

  const dateSet = new Set(uniqueSortedDates);

  // Today and Yesterday date strings
  const todayStr = formatDateString(new Date());
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = formatDateString(yesterdayObj);

  // Calculate longest streak
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of uniqueSortedDates) {
    const curr = new Date(dateStr);

    if (prevDate) {
      const diffDays = Math.round((curr - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }

    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
    prevDate = curr;
  }

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  // If today is completed, start counting backwards from today
  if (dateSet.has(todayStr)) {
    while (dateSet.has(formatDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    // If today is not completed yet, check if yesterday was completed to keep current streak active
    checkDate.setDate(checkDate.getDate() - 1);
    while (dateSet.has(formatDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return {
    currentStreak,
    longestStreak: maxStreak,
  };
};

// Returns date range array for past N days
const getPastNDays = (days = 90) => {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDateString(d));
  }

  return dates;
};

module.exports = {
  formatDateString,
  calculateStreaks,
  getPastNDays,
};
