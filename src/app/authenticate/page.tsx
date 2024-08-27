"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// import ClipboardComponent from "../clipboard/page";

export default function Authenticate() {
    const router = useRouter();
    const [hasCode, setHasCode] = useState(false);
    const searchParams = useSearchParams();
    const [isCopied, setIsCopied] = useState(false);
    const [accessToken, setAccessToken] = useState(
        "Please generate an access token and copy it."
    );
    const [grantType, setGrantType] = useState("authorizationCode");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const hasCode = searchParams.get("hasCode");
        if (hasCode) {
            setHasCode(true);
            console.log("Authorization Code:", hasCode);
        } else {
            console.log("Code does not exists");
        }
    }, [searchParams]);

    const onAuth = () => {
        try {
            // alert("Authenticating...");
            const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
            const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
            const salesforceLoginUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
            window.open(salesforceLoginUrl, "_self");
        } catch (err) {
            setErrorMessage("Error: " + err);
            console.log(err);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(accessToken);
            setIsCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err: any) {
            setErrorMessage("Error: " + err);
            console.error("Failed to copy text: ", err);
        }
    };

    const generateTokenWithCode = async () => {
        try {
            if (accessToken == "Please generate an access token and copy it.") {
                const updatedGrantType = "authorizationCode"; // Use a local variable instead
                setGrantType(updatedGrantType);
                const response = await axios.post("/api/authenticateUtil", { grantType: updatedGrantType });
                console.log("Response:", response);
                setAccessToken(response.data.response.sendResponse.access_token);
            }
        } catch (err: any) {
            setErrorMessage("Error: " + err);
            console.error("Error in generateTokenWithCode:", err.response?.data || err.message);
        }
    };

    const generateTokenWithRefreshToken = async () => { // Make this function async
        try {
            const updatedGrantType = "refreshToken"; // Use a local variable instead
            setGrantType(updatedGrantType);
            const response = await axios.post("/api/authenticateUtil", { grantType: updatedGrantType });
            console.log("Response:", response.data.response.sendResponse);
            setAccessToken(response.data.response.sendResponse);
        } catch (err: any) {
            setErrorMessage("Error: " + err);
            console.error("Error in generateTokenWithRefreshToken:", err.response?.data || err.message);
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#039be5"
                    d="M36.5,12c-1.326,0-2.59,0.256-3.758,0.705C31.321,10.48,28.836,9,26,9c-2.107,0-4.018,0.821-5.447,2.152C18.815,9.221,16.303,8,13.5,8C8.253,8,4,12.253,4,17.5c0,0.792,0.108,1.558,0.29,2.293C2.291,21.349,1,23.771,1,26.5C1,31.194,4.806,35,9.5,35c0.413,0,0.816-0.039,1.214-0.096C12.027,37.903,15.017,40,18.5,40c3.162,0,5.916-1.731,7.38-4.293C26.556,35.893,27.265,36,28,36c2.62,0,4.938-1.265,6.398-3.211C35.077,32.927,35.78,33,36.5,33C42.299,33,47,28.299,47,22.5C47,16.701,42.299,12,36.5,12z"
                ></path>
                <path
                    fill="#fff"
                    d="M15.823 25c.045 0 .076-.037.076-.083C15.899 24.963 15.867 25 15.823 25L15.823 25zM21.503 23.934c.024 0 .047.008.055.013-.008-.005-.03-.013-.053-.013C21.504 23.933 21.503 23.934 21.503 23.934zM7.138 23.93c.023 0 .045.008.058.016-.013-.007-.034-.017-.056-.017C7.139 23.929 7.138 23.93 7.138 23.93zM24.126 21.909c-.016.039-.046.045-.072.043.004.001.004.003.009.003C24.086 21.954 24.112 21.944 24.126 21.909zM15.823 19c.045 0 .076.037.076.082C15.899 19.037 15.867 19 15.823 19L15.823 19zM21.359 22.185L21.359 22.185c0 .408.211.662.506.835C21.569 22.847 21.359 22.594 21.359 22.185zM38.126 24.729c.025.061-.032.087-.032.087S38.151 24.79 38.126 24.729zM8.558 21L8.558 21c.253 0 .503.034.733.093C9.061 21.034 8.811 21 8.558 21zM9.764 21.909c-.016.039-.046.045-.072.043.004.001.004.003.009.003C9.725 21.954 9.75 21.944 9.764 21.909zM35.195 24.164c.065.106.142.203.229.293s.185.169.294.237c-.109-.068-.207-.147-.294-.237C35.337 24.368 35.261 24.27 35.195 24.164zM37.83 21.797c-.012 0-.026-.002-.026-.002s.01.004.024.004C37.828 21.799 37.829 21.797 37.83 21.797zM37.832 24.189c0 0 .017-.003.034-.004-.001 0-.001-.001-.002-.001C37.846 24.184 37.832 24.189 37.832 24.189z"
                ></path>
                <path
                    fill="#fff"
                    d="M6.885 24.462c-.029.07.01.084.02.096.087.058.174.1.262.146C7.636 24.933 8.08 25 8.543 25c.944 0 1.53-.462 1.53-1.207v-.014c0-.689-.662-.939-1.282-1.12L8.71 22.635c-.468-.14-.871-.261-.871-.545v-.014c0-.243.236-.422.602-.422.406 0 .888.125 1.199.283 0 0 .092.054.125-.027.018-.044.175-.434.192-.476.018-.045-.014-.08-.046-.098C9.555 21.136 9.065 21 8.558 21l-.094.001c-.864 0-1.467.481-1.467 1.17v.014c0 .726.665.962 1.289 1.126l.1.029c.454.128.846.239.846.533v.015c0 .269-.255.47-.665.47-.16 0-.667-.002-1.216-.322C7.285 24 7.247 23.975 7.196 23.946c-.027-.016-.095-.042-.124.039L6.885 24.462zM21.247 24.462c-.029.07.01.084.02.096.087.058.174.1.262.146C21.998 24.933 22.442 25 22.905 25c.944 0 1.53-.462 1.53-1.207v-.014c0-.689-.662-.939-1.282-1.12l-.081-.024c-.468-.14-.871-.261-.871-.545v-.014c0-.243.236-.422.602-.422.406 0 .888.125 1.199.283 0 0 .092.054.125-.027.018-.044.175-.434.192-.476.018-.045-.014-.08-.046-.098C23.917 21.136 23.427 21 22.92 21l-.094.001c-.864 0-1.467.481-1.467 1.17v.014c0 .726.666.962 1.289 1.126l.1.029c.454.128.846.239.846.533v.015c0 .269-.255.47-.665.47-.16 0-.667-.002-1.216-.322-.066-.036-.105-.06-.155-.09-.017-.01-.097-.039-.124.039L21.247 24.462zM31.465 22.219c-.077-.243-.198-.457-.358-.635-.16-.179-.364-.322-.605-.426C30.261 21.053 29.977 21 29.658 21c-.32 0-.604.053-.845.157s-.444.248-.604.427c-.161.178-.281.392-.358.634-.077.241-.116.505-.116.785s.039.544.116.785c.077.242.197.456.358.635.16.179.364.322.605.423S29.338 25 29.658 25c.319 0 .602-.051.844-.153.241-.102.444-.245.605-.423.16-.178.281-.392.358-.635.077-.241.116-.505.116-.785C31.581 22.724 31.542 22.46 31.465 22.219M30.677 23.004c0 .423-.085.758-.253.993-.166.233-.417.347-.767.347s-.6-.114-.763-.347c-.166-.236-.249-.57-.249-.993s.084-.756.249-.99c.164-.231.414-.343.764-.343s.6.112.767.343C30.592 22.247 30.677 22.581 30.677 23.004M37.933 24.233c-.026-.071-.101-.044-.101-.044-.114.041-.236.078-.366.097-.131.019-.276.029-.431.029-.381 0-.684-.105-.901-.313-.217-.208-.339-.544-.338-.999.001-.413.109-.724.302-.962.192-.236.485-.357.874-.357.325 0 .573.035.832.11 0 0 .062.025.091-.05.07-.178.12-.304.194-.499.021-.056-.03-.079-.049-.086-.102-.037-.343-.098-.525-.124C37.345 21.013 37.145 21 36.924 21c-.331 0-.625.053-.878.157-.252.103-.465.247-.635.426-.169.179-.297.392-.383.634-.086.241-.128.506-.128.787 0 .606.176 1.095.524 1.453C35.773 24.818 36.296 25 36.979 25c.404 0 .817-.076 1.116-.184 0 0 .057-.026.032-.087L37.933 24.233zM41.963 22.081c-.067-.235-.233-.471-.341-.579-.172-.172-.34-.292-.506-.358C40.898 21.057 40.638 21 40.352 21c-.333 0-.635.052-.88.159-.245.107-.452.253-.614.435-.162.181-.283.397-.361.642-.078.243-.117.509-.117.789 0 .285.041.551.121.79.081.241.211.453.386.629.176.177.401.315.671.412.268.096.594.146.968.145.77-.002 1.176-.161 1.343-.247.03-.016.057-.042.023-.119l-.175-.453c-.026-.067-.1-.043-.1-.043-.191.066-.462.184-1.095.183-.414-.001-.72-.113-.912-.291-.197-.181-.294-.447-.31-.822l2.666.002c0 0 .07-.001.078-.065C42.045 23.119 42.134 22.637 41.963 22.081M39.311 22.597c.038-.235.107-.431.216-.583.163-.231.412-.359.762-.359.35 0 .581.128.747.359.11.153.158.356.177.584L39.311 22.597zM20.453 22.081c-.067-.235-.233-.471-.341-.579-.172-.172-.339-.292-.506-.358C19.388 21.057 19.128 21 18.843 21c-.333 0-.635.052-.881.159-.245.107-.452.253-.614.435-.162.181-.283.397-.361.642-.078.243-.117.509-.117.789 0 .285.041.551.121.79.081.241.211.453.386.629.176.177.401.315.671.412.268.096.594.146.968.145.77-.002 1.176-.161 1.343-.247.03-.016.057-.042.023-.119l-.175-.453c-.026-.067-.1-.043-.1-.043-.191.066-.462.184-1.095.183-.413-.001-.72-.113-.912-.291-.197-.181-.294-.447-.31-.822l2.666.002c0 0 .07-.001.078-.065C20.536 23.119 20.624 22.637 20.453 22.081M17.802 22.597c.038-.235.107-.431.215-.583.164-.231.412-.359.763-.359.35 0 .581.128.748.359.11.153.158.356.176.584L17.802 22.597zM12.93 22.482c-.108-.007-.248-.011-.416-.011-.229 0-.45.026-.657.078-.208.052-.395.132-.556.239-.162.108-.292.245-.387.408s-.143.355-.143.569c0 .219.041.409.122.564.081.156.198.286.347.387.148.1.331.174.543.218C11.994 24.977 12.231 25 12.491 25c.274 0 .546-.021.81-.063.262-.041.582-.101.671-.121.089-.019.187-.044.187-.044.066-.016.061-.081.061-.081l-.001-2.259c0-.496-.143-.863-.423-1.091C13.515 21.115 13.102 21 12.57 21c-.2 0-.521.025-.715.061 0 0-.582.105-.821.279 0 0-.053.03-.024.098l.189.47c.024.061.088.04.088.04s.02-.007.044-.021c.512-.258 1.161-.251 1.161-.251.288 0 .51.054.659.16.145.104.219.259.219.589v.105C13.141 22.499 12.93 22.482 12.93 22.482M11.869 24.218c-.105-.077-.119-.096-.153-.147-.053-.076-.08-.184-.08-.321 0-.217.078-.373.238-.478-.001 0 .23-.185.773-.179.382.004.724.057.724.057v1.123c0 0-.339.067-.72.088C12.109 24.392 11.867 24.217 11.869 24.218M34.76 21.169c.02-.058-.022-.085-.04-.092-.045-.016-.272-.062-.447-.073-.335-.019-.521.034-.688.106-.166.071-.349.187-.45.318l-.001-.311c0-.043-.032-.077-.076-.077h-.684c-.045 0-.076.034-.076.077v3.806c0 .043.036.077.081.077h.7c.045 0 .08-.034.08-.077v-1.901c0-.256.03-.51.089-.67.057-.158.136-.285.233-.375.097-.091.208-.154.33-.19.124-.036.261-.049.357-.049.14 0 .293.035.293.035.052.005.08-.025.098-.069C34.606 21.588 34.736 21.238 34.76 21.169"
                ></path>
                <path
                    fill="#fff"
                    d="M28.203 19.106c-.085-.026-.162-.044-.264-.062-.103-.019-.224-.028-.362-.028-.482 0-.862.137-1.129.406-.265.267-.446.674-.536 1.209l-.05.366h-.605c0 0-.074-.003-.089.078l-.099.554c-.007.053.016.086.087.086h.59l-.598 3.337c-.047.268-.1.489-.16.657-.058.166-.116.289-.186.379-.068.087-.133.151-.244.189-.092.03-.198.045-.314.045-.064 0-.15-.011-.214-.024-.064-.012-.097-.026-.144-.046 0 0-.069-.026-.097.043-.022.057-.178.489-.197.542-.019.053.007.094.041.106.078.028.137.046.243.071.149.035.274.037.391.037.245 0 .469-.034.654-.101.187-.068.349-.185.493-.343.155-.172.253-.352.346-.597.093-.243.171-.544.235-.896l.6-3.399h.878c0 0 .074.003.089-.078l.099-.554c.007-.053-.016-.086-.087-.086h-.853c.004-.019.06-.505.158-.787.042-.121.12-.218.187-.285.065-.066.141-.112.223-.139.085-.027.181-.041.286-.041.08 0 .159.009.219.022.082.018.115.027.137.033.087.027.098.001.116-.041l.203-.56C28.273 19.139 28.222 19.114 28.203 19.106M15.899 24.917c0 .046-.032.083-.076.083h-.707c-.045 0-.076-.037-.076-.083v-5.834c0-.046.032-.082.076-.082h.707c.045 0 .076.037.076.082V24.917z"
                ></path>
            </svg>
            {/* <h1 className="text-2xl text-blue-100 border-b-4 border-blue-500">
        {" "}
        Authenticate with Salesforce{" "}
      </h1> */}
            {hasCode ? (
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-green-400 md:text-5xl lg:text-6xl">
                    {" "}
                    Verified!{" "}
                </h1>
            ) : (
                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                        Pardot Data
                    </span>{" "}
                    Export Tool{" "}
                    <small className="ms-2 text-gray-100 text-sm dark:text-gray-100">
                        (using Export API)
                    </small>
                </h1>
            )}

            {/* Clipboard Start */}
            {hasCode ? (
                <div className="w-1/3 relative">
                    <input
                        type="text"
                        readOnly
                        value={accessToken}
                        className="w-4/5 text-center bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400"
                    />
                    <button
                        onClick={handleCopy}
                        className={`border ${isCopied ? "bg-gray-100 text-gray-900" : "bg-blue-500"
                            } rounded-lg border-gray-100 text-gray-100 absolute inset-y-0 right-0 flex items-center px-3`}
                    >
                        {isCopied ? "Copied! " : "Copy "}
                        <svg
                            className={`w-5 h-5 ml-1 ${isCopied ? "text-green-500" : "text-grey-100"
                                }`}
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
            ) : (
                ""
            )}
            {/* Clipboard End */}

            {errorMessage && 
                <div>   
                <div className="relative">
                    <input type="text" id="outlined_error" aria-describedby="outlined_error_help" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" placeholder=" " />
                    <label className="absolute text-sm text-red-600 dark:text-red-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"> Please re-authenticate using Salesforce</label>
                </div>
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>    
            </div>}

            {accessToken!=="Please generate an access token and copy it." && (
                <div className="flex space-x-8">
                    <button
                        className="p-2 text-black border border-gray-300 hover:border-gray-600 bg-blue-100 hover:bg-gray-300 rounded-lg focus:outline-none focus:border-gray-600 btn btn-primary"
                        onClick={()=>router.push('/exportData')} 
                    >
                        Extract Pardot Data
                    </button>
                </div>
            )}

            {hasCode ? (
                <div className="flex space-x-8">
                    <button
                        className="p-2 border border-gray-300 hover:border-gray-600 bg-blue-500 hover:bg-blue-700 rounded-lg focus:outline-none focus:border-gray-600 btn btn-primary"
                        onClick={generateTokenWithCode}
                    >
                        Generate using Code
                    </button>
                    <button
                        className="p-2 border border-gray-300 hover:border-gray-600 bg-blue-500 hover:bg-blue-700 rounded-lg focus:outline-none focus:border-gray-600 btn btn-primary"
                        onClick={generateTokenWithRefreshToken}
                    >
                        Generate with Refresh Token
                    </button>
                </div>
            ) : (
                <button
                    className="p-2 border border-gray-300 bg-blue-600 hover:bg-blue-700 rounded-lg mb-4 focus:outline-none focus:border-gray-600 btn btn-primary"
                    onClick={onAuth}
                >
                    Log In with Salesforce
                </button>
            )}
        </main>
    );
}
