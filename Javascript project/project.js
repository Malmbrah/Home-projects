// 1. Bruker skal legge inn penger GJORT!
// 2. Bruker skal velge hvor mange lines den skal vedde på GJORT!
// 3. Skal ta inn en mengde bet GJORT! 
// 4. Spin slot machine GJORT!
// 5. Se om bruker vant
// 6. Utbetale penger
// 7. Spill igjen

const prompt = require("prompt-sync")(); //Dette bruker jeg for å ta inn bruker-kommando

/* Hvordan slotmachinen skal se ut */
const ROWS = 3;
const COLS = 3;

/* Hvilke symboler som skal være med i slotmachinen. Dette er et objekt. */
const SYMBOLS_COUNT = {
    "A": 2, //Dette betyr at det er to A-symboler i slotmachinen.
    "B": 4,
    "C": 6,
    "D": 8
};

/* Tillegger verdi til hver av symbolene */
const SYMBOLS_VALUES = {
    "A": 5, //Dette betyr at brukerens bet vil femdobles
    "B": 4,
    "C": 3,
    "D": 2
};

/* Bruker legger inn penger */
const deposit = () => {
    while(true) {
        const mengdeDesposit = prompt("Legg inn antall penger: "); //Får kunden til å skrive inn og lagre det i variabel, blir lagret som string 
        let tallDeposit = parseFloat(mengdeDesposit); // Gjør om variabelen til float
        if (tallDeposit <= 0 || isNaN(tallDeposit)){ //Hvis tallet er negativt eller en string, da må bruker prøve igjen
            console.log("Feil depositummengde, prøv igjen: ");
        } else {
            return tallDeposit; //Hvis alt er good, returner tallet
        }
    }   
};

/* Bruker skal velge hvor mange linjer den skal vedde på */
const getNumberOfLines = () => {
    while(true) {
        const antallLinjer = prompt("Skriv inn hvor mange linjer du ønsker å vedde på (1-3): "); //Får kunden til å skrive inn og lagre det i variabel, blir lagret som string 
            let tallAntallLinjer = parseFloat(antallLinjer); // Gjør om variabelen til float
            if (tallAntallLinjer <= 0 || isNaN(tallAntallLinjer) || tallAntallLinjer > 3){ //Hvis tallet er negativt, over 3 eller en string, da må bruker prøve igjen
                console.log("Du må velge antallet mellom 1 og 3, prøv igjen: ");
            } else {
                return tallAntallLinjer; //Hvis alt er good, returner tallet
            }
        } 
};

/* Bruker skal velge hvor stort bet per linje den vil ha */
const getBet = (balance, antallLinjer) => {
    while(true) {
        const mengdeBet = prompt("Skriv inn hvor mye du vil vedde per linje: "); //Får kunden til å skrive inn og lagre det i variabel, blir lagret som string 
            let tallMengdeBet = parseFloat(mengdeBet); // Gjør om variabelen til float
            if (tallMengdeBet <= 0 || isNaN(tallMengdeBet) || tallMengdeBet > balance / antallLinjer){ //Man vedder bet per linje, saa maks kan være bet per linje
                console.log("Feil veddemengde, prøv igjen: ");
            } else {
                return tallMengdeBet; //Hvis alt er good, returner tallet
            }
        } 
};

/* Her skal vi spinne vår slotmachine */
const spin = () => {
    const symbols = []; //Lager en tom array
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {//Lager en for-loop som går gjennom. "symbols" er symbolene, "count" er antallet av symbolene 
        for(let i = 0; i < count; i++){ //Skal legge symbolene inn i symbols-arrayen. Må ikke overskride hvor mange symbols vi har. 
            symbols.push(symbol); //Her legger vi inn symbolene
        }
    }
    const ruller = []; //Lager en tom array 
    for (let i = 0; i < COLS; i++) { //For å få tak i symbolene vi er ute etter må vi først sjekke kolonne 
        ruller.push([]); //Dytter inn arrays
        const rulleSymboler = [...symbols]; //Vi kopierer symbols arrayen. Når vi skal velge et symbol, så skal symbolet bli borte. Men bare fra den reelen vi er i. Ikke fra total
        for(let j = 0; j < ROWS; j++){ //og så sjekke rad
            const tilfeldigIndeks = Math.floor(Math.random() * rulleSymboler.length); //Math.random() genererer et tall mellom 0 og 1. Så ganger vi det med hvor lang vår array er. Math.floor() runder ned tall.
            const valgtSymboler = rulleSymboler[tilfeldigIndeks]; //velger en tilfeldig indeks
            ruller[i].push(valgtSymboler); //Dytter symbolet inn i vår rulle
            rulleSymboler.splice(tilfeldigIndeks, 1); //fjerner det symbolet vi valgte ",1" betyr at vi fjerner et element
        }
    }
    return ruller;
};

/* Akkurat nå er vår "rader som gir premie" i kolonner. Vi må gjøre om vår matrise slik at vi får våre verdier inn i rader. Fordi vi skal gi ut premie basert
på rader, ikke kolonner. */
const transpose = (ruller) => {
    const rader = [];
    for(let i = 0; i < ROWS; i++){
        rader.push([]); //Vi må fylle opp vår "rader" med arrays.
        for(let j = 0; j < COLS; j++){
            rader[i].push(ruller[j][i]); //Vi skal dytte det verdien som finnes i [j][i] inn i rader. 
        }
    }
    return rader;
}

/* Ønsker å printe ut radene på en litt nice måte: A | B | C */
const printRader = (rader) => {
    for(const rad of rader) {  //Her går vi gjennom hver rad som en enhet. Altså et item
        let radStreng ="";
        for(const [i, symbol] of rad.entries()) { //Vi går gjennom våre individuelle rader. Først via indeks (i) og symbolet.
            radStreng += symbol; //Legger til symbolet vi finner
            if (i != rad.length-1) { //Hvis det er IKKE er den siste indeksen. 
                radStreng += " | "; //Legg til en sånn her
            }
        }
        console.log(radStreng);
    }
};

const getWinnings = (rader, bet, antallLinjer) => {
    let winnings = 0;

    for(let rad = 0; rad < antallLinjer; rad++) { //Hvis antallLinjer = 1, så sjekker vi bare rad 1 osv..
        const symbols = rader[rad];
        let alleLike = true;

        for(const symbol of symbols) { //Vi går gjennom alle symbolene vi har 
            if(symbol != symbols[0]) { //Vi sjekker symbolene opp mot det vi har, hvis de ikke er like så bryter vi ut av for-loopen
                alleLike = false;
                break;
            }
        }

        if(alleLike){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]; //Når alle er like så ser vi på første symbol, får verdien fra den og ganger den med veddingen
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while(true){ //Vi vil at spillet skal fortsette å gå
        console.log("Du har $" + balance + " på kontoen din."); //forteller hvor mye de har igjen
        const antallLinjer = getNumberOfLines(); //Spør om antall linjer
        const bet = getBet(balance, antallLinjer); //Spør om hvor mye de vil vedde
        balance -= bet * antallLinjer; //Oppdaterer balansen de har igjen
        const ruller = spin(); //Spinner maskinen
        const rader = transpose(ruller); //Fikser radene
        printRader(rader); //Printer radene
        const winnings = getWinnings(rader, bet, antallLinjer); //Hva de vinner
        balance += winnings; //Oppdaterer balansen hvis de har vunnet
        console.log("Du vant $" + winnings.toString() + " kroner");

        if(balance <= 0) { //Hvis balansen din blir 0 eller mindre enn null
            console.log("Du har ingen penger igjen! Spillet avsluttes. ")
            break;
        }

        const spillIgjen = prompt("Vil du spille igjen? (j/n): ");

        if(spillIgjen != "j") break;
    }
};

game(); 

