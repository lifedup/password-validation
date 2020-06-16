const mapLettersToRegex = (word: string, bidirectional = false)=> {
    const map: {[key in string]: string} = {
        a:"[a@]", b: "[8]", c:"[c(]", d:"[d6]", e:"[e3]",
        f:"[f#]", g:"[g9]", i:"[i!1l]", l:"[l!1i]", o:"[o0]",
        q:"[q9]", s:"[s5$]", w:"(w|uu|vv|2u{1,2})", t:"[t+]",
        v:"[v><]", x:"(x|%|><{1,2})", y:"[y?]"
    }
    let regex = [];
    for (let i = 0; i < word.length; i++){
        regex.push(map[word[i]] || word[i]);
    }
    const forward = regex.join("");
    return bidirectional ? forward: `${forward}|${regex.reverse().join("")}`;
}

const hasBlackListedWords = async (value: string, words: Array<string>)=> (
    words.some((word)=> new RegExp(mapLettersToRegex(word),"i").test(value))
)

const hasBlackListedWord = async (value: string, word: string)=> (
    new RegExp(mapLettersToRegex(word),"i").test(value)
)

const checkSequence = (value: string, sequence: string, max=4) => {
    const length = value.length;
    if(!value || length <= max){ return false;}
    const maxRepeat = max + 1;
    for (let i = 0; i < length-max; ++i) {
        if(sequence.includes(value.slice(i, +i + maxRepeat))){
            return true;
        }
    }
    return false;
}

const hasRepeating = async (value: string, max=3, ci=true) => {
    if(!value || value.length <= max){ return false}
    return new RegExp(`(.)\\1{${max},}`, `${ci ? "i": ""}`).test(value);
}

const hasSequential = async (value: string, max = 4)=> {
    if(!value || value.length <= max){ return false;}
    const sequences = ["qwertyuiop","poiuytrewq","asdfghjkl",
        "lkjhgfdsa","zxcvbnm","mnbvcxz","1qw3e4r5t6y7u8i9o0p",
        "q1we3r4t5y6u7i8o9p0","01234567890","09876543210",
        "abcdefghijklmnopqrstuvwxyz","zyxwvutsrqponmlkjihgfedcba"
    ];
    for (let i = 0; i < sequences.length; i++){
        if(checkSequence(value, sequences[i], max)){
          return true;
        }
    }
    return false;
}

/**
 *
 * @param value - the password
 * @param min - Min password length
 * @param threshold - when to stop checking rules
 *
 * Password cannot repeat too many of the same characters
 * Password cannot contain common keyboard sequences
 * Password cannot contain any variation of the word password or iloveyou
 * the longer the password the less strict the rules are
 *
 */
export const ValidatePassword = async (value: string, min = 10, max = 255, threshold = 30) =>{
    const length = value.length;
    if(length > threshold){
        return false
    };
    if(length > max ){
        return `That's one strong password, but to be it's a ${length - max + 1} characters too long.`
    }
    const message = "Try joining a few words together that only mean something to you.";
    if(length < min){
        return `Keep on typing, you need at least ${length - min + 1} more characters. ${message}`
    }
    const slidingMax = Math.ceil(length/4);
    if(await hasSequential(value, slidingMax)){
        return `To help protect your privacy, you cannot use that keyboard sequence because it is one of the most used passwords. ${message}`
    }
    if(await hasRepeating(value, slidingMax )){
        return `To help protect your privacy, you cannot repeat the same character that many times in a row. The longer your passphrase is the less strict this rule gets. ${message}`
    }
    if(await hasBlackListedWord(value, "password")){
        return `We love your simplicity and direct nature, but, in order to protect your privacy, you cannot use any variation of the word "password". The longer your passphrase is the less strict this rule gets. ${message}`
    }
    if(await hasBlackListedWord(value, "lifedup")){
        return `We are humbled, but you cannot use any variation of the word "lifedup" in your password. ${message}`;
    }
    if(await hasBlackListedWords(value, ["iloveu", "iloveyou"])){
        return `We love you too...but really it's not you it's us. In order to help protect your privacy, you cannot use any variation of the word "iloveyou" in your password. ${message}`;
    }
    return false;
}
