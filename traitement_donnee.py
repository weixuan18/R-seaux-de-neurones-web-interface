import jieba
import spacy
import pandas as pd
from tqdm import tqdm
from sklearn.model_selection import train_test_split
from langdetect import detect
import nltk
import pandas as pd
from langdetect import detect
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
from tqdm import tqdm
import numpy as np
import torch

print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))

# 读取CSV文件
df = pd.read_csv('./fr_zh_500000.csv')

# 从读取的数据中随机抽取50万条数据
df_sampled = df.sample(n=500000, random_state=42)  # 设置随机种子以确保结果的可重复性

# 分词函数
def tokenize_fr(text):
    # 这里可以根据实际情况选择使用不同的分词工具
    # 此处仅作示例，使用空格分词
    return text.split()

def tokenize_zh(text):
    # 使用jieba进行中文分词
    return jieba.lcut(text)

# 定义函数，检查文本是否包含韩语
def contains_korean(text):
    try:
        if detect(text) == 'ko':
            return True
        else:
            return False
    except:
        # 某些文本可能无法识别语言，这种情况下我们默认不包含韩语
        return False

    
# 定义 jieba 分词函数
def jieba_tokenize(text):
    tokens = jieba.lcut(text)
    return tokens

# 定义 SpaCy 分词函数
def spacy_tokenize(text):
    nlp = spacy.load("fr_core_news_sm")
    doc = nlp(text)
    tokens = [token.text for token in doc]
    return tokens

# 定义函数，对法语文本进行分词
def tokenize_french(text):
    return nltk.word_tokenize(text, language='french')

# 初始化删除计数器
deleted_count = 0

# 检查 'zh' 列中每行的文本是否包含韩语，如果是，则删除该行，并增加计数器
for index, row in tqdm(df.iterrows()):
    if contains_korean(row['zh']):
        df.drop(index, inplace=True)
        deleted_count += 1

# 打印删除的行数
print("删除了 {} 条数据。".format(deleted_count)) 


nltk.download('punkt')
# 对中文文本进行分词，并添加进度条
tqdm.pandas()
df['zh_tokens'] = df['zh'].progress_apply(jieba_tokenize)

# 对法语文本进行分词，并添加进度条
tqdm.pandas()
df['fr_tokens'] = df['fr'].progress_apply(tokenize_french)

# 切割数据集
train_df, temp_df = train_test_split(df, test_size=0.2, random_state=42)
valid_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)

# 将分词后的结果保存到文本文件中
with open('./data/train.fr', 'w', encoding='utf-8') as f:
    for tokens in train_df['fr_tokens']:
        f.write(' '.join(tokens) + '\n')

with open('./data/train.zh', 'w', encoding='utf-8') as f:
    for tokens in train_df['zh_tokens']:
        f.write(' '.join(tokens) + '\n')

with open('./data/valid.fr', 'w', encoding='utf-8') as f:
    for tokens in valid_df['fr_tokens']:
        f.write(' '.join(tokens) + '\n')

with open('./data/valid.zh', 'w', encoding='utf-8') as f:
    for tokens in valid_df['zh_tokens']:
        f.write(' '.join(tokens) + '\n')

with open('./data/test.fr', 'w', encoding='utf-8') as f:
    for tokens in test_df['fr_tokens']:
        f.write(' '.join(tokens) + '\n')

with open('./data/test.zh', 'w', encoding='utf-8') as f:
    for tokens in test_df['zh_tokens']:
        f.write(' '.join(tokens) + '\n')

