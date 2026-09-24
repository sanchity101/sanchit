param (
    [int]$Port = 8000,
    [string]$Path = $(if (Test-Path "$PSScriptRoot\index.html") { $PSScriptRoot } else { "$PSScriptRoot\Ctis-Project-main" })
)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".webp" = "image/webp"
    ".mp4"  = "video/mp4"
    ".txt"  = "text/plain; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host "  CloudVault (CTIS Project) is live on Localhost!" -ForegroundColor Green
    Write-Host "  URL: http://localhost:$Port/" -ForegroundColor Cyan
    Write-Host "  Serving from: $Path"
    Write-Host "=========================================================="
} catch {
    Write-Error "Failed to start listener on port $Port : $_"
    exit 1
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "index.html"
        }

        # URL decode
        $decodedUrl = [System.Uri]::UnescapeDataString($rawUrl)
        $filePath = Join-Path $Path $decodedUrl

        # If path is a directory, check for index.html
        if (Test-Path -Path $filePath -PathType Container) {
            $filePath = Join-Path $filePath "index.html"
        }
        # If file doesn't exist, check with .html appended
        if (-not (Test-Path -Path $filePath -PathType Leaf)) {
            if (Test-Path -Path "$filePath.html" -PathType Leaf) {
                $filePath = "$filePath.html"
            }
        }

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.StatusCode = 200

            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>The requested file '$decodedUrl' was not found.</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.OutputStream.Close()
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] $($request.HttpMethod) $($request.Url.PathAndQuery) -> $($response.StatusCode)"
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
