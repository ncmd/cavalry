#!/usr/bin/python3

import unittest
from setup import github_clone, chocolatey_setup, python_setup, git_setup, nodejs_setup, react_setup, go_setup

class test_setup(unittest.TestCase):
    def test_git_clone(self):
        self.assertEqual(github_clone(), True)

if __name__ == '__main__':
    unittest.main()