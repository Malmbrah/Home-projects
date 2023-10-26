

const numbers = document.querySelectorAll('.numbers'); //Henter alle med numbers-klassen
const result = document.querySelector('.result span'); //Henter den første result span
const buttons = document.querySelectorAll('.calc_butt'); //Henter knappene fra html-koden og legger de i en liste

let currentInput = "";



buttons.forEach(button => { //forEach brukes for å iterere gjennom elementene i en liste. Så buttons er en liste med buttons
    button.addEventListener('click', () => { //Når den "hører" et klikk, gå inn 
        const buttonText = button.textContent; //Setter buttontekst til å være det som er "inni" button

        result.textContent += buttonText; //Dette er for å oppdatere "resultat"-skjermen når noe nytt blir lagt inn
        
        if(buttonText === 'AC') { //Hvis man trykker på AC så nullstilles currentInput
            currentInput = '';
            result.textContent = '';
        } else if(buttonText === '=') { //Hvis man trykker på "=" så evaluerer man uttrykket
            try {
                currentInput = eval(currentInput); 
            } catch (error){
                currentInput = 'Error';
            }
            result.textContent = currentInput; //Setter "resultat"-skjermen som hva enn man får
            
        } else if(buttonText === "+/-"){ 
           currentInput = parseFloat(currentInput) * (-1); //Dette endrer fortegn
           result.textContent = currentInput; //Oppdaterer resultat-skjermen
        } 

        else {
            currentInput += buttonText;
            result.textContent = currentInput;
        }
    })
});