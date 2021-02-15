
# Password validation
Non-standard but needed typescript password validation functions. 

Promote harder to breach and easier to remember passwords.  Create very strict but easy to follow validation rules that most users won't even know the depth of the rules.

This should be throttled as there are some resouce intensive options.

## Threshold

Set threshold to disregard validation. After a certain point, the password is so long that it is very difficult to guess.

## Blacklist word(s) and all variations

Unidirectional or bidirectionally blacklist any variation of a word just by defining the plain text version.

This is to prevent very common words from being used, at a minimum {your app name} and the other top 10 passwords should be blocked.

> "password" would blacklist all variations i.e. p@ssword, p@$sword, p@$$w0rd, pa$$word, etc..., etc...

## Sliding sequential characters

Disallow sequential characters on a **user defined** sliding scale.

**Example** 

> 10 character password can have max of 3 sequential characters.

> 20 character password can have a max of 5 sequential characters.

## Sliding repeating characters

Disallow repeating characters on a **user defined** sliding scale.

**Example**
> 10 character password can have max of 3 similar characters.

> 20 character password can have a max of 5 similar characters.

## Example Usage of Each Rule
```
/**
 *
 * Password cannot repeat too many of the same characters
 * Password cannot contain common keyboard sequences
 * Password cannot contain any variation of the word password or iloveyou
 * the longer the password the less strict the rules are
 *
 */
const validatePassword = (value: string): false | string => {
  const { length } = value;
  
  // most likely first
  // more resource intensive rules should be last.
  if (length < 8) {
    return 'Too short error';
  }
  
  // password is over 30 chars - don't care what it is
  if (length > 30) {
    return false;
  }

  // Divide length by 4 and round down to slide the limit
  const slidingMax = Math.ceil(length / 4);
  if (hasSequential(value, slidingMax)) {
    return 'Sliding sequence error';
  }
  
  if (hasRepeating(value, slidingMax)) {
    return 'Sliding repeating error';
  }
  
  // iloveu will also match iloveyou however not the other way around
  if (hasBlackListedWords(value, ['password', 'iloveu'])) {
    return 'Blacklisted words error';
  }
  if (hasBlackListedWord(value, 'myappname')) {
    return 'Blacklisted word';
  }
  // no errors
  return false;
};
```
