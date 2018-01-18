// Librairie pour écrire dans le système de fichier
const fs = require('fs');

// Librairie permettant de manipuler le navigateur Chrome HeadLess
const puppeteer = require('puppeteer');

// Librairie d'automatisation pour le navigateur Chrome HeadLess
const Nick = require('nickjs');

// Instance principale de NickJS
const nick = new Nick();

// L'URL de Bankin servant au Web Scraping
const url = 'https://web.bankin.com/challenge/index.html';

// const jquery = 'https://code.jquery.com/jquery-3.2.1.min.js';

/**
 * Fonction asynchrone permettant de scraper le contenu du tableau des transactions
 */
async function scrapeTransactions() {
    let scrapingComplete = false;

    // Tableau des transactions qui sert de résultat final
    let result = [];

    do {
        // Création d'un nouvel onglet
        const tab = await nick.newTab();

        // Accès à l'URL de manière asynchrone
        await tab.open(url);

        let tableExist = false;

        // La fonction 'evaluate' va permettre d'exécuter du code comme dans la console Chrome
        await tab.evaluate((arg, callback) => {
            // Variable globale de 'window' qui définit si le tableau doit apparaitre dans une 'iframe'
            window.hasiframe = false;

            // Fonction globale de 'window' qui permet de générer le tableau dans le DOM
            window.doGenerate();

            callback(null);
        });

        // Contrôler si l'élément 'table' est présent dans le DOM avant de continuer
        try {
            await tab.waitUntilVisible('table');
            tableExist = true;
        } catch(err) {
            // console.log(err);
            console.log(`L'élément 'table' n'a pas été trouvé dans le DOM !`);
        }

        if (tableExist) {
            // Injection de jQuery pour les sites qui ne le possède pas
            // await tab.inject(jquery);

            // À nouveau, la fonction 'evaluate' va permettrent d'éxecuter du code comme dans la console Chrome
            const parseTable = await tab.evaluate((arg, callback) => {
                let parsingComplete = false;

                // Tableau de transactions global
                let data = [];

                // Pas de départ pour l'affichage des transactions
                let offset = 0;

                /**
                 * Utilisation de jQuery pour parcourir le tableau des transactions.
                 * Parcours du tableau des transactions (par lots de 50), et enregistrement du résultat dans une variable locale, puis globale.
                 * Utilisation des variables globales présentes dans l'objet 'window' pour régénérer le tableau des transactions avec de nouvelles valeurs.
                 * Le tableau est reparcouru jusqu'à ce qu'aucune transaction ne soit trouvée.
                 * La boucle s'arrête alors, et le résultat global est sorti de la fonction 'evaluate'.
                 */
                do {
                    // Tableau de transactions local
                    const table = [];

                    // Constante contenant la liste des symboles des devises
                    const currencies = ['$', '€', '₡', '£', '₪', '₹', '¥', '₩', '₦', 'zł', '₲', '฿', '₴', '₫'];

                    // Parcours du tableau
                    $('table').each((index, element) => {
                        let header = {};
                    
                        // Parcours et enregistrement des en-têtes du tableau
                        $(element).find('th').each((index, element) => {
                            header[index] = $(element).text();
                        });
                    
                        // Parcours de chaque ligne du tableau
                        $(element).find('tr').each((index, element) => {
                            
                            // Exclusion des en-têtes du résultat
                            if ($(element).find('td').length) {
                                let row = {};

                                // Parcours de chaque cellule d'une ligne
                                $(element).find('td').each((index, element) => {
                                    let text = $(element).text();
                                    let currency = '';

                                    // Transformation du contenu de la cellule si un symbole de devise est présent
                                    for (let i = 0; i < text.length; i++) {
                                        if (currencies.indexOf(text.charAt(i)) > -1) {
                                            currency = text.charAt(i);
                                            text = text.replace(text.charAt(i), '');
                                            break;
                                        }
                                    }

                                    // Récupération du contenu de la cellule en fonction de son en-entête
                                    row[header[index]] = text;
                                    
                                    // Récupération du symbole de le devise
                                    if (currency.length > 0) {
                                        row['Currency'] = currency;
                                    }
                                });

                                // Enregistrement des valeurs de la ligne courante dans le résultat local
                                table.push(row);
                            }
                        });
                    });

                    // Il n'y a plus de transaction à parcourir
                    if (table.length === 0) {
                        parsingComplete = true;
                    } else {
                        // Ajout des transactions fraichement récupérées au reste des transactions déjà parcouru
                        data = data.concat(table);

                        // Incrémentation du pas de départ pour l'affichage des transactions
                        offset += 50;

                        // Mise à jour de la variable globale qui définit la valeur de départ des transactions
                        window.start = offset;
    
                        // Rééxécution de la fonction globale qui permet de régénérer le tableau dans le DOM
                        window.doGenerate();
                    }
                } while (!parsingComplete);
                
                // Permet de sortir le résultat du parsing du tableau de la fonction 'evaluate'
                callback(null, data);
            });
            
            // Récupération du résultat du scraping
            result = parseTable;

            scrapingComplete = true;
        }

        // Fermeture de l'onglet précédemment ouvert
        await tab.close();

    } while(!scrapingComplete);

    return result;
}

/**
 * Fonction permettant d'écrire un fichier JSON
 */
buildJson = (transactions) => {
    // Transformation du tableau des transactions au format JSON
    const json = JSON.stringify(transactions, null, 4);

    // Affichage du tableau des transactions dans la console
    // console.log(json);

    // Condition pour l'affichage
    const display = transactions.length > 1 ? 'transactions enregistrées' : 'transaction enregistrée';

    // Enregistrement des transactions dans un fichier JSON
    try {
        // Écriture du fichier 'bankin.json'
        fs.writeFileSync('bankin.json', json);
        console.log(`Web Scraping terminé !\n${transactions.length} ${display} dans le fichier 'bankin.json'.`);
    } catch(err) {
        console.log(err);
    }

    // Arrêt du processus NickJS
    nick.exit();
}

// Script principal exécuté par NodeJS
(async() => {
    // Initialisation du navigateur Chrome HeadLess
    const browser = await puppeteer.launch();

    // Affichage de la version du navigateur Chrome HeadLess
    console.log(await browser.version());

    // Fonction principale qui va scraper le tableau des transactions
    scrapeTransactions().then((result) => {

        // Enregistrement du résultat du scraping dans un fichier JSON
        buildJson(result);

        // Fermeture du navigateur Chrome HeadLess
        browser.close();
    }).catch((err) => {
        console.log(err);

        // Arrêt du processus Nick fatalement
        nick.exit(1);
    });
})();
