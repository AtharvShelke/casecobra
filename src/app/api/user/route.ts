import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        console.log("Received data:", data);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json({ success: false, error: "Invalid JSON data" }, { status: 400 });
    }
};
