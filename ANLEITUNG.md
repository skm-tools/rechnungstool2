# Rechnungsvorlage SKM – Von der PWA zur Android-App (APK)

Dieses Paket enthält alles, was du brauchst, um aus dem Rechnungsformular
mit **pwabuilder.com** eine echte Android-App (APK/AAB) zu erzeugen.

## Inhalt des Pakets

    index.html               Das Rechnungsformular (inkl. aller Korrekturen)
    manifest.webmanifest     App-Manifest (Name, Farben, Icons)
    sw.js                    Service Worker (macht die App offline-fähig)
    icon-192.png             App-Icon 192 x 192
    icon-512.png             App-Icon 512 x 512
    icon-512-maskable.png    App-Icon für runde/angepasste Android-Icons

## Schritt 1: Dateien hosten (HTTPS ist Pflicht)

PWABuilder braucht eine öffentlich erreichbare HTTPS-Adresse.
Zwei kostenlose Wege:

**Variante A – Netlify (am einfachsten, ohne Konto testbar):**
1. https://app.netlify.com/drop öffnen
2. Diesen kompletten Ordner per Drag & Drop hineinziehen
3. Netlify zeigt dir sofort eine URL wie `https://xyz123.netlify.app`

**Variante B – GitHub Pages:**
1. Neues Repository anlegen, alle Dateien hochladen
2. In den Repository-Einstellungen unter "Pages" den Branch aktivieren
3. URL: `https://DEINNAME.github.io/REPONAME/`

**Kurztest:** Die URL auf einem Android-Handy in Chrome öffnen.
Chrome sollte nach kurzer Zeit "App installieren" anbieten –
dann ist die PWA korrekt eingerichtet.

## Schritt 2: APK mit PWABuilder erzeugen

1. https://www.pwabuilder.com öffnen
2. Deine URL aus Schritt 1 eingeben und "Start" klicken
3. PWABuilder prüft Manifest und Service Worker (sollte grün sein)
4. "Package for Stores" → **Android** wählen
5. Einstellungen:
   - Package ID: z. B. `de.skm.rechnung` (einmal festlegen, nie ändern!)
   - App name / Launcher name: "Rechnung SKM"
   - Signing key: "Create new" wählen – **die heruntergeladene
     Signatur-Datei (.keystore) und die Passwörter gut aufbewahren!**
     Ohne sie kannst du später keine Updates derselben App installieren.
6. Download – du erhältst eine ZIP mit:
   - `*.apk` → zum direkten Installieren auf Geräten
   - `*.aab` → falls du später in den Play Store willst

## Schritt 3: APK auf Geräten installieren

1. Die APK-Datei aufs Handy übertragen (z. B. per Downloads-Link, USB, Mail)
2. Antippen → Android fragt nach Erlaubnis für "Unbekannte Apps
   installieren" → für die jeweilige Quelle (z. B. "Dateien") erlauben
3. Installieren – fertig. Die App erscheint mit Icon im App-Drawer.

## Wichtig zu wissen

- **Die App lädt die Inhalte von deiner gehosteten URL** (Trusted Web
  Activity). Änderst du dort die `index.html`, bekommen alle installierten
  Apps das Update automatisch – du musst keine neue APK verteilen.
  Erhöhe dabei in `sw.js` die `CACHE_VERSION` (z. B. auf `...-v2`),
  damit der Offline-Cache erneuert wird.
- Beim ersten Start zeigt die App evtl. kurz eine Browser-Leiste
  ("running in Chrome"). Das verschwindet, wenn du die von PWABuilder
  angebotene `assetlinks.json` mit auf deinen Server legst
  (PWABuilder erklärt das im Download-Paket unter "next steps").
- Gespeicherte Vorschläge (IBAN, Steuernummer usw.) liegen im lokalen
  Speicher des Geräts und wandern nicht mit auf andere Geräte.
- Für den Play Store brauchst du ein Google-Play-Entwicklerkonto
  (einmalig 25 USD) und lädst dort die `.aab`-Datei hoch.

## Alternative ohne APK

Die gehostete Seite ist bereits eine vollwertige PWA: Nutzer können sie
direkt aus Chrome heraus über "Zum Startbildschirm hinzufügen" /
"App installieren" installieren – ohne APK, ohne unbekannte Quellen.
Für die Verteilung im Kollegenkreis reicht dafür ein Link.
