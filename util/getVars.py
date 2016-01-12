#!usr/bin/env python
## simple python script to lift all the $scopes and vars from a .js file

import sys

fileString = str(sys.argv[1:])

f = None
try:
    f= open(fileString, 'r')
    for i, line in enumerate(f):
        print("reading line {}".format(i))
except:
    print("error")
finally:
    if f != None:
        f.close()
