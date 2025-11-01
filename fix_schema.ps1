$supabaseUrl = "https://ndenqikcogzrkrjnlvns.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM"

# SQL Queries to fix schema
$sqlQueries = @(
    "ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);",
    "ALTER TABLE IF EXISTS public.messages ADD COLUMN IF NOT EXISTS body TEXT;",
    "ALTER TABLE IF EXISTS public.transactions ADD COLUMN IF NOT EXISTS request_id UUID;",
    "CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);",
    "CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);",
    "CREATE INDEX IF NOT EXISTS idx_purchase_cases_request_id ON public.purchase_cases(request_id);"
)

Write-Host "Starting database schema fixes..." -ForegroundColor Green

foreach ($query in $sqlQueries) {
    Write-Host "Executing: $query" -ForegroundColor Yellow
    
    $body = @{
        query = $query
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/rpc/sql_exec" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $anonKey"
                "Content-Type" = "application/json"
                "apikey" = $anonKey
            } `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "✓ Success: $query" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Error: $_" -ForegroundColor Red
    }
}

Write-Host "`nDatabase schema fixes completed!" -ForegroundColor Green
