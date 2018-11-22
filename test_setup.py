#!/usr/bin/python3
import unittest
from setup import github_clone,chocolatey_setup,python_setup,git_setup,nodejs_setup,react_setup,go_setup,freefilesync_setup

class test_setup(unittest.TestCase):

    def test_github_clone(self):
        self.assertEqual(github_clone(), True)
    def test_chocolatey_setup(self):
        self.assertEqual(chocolatey_setup(), True)
    def test_python_setup(self):
        self.assertEqual(python_setup(), True)
    def test_git_setup(self):
        self.assertEqual(git_setup(), True)
    def test_nodejs_setup(self):
        self.assertEqual(nodejs_setup(), True)
    def test_react_setup(self):
        self.assertEqual(react_setup(), True)
    def test_go_setup(self):
        self.assertEqual(go_setup(), True) 
    def test_freefilesync_setup(self):
        self.assertEqual(freefilesync_setup(), True)

if __name__ == '__main__':
    unittest.main()