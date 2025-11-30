#!/bin/bash

# Skrypt do batch upload manuali do Google Cloud Storage
# Usage: ./upload-manuals.sh /path/to/manuals/folder

MANUALS_DIR="$1"
BUCKET="gs://serwiszebra-manuals"

if [ -z "$MANUALS_DIR" ]; then
  echo "❌ Podaj ścieżkę do folderu z PDF-ami"
  echo "Usage: ./upload-manuals.sh /path/to/manuals"
  exit 1
fi

if [ ! -d "$MANUALS_DIR" ]; then
  echo "❌ Folder nie istnieje: $MANUALS_DIR"
  exit 1
fi

echo "📁 Szukam PDF-ów w: $MANUALS_DIR"
PDF_COUNT=$(find "$MANUALS_DIR" -name "*.pdf" -type f | wc -l | tr -d ' ')
echo "📚 Znaleziono $PDF_COUNT PDF-ów"

if [ "$PDF_COUNT" -eq 0 ]; then
  echo "❌ Nie znaleziono żadnych PDF-ów"
  exit 1
fi

echo ""
echo "🚀 Rozpoczynam upload do $BUCKET..."
echo ""

COUNTER=0
find "$MANUALS_DIR" -name "*.pdf" -type f | while read -r file; do
  COUNTER=$((COUNTER + 1))
  FILENAME=$(basename "$file")
  
  echo "[$COUNTER/$PDF_COUNT] 📤 Uploading: $FILENAME"
  
  gcloud storage cp "$file" "$BUCKET/" --quiet
  
  if [ $? -eq 0 ]; then
    echo "    ✅ Sukces"
  else
    echo "    ❌ Błąd"
  fi
  echo ""
done

echo "✨ Upload zakończony!"
echo ""
echo "⏳ Vertex AI będzie indeksować nowe pliki przez ~10-20 minut"
echo "📊 Sprawdź status: https://console.cloud.google.com/gen-app-builder/locations/eu/data-stores/zebra-manuals-eu_1764279128042/data?project=gen-lang-client-0244521553"
