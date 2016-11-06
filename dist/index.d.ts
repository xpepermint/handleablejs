export declare type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;
export interface RecipeObject {
    handler: string;
    message: string | (() => string);
    [option: string]: any;
}
export declare class HandlerError extends Error {
    error: Error;
    handler: string;
    message: string;
    code: number;
    constructor(error?: Error, handler?: string, message?: string, code?: number);
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
    protected _createHandlerError(error: Error, recipe: RecipeObject): HandlerError;
    protected _createString(template: any, data: any): string;
    handle(error: Error, value?: any, recipes?: RecipeObject[]): Promise<any[]>;
}
