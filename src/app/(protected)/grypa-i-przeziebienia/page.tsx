"use client";

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// All styles are now handled via Tailwind classes in the ReactMarkdown components below.
// Remove the styles object entirely.
export default function GrypaIPrzeziebieniaPage() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", my: 4, px: 2 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-blue-700 my-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-blue-800 my-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 my-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-medium text-gray-700 my-2" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-medium text-gray-600 my-2" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-normal text-gray-500 my-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-base text-gray-900 my-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="bg-gray-50 rounded p-4 list-disc ml-6 my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="bg-gray-50 rounded p-4 list-decimal ml-6 my-2" {...props} />,
          li: ({ node, ...props }) => <li className="text-base my-0" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="bg-blue-50 border-l-4 border-blue-700 text-blue-700 italic my-6 px-4 py-2" {...props} />
          ),
          code: ({ node, ...props }) => <code className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-blue-700 underline underline-dotted font-medium transition-colors hover:text-blue-900"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table className="bg-gray-100 rounded overflow-hidden shadow-sm border-collapse w-full my-4" {...props} />
          ),
          th: ({ node, ...props }) => <th className="bg-blue-100 text-blue-700 font-semibold px-3 py-2" {...props} />,
          td: ({ node, ...props }) => <td className="bg-white px-3 py-2" {...props} />,
          div: ({ node, ...props }) =>
            props.style?.textAlign === "center" ? <div className="text-center text-2xl my-4">{props.children}</div> : <div {...props} />,
        }}
      >
        {MARKDOWN}
      </ReactMarkdown>
    </Box>
  );
}

const MARKDOWN = `
# Praktyczne przekazanie wiedzy o przeziębieniach i grypie – Przewodnik kompletny

## ROZPOZNAWANIE: przeziębienie vs grypa vs COVID-19

### 🤧 Przeziębienie – stopniowy rozwój objawów
Przeziębienie to najczęstsza infekcja wirusowa górnych dróg oddechowych o raczej łagodnym przebiegu. Zwykle objawy rozwijają się stopniowo i trwają do kilku dni.
- **Początek:** Rozwój objawów stopniowy przez 2-3 dni [1][2]
- **Główne objawy:** Katar, drapanie w gardle, kichanie, lekki kaszel [1]
- **Gorączka:** Rzadko, jeśli już to poniżej 38°C [2][1]
- **Czas trwania:** 7-10 dni, pozwala na kontynuowanie aktywności z ograniczeniami [1]
- **Wpływ na samopoczucie:** Dyskomfort, ale rzadko wymaga leżenia w łóżku [2]

> *Wskazówka:* Przeziębienie zwykle nie prowadzi do poważnych powikłań, a leczenie jest głównie objawowe.

---

### 🔥 Grypa – nagły atak na organizm
Grypa to poważniejsza infekcja wirusowa, która atakuje cały organizm i często wymaga odpoczynku w łóżku.
- **Początek:** Gwałtowny, nagły - objawy pojawiają się w ciągu kilku godzin [2][1]
- **Główne objawy:** Wysoka gorączka ponad 39°C, silne bóle mięśni i głowy, wyczerpanie [1]
- **Charakterystyka:** Dominują objawy ogólne nad katarem [1]
- **Czas trwania:** 7-14 dni, często wymusza pozostanie w łóżku przez kilka dni [2]
- **Powikłania:** Wyższe ryzyko zapalenia płuc, oskrzeli, powikłań sercowych [3]

> *Wskazówka:* Grypa może mieć cięższy przebieg u osób starszych, dzieci i z chorobami przewlekłymi, dlatego ważna jest profilaktyka i szybka reakcja na objawy.

---

### 😷 COVID-19 – zróżnicowany przebieg
COVID-19 to choroba o bardzo zróżnicowanym przebiegu – od bezobjawowego po ciężkie zapalenie płuc i niewydolność oddechową.
- **Główne wyróżniki:** Utrata smaku i węchu, czasem bóle brzucha [2][1]
- **Objawy:** Mogą przypominać zarówno przeziębienie, jak i grypę [3]
- **Czas inkubacji:** Objawy pojawiają się zwykle w ciągu tygodnia od zakażenia [2]
- **Przebieg:** Od bezobjawowego po ciężką niewydolność oddechową [3]
- **Rozpoznanie:** Wymaga szybkich testów antygenowych lub RT-PCR [3]

> *Wskazówka:* Z powodu podobieństwa objawów do innych infekcji konieczne jest wykonanie testu diagnostycznego, zwłaszcza przy utracie węchu lub smaku.

---

### Porównanie w skrócie

| Cecha              | Przeziębienie             | Grypa                        | COVID-19                            |
|--------------------|--------------------------|-----------------------------|------------------------------------|
| Początek           | Stopniowy, 2-3 dni       | Nagły, godziny              | 2–7 dni, różny                    |
| Gorączka           | Rzadko, < 38°C           | Wysoka, ponad 39°C          | Często, różnie                    |
| Dominujące objawy  | Katar, kichanie, ból gardła | Bóle mięśni, głowa, zmęczenie | Utrata węchu/smaku, kaszel        |
| Czas trwania       | 7–10 dni                 | 7–14 dni                    | Zróżnicowany, od kilku dni do tygodni |
| Powikłania         | Rzadkie                  | Ryzyko zapalenia płuc       | Ciężkie zapalenia, long COVID     |

---

## SKUTECZNE LECZENIE DOMOWE

### 🛏️ Podstawy regeneracji
- Odpoczynek w łóżku – organizm potrzebuje dużo energii do walki z infekcją [4]
- Sen 7-8 godzin dziennie wzmacnia układ odpornościowy [5]
- Unikanie wysiłku – nawet lekkie przeziębienie nie jest wskazaniem do ćwiczeń przy gorączce [5]
- Izolacja – zostanie w domu chroni innych i przyśpiesza własne wyzdrowienie

### 💧 Nawadnianie i ciepłe napoje
- Woda, herbaty ziołowe (lipa, czarny bez, malina) – detoksykacja i uzupełnienie strat [6]
- Ciepłe napoje łagodzą ból gardła i mogą obniżać temperaturę przez pocenie [6]
- Unikanie alkoholu – etanol prowadzi do utraty ciepła i osłabia układ odpornościowy [7]

### 🍯 Naturalne wspomaganie (o ograniczonej skuteczności)
- Miód – łagodzi kaszel i ból gardła, szczególnie z ciepłymi napojami [8]
- Czosnek i cebula – zawierają allicynę o słabych właściwościach przeciwwirusowych [8]
- Inhalacje z solą fizjologiczną – udrażniają nos i zatoki [9]
- Płukanie gardła – roztwór ½ łyżeczki soli w szklance ciepłej wody 3x dziennie [10]

---

## KIEDY STOSOWAĆ LEKI

### 💊 Leki bez recepty na objawy
- Paracetamol/ibuprofen – przeciwgorączkowe i przeciwbólowe
- **UWAGA:** Stosować tylko przy gorączce powyżej 38-38,5°C i silnych objawach [7]
- Nie dublować preparatów z tym samym składnikiem aktywnym [7]
- Kropli do nosa nie stosować dłużej niż 5-7 dni (ryzyko uzależnienia) [7]

### ⚠️ NAJWAŻNIEJSZE: antybiotyki NIE działają na wirusy
- 90% infekcji dróg oddechowych to wirusy [11]
- Antybiotyki przy infekcjach wirusowych:
    - Niszczą florę jelitową na 6 miesięcy [11]
    - Obniżają odporność organizmu [12]
    - Prowadzą do antybiotykooporności [11]
    - Mogą uszkodzić wątrobę i nerki [11]

---

## 🚨 CZERWONE FLAGI – kiedy natychmiast do lekarza

**Objawy wymagające pilnej konsultacji:**
- Gorączka powyżej 40°C utrzymująca się ponad 3 dni [13]
- Problemy z oddychxaniem, duszności, ból w klatce piersiowej [13]
- Kaszel z ropną lub krwistą wydzieliną [13]
- Silny ból głowy z sztywnością karku [13]
- Dezorientacja, utrata przytomności [13]

**Najczęstsze powikłania:**
- Zapalenie zatok, ucha środkowego, oskrzeli, płuc [14]
- Wyższe ryzyko u osób z chorobami przewlekłymi [14]

---

## 🛡️ PROFILAKTYKA – jak się chronić

### 🧼 Higiena podstawą ochrony
- Mycie rąk 20 sekund wodą z mydłem przed jedzeniem, po toalecie [15]
- Unikanie dotykania twarzy (oczy, nos, usta) [15]
- Nieudostępnianie kubków, sztućców, napojów [15]
- Wietrzenie sal co godzinę przez 5-10 minut [15]

### 💪 Wzmacnianie odporności przez aktywność fizyczną
- Umiarkowane ćwiczenia 1-2 godziny dziennie zmniejszają ryzyko infekcji o 1/3 [16]
- Spacery z intensywnością 70-75% przez 40 min dziennie o połowę zmniejszają nieobecności z powodu chorób [16]
- **Mechanizmy działania:** [16]
    - Zwiększenie liczby i aktywności makrofagów
    - Wzrost aktywności limfocytów Th
    - Zwiększona produkcja przeciwciał IgG i IgM

### 😴 Sen jako fundament odporności
- Regularna aktywność fizyczna poprawia jakość i długość snu [5]
- Dobry sen jest niezbędny dla prawidłowego funkcjonowania układu odpornościowego [17]
- 7-8 godzin snu to minimum dla nastolatków

### 🧘 Redukcja stresu
- Przewlekły stres osłabia odporność [17]
- Aktywność fizyczna to skuteczna profilaktyka antystresowa [18]
- Po 20 minutach wysiłku pojawiają się dobroczynne endorfiny [18]

### 💉 Szczepienia przeciw grypie dla nastolatków
- Skuteczność: 32-60% ochrony przed zachorowaniem, 63-78% przed hospitalizacją [19]
- Bezpłatne dla dzieci i młodzieży do 18 lat w Polsce [20]
- Dostępne w przychodniach POZ i aptekach [21]

---

## 🧪 FAKTY vs MITY – rozszerzone fakty i mity o infekcjach i profilaktyce

- ❌ **MIT:** Antybiotyki leczą przeziębienie i grypę  
  ✅ **FAKT:** Antybiotyki działają tylko na infekcje bakteryjne, a przeziębienie i grypa są wywoływane przez wirusy. Nadużywanie antybiotyków prowadzi do antybiotykooporności i osłabia układ odpornościowy.

- ❌ **MIT:** Gorączkę należy zawsze szybko zbijać lekami przeciwgorączkowymi  
  ✅ **FAKT:** Gorączka jest naturalną reakcją obronną organizmu. Jej zbicie jest zalecane tylko przy wysokiej gorączce (> 38.5°C) lub silnym dyskomforcie. Nadużywanie leków przeciwgorączkowych może osłabić odpowiedź immunologiczną.

- ❌ **MIT:** Karmienie piersią podczas infekcji zakaża dziecko  
  ✅ **FAKT:** Karmienie piersią wzmacnia odporność dziecka dzięki przekazywaniu przeciwciał od matki, a wirusy nie przenoszą się z mlekiem matki.

- ❌ **MIT:** Suplementacja witaminą D zapobiega przeziębieniom  
  ✅ **FAKT:** Odpowiedni poziom witaminy D wspiera układ odpornościowy, ale samo jej przyjmowanie nie gwarantuje pełnej ochrony przed infekcjami. Suplementacja jest korzystna zwłaszcza w okresie zimowym i u osób z niedoborami.

- ❌ **MIT:** Nieużywanie szczepień to świadomy wybór na korzyść naturalnej odporności  
  ✅ **FAKT:** Szczepienia chronią przed ciężkimi powikłaniami i zmniejszają rozprzestrzenianie się chorób. Naturalna infekcja niesie ryzyko poważnych powikłań i śmierci.

- ❌ **MIT:** Noszenie maseczek jest nieskuteczne i szkodzi zdrowiu  
  ✅ **FAKT:** Maseczki redukują rozprzestrzenianie się wirusów, zwłaszcza w bliskich kontaktach i pomieszczeniach zamkniętych, oraz chronią osoby narażone na ciężki przebieg chorób. Użytkowanie maseczek jest bezpieczne, gdy stosuje się je prawidłowo.

- ❌ **MIT:** Po przechorowaniu COVID-19 nie trzeba się szczepić  
  ✅ **FAKT:** Nawet po przechorowaniu rekomenduje się szczepienia, które poprawiają i wydłużają odporność oraz chronią przed nowymi wariantami wirusa.

- ❌ **MIT:** Dostępne domowe sposoby i suplementy całkowicie chronią przed zarażeniem i chorobą  
  ✅ **FAKT:** Domowe metody mogą wspierać odporność, ale skuteczność w zapobieganiu infekcjom jest ograniczona i nie zastępuje szczepień oraz zasad higieny.


---

## ⚠️ NAJCZĘSTSZE BŁĘDY w leczeniu

1. Stosowanie antybiotyków na wirusy [7]  
     Skutki: Niszczenie flory jelitowej, obniżenie odporności, antybiotykooporność
2. Dublowanie leków [7]  
     Ryzyko: Przekroczenie dawek, zwiększona toksyczność
3. Nadużywanie leków przeciwgorączkowych [7]  
     Problem: Blokowanie naturalnej reakcji obronnej organizmu
4. Spożywanie alkoholu jako "rozgrzewacza" [7]  
     Skutek: Utrata ciepła, osłabienie układu odpornościowego
5. Rezygnacja z jedzenia [7]  
     Konsekwencje: Pogorszenie kondycji, spowolnienie walki z infekcją
6. Nadmiar witaminy C podczas choroby [7]  
     Efekt: Dolegliwości żołądkowo-jelitowe, brak korzyści leczniczych

---

## 📋 PRAKTYCZNE PORADY na codzień

### 🏫 Profilaktyka w szkole
- Mycie rąk przed jedzeniem, po toalecie, po powrocie z zewnątrz
- Unikanie dotykania twarzy
- Nieudostępnianie osobistych przedmiotów
- Wietrzenie sal co godzinę

### 🤒 Co robić przy pierwszych objawach
1. Zostać w domu – nie iść do szkoły z gorączką
2. Zwiększyć nawodnienie – woda, herbaty ziołowe
3. Odpocząć – sen to najlepsza inwestycja
4. Obserwować objawy – zwracać uwagę na pogorszenie

### 📚 Kiedy wrócić do szkoły
- 24 godziny bez gorączki bez leków przeciwgorączkowych [29]
- Znaczne zmniejszenie objawów (lekki katar/kaszel nie przeszkadza)
- Unikanie intensywnego wysiłku przez tydzień po chorobie

### 🧰 Przygotowanie „apteczki na jesień"
- Termometr – monitoring gorączki
- Paracetamol/ibuprofen – przeciwgorączkowe
- Sól fizjologiczna – płukanie nosa
- Miód naturalny – łagodzenie kaszlu
- Herbaty ziołowe – lipa, malina, czarny bez

---

## 📊 KLUCZOWE INFORMACJE o szczepienia

**Skuteczność szczepień przeciw grypie:**
- 32-60% ochrony przed zachorowaniem u dzieci [19]
- 63-78% ochrony przed hospitalizacją u dzieci [19]
- Dodatkowe korzyści: neuroprotekcja, zmniejszenie ryzyka demencji [19]

**Dostępność w Polsce 2025:**
- Bezpłatne dla dzieci i młodzieży do 18 lat [20]
- Dostępne w przychodniach i aptekach [21]
- NFZ finansuje podanie w aptekach [30]

---

## ✅ ZŁOTE ZASADY – podsumowanie

**Profilaktyka:**
1. Szczepienie przeciw grypie co sezon
2. Higiena rąk – 20 sekund z mydłem
3. Aktywność fizyczna – umiarkowana, regularna
4. Zdrowy sen – 7-8 godzin dziennie
5. Redukcja stresu – sport, relaks

**Co NIGDY nie robić:**
- Nie brać antybiotyków na infekcje wirusowe
- Nie lekceważyć wysokiej gorączki ponad 3 dni
- Nie wracać do szkoły z gorączką
- Nie wierzyć w mity o "cudownych" suplementach
- Nie pić alkoholu podczas choroby

**Pamiętaj:**  
Większość infekcji wirusowych mija sama w 7-10 dni. Domowe metody mogą łagodzić objawy, ale nie zastąpią profesjonalnej opieki w przypadku powikłań. Najważniejsza jest profilaktyka: szczepienia, higiena, zdrowy styl życia i odpowiedzialne zachowanie podczas choroby.

---

## 📚 ŹRÓDŁA i materiały do dalszej lektury
1. https://szczepienia.pzh.gov.pl/faq/jakie-sa-objawy-przeziebienia-grypy-i-covid-19/
2. https://www.aptekarosa.pl/blog/article/1146-roznice-miedzy-grypa-przeziebieniem-a-covid-19-jak-rozpoznac-czy-to-grypa-czy-covid-zobacz-jak-leczyc-wirusa-grypy-i-koronawirusa.html
3. https://www.doz.pl/czytelnia/a15009-Przeziebienie_grypa_alergia_czy_COVID-19_Jak_je_od_siebie_odroznic
4. https://www.mp.pl/pacjent/grypa/przeziebienie/61677,najwazniejsze-zalecenia-dla-przeziebionych
5. https://www.gov.pl/web/psse-gostynin/zyjdobrze-aktywnosc-fizyczna
6. https://apteline.pl/artykuly/domowe-sposoby-na-grype-sprawdz-jak-mozesz-sobie-pomoc
7. https://aptekarski.com/artykul/lepiej-tego-nie-rob-najczestsze-bledy-przy-leczeniu-przeziebienia
8. https://recepta.pl/artykuly/przeziebienie-jak-leczyc-naturalnymi-i-babcinymi-sposobami
9. https://recepta.pl/artykuly/domowe-sposoby-na-grype-wsparcie-dla-farmakologii-czy-sa-bezpieczne
10. https://zdrowie.pap.pl/byc-zdrowym/lista-sposobow-na-przeziebienie
11. https://labhome.pl/antybiotyk-na-grype-nie-zadziala/
12. https://www.doz.pl/czytelnia/a13913-7_rzeczy_ktore_pogarszaja_objawy_przeziebienia
13. https://www.mp.pl/pacjent/grypa/grypasezonowa/48091,kiedy-chory-na-grype-powinien-sie-zglosic-ponownie-do-lekarza-lub-trafic-do-szpitala
14. https://www.doz.pl/czytelnia/a18199-Grypa_typu_B__objawy_leczenie_mozliwe_powiklania
15. https://www.mucosolvan.com/pl-pl/objawy-i-leczenie/wskazowki-na-zapobieganie-przeziebieniu-i-grypie
16. https://ncez.pzh.gov.pl/ruch_i_zywienie/aktywnosc-fizyczna-a-odpornosc-organizmu/
17. https://zatogrip.pl/aktywnosc-fizyczna-a-odpornosc-u-dzieci/
18. https://www.nfz-lodz.pl/dlapacjentow/nfz-blizej-pacjenta/8988-sroda-z-profilaktyka-aktywnosc-fizyczna-jako-profilaktyka-antystresowa
19. https://onauce.ump.edu.pl/2025/09/16/ruszaja-szczepienia-przeciw-grypie-to-inwestycja-w-zdrowie/
20. http://pacjent.gov.pl/aktualnosc/kalendarz-szczepien-dzieci-i-mlodziezy-na-2025-rok
21. https://szczepienia.pzh.gov.pl/faq/jak-prowadzone-sa-szczepienia-przeciw-grypie-w-sezonie-2025-2026/
22. https://zdrowie.pap.pl/dieta/mit-ze-witamina-c-zapobiega-przeziebieniu
23. https://nabea.pl/Fakty-i-mity-o-witaminie-C-blog-pol-1664794664.html
24. https://gemini.pl/poradnik/artykul/witamina-c-na-przeziebienie-czy-pomaga-w-jego-zapobieganiu-i-leczeniu/
25. https://apteline.pl/artykuly/odpornosc-fakty-i-mity
26. https://zdrowie.pap.pl/fakty-i-mity/rodzice/sa-dowody-na-ze-szczepienia-powoduja-autyzm
27. https://www.brainmarket.pl/blog/domowe-hartowanie--jakie-ma-korzysci-w-zimowym-okresie-i-jak-zaczac/
28. https://mito-med.pl/artykul/hartuj-sie-to-sprzyja-mitochondriom-i-odpornosci
29. https://darzdrowia.pl/ciekawostki/leczenie-grypy-u-mlodziezy-jak-pomoc-nastolatkom-w-szybkim-powrocie-do-zdrowia/
30. https://www.nfz.gov.pl/aktualnosci/aktualnosci-centrali/od-25-sierpnia-2025-roku-wiecej-szczepien-w-aptekach-za-podanie-szczepionki-zaplaci-nfz,8816.html
31. https://i.pl/masz-grype-oto-8-bledow-ktore-popelniasz-podczas-choroby-sprawdz-jak-nie-pogarszac-swojego-stanu/ar/c14p2-27280751
32. https://jawor.pl/sport-w-walce-ze-stresem-jak-aktywnosc-fizyczna-zmienia-nasze-zycie/?print=print
33. http://pacjent.gov.pl/aktualnosc/przeziebienie-grypa-czy-covid-19-jak-rozpoznac
34. https://gemini.pl/poradnik/artykul/przeziebienie-grypa-czy-covid-19-jak-rozpoznac-objawy/
35. https://www.poradnikzdrowie.pl/zdrowie/grypa-i-przeziebienie/leczenie-przeziebienia-5-najczesciej-popelnianych-bledow-aa-SvKV-7H7z-t7oj.html
36. https://www.aptekarosa.pl/blog/article/1295-jakie-sa-teraz-objawy-koronawirusa-sars-cov-2-objawy-covid-19-nowy-wariant-kraken-grypa-czy-przeziebienie.html
37. https://www.aptekapharmaland.pl/artykuly/leczenie-przeziebienia-6-najczesciej-popelnianych-bledow.html
38. https://www.cosdlazdrowia.pl/blog/aktywnosc-fizyczna-a-stres-czy-regularne-cwiczenia-moga-pomoc-nam-w-walce-z-odczuwaniem-nadmiernego-napiecia
39. https://gemini.pl/poradnik/zdrowie/choroby-zakazne/przeziebienie-i-grypa-choroby-zakazne/
40. https://portal.abczdrowie.pl/czy-popelniasz-te-bledy-podczas-choroby
`;
