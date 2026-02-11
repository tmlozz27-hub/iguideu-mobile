$Host.UI.RawUI.WindowTitle = "CLIENT - FRONTEND - iguideu23"

Write-Host "=== TEST PAY FLOW ===" -ForegroundColor Cyan

$BASE = "https://iguideu23-local.i-guide-u.com"
$email = "test+frontend@iguideu.com"
$emailEnc = [uri]::EscapeDataString($email)

Write-Host "`n1) GET BOOKINGS" -ForegroundColor Yellow
$b = Invoke-RestMethod "$BASE/api/bookings?email=$emailEnc" -TimeoutSec 20

# Mostrar top 5 para debug rápido
$b | Select-Object -First 5 _id,status,total,amountPaid,updatedAt | Format-Table -AutoSize

# Elegir un booking válido (total > 0) y NO pagado
$pick = $b | Where-Object { $_.total -gt 0 -and ($_.status -match "PENDING|created") -and ($_.amountPaid -lt $_.total) } | Select-Object -First 1

if (-not $pick) {
  Write-Host "`nNO HAY BOOKING VALIDO (total>0 y no pagado). Tenes que crear uno con total correcto." -ForegroundColor Red
  exit 1
}

$BOOKING_ID = $pick._id
Write-Host "`nBOOKING_ID = $BOOKING_ID (status=$($pick.status) total=$($pick.total))" -ForegroundColor Cyan

Write-Host "`n2) CREATE CHECKOUT" -ForegroundColor Yellow
$body = @{ bookingId = $BOOKING_ID } | ConvertTo-Json

try {
  $r = Invoke-WebRequest "$BASE/api/payments/create-intent" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -TimeoutSec 25

  $obj = $r.Content | ConvertFrom-Json
  $obj | Format-List

  if ($obj.checkoutUrl) {
    Write-Host "`nOPENING CHECKOUT..." -ForegroundColor Green
    Start-Process $obj.checkoutUrl
  } else {
    Write-Host "ERROR: checkoutUrl missing" -ForegroundColor Red
    Write-Host $r.Content
    exit 1
  }

} catch {
  Write-Host ("CREATE-INTENT FAIL: " + $_.Exception.Message) -ForegroundColor Red
  if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream()){
    $sr = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
    Write-Host "`n=== ERROR BODY ===" -ForegroundColor DarkYellow
    $sr.ReadToEnd()
  }
  exit 1
}
