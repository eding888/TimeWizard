export interface TextAndError {
  text: string,
  error: string
}

export function hasCapitalLetter (inputString: string): boolean {
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] !== inputString[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function hasNumber (inputString: string): boolean {
  for (let i = 0; i < inputString.length; i++) {
    if (!isNaN(parseInt(inputString[i]))) {
      return true;
    }
  }
  return false;
}
