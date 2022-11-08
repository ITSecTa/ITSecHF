//
// Created by Roland on 06/11/2022.
//

#include <string>
#include <fstream>
#include "CaffParser.h"

std::vector<CAFF::Block> CaffParser::parse_caff(const std::filesystem::path &path) {
    std::vector<CAFF::Block> blocks{};

    if (path.extension() != ".caff") {
        throw std::runtime_error("That's not a CAFF file!");
    }

    if (!std::filesystem::exists(path)) {
        throw std::runtime_error("No such file!");
    }

    std::ifstream file{path, std::ios::binary | std::ios::in};
    std::vector<uint8_t> caff{std::istreambuf_iterator<char>(file), {}};

    while (!caff.empty()) {
        if (caff.size() < 1 + 8) {
            throw std::runtime_error("Block too small!");
        }

        auto type = caff[0];
        std::vector<uint8_t> length_vector{caff.begin() + 1, caff.begin() + 9};
        auto block_size = bytes_to_long(length_vector);

        if (1 + 8 + block_size > caff.size()) {
            throw std::runtime_error("Block too big!");
        }

        std::vector<uint8_t> data{caff.begin() + 9, caff.begin() + 9 + block_size};

        blocks.emplace_back(type, block_size, data);

        if (type == 3) {
            break;
        }

        caff = {caff.begin() + 9 + block_size, caff.end()};
    }
    return blocks;
}

CIFF CaffParser::create_valid_ciff(const std::vector<CAFF::Block> &blocks) {

    if (blocks[0].type != 1) {
        throw std::runtime_error("Integrity check failure: incorrect first block");
    }

    unsigned long long header_animation_block_count = 0, actual_animation_block_count = 0;
    CIFF ciff{};

    for (const auto &block: blocks) {

        if (block.length != block.data.size()) {
            throw std::runtime_error("Integrity check failure: incorrect block size");
        }

        switch (block.type) {
            case 1: { // header
                if (std::vector<uint8_t>{block.data.begin(), block.data.begin() + 4} !=
                    std::vector<uint8_t>{'C', 'A', 'F', 'F'}) {
                    throw std::runtime_error("Integrity check failure: header block lacks magic");
                }
                header_animation_block_count = bytes_to_long(
                        std::vector<uint8_t>{block.data.begin() + 12, block.data.begin() + 20});
                break;
            }
            case 2: { // credits
                // nobody cares
                break;
            }
            case 3: { // animation

                // the first 8 bytes is the duration, we don't care about that
                auto ciff_data = std::vector<uint8_t>{block.data.begin() + 8, block.data.end()};

                if (std::vector<uint8_t>{ciff_data.begin(), ciff_data.begin() + 4} !=
                    std::vector<uint8_t>{'C', 'I', 'F', 'F'}) {
                    throw std::runtime_error("Integrity check failure: animation block lacks magic");
                }

                if (block.data.size() < 8 + 4 + 8 + 8 + 8 + 8) {
                    throw std::runtime_error("Integrity check failure: animation block too small");
                }

                ciff.header_size = bytes_to_long({ciff_data.begin() + 4, ciff_data.begin() + 12});
                ciff.content_size = bytes_to_long({ciff_data.begin() + 12, ciff_data.begin() + 20});
                ciff.width = bytes_to_long({ciff_data.begin() + 20, ciff_data.begin() + 28});
                ciff.height = bytes_to_long({ciff_data.begin() + 28, ciff_data.begin() + 36});

                if ((ciff_data.size() - ciff.header_size) % 3 != 0
                    || ciff.content_size % 3 != 0
                    || ciff.content_size != ciff.width * ciff.height * 3) {
                    throw std::runtime_error("Integrity check failure: content size invalid");
                }

                ciff.image_data = std::vector<uint8_t>{ciff_data.begin() + ciff.header_size, ciff_data.end()};

                actual_animation_block_count++;
                break;
            }
            default:
                throw std::runtime_error("Integrity check failure: invalid block type");
        }

        if (actual_animation_block_count > 0) {
            break;
        }
    }

    if ((header_animation_block_count == 0 && actual_animation_block_count != 0)
        || (header_animation_block_count != 0 && actual_animation_block_count == 0)) {
        throw std::runtime_error("Integrity check failure: invalid animation block count");
    }

    return ciff;
}

bitmap_image CaffParser::get_caff_preview(CIFF ciff) {
    bitmap_image image(ciff.width, ciff.height);
    image.clear();

    const auto pixel_count = ciff.content_size / 3;
    uint8_t red[pixel_count], green[pixel_count], blue[pixel_count];

    int px = 0;
    for (int i = 0; i < ciff.content_size; i += 3) {
        red[px]     = ciff.image_data[i];
        green[px]   = ciff.image_data[i + 1];
        blue[px]    = ciff.image_data[i + 2];
        px++;
    }

    image.import_rgb(red, green, blue);

    return image;
}

void CaffParser::save_caff_preview(CIFF ciff, const std::string& filename) {
    bitmap_image image = CaffParser::get_caff_preview(ciff);
    image.save_image(filename);
}

unsigned long long CaffParser::bytes_to_long(const std::vector<uint8_t> &bytes) {
    unsigned long long value = 0;
    for (size_t i = bytes.size(); i-- > 0;) {
        value = value << 8;
        value |= bytes[i];
    }
    return value;
}
