# Fix curly quotes in TypeScript files
$files = Get-ChildItem -Path ".\src" -Filter "*.ts*" -Recurse

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Replace curly single quotes with straight single quotes
    $content = $content.Replace([char]0x2018, [char]0x0027)  # ' -> '
    $content = $content.Replace([char]0x2019, [char]0x0027)  # ' -> '
    
    # Replace curly double quotes with straight double quotes
    $content = $content.Replace([char]0x201C, [char]0x0022)  # " -> "
    $content = $content.Replace([char]0x201D, [char]0x0022)  # " -> "
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Completed! Processed $($files.Count) files."
