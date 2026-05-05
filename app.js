let tickets = [
  { id: 'TKT-001', title: 'Network down in Block B', dept: 'Administration', category: 'Network connectivity', priority: 'High', status: 'In Progress', date: '2025-03-20' },
  { id: 'TKT-002', title: 'Printer not responding', dept: 'Finance', category: 'Hardware failure', priority: 'Medium', status: 'Open', date: '2025-03-21' },
  { id: 'TKT-003', title: 'Cannot access email', dept: 'HR', category: 'Email issue', priority: 'High', status: 'Open', date: '2025-03-22' },
  { id: 'TKT-004', title: 'Windows update error', dept: 'Planning', category: 'Software error', priority: 'Low', status: 'Resolved', date: '2025-03-18' },
  { id: 'TKT-005', title: 'Password reset request', dept: 'Water & Sanitation', category: 'Account / access', priority: 'Medium', status: 'Resolved', date: '2025-03-19' },
];

let nextId = 6;

function renderStats() {
  const open     = tickets.filter(t => t.status === 'Open').length;
  const inprog   = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const high     = tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length;

  document.getElementById('stats').innerHTML = `
    <div class="stat"><div class="stat-label">Open</div><div class="stat-value" style="color:#1d4ed8">${open}</div></div>
    <div class="stat"><div class="stat-label">In progress</div><div class="stat-value" style="color:#b45309">${inprog}</div></div>
    <div class="stat"><div class="stat-label">Resolved</div><div class="stat-value" style="color:#166534">${resolved}</div></div>
    <div class="stat"><div class="stat-label">High priority</div><div class="stat-value" style="color:#b91c1c">${high}</div></div>
  `;
}

function renderTickets() {
  const search   = document.getElementById('search').value.toLowerCase();
  const status   = document.getElementById('filter-status').value;
  const priority = document.getElementById('filter-priority').value;

  let filtered = tickets.filter(t => {
    return (
      (!search   || t.title.toLowerCase().includes(search) ||
                    t.dept.toLowerCase().includes(search)  ||
                    t.category.toLowerCase().includes(search)) &&
      (!status   || t.status === status) &&
      (!priority || t.priority === priority)
    );
  });

  const list = document.getElementById('ticket-list');

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">No tickets found.</div>';
    return;
  }

  list.innerHTML = filtered.map(t => `
    <div class="ticket">
      <span class="ticket-id">${t.id}</span>
      <div class="ticket-info">
        <div class="ticket-title">${t.title}</div>
        <div class="ticket-meta">${t.dept} &middot; ${t.category} &middot; ${t.date}</div>
      </div>
      <span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span>
      <span class="badge badge-${t.status === 'In Progress' ? 'progress' : t.status.toLowerCase()}">${t.status}</span>
      ${t.status !== 'Resolved'
        ? `<button class="tab" style="font-size:11px;padding:4px 10px;" onclick="resolve('${t.id}')">Resolve</button>`
        : ''}
    </div>
  `).join('');
}

function resolve(id) {
  const ticket = tickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = 'Resolved';
    renderTickets();
    renderStats();
  }
}

function switchTab(tab) {
  document.getElementById('tab-tickets').style.display = tab === 'tickets' ? '' : 'none';
  document.getElementById('tab-new').style.display     = tab === 'new'     ? '' : 'none';

  document.querySelectorAll('.tab').forEach((el, i) => {
    el.classList.toggle('active',
      (i === 0 && tab === 'tickets') || (i === 1 && tab === 'new')
    );
  });
}

function submitTicket() {
  const name = document.getElementById('f-name').value.trim();
  const dept = document.getElementById('f-dept').value.trim();
  const desc = document.getElementById('f-desc').value.trim();

  if (!name || !dept || !desc) {
    alert('Please fill in all fields.');
    return;
  }

  const id    = 'TKT-00' + nextId++;
  const today = new Date().toISOString().slice(0, 10);

  tickets.unshift({
    id,
    title:    desc.slice(0, 50) + (desc.length > 50 ? '...' : ''),
    dept,
    category: document.getElementById('f-cat').value,
    priority: document.getElementById('f-priority').value,
    status:   'Open',
    date:     today,
  });

  document.getElementById('f-name').value = '';
  document.getElementById('f-dept').value = '';
  document.getElementById('f-desc').value = '';

  const msg = document.getElementById('success-msg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 3000);

  renderStats();
  renderTickets();
  switchTab('tickets');
}

renderStats();
renderTickets();