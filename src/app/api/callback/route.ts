import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // axios.post('/api/callback', { code })
        const reqBody = await request.json();
        const { code } = reqBody;
        console.log('Route Code', code);
        cookies().set('XXXcode', code);
        if(!code){
            return NextResponse.json({error:" Code does not exists"},{status:400});
        }
        return NextResponse.json({message:"Success"},{status:200});
    }
    catch (err) { 
        console.log(err) 
    }

    return new Response("Hello, Next.js!");
}