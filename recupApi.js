/* association d'un event au bouton */
const boutRecup = document.querySelector("button");

// Ajout d'un événement au click du bouton 
boutRecup.addEventListener('click', () => {
    //alert("API Tisséo")   test d'affichage d'un alert
    const tisseoData = new XMLHttpRequest();   // lancement de la requête 
    tisseoData.open("get", "https://api.tisseo.fr/v1/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb");

    tisseoData.onreadystatechange = () => {
        if (tisseoData.readyState === 4 && tisseoData.status === 200) {
            //const donneeRetour = JSON.parse(tisseoData.responseText);
            //const outPutDonnees = donneeRetour.resultats;  rendu Undefiened
            corpsPage = document.querySelector("section");  
            corpsPage.innerHTML = tisseoData.responseText;
            console.log(tisseoData.responseText);
        } else if (tisseoData.status != 200) {
            console.log("erreur");
        }
    }
    tisseoData.send();
})