# Réseaux-de-neurones-web-interface
Projet de la traduction automatique en utilisant le transformer `fairseq` dans le cadre du cours du réseau de neurone et du web interfance.

Contact:
[<xinhao.zhang@sorbonne-nouvelle.fr>](mailto:xinhao.zhang@sorbonne-nouvelle.fr) 
[<weixuan.cheng@sorbonne-nouvelle.fr>](mailto:weixuan.cheng@sorbonne-nouvelle.fr)

## Étapes : 
1. Établir un corpus parallèle bilingue (chinois-français / anglais français)
2. Prétraitement des données (nettoyage, tokenisation)
3. Entraînement du modèle fairseq(avec 150,000 paires de phrases)
4. Fine-tuné avec les données de chatgpt(Augmentation des données)
5. Évaluation tant quatitative que qualitative 
7. Déploiement - Web interface (avec `FastAPI`)


### Corpus d'entraînement
URL de téléchargement : https://conferences.unite.un.org/uncorpus/Home/DownloadOverview 

Possiblité de retrouver sur huggingface: https://huggingface.co/datasets/un_pc/viewer/fr-zh

### Développement et Test

1. créer un environnement virtuel 
2. installer les dépendances pour notre modèle et le déploiement
```console
pip install -U -r requirements.txt
```
3. Démarrer l'API activé localement
```console
uvicorn main:app --reload
```
4. Se diriger vers [notre site web]( https://weixuan18.github.io/Reseaux-de-neurones-web-interface/) 

## Remerciement

Grand Merci à notre tuteur de nous mettre à disposition le GPU du serveur de lattice pour entraîner le modèle de traductique pour ce projet.