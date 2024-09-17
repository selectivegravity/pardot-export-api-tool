import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const businessUnitId = process.env.NEXT_PUBLIC_BUSINESS_UNIT_ID;
  const cookieAccessToken = cookies().get('XXXaccessToken');
  const accessToken = cookieAccessToken ? cookieAccessToken.value : null;

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is missing.' }, { status: 400 });
  }

  try {
    const url = `https://pi.pardot.com/api/export/version/3/do/query?format=json&sort_by=id&sort_order=descending`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`,
        'Pardot-Business-Unit-Id': businessUnitId,
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching jobs from Pardot:', error);
    const errorMessage = error.response?.data || 'Failed to fetch jobs from Pardot.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
