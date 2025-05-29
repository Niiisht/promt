const categories = {
  Context: { icon: "🧠", tip: "Where and how this prompt will be used." },
  Task: { icon: "🛠️", tip: "What you want the AI to do." },
  Example: { icon: "📎", tip: "Give one or more examples of desired output." },
  Constraints: { icon: "🚫", tip: "Set any rules the AI must follow." },
  Format: { icon: "🧾", tip: "Specify the format or structure of the output." }
};

function initCategoryButtons() {
  const container = document.getElementById('section-buttons');
  Object.keys(categories).forEach(key => {
    const btn = document.createElement('button');
    btn.id = `btn-${key}`;
    btn.className = "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2";
    btn.innerHTML = `<span>${categories[key].icon}</span> <span>${key}</span>`;
    btn.onclick = () => addSection(key);
    container.appendChild(btn);
  });
}

function addSection(category) {
  if (document.getElementById(category)) return;

  const form = document.getElementById('form');

  const wrapper = document.createElement('div');
  wrapper.className = 'dark:bg-gray-800 bg-gray-100 p-4 rounded-lg shadow transition-all';
  wrapper.id = category;

  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-3';

  const title = document.createElement('div');
  title.className = 'text-lg font-medium flex items-center gap-2';
  title.innerHTML = `<span>${categories[category].icon}</span><span>${category}</span>`;

  const tip = document.createElement('span');
  tip.className = 'text-yellow-400 text-xl';
  tip.title = categories[category].tip;
  tip.textContent = '💡';

  header.appendChild(title);
  header.appendChild(tip);

  const content = document.createElement('div');
  content.className = 'space-y-3';
  content.innerHTML = `
    <div class="flex items-start gap-2">
      <textarea class="w-full dark:bg-gray-900 dark:text-white bg-white text-black p-2 rounded border border-gray-300 dark:border-gray-600" rows="2"></textarea>
      <button onclick="removeSection('${category}')" title="Remove Section">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-2 text-red-500 hover:text-red-700" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v10a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm3 5a.5.5 0 011 0v6a.5.5 0 01-1 0V7zm3 0a.5.5 0 011 0v6a.5.5 0 01-1 0V7z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  `;

  wrapper.appendChild(header);
  wrapper.appendChild(content);
  form.appendChild(wrapper);

  document.getElementById(`btn-${category}`).classList.add('hidden');
}

function removeSection(category) {
  document.getElementById(category).remove();
  document.getElementById(`btn-${category}`).classList.remove('hidden');
}

function generatePrompt() {
  let prompt = '';
  let valid = true;

  Object.keys(categories).forEach(cat => {
    const section = document.getElementById(cat);
    if (section) {
      const textarea = section.querySelector('textarea');
      if (!textarea.value.trim()) valid = false;
      prompt += `${cat}:
- ${textarea.value.trim()}

`;
    }
  });

  if (!valid) {
    alert('Please fill in all fields before generating.');
    return;
  }

  document.getElementById('output').textContent = prompt.trim();
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function copyPrompt() {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text);
}

function clearAllInputs() {
  document.getElementById('form').innerHTML = '';
  Object.keys(categories).forEach(cat => {
    document.getElementById(`btn-${cat}`).classList.remove('hidden');
  });
  closeModal();
}

window.onload = () => {
  initCategoryButtons();
};
