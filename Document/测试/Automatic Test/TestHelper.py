import time
import os

class Test():
	def __init__(self):
		self._ok = self._error = 0
		self._fileName = time.strftime("%Y%m%d%H%M%S")+".txt";
		self._file = open(self._fileName, 'w');
		
	def equal(self, expection, trueth, name):
		if(expection == trueth):
			self._file.writelines(u'Case '+ name + u' succuss!\n')
			self._ok += 1
		else:
			self._file.writelines(u'Case '+ name + u' failed!\n')
			self._error += 1
			self._file.writelines(u'--------Expection '+ expection + u'\n')
			self._file.writelines(u'-----------Trueth '+ trueth + u'\n')
	def ok(self, result, name):
		if(result):
			self._file.writelines(u'Case '+ name + u' succuss!\n')
			self._ok += 1
		else:
			self._file.writelines(u'Case '+ name + u' failed!\n')
			self._error += 1
	
	def complete(self):
		self._file.writelines(u'\n\n\nsuccuss :'+ str(self._ok) + '\n')
		self._file.writelines(u'failed :'+ str(self._error) + '\n')
		self._file.writelines(u'percent :'+ str(self._ok/(self._error + self._ok)*100) + '%\n')
		self._file.close()
		os.system(self._fileName)
