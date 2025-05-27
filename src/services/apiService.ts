import { QueryParamError, StepStateError, RepositoryError, ValidationResult } from "@/types/lib";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";

/** 
 * Envuelve la ejecución de un handler de API, capturando cualquier excepción
 * y devolviendo un 500 en caso de error interno.
 *
 * @param req    – el NextRequest que llega
 * @param handler– Función que ejecuta la lógica de negocio y devuelve un NextResponse
 */
export async function getWithErrorHandling(
    req: NextRequest,
    handler: () => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        return await handler()
    } catch (err: unknown) {
        console.error(`[GET] Error en ${req.url} —`, err);
        // 3) Falta de parámetro de query → 400
        if (err instanceof QueryParamError) {
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

/**
 * Extrae un parámetro de query y lanza QueryParamError si no existe.
 */
export function getRequiredQueryParam(req: NextRequest, name: string): string {
    const value = req.nextUrl.searchParams.get(name)
    if (!value) {
        throw new QueryParamError(`${name} es requerido`)
    }
    return value
}

/**
 * Combina validación de body con manejo de errores.
 * 
 * @param method – nombre del método HTTP (para logging)
 * @param req    – el NextRequest que llega
 * @param schema – el ZodSchema contra el que validar
 * @param handler– función que recibe el body ya parseado
 */
export async function withErrorHandling(
    method: string,
    req: NextRequest,
    handler: () => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        // 2) Lógica de negocio con body ya parseado
        return await handler();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(`[${method}] Error en ${req.url} —`, JSON.stringify(err));
        // 3) Falta de parámetro de query → 400
        if (err instanceof QueryParamError) {
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 400 }
            )
        }
        // 4) Falta de configuración en el step -> 500
        if (err instanceof StepStateError) {
            return NextResponse.json(
                { success: false, message: `Error interno del servidor | ${err.message}` },
                { status: 500 }
            )
        }
        // 5) Error con el patron repository -> 500
        if (err instanceof RepositoryError) {
            return NextResponse.json(
                { success: false, message: `Error interno del servidor | ${err.message}` },
                { status: 500 }
            )
        }

        // 6) Cualquier otro error cae aquí
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

/**
 * Combina validación de body con manejo de errores.
 * 
 * @param method – nombre del método HTTP (para logging)
 * @param req    – el NextRequest que llega
 * @param schema – el ZodSchema contra el que validar
 * @param handler– función que recibe el body ya parseado
 */
export async function withValidationAndErrorHandling<T>(
    method: string,
    req: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: ZodSchema<any>,
    handler: (data: T) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        // 1) Validación del body
        const { data, error } = await validateBody(req, schema);
        if (error) {
            return error;
        }

        // 2) Lógica de negocio con body ya parseado
        return await handler(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(`[${method}] Error en ${req.url} —`, JSON.stringify(err));
        // 3) Falta de parámetro de query → 400
        if (err instanceof QueryParamError) {
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 400 }
            )
        }
        // 4) Falta de configuración en el step -> 500
        if (err instanceof StepStateError) {
            return NextResponse.json(
                { success: false, message: `Error interno del servidor | ${err.message}` },
                { status: 500 }
            )
        }
        // 5) Error con el patron repository -> 500
        if (err instanceof RepositoryError) {
            return NextResponse.json(
                { success: false, message: `Error interno del servidor | ${err.message}` },
                { status: 500 }
            )
        }

        // 6) Cualquier otro error cae aquí
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

/**
 * Valida y parsea el body de la request según el esquema.
 * @param req NextRequest
 * @param schema ZodSchema que define la forma esperada
 * @returns Un objeto { data } si parseó bien, o { error } con NextResponse si falló.
 */
async function validateBody<T>(
    req: NextRequest,
    schema: ZodSchema<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ValidationResult<any>> {
    try {
        const body = await req.json();
        if (Array.isArray(body)) {
            body.forEach((e: T) => {
                const parsed = schema.safeParse(e);
                if (!parsed.success) {
                    // Opcionalmente, podemos enviar detalles de ZodError.flatten()
                    return {
                        error: NextResponse.json(
                            {
                                success: false,
                                message: "Payload inválido",
                                errors: (parsed.error as ZodError).format(),
                            },
                            { status: 400 }
                        ),
                    };
                }
            });
        }
        else {
            const parsed = schema.safeParse(body);
            if (!parsed.success) {
                // Opcionalmente, podemos enviar detalles de ZodError.flatten()
                return {
                    error: NextResponse.json(
                        {
                            success: false,
                            message: "Payload inválido",
                            errors: (parsed.error as ZodError).format(),
                        },
                        { status: 400 }
                    ),
                };
            }
        }
        return { data: body };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        // JSON inválido u otro error de lectura
        return {
            error: NextResponse.json(
                { success: false, message: err.message || "No se pudo leer el body" },
                { status: 400 }
            ),
        };
    }
}