#!/usr/bin/env python3
"""PreToolUse: każda zmiana w strefie płatności wymaga zgody Jakuba.

Zatrzymuje (decyzja "ask") edycję plików z scripts/strefa-platnosci/sciezki.txt,
edycję kodu, który zapisuje payment_status, oraz polecenia zmieniające dane
w Stripe albo w tabelach zgłoszeń i zamówień. Claude dostaje polecenie, żeby
przed zgodą opisał, co może się zepsuć.
"""
import json
import os
import re
import sys

REPO = os.environ.get("CLAUDE_PROJECT_DIR") or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

POWOD = (
    "STREFA PŁATNOŚCI — ta zmiana może zepsuć płatności klientów (Stripe, Przelewy24, "
    "statusy zgłoszeń). 19.09 jedna taka zmiana sprawiła, że webhook nie zapisywał wpłat "
    "i klient zapłacił dwa razy. Zatwierdź tylko, jeśli Claude wyjaśnił powyżej, co może "
    "się zepsuć i jak to sprawdzi."
)

KONTEKST = (
    "Ta operacja dotyczy strefy płatności serwis-zebry.pl. Zanim użytkownik ją zatwierdzi, "
    "napisz mu wprost: (1) co zmieniasz, (2) co może przestać działać — płatność, webhook, "
    "zapis w bazie, maile, statusy, (3) czy baza (ograniczenia CHECK, kolumny) przyjmie nowe "
    "wartości, (4) jak to sprawdzisz przed wdrożeniem. Commit z taką zmianą musi mieć linię "
    "'Zgoda-platnosci: tak' — bez niej Vercel nie zbuduje deployu."
)


def wzorce():
    try:
        with open(os.path.join(REPO, "scripts/strefa-platnosci/sciezki.txt"), encoding="utf-8") as f:
            return [l.strip() for l in f if l.strip() and not l.lstrip().startswith("#")]
    except OSError:
        return []


def w_strefie(sciezka):
    if not sciezka:
        return False
    rel = os.path.relpath(os.path.abspath(sciezka), REPO)
    if rel.startswith(".."):
        return False
    return any(re.search(w, rel) for w in wzorce())


def tekst_zmiany(wejscie):
    czesci = [wejscie.get(k) or "" for k in ("new_string", "content", "new_source")]
    for e in wejscie.get("edits") or []:
        czesci.append(e.get("new_string") or "")
    return "\n".join(czesci)


POLECENIA = [
    # zapis w Stripe (curl z danymi albo metodą inną niż GET, stripe CLI)
    r"api\.stripe\.com.*(\s-d\s|--data|-X\s*(POST|DELETE))",
    r"(\s-d\s|--data|-X\s*(POST|DELETE)).*api\.stripe\.com",
    r"(^|[\s;&|])stripe\s+(\S+\s+)?(create|update|delete|refund|cancel|capture|post)",
    # zapis w tabelach zgłoszeń i zamówień przez REST Supabase
    r"-X\s*(PATCH|POST|DELETE|PUT).*/rest/v1/(repair_requests|repair_status_history|shop_orders|orders)",
    r"/rest/v1/(repair_requests|repair_status_history|shop_orders|orders).*-X\s*(PATCH|POST|DELETE|PUT)",
    # zmiany schematu
    r"(?i)\b(alter|drop)\s+table\b",
]


def main():
    try:
        dane = json.load(sys.stdin)
    except Exception:
        return
    narzedzie = dane.get("tool_name", "")
    wejscie = dane.get("tool_input") or {}

    zatrzymaj = False
    if narzedzie in ("Edit", "Write", "MultiEdit", "NotebookEdit"):
        sciezka = wejscie.get("file_path") or wejscie.get("notebook_path")
        zatrzymaj = w_strefie(sciezka) or "payment_status" in tekst_zmiany(wejscie)
    elif narzedzie == "Bash":
        polecenie = wejscie.get("command") or ""
        zatrzymaj = any(re.search(w, polecenie) for w in POLECENIA)

    if zatrzymaj:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": POWOD,
                "additionalContext": KONTEKST,
            }
        }, ensure_ascii=False))


if __name__ == "__main__":
    main()
