function createCell(type) {
    const td = document.createElement('td');
    const input = document.createElement('input');
  
    if (type === 'time') {
      input.type = 'time';
    } else if (type === 'product') {
      input.type = 'text';
    } else {
      input.type = 'number';
      input.step = '0.01';
    }
  
    td.appendChild(input);
    return td;
  }
  
  function addRow() {
    const tbody = document.getElementById('table-body');
    const rowCount = tbody.rows.length + 1;
    const tr = document.createElement('tr');
  
    // Satır numarası
    const tdIndex = document.createElement('td');
    tdIndex.textContent = rowCount;
    tr.appendChild(tdIndex);
  
    for (let i = 0; i < 4 * 4; i++) {
      if (i % 4 === 0 || i % 4 === 1) {
        tr.appendChild(createCell('time'));
      } else if (i % 4 === 2) {
        tr.appendChild(createCell('product'));
      } else {
        tr.appendChild(createCell('number'));
      }
    }
  
    tbody.appendChild(tr);
  }
  
  function openModal() {
    document.getElementById("myModal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("myModal").style.display = "none";
  }
  
  async function saveData() {
    const date = document.getElementById("save-date").value;
    if (!date) {
      alert("Lütfen bir tarih girin.");
      return;
    }
  
    const table = document.getElementById("group-table");
    const rows = table.getElementsByTagName("tr");
    const data = [];
  
    for (let i = 2; i < rows.length - 1; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const row = [];
      for (let j = 1; j < cells.length; j++) {
        const input = cells[j].getElementsByTagName("input")[0];
        row.push(input ? input.value : cells[j].innerText);
      }
      data.push(row);
    }
  
    // Fetch existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('tables') || '{}');
    
    // Add new data
    existingData[date] = data;
    
    // Save updated data back to localStorage
    localStorage.setItem('tables', JSON.stringify(existingData));
    alert(`Veriler ${date} tarihinde kaydedildi.`);
    closeModal();
  
    // Send data to sortiler.html
    try {
      const response = await fetch('sortiler.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, data })
      });
  
      if (response.ok) {
        console.log("Veriler sortiler.html dosyasına gönderildi.");
      } else {
        console.error("Veriler sortiler.html dosyasına gönderilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  }
  
  window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
      closeModal();
    }
  }
  
  // Sayfa yüklendiğinde 20 satır ekle
  window.onload = () => {
    for (let i = 0; i < 20; i++) addRow();
  };