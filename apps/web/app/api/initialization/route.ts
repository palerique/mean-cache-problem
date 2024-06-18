import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const {fingerprint} = await req.json();
    try {
        const serverUrl = process.env.SERVER_URL;
        const response = await axios.post(`${serverUrl}/initialization`, {fingerprint});
        return new NextResponse(response.data,
            {
                status: 200,
                headers: {
                    'Set-Cookie': `fingerprint=${fingerprint}; path=/; HttpOnly`
                }
            });
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.response?.data?.message || "Internal Server Error"
            },
            {
                status: error.response?.status || 500,
                headers: {
                    'Set-Cookie': `fingerprint=${fingerprint}; path=/; HttpOnly`
                }
            }
        );
    }
}
