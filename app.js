  const categoryTips = {
      'Context': 'Examples: This is for a React app. User is on mobile. Output will be read aloud.',
      'Task': 'Examples: Generate a user card component. Sort a list of tasks. Summarize a paragraph.',
      'Example': 'Examples: Input: [1,2] → Output: 3. Show <li>Alice</li> for [{name: "Alice"}].',
      'Constraints': 'Examples: No external libraries. Use only ES6+. Keep response under 100 words.',
      'Format': 'Examples: Output in JSON. Wrap in Markdown code block. Use bullet points. Structure as numbered steps.'
    };

    const categories = Object.keys(categoryTips);
    const form = document.getElementById('form');

    const icons = {
      'Context': '🌐',
      'Task': '🛠️',
      'Example': '📎',
      'Constraints': '⛔',
      'Format': '📄'
    };

    categories.forEach(category => {
      const section = document.createElement('div');
      section.className = 'bg-gray-800 p-4 rounded-lg shadow';

      const header = document.createElement('div');
      header.className = 'flex justify-between items-center mb-3';

      const title = document.createElement('div');
      title.className = 'text-lg font-medium text-white';
      title.innerHTML = `${icons[category]} ${category}`;

      const tipBtn = document.createElement('button');
      tipBtn.textContent = '💡';
      tipBtn.className = 'text-yellow-400 hover:text-yellow-300 text-xl';
      tipBtn.title = categoryTips[category];

      header.appendChild(title);
      header.appendChild(tipBtn);
      section.appendChild(header);

      const inputGroup = document.createElement('div');
      inputGroup.className = 'space-y-3';
      inputGroup.id = category;
      section.appendChild(inputGroup);

      const addBtn = document.createElement('button');
      addBtn.className = 'mt-3 bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-blue-500';
      addBtn.textContent = `Add ${category}`;
      addBtn.onclick = () => addInput(category);
      section.appendChild(addBtn);

      form.appendChild(section);
    });

    function addInput(category) {
      const container = document.getElementById(category);
      const wrapper = document.createElement('div');
      wrapper.className = 'flex gap-2';
      const textarea = document.createElement('textarea');
      textarea.className = 'flex-1 border border-gray-600 bg-gray-900 text-white rounded-md p-2 text-sm resize-y';
      textarea.rows = 2;
      textarea.addEventListener('input', checkFormCompleteness);

      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m12 0H5" /></svg>';
      removeBtn.className = 'flex items-center justify-center p-1 text-red-400 hover:text-red-600';
      removeBtn.onclick = () => {
        wrapper.remove();
        checkFormCompleteness();
      };

      wrapper.appendChild(textarea);
      wrapper.appendChild(removeBtn);
      container.appendChild(wrapper);
      checkFormCompleteness();
    }

    function generatePrompt() {
      if (!isFormComplete()) return;
      let prompt = '';
      categories.forEach(cat => {
        const inputs = document.querySelectorAll(`#${cat} textarea`);
        if (inputs.length > 0) {
          prompt += `${cat}:
`;
          inputs.forEach(input => {
            const value = input.value.trim();
            if (value) prompt += `- ${value}
`;
          });
          prompt += '\n';
        }
      });
      document.getElementById('output').textContent = prompt.trim();
      document.getElementById('modal').classList.remove('hidden');
    }

    function isFormComplete() {
      const allInputs = document.querySelectorAll('textarea');
      return Array.from(allInputs).some(input => input.value.trim() !== '');
    }

    function checkFormCompleteness() {
      const btn = document.getElementById('generateBtn');
      if (isFormComplete()) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      }
    }

    function closeModal() {
      document.getElementById('modal').classList.add('hidden');
    }

    function copyPrompt() {
      const text = document.getElementById('output').textContent;
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    }

    function clearAllInputs() {
      categories.forEach(cat => {
        document.getElementById(cat).innerHTML = '';
      });
      document.getElementById('output').textContent = '';
      closeModal();
      checkFormCompleteness();
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(reg => console.log('Service worker registered.', reg))
          .catch(err => console.error('Service worker error:', err));
      });
    }

    checkFormCompleteness();
