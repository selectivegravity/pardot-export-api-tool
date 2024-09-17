import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const businessUnitId = process.env.NEXT_PUBLIC_BUSINESS_UNIT_ID;
  const cookieAccessToken = cookies().get('XXXaccessToken');
  const accessToken = cookieAccessToken ? cookieAccessToken.value : null;
  const jobId = cookies().get('XXXpardotJobId')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is missing.' }, { status: 400 });
  }

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is missing from cookies.' }, { status: 400 });
  }

  try {
    const url = `https://pi.pardot.com/api/export/version/3/do/read/id/${jobId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Pardot-Business-Unit-Id': businessUnitId,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching job status from Pardot:', error);
    const errorMessage = error.response?.data || 'Failed to fetch job status from Pardot.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
