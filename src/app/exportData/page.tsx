"use client";

import axios from 'axios';
import { cookies } from 'next/headers';
import { useState } from 'react';

export default function JsonInputForm() {
    const [object, setObject] = useState('');
    const [fields, setFields] = useState('');
    const [procedureName, setProcedureName] = useState('');
    const [argumentsJson, setArgumentsJson] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');

    const handleGenerateJson = () => {
        setError('');
        try {
            if (!object || !fields || !procedureName || !argumentsJson) {
                setError('All fields are required.');
                return;
            }

            let argumentsObj;
            try {
                argumentsObj = JSON.parse(argumentsJson);
                if (typeof argumentsObj !== 'object' || argumentsObj === null) {
                    throw new Error('Invalid JSON object.');
                }
            } catch (e) {
                setError('Invalid JSON format for arguments.');
                return;
            }

            const fieldsArray = fields.split(',').map(field => field.trim());

            const jsonBody = {
                object,
                fields: fieldsArray,
                procedure: {
                    name: procedureName,
                    arguments: argumentsObj
                }
            };

            setJsonOutput(JSON.stringify(jsonBody, null, 2));
        } catch (error) {
            setError('An unexpected error occurred.');
        }
    };

    const handleSendRequest = async () => {
        setError('');
        setResponse('');

        if (!jsonOutput) {
            setError('Please generate the JSON body before sending the request.');
            return;
        }

        try {
            const response = await axios.post('/api/sendRequest', { jsonOutput });
            if (response.data) {
                setResponse(JSON.stringify(response.data, null, 2));
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                setResponse(`Error from Pardot:\n\n ${error.response.data.error}`);
            } else if (error.message) {
                setResponse(`An unexpected error occurred:\n\n ${error.message}`);
            } else {
                setResponse('Failed to send request. Please try again.');
            }
            setError(error.message);
            console.error("Error log:", error.response?.data?.error || error.message);
        }
    };


    const handleGetStatus = async () => {
        setError('');
        setResponse('');
        try {
            const response = await axios.get('/api/getJobStatus');
            const result = response.data;
            if (result.error) {
                setResponse(`Error: ${result.error}`);
            } else {
                setResponse(JSON.stringify(result, null, 2));
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                setResponse(`Failed to fetch job status:\n\n ${error.response.data.error}`);
            } else if (error.message) {
                setResponse(`An unexpected error occurred while fetching job status:\n\n ${error.message}`);
            } else {
                setResponse('Failed to fetch job status, Please try again.');
            }
            setError(error.message);
            console.error("Error log:", error.response?.data?.error || error.message);
        }
    };


    const handleGetAllStatus = async () => {
        try {
          const response = await axios.get('/api/getAllJobStatuses');
          const result = response.data;
          if (result.error) {
            setResponse(`Error: ${result.error}`);
          } else {
            setResponse(JSON.stringify(result.data, null, 2));
          }
        } catch (error:any) {
          console.error('Error fetching all jobs:', error); // Log the full error object
          if (error.response && error.response.data) {
            setResponse(`Failed to fetch jobs: ${JSON.stringify(error.response.data, null, 2)}`);
          } else if (error.message) {
            setResponse(`An unexpected error occurred: ${error.message}`);
          } else {
            setResponse('Failed to fetch jobs, Please try again.');
          }
        }
      };
      


    return (
        <div className="flex min-h-screen">

            {/* JSON Input Form */}
            <div className="opacity-75 bg-center bg-cover bg-no-repeat border border-green-300 border-8 border-l-0 flex-1 p-6 rounded-r-lg shadow-md dark:bg-[url('https://wp.salesforce.com/en-ap/wp-content/uploads/sites/14/2024/02/php-marquee-starter-sm-bg.jpg?w=731')]">

                <h1 className="text-2xl font-extrabold dark:text-blue-500 text-center text-gray-100 mb-16 mt-4">JSON Input Form</h1>
                <form className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="object" className="text-blue-500 font-medium text-sm">Object:</label>
                        <input
                            className="w-full text-base p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            type="text"
                            id="object"
                            name="object"
                            value={object}
                            onChange={(e) => setObject(e.target.value)}
                            placeholder="Enter object name"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="fields" className="text-blue-500 font-medium text-sm">Fields (comma-separated):</label>
                        <input
                            className="w-full text-base p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            type="text"
                            id="fields"
                            name="fields"
                            value={fields}
                            onChange={(e) => setFields(e.target.value)}
                            placeholder="Enter fields separated by commas"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="procedureName" className="text-blue-500 font-medium text-sm">Procedure Name:</label>
                        <input
                            className="w-full text-base p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            type="text"
                            id="procedureName"
                            name="procedureName"
                            value={procedureName}
                            onChange={(e) => setProcedureName(e.target.value)}
                            placeholder="Enter procedure name"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="arguments" className="text-blue-500 font-medium text-sm">Arguments (JSON format):</label>
                        <textarea
                            className="w-full text-gray-700 p-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            id="arguments"
                            name="arguments"

                            value={argumentsJson}
                            onChange={(e) => setArgumentsJson(e.target.value)}
                            placeholder='{"key": "value"}'
                            required
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerateJson}
                        className="w-full bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        Generate JSON
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        <p>{error}</p>
                    </div>
                )}

                {jsonOutput && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-green-500">Generated JSON: </h2>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto text-sm">{jsonOutput}</pre>
                    </div>
                )}
            </div>

            {/* Request Handling and Response Display */}
            <div className="flex-1 p-6 rounded-l-lg shadow-md bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <h2 className="text-2xl font-extrabold dark:text-white text-center text-gray-900 mb-16 mt-4">Pardot Export API Interaction</h2>
                <div className="space-y-4 mb-16">
                    <button
                        type="button"
                        onClick={handleSendRequest}
                        className="w-1/4 mx-8 bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        Send Request
                    </button>
                    <button
                        type="button"
                        onClick={handleGetStatus}
                        className="w-1/4 mx-8 bg-yellow-500 text-white p-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                        Get Status
                    </button>
                    <button
                        type="button"
                        onClick={handleGetAllStatus}
                        className="w-1/4 mx-8 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        Get All Status
                    </button>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Response</h3>
                    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md overflow-y-auto overflow-x-auto max-h-64">
                        <pre className="text-sm whitespace-pre-wrap">{response}</pre>
                    </div>
                </div>

            </div>
        </div>
    );
}
