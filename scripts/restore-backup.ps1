# Restore DB from a backup file
# Usage: .\scripts\restore-backup.ps1 -File "silpo_db_20260704_120000.dump"

param(
    [Parameter(Mandatory=$true)]
    [string]$File
)

Write-Host "WARNING: this will OVERWRITE the current database with data from: $File"
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Cancelled."
    exit
}

docker exec silpo_db_backup sh -c "pg_restore -h db -U `$POSTGRES_USER -d `$POSTGRES_DB --clean --if-exists /backups/$File"

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: database restored from $File"
} else {
    Write-Host "ERROR: restore failed. Check that the file exists in the backups/ folder"
}
