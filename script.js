// Elemen yang dipakai bersama di semua halaman
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const darkToggle = document.querySelector(".dark-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");
const currentTime = document.getElementById("currentTime");
const currentYear = document.getElementById("currentYear");

// Fitur 1: jam digital real-time dan tahun otomatis
function tampilkanJam() {
    const sekarang = new Date();

    if (currentTime) {
        currentTime.textContent = sekarang.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }

    if (currentYear) {
        currentYear.textContent = sekarang.getFullYear();
    }
}

tampilkanJam();
setInterval(tampilkanJam, 1000);

// Fitur 2: menu hamburger untuk layar kecil
function tutupMenu() {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Buka menu");
}

hamburger.addEventListener("click", function () {
    const menuTerbuka = navLinks.classList.toggle("open");

    hamburger.classList.toggle("active", menuTerbuka);
    hamburger.setAttribute("aria-expanded", String(menuTerbuka));
    hamburger.setAttribute("aria-label", menuTerbuka ? "Tutup menu" : "Buka menu");
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", tutupMenu);
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        tutupMenu();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        tutupMenu();
    }
});

// Fitur 3: mode gelap, pilihan disimpan agar tetap sama di semua halaman
function perbaruiTombolTema(isDark) {
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
    darkToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    darkToggle.setAttribute("aria-pressed", String(isDark));
}

try {
    if (localStorage.getItem("tema") === "dark") {
        document.body.classList.add("dark");
        perbaruiTombolTema(true);
    }
} catch (e) {
    // localStorage tidak tersedia, abaikan
}

darkToggle.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark");
    perbaruiTombolTema(isDark);

    try {
        localStorage.setItem("tema", isDark ? "dark" : "light");
    } catch (e) {
        // abaikan
    }
});

// Fitur 4: tombol kembali ke atas, muncul setelah digulir
const toTop = document.getElementById("toTop");

if (toTop) {
    window.addEventListener("scroll", function () {
        toTop.hidden = window.scrollY < 300;
    });

    toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Fitur 5: validasi formulir kontak (hanya ada di kontak.html)
const form = document.getElementById("contactForm");

if (form) {
    const pesan = document.getElementById("pesan");
    const hitung = document.getElementById("pesanCount");

    // Penghitung karakter saat mengetik
    pesan.addEventListener("input", function () {
        hitung.textContent = "(" + pesan.value.length + "/300)";
    });

    function setError(id, teks) {
        document.getElementById(id + "Error").textContent = teks;
        document.getElementById(id).classList.toggle("is-invalid", teks !== "");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const email = document.getElementById("email").value.trim();
        const isi = pesan.value.trim();

        const errNama = nama.length < 3 ? "Nama minimal 3 karakter." : "";
        const errEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Masukkan email yang valid.";
        const errPesan = isi.length < 10 ? "Pesan minimal 10 karakter." : "";

        setError("nama", errNama);
        setError("email", errEmail);
        setError("pesan", errPesan);

        const sukses = document.getElementById("formSuccess");

        if (!errNama && !errEmail && !errPesan) {
            sukses.textContent = "Terima kasih, " + nama + ". Pesan Anda sudah diterima.";
            sukses.hidden = false;
            form.reset();
            hitung.textContent = "(0/300)";
        } else {
            sukses.hidden = true;
        }
    });
}
