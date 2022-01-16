# -*- coding: utf-8 -*-
"""
Created on Sat Jan 15 13:58:05 2022

@author: Lorre
"""
from pathlib import Path 
import pandas as pd
import json

# create jsons with metadata & named with hex code
# {
#     "description": "A Monkey", 
#     "external_url": "https://gesqofutph1n.usemoralis.com/Monkey.png", 
#     "image": "https://gesqofutph1n.usemoralis.com/Monkey.png", 
#     "name": "Test NFT 0"
#   }
# "0000000000000000000000000000000000000000000000000000000000000001.json"

# create json function
def gen_json(row, int_flag=True):
    dict_json = {}
    img_path = Path(row['img_name'])
    filename = img_path.name
    dict_json["description"] = row['meta_description']
    if int_flag:
        dict_json["external_url"] = f"https://gesqofutph1n.usemoralis.com/{filename}"
    else:
        dict_json["external_url"] = f"gdrive/{filename}"
    dict_json["image"] = f"https://gesqofutph1n.usemoralis.com/{filename}"	
    dict_json["name"] = row['meta_name']
    return(dict_json)
    

# read in gan_image_metadata.xlsx & fill in json
dir1 = Path(r"C:\Users\Lorre\Documents\Python Projects\fastapi")
gan_image_metadata = pd.read_excel(dir1/"gan_image_metadata.xlsx", index=False)

count = 0
for _,row in gan_image_metadata.iterrows():
    dict_json = gen_json(row)
    json_name = f'{count:064d}'  # generate json name
    # write json
    with open(f"{dir1}/{json_name}.json", "w") as write_file:
        json.dump(dict_json, write_file)
    count+=1


