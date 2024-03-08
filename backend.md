# 1.1. Installation du fairseq

```bash
git clone https://github.com/pytorch/fairseq
cd fairseq
pip install --editable ./
```


# 1.2. Tokenisation

```bash
pip install jieba
pip install spacy
pip install nltk

python nltkdownload.py
```

# 2. Vectorisation des données

```bash
TEXT=/root/fr-zh/data
fairseq-preprocess \
    --source-lang fr --target-lang zh \
    --trainpref $TEXT/train --validpref $TEXT/valid --testpref $TEXT/test \
    --destdir /root/fr-zh/data-bin/fr_zh --thresholdtgt 0 --thresholdsrc 0 \
    --workers 10
```


# 3.1. Entraînement du modèle


```bash
data_dir=/root/fr-zh/data-bin/fr_zh 
checkpoint_dir=/root/fr-zh/checkpoints/transformer_fr_zh
tensorboard_dir=/root/fr-zh/tf-logs/transformer_fr_zh
CUDA_VISIBLE_DEVICES=0 fairseq-train /root/fr-zh/data-bin/fr_zh \
    --arch transformer_iwslt_de_en --share-decoder-input-output-embed \
    --encoder-layers 6 --decoder-layers 6 \
    --optimizer adam --adam-betas '(0.9,0.999)' --fp16 \
    --label-smoothing 0.0 --weight-decay 0.01 --dropout 0.1 \
    --lr-scheduler inverse_sqrt  --warmup-updates 10000   \
    --clip-norm 0.1 --lr 0.0005 --warmup-init-lr '1e-07' --stop-min-lr '1e-09' \
    --dropout 0.3 --weight-decay 0.0001 \
    --criterion label_smoothed_cross_entropy --label-smoothing 0.1 \
    --max-tokens 4096 --max-update 300000 \
    --eval-bleu \
    --eval-bleu-args '{"beam": 5, "max_len_a": 1.2, "max_len_b": 10}' \
    --eval-bleu-detok space \
    --seed 0 \
    --valid-subset valid \
    --validate-interval 1  --validate-interval-updates 10000 \
    --eval-bleu --eval-bleu-args '{"iter_decode_max_iter": 0, "iter_decode_with_beam": 1}' \
    --eval-bleu --eval-bleu-detok space --eval-bleu-remove-bpe --eval-bleu-print-samples --eval-tokenized-bleu \
    --best-checkpoint-metric bleu --maximize-best-checkpoint-metric \
    --save-interval 1  --save-interval-updates 10000  --keep-last-epochs 5 \
    --keep-best-checkpoints 5 \
    --save-dir ${checkpoint_dir} \
    --tensorboard-logdir ${tensorboard_dir} 
```

# 3.2. Inspecter le training par tensorboard

```bash
tensorboard --logdir=/root/fr-zh/tf-logs
```


# 4. Evaluation

```bash
fairseq-generate \
    data-bin/fconv_wmt_en_fr \
    --path /root/fr-zh/checkpoints/transformer_fr_zh/checkpoint_best.pt \
    --beam 5 --remove-bpe
```


# 5. Lancer fastapi

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

# 6. Requérir l'API

```bash
curl -X POST "http://localhost:8000/translate" -H "Content-Type: application/json" -d '{"text": "iv ) Technologie de pointe pour la radiodiffusion par satellite"}'
```