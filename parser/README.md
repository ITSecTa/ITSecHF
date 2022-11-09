# CAFF Parser

Ez a modul végzi a CAFF fájlok beolvasását és az előnézet generálását. A megadott .caff fájl első képkockájából elkészít egy böngészők által is megjeleníthető 24-bites bitmap előnézet képet. Az előnézet biztonságos előállításáért egy alapvető, ehhez szükséges integritási ellenőrzést is elvégez. 

## Build

A program buildeléséhez cmake >=3.16 verzió szükséges. A programot MinGW 12.2.0 fordítóval teszteltük. A program a következőképpen buildelhető:

`cmake CMakeLists.txt && make`

## Használat

A program parancssorból használható:

`parser [input_path] [output_path]`

Az `input_path` a feldolgozandó .caff fájl elérési útvonala. Az `output_path` opcionális paraméter a kimeneti bitmap fájl útvonala, ha ez nincs megadva akkor ez alapértelmezetten `output.bmp` lesz.

## Köszönetnyílvánítás

A bitmap kép előállításához [Arash Partow C++ Bitmap Library](https://www.partow.net/programming/bitmap/index.html) könyvtárát használjuk.