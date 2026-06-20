Add WBJEE cutoff CSVs

The server loads WBJEE cutoff CSV files from `server/data`.

Accepted filenames:
- `cutoffs.csv` (treated as year 2025 by default)
- `cutoffs-2025.csv`, `cutoffs-2024.csv`, etc. — year is parsed from filename

To add the 2024 data you provided, copy the file into the project:

Windows PowerShell

```powershell
Copy-Item "C:\Users\Keshav Kumar\Downloads\wbjee cutoff data - 2024.csv" -Destination ".\server\data\cutoffs-2024.csv"
```

Or using Command Prompt

```cmd
copy "C:\Users\Keshav Kumar\Downloads\wbjee cutoff data - 2024.csv" server\data\cutoffs-2024.csv
```

After copying, restart the server so it reloads CSVs.