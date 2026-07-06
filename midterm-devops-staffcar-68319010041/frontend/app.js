// app.js
// CRUD UI แบบ HTML + Vanilla JS สำหรับระบบ staffcar
// ผู้จัดทำ: ศุภกรณ์ ศรีเขียว รหัสนักศึกษา 68319010041

// backend รันอยู่คนละพอร์ต (3000) จาก frontend (80/8080) ในสภาพแวดล้อม dev/prod เดียวกัน
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

const form = document.getElementById("car-form");
const formTitle = document.getElementById("form-title");
const idField = document.getElementById("car-id");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const tableBody = document.getElementById("car-table-body");
const statusMessage = document.getElementById("status-message");

function showMessage(text, type) {
  statusMessage.textContent = text;
  statusMessage.className = `status-message ${type}`;
  setTimeout(() => {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
  }, 3000);
}

function getFormData() {
  return {
    plate_no: document.getElementById("plate_no").value.trim(),
    type: document.getElementById("type").value,
    brand_model: document.getElementById("brand_model").value.trim(),
    color: document.getElementById("color").value.trim(),
    owner: document.getElementById("owner").value.trim(),
    department: document.getElementById("department").value.trim(),
    status: document.getElementById("status").value,
  };
}

function resetForm() {
  form.reset();
  idField.value = "";
  formTitle.textContent = "เพิ่มข้อมูลรถ";
  submitBtn.textContent = "บันทึก";
  cancelBtn.style.display = "none";
}

function renderRow(car) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${car.plate_no}</td>
    <td>${car.type}</td>
    <td>${car.brand_model || "-"}</td>
    <td>${car.color || "-"}</td>
    <td>${car.owner}</td>
    <td>${car.department || "-"}</td>
    <td>${car.status}</td>
    <td>
      <button class="edit-btn" data-id="${car.id}">แก้ไข</button>
      <button class="delete-btn" data-id="${car.id}">ลบ</button>
    </td>
  `;
  return tr;
}

async function loadCars() {
  try {
    const res = await fetch(`${API_BASE_URL}/cars`);
    if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
    const cars = await res.json();
    tableBody.innerHTML = "";
    cars.forEach((car) => tableBody.appendChild(renderRow(car)));
  } catch (err) {
    showMessage(`เกิดข้อผิดพลาด: ${err.message}`, "error");
  }
}

async function createCar(payload) {
  const res = await fetch(`${API_BASE_URL}/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "บันทึกไม่สำเร็จ");
  }
}

async function updateCar(id, payload) {
  const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "แก้ไขไม่สำเร็จ");
  }
}

async function deleteCar(id) {
  const res = await fetch(`${API_BASE_URL}/cars/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "ลบไม่สำเร็จ");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = getFormData();
  const id = idField.value;

  try {
    if (id) {
      await updateCar(id, payload);
      showMessage("แก้ไขข้อมูลสำเร็จ", "success");
    } else {
      await createCar(payload);
      showMessage("เพิ่มข้อมูลสำเร็จ", "success");
    }
    resetForm();
    loadCars();
  } catch (err) {
    showMessage(err.message, "error");
  }
});

tableBody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("ยืนยันการลบข้อมูลรถคันนี้?")) return;
    try {
      await deleteCar(id);
      showMessage("ลบข้อมูลสำเร็จ", "success");
      loadCars();
    } catch (err) {
      showMessage(err.message, "error");
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    try {
      const res = await fetch(`${API_BASE_URL}/cars/${id}`);
      const car = await res.json();
      idField.value = car.id;
      document.getElementById("plate_no").value = car.plate_no;
      document.getElementById("type").value = car.type;
      document.getElementById("brand_model").value = car.brand_model || "";
      document.getElementById("color").value = car.color || "";
      document.getElementById("owner").value = car.owner;
      document.getElementById("department").value = car.department || "";
      document.getElementById("status").value = car.status;

      formTitle.textContent = "แก้ไขข้อมูลรถ";
      submitBtn.textContent = "บันทึกการแก้ไข";
      cancelBtn.style.display = "inline-block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showMessage("ไม่สามารถโหลดข้อมูลเพื่อแก้ไขได้", "error");
    }
  }
});

cancelBtn.addEventListener("click", resetForm);

// โหลดข้อมูลครั้งแรกเมื่อเปิดหน้าเว็บ
loadCars();
