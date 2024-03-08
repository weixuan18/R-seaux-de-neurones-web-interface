# uvicorn main:app --reload

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fairseq.models.transformer import TransformerModel
import nltk
import json

# charger le modèle de traduction français-chinois
model_path = './fr-zh_20w/checkpoints/transformer_fr_zh_20w/'
checkpoint_file = 'checkpoint_best.pt'
model = TransformerModel.from_pretrained(model_path, checkpoint_file=checkpoint_file, data_name_or_path="../../data-bin/fr_zh_20w",cpu=True)


# charger les variables d'environnement à partir du fichier .env
_ = load_dotenv(find_dotenv())

# créer un client OpenAI 
client = OpenAI()  # Utiliser par défaut les variables d'environnement

# définir la fonction de tokenisation pour le français
def tokenize_french(text):
    return nltk.word_tokenize(text, language='french')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# définir les entrées et les sorties de l'API

class TranslationInput(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class textInput(BaseModel):
    text: str

class TranslationOutput(BaseModel):
    translated_text: str

# 1. Définir la fonction de traduction pour le modèle fairseq
def translationmymodel(input_text):
    output_text = model.translate(" ".join(tokenize_french(input_text)))
    output_text_no_space = output_text.replace(' ', '').strip()
    return output_text_no_space


@app.post("/translation_mymodel/", response_model=TranslationOutput)
async def translation_mymodel(input_data: textInput):
    return {"translated_text": translationmymodel(input_data.text)}

# 2. Définir la fonction de traduction pour le modèle OpenAI GPT-4
@app.post("/chatgpt4/", response_model=TranslationOutput)
async def translation_gpt4(input_data: TranslationInput):
    return {"translated_text": chatGPT4API(input_data.text,input_data.source_lang,input_data.target_lang)}

def chatGPT4API(text,sourcelang,targetlang):
    dict_lang = {
    "zh": "chinese",
    "en": "english",
    "fr": "french",
}
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"You will be provided with a sentence in {dict_lang[sourcelang]}, and your task is to translate it into {dict_lang[targetlang]}."
            },
            {
                "role": "user",
                "content": f"{text}"
            }
        ],
        temperature=0.7,
        max_tokens=64,
        top_p=1
    )
    return response.choices[0].message.content

#`3. Définir la fonction de traduction pour le modèle OpenAI GPT-3.5
def chatGPT3_5API(text,sourcelang,targetlang):
    dict_lang = {
    "zh": "chinese",
    "en": "english",
    "fr": "french",
}
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
            "role": "system",
            "content": f"You will be provided with a sentence in {dict_lang[sourcelang]}, and your task is to translate it into {dict_lang[targetlang]}."
            },
            {
            "role": "user",
            "content": f"{text}"
            }
        ],
            temperature=0.7,
            max_tokens=64,
            top_p=1
    )
    return response.choices[0].message.content





@app.post("/chatgpt3_5/", response_model=TranslationOutput)
async def translation_gpt3_5(input_data: TranslationInput):
    return {"translated_text": chatGPT3_5API(input_data.text,input_data.source_lang,input_data.target_lang)}

# uvicorn main:app --host 0.0.0.0 --port 8000
# curl -X 'POST' 'http://localhost:8000/translation_mymodel/' -H 'accept: application/json' -H 'Content-Type: application/json' -d '{"text": "Technologie de pointe pour la radiodiffusion par satellite."}