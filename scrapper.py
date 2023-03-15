import sys
from scrapper import WikiHow, search_wikihow

max_results = 1  # default for optional argument is 10
how_tos = search_wikihow(sys.argv[1], max_results)
assert len(how_tos) == 1
how_tos[0].print()
