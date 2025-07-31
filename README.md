# 🚀 TryNcompile – Online Code Compiler

*TryNcompile* is a web-based code compiler that allows users to write, execute, and review code in *C, **C++* and *Java*, all within their browser. It features real-time syntax highlighting, AI-powered code reviews, and a clean UI with light/dark theme support.


> 🎥 Demo 👉 👉 [▶️ Click here to watch the demo](https://drive.google.com/file/d/1Ia2vO7yGqxlBBUx-OFgAZgMBzexqpuPo/view?usp=sharing)

---

📌Screenshots:
<img width="1279" height="686" alt="image" src="https://github.com/user-attachments/assets/d9e96bee-3a6c-4a07-b9e8-2cc6eda2647b" />

<img width="1013" height="498" alt="image" src="https://github.com/user-attachments/assets/a5c3b410-3828-47a5-a1e8-3accd6331943" />




## 🌟 Features

- ✅ *Multi-language Support*: Compile and run C, C++, and Java programs.
- 🔒 *Secure Execution*: Code runs in isolated Docker containers.
- 📁 *File I/O Handling*: Supports user input/output files for realistic program execution.
- 🧹 *Auto Cleanup*: Temporary files are deleted after execution to optimize storage.
- 🤖 *AI Code Review*: Integrated AI feedback to help improve code quality and identify issues.
- 💡 *Syntax Highlighting: Powered by **PrismJS* for enhanced readability.
- 🌗 *Dark/Light Mode*: Seamless toggle for personalized user experience.

---

🚀 Run the Project

🔧 Without Docker
Start the Backend Server
cd ./Backend
nodemon ./index.js

Start the Frontend Server
cd ../frontend
npm run dev


🐳 With Docker (Backend only)
Start the Frontend (as usual)
cd ./frontend
npm run dev
Build and Run Backend with Docker

cd ../Backend
docker image build -t cpp-compiler .
docker container run -d --name con1 -p 3000:3000 cpp-compiler
