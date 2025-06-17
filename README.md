# 🌸 TaskBloom – Aesthetic To-Do List Web App

🔗 [Live Demo](https://hadassah-victoria.github.io/TaskBloom---To-do-list-web/)

---

**TaskBloom** is a clean and responsive to-do list application designed to help you manage your daily tasks with ease and elegance.  
It features a floral pastel theme, intuitive UI, and saves your tasks using `localStorage`.

---

## ✨ Features

- ➕ Add tasks  
- ✅ Mark tasks as complete/incomplete  
- ✏️ Edit and 🗑️ delete tasks  
- 💾 Data is saved with localStorage (stays after refresh)  
- 📱 Fully responsive on mobile & desktop  
- 🎀 Soft pastel colors with a calming UI

---


## 🔧 How It Works

1. Type your task in the input field  
2. Click **Add** to insert it into the list  
3. Use the checkbox to mark as done  
4. Use ✏️ to edit or 🗑️ to delete  
5. All tasks are stored automatically in your browser

---

## 💻 Tech Stack

- HTML  
- CSS  
- JavaScript  
- localStorage

---

## 📂 Code Snippet (script.js)

```js
 addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (!text) return;

        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        
        input.value = '';
        this.updateAddButton();
    }



🙋‍♀️ Author:
Developed by Hadassah Victoria
📧 Email: hadassahvictoria1@gmail.com

📄 License:
This project was created as part of the RISE Internship Program by Tamizhan Skills.
All design and development work was done independently.
Free to use for educational purposes.
