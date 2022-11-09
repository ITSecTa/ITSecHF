cmake_minimum_required(VERSION 3.16)
project(parser)

if (CMAKE_CXX_COMPILER_ID STREQUAL "GNU") 
    add_compile_options(-fstack-protector-all -D_FORTIFY_SOURCE=2 -O2 -fPIE -Wall)
    add_link_options(-fstack-protector)
endif()

set(CMAKE_CXX_STANDARD 17)

add_executable(parser main.cpp CAFF.h CIFF.h CaffParser.cpp CaffParser.h bitmap_image.hpp)
