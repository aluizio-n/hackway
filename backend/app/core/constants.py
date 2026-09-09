TARGET_TYPES = [
    {"key": "host", "label": "Host / IP", "placeholder": "ex: 10.0.1.50"},
    {"key": "domain", "label": "Domínio / Web", "placeholder": "ex: acmecorp.com.br"},
    {"key": "company", "label": "Empresa", "placeholder": "ex: Acme Corporation"},
    {"key": "person", "label": "Pessoa (OSINT)", "placeholder": "ex: nome.sobrenome"},
    {"key": "network", "label": "Rede / CIDR", "placeholder": "ex: 192.168.1.0/24"},
    {"key": "mobile", "label": "Mobile App", "placeholder": "ex: com.app.name"},
    {"key": "api", "label": "API", "placeholder": "ex: api.corp.com/v2"},
    {"key": "cloud", "label": "Cloud", "placeholder": "ex: aws:account-id"},
    {"key": "wifi", "label": "Wi-Fi / Física", "placeholder": "ex: SSID ou localização"},
]

TARGET_TYPE_KEYS = [t["key"] for t in TARGET_TYPES]

PTES_PHASES = [
    {"num": "01", "name": "Information Gathering", "desc": "Coleta passiva e ativa de informações sobre o alvo"},
    {"num": "02", "name": "Reconnaissance", "desc": "Scanning, enumeração e mapeamento da superfície de ataque"},
    {"num": "03", "name": "Vulnerability Discovery", "desc": "Identificação e análise de vulnerabilidades"},
    {"num": "04", "name": "Exploitation", "desc": "Exploração das vulnerabilidades encontradas"},
    {"num": "05", "name": "Post-Exploitation", "desc": "Escalação de privilégios, persistência e movimentação lateral"},
    {"num": "06", "name": "Reporting", "desc": "Geração de relatórios técnico e executivo"},
]

PHASE_COUNT = len(PTES_PHASES)

SPECIALTIES = [
    "Web Pentest",
    "Network Pentest",
    "Mobile Pentest",
    "Cloud Security",
    "OSINT",
    "Red Team",
    "Social Engineering",
    "Wireless",
]
