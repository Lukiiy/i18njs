const DEFAULT_LANG = "en";
const STORAGE = "lang";
const TRANSLATE_POINT = "[data-i18n]";
const TRANSLATE_ATTR_POINT = "[data-i18n-attr]";

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

    // applies the translations to every element that has the translate attribute
    apply(root = document) {
        root.querySelectorAll(TRANSLATE_POINT).forEach((obj) => {
            const table = this.strings[this.lang] || {};
            const original = this.getOriginal(obj);

            obj.textContent = table[obj.dataset.i18n] ?? original.text;
        });

        root.querySelectorAll(TRANSLATE_ATTR_POINT).forEach((obj) => {
            const original = this.getOriginal(obj);
            const table = this.strings[this.lang] || {};

            obj.dataset.i18nAttr.split(';').forEach((pair) => {
                const [attr, key] = pair.split('=').map((s) => s.trim());
                if (!attr || !key) return;

                if (!(attr in original.attrs)) original.attrs[attr] = obj.getAttribute(attr) ?? '';

                obj.setAttribute(attr, table[key] ?? original.attrs[attr]);
            });
        });
    },

    // Switch language and apply changes
    set(lang) {
        this.lang = lang;
        document.documentElement.lang = lang; // this is the html tag lang thing, which may affect screen readers and spell checking

        try {
            localStorage.setItem(STORAGE, lang);
        } catch (err) {}

        this.apply();
    },

    init() {
        let saved = null;

        try {
            saved = localStorage.getItem(STORAGE);
        } catch (err) {}

        const wanted = saved || navigator.language.slice(0, 2);

        if (wanted !== DEFAULT_LANG && this.strings[wanted]) this.set(wanted);
    },
};

document.addEventListener("DOMContentLoaded", () => I18n.init());