export type GameTheme = {
    name: string;
    colors: {
        background: string;
        foreground: string;
        'card-foreground': string;
        card: string;
        primary: string;
        text: string;
        mutedText: string;
        border: string;
    };
    sheetBackground: string | undefined;
    font: string;
};