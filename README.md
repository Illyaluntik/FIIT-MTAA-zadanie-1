# MTAA - Zadanie 1

## [Illia Lynnyk - github](https://github.com/Illyaluntik/FIIT-MTAA-zadanie-1)

### Riesenie

Na riešenie tejto úlohy som vybral knižnicu [sip.js](https://www.npmjs.com/package/sip) a jazyk JavaScript (Node.js). Knižnica sip.js poskytuje všetko potrebné na implementáciu požadovaných funkcionalít.

Ako prvý krok bolo potrebné naštartovať proxy, a vytvoriť handler pre požiadavky. Napríklad pre registráciu je potrebné uložiť nového účastníka aby pri volaní proxy server vedel skontrolovať či taký existuje. Následne som vytvoril handler pre ostatné príklady ako volanie, účastník neexistuje a podobne. Ďalším krokom bolo implementovať logger hovorov, ktorý ukladá kto komu kedy volal a zrušenie hovorov.

Proxy server sa spúšťa príkazom `node index.js` a vypíše IP adresu na ktorej pracuje.

Na testovanie svojeho riešenia som zvolil klienty Zoiper5, PortSIP UČ a Linphone. Každý z nich má svoje klady a zápory. Napríklad v Zoiper5 nie je možné realizovať video hovor (bez poplatku), preto niektoré funkcionality budú fungovať iba v konkrétnych klientoch.

### Rozsah povinných funkcionalít

- [Registrácia účastníka](./pcaps/register.pcap)
- [Vytočenie hovoru a zvonenie na druhej strane](./pcaps/call.pcap)
- [Prijatie hovoru druhou stranou, fungujúci hlasový hovor](./pcaps/cancel-accepted.pcap)
- Ukončenie hlasového hovoru ([prijatého](./pcaps/cancel-accepted.pcap) aj [neprijatého](./pcaps/cancel-not-accepted.pcap))

### Doplnkové funkcionality

- [Možnosť zrealizovať konferenčný hovor (aspoň 3 účastníci)](./pcaps/conference.pcap)
- Možnosť realizovať videohovor
- [Logovanie denníka hovorov](./logs/calls.log)
- [Úprava SIP stavových kódov (486 na Obsadene)](./pcaps/busy.pcap)
