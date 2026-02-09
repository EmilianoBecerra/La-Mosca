import type { NextFunction, Request, Response } from "express";
interface USERJWT {
    nombre: string;
    password: string;
}
export declare const generarToken: (user: USERJWT) => string | undefined;
export declare const authToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=jwt.middleware.d.ts.map