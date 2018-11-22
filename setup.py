#/usr/bin/python3
import subprocess
import os

"""
    The goal of this script is to automate the Dev Environment for a Windows-based Computer
    1. Install Chocolatey
    1. Download and install Python3 and Git Manually using Chocolatey
    3. Clone Github Repository with Git
    4. Run Python script
    5. Download and Install all dev apps using Choco
    6. 

"""

def main():
    # python_setup()
    # chocolatey_setup()
    # git_setup()
    # nodejs_setup()
    # react_setup()
    # go_setup()
    github_clone()
    # print("Hello World")

def github_clone():
    path = "C:\\Users\\test\\go\\test_src2"
    try:
        os.mkdir(path)
        os.chdir(path)
        subprocess.call(['git','clone','https://github.com/ncmd/cavalry.git'])
    except OSError:
        print("Creation of the directory %s failed" % path)
        return False
    else:
        return True

def chocolatey_setup():
    # Install Apps with Choco
    subprocess.call(['choco','install','googlechrome','golang','heroku-cli','nodejs','yarn','vscode','sublimetext3','keepass','-y'])
    subprocess.call(['refreshenv'])

def python_setup():
    # Checking Python Version 3.7.1 as default version
    pythonVersion = os.popen('python --version').read()
    if pythonVersion == 'Python 3.7.1\n':
        print("System is using correct Python Version 3.7.1")
        return True
    # Install pytlint package  
    subprocess.call(['python','-m','pip','install','-U','pylint','--user'])

def git_setup():
    subprocess.call(['git','config','--global','core.autocrlf','false'])

def nodejs_setup():
    subprocess.call(['npm','install','-g','concurrently','cross-var',\
        'cross-env','firebase-tools','npm-run-all'], shell=True)

def react_setup():
    subprocess.call(['npm','run','first-setup-react-all-x'], shell=True)

def go_setup():
    subprocess.call(['npm','run','first-setup-go-all-x'], shell=True)

if __name__ == '__main__':
    main()