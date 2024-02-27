const select = document.querySelector('.select');
const options_list = document.querySelector('.options-list');
const options = document.querySelectorAll('.option');
const sourceText = document.querySelector('.source-text');
const targetText = document.querySelector('.translated-text');

select.addEventListener('click', () => {
    options_list.classList.toggle('active');
    select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
});

options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach((option) => {option.classList.remove('selected')});
        let selectedTranslator = option.getAttribute('data-translator');
        select.setAttribute('data-selected-translator', selectedTranslator);
        select.querySelector("span").innerHTML = option.innerHTML;
        option.classList.add('selected');
        options_list.classList.toggle('active');
        select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");

    });
});

async function translateText() {
    let text = document.getElementById('source-text').value; 
    let sourceLanguage = document.getElementById('source-language').value; 
    let targetLanguage = document.getElementById('translated-language').value; 
    let translator = select.getAttribute('data-selected-translator'); 

    if (text.trim() === '') return; // Ne rien faire si le texte est vide

    switch (translator) {
        case 'LibreTranslate': 
            await callLibreTranslateAPI(text, sourceLanguage, targetLanguage);
            break;
        case 'DeepL':
            await callDeepLAPI(text, sourceLanguage, targetLanguage);
            break;
        default:
            console.log("Traducteur non supporté");
    }
}

async function callLibreTranslateAPI(text, sourceLanguage, targetLanguage) {
    try {
        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            body: JSON.stringify({
                q: text,
                source: sourceLanguage, 
                target: targetLanguage,
                format: "text",
                api_key: "" // Ajoutez la clé API si nécessaire
            }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        document.getElementById('translated-text').value = data.translatedText;
    } catch (error) {
        console.error('Erreur de traduction:', error);
    }
}

async function callDeepLAPI(text, sourceLanguage, targetLanguage) {
    try {
        const response = await fetch("https://api.deepl.com/v2/translate", {
            method: "POST",
            body: JSON.stringify({
                text: text,
                source_lang: sourceLanguage,
                target_lang: targetLanguage,
                auth_key: "" 
            }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        document.getElementById('translated-text').value = data.translations[0].text;
    } catch (error) {
        console.error('Erreur de traduction:', error);
    }
}

// function translateText(translator) {
//     let text = sourceText.value;
//     if (text.trim() === '') return; // Ne rien faire si le texte est vide

//     switch (translator) {
//         case 'libretranslate':
//             callLibreTranslateAPI(text);
//             break;
//         case 'deepl':
//             callLibreTranslateAPI(text);
//             break;
//         case 'trained':
//             // Appeler votre API de traducteur entraîné
//             break;
//         default:
//             console.log('Traducteur non reconnu');
//     }
// }

// function callLibreTranslateAPI(text) {
//     fetch(`https://libretranslate.com/translate?query=${encodeURIComponent(text)}`)
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('translated-text').value = data.translatedText; 
//     })
//     .catch(error => console.error('Erreur de traduction:', error));
// }

// function callDeepLAPI(text) {
//     // Remplacez URL_DE_DEEPL par l'URL réelle de l'API et VOTRE_CLE_API_DEEPL par votre clé API
//     fetch(`URL_DE_DEEPL?auth_key=VOTRE_CLE_API_DEEPL&text=${encodeURIComponent(text)}&target_lang=FR`) // Exemple avec le français comme langue cible
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('translated-text').value = data.translations[0].text;
//     })
//     .catch(error => console.error('Erreur de traduction:', error));
// }
