Clear-Content -Path "./meta.txt"

foreach ($dir in Get-ChildItem -Directory) {
    
    Add-Content -Path ".\meta.txt" -Value $dir.FullName
}

Clear-Content -Path "./creation_date.txt"
Add-Content -Path "./creation_date.txt" -Value (Get-Date (Get-Date).ToUniversalTime() -Format 'o')

