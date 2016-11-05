export declare type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;
export interface RecipeObject {
    name: string;
    message: string | (() => string);
    [option: string]: any;
}
export declare class HandlerError extends Error {
    error: Error;
    value: any;
    recipe: RecipeObject;
    code: number;
    constructor(error?: Error, value?: any, recipe?: RecipeObject, code?: number);
}
export declare class Handler {
    firstErrorOnly: boolean;
    handlers: {
        [reciper: string]: HandlerBlock;
    };
    context: any;
    constructor({firstErrorOnly, handlers, context}?: {
        firstErrorOnly?: boolean;
        handlers?: {
            [name: string]: HandlerBlock;
        };
        context?: any;
    });
    createHandlerError(error: Error, value: any, recipe: RecipeObject): HandlerError;
    handle(error: Error, value?: any, recipes?: RecipeObject[]): Promise<any[]>;
}
