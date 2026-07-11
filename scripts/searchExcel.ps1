Add-Type -AssemblyName System.IO.Compression.FileSystem
$xlsxFiles = @(
    'C:\Users\aathi\OneDrive\Documents\Diabetes_Recipes.xlsx',
    'C:\Users\aathi\OneDrive\Documents\BP_Recipes.xlsx',
    'C:\Users\aathi\OneDrive\Documents\RecipeFull.xlsx',
    'C:\Users\aathi\OneDrive\Documents\Recipe_Master_English_Cleaned.xlsx'
)
foreach ($xlsx in $xlsxFiles) {
    if (Test-Path $xlsx) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($xlsx)
        $entry = $zip.Entries | Where-Object { $_.FullName -eq 'xl/sharedStrings.xml' }
        if ($entry) {
            $reader = New-Object System.IO.StreamReader($entry.Open())
            $content = $reader.ReadToEnd()
            $reader.Close()
            if ($content -like '*029636de523e6a8f8d4f5c644ec32121f2eba7f1*') {
                Write-Host "Found in $xlsx"
            } else {
                Write-Host "Not found in $xlsx"
            }
        } else {
            Write-Host "No shared strings in $xlsx"
        }
        $zip.Dispose()
    } else {
        Write-Host "File not found: $xlsx"
    }
}
