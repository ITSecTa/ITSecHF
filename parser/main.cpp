#include <iostream>
#include "CaffParser.h"

int main(int argv, const char *argc[]) {

    if (argv < 2) {
        std::cout << "Missing input file!" << std::endl;
        return -1;
    }

    try {

        const std::string file{argc[1]};
        auto caff = CaffParser::parse_caff(file);
        auto ciff = CaffParser::create_valid_ciff(caff);

        // TODO generate image from CIFF

    } catch (const std::exception &e) {
        std::cerr << e.what() << std::endl;
        return -1;
    }

    return 0;
}
