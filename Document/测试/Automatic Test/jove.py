from selenium import webdriver
import TestHelper
import time 
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

test = TestHelper.Test()
driver = webdriver.Chrome()
loginUrl = "http://172.16.168.205:9021/login.aspx"
indexUrl = "http://172.16.168.205:9021/index.aspx"

def S(selector):
	return driver.find_element_by_css_selector(selector)

def login():
	driver.get(loginUrl)
	S("#userName").send_keys("zjm")
	S("#pwd").send_keys("zjm")
	S("#btn").click()
   
	
def loginTest():
	#正确用户名密码登录
	driver.get(loginUrl)
	time.sleep(1)
	S("#userName").send_keys("zxl")
	S("#pwd").send_keys("zxl")
	S("#btn").click()
	time.sleep(3)
	test.equal(indexUrl,driver.current_url, u'正确密码登录') 
	
	#错误密码登录
	#driver.execute_script("window.location.href = 'http://172.16.168.205:9021/login.aspx'")
	driver.get(loginUrl)
	time.sleep(1)
	S("#userName").send_keys("zxl")
	S("#pwd").send_keys("123")
	S("#btn").click()
	time.sleep(3)
	test.ok(driver.current_url != indexUrl, u'错误密码登录')
	print(driver.current_url!= indexUrl)
	test.equal('Invalid Username or Password！', S("#defeat").text, u'错误密码提示')
	
def page_turn():
    nowhandle=driver.current_window_handle
    allhandles=driver.window_handles
    for handle in allhandles:
        if handle != nowhandle:
            driver.switch_to_window(handle)
			
def save_edl():
    login()#登录
    S("#roughCutBtn").click()#点击Web Quick Editing
    time.sleep(5)
    page_turn()#页面跳转
    S("#h5-tb-btn-text > div").click()#点击Add Subtitle
    time.sleep(3)
    S(".divdiv").click()#点击保存按钮
    time.sleep(3)
    S(".edl").click()#点击Save as new Edl 
    time.sleep(3)
    S(".treediv4 [data-guid=dd65d862701442bb9f5a7af921367eb6]").click()	#选择保存路径
    time.sleep(3)
    S(".ok").click()#点击Confirm
	
def add_to_tinmeline():
    login()
    #全屏
    driver.maximize_window()
    time.sleep(3)
    S("#roughCutBtn").click()
    time.sleep(5)
    page_turn()
    time.sleep(5)
    #双击Public Material
    ActionChains(driver).double_click(S("[data-guid=dd65d862701442bb9f5a7af921367eb6]")).perform()
    time.sleep(5)
    #双击zjm文件夹
    ActionChains(driver).double_click(S("[data-guid=ab5a92be385c4ee7b11d29e409641182]")).perform()
    time.sleep(5)
    #双击素材DBE
    ActionChains(driver).double_click(S("[data-id=edcb12f9153e40f691c61c5aad623e4c]")).perform()
    time.sleep(3)
    #切换到SV窗口（进入下一级）
    driver.switch_to.frame("previewifm")
    #点击Add to timeline
    S("#vide-AddToTimeline").click()
    time.sleep(1)
    #切换到MV窗口（返回上一级）
    driver.switch_to.default_content()
    S("#mv").click()
    time.sleep(1)
	#点击Home键
    ActionChains(driver).key_down(Keys.HOME).key_up(Keys.HOME).perform()
	#点击Space键
    S("body").send_keys(Keys.SPACE)
	
#login()	
#loginTest()
#save_edl()
add_to_tinmeline()
test.complete()
driver.quit()

