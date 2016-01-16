#!usr/bin/env python
## simple python script to lift all the $scopes and vars from a .js file

import sys
import re

fileString = str(sys.argv[1])

variables = []

def storeLine(line):
    variables.append(line)

f = None
scope = re.compile("$scope*")
try:
    f= open(fileString, 'r')
    for line in f:
        if scope.match(line):
            print("found")
            storeLine(line)
            variables.append(line)
except:
    print("error")
finally:
     if f != None:
        f.close()
