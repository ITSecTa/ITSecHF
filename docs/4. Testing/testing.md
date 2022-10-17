[](https://github.com/ITSecTa/ITSecHF/wiki/4.-Tesztel%C3%A9si-terv)


# Tesztelési terv

## Tesztelési terv hatóköre, célja

A tesztelési terv célja, hogy az elvárt követelményeknek megfelelő alkalmazás készüljön el, különös tekintettel a biztonságra. 

## Szükséges errőforrások

A csapatban mindenki részt fog venni a tesztelés valamelyik szakaszában.

## Tesztelési terv

### Unit tesztek 

Felelős: Egy osztályhoz/egységhez tartozó teszteket az implementálja aki az osztályt. A unit teszteket pair programmingban írjuk meg egy adott egység elkészülése után és a többi csapattag reviewzza az elkészült teszteket.  

Eszközök: 
Nativ - C/C++ :  CTest, Microsoft Unit Testing Framework for C++, https://learn.microsoft.com/en-us/visualstudio/test/writing-unit-tests-for-c-cpp?view=vs-2022 

Backend - Typescript: jest https://jestjs.io/ 

Frontend - React: React Testing Library https://testing-library.com/docs/react-testing-library/intro/ 

### Integrációs teszt 

Framework: jest 
Az integrációs teszteket akkor írjuk meg amikor a komponensek elkészültek és le tudjuk tesztelni, hogy együtt is működnek az elvárt módon. 

### Funkcionális teszt

### Biztonsági teszt 

- Coding standard kiválasztása: C++: MISRA?! Typescript:  https://www.breword.com/basarat-typescript-book/styleguide ? 
- Coding standard betartásához statikus elemző: SpotBugs (Java) SonarQube(C++, Java)
- Natív CAFF parser dinamikus tesztelése:  Valgrind  https://www.google.com/search?client=firefox-b-d&q=Valgrind 
