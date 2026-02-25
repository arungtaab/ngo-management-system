# NGO Management System

A bilingual (English/Chinese) web application for non-profit organizations to manage volunteers, members, donations, tasks, and programs. Built on Google Apps Script, it uses Google Sheets-like storage (PropertiesService) and provides a clean, responsive dashboard.

> **🏆 Recognition**  
> This project was created for the **Hong Kong Productivity Council (HKPC) – NGO Innovation and Digital Technology Recognition Scheme** and is proud to be a **Finalist**.  
> *Note: This is a work in progress – features and design are actively being refined.*

[Current AppsScript deployment.](https://script.google.com/macros/s/AKfycbx8eC3MdGAdYQKaq88oq8xMtobfgFCMj41RtU56n-Bq31rRaRVY_Ea23DaUiR5thLZrYA/exec)
---

## Features

- **Dashboard** – Overview statistics for volunteers, members, donations, tasks, and programs.
- **Volunteer Management** – Add, edit, delete, and search volunteers. Track skills, status, join date, and notes.
- **Member Management** – Manage member interests, contact details, and notes.
- **Donation Tracking** – Record donations with amount, currency, purpose, and donor information.
- **To‑Do List** – Task management with assignee, due date, priority, and status.
- **Program Management** – Track project timelines, budgets, progress bars, and managers.
- **Bilingual UI** – All labels and messages are shown in both English and Traditional Chinese.
- **Import/Export** – Import data from any Google Sheets document; export all data to a new Google Sheet.
- **Notes System** – Special handling for notes (e.g., quick view, editing) for volunteers and members.
- **Responsive Design** – Works on desktop and mobile devices (Bootstrap 5).

---

## Technologies Used

- **Google Apps Script** – Backend logic, data storage (PropertiesService), and web app publishing.
- **HTML/CSS/JavaScript** – Frontend interface.
- **Bootstrap 5** – Responsive layout and UI components.
- **Bootstrap Icons** – Icon set for visual enhancement.

---

## Setup Instructions

### 1. Create a Google Apps Script Project

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Delete any default code in the editor.

### 2. Add the Code Files

You need two files in your Apps Script project:

- **`Code.gs`** – Contains all the server‑side functions (the entire JavaScript code from the top of the provided file).
- **`index.html`** – Contains the HTML + client‑side JavaScript (the entire HTML block from the provided file).

> **Important:**  
> - Copy the backend code (from `// ==================== NGO Management System ====================` to the end of the `getFormTemplate` function) into `Code.gs`.  
> - Copy the frontend code (from `<!DOCTYPE html>` to `</html>`) into `index.html`.

### 3. Deploy as a Web App

1. Click **Deploy** > **New deployment**.
2. Choose **Web app** as the type.
3. Set **Execute as** to `Me` and **Who has access** to `Anyone` (or restrict as needed).
4. Click **Deploy**.
5. Authorize the app when prompted.
6. Copy the generated URL – this is your live application.

> **Note:** Every time you update the code, you must create a new deployment version to see changes.

---

## Usage

- Access the web app via the deployment URL.
- Use the top navigation bar to switch between Dashboard, Volunteers, Members, Donations, Todos, and Programs.
- On each data page:
  - Click **Add** to create a new record.
  - Click the edit (pencil) icon to modify a record.
  - Click the delete (trash) icon to remove a record.
  - Use the search box to filter records.
- On the Dashboard, click any quick‑action button to jump to the corresponding page.
- Import data:
  1. Click the **Import** button in the header.
  2. Paste the URL of a Google Sheets document (any sheets inside will be imported).
  3. Click **Import**.
- Export data:
  1. Click the **Export** button.
  2. A new Google Sheet will be created with all your data; it opens in a new tab.

---

## Customization

- **Data Structure** – Modify the `initializeData()` function in `Code.gs` to change default records or add new fields.
- **Form Fields** – Edit the `getFormTemplate()` function to add/remove fields for each data type.
- **Styling** – Adjust the `<style>` block in `index.html` to match your organization’s branding.
- **Language** – All bilingual strings are embedded in the HTML and JavaScript. You can change translations or add more languages.

---

## Contributing

Contributions are welcome! If you’d like to improve this system, please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contact & Acknowledgements

- Created for the **Hong Kong Productivity Council – NGO Innovation and Digital Technology Recognition Scheme** (Finalist).
- This project is a **work in progress** – feedback and suggestions are always appreciated!
- For questions or ideas, please open an issue on GitHub or contact the repository owner.

---
