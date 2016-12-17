export interface HandlerRecipe {
    handler: string;
    message: string;
    code: number;
    condition?: () => boolean | Promise<boolean>;
    [key: string]: any;
}
export interface HandlerError {
    handler: string;
    message: string;
    code: number;
}
export declare class Handler {
    firstErrorOnly: boolean;
    handlers: {
        [name: string]: () => boolean | Promise<boolean>;
    };
    context: any;
    constructor({firstErrorOnly, handlers, context}?: {
        firstErrorOnly?: boolean;
        handlers?: {
            [name: string]: () => boolean | Promise<boolean>;
        };
        context?: any;
    });
    _createHandlerError(recipe: HandlerRecipe): HandlerError;
    _createString(template: string, data: any): string;
    handle(error: Error, recipes?: HandlerRecipe[]): Promise<HandlerError[]>;
}
