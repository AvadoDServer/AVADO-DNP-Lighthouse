import xmlrpclib
server = xmlrpclib.Server('http://localhost:5555/RPC2')
# server.login("username","password")

# print(server.supervisor.getState())
print(server.system.listMethods())

# print(server.system.readLog())
print(server.supervisor.getState())
print(server.system.listMethods())
print(server.supervisor.getAllProcessInfo())
# print(server.supervisor.stopProcess("lighthouse-bn"))
print(server.supervisor.startProcess("lighthouse-bn"))