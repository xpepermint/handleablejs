export interface Options {
    block?: (error: any, options: any) => boolean | Promise<boolean>;
}
export declare function block(error: any, options?: Options): boolean;
