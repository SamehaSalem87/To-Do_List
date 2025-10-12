// Elemente
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filters button');
const addSound = document.getElementById('add-sound');
const doneSound = document.getElementById('done-sound');
const toast = document.getElementById('toast');

// Speicher laden
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Thema wählen
const hour = new Date().getHours();
document.body.classList.add(hour >= 6 && hour < 18 ? 'day' : 'night');

// Toast-Nachricht anzeigen
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Aufgabe hinzufügen
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return alert('Bitte eine Aufgabe eingeben!');
  const time = new Date().toLocaleString('de-DE');
  tasks.push({ text, completed: false, time });
  input.value = '';
  save();
  render();
  addSound.play();
  showToast('Neue Aufgabe hinzugefügt!');
});

// Aufgaben darstellen
function render() {
  taskList.innerHTML = '';
  tasks
    .filter(t => currentFilter === 'all' || (currentFilter === 'active' ? !t.completed : t.completed))
    .forEach((task, i) => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');
      li.innerHTML = `
        <div>
          ${task.text}
          <br><small>${task.time}</small>
        </div>
        <button class="delete">🗑️</button>
      `;

      li.addEventListener('click', e => {
        if (e.target.classList.contains('delete')) return;
        task.completed = !task.completed;
        save();
        render();
        doneSound.play();
        showToast(task.completed ? 'Aufgabe erledigt 🎉' : 'Wieder geöffnet!');
      });

      li.querySelector('.delete').addEventListener('click', () => {
        tasks.splice(i, 1);
        save();
        render();
        showToast('Aufgabe gelöscht ❌');
      });

      taskList.appendChild(li);
    });
}

// Filtersteuerung
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Speicher
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

render();
