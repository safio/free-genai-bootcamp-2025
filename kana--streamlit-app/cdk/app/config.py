ALL_ARABIC_LIST = ["ا", "ب", "ت", "ث", "ج",
                   "ح", "خ", "د", "ذ", "ر",
                   "ز", "س", "ش", "ص", "ض",
                   "ط", "ظ", "ع", "غ", "ف",
                   "ق", "ك", "ل", "م", "ن",
                   "ه", "و", "ي"]

SELECT_KANA_DICT = {"Arabic": ALL_ARABIC_LIST}
#create ALL_LATIN_LIST
ALL_LATIN_LIST = ["alif", "ba", "ta", "tha", "jim",
                  "ha", "kha", "dal", "dhal", "ra",
                  "zay", "sin", "shin", "sad", "dad",
                  "ta", "dha", "ayn", "ghayn", "fa"]

LATIN_TO_ARABIC = {"alif": "ا", "ba": "ب", "ta": "ت", "tha": "ث", "jim": "ج",
                    "ha": "ح", "kha": "خ", "dal": "د", "dhal": "ذ", "ra": "ر",
                    "zay": "ز", "sin": "س", "shin": "ش", "sad": "ص", "dad": "ض",
                    "ta": "ط", "dha": "ظ", "ayn": "ع", "ghayn": "غ", "fa": "ف",
                    "qaf": "ق", "kaf": "ك", "lam": "ل", "mim": "م", "nun": "ن",
                    "ha": "ه", "waw": "و", "ya": "ي"}

CHECK_KANA_DICT = {"Arabic": LATIN_TO_ARABIC}
