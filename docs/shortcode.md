# Shortcode

RemindMe stellt den `[remind-me]` Shortcode zur Verfügung, um ein Anmeldeformular auf Ihrer Seite
einzurichten. Hier werden wir nicht auf den Nutzen und Aufbau des Anmeldeformulares eingehen. Mehr
Information dazu finden Sie unter: [Gutenberg Block](block.md).

Der `[remind-me]` Shortcode fügt ein Anmeldeformular ein. Mit zwei Optionen können Sie dieses
Formular weiter anpassen:

- `title`: Gibt den Titel des Formulars wieder
- `events`: Liste der Ereignisse, welche über das Formular abonnierbar sein sollen (im Format `[1,2,3]`)

#### Beispiel

Sie wollen ein Anmeldeformular mit dem Title `Anmeldung` und den Ereignissen mit den IDs `2, 3 & 5` anbieten.
Der Shortcode hätten dann folgende Form:

`[remind-me title='Anmeldung' events='[2,3,5]']`

Wenn Sie den Shortcode nicht selbst erstellen möchten, können Sie unter `Reminder` => `Ereignisse` die gewünschten 
Ereignisse auswählen und den Shortcode oben rechts einfach kopieren.