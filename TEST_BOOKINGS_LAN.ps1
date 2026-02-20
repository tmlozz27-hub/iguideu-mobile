$ErrorActionPreference="Stop"

$BASE="http://192.168.1.143:4020"

Write-Host "=== HEALTH ==="
curl.exe -i "$BASE/api/health"

Write-Host ""
Write-Host "=== GUIDES ==="
try {
  $r = Invoke-WebRequest "$BASE/api/guides" -UseBasicParsing
  Write-Host "STATUS=$($r.StatusCode)"
  $r.Content
} catch {
  Write-Host "ERROR GUIDES"
}

Write-Host ""
Write-Host "=== CREATE BOOKING ==="

$body = @{
  guideId       = "guide_demo_1"
  guideName     = "Demo Guide"
  city          = "Buenos Aires"
  travelerEmail = "test+frontend@iguideu.com"
  travelerName  = "Test Frontend"
  type          = "HOUR"
  startDate     = "2026-02-12"
  durationHours = 2
  amount        = 5000
  currency      = "usd"
} | ConvertTo-Json

try {
  $r = Invoke-WebRequest "$BASE/api/bookings" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
  Write-Host "STATUS=$($r.StatusCode)"
  $r.Content
} catch {
  Write-Host "ERROR CREATE BOOKING"
  if ($_.Exception.Response) {
    $sr = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
    $sr.ReadToEnd()
  }
}

Write-Host ""
Write-Host "=== LIST BOOKINGS ==="
$enc=[uri]::EscapeDataString("test+frontend@iguideu.com")

try {
  $r = Invoke-WebRequest "$BASE/api/bookings?email=$enc" -UseBasicParsing
  Write-Host "STATUS=$($r.StatusCode)"
  $r.Content
} catch {
  Write-Host "ERROR LIST"
}
