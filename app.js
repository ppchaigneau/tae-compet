/* ===== CATEGORY TABS ===== */
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.cat-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

/* ===== KYORUGI WEIGHT CLASS VISIBILITY ===== */
const eventCheckboxes = document.querySelectorAll('input[name="events"]');
const weightClassRow = document.getElementById('weightClassRow');
const weightClassSelect = document.getElementById('weightClass');

function updateWeightClassVisibility() {
  const kyorugiChecked = document.querySelector('input[name="events"][value="kyorugi"]').checked;
  weightClassRow.style.display = kyorugiChecked ? 'flex' : 'none';
  if (!kyorugiChecked) weightClassSelect.value = '';
  updateFeeSummary();
}

eventCheckboxes.forEach(cb => cb.addEventListener('change', updateWeightClassVisibility));

/* ===== FEE SUMMARY ===== */
function updateFeeSummary() {
  const kyorugi = document.querySelector('input[name="events"][value="kyorugi"]').checked;
  const poomsae = document.querySelector('input[name="events"][value="poomsae"]').checked;
  const summary = document.getElementById('feeSummary');
  const breakdown = document.getElementById('feeBreakdown');
  const totalEl = document.getElementById('feeTotal');

  if (!kyorugi && !poomsae) { summary.style.display = 'none'; return; }

  let lines = [];
  let total = 0;

  if (kyorugi && poomsae) {
    lines.push({ label: 'Kyorugi + Poomsae (bundle)', amount: 65 });
    total = 65;
  } else if (kyorugi) {
    lines.push({ label: 'Kyorugi (Sparring)', amount: 40 });
    total = 40;
  } else {
    lines.push({ label: 'Poomsae (Forms)', amount: 40 });
    total = 40;
  }

  breakdown.innerHTML = lines.map(l =>
    `<div class="fee-line"><span>${l.label}</span><span>€${l.amount}</span></div>`
  ).join('');
  totalEl.innerHTML = `<span>Total Due</span><span>€${total}</span>`;
  summary.style.display = 'block';
}

/* ===== VALIDATION ===== */
function validateField(input) {
  const errEl = input.parentElement.querySelector('.error-msg');
  if (!errEl) return true;
  if (input.required && !input.value.trim()) {
    input.classList.add('invalid');
    errEl.textContent = 'This field is required.';
    return false;
  }
  if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    input.classList.add('invalid');
    errEl.textContent = 'Enter a valid email address.';
    return false;
  }
  if (input.type === 'number' && input.value) {
    const v = parseFloat(input.value);
    if (v < +input.min || v > +input.max) {
      input.classList.add('invalid');
      errEl.textContent = `Enter a value between ${input.min} and ${input.max}.`;
      return false;
    }
  }
  input.classList.remove('invalid');
  errEl.textContent = '';
  return true;
}

document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('blur', () => validateField(el));
  el.addEventListener('input', () => validateField(el));
});

/* ===== FORM SUBMIT ===== */
document.getElementById('regForm').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  // Validate all standard fields
  document.querySelectorAll('#regForm input:not([type="checkbox"]):not([name="events"]), #regForm select, #regForm textarea').forEach(el => {
    if (!validateField(el)) valid = false;
  });

  // Validate weight class if kyorugi selected
  const kyorugiChecked = document.querySelector('input[name="events"][value="kyorugi"]').checked;
  if (kyorugiChecked && !weightClassSelect.value) {
    weightClassSelect.classList.add('invalid');
    weightClassSelect.parentElement.querySelector('.error-msg').textContent = 'Please select a weight class.';
    valid = false;
  }

  // Validate at least one event
  const anyEvent = [...eventCheckboxes].some(cb => cb.checked);
  const eventsError = document.getElementById('eventsError');
  if (!anyEvent) {
    eventsError.textContent = 'Please select at least one event.';
    valid = false;
  } else {
    eventsError.textContent = '';
  }

  // Validate consent
  const consent = document.getElementById('consent');
  const consentError = document.getElementById('consentError');
  if (!consent.checked) {
    consentError.textContent = 'You must accept the consent to proceed.';
    valid = false;
  } else {
    consentError.textContent = '';
  }

  if (!valid) {
    document.querySelector('.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Success
  const ref = 'DC2026-' + Math.random().toString(36).substring(2,7).toUpperCase();
  document.getElementById('refNumber').textContent = ref;
  document.getElementById('regForm').style.display = 'none';
  document.getElementById('feeSummary').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
  document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
});

/* ===== RESET ===== */
function resetForm() {
  document.getElementById('regForm').reset();
  document.getElementById('regForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('feeSummary').style.display = 'none';
  weightClassRow.style.display = 'none';
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}
