//
// Created by Roland on 06/11/2022.
//

#ifndef PARSER_CAFFPARSER_H
#define PARSER_CAFFPARSER_H

#include <filesystem>
#include "CAFF.h"
#include "CIFF.h"
#include "bitmap_image.hpp"

class CaffParser {
private:
    static unsigned long long bytes_to_long(const std::vector<uint8_t>& bytes);
    static bool is_content_size_valid(unsigned long long ciff_data_size, const CIFF& ciff) ;
public:
    static std::vector<CAFF::Block> parse_caff(const std::filesystem::path& path);
    static CIFF create_valid_ciff(const std::vector<CAFF::Block>& blocks);
    static bitmap_image get_caff_preview(CIFF ciff);
    static void save_caff_preview(const CIFF& ciff, const std::string& filename) ;
};


#endif //PARSER_CAFFPARSER_H
