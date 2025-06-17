// Task Management Application
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.bindEvents();
        this.render();
    }

    // Event Bindings
    bindEvents() {
        // Task form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed button
        document.getElementById('clearCompletedBtn').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Modal events
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.saveEdit();
        });

        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Close modal on backdrop click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        // Input validation
        document.getElementById('taskInput').addEventListener('input', (e) => {
            this.updateAddButton();
        });

        // Edit input enter key
        document.getElementById('editInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit();
            }
        });

        // Edit input escape key
        document.getElementById('editInput').addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });
    }

    // Task Operations
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

    editTask(id, newText) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return;

        this.tasks[taskIndex].text = newText.trim();
        this.tasks[taskIndex].updatedAt = new Date().toISOString();
        
        this.saveTasks();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) return;

        this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        this.tasks[taskIndex].updatedAt = new Date().toISOString();
        
        this.saveTasks();
        this.render();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
    }

    // Filter Operations
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // Modal Operations
    openEditModal(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return;

        this.editingTaskId = id;
        document.getElementById('editInput').value = task.text;
        document.getElementById('editModal').classList.add('show');
        document.getElementById('editInput').focus();
        document.getElementById('editInput').select();
    }

    closeEditModal() {
        this.editingTaskId = null;
        document.getElementById('editModal').classList.remove('show');
        document.getElementById('editInput').value = '';
    }

    saveEdit() {
        const newText = document.getElementById('editInput').value.trim();
        if (!newText || !this.editingTaskId) return;

        this.editTask(this.editingTaskId, newText);
        this.closeEditModal();
    }

    // UI Updates
    updateAddButton() {
        const input = document.getElementById('taskInput');
        const button = document.getElementById('addBtn');
        
        button.disabled = !input.value.trim();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('progressRate').textContent = `${progress}%`;
    }

    updateClearButton() {
        const hasCompleted = this.tasks.some(task => task.completed);
        const clearBtn = document.getElementById('clearCompletedBtn');
        
        clearBtn.style.display = hasCompleted ? 'block' : 'none';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    getEmptyStateMessage() {
        if (this.currentFilter === 'pending' && this.tasks.some(task => task.completed)) {
            return "All tasks completed! 🎉";
        }
        if (this.currentFilter === 'completed') {
            return "No completed tasks yet";
        }
        return "No tasks yet. Add one above! ✨";
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const lastModified = task.updatedAt || task.createdAt;
        const timeAgo = this.formatDate(lastModified);
        const actionText = task.updatedAt ? 'Updated' : 'Created';

        taskElement.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="taskManager.toggleTask('${task.id}')"></div>
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">${actionText} ${timeAgo}</div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-btn" onclick="taskManager.openEditModal('${task.id}')" title="Edit task">
                    ✏️
                </button>
                <button class="task-btn delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Delete task">
                    🗑️
                </button>
            </div>
        `;

        return taskElement;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');

        // Clear current tasks
        tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
            emptyState.querySelector('.empty-text').textContent = this.getEmptyStateMessage();
        } else {
            emptyState.classList.remove('show');
            
            filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                tasksList.appendChild(taskElement);
            });
        }

        this.updateStats();
        this.updateClearButton();
    }

    // Storage Operations
    saveTasks() {
        try {
            localStorage.setItem('floral-todo-tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('floral-todo-tasks');
            if (saved) {
                this.tasks = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
        }
    }
}

// Initialize the application
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

// Make taskManager globally accessible for onclick events
window.taskManager = taskManager;