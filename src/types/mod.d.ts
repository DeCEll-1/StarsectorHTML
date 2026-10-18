export {};

declare global {
    export interface ModInfo {
        id                  : string;
        name                : string;
        author              : string;
        version             : string;
        description         : string;
        gameVersion         : string;
        jars                : string[];
        modPlugin           : string;
        dependencies        : Dependency[];
        originalGameVersion : string;
        directory           : string;
        icon                : string;
    }

    export interface Dependency {
        id                  : string;
        name                : string;
    }
}