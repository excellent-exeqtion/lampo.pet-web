// app/api/basic-data/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getWithErrorHandling, withErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { Empty } from '@/data/index';
import { RepositoryError, StepsStateType, StepStateError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; list: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await params;
            const step = getStep(req);
            if (step.repository) {
                try {
                    const data = await step.repository.findByParentId(id, options);
                    return NextResponse.json(data);
                }
                catch {
                    throw new RepositoryError("Error getting records");
                }
            }
            throw new StepStateError("Missing repository");
        });
}

export async function POST(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    const step = getStep(req);
    return withValidationAndErrorHandling(
        'POST',
        req,
        step.schema,
        async (list) => {
            if (step.repository) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data, error } = await step.repository.createAll(list as any[], options)
                    if (error) {
                        throw new RepositoryError(error.message);
                    }
                    return NextResponse.json(data, { status: 201 });
                }
                catch {
                    throw new RepositoryError("Error upserting records");
                }
            }
            throw new StepStateError("Missing repository");
        }
    );
}

export async function DELETE(req: NextRequest,
    { params }: { params: Promise<{ id: string; list: string }> }) {
    const options = {
        cookies: await cookies()
    }

    const step = getStep(req);
    return withErrorHandling(
        'DELETE',
        req,
        async () => {
            const { id } = await params;
            if (step.repository) {
                const response = await step.repository.delete(id, options);
                if (!response) {
                    throw new RepositoryError("Error deleting record");
                }
                return NextResponse.json({ success: true, message: "Se eliminó correctamente el registro" }, { status: 200 });
            }
            throw new StepStateError("Missing repository");
        }
    )
}

function getStep(req: NextRequest): StepsStateType {
    const filter = Empty.Steps().filter(s => req.url.includes(s.url || "") && s.repository);
    if (filter.length == 0) {
        throw new StepStateError("Missing step");
    }
    else if (filter.length > 1) {
        throw new StepStateError("Too many steps");
    }
    else {
        return filter[0];
    }
}