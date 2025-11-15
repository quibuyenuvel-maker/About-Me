// small helpers for interactivity
document.addEventListener('DOMContentLoaded', () => {
  // set year(s)
  const years = new Date().getFullYear();
  ['year','year-2','year-3','year-4','year-5'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = years;
  });

  // animate skill bars
  document.querySelectorAll('.progress').forEach(p => {
    const value = p.getAttribute('data-progress');
    const bar = p.querySelector('.progress-bar');
    if(bar) {
      // small timeout so CSS transitions work on page load
      setTimeout(()=> bar.style.width = value + '%', 120);
    }
  });

  // dashboard simulation
  const projects = [
    {title:'Marketing site redesign', status:'Complete'},
    {title:'E-commerce checkout revamp', status:'In progress'},
    {title:'Internal dashboard', status:'Planned'},
  ];

  const projectsListEl = document.getElementById('projects-list');
  if(projectsListEl){
    projects.forEach(p=>{
      const li = document.createElement('li');
      li.textContent = `${p.title} — ${p.status}`;
      projectsListEl.appendChild(li);
    });
  }

  const simulateBtn = document.getElementById('simulate');
  if(simulateBtn){
    simulateBtn.addEventListener('click', () => {
      document.getElementById('projects-count').textContent = Math.floor(Math.random()*60) + 10;
      document.getElementById('clients-count').textContent = Math.floor(Math.random()*40) + 5;
      document.getElementById('hours-count').textContent = Math.floor(Math.random()*1200) + 200;
    });
  }
});

