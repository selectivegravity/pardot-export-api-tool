import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const accesstoken = request.cookies.get('XXXaccessToken')?.value || "";
    const code = request.cookies.get('XXXcode')?.value || "";
    const refreshToken = request.cookies.get('XXXrefreshToken')?.value || "";

    // Prevent further redirection if already on /exportData
    if (path === '/exportData') {
        if (accesstoken && refreshToken && code) {
            // If tokens and code are present, stay on /exportData
            return NextResponse.next();
        }
        // If not all required tokens/codes are present, redirect to authentication
        return NextResponse.redirect(new URL('/authenticate', request.nextUrl));
    }

    // Logic to handle redirection to /exportData
    if (accesstoken && refreshToken && code && path !== '/exportData') {
        return NextResponse.redirect(new URL('/exportData', request.nextUrl));
    }

    // Logic to handle authorization code state
    if (code && path !== '/authenticate') {
        return NextResponse.redirect(new URL('/authenticate?hasCode=true', request.nextUrl));
    }

    // Logic to handle case when no code is present
    if (!code && path !== '/authenticate') {
        return NextResponse.redirect(new URL('/authenticate', request.nextUrl));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/authenticate', '/exportData'],
};
