"use client";
import { useState } from "react";

export default function ClipboardComponent() {
    const [isCopied, setIsCopied] = useState(false);

    // Mock access token for demonstration
    const accessToken = "your-access-token-here";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(accessToken);
            setIsCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Access Token</h2>
            <div className="relative w-full">
                <input
                    type="text"
                    readOnly
                    value={accessToken}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                />
                <button
                    onClick={handleCopy}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                >
                    <svg
                        className={`w-5 h-5 ${isCopied ? "text-green-500" : "text-blue-500"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        {isCopied ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 2a1 1 0 011-1h4a1 1 0 011 1v1h6V2a1 1 0 011-1h4a1 1 0 011 1v16a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1V2zM4 4v16h16V4H4zM8 12l2 2 4-4m0 0l-4-4-2 2"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H5zM4 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            />
                        )}
                    </svg>
                </button>
            </div>
            <p className={`mt-2 text-sm ${isCopied ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                {isCopied ? "Token copied to clipboard!" : "Click the button to copy the token"}
            </p>
        </div>
    );
}
