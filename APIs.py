# -*- coding: utf-8 -*-
"""
Created on Sat Nov 26 14:58:25 2016

@author: prati
"""

# DigitalOcean's APIs

import digitalocean
manager = digitalocean.Manager(token="e03c0b7b1024e0ef23af571531ca12d1309ab7c8d0cccddf399644b7d6a38735")



## Information abput each droplet
#for droplet in droplets:
#    print "#" * 15
#    print "Droplet ID: %s" % droplet.id 
#    print "Droplet name: %s" % droplet.name
#    
#droplet.get_actions()

def print_info():
    print "**getting info about all droplets**"
    droplets = manager.get_all_droplets()
    print "Droplet count: %d \n" % len(droplets)
    for droplet in droplets:
        print "Droplet ID: %s" % droplet.id 
        print "Droplet name: %s" % droplet.name


def delete_droplet(droplet_to_delete_id):
    # Delete a droplet
    #droplet_to_delete_id = input("Enter the ID of the droplet you wsih to delete: ")
    print "**Getting all droplets**"
    droplets = manager.get_all_droplets()
    for droplet in droplets:
        if droplet.id == droplet_to_delete_id:
            print "About to destroy droplet with id %s and name %s" % (droplet.id, droplet.name)
            droplet.destroy()
            print "Droplet destroyed!"
     
print_info()
droplet_to_delete_id = input("Enter the ID of the droplet you wish to delete: ")
delete_droplet(droplet_to_delete_id)
print_info()