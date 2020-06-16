# Password validation
Typescript password validation functions that will be turned into a package one day. 

Promote harder to breach and easier to remember passwords.  Create very strict but easy to follow validation rules that most users won't even know the depth of the rules.

This should be throttled as there are some resouce intensive options.

## Threshold

Set threshold to disregard validation. This is because after a certain point, the password is so long that it is very difficult to guess.

## Blacklist word(s) and all variations

Unidirectional or bidirectionally blacklist any variation of a word just by defining the plain text version.

This is to prevent very common words from being used, at a minimum {your app name} and the other top 10 passwords should be blocked.

> "password" would blacklist all variations i.e. p@ssword, p@$sword, p@$$w0rd, pa$$word, etc..., etc...

## Sliding sequential characters

Disallow sequential characters on a **user defined** sliding scale.

> Example 
> 10 character password can have max of 3 sequential characters.
> 20 character password can have a max of 5 sequential characters.

## Sliding repeating characters

Disallow repeating characters on a **user defined** sliding scale.

> Example 
> 10 character password can have max of 3 similar characters.
> 20 character password can have a max of 5 similar characters.

## Min & max

Set minimum and maximum (optional) password lengths.
