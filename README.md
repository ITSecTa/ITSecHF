# ITSecHF

Ez a BME Számítógép-biztonság (VIHIMA06) tárgy ITSecTa csapatának repója.

Dokumentáció: [A projekt wikijén](https://github.com/ITSecTa/ITSecHF/wiki/1.-ITSec-(VIHIMA06)-HF-Dokument%C3%A1ci%C3%B3)

Tesztelési dokumentáció: [A projekt wikijén](https://github.com/ITSecTa/ITSecHF/wiki/5.-Tesztel%C3%A9si-dokument%C3%A1ci%C3%B3)

## Telepítési útmutató

### MongoDB beüzemelése:

Az applikáció MongoDB adatbázist használ. A MongoDB szervert a localhost:27017 porton futtatva hozzunk létre egy `itsecta` nevű adatbázist, és abban egy `caff` és egy `user` gyűjteményt.

### Natív 

A natív rész fordításához lásd a [megfelelő](https://github.com/ITSecTa/ITSecHF/blob/main/parser/README.md) leírást.

### Backend indítása:

0) Navigáljunk a `backend\` mappába.
1) Hozzunk létre egy .env fájlt és seedeljük a TOKEN_SECRET környezeti változót a .env.example alapján.
2) Adjuk ki az `npm install` parancsot.
3) Adjuk ki a `source .env` parancsot.
4) Az `npm run start` paranccsal a szerver a 8080-as porton elindul.

### Frontend indítása:

0) Navigáljunk a `frontend\itsec-frontend\` mappába.
1) Adjuk ki az `npm install` parancsot.
2) Az `set HTTPS=true&&npm start` (windows) vagy a `HTTPS=true npm start` (unix) paranccsal a frontend elindul HTTPS módban a 3000-es porton elindul.
