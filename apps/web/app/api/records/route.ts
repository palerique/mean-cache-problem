import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const {value} = await req.json();
    try {
        const serverUrl = process.env.SERVER_URL;
        const response = await axios.post(`${serverUrl}/records`, {value});
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            {message: error.response?.data?.message || "Internal Server Error"},
            {status: error.response?.status || 500}
        );
    }
}
