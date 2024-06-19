import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(_: NextRequest) {
    try {
        const serverUrl = process.env.SERVER_URL;
        const response = await axios.get(`${serverUrl}/api/mean`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            {
                message:
                    error.response?.data?.message || "Internal Server Error",
            },
            { status: error.response?.status || 500 },
        );
    }
}
