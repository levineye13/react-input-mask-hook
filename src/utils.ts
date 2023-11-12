export const addAnchors = (regExp: RegExp): RegExp => {
  const str = regExp.toString();
  const splited = str.split('/');

  if (splited[1][0] !== '^') {
    splited[1] = `^${splited[1]}`;
  }

  if (splited[1][splited[1].length - 1] !== '$') {
    splited[1] = `${splited[1]}$`;
  }

  return new RegExp(splited[1], splited[2]);
};

export const normalizePattern = (regExp: string): string => {
  let str = regExp;

  if (str[0] !== '^') {
    str = `^${str}`;
  }

  if (str[str.length - 1] !== '$') {
    str = `${str}$`;
  }

  return str;
};
