#/usr/bin/python3
import subprocess
import os

"""
The goal: Automate the Dev Environment for a Windows Computer
"""

def main():
    python_setup()
    github_clone()
    chocolatey_setup()
    git_setup()
    nodejs_setup()
    react_setup()
    go_setup()
    freefilesync_setup()
    # print("Hello World")

def github_clone():
    path = "C:\\Users\\test\\go\\src"
    project_path = "C:\\Users\\test\\go\\src\\cavalry"
    try:
        os.mkdir(path)
        os.makedirs(path)
    except OSError:
        pass
    try:
        os.chdir(path)
    except  OSError:
        pass
    try:
        subprocess.call(['git','clone','https://github.com/ncmd/cavalry.git'])
    except OSError:
        print("Git Clone failed")
        os.chdir(project_path)
        return False
    else:
        os.chdir(project_path)
        return True

def chocolatey_setup():
    # Install Apps with Choco
    try:
        subprocess.call(['choco','install','golang','heroku-cli','nodejs',\
            'yarn','vscode','sublimetext3','keepass',\
            '-y'])
        subprocess.call(['refreshenv'])
    except OSError:
        return False
    else:
        return True
    

def python_setup():
    # Checking Python Version 3.7.1 as default version
    try:
        pythonVersion = os.popen('python --version').read()
        if pythonVersion == 'Python 3.7.1\n':
            print("System is using correct Python Version 3.7.1")
            # Install pytlint package  
            subprocess.call(['python','-m','pip','install','-U','pylint',\
                '--user'])
            subprocess.call(['python','-m','pip','install','--upgrade','pip'])   
    except OSError:
        return False
    else:
        return True
    

def git_setup():
    try:
        subprocess.call(['git','config','--global','core.autocrlf','false'])
    except OSError:
        return False
    else:
        return True
    

def nodejs_setup():
    try:
        subprocess.call(['npm','install','-g','concurrently','cross-var',\
        'cross-env','firebase-tools','npm-run-all'], shell=True)
    except OSError:
        return False
    else:
        return True

def react_setup():
    try:
        subprocess.call(['npm','run','first-setup-react-all-x'], shell=True)
    except OSError:
        return False
    else:
        return True
    

def go_setup():
    try:
        subprocess.call(['npm','run','first-setup-go-all-x'], shell=True)
    except OSError:
        return False
    else:
        return True

def freefilesync_setup():
    try:
        subprocess.call(['C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\powershell.exe',
            'Register-ScheduledTask','-Xml','(get-content \'C:\\Users\\test\\go\\src\\cavalry\Task_Scheduler_FreeFileSync.xml\' | out-string)'\
            '-TaskName','Task_Scheduler_FreeFileSync'], shell=True)
    except OSError:
        return False
    else:
        return True
    
    

if __name__ == '__main__':
    main()