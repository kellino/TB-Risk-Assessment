#!usr/bin/env python
## simple python script to lift all the $scopes and vars from a .js file

import sys
import re

fileString = str(sys.argv[1])

variables = set()

variables.add(sys.argv[1] + "\n")

def storeLine(variable):
    variables.add(variable)

f = None
scope = re.compile("\$scope\.[^()\t\n,\[\]\. ]+ ")
var_list = re.compile("var [a-zA-Z0-9]+ ")
session = re.compile("sessionStorage\.[^()\t\n,\[\]\. ]+ ")
local = re.compile("localStorage\.[^()\t\n,\[\]\. ]+ ")
try:
    f= open(fileString, 'r')
    for line in f:
        foundScope = re.search(scope, line)
        foundVar = re.search(var_list, line)
        foundSession = re.search(session, line)
        foundLocal = re.search(local, line)
        if foundScope:
            storeLine(foundScope.group(0))
        elif foundVar:
            storeLine(foundVar.group(0))
        elif foundSession:
            storeLine(foundSession.group(0))
        elif foundLocal:
            storeLine(foundLocal.group(0))
except:
    print("file not found")
finally:
     if f != None:
        f.close()

for variable in variables:
    print(variable)
