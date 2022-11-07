//
// Created by Roland on 06/11/2022.
//

#ifndef PARSER_CIFF_H
#define PARSER_CIFF_H


#include <string>
#include <vector>

struct CIFF {

    // header
    unsigned long long header_size;
    unsigned long long content_size;
    unsigned long long width;
    unsigned long long height;

    // content
    std::vector<uint8_t> image_data;
};


#endif //PARSER_CIFF_H
