import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        console.log("Received request for GET api/mean");
        const serverUrl = process.env.SERVER_URL;
        console.log(`Fowarding request to ${serverUrl}/api/mean`);

        const headers = { Cookie: req.headers.get("Cookie") };
        console.log(`Forwarding headers: ${JSON.stringify(headers)}`);

        const response = await axios.get(`${serverUrl}/api/mean`, {
            headers: headers,
            withCredentials: true,
        });
        console.log(`Received response from NestJS backend: ${response.data}`);

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error(`Error requesting NestJS backend: ${error}`);

        return NextResponse.json(
            {
                message:
                    error.response?.data?.message || "Internal Server Error",
            },
            { status: error.response?.status || 500 },
        );
    }
}
