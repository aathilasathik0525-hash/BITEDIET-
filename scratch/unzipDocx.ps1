$outputDir = "c:\Users\aathi\OneDrive\Desktop\BITEDIET--main\scratch\docx_extracted"
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Path $outputDir | Out-Null

function Extract-Docx($path, $name) {
    $tempZip = "$outputDir\$name.zip"
    Copy-Item $path $tempZip
    $dest = "$outputDir\$name"
    Expand-Archive -Path $tempZip -DestinationPath $dest -Force
    Remove-Item $tempZip
}

Extract-Docx "C:\Users\aathi\OneDrive\Documents\DiabetesFoodItems.docx" "diabetes"
Extract-Docx "C:\Users\aathi\OneDrive\Documents\bpfood.zip.docx" "bp"
Extract-Docx "C:\Users\aathi\OneDrive\Desktop\BITEDIET--main\normalpeople\normalpeople_dishes\normalpeople_dishes.docx" "normal"

Write-Host "Extracted all documents."
