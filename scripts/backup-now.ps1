# Manual on-demand DB backup
# Usage: .\scripts\backup-now.ps1

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$file = "silpo_db_manual_$timestamp.dump"

Write-Host "Creating backup: backups\$file"

docker exec silpo_db_backup sh -c "pg_dump -h db -U `$POSTGRES_USER -d `$POSTGRES_DB -F c -f /backups/$file"

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: backup created -> backups\$file"
} else {
    Write-Host "ERROR: backup failed"
}
