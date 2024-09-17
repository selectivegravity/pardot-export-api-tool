import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const businessUnitId = process.env.NEXT_PUBLIC_BUSINESS_UNIT_ID; // Regular env variable
  const cookieAccessToken = cookies().get('XXXaccessToken');
  const accessToken = cookieAccessToken ? cookieAccessToken.value : null;
  
  // Parse the request body as JSON
  const { jsonOutput } = await request.json();

  if (!jsonOutput) {
    return NextResponse.json({ error: 'JSON body is required.' }, { status: 400 });
  }

  try {
    const url = `https://pi.pardot.com/api/export/version/3/do/create`;

    // Convert jsonOutput to URL-encoded form
    const formData = new URLSearchParams(jsonOutput);
    console.log('Business Unit ID:', businessUnitId);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`,
        'Pardot-Business-Unit-Id': businessUnitId,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error('Error making request to Pardot:', error);
    return NextResponse.json({ error: 'Failed to send request to Pardot.' }, { status: 500 });
  }
}
