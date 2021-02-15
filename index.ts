const mapLettersToRegex = (word: string, bidirectional = false) => {
  const map: { [key in string]: string } = {
    a: '[a@]',
    b: '[8]',
    c: '[c(]',
    d: '[d6]',
    e: '[e3]',
    f: '[f#]',
    g: '[g9]',
    i: '[i!1l]',
    l: '[l!1i]',
    o: '[o0]',
    q: '[q9]',
    s: '[s5$]',
    w: '(w|uu|vv|2u{1,2})',
    t: '[t+]',
    v: '[v><]',
    x: '(x|%|><{1,2})',
    y: '[y?]',
  };
  const regex = [];
  for (let i = 0; i < word.length; i += 1) {
    regex.push(map[word[i]] || word[i]);
  }
  const forward = regex.join('');
  return bidirectional ? forward : `${forward}|${regex.reverse().join('')}`;
};

export const hasBlackListedWords = (
  value: string,
  words: Array<string>,
): boolean => words.some((word) => new RegExp(mapLettersToRegex(word), 'i').test(value));

export const hasBlackListedWord = (value: string, word: string): boolean => new RegExp(mapLettersToRegex(word), 'i').test(value);

const checkSequence = (value: string, sequence: string, max = 4): boolean => {
  const { length } = value;
  if (!value || length <= max) {
    return false;
  }
  const maxRepeat = max + 1;
  for (let i = 0; i < length - max; i += 1) {
    if (sequence.includes(value.slice(i, +i + maxRepeat))) {
      return true;
    }
  }
  return false;
};

export const hasRepeating = (value: string, max = 3, ci = true): boolean => {
  if (!value || value.length <= max) {
    return false;
  }
  return new RegExp(`(.)\\1{${max},}`, `${ci ? 'i' : ''}`).test(value);
};

export const hasSequential = (value: string, max = 4): boolean => {
  if (!value || value.length <= max) {
    return false;
  }
  const sequences = [
    'qwertyuiop',
    'poiuytrewq',
    'asdfghjkl',
    'lkjhgfdsa',
    'zxcvbnm',
    'mnbvcxz',
    '1qw3e4r5t6y7u8i9o0p',
    'q1we3r4t5y6u7i8o9p0',
    '01234567890',
    '09876543210',
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
  ];
  for (let i = 0; i < sequences.length; i += 1) {
    if (checkSequence(value, sequences[i], max)) {
      return true;
    }
  }
  return false;
};
