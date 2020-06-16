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
    //most likley first
    //more resouce intensive rules should be last.
    if(length < min){
        return 'Too short error'
    }
    if(length > threshold){
        return false
    };
    if(max && length > max ){
        return 'Too long error'
    }
    //dont define until we need it
    const slidingMax = Math.ceil(length/4);
    if(await hasSequential(value, slidingMax)){
        return 'Sliding sequence error'
    }
    if(await hasRepeating(value, slidingMax )){
        return 'Sliding repeating error'
    }
    //iloveu will also match iloveyou however not the other way around
    if(await hasBlackListedWords(value, ["password", "iloveu"])){
        return 'Blacklisted words error'
    }
    if(await hasBlackListedWord(value, "appname")){
        return 'Blacklisted word';
    }
    return false;
}
