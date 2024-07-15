export const isPasswordStrong = (password) => {
  // check password strength
  const hasLowercaseLetter = () => !!password.match(/[a-z]/);
  const hasUppercaseLetter = () => !!password.match(/[A-Z]/);
  const hasNumber = () => !!password.match(/[0-9]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasNumber(password) &&
    hasUppercaseLetter(password) &&
    hasLowercaseLetter(password);

  return passwordIsArbitrarilyStrongEnough;
};
