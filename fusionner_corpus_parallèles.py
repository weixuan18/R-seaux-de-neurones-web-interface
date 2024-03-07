
chemin_corpus_anglais = 'corpus-fr-en/TED2013.en-fr.en'
chemin_corpus_français = 'corpus-fr-en/TED2013.en-fr.fr'
chemin_sortie = 'corpus-fr-en/TED2013.en-fr.combined.txt'

# Ouvrir les fichiers pour la lecture et le fichier de sortie pour l'écriture
with open(chemin_corpus_anglais, 'r', encoding='utf-8') as file_en, \
     open(chemin_corpus_français, 'r', encoding='utf-8') as file_fr, \
     open(chemin_sortie, 'w', encoding='utf-8') as file_out:
    
    # Lire chaque fichier ligne par ligne
    for ligne_en, ligne_fr in zip(file_en, file_fr):
        # Supprimer les espaces de début et de fin
        ligne_en = ligne_en.strip()
        ligne_fr = ligne_fr.strip()
        
        # Écrire la ligne combinée dans le fichier de sortie
        # Ici, nous utilisons un tabulateur comme séparateur, mais vous pouvez choisir le vôtre
        file_out.write(f"{ligne_en}\t{ligne_fr}\n")
