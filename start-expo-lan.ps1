$Host.UI.RawUI.WindowTitle="CLIENT - FRONTEND - iguideu23"
cd "C:\Users\Tom\Desktop\IGUIDEU_PROJECT\frontend\iguideu-app-expo-clean"

$pid8081 = (Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)
if ($pid8081) { Stop-Process -Id $pid8081 -Force }

Remove-Item ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

$env:EXPO_NO_TELEMETRY="1"
$env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.214"
Remove-Item Env:EXPO_PACKAGER_PROXY_URL -ErrorAction SilentlyContinue

npx expo start --lan -c