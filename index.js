function createCell(type, value = '') {
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

    input.value = value;
    td.appendChild(input);
    return td;
}

function addRow(data = []) {
    const tbody = document.getElementById('table-body');
    const rowCount = tbody.rows.length + 1;
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.textContent = rowCount;
    tr.appendChild(tdIndex);

    for (let i = 0; i < 4 * 4; i++) {
        let value = data[i] || '';
        if (i % 4 === 0 || i % 4 === 1) {
            tr.appendChild(createCell('time', value));
        } else if (i % 4 === 2) {
            tr.appendChild(createCell('product', value));
        } else {
            tr.appendChild(createCell('number', value));
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

function saveData() {
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

    // 1. Bu veriyi "tableData-<date>" şeklinde sakla (opsiyonel)
    localStorage.setItem(`tableData-${date}`, JSON.stringify(data));

    // 2. Tüm verileri tutan "tables" objesini güncelle
    let tables = JSON.parse(localStorage.getItem('tables')) || {};
    tables[date] = data;
    localStorage.setItem('tables', JSON.stringify(tables));

    // 3. Tarih listesi güncelle (opsiyonel, kullanacaksan)
    let savedDates = JSON.parse(localStorage.getItem('savedDates')) || [];
    if (!savedDates.includes(date)) {
        savedDates.push(date);
        localStorage.setItem('savedDates', JSON.stringify(savedDates));
    }

    alert(`Veriler ${date} tarihinde kaydedildi.`);
    closeModal();
    document.getElementById("table-body").innerHTML = "";
}


// Verileri yükle (sayfa açıldığında)
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('tableData-temp')) || [];

    if (savedData.length > 0) {
        savedData.forEach(rowData => addRow(rowData));
    } else {
        for (let i = 0; i < 20; i++) addRow();
    }
}

window.onclick = function (event) {
    if (event.target === document.getElementById("myModal")) {
        closeModal();
    }
}

window.onload = loadSavedData;
