cmake_minimum_required(VERSION 3.22)
project(parser)

set(CMAKE_CXX_STANDARD 17)

add_executable(parser main.cpp CAFF.h CIFF.h CaffParser.cpp CaffParser.h)
