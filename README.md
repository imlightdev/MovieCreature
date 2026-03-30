# Movie Requests Dashboard

Dashboard di sola lettura per visualizzare le richieste film dal database Supabase.

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

Copia il file di esempio e inserisci le tue credenziali Supabase:

```bash
cp .env.local.example .env.local
```

Modifica `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Trovi questi valori nel pannello Supabase → Project Settings → API.

### 3. Avvia in sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

### 4. Build per produzione

```bash
npm run build
npm start
```

## Struttura

```
├── app/
│   ├── globals.css       # Stili globali e variabili CSS
│   ├── layout.tsx        # Layout root (font, metadata)
│   └── page.tsx          # Pagina principale (Server Component)
├── components/
│   ├── MovieTable.tsx    # Tabella richieste film
│   ├── StatCard.tsx      # Card statistiche
│   └── UsersGrid.tsx     # Griglia utenti
├── lib/
│   └── supabase.ts       # Client Supabase + tipi + fetch
└── .env.local.example    # Template variabili d'ambiente
```

## Note

- La pagina si aggiorna automaticamente ogni **60 secondi** (Next.js `revalidate`).
- I dati vengono caricati **lato server** (Server Component) per performance ottimale.
- Il campo `conductors.name` è una FK verso `users.id`, quindi il nome del conduttore viene risolto tramite join in memoria.
