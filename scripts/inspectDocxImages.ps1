Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = 'C:\Users\aathi\OneDrive\Documents\DiabetesFoodItems.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$documentEntry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$relsEntry = $zip.Entries | Where-Object { $_.FullName -eq 'word/_rels/document.xml.rels' }
if (-not $documentEntry -or -not $relsEntry) { Write-Error 'Missing document.xml or relationships.'; exit 1 }
$reader = New-Object System.IO.StreamReader($documentEntry.Open(), [System.Text.Encoding]::UTF8)
$documentXml = $reader.ReadToEnd(); $reader.Close()
$reader = New-Object System.IO.StreamReader($relsEntry.Open(), [System.Text.Encoding]::UTF8)
$relsXml = $reader.ReadToEnd(); $reader.Close()
$zip.Dispose()
$relMap = @{}
foreach ($m in [regex]::Matches($relsXml, '<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"', 'IgnoreCase')) {
    $relMap[$m.Groups[1].Value] = $m.Groups[2].Value
}
$embedOrder = @()
foreach ($m in [regex]::Matches($documentXml, 'r:embed="([^"]+)"', 'IgnoreCase')) {
    $id = $m.Groups[1].Value
    if ($relMap.ContainsKey($id) -and $relMap[$id] -like 'media/*') {
        $embedOrder += $relMap[$id].Substring(6)
    }
}
Write-Host "Embed count: $($embedOrder.Count)"
Write-Host "Unique image refs: $(([System.Collections.Generic.HashSet[string]]::new($embedOrder)).Count)"
$embedOrder | Select-Object -First 100 | ForEach-Object { Write-Host $_ }
