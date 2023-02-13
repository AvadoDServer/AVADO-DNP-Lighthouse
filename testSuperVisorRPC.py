import xmlrpclib
server = xmlrpclib.Server('http://lighthouse.my.ava.do:5556/RPC2')
# server.login("username","password")

# print(server.supervisor.getState())
print(server.system.listMethods())

# print(server.system.readLog())
print(server.supervisor.getState())
print(server.system.listMethods())
print(server.supervisor.getAllProcessInfo())
# print(server.supervisor.stopProcess("lighthouse"))
print(server.supervisor.startProcess("lighthouse"))