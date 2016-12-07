chcp 65001

echo on
echo start...
echo Installing packages with npm...
call npm install --color=false

echo
echo Running grunt...
grunt --no-color

echo suucess

echo off
