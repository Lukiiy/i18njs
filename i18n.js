const DEFAULT_LANG = "en";
const STORAGE = "lang";

const I18n = {
    lang: DEFAULT_LANG,
    strings: {}, // the jsonlike lang keys with string values
    originals: new WeakMap(), // entries vanish if element is removed

    // Registers strings for a set language
    add(lang, strings) {
        this.strings[lang] = Object.assign(this.strings[lang] || {}, strings);
    },

    // get a string for the current language
    translate(key, fallback) {
        const table = this.strings[this.lang];

        return (table && table[key]) ?? fallback ?? key;
    },

    // get (or create) the saved original content for an element
    getOriginal(obj) {
        if (!this.originals.has(obj)) this.originals.set(obj, { text: obj.textContent, attrs: {} });

        return this.originals.get(obj);
    },

    apply() {},
    set() {},
    init() { // TODO
        // grab stuff, check & save data, yada yaday yadaydada
    },
};