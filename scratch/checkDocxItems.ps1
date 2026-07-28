Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxText($path) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) {
        return "No word/document.xml found"
    }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xmlText = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    
    # Simple regex to get text inside <w:t> tags
    $matches = [regex]::Matches($xmlText, '<w:t.*?>(.*?)</w:t>')
    $text = ($matches | ForEach-Object { $_.Groups[1].Value }) -join "`n"
    return $text
}

Write-Host "--- Diabetes ---"
$diabText = Get-DocxText "C:\Users\aathi\OneDrive\Documents\DiabetesFoodItems.docx"
Write-Host "Length: $($diabText.Length)"
$diabLines = $diabText -split "`n" | Where-Object { $_.Trim().Length -gt 0 }
Write-Host "Total non-empty text elements: $($diabLines.Count)"
Write-Host "First 20 elements:"
$diabLines[0..19]

Write-Host "`n--- BP ---"
$bpText = Get-DocxText "C:\Users\aathi\OneDrive\Documents\bpfood.zip.docx"
Write-Host "Length: $($bpText.Length)"
$bpLines = $bpText -split "`n" | Where-Object { $_.Trim().Length -gt 0 }
Write-Host "Total non-empty text elements: $($bpLines.Count)"
Write-Host "First 20 elements:"
$bpLines[0..19]

Write-Host "`n--- Normal ---"
$normText = Get-DocxText "C:\Users\aathi\OneDrive\Desktop\BITEDIET--main\normalpeople\normalpeople_dishes\normalpeople_dishes.docx"
Write-Host "Length: $($normText.Length)"
$normLines = $normText -split "`n" | Where-Object { $_.Trim().Length -gt 0 }
Write-Host "Total non-empty text elements: $($normLines.Count)"
Write-Host "First 20 elements:"
$normLines[0..19]
