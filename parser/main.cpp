#include <iostream>
#include "CaffParser.h"

int main(int argc, const char *argv[]) {

    if (argc < 2) {
        std::cout << "Missing input file!" << std::endl;
        std::cout << "Usage: parser.exe [input_caff_path] [output_bmp_ath]\n" << 
        "\tinput_caff_path:\t\tThe filepath to the input .caff file.\n" << 
        "\toutput_bmp_path:\t\t(optional) The filepath of the generated .bmp preview image. Defaults to \"output.bmp\"." << std::endl;
        return -1;
    }

    try {

        const std::string file{argv[1]};
        auto caff = CaffParser::parse_caff(file);
        auto ciff = CaffParser::create_valid_ciff(caff);

        if (argc >= 3) {
            std::string outfile{argv[2]};
            if (outfile.find_last_of('.') == std::string::npos || outfile.substr((outfile.find_last_of('.'))) != ".bmp") {
                outfile.append(".bmp");
            }
            CaffParser::save_caff_preview(ciff, outfile);
        } else {
            CaffParser::save_caff_preview(ciff, "output.bmp");
        }
        
    } catch (const std::exception &e) {
        std::cerr << e.what() << std::endl;
        return -1;
    }

    return 0;
}
