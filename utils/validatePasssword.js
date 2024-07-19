const validatePassword = async (str = '') => {
    const { length: l } = str;
    const strArr = str.split('');
    if (l < 6 || l > 20) {
      return false;
    };
    const specialCharacters = '!@#$%^&*()-+';
    const alphabets = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const checkWith = (char, set) => set.includes(char);
    const containsSpecialCharacter = strArr.some(char => checkWith(char, specialCharacters));
    const containsLowercase = strArr.some(char => checkWith(char, alphabets));
    const containsUppercase = strArr.some(char => checkWith(char, alphabets.toUpperCase()));
    const containsNumber = strArr.some(char => checkWith(char, numbers));
  
    return { containsSpecialCharacter, containsLowercase, containsUppercase, containsNumber }
  };

  module.exports={validatePassword}