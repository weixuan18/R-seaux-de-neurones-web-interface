// require('dotenv').config();
// const axios = require('axios');


// const express = require('express');
// const fetch = require('node-fetch'); // Assurez-vous d'installer node-fetch si vous utilisez Node.js 16 ou inférieur
// const app = express();
// const port = 3000;

const dotenv = require('dotenv');
dotenv.config();

const select = document.querySelector('.select-menu');
const options_list = document.querySelector('select');
const options = document.querySelectorAll('option');
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
    // let translator = select.getAttribute('option');
    let translator = document.getElementById('translator').value; 

    // let translator = document.getElementById('translator').value; 

    if (text.trim() === '') return; // Ne rien faire si le texte est vide

    switch (translator) {
        case 'chatgpt': 
            await callChatGPTAPI(text, sourceLanguage, targetLanguage);
            break;
        case 'deepl':
            await callDeepLAPI(text, sourceLanguage, targetLanguage);
            break;
        default:
            console.log("Traducteur non supporté");
    }
}


async function callChatGPTAPI(text, sourceLanguage, targetLanguage) {
    // const apiKey = process.env.OPENAI_API_KEY; 
    const apiKey = 'sk-ydqMlMuMQ9bzPEzIJTZZzVrwYNoqRfsyjFi2Z6tDGq67l17V';
    // const baseURL = process.env.OPENAI_API_BASE_URL;
    const baseURL = 'https://api.fe8.cn/vi';
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${text}`;

    try {
        const response = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", 
                messages :[{role: "system", content: prompt}],
                temperature: 0.5,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        return data.choices[0].message.content; 
    } catch (error) {
        console.error('Erreur lors de l’appel à ChatGPT API:', error);
    }
}



async function callDeepLAPI(text, sourceLanguage, targetLanguage) {
    try {
        const params = new URLSearchParams();
        params.append("text", text);
        params.append("source_lang", sourceLanguage.toUpperCase());
        params.append("target_lang", targetLanguage.toUpperCase());
        params.append("auth_key", "3b2300ef-5ffd-4bb7-a6a4-6cd0461aac46:fx"); 

        const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            body: params,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
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
