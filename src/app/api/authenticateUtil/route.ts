import { error } from "console";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // axios.post('/api/authenticateUtil', { grantType })
        const reqBody = await request.json();
        const { grantType } = reqBody;
        const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
        const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
        const cookieCode = cookies().get('XXXcode');
        const code = cookieCode ? cookieCode.value : null;
        console.log('Route Code', code);
        const cookieRefreshToken = cookies().get('XXXrefreshToken');
        const refresh_token = cookieRefreshToken ? cookieRefreshToken.value : null;
        console.log('Route Refresh Token', refresh_token);
        const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
        console.log('Route Grant Type', grantType);
        if(!grantType){
            throw new Error("Grant Type is NULL");
        }
        else if(grantType == "refreshToken"){
            console.log("Refresh Token");
            const grant_type = "refresh_token";
            try{
                if(refresh_token){
                    const response = await fetch("https://login.salesforce.com/services/oauth2/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&refresh_token=${refresh_token}&redirect_uri=${redirect_uri}`,
                    });
                    const data = await response.json();
                    console.log(data);
                    cookies().set('XXXaccessToken', data.access_token);
                    const sendResponse = data.access_token;
                    if(data.error){
                        return NextResponse.json({message:data.error_description},{status:400});
                    }
                    return NextResponse.json({message:"Success", response: { sendResponse }},{status:200});
                }
            }
            catch(err){
                console.log(err);
                return NextResponse.json({message:"Failed"},{status:400});
            }
        }
        else if(grantType == "authorizationCode"){
            console.log("Authorization Code");
            const grant_type = "authorization_code";
            console.log("Request Body: "+`client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&code=${code}&redirect_uri=${redirect_uri}`);
            try{
                if(code){
                    const response = await fetch("https://login.salesforce.com/services/oauth2/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&code=${code}&redirect_uri=${redirect_uri}`,
                    });
                    const data = await response.json();
                    console.log(data);
                    if(data.error){
                        return NextResponse.json({message:data.error_description},{status:400});
                    }
                    cookies().set('XXXaccessToken', data.access_token);
                    cookies().set('XXXrefreshToken', data.refresh_token);
                    const sendResponse = {
                        access_token: data.access_token,
                        refresh_token: data.refresh_token
                    }
                    return NextResponse.json({message:"Success", response: { sendResponse }},{status:200});
                }
            }
            catch(err){
                console.log(err);
                return NextResponse.json({message:"Failed", error:err},{status:400});
            }
        }
        else{
            throw new Error("Invalid Grant Type");
        }
    }
    catch (err) { 
        console.log(err) 
    }
}