export interface Options {
    block?: () => boolean | Promise<boolean>;
}
export declare function block(error: any, options?: Options): boolean;
