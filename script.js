const tasks = [];
let currentFilter = 'todas';

const taskForm = document.querySelector('#taskForm');
const titleInput = document.querySelector('#title');
const courseInput = document.querySelector('#course');
const priorityInput = document.querySelector('#priority');
const validationMsg = document.querySelector('#validationMsg');
const taskList = document.querySelector('#taskList');
const emptyMsg = document.querySelector('#emptyMsg');
const pendingCount = document.querySelector('#pendingCount');
const completedCount = document.querySelector('#completedCount');
const totalCount = document.querySelector('#totalCount');
const filterButtons = document.querySelectorAll('.btn-filter');

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function addTask(title, course, priority) {
    const task = {
        id: generateId(),
        title: title,
        course: course,
        priority: priority,
        completed: false
    };
    tasks.push(task);
    renderTasks();
    updateCounters();
}

function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks();
        updateCounters();
    }
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateCounters();
    }
}

function getFilteredTasks() {
    if (currentFilter === 'pendientes') {
        return tasks.filter(task => !task.completed);
    }
    if (currentFilter === 'completadas') {
        return tasks.filter(task => task.completed);
    }
    return tasks;
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('data-id', task.id);

    if (task.completed) {
        card.classList.add('completed');
    }

    const info = document.createElement('div');
    info.classList.add('task-info');

    const title = document.createElement('h3');
    title.classList.add('task-title');
    title.textContent = task.title;

    const meta = document.createElement('p');
    meta.classList.add('task-meta');
    meta.textContent = task.course || 'Sin curso';

    const priority = document.createElement('span');
    priority.classList.add('task-priority', `priority-${task.priority}`);
    priority.textContent = task.priority;

    meta.appendChild(priority);
    info.appendChild(title);
    info.appendChild(meta);

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn', 'btn-toggle');
    toggleBtn.setAttribute('data-action', 'toggle');

    if (task.completed) {
        toggleBtn.classList.add('pending');
        toggleBtn.textContent = 'Pendiente';
    } else {
        toggleBtn.textContent = 'Completar';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-delete');
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.textContent = 'Eliminar';

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);

    return card;
}

function renderTasks() {
    const filtered = getFilteredTasks();

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    if (filtered.length === 0) {
        emptyMsg.style.display = 'block';
        if (tasks.length > 0) {
            emptyMsg.textContent = 'No hay tareas en este filtro';
        } else {
            emptyMsg.textContent = 'No hay tareas registradas';
        }
    } else {
        emptyMsg.style.display = 'none';
        filtered.forEach(task => {
            const card = createTaskCard(task);
            taskList.appendChild(card);
        });
    }
}

function updateCounters() {
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    pendingCount.textContent = pending;
    completedCount.textContent = completed;
    totalCount.textContent = tasks.length;
}

function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const course = courseInput.value.trim();
    const priority = priorityInput.value;

    if (title === '') {
        validationMsg.textContent = 'El título es obligatorio';
        titleInput.focus();
        return;
    }

    validationMsg.textContent = '';
    addTask(title, course, priority);
    taskForm.reset();
    priorityInput.value = 'media';
});

taskList.addEventListener('click', function (event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.task-card');
    const id = card.getAttribute('data-id');
    const action = btn.getAttribute('data-action');

    if (action === 'toggle') {
        toggleTask(id);
    } else if (action === 'delete') {
        deleteTask(id);
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');
        setFilter(filter);
    });
});

renderTasks();
updateCounters();
