//
// Created by Roland on 06/11/2022.
//

#ifndef PARSER_CAFF_H
#define PARSER_CAFF_H


#include <vector>

struct CAFF {
    struct Block {
        char type;
        unsigned long long length;
        std::vector<uint8_t> data;

        Block(char type, unsigned long long length, std::vector<uint8_t> data) :
                type(type), length(length), data(std::move(data)) {}
    };

    std::vector<Block> blocks;
};


#endif //PARSER_CAFF_H
