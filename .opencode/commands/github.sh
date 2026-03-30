#!/bin/bash

MSG="$*"

if [ -z "$MSG" ]; then
  echo "Debes escribir un mensaje para el commit"
  exit 1
fi

echo "Estado actual:"
git status

echo "Agregando cambios..."
git add .

echo "Creando commit..."
git commit -m "$MSG" || echo "Sin cambios para commit"

echo "Subiendo a GitHub (rama master)..."
git push origin master

echo "Listo"