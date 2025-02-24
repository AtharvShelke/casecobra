import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    if (!params.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const configuration = await db.configuration.findUnique({
        where: { id: params.id },
    });

    if (!configuration) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(configuration);
}
