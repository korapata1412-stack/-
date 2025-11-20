// main.js

// Configuration
const DATA_SOURCE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOoH_DhUu9DVLpa4CAIItZ579-gYvzcUoU4uCZ7vLomLrJ7CnJ9_yut_ToCXa67F7EAXlpSpGd2UzH/pub?output=csv'; // In the future, this can be replaced with a Google Sheet CSV URL

// State
let certificates = [];

// DOM Elements
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');

// Initialize
async function init() {
  try {
    const response = await fetch(DATA_SOURCE);
    if (!response.ok) throw new Error('Failed to load data');

    // Check if the data is JSON or CSV based on file extension or content type
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (DATA_SOURCE.endsWith('.json') || (contentType && contentType.includes('json'))) {
      certificates = JSON.parse(text);
    } else {
      // Assume CSV for Google Sheets
      certificates = parseCSV(text);
    }

    console.log('Data loaded:', certificates.length, 'records');
  } catch (error) {
    console.error('Error loading data:', error);
    alert('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
  }
}

// CSV Parser Helper
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => value.trim().replace(/^"|"$/g, ''));
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || '';
    });
    return entry;
  });
}

// Search Handler
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const studentClass = document.getElementById('studentClass').value.trim();

  if (!firstName || !lastName || !studentClass) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const results = filterCertificates(firstName, lastName, studentClass);
  renderResults(results);
});

// Filter Logic
function filterCertificates(firstName, lastName, studentClass) {
  return certificates.filter(cert => {
    return (
      cert.name.includes(firstName) &&
      cert.surname.includes(lastName) &&
      cert.class.includes(studentClass)
    );
  });
}

// Render Logic
function renderResults(results) {
  resultsSection.classList.remove('hidden');
  resultsGrid.innerHTML = '';

  if (results.length === 0) {
    resultsGrid.innerHTML = `
      <div class="no-results">
        <p>ไม่พบข้อมูลเกียรติบัตรสำหรับ "${document.getElementById('firstName').value} ${document.getElementById('lastName').value}"</p>
        <p>กรุณาตรวจสอบความถูกต้องของข้อมูล</p>
      </div>
    `;
    return;
  }

  results.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="student-name">${cert.name} ${cert.surname}</div>
      <div class="student-class">ระดับชั้น: ${cert.class}</div>
      <a href="${cert.certificate_url}" target="_blank" class="download-btn">
        ดูเกียรติบัตร
      </a>
    `;
    resultsGrid.appendChild(card);
  });

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Run init
init();
