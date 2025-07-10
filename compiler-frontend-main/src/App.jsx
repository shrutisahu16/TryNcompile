
/////////////////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import axios from 'axios';
import './App.css';
import { marked } from 'marked'; // For rendering markdown in review response (optional, but clean)

const initialCode = {
  c: `#include <stdio.h>

int main() {
    int num1, num2, sum;
    scanf("%d %d", &num1, &num2);
    sum = num1 + num2;
    printf("Sum: %d", sum);
    return 0;
}`,

  cpp: `#include <iostream>

int main() {
    int num1, num2, sum;
    std::cin >> num1 >> num2;
    sum = num1 + num2;
    std::cout << "Sum: " << sum;
    return 0;
}`,

  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int num1 = scanner.nextInt();
        int num2 = scanner.nextInt();
        int sum = num1 + num2;
        System.out.println("Sum: " + sum);
    }
}`
};

const languageIcons = {
  c: 'https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png',
  cpp: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg',
  java: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
  compiler: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'

};




function App() {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(initialCode[language]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [review, setReview] = useState('');

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const handleReview = async () => {
    setReview("Reviewing...");
    const payload = { code, language };

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/get-review`, payload);
      setReview(data || "No review generated.");
    } catch (error) {
      console.error("Review Error:", error);
      setReview("An error occurred while reviewing your code.");
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(initialCode[e.target.value]);
    setInput('');
    setOutput('');
    setReview('');
  };

  const handleCodeChange = (newCode) => {
    initialCode[language] = newCode;
    setCode(newCode);
  };

  const handleSubmit = async () => {
    setOutput("Running...");
    const payload = { language, code, input };

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/run`, payload);
      if (data.output.error) {
        if (data.output.error === "Runtime Error") {
          setOutput("Runtime Error");
          return;
        }
        const regex = /(?:.*)(error:[\s\S]*)/;
        const match = data.output.details.match(regex);
        setOutput(match || data.output.details);
      } else {
        setOutput(data.output.stdout);
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row items-stretch p-4 sm:p-6 gap-4 sm:gap-6 
      ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-blue-400 text-gray-900'}`}>

      {/* Left Side - Code Editor */}
      <div className={`w-full lg:w-1/2 flex flex-col p-4 sm:p-6 rounded-lg shadow-lg 
        ${darkMode ? 'bg-gray-700' : 'bg-cyan-300'}`}>

        <h1 className={`text-3xl sm:text-5xl font-black mb-4 sm:mb-6 flex flex-wrap items-center gap-4 
          ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <img src={languageIcons.compiler} alt="Compiler" className="w-10 h-10 sm:w-12 sm:h-12" />
          <span className={`bg-clip-text text-transparent animate-pulse 
            ${darkMode ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-500' : 'bg-gradient-to-r from-orange-500 via-pink-400 to-rose-400'}`}
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '1px' }}>
            TryNCompile
          </span>

          <label className="ml-auto flex items-center cursor-pointer">
            <span className={`mr-2 text-xl ${darkMode ? 'text-yellow-300' : 'text-orange-500'}`}>
              {darkMode ? '🌙' : '🌞'}
            </span>
            <input type="checkbox" className="hidden" onChange={() => setDarkMode(!darkMode)} />
            <div className={`w-10 h-5 rounded-full relative ${darkMode ? 'bg-purple-600' : 'bg-yellow-300'}`}>
              <div className={`absolute top-0.5 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 
                ${darkMode ? 'translate-x-5' : ''}`} />
            </div>
          </label>
        </h1>

        {/* Language Selector */}
        <div className="mb-4">
          <label htmlFor="language" className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Select Language:
          </label>
          <div className="flex items-center mt-1">
            <img src={languageIcons[language]} alt={language} className="w-6 h-6 mr-2" />
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className={`w-full pl-3 pr-10 py-2 rounded-md sm:text-sm border 
                ${darkMode ? 'bg-gray-600 text-gray-100 border-gray-500' : 'bg-white text-gray-900 border-gray-300'}`}>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* Code Editor */}
        <div className={`flex-1 overflow-auto rounded-md p-2 shadow-md mb-4 
          ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} style={{ maxHeight: '300px' }}>
          <Editor
            value={code}
            onValueChange={handleCodeChange}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              backgroundColor: darkMode ? '#1e1e1e' : '#f7fafc',
              color: darkMode ? 'white' : 'black',
              minHeight: '100%',
            }}
          />
        </div>

        <button onClick={handleSubmit}
          className="w-full mb-2 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 
          text-white font-medium rounded-lg text-sm px-5 py-2.5">
          Run
        </button>

        <button onClick={handleReview}
          className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 
          text-white font-medium rounded-lg text-sm px-5 py-2.5">
          Review Code
        </button>
      </div>

      {/* Right Side - Input/Output */}
      <div className={`w-full lg:w-1/2 flex flex-col p-4 sm:p-6 rounded-lg shadow-lg 
        ${darkMode ? 'bg-gray-700' : 'bg-cyan-300'}`}>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            rows="5"
            value={input}
            placeholder="Enter input here..."
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-28 border rounded-md py-2 px-4 focus:outline-none resize-none 
              ${darkMode ? 'bg-gray-600 text-gray-100 border-gray-500' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>

        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-2">Output:</h2>
          <div className={`rounded-lg p-4 max-h-48 overflow-y-auto whitespace-pre-wrap break-words shadow-inner 
            ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            {output}
          </div>
        </div>

        {review && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">AI Code Review:</h2>
            <div className={`rounded-lg p-4 max-h-60 overflow-y-auto whitespace-pre-wrap break-words shadow-inner 
              ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
              {review}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
