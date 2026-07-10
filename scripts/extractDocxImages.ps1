Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = 'C:\Users\aathi\OneDrive\Documents\DiabetesFoodItems.docx'
$destRoot = 'C:\Users\aathi\OneDrive\Documents\DiabetesFoodItems_extracted'
if (Test-Path $destRoot) { Remove-Item -Path $destRoot -Recurse -Force }
[System.IO.Compression.ZipFile]::OpenRead($docxPath).Entries | ForEach-Object {
    if ($_.FullName -like 'word/media/*') {
        $target = Join-Path $destRoot $_.FullName
        $targetDir = Split-Path $target -Parent
        if (-not (Test-Path $targetDir)) { New-Item -Path $targetDir -ItemType Directory -Force | Out-Null }
        $stream = $_.Open()
        $output = [System.IO.File]::Create($target)
        $stream.CopyTo($output)
        $output.Close()
        $stream.Close()
    }
}
Get-ChildItem -Path "$destRoot\word\media" | Select-Object FullName, Length | Format-Table -AutoSize
Write-Host "Extracted media count:" (Get-ChildItem -Path "$destRoot\word\media" | Measure-Object).Count
