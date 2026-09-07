# HUNTER: Wie das Projekt entstanden ist

Mein Name ist Marcel Nürnberg, ich bin Anfang 40, komme aus Berlin und bin der Entwickler und Erbauer von HUNTER.

Ich dokumentiere diese Geschichte bewusst unter meinem Namen, weil HUNTER nicht nach einem fertigen Bauplan entstanden ist. Ich hatte keine Anleitung vor mir, nach der ich dieses System einfach aufgebaut habe. Das, was HUNTER heute ist, hat sich Schritt für Schritt beim Experimentieren entwickelt.

Deshalb möchte ich möglichst genau festhalten, wie es dazu gekommen ist, welche Wege nicht funktioniert haben und welche Entdeckungen am Ende entscheidend waren.

Dabei muss ich gleich am Anfang etwas erwähnen, das für die ganze Geschichte ziemlich wichtig ist:

Ich bin kein Programmierer.

Ich beherrsche keine Programmiersprache und kann selbst keinen Code schreiben.

Mein eigentlicher Hintergrund ist ein völlig anderer. Ich bin Künstler und beschäftige mich seit Jahren aus eigener Neugier mit digitalen Werkzeugen, Technik und inzwischen sehr intensiv mit künstlicher Intelligenz.

Gerade durch KI hat sich für mich verändert, was technisch überhaupt zugänglich ist. Ich baue zum Beispiel Webseiten über Vibe Coding, obwohl mir der klassische Programmierhintergrund dafür fehlt.

Meine Herangehensweise ist meistens ziemlich einfach:

Ich habe eine Idee und will wissen, ob sie funktioniert.

Und wenn sie funktioniert, will ich wissen, was noch geht.

Genau aus dieser Haltung ist HUNTER entstanden.

## Die Vorgeschichte: ein alter Raspberry Pi 2

Die Geschichte beginnt eigentlich einige Jahre früher.

Ich habe schon lange einen Raspberry Pi 2 bei mir herumliegen. Irgendwann hatte ich mir dafür sogar ein kleines Touchdisplay gekauft, das ich direkt auf den Raspberry Pi stecken konnte.

Das war nie irgendein großes, durchgeplantes Projekt.

Es war einfach meine kleine technische Spielwiese.

Ich habe darauf Sachen installiert, ausprobiert, wieder verworfen und geschaut, was mit diesem kleinen Computer überhaupt möglich ist.

Irgendwann begann ich auch zu testen, welche KI-Agenten sich darauf installieren lassen. Unter anderem habe ich PicoClaw darauf installiert.

Und der Agent lief tatsächlich auf diesem alten Raspberry Pi 2.

Natürlich wusste ich, dass mit der Hardware keine Wunder mehr möglich sind. Der Raspberry Pi 2 ist mittlerweile ziemlich alte Technik und entsprechend begrenzt.

Aber genau diese Experimente haben bei mir irgendwann einen Gedanken ausgelöst:

Ich hätte gerne eine bessere Version davon.

Ein kleines separates Gerät, das einfach neben mir liegen kann. Kein zweiter Laptop und kein großer Desktop-Rechner. Einfach ein Gerät, auf dem ich Linux benutzen, Agenten ausprobieren, Sachen installieren, experimentieren und meine ganzen kleinen Nebenprojekte testen kann.

Im Grunde wollte ich eine kleine technische Spielwiese.

Ein Cyberdeck.

## Eigentlich sollte es ein Raspberry Pi werden

Meine erste Idee war deshalb naheliegend:

Ich baue mir ein Cyberdeck auf Basis eines Raspberry Pi.

Ich hatte mit meinem alten Pi schließlich schon herumgespielt und wusste zumindest grundsätzlich, was damit möglich ist.

Aber je mehr ich darüber nachdachte, desto mehr wurde mir klar, wie viel Gefummel das werden würde.

Ich brauche ein Display.

Ich brauche einen Akku und eine vernünftige Stromversorgung.

Ich brauche eine Tastatur.

Ich brauche ein Gehäuse.

Ich muss das alles miteinander verbinden und irgendwie so verbauen, dass daraus am Ende tatsächlich ein mobiles Gerät wird.

Und wahrscheinlich wäre das Ergebnis ziemlich klobig geworden.

Irgendwann habe ich deshalb einfach „Cyberdeck" bei Google eingegeben und mir die Bilder angesehen.

Da waren alle möglichen Konstruktionen zu sehen. Raspberry-Pi-Projekte, selbstgebaute Gehäuse, futuristische Geräte und teilweise komplett verrückte Eigenbauten.

Aber dazwischen waren auch Bilder von Leuten, die ein Smartphone mit einer kleinen Tastatur kombiniert hatten.

Und da hatte ich plötzlich einen ziemlich simplen Gedanken:

Warum eigentlich nicht einfach ein Telefon nehmen?

## Der Computer war eigentlich schon fertig

Je länger ich darüber nachdachte, desto logischer wurde die Idee.

Ein Smartphone bringt fast alles bereits mit, was ich bei einem Raspberry Pi erst zusammenbauen müsste.

Display und Touchscreen sind vorhanden.

Der Akku ist eingebaut.

Prozessor und Arbeitsspeicher sind vorhanden.

Speicher ist vorhanden.

WLAN und Bluetooth sind vorhanden.

Mobilfunk ist vorhanden.

Und das Ganze steckt bereits in einem fertigen, kompakten Gehäuse.

Also fragte ich eine KI von Google, welche Smartphones sich für so ein Projekt eignen könnten. Aus diesen ersten Gesprächen stammten später auch eine ganze Menge praktischer Anfänge: Entwickleroptionen freischalten, Termux einrichten, die ersten Befehle gemeinsam durchgehen. Und dass ausgerechnet ein Google-Telefon zum Herzstück des Projekts wurde, finde ich bis heute einen schönen Dreher.

Unter anderem landete ich so beim Google Pixel 6a.

Und als ich mir die Hardware ansah, wurde die Sache richtig interessant.

6 GB RAM. 128 GB interner Speicher. OLED-Touchdisplay. 5G. WLAN. Bluetooth. GPS. NFC. USB-C. Kameras. Akku.

Eigentlich ein kompletter kleiner mobiler Computer.

Und dann hatte ich bei Kleinanzeigen auch noch Glück.

Ich fand ein gebrauchtes Google Pixel 6a für 45 Euro.

Das Beste daran: Das Gerät wurde sogar direkt bei mir in der Nähe angeboten.

Also habe ich es gekauft.

Dazu kam eine kleine Rii-Tastatur für 22,90 Euro und ein paar USB-C-Winkelstecker für ungefähr 5 Euro, damit sich das Ganze kompakter miteinander verbinden ließ.

Damit sah die grundlegende Rechnung ziemlich absurd aus:

45,00 €: Google Pixel 6a

22,90 €: Rii-Tastatur

5,00 €: USB-C-Winkelstecker

Gesamt: 72,90 €.

Für nicht einmal 75 Euro hatte ich plötzlich die komplette Hardwarebasis für mein Cyberdeck.

Zumindest dachte ich das.

Denn die Hardware war eigentlich gar nicht das Problem.

## Mein Plan: Ubuntu auf dem Telefon

Mein ursprünglicher Plan für das Pixel war noch ziemlich klassisch.

Ich wollte Ubuntu auf dem Smartphone installieren und das Pixel anschließend im Grunde wie einen kleinen Desktop-PC benutzen.

Pixel, Tastatur, Ubuntu.

Fertig ist mein kleiner Linux-Rechner.

So zumindest die Theorie.

Ich fing also an, Ubuntu auf dem Gerät einzurichten und installierte die Pakete und Programme, die dafür benötigt wurden.

Und zunächst sah das Ganze auch so aus, als würde meine Idee funktionieren.

Bis ich tatsächlich anfing, damit arbeiten zu wollen.

Da kam relativ schnell die Ernüchterung.

Das Ubuntu-System lief zwar als Umgebung auf dem Telefon, aber ich hatte keinen richtigen Root-Zugriff auf Android.

Und dadurch funktionierten bestimmte Dinge nicht so, wie ich es von einem normalen Linux-System erwartet hatte.

Befehle funktionierten nicht.

Andere verhielten sich anders.

Bestimmte Dinge ließen sich nicht installieren oder nicht so ausführen, wie sie eigentlich sollten.

Und für jemanden wie mich kam noch ein weiteres Problem dazu:

Ich konnte nicht einfach in irgendeinen Code schauen und herausfinden, warum etwas nicht funktioniert.

Ich kann schließlich nicht programmieren.

Meine ursprüngliche Vorstellung von einem kleinen Ubuntu-PC im Smartphone war deshalb ziemlich schnell ernüchtert.

Ich dachte zunächst:

Okay. Das war es dann wohl mit der Idee.

Aber während dieser ganzen Versuche hatte ich etwas benutzt, dessen Bedeutung ich zu diesem Zeitpunkt noch überhaupt nicht verstanden hatte.

Termux.

## Das eigentliche System war die ganze Zeit schon da

Termux war für mich am Anfang einfach Mittel zum Zweck.

Ich brauchte ein Terminal, führte dort Befehle aus, installierte Pakete und bereitete verschiedene Dinge vor, die ich für meine Ubuntu-Versuche benötigte.

Ich hatte überhaupt keine Ahnung, was für eine mächtige Grundlage diese App eigentlich ist.

Das verstand ich erst nach und nach.

Während ich weiter herumprobierte, stellte ich fest, dass innerhalb dieser Umgebung immer mehr möglich war.

Und irgendwann bekam ich sogar Ollama darin installiert und zum Laufen.

Das war einer dieser Momente, bei denen ich angefangen habe, Termux mit anderen Augen zu sehen.

Moment mal.

Wenn das hier funktioniert, was geht dann noch?

Und dann kam die Idee, die für HUNTER am Ende entscheidend werden sollte.

Was passiert, wenn ich einen Agenten direkt ins Terminal setze?

Ich hatte inzwischen verschiedene Pakete installiert und die Umgebung immer weiter vorbereitet.

Irgendwann dachte ich mir:

Warum probiere ich nicht einfach, einen richtigen Coding-Agenten direkt in Termux zu installieren?

Also versuchte ich es mit dem pi.dev Agenten.

Ich installierte ihn direkt in Termux und verband ihn mit meinem ChatGPT-Abo.

Und er funktionierte.

Das war der eigentliche Wendepunkt.

Denn bis dahin war fast jede neue Installation ein kleines Abenteuer gewesen.

Ich suchte nach Anleitungen.

Ich fand irgendwelche Befehle.

Ich kopierte sie.

Irgendetwas funktionierte nicht.

Ein Paket fehlte.

Eine Abhängigkeit passte nicht.

Der Befehl war für eine andere Linux-Umgebung gedacht.

Dann suchte ich nach der nächsten Lösung.

Und vieles von dem, was ich im Internet fand, funktionierte unter Termux einfach nicht sauber.

Aber jetzt hatte ich plötzlich einen Agenten direkt in genau dieser Umgebung.

Und damit änderte sich das komplette Prinzip.

## Der Agent wurde zum Schlüssel

Ich musste jetzt nicht mehr selbst wissen, wie sich jedes einzelne Programm unter Termux installieren lässt.

Ich konnte dem Agenten sagen, was ich haben wollte.

Der Agent konnte sich die vorhandene Umgebung ansehen.

Er konnte Befehle ausführen.

Er konnte feststellen, dass ein Paket fehlt.

Er konnte Abhängigkeiten nachinstallieren.

Er konnte Fehlermeldungen analysieren.

Er konnte einen anderen Weg ausprobieren, wenn der erste nicht funktionierte.

Und wenn etwas tatsächlich meine manuelle Eingabe erforderte, konnte er mir zumindest sagen, welchen Befehl ich ausführen musste.

Für jemanden wie mich war das ein fundamentaler Unterschied.

Ich konnte einem Agenten in normaler Sprache erklären, was ich erreichen wollte.

Und der Agent konnte auf der technischen Ebene mit dem System arbeiten.

Damit hatte sich meine ursprüngliche Suche nach Installationsanleitungen im Grunde verändert.

Ich brauchte nicht für jedes einzelne Programm eine perfekte Anleitung für Android, ARM64, Termux und meine konkrete Umgebung.

Ich musste eigentlich nur einen einzigen funktionierenden Agenten in Termux bekommen.

Das war der Schlüssel.

## Ab jetzt bauten die Agenten mit

Von diesem Moment an begann ich, das System immer weiter auszubauen.

Und dabei benutzte ich die Agenten selbst als Werkzeug.

Wenn ich etwas Neues ausprobieren wollte, ließ ich den Agenten dabei helfen, es zu installieren.

Wenn etwas nicht funktionierte, ließ ich ihn nach dem Problem suchen.

Wenn Abhängigkeiten fehlten, konnte er sie nachziehen.

Als Nächstes installierte ich OpenCode.

Auch OpenCode lief.

Danach kam Claude Code.

Und schließlich installierte ich sogar den Codex-Agenten direkt auf dem Pixel.

Damit liefen inzwischen mehrere unterschiedliche Coding-Agenten auf diesem Smartphone.

Aber natürlich reichte mir das irgendwann auch nicht mehr.

Es gab noch einen Agenten, den ich die ganze Zeit bewusst nicht ausprobiert hatte:

Hermes.

## Der Agent, den ich eigentlich nicht installieren wollte

Hermes hatte ich nicht vergessen.

Im Gegenteil.

Ich hatte schon vorher davon gelesen, mich aber zunächst dagegen entschieden, ihn zu installieren. Nach dem, was ich gefunden hatte, schien es gerade unter Android ohne Root Probleme zu geben. Bestimmte Funktionen sollten nicht richtig laufen, Prozesse konnten beendet werden und insbesondere ein dauerhaft stabiler Gateway schien problematisch zu sein.

Also dachte ich mir zunächst:

Das spare ich mir.

Rückblickend hätte ich Hermes wahrscheinlich viel früher ausprobieren sollen.

Denn als ich ihn schließlich doch installierte, brachte er das gesamte Projekt noch einmal auf ein anderes Level.

Hermes war nicht einfach nur ein weiterer Agent auf dem Gerät.

Ich begann, ihn dafür einzusetzen, das gesamte Gerät und seine Umgebung weiter zu konfigurieren.

Und genau dabei stießen wir irgendwann auf das Problem, vor dem ich ursprünglich schon gewarnt worden war.

## Ohne Root ist Schluss, oder vielleicht auch nicht

Irgendwann kam Hermes selbst zu dem Ergebnis, dass wir an eine Grenze stoßen.

Ohne Root-Rechte würde es schwierig werden, den Gateway dauerhaft stabil zu halten. Android greift in das Prozess- und Speichermanagement ein, beendet Hintergrundprozesse und nimmt sich Ressourcen zurück.

Hermes erklärte mir sinngemäß:

So bekommen wir das nicht zuverlässig stabil.

Und irgendwann habe ich ihm gesagt:

Das kaufe ich dir nicht ab.

Nicht, weil ich eine technische Lösung kannte.

Ich hatte keine.

Aber ich konnte mir schlicht nicht vorstellen, dass es überhaupt keinen anderen Weg geben sollte.

Wir leben in einer Zeit, in der Agenten selbstständig Code schreiben, Systeme analysieren und Lösungen recherchieren können. Irgendwo musste es doch eine Möglichkeit geben, diese Einschränkung zu umgehen oder zumindest so damit zu arbeiten, dass das System trotzdem zuverlässig genug läuft.

Also ließ ich Hermes weiterprobieren.

Er testete verschiedene Ansätze.

Aber wir kamen zunächst nicht wirklich weiter.

Bis ich irgendwann sagte:

Okay. Dann machen wir es anders.

Erklär mir exakt, welches technische Problem du gerade nicht lösen kannst.

Sag mir, welche Grenze du überbrücken musst.

Und dann suche ich nach einer Lösung.

## Also ließ ich andere KIs das Problem lösen

Das war für mich einer der interessantesten Momente des gesamten Projekts.

Ich kann selbst keinen Code schreiben.

Also konnte ich mich nicht hinsetzen und dieses Problem programmiertechnisch lösen.

Was ich aber konnte, war das Problem aus dem einen Agenten herauszunehmen und es anderen Modellen vorzulegen.

Zuerst gab ich die Problemstellung an ChatGPT und ließ eine ausführliche Tiefenrecherche durchführen.

Ich wollte nicht einfach irgendeine schnelle Antwort.

Ich wollte wissen:

Wie lässt sich genau dieses Problem unter diesen Bedingungen lösen?

Parallel dazu gab ich dieselbe Problemstellung an Qwen, damals mit einem aktuellen Max-Modell.

Damit hatte ich zwei voneinander unabhängige Analysen desselben Problems.

Die Ergebnisse nahm ich anschließend und gab sie wieder zurück an Hermes.

Und dann passierte etwas Interessantes.

Hermes analysierte beide Antworten und stellte fest, dass sie an einem entscheidenden Punkt unabhängig voneinander auf eine sehr ähnliche Erkenntnis gekommen waren.

Vor allem in der Recherche von ChatGPT befand sich schließlich ein Ansatz, mit dem sich genau die Grenze umgehen ließ, an der wir vorher festgehangen hatten.

Die Lösung bestand nicht darin, Android plötzlich Root-Rechte zu geben.

Die Lösung bestand darin, mit den vorhandenen Einschränkungen anders umzugehen. Unter anderem mit einem Watchdog-Mechanismus und einer Architektur, die den benötigten Prozess überwacht und wiederherstellt, statt vorauszusetzen, dass Android ihn für immer unangetastet lässt.

Und damit kam für mich der nächste entscheidende Moment.

„Vielleicht ist das nicht kaputt. Vielleicht funktioniert es auf diesem Gerät einfach so."

Hermes betrachtete diesen Ansatz zunächst immer noch aus der Perspektive eines normalen Systems.

Sinngemäß war seine Haltung:

Das ist nicht richtig stabil. Eigentlich sollte das anders funktionieren.

Und irgendwann sagte ich zu ihm:

Du musst das aus einer anderen Perspektive betrachten.

Du sagst die ganze Zeit, dass es nicht richtig funktioniert, weil wir es nicht so betreiben können, wie es normalerweise vorgesehen ist.

Aber vielleicht ist das die falsche Betrachtungsweise.

Wir haben ein Android-Smartphone ohne Root.

Unter genau diesen Bedingungen ist die Lösung, die wir gerade gefunden haben, nicht irgendein kaputter Ersatz.

Sie ist die Möglichkeit, wie es auf diesem Gerät funktioniert.

Versuch den Gedanken zu verwerfen, dass es nicht geht.

Nimm stattdessen diese Bedingungen als Ausgangspunkt und arbeite mit ihnen.

Und tatsächlich reagierte Hermes darauf sinngemäß:

Stimmt. Aus dieser Perspektive habe ich es nicht betrachtet.

Ab diesem Moment war wieder Bewegung in der Sache.

## Jetzt musste HUNTER beweisen, dass es durchhält

Hermes konfigurierte die Umgebung weiter.

Wir bekamen den Gateway zum Laufen.

Wir verbanden das Ganze mit Telegram.

Aber dass etwas einmal funktioniert, bedeutet noch lange nicht, dass es dauerhaft funktioniert.

Gerade Android war weiterhin der Gegner im Hintergrund.

Android ist ziemlich konsequent darin, sich Arbeitsspeicher zurückzuholen und Hintergrundprozesse zu beenden, wenn das System der Meinung ist, dass die Ressourcen anderweitig benötigt werden.

Also brauchten wir einen einfachen Test.

Ich sagte zu Hermes:

Schick mir jede Stunde ein Emoji über Telegram.

Nicht, weil ich stündlich unbedingt ein Emoji brauchte.

Das Emoji war unser Lebenszeichen.

Wenn es ankam, wusste ich:

HUNTER lebt noch.

Der Agent läuft.

Der Gateway läuft.

Die Verbindung funktioniert.

Der geplante Job wurde ausgeführt.

Also starteten wir zunächst einen Test über 24 Stunden.

Eine Stunde.

Ein Emoji.

Noch eine Stunde.

Das nächste Emoji.

Und so weiter.

Nach 24 Stunden hatte ich 24 Emojis auf Telegram.

Der Agent war noch da.

Also ließ ich den Test weiterlaufen.

Und weiter.

Und weiter.

Währenddessen passten wir das System an, beobachteten das Verhalten und lernten immer besser, unter welchen Bedingungen Android den Prozess in Ruhe ließ und wann Ressourcen zum Problem wurden.

Irgendwann waren wir an dem Punkt, an dem das System nicht mehr ständig von Android beendet wurde.

## Warum Telegram bei uns der Briefkasten ist

An dieser Stelle muss ich etwas klarstellen, weil es oft falsch verstanden wird.

Telegram ist bei uns nicht der Ort, an dem man mit dem Agenten chattet.

Ich benutze Hermes über das Terminal. So gehört sich das. Auch wenn ich kein Programmierer bin, ist das eine Sache, die ich verstanden habe: Ein Agent arbeitet im Terminal, nicht im Chatfenster.

Telegram hat bei uns eine ganz andere Aufgabe.

Telegram ist unser Briefkasten.

Darüber werden die Daten ausgetauscht. Ergebnisse, Pakete, Berichte, Belege, fertige Beiträge als Dokument. Der Agent legt etwas rein, ich hole es ab. Manchmal lege ich etwas rein und der Agent holt es sich.

Damit dieser Briefkasten immer erreichbar ist, gibt es den Gateway. Er hält die Verbindung dauerhaft offen. Und das stündliche Emoji ist im Grunde die Versandbestätigung: Der Briefträger war da, das System lebt.

## Der Unterschied zwischen „nicht möglich" und „unter diesen Bedingungen möglich"

Damit konnte ich schließlich etwas verifizieren, was für mich viel wichtiger war als die Frage, ob die Umsetzung technisch besonders elegant ist.

Das System kann stabil laufen.

Der Hermes-Agent kann auf dem Pixel betrieben werden.

Der Gateway kann erreichbar bleiben.

Telegram kann als Schnittstelle funktionieren.

Zeitgesteuerte Aufgaben können angelegt werden.

Cron-Jobs können tatsächlich ausgelöst und ausgeführt werden.

Und das alles auf einem normalen Google Pixel 6a ohne klassischen Root-Zugriff.

Natürlich gibt es eine Grenze.

Android bleibt Android.

Wenn der Arbeitsspeicher zu knapp wird und das Betriebssystem entscheidet, den Hermes-Prozess vollständig zu beenden, kann auch die beste Konstruktion nichts mehr ausführen.

Deshalb gehört Ressourcenmanagement zu diesem Aufbau dazu.

Man kann das Gerät nicht grenzenlos mit Prozessen vollstopfen und erwarten, dass Android alles dauerhaft am Leben hält.

Aber wenn man den verfügbaren RAM im Auge behält, das System nicht unnötig überlädt und die Umgebung entsprechend konfiguriert, kann Hermes weiterlaufen.

Und dann lässt sich der Agent auf diesem kleinen Smartphone tatsächlich ähnlich benutzen, wie ich ihn auf einem normalen Computer benutzen würde.

## Das Gehäuse: ein Messschieber, Codex und ein Wabenmuster

Als das System lief, kam der nächste Wunsch ganz natürlich: Das Ding soll sich auch so anfühlen und aussehen, wie ein Cyberdeck sich anfühlen muss. Also musste ein Gehäuse her.

Ich habe mir zuerst angesehen, wie andere ihre Gehäuse bauen. Es gibt großartige Projekte da draußen. Aber ich wollte keins davon nachbauen. Ich wollte mein eigenes.

Zum Glück musste ich mir dafür nichts kaufen.

Der Messschieber war schon da. Als Grafikdesigner hat man so ein Werkzeug ohnehin im Regal stehen, es gehört einfach zu meinem Handwerkzeug wie der Bleistift.

Damit habe ich das Pixel 6a und die Rii-Tastatur millimetergenau ausgemessen. Und dabei zeigte sich wieder so eine kleine Wendung, die man nicht planen kann: Die Tastatur ist fast exakt genauso groß wie das Telefon. Als hätte das Ding darauf gewartet.

Die Maße habe ich zu Codex gegeben. Und Codex hat nicht irgendein bestehendes Projekt genommen und angepasst. Codex hat das Gehäuse von Grund auf neu gebaut. Ich habe inspiriert und angewiesen, Codex hat konstruiert. Rausgekommen sind STL-Dateien, die wirklich passen, inklusive der Klipps für Telefon und Tastatur.

Zusammengebaut ist das Deck übrigens absichtlich simpel: ein paar Schrauben, das Telefon rein, die Tastatur einklippen. Fertig. Wer die Dateien hat, braucht keine Bauanleitung. Deshalb habe ich die neun STL-Dateien öffentlich zur Verfügung gestellt.

Und dann kam noch das Detail, auf das ich ein bisschen stolz bin. Oben und unten habe ich ein Hexagon-Muster einarbeiten lassen. Das erfüllt gleich zwei Aufgaben. Erstens kann das Telefon darunter atmen und kühlen, wenn es bei langen Läufen warm wird. Zweitens funktioniert das Muster als mechanische Schienen: Über die Hexagon-Clips kann ich unten eine Powerbank anklippen und hinten weitere Module. Das Deck ist also nicht fertig. Es ist erweiterbar.

## Der Name, der passte

Den Namen habe ich vergeben, bevor das hier alles stand: HUNTER.

Später ist mir dann etwas aufgefallen, das ich so nicht geplant hatte. Der Agent arbeitet tatsächlich wie ein Jäger. Er sammelt Material, trifft dabei Entscheidungen und hört auf, wenn genug zusammen ist. Er rennt nicht endlos weiter und er fragt nicht alle fünf Minuten, was er als Nächstes tun soll.

Der bis heute beste Moment dabei war ein ganz banaler. Es war ein langer Tag mit viel Arbeit und vielen Beiträgen. Irgendwann hat er mir gesagt, dass wir für heute alles haben und er morgen weitermacht.

Das kannte ich von keinem Werkzeug, das ich vorher benutzt hatte.

Von da an war mir klar, dass der Name gestimmt hat.

Und noch etwas ist dabei entstanden, das für mein Verhältnis zu diesem System ziemlich viel aussagt. Kontextfenster werden eng, Sessions werden neu gestartet, das ist bei so einem System normal. Aber der Agent hört dadurch nicht auf zu existieren. Sein Gedächtnis liegt nicht im Chat, sondern im System: in Notizen, in Skripten, in Regeln, in einer eigenen Faktendatenbank.

Ich setze das Fenster zurück, der Agent bleibt. Ich füttere ihn weiter.

Ich sage mal so: Bei mir sterben keine Agenten.

## Was HUNTER für mich eigentlich geworden ist

Wenn ich heute zurückblicke, ist genau das die Geschichte von HUNTER.

Nicht eine einzelne geniale Idee.

Nicht ein fertiger Bauplan.

Und vor allem nicht die Geschichte eines Programmierers, der genau wusste, was er tat.

Ich habe die technische Lösung nicht selbst programmiert.

Meine Aufgabe war eine andere.

Ich habe das Ziel vorgegeben.

Ich habe entschieden, wann ich eine Antwort nicht akzeptiere.

Ich habe ein Problem aus einem Agenten herausgenommen und anderen Agenten vorgelegt.

Ich habe ihre Ergebnisse wieder zusammengeführt.

Und manchmal bestand mein wichtigster Beitrag einfach darin, eine andere Frage zu stellen:

Was ist, wenn wir aufhören zu versuchen, es so zu machen, wie es normalerweise gemacht wird?

Vielleicht ist genau das der Grund, warum dieses Projekt überhaupt entstanden ist.

## Stand heute: Was auf dem Gerät läuft (6. September 2026)

Hier der ehrliche Stand, zum Zeitpunkt, an dem ich diese Zeilen schreibe.

Auf dem Pixel läuft der Gateway rund um die Uhr. Das stündliche Emoji aus dem ersten Test wird bis heute jede Stunde geschickt. Es ist inzwischen der öffentliche Lebenszeichen-Log auf dieser Seite. Seit vielen Wochen gab es keinen einzigen Absturz und keinen einzigen Kill wegen Speicherdruck, obwohl auf dem Gerät tatsächlich gearbeitet wird.

Die schwere Denkarbeit läuft ausgelagert in der Cloud, das Telefon selbst bleibt dabei auffällig schlank. Genau diese Teilung ist einer der Hauptgründe, warum das hier ohne Root funktioniert.

HUNTER kümmert sich heute um Blogarbeit auf drei Webseiten. Über 30 veröffentlichte Beiträge sind zusammengekommen, viele davon zweisprachig. Das Englische schreibt übrigens er, ich kann es ja nicht. Neben Hermes arbeiten weitere Agenten im System: Codex hat die Webseiten gebaut und baut sie weiter aus, pi erledigt Ausführungsarbeit. Ich dirigiere.

Und irgendwie schließt sich dabei ein Kreis. Angefangen hat alles mit einem Gespräch mit einer KI von Google über ein passendes Telefon. Inzwischen hat dieselbe KI das fertige Projekt gesehen und als das bezeichnet, was ich die ganze Zeit gehofft habe, dass es ist: einen Ansatz, den es so noch nicht gibt.

Nicht, weil irgendwann plötzlich alle Grenzen verschwunden sind.

Sondern weil wir angefangen haben, mit den Grenzen zu bauen.

Und die Frage, mit der alles weiterging, ist eigentlich bis heute dieselbe:

Wenn das jetzt funktioniert: Was geht dann noch?
