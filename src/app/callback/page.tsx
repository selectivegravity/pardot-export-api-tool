'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import React from 'react';

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const set 
    
    useEffect( () => {
        const code = searchParams.get('code');
        if (code) {
            console.log('Authorization Code:', code);
            axios.post('/api/callback', { code });
            router.push('/authenticate?hasCode=true');
        }
        else{
            console.log('Code does not exists');
        }
    }, [searchParams]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"> Loading... </h1>
        </main>
    );
}
