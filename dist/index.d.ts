export declare type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;
export interface RecipeObject {
    name: string;
    message: string | (() => string);
    [option: string]: any;
}
export declare class HandledError extends Error {
    recipe: RecipeObject;
    error: Error;
    value: any;
    code: number;
    constructor(recipe: RecipeObject, error?: Error, value?: any, code?: number);
}
export declare class Handler {
    firstErrorOnly: boolean;
    handledError: typeof HandledError;
    handlers: {
        [reciper: string]: HandlerBlock;
    };
    context: any;
    constructor({firstErrorOnly, handledError, handlers, context}?: {
        firstErrorOnly?: boolean;
        handledError?: typeof HandledError;
        handlers?: {
            [name: string]: HandlerBlock;
        };
        context?: any;
    });
    handle(error: Error, value?: any, recipes?: RecipeObject[]): Promise<any[]>;
}
