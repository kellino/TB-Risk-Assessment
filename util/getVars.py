#!usr/bin/env python
## simple python script to lift all the $scopes and vars from a .js file

import sys

fileString = str(sys.argv[1])

variables = []

def storeLine(line):
    variables.append(line)

f = None
try:
    f= open(fileString, 'r')
    for line in enumerate(f):
        print(line)
        if line.strip().startswith('$scope'):
            storeLine(line)

    print(len(variables))
except:
    print("error")
finally:
    if f != None:
        f.close()
