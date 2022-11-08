//
// Created by Roland on 06/11/2022.
//

#ifndef PARSER_CAFFPARSER_H
#define PARSER_CAFFPARSER_H

#include <filesystem>
#include "CAFF.h"
#include "CIFF.h"

class CaffParser {
private:
    static unsigned long long bytes_to_long(const std::vector<uint8_t>& bytes);
public:
    static std::vector<CAFF::Block> parse_caff(const std::filesystem::path& path);
    static CIFF create_valid_ciff(const std::vector<CAFF::Block>& blocks);
};


#endif //PARSER_CAFFPARSER_H
