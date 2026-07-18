# ============================================================
# soNIC AI Agent Test Script
# Run with: .\test-agents.ps1
# Make sure npm run dev is already running in another window.
# ============================================================

$baseUrl = "http://localhost:3000"

function Invoke-RestMethodSafe {
    param(
        [hashtable]$Params,
        [string]$StepName
    )
    try {
        return Invoke-RestMethod @Params
    } catch {
        Write-Host ("ERROR in " + $StepName + ":") -ForegroundColor Red
        $errorResponse = $_.Exception.Response
        if ($errorResponse) {
            try {
                $stream = $errorResponse.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $body = $reader.ReadToEnd()
                Write-Host $body -ForegroundColor Red
            } catch {
                Write-Host "Could not read response body." -ForegroundColor Red
                Write-Host $_.Exception.Message -ForegroundColor Red
            }
        } else {
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
        return $null
    }
}

# --- 1. Log in as startup ---
Write-Host ""
Write-Host "=== 1. Login (startup) ===" -ForegroundColor Cyan

$loginParams = @{
    Uri         = "$baseUrl/api/auth/login"
    Method      = "Post"
    ContentType = "application/json"
    Body        = '{"email":"startup@sonic.vn","password":"password"}'
}
$loginResponse = Invoke-RestMethodSafe -Params $loginParams -StepName "login"
if (-not $loginResponse) { Write-Host "Cannot continue without a token. Exiting." -ForegroundColor Red; exit 1 }

$TOKEN = $loginResponse.token
Write-Host ("Token acquired: " + $TOKEN.Substring(0,20) + "...") -ForegroundColor Green

# --- 2. Agent 1: extract-profile ---
Write-Host ""
Write-Host "=== 2. Agent 1: extract-profile ===" -ForegroundColor Cyan

$pitchText = "MedScan AI is a Hanoi-based startup building an AI-powered diagnostic imaging tool for rural hospitals. We use computer vision to detect early-stage tuberculosis from chest X-rays with 94 percent accuracy. Founded in 2023, we have 8 employees, currently in seed stage with 50K USD MRR and 40 percent month-over-month growth. We are raising 2M USD to expand to 20 more hospitals and are seeking FDA-equivalent regulatory guidance."

$extractBody = @{ text = $pitchText } | ConvertTo-Json
$extractParams = @{
    Uri         = "$baseUrl/api/extract-profile"
    Method      = "Post"
    Headers     = @{ Authorization = "Bearer $TOKEN" }
    ContentType = "application/json"
    Body        = $extractBody
}
$extractResponse = Invoke-RestMethodSafe -Params $extractParams -StepName "extract-profile"

if ($extractResponse) {
    Write-Host ("aiSummary: " + $extractResponse.extractedProfile.aiSummary) -ForegroundColor Yellow
    Write-Host ("industry: " + $extractResponse.extractedProfile.industry)
    Write-Host ("technologies: " + ($extractResponse.extractedProfile.technologies -join ", "))
}

# --- 3. Agent 2: assess-readiness ---
Write-Host ""
Write-Host "=== 3. Agent 2: assess-readiness ===" -ForegroundColor Cyan

$readinessParams = @{
    Uri     = "$baseUrl/api/assess-readiness"
    Method  = "Post"
    Headers = @{ Authorization = "Bearer $TOKEN" }
}
$readinessResponse = Invoke-RestMethodSafe -Params $readinessParams -StepName "assess-readiness"

if ($readinessResponse) {
    Write-Host ("readiness score: " + $readinessResponse.score) -ForegroundColor Yellow
    Write-Host ("recommendation: " + $readinessResponse.recommendation)
}

# --- 3b. Check aiSummary vs recommendation did not collide ---
Write-Host ""
Write-Host "=== 3b. Checking aiSummary vs recommendation collision ===" -ForegroundColor Cyan

$profileParams = @{
    Uri     = "$baseUrl/api/profile?userId=" + $loginResponse.user.id
    Method  = "Get"
    Headers = @{ Authorization = "Bearer $TOKEN" }
}
$profileResponse = Invoke-RestMethodSafe -Params $profileParams -StepName "profile fetch"

if ($profileResponse) {
    $startupData = $profileResponse.startup
    if ($startupData.aiSummary -and $startupData.recommendation -and ($startupData.aiSummary -ne $startupData.recommendation)) {
        Write-Host "PASS: aiSummary and recommendation are both present and distinct." -ForegroundColor Green
    } else {
        Write-Host "FAIL: aiSummary and recommendation are missing or identical - collision bug may be back!" -ForegroundColor Red
    }
    Write-Host ("aiSummary:      " + $startupData.aiSummary)
    Write-Host ("recommendation: " + $startupData.recommendation)
}

# --- 4a. Agent 3: matches (startup -> partners) ---
Write-Host ""
Write-Host "=== 4a. Agent 3: matches (startup to partners) ===" -ForegroundColor Cyan

$startupMatchParams = @{
    Uri     = "$baseUrl/api/matches?type=startup"
    Method  = "Get"
    Headers = @{ Authorization = "Bearer $TOKEN" }
}
$startupMatches = Invoke-RestMethodSafe -Params $startupMatchParams -StepName "matches (startup)"

if ($startupMatches) {
    foreach ($m in $startupMatches) {
        Write-Host ($m.orgName + ": score=" + $m.matchScore + " - " + $m.shortReason)
    }
}

# --- 4b. Agent 3b: matches (partner -> startups) ---
Write-Host ""
Write-Host "=== 4b. Agent 3b: matches (partner to startups) ===" -ForegroundColor Cyan

$partnerLoginParams = @{
    Uri         = "$baseUrl/api/auth/login"
    Method      = "Post"
    ContentType = "application/json"
    Body        = '{"email":"partner@sonic.vn","password":"password"}'
}
$partnerLogin = Invoke-RestMethodSafe -Params $partnerLoginParams -StepName "partner login"

if ($partnerLogin) {
    $PARTNER_TOKEN = $partnerLogin.token

    $partnerMatchParams = @{
        Uri     = "$baseUrl/api/matches?type=partner"
        Method  = "Get"
        Headers = @{ Authorization = "Bearer $PARTNER_TOKEN" }
    }
    $partnerMatches = Invoke-RestMethodSafe -Params $partnerMatchParams -StepName "matches (partner)"

    if ($partnerMatches) {
        foreach ($m in $partnerMatches) {
            Write-Host ($m.name + ": score=" + $m.matchScore + " - " + $m.shortReason)
        }

        $uniqueScores = $partnerMatches | ForEach-Object { $_.matchScore } | Select-Object -Unique
        if ($uniqueScores.Count -gt 1) {
            Write-Host "PASS: partner match scores vary (not the old 80/85/90 mock)." -ForegroundColor Green
        } else {
            Write-Host "WARNING: all partner match scores are identical - check if this is still mocked." -ForegroundColor Red
        }
    }
}

# --- 5. Agent 4: explain-match, called twice to check the cache bug ---
Write-Host ""
Write-Host "=== 5. Agent 4: explain-match (called twice) ===" -ForegroundColor Cyan

if ($startupMatches -and $startupMatches.Count -gt 0) {
    $matchId = $startupMatches[0].id
    # Note: adjust this if your matches response uses a different field for the Match row's own id

    $explainParams = @{
        Uri     = "$baseUrl/api/explain-match?id=$matchId"
        Method  = "Get"
        Headers = @{ Authorization = "Bearer $TOKEN" }
    }

    $first = Invoke-RestMethodSafe -Params $explainParams -StepName "explain-match (first call)"
    Start-Sleep -Seconds 1
    $second = Invoke-RestMethodSafe -Params $explainParams -StepName "explain-match (second call)"

    if ($first -and $second) {
        $firstRoadmap = $first.roadmap | ConvertTo-Json -Compress
        $secondRoadmap = $second.roadmap | ConvertTo-Json -Compress

        if ($firstRoadmap -eq $secondRoadmap) {
            Write-Host "PASS: roadmap identical between first and second call (cache bug fixed)." -ForegroundColor Green
        } else {
            Write-Host "FAIL: roadmap differs between calls - cache bug may still be present." -ForegroundColor Red
            Write-Host ("First:  " + $firstRoadmap)
            Write-Host ("Second: " + $secondRoadmap)
        }

        if ($first.explanationVi -ne $first.explanation) {
            Write-Host "PASS: explanationVi is distinct from explanation." -ForegroundColor Green
        } else {
            Write-Host "WARNING: explanationVi matches explanation exactly - translation may not be working." -ForegroundColor Red
        }
    }
} else {
    Write-Host "No matches found to test explain-match against. Run step 4a first and ensure matches exist." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan