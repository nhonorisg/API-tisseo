/** 
 * @author Honoris G. N.
 * @description
 * Application web permettant d'afficher les données publiées sur l'open data
 * de tisséo et accessible à partir d'une API REST.
 * les données récuperer dans cette application sont:
    * Tous les noms des stations desservis par Tisséo
    * les stations se trouvant sur une même ligne
    * Ainsi que les horaires de passages des navettes de la ligne. 
*/


const boutRecup = document.querySelector("button");
const section1 = document.querySelector("section");

// Ajout d'un événement au click du bouton 
boutRecup.addEventListener('click', () => {
    // initialisation de la requête
    const tisseoData = new XMLHttpRequest();    
    tisseoData.open("get", "https://api.tisseo.fr/v1/lines.json?key=a3732a1074e2403ce364ad6e71eb998cb");

    // fonction  de lecture d'état de la requête
    tisseoData.onreadystatechange = () => {
        // si l'état de reception de la requête est complet (1-> envoyer, 2-> en cours, 3-> ---, 4-> terminer)
        // et que le status http == 200 (requête réussi) 
        if (tisseoData.readyState === 4 && tisseoData.status === 200) {
            // parsing des données en json
            const donneesRendu = JSON.parse(tisseoData.responseText);
            // récupération des données dans l'array lines.line  
            const outPutDonnees = donneesRendu.lines.line;
            section1.innerHTML = " ";

            // parcours de l'array pour récupérer les noms des stations
            for (const Stations of outPutDonnees) {
                // Ajout des noms de stations sous forme d'une liste dans la section html  
                section1.innerHTML += "<ul><li>" + Stations.name + "</ul></li>";
            }

            const li1Stations = document.querySelectorAll("li");
            const section2 = document.querySelector("#sec2");
            

            // parcours de tous les éléménts li de la section1
            for (const valeurs of li1Stations) {
                // reparcours des derniers données pour accéder au nom et Id des stations
                for (const Stations of outPutDonnees) {
                    // écouteur d'événements au click des elts de la li
                    valeurs.addEventListener('click', () => {
                        // on vérifie à quel tour de boucle le contenu de la liste == au nom de l'arrêt
                        if (valeurs.innerHTML == Stations.name) {
                            // puis on lance la requête AJAX suivant l'id du nom de cet arrêt
                            fetch("https://api.tisseo.fr/v1/stop_points.json?key=a3732a1074e2403ce364ad6e71eb998cb&lineId="+Stations.id+"")
                            // parsing des données en json
                            .then(answer => answer.json())
                            // récupération des données dans l'array physicalStops.physicalStop
                            .then(Donnees => {
                                const stations2 = Donnees.physicalStops.physicalStop;
                                section2.innerHTML = "";

                                // parcours de données de la nouvelle api
                                for (const arret of stations2) {
                                    // Ajout des noms de stations sous forme d'une liste dans la section2 html
                                    section2.innerHTML += "<ul><li id='li2'>" + arret.name +"</ul></li>";
                                }

                                const li2Stations = document.querySelectorAll('#li2');
                                const section3 = document.querySelector("#sec3");

                                // parcours des éléments de la liste de la section 2
                                for (const lastStations of li2Stations) {
                                    // écouteur d'événements au click des elts de cette liste
                                    lastStations.addEventListener('click', () => {
                                        // On boucle encore une fois sur l'array l'array physicalStops.physicalStop
                                        for (const arrets of stations2) {
                                            // on vérifie à quel tour de boucle le contenu de la liste == au nom de l'arrêt
                                            if (lastStations.innerHTML === arrets.name) {
                                                // puis on lance la requête AJAX suivant l'id du nom de cet arrêt
                                                fetch("https://api.tisseo.fr/v1/stops_schedules.json?key=a3732a1074e2403ce364ad6e71eb998cb&stopPointId="+arrets.id+"")
                                                    // parsing des données en json
                                                    .then(dataParse => dataParse.json())
                                                    // on récupère les données dans l'array departures.departure
                                                    .then(receivedData => {
                                                        const stops = receivedData.departures.departure;
                                                        section3.innerHTML = " ";
                                                        // parcours de l'array departures.departure pour ajouter le contenu de
                                                        // dateTime dans notre page html
                                                        for (const timeInfo of stops) {
                                                            section3.innerHTML += "<ul><li>" + timeInfo.dateTime + "</ul></li>";
                                                        }
                                                    })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                
            }

        // Sinon erreur de connection au serveur
        } else if (tisseoData.status != 200) {
            console.log("erreur de chargement du serveur");
        }
    }
    tisseoData.send();
})