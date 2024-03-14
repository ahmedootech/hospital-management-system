interface AgeDetails {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

export const calculateDetailedAge = (dateOfBirth: string): AgeDetails => {
  const today: Date = new Date();
  const birthDate: Date = new Date(dateOfBirth);

  let ageInYears: number = today.getFullYear() - birthDate.getFullYear();
  let ageInMonths: number = today.getMonth() - birthDate.getMonth();
  let ageInDays: number = today.getDate() - birthDate.getDate();

  // Adjust for negative months or days
  if (ageInMonths < 0 || (ageInMonths === 0 && ageInDays < 0)) {
    ageInYears--;
    ageInMonths += 12;

    // Calculate the number of days remaining in the uncompleted month
    const tempDate: Date = new Date(today.getFullYear(), today.getMonth(), 0);
    ageInDays = today.getDate() + (tempDate.getDate() - birthDate.getDate());
  }

  // Calculate the number of weeks remaining in the uncompleted month
  const remainingDaysInMonth: number =
    (today.getDate() - birthDate.getDate()) % 7;
  const weeks: number = Math.floor((ageInDays - remainingDaysInMonth) / 7);

  return {
    years: ageInYears,
    months: ageInMonths,
    weeks: weeks,
    days: ageInDays % 7,
  };
};

// export const calculateDetailedAge = (dateOfBirth: string): AgeDetails => {
//   const today: Date = new Date();
//   const birthDate: Date = new Date(dateOfBirth);

//   let ageInYears: number = today.getFullYear() - birthDate.getFullYear();
//   let ageInMonths: number = today.getMonth() - birthDate.getMonth();
//   let ageInDays: number = today.getDate() - birthDate.getDate();

//   console.log('Today', today.getMonth());
//   console.log('Birth', birthDate.getMonth());
//   console.log('Months', ageInMonths);

//   if (ageInMonths < 0 || (ageInMonths === 0 && ageInDays < 0)) {
//     ageInYears--;
//     ageInMonths += 12;
//   }

//   const weeksInMilliSeconds: number = 1000 * 60 * 60 * 24 * 7;
//   const weeks: number = Math.floor(
//     (today.getTime() - birthDate.getTime()) / weeksInMilliSeconds
//   );

//   const remainingDays: number =
//     (today.getTime() - birthDate.getTime()) % weeksInMilliSeconds;
//   const days: number = Math.floor(remainingDays / (1000 * 60 * 60 * 24));

//   return {
//     years: ageInYears,
//     months: ageInMonths,
//     weeks: weeks,
//     days: days,
//   };
// };

// Function to format the detailed age
export const formatDetailedAge = (age: AgeDetails): string => {
  return `${age.years}y ${age.months}m ${age.weeks}w ${age.days}d`;
  //   return `${age.years}y ${age.months}m ${age.days}d`;
};

// Example usage:
const dateOfBirth: string = '2000-01-15'; // Replace with the actual date of birth in YYYY-MM-DD format
const detailedAge: AgeDetails = calculateDetailedAge(dateOfBirth);
const formattedAge: string = formatDetailedAge(detailedAge);
console.log(`The person's age is ${formattedAge}`);
