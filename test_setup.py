#!/usr/bin/python3
import unittest
from setup import github_clone

class test_setup(unittest.TestCase):
    def test_git_clone(self):
        self.assertEqual(github_clone(), True)
# def main():
#     print(github_clone())

if __name__ == '__main__':
    unittest.main()
    # main()