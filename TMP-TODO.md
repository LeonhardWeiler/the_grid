2.

Cooldown reconnect abuse fixen.

Noch besser später

Wenn du irgendwann:

Accounts
Sessions
Cookies

machst:

Dann server-generated IDs.

Aber für ein minimalistisches Grid reicht:

clientID + IP fallback

vollkommen.

Warum das trotzdem noch nicht perfekt ist

Aktuell wächst:

lastAction map[string]int64

unendlich.

Denn IDs werden nie entfernt.

ABER:

Das ist momentan okay.

Weil:

klein
nur timestamps
viel weniger kritisch als event growth

3.

Write timeout hinzufügen.

4.

Dann Event Ring Buffer implementieren.

Das ist der perfekte nächste große Schritt.
