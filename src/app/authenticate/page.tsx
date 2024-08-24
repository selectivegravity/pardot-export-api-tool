"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Authenticate() {

    const [hasCode, setHasCode] = useState(false);

    const searchParams = useSearchParams();
    // const set 
    
    useEffect( () => {
        const hasCode = searchParams.get('hasCode');
        if (hasCode) {
            setHasCode(true);
            console.log('Authorization Code:', hasCode);
        }
        else{
            console.log('Code does not exists');
        }
    }, [searchParams]);
    const onAuth = () => {
        try {
            alert("Authenticating...");
            const client_id = "3MVG9fe4g9fhX0E4bUfo.7zsRrR1XqATjvba_3cLLXOd3Jd23XdC4olTmB7eAVREC73ldnFJoyh1Ylzpt.N0k"; //process.env.NEXT_PUBLIC_CLIENT_ID;
            const redirect_uri = "http://localhost:8000/callback"; // process.env.NEXT_PUBLIC_REDIRECT_URI;

            // Debugging logs
            // console.log("Client ID:", client_id);
            // console.log("Redirect URI:", redirect_uri);

            const salesforceLoginUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
            //aPrxGfV7WpWWFnGlQasVZz82BIB_59cqfkcoqWct4PSdJG0M1k6L_6xjCKnbAJXyO._CLymx5A%3D%3D
            window.open(salesforceLoginUrl, "_blank");
        }
        catch (err) {
            console.log(err);
        }
    };


    const generateTokenWithCode = ()=>{};
    const generateTokenWithRefreshToken = ()=>{};

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <h1 className="text-2xl text-blue-100 border-b-4 border-blue-500"> Authenticate with Salesforce </h1>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"> {hasCode ? "Verified!" : "hasCodePardot Data Export Tool"} </h1>
            {hasCode ? (
                <div className="flex space-x-8">
                    <button 
                        className="p-2 border border-gray-300 bg-green-500 rounded-lg focus:outline-none focus:border-gray-600 btn btn-primary"
                        onClick={generateTokenWithCode}
                    >
                        Generate Access Token using Code
                    </button>
                    <button 
                        className="p-2 border border-gray-300 bg-green-500 rounded-lg focus:outline-none focus:border-gray-600 btn btn-primary"
                        onClick={generateTokenWithRefreshToken}
                    >
                        Generate Access Token with Refresh Token
                    </button>
                </div>
            ) : (
                <button 
                    className="p-2 border border-gray-300 bg-blue-500 rounded-lg mb-4 focus:outline-none focus:border-gray-600 btn btn-primary"
                    onClick={onAuth}
                >
                    Log In with Salesforce
                </button>
            )}
        </main>
    );
}