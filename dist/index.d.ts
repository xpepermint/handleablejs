export interface HandlerRecipe {
    handler: string;
    message?: string | (() => string);
    code?: number;
    condition?: () => boolean | Promise<boolean>;
    [key: string]: any;
}
export interface HandlerError {
    handler: string;
    message: string;
    code: number;
}
export declare class Handler {
    failFast: boolean;
    handlers: {
        [name: string]: () => boolean | Promise<boolean>;
    };
    context: any;
    constructor({failFast, handlers, context}?: {
        failFast?: boolean;
        handlers?: {
            [name: string]: () => boolean | Promise<boolean>;
        };
        context?: any;
    });
    _createHandlerError(recipe: HandlerRecipe): HandlerError;
    _createString(template: string, data: any): string;
    handle(error: Error, recipes?: HandlerRecipe[]): Promise<HandlerError[]>;
}
