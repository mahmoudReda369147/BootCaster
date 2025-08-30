import { NextResponse } from "next/server";

export default function asyncWraper(handler) {
    return async (requist, context) => {
        try {
            return await handler(requist, context);
        } catch (error) {
            return NextResponse.json(
                {
                    status: error.errorName || "error",
                    data: null,
                    message: error.message || "Server error",
                },
                { status: error.status || 500 }
            );
        }
    };
}
