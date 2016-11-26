# -*- coding: utf-8 -*-
"""
Created on Sat Nov 26 14:58:25 2016

@author: prati
"""

# DigitalOcean's APIs

import digitalocean
manager = digitalocean.Manager(token="e03c0b7b1024e0ef23af571531ca12d1309ab7c8d0cccddf399644b7d6a38735")

droplets = manager.get_all_droplets()
print droplets 

for droplet in droplets:
    print droplet
    
droplet.get_actions()
#
#actions = droplet.get_actions()
#for action in actions:
#    action.load()
#    # Once it shows complete, droplet is up and running
#    print action.status