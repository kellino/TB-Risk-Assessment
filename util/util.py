#!/usr/bin/env python3

# simple utility script to convert the tst3d table.js file into something more human readable and
# maintainable

def reformat(line, i):
    temp = line.split("|")
    country = temp[3].split(",")
    newString = "{id: " + str(i) + ", small: " + temp[0][1:] + ", med: " + temp[1] + ", smear: " + temp[2] + ", name: " + '"' + country[0] + '},\n'
    print(newString)
    return newString

array = []

f = None
try:
    f= open("www/js/table.js", 'r')
    for i, line in enumerate(f):
        line.lstrip()
        if line[0] == '\"':
            array.append(reformat(line, i))
        else:
            array.append(line)
except:
    print("error")
finally:
    if f != None:
        f.close()

for i in range (0, len(array)):
    print(array[i])

nf = None
try:
    nf = open("data.js", "w")
    for i in range (0, len(array)):
        nf.write(array[i])
except:
    print("unable to open file")
finally:
    if nf != None:
        nf.close()
