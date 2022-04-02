from inspect import isgenerator
from os import pread
from Crypto.Util.number import *
from random import randrange

def isGeneratorPrime(g,n):
    s = set()
    for i in range(1,5*n):
        s.add(pow(g,i,n))
        if(s.__len__() == n-1): 
            return True
    
    # print(g,n,s.__len__())
    return s.__len__() == n-1

primes = set()


while(primes.__len__() <= 1000):
    p = getPrime(randrange(1,100000)%12+2)
    # print(p)
    primes.add(p)

pp = []
for i in primes:
    pp.append(i)

print("[")
for x in pp:
    print(x,',',end='')
    print("")

print("]")