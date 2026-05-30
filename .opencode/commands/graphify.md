---
description: Build or query the knowledge graph
subtask: true
---

Hai il tool `skill` disponibile. Carica la skill graphify con `skill({ name: "graphify" })`.

Poi segui le istruzioni nella skill e nell'AGENTS.md per gestire il comando /graphify.

Se l'utente ha passato un argomento (es. `/graphify <path>` o `/graphify .`), usalo come percorso. Altrimenti, controlla se `graphify-out/graph.json` esiste già e offri le opzioni di query.
