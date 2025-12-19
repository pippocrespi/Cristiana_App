
    const status = document.getElementById("status");
    const ultimoOrario = document.getElementById("ultimoOrario");

    // --- 1. Setta automaticamente la data odierna all'avvio ---
    window.addEventListener("DOMContentLoaded", () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();
      if (mm < 10) mm = "0" + mm;
      if (dd < 10) dd = "0" + dd;
      document.getElementById("dataIngresso").value = `${yyyy}-${mm}-${dd}`;
    });

    // --- 2. Mostra l'ultimo inserimento salvato in memoria locale ---
    window.addEventListener("DOMContentLoaded", () => {
      const ultimo = localStorage.getItem("ultimoOrario");
      if (ultimo) {
        ultimoOrario.textContent = "Ultimo inserimento: " + ultimo;
      } else {
        ultimoOrario.textContent = "Nessun inserimento recente.";
      }
    });

    // --- 3. Invio Dati ---
    document.getElementById("btnInvia").addEventListener("click", () => {
      const dataIngresso = document.getElementById("dataIngresso").value;
      const oraEntrata = document.getElementById("oraEntrata").value;
      const oraUscita = document.getElementById("oraUscita").value;
      const motivazione = document.getElementById("motivazione").value;

      // Controlli di validità
      if (!dataIngresso || !oraEntrata || !oraUscita || !motivazione) {
        status.textContent = "❌ Compila tutti i campi (Data, Orari e Motivazione).";
        return;
      }

      status.textContent = "⏳ Invio in corso...";

      const formData = new FormData();
      formData.append("dataIngresso", dataIngresso);
      formData.append("oraEntrata", oraEntrata);
      formData.append("oraUscita", oraUscita);
      formData.append("motivazione", motivazione);
      
      // Nota: Non inviamo più pranzo/cena

      fetch("https://script.google.com/macros/s/AKfycbz3Z16dOgiA0RldJuniD30LxnLoMk5wDKyvvZewXW4xWD_ZwRUxvx7KW95qGQWcl1Hj/exec", {
        method: "POST",
        body: formData
      })
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            status.textContent = "✅ Salvato!";
            
            // Reset del form
            document.getElementById("workForm").reset();
            
            // Rimetto la data di oggi dopo il reset
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1;
            let dd = today.getDate();
            if (mm < 10) mm = "0" + mm;
            if (dd < 10) dd = "0" + dd;
            document.getElementById("dataIngresso").value = `${yyyy}-${mm}-${dd}`;

            // Aggiorno memoria locale
            const info = `${dataIngresso} (${motivazione})`;
            localStorage.setItem("ultimoOrario", info);
            ultimoOrario.textContent = "Ultimo inserimento: " + info;

          } else {
            status.textContent = "❌ Errore Google: " + res.error;
          }
        })
        .catch(err => {
          status.textContent = "❌ Errore connessione: " + err.message;
        });
    });

    // --- 4. Stampa PDF ---
    document.getElementById("btnPDF").addEventListener("click", () => {
      const mese = document.getElementById("mese").value;
      const anno = document.getElementById("anno").value;
      const scriptUrl = "https://script.google.com/macros/s/AKfycbz3Z16dOgiA0RldJuniD30LxnLoMk5wDKyvvZewXW4xWD_ZwRUxvx7KW95qGQWcl1Hj/exec";
      window.open(`${scriptUrl}?mese=${encodeURIComponent(mese)}&anno=${encodeURIComponent(anno)}`, "_blank");
    });
