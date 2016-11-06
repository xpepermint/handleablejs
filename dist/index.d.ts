export declare type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;
export interface RecipeObject {
    handler: string;
    message: string | (() => string);
    [option: string]: any;
}
export declare class HandlerError extends Error {
    handler: string;
    message: string;
    code: number;
    constructor(handler: string, message?: string, code?: number);
    toObject(): {
        name: string;
        message: string;
        handler: string;
        code: number;
    };
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
    protected _createHandlerError(recipe: RecipeObject): HandlerError;
    protected _createString(template: any, data: any): string;
    handle(error: Error, recipes?: RecipeObject[]): Promise<any[]>;
}
