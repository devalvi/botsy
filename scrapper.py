import json
import sys
from scrapper import search_wikihow

how_tos = search_wikihow(sys.argv[1])[0]

for steps in how_tos.steps:
    # print(answer.summary)
    jsond = json.dumps({"image": steps.picture,"summary": steps.summary, "description": steps.description})
    print(jsond)
    # print(answer.title)
    # print(answer.intro)
    # print(answer.n_steps)

