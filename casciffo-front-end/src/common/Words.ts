const words: Word = {
    add_comment: {
        pt: "Adicionar comentário",
        en: "Create comment"
    },
    add_observation: {
        pt: "Adicionar observação",
        en: "Create observation"
    }
}

type Word = {
    [key: string]: Languages
}

type Languages = {
    pt: string,
    en: string
}
// for future use
class Words {
    language;
    constructor(language: string) {
        this.language = language
    }

    getSentence(key: string) : string {
        return words[key as keyof Word][this.language as keyof Languages]
    }
}

export {words}