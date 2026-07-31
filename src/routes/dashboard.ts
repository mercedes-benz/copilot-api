export const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Copilot API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #000000;
      --bg-elevated: #0a0a0a;
      --bg-card: #111111;
      --border: #1a1a1a;
      --border-subtle: #222222;
      --fg: #ffffff;
      --fg-muted: #888888;
      --fg-dim: #555555;
      --accent: #ffffff;
      --bar-bg: #1a1a1a;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    .container { max-width: 960px; margin: 0 auto; padding: 48px 24px; }

    header { margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
    header h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 4px; }
    header p { font-size: 13px; color: var(--fg-muted); }

    .status-bar { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--fg-muted); animation: pulse 2s ease-in-out infinite; }
    .status-dot.active { background: #fff; animation: none; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .status-text { font-size: 12px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.05em; }

    section { margin-bottom: 48px; }
    section h2 { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-muted); margin-bottom: 16px; }

    .quota-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 24px;
    }

    .quota-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
    .quota-title { font-size: 13px; font-weight: 500; color: var(--fg); }
    .quota-percent { font-size: 11px; font-family: 'SF Mono', 'Fira Code', monospace; color: var(--fg-dim); }

    .progress-track { width: 100%; height: 3px; background: var(--bar-bg); margin-bottom: 14px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--accent); transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .progress-fill.mid { background: var(--fg-muted); }
    .progress-fill.high { background: var(--fg-dim); }

    .quota-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-item { }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-dim); margin-bottom: 2px; }
    .stat-value { font-size: 14px; font-family: 'SF Mono', 'Fira Code', monospace; color: var(--fg); }

    .model-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 8px;
    }

    .model-item {
      background: var(--bg-card);
      border: 1px solid var(--border);
      padding: 12px 16px;
      font-size: 13px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      color: var(--fg-muted);
      transition: border-color 0.2s;
    }

    .model-item:hover { border-color: var(--border-subtle); color: var(--fg); }

    .code-block {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      padding: 20px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      line-height: 1.7;
      color: var(--fg-muted);
      overflow-x: auto;
      white-space: pre;
      position: relative;
    }

    .copy-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--fg-dim);
      padding: 6px 12px;
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: color 0.2s, border-color 0.2s;
    }

    .copy-btn:hover { color: var(--fg); border-color: var(--border-subtle); }

    .endpoint-table { width: 100%; border-collapse: collapse; }
    .endpoint-table th, .endpoint-table td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .endpoint-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-dim); font-weight: 500; }
    .endpoint-table td { font-family: 'SF Mono', 'Fira Code', monospace; color: var(--fg-muted); }
    .endpoint-table td:first-child { color: var(--fg); }
    .endpoint-table tr:last-child td { border-bottom: none; }
    .method { display: inline-block; min-width: 48px; margin-right: 8px; font-weight: 600; }
    .method.get { color: var(--fg-muted); }
    .method.post { color: var(--fg); }

    .loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; }
    .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--fg); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .error-box { border: 1px solid var(--border); padding: 20px; background: var(--bg-elevated); }
    .error-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-dim); margin-bottom: 4px; }
    .error-box p { font-size: 13px; color: var(--fg-muted); }

    @media (max-width: 640px) {
      .container { padding: 24px 16px; }
      .quota-stats { grid-template-columns: 1fr; }
      .model-list { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Copilot API</h1>
      <p>Premium Usage &middot; Models &middot; Endpoints</p>
      <div class="status-bar">
        <div class="status-dot" id="status-dot"></div>
        <span class="status-text" id="status-text">Connecting</span>
      </div>
    </header>
    <main id="content"><div class="loading"><div class="spinner"></div></div></main>
  </div>

  <script>
    (function() {
      var content = document.getElementById('content');
      var statusDot = document.getElementById('status-dot');
      var statusText = document.getElementById('status-text');
      var baseUrl = window.location.origin;

      function setStatus(state, text) {
        statusDot.className = 'status-dot' + (state === 'active' ? ' active' : '');
        statusText.textContent = text;
      }

      function escapeHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      }

      function renderError(msg) {
        content.innerHTML = '<div class="error-box"><p class="label">Error</p><p>' + escapeHtml(msg) + '</p></div>';
      }

      function renderDashboard(usage, models) {
        var premium = usage && usage.quota_snapshots ? usage.quota_snapshots.premium_interactions : null;
        var html = '';

        // Quota section
        html += '<section>';
        html += '<h2>Premium Interactions</h2>';
        if (premium) {
          var percentUsed = 100 - (premium.percent_remaining || 0);
          var fillClass = percentUsed > 75 ? (percentUsed > 90 ? ' high' : ' mid') : '';
          html += '<div class="quota-card">';
          html += '<div class="quota-header"><span class="quota-title">Credits Used</span><span class="quota-percent">' + percentUsed.toFixed(1) + '% used</span></div>';
          html += '<div class="progress-track"><div class="progress-fill' + fillClass + '" style="width:' + percentUsed + '%"></div></div>';
          html += '<div class="quota-stats">';
          html += '<div class="stat-item"><div class="stat-label">Used</div><div class="stat-value">' + (premium.credits_used || 0).toLocaleString() + '</div></div>';
          html += '<div class="stat-item"><div class="stat-label">Remaining</div><div class="stat-value">' + (premium.remaining || 0).toLocaleString() + '</div></div>';
          html += '<div class="stat-item"><div class="stat-label">Entitlement</div><div class="stat-value">' + (premium.entitlement || 0).toLocaleString() + '</div></div>';
          html += '</div></div>';
        } else {
          html += '<div class="error-box"><p>No premium interactions data available.</p></div>';
        }
        html += '</section>';

        // Models section
        html += '<section>';
        html += '<h2>Available Models</h2>';
        if (models && models.data && models.data.length) {
          html += '<div class="model-list">';
          models.data.forEach(function(m) {
            html += '<div class="model-item">' + escapeHtml(m.id) + '</div>';
          });
          html += '</div>';
        } else {
          html += '<div class="error-box"><p>No models loaded.</p></div>';
        }
        html += '</section>';

        // Claude Code config
        html += '<section>';
        html += '<h2>Claude Code Configuration</h2>';
        var config = JSON.stringify({
          env: {
            ANTHROPIC_BASE_URL: baseUrl,
            ANTHROPIC_AUTH_TOKEN: "dummy",
            ANTHROPIC_MODEL: "claude-opus-4.7",
            ANTHROPIC_DEFAULT_SONNET_MODEL: "claude-sonnet-4.6",
            ANTHROPIC_DEFAULT_OPUS_MODEL: "claude-opus-4.7",
            ANTHROPIC_DEFAULT_HAIKU_MODEL: "claude-haiku-4.5",
            DISABLE_NON_ESSENTIAL_MODEL_CALLS: "1",
            CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1"
          },
          permissions: { deny: ["WebSearch"] }
        }, null, 2);
        html += '<div class="code-block"><button class="copy-btn" onclick="copyConfig(this)">Copy</button>' + escapeHtml(config) + '</div>';
        html += '<p style="font-size:12px;color:var(--fg-dim);margin-top:8px;">Paste into <code style="background:var(--bg-card);padding:2px 6px;border:1px solid var(--border);">.claude/settings.json</code></p>';
        html += '</section>';

        // API Endpoints
        html += '<section>';
        html += '<h2>API Endpoints</h2>';
        html += '<div style="background:var(--bg-card);border:1px solid var(--border);">';
        html += '<table class="endpoint-table">';
        html += '<thead><tr><th>Endpoint</th><th>Description</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><span class="method post">POST</span>/v1/chat/completions</td><td>OpenAI Chat Completions API</td></tr>';
        html += '<tr><td><span class="method post">POST</span>/v1/messages</td><td>Anthropic Messages API</td></tr>';
        html += '<tr><td><span class="method get">GET</span>/v1/models</td><td>List available models</td></tr>';
        html += '<tr><td><span class="method post">POST</span>/v1/embeddings</td><td>Text embeddings</td></tr>';
        html += '<tr><td><span class="method get">GET</span>/usage</td><td>Quota and usage data (JSON)</td></tr>';
        html += '</tbody></table></div>';
        html += '<p style="font-size:12px;color:var(--fg-dim);margin-top:12px;">Base URL: <code style="background:var(--bg-card);padding:2px 6px;border:1px solid var(--border);">' + escapeHtml(baseUrl) + '</code> &mdash; API Key: any value (e.g. <code style="background:var(--bg-card);padding:2px 6px;border:1px solid var(--border);">dummy</code>)</p>';
        html += '</section>';

        content.innerHTML = html;
      }

      window.copyConfig = function(btn) {
        var block = btn.parentElement;
        var text = block.textContent.replace('Copy', '').trim();
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = 'Copied';
          setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
        });
      };

      async function fetchAll() {
        setStatus('loading', 'Fetching');
        try {
          var [usageRes, modelsRes] = await Promise.all([
            fetch(baseUrl + '/usage'),
            fetch(baseUrl + '/models')
          ]);
          var usage = usageRes.ok ? await usageRes.json() : null;
          var models = modelsRes.ok ? await modelsRes.json() : null;
          setStatus('active', 'Connected');
          renderDashboard(usage, models);
        } catch(e) {
          setStatus('error', 'Error');
          renderError(e.message || 'Failed to connect to server');
        }
      }

      fetchAll();
      setInterval(fetchAll, 60000);
    })();
  </script>
</body>
</html>`
