#!/usr/bin/python
print "Content-Type: application/json"
print ""

import cgitb
import cgi
import urllib

cgitb.enable()

form = cgi.FieldStorage()

line = cgi.escape(form.getfirst('line', ""))
callback = form.getfirst('callback', "")

if line and line.lower() in ['red', 'blue', 'orange']:
    f = urllib.urlopen('http://developer.mbta.com/Data/'+line+'.json')
    json = f.read()
    if callback:
        print '%s(%s)' % (callback, json)
    else:
        print json
