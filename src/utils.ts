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
