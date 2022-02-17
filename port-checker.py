import os
import sys
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(("127.0.0.1", 3000))
except socket.error as e:
        os.system('sudo kill -9 $(sudo lsof -t -i:3000) && pm2 delete ronia')
        print(e.errno)
        sys.exit(0)

s.close()