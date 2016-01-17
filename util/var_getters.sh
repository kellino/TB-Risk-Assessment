#!/bin/zsh

my_function() {
    for arg in "${commandline_args[@]}"; do
        python getVars.py $arg | sort >> variables.txt
    done
}

commandline_args=("$@")
my_function

