#!/bin/bash
# Ignored Build Step Vercela (vercel.json → ignoreCommand).
# exit 1 = buduj, exit 0 = pomiń deploy.
#
# Deploy ze zmianą w strefie płatności (scripts/strefa-platnosci/sciezki.txt) przechodzi
# tylko wtedy, gdy któryś commit od poprzedniego deployu ma linię „Zgoda-platnosci: tak”.
# Bez niej Vercel pokaże deploy jako „Canceled” z opisem poniżej, a produkcja zostaje
# na poprzedniej wersji.

cd "$(dirname "$0")/../.." || exit 1

PREV="$VERCEL_GIT_PREVIOUS_SHA"
if [ -z "$PREV" ]; then
  echo "Strefa płatności: brak poprzedniego deployu do porównania — buduję."
  exit 1
fi

# Vercel klonuje płytko — dociągamy historię, żeby porównać z poprzednim deployem
if ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  git fetch --quiet --depth=200 origin "$VERCEL_GIT_COMMIT_REF" 2>/dev/null || git fetch --quiet --unshallow 2>/dev/null
fi
if ! git cat-file -e "$PREV^{commit}" 2>/dev/null; then
  # Nie blokujemy w ciemno — inaczej każdy kolejny deploy by przepadał.
  # Zmiany w strefie wyłapie wtedy codzienna kontrola.
  echo "Strefa płatności: brak poprzedniego deployu $PREV w historii — buduję bez sprawdzenia."
  exit 1
fi

WZORCE=$(grep -vE '^\s*(#|$)' scripts/strefa-platnosci/sciezki.txt)
ZMIENIONE=$(git diff --name-only "$PREV" HEAD | grep -E -f <(echo "$WZORCE"))

if [ -z "$ZMIENIONE" ]; then
  exit 1
fi

if git log --format=%B "$PREV..HEAD" | grep -qiE '^Zgoda-platnosci:[[:space:]]*tak[[:space:]]*$'; then
  echo "Strefa płatności: zmiany zatwierdzone (Zgoda-platnosci: tak) — buduję."
  echo "$ZMIENIONE"
  exit 1
fi

echo "STREFA PŁATNOŚCI: deploy wstrzymany. Zmienione pliki bez zgody:"
echo "$ZMIENIONE"
echo "Żeby wdrożyć: commit z linią „Zgoda-platnosci: tak” (po sprawdzeniu, co może się zepsuć)."
exit 0
